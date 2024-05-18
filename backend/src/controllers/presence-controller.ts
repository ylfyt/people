import express from 'express';
import { authMiddleware } from '../middlewares/auth-middleware.js';
import { UserClaim } from '../dtos/claim.js';
import { prisma } from '../prisma.js';
import { sendErrorResponse, sendSuccessResponse } from '../helper/send-response.js';
import { PresenceType } from '@prisma/client';
import { LastPresenceDto } from '../dtos/presence.js';

const app = express.Router();

export { app as presenceController };

app.get("/last", authMiddleware, async (req, res) => {
    try {
        const claim = res.locals.claim as UserClaim;
        const presences = await prisma.presence.findMany({
            where: {
                userId: claim.id,
                createdAt: {
                    lt: new Date()
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 2
        });
        if (presences.length > 0 && presences[0].type === "EXIT" && !isSameDate(presences[0].createdAt, new Date())) {
            sendSuccessResponse<LastPresenceDto>(res, {});
            return;
        }
        const response: LastPresenceDto = {
            enterDate: presences.length == 2 ? presences[1].createdAt : presences.length === 1 ? presences[0].createdAt : undefined,
            exitDate: presences.length == 2 ? presences[0].createdAt : undefined
        };
        sendSuccessResponse(res, response);
    } catch (error) {
        console.log("error", error);
        sendErrorResponse(res, 500, "Internal server error");
    }
});

app.post("/", authMiddleware, async (req, res) => {
    try {
        const type: string = req.body.type ?? '';
        if (!Object.keys(PresenceType).includes(type)) {
            sendErrorResponse(res, 400, "invalid type");
            return;
        }
        const claim = res.locals.claim as UserClaim;
        const isEnter = type === PresenceType.ENTER;
        const lastPresence = await prisma.presence.findMany({
            where: {
                userId: claim.id,
                createdAt: {
                    lt: new Date()
                }
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 2
        });
        if (!lastPresence[0]) {
            if (!isEnter) {
                sendErrorResponse(res, 400, "invalid type");
                return;
            }
            const newPresense = await prisma.presence.create({
                data: {
                    userId: claim.id,
                    type: "ENTER"
                }
            });
            sendSuccessResponse(res, newPresense);
            return;
        }
        if (lastPresence[0].type === type) {
            sendErrorResponse(res, 500, `already ${type.toLowerCase()}`);
            return;
        }
        if (lastPresence.length === 2 && isSameDate(lastPresence[1].createdAt, new Date())) {
            sendErrorResponse(res, 500, `cannot ${type.toLowerCase()} in same date`);
            return;
        }

        const newPresense = await prisma.presence.create({
            data: {
                userId: claim.id,
                type: isEnter ? "ENTER" : "EXIT"
            }
        });
        sendSuccessResponse(res, newPresense);
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