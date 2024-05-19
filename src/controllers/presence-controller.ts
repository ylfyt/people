import express from 'express';
import { authMiddleware } from '../middlewares/auth-middleware.js';
import { UserClaim } from '../dtos/claim.js';
import { prisma } from '../prisma.js';
import { sendErrorResponse, sendSuccessResponse } from '../helper/send-response.js';
import { LastPresenceDto } from '../dtos/presence.js';
import { PresenceTypes } from '../types/presence-type.js';
import { Presence } from '@prisma/client';

const app = express.Router();

export { app as presenceController };

app.get("/", authMiddleware(), async (req, res) => {
    try {
        let start = !req.query.start?.length ? undefined : new Date(req.query.start as string);
        if (start && isNaN(start.getTime())) {
            start = undefined;
        }
        let end = !req.query.end?.length ? undefined : new Date(req.query.end as string);
        if (end && isNaN(end.getTime())) {
            end = undefined;
        }
        if (start && !end || !start && end) {
            sendErrorResponse(res, 400, "Start and end cannot empty");
            return;
        }
        const today = new Date();
        if (!start) start = new Date(today.getFullYear(), today.getMonth(), 1);
        if (!end) end = today;
        start.setHours(0, 0, 0, 0);
        end.setDate(end.getDate() + 1);
        end.setHours(0, 0, 0, 0);

        const claim = res.locals.claim as UserClaim;

        const allUser = req.query.allUser === "true";
        if (allUser && claim.role !== "ADMIN") {
            sendErrorResponse(res, 401, "unauthorized");
            return;
        }

        const presences = await prisma.presence.findMany({
            where: {
                userId: allUser ? undefined : claim.id,
                enterDate: {
                    gte: start
                },
                modifiedAt: {
                    lt: end
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
            orderBy: {
                modifiedAt: "desc"
            }
        });
        sendSuccessResponse(res, presences);
    } catch (error) {
        console.log("error", error);
        sendErrorResponse(res, 500, "Internal server error");
    }
});

app.get("/last", authMiddleware(), async (req, res) => {
    try {
        const claim = res.locals.claim as UserClaim;
        const presence = await prisma.presence.findFirst({
            where: {
                userId: claim.id,
            },
            orderBy: {
                modifiedAt: "desc"
            },
            take: 1
        });
        if (!presence || presence.exitDate != null && !isSameDate(presence.exitDate, new Date())) {
            sendSuccessResponse<LastPresenceDto>(res, {});
            return;
        }
        const response: LastPresenceDto = {
            enterDate: presence.enterDate,
            exitDate: presence.exitDate ?? undefined,
        };
        sendSuccessResponse(res, response);
    } catch (error) {
        console.log("error", error);
        sendErrorResponse(res, 500, "Internal server error");
    }
});

app.post("/", authMiddleware(), async (req, res) => {
    try {
        const type: string = req.body.type ?? '';
        if (!Object.keys(PresenceTypes).includes(type)) {
            sendErrorResponse(res, 400, "invalid type");
            return;
        }
        const claim = res.locals.claim as UserClaim;
        const lastPresence = await prisma.presence.findFirst({
            where: {
                userId: claim.id,
            },
            orderBy: {
                enterDate: "desc"
            },
            take: 1
        });
        if (!lastPresence) {
            if (type === PresenceTypes.EXIT) {
                sendErrorResponse(res, 400, "invalid type");
                return;
            }
            const newPresense = await prisma.presence.create({
                data: {
                    userId: claim.id,
                    enterDate: new Date(),
                    modifiedAt: new Date()
                }
            });
            sendSuccessResponse(res, newPresense);
            return;
        }
        if (lastPresence.exitDate != null && isSameDate(lastPresence.exitDate, new Date())) {
            // TODO: Handle this if can presence more than one in the same date
            sendErrorResponse(res, 400, "alreay presence today");
            return;
        }
        let updatedPresence: Presence;
        if (lastPresence.exitDate == null) {
            updatedPresence = await prisma.presence.update({
                where: { id: lastPresence.id },
                data: {
                    exitDate: new Date(),
                    modifiedAt: new Date()
                }
            });
        } else {
            updatedPresence = await prisma.presence.create({
                data: {
                    enterDate: new Date(),
                    userId: claim.id,
                    modifiedAt: new Date()
                }
            });
        }
        sendSuccessResponse(res, updatedPresence);
    } catch (error) {
        console.log("error", error);
        sendErrorResponse(res, 500, "Internal server error");
    }
});


function isSameDate(date1: Date, date2: Date) {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}