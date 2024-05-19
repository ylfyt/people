import { NextFunction, Request, Response } from 'express';
import { sendErrorResponse } from '../helper/send-response.js';
import { UserClaim } from '../dtos/claim.js';
import jwt from 'jsonwebtoken';
import { ENV } from '../helper/env.js';
import { UserRole } from '@prisma/client';

function parsetJwtToken(token: string): UserClaim | undefined {
    try {
        const res = jwt.verify(token, ENV.JWT_SECRET_KEY);
        if (typeof res === "string") {
            console.log(res, token);
            return;
        }
        return res as UserClaim;
    } catch (error) {
        console.log("error", error, token);
        return;
    }
}

export const authMiddleware = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split("Bearer ")[1] ?? "";
        if (token === "") {
            sendErrorResponse(res, 401, "unauthorized");
            return;
        }
        const claim = parsetJwtToken(token);
        if (!claim) {
            sendErrorResponse(res, 401, "unauthorized");
            return;
        }
        if (roles.length > 0 && !roles.includes(claim.role)) {
            sendErrorResponse(res, 401, "unauthorized");
            return;
        }
        res.locals.claim = claim;
        next();
    };
};