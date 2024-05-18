
import { PrismaClient } from '@prisma/client';
import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getFileExtension } from './helper/get-file-extension.js';
import bcrypt from 'bcrypt';
import { UserLoginDto } from './dtos/login.js';
import { UserClaim } from './dtos/claim.js';
import jwt from 'jsonwebtoken';
import { ZOD_USER_LOGIN } from './zods/zod-user-login.js';
import { ZOD_USER_REGISTER } from './zods/zod-user-register.js';
import { sendErrorResponse, sendSuccessResponse } from './helper/send-response.js';
import cors from 'cors';
import { ZOD_USER_UPDATE } from './zods/zod-user-update.js';
import { ZOD_USER_CHANGE_PASSWORD } from './zods/zod-user-change-password.js';

const TOKEN_EXPIRY = 2 * 60 * 60;
const JWT_SECRET_KEY = 'your_secret_key';
const STATIC_DIR = "uploads";

function generateJwtToken(claim: UserClaim) {
    const token = jwt.sign(claim, JWT_SECRET_KEY, {});
    return token;
}

function parsetJwtToken(token: string): UserClaim | undefined {
    try {
        const res = jwt.verify(token, JWT_SECRET_KEY);
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


function saveFile(file: Express.Multer.File, filename: string) {
    try {
        const filePath = path.join(process.cwd(), `./${STATIC_DIR}/`, filename);
        fs.writeFileSync(filePath, file.buffer);
        return true;
    } catch (error) {
        console.log('error', error);
        return false;
    }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
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
    res.locals.claim = claim;
    next();
};

const main = async () => {
    const app = express();
    const port = 3000;
    const upload = multer();
    const prisma = new PrismaClient();

    app.use("/uploads", express.static(STATIC_DIR));
    app.use(cors({ origin: "*" }));
    app.use(express.json());

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.get("/me", authMiddleware, async (req, res) => {
        const claim = res.locals.claim as UserClaim;

        const user = await prisma.user.findFirst({ where: { id: claim.id } });
        if (!user) {
            console.log("user doesn't exist");
            sendErrorResponse(res, 401, "unauthorized");
            return;
        }
        user.password = "";
        sendSuccessResponse(res, user);
    });

    app.post("/logout", authMiddleware, async (req, res) => {
        const claim = res.locals.claim as UserClaim;
        console.log("logout", claim);
        sendSuccessResponse(res, true);
    });

    app.put("/user/:id", authMiddleware, upload.single("picture"), async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const claim = res.locals.claim as UserClaim;
            if (id !== claim.id) {
                sendErrorResponse(res, 401, "unauthorized");
                return;
            }

            const body = ZOD_USER_UPDATE.safeParse(JSON.parse(req.body.data));
            if (!body.success) {
                sendErrorResponse(res, 400, "Data is not valid");
                return;
            }

            const user = await prisma.user.findFirst({
                where: { id }
            });
            if (!user) {
                sendErrorResponse(res, 400, "User doesn't exist");
                return;
            }
            let picturePath = user.profil_pic_url;
            if (req.file) {
                const ACCEPTED_EXT = ["png", "jpg", "jpeg"];
                const ext = getFileExtension(req.file.originalname ?? '');
                if (!ACCEPTED_EXT.includes(ext)) {
                    sendErrorResponse(res, 400, "Invalid file type");
                    return;
                }
                const filename = `${user.email}_${new Date().getTime()}.${ext}`;
                const success = saveFile(req.file, filename);
                if (!success) {
                    sendErrorResponse(res, 500, "Internal server error");
                    return;
                }
                picturePath = `${STATIC_DIR}/${filename}`;
            }
            const updatedUser = await prisma.user.update({
                where: { id },
                data: {
                    phone: body.data.phone,
                    profil_pic_url: picturePath
                }
            });
            updatedUser.password = "";
            sendSuccessResponse(res, updatedUser);
        } catch (error) {
            console.log("error", error);
            sendErrorResponse(res, 500, "Internal server error");
        }
    });

    app.put("/user/:id/change-password", authMiddleware, async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const claim = res.locals.claim as UserClaim;
            if (id !== claim.id) {
                sendErrorResponse(res, 401, "unauthorized");
                return;
            }
            const body = ZOD_USER_CHANGE_PASSWORD.safeParse(req.body);
            if (!body.success) {
                console.log(body.error.errors);
                sendErrorResponse(res, 400, "Data is not valid");
                return;
            }
            const user = await prisma.user.findFirst({
                where: { id }
            });
            if (!user) {
                sendErrorResponse(res, 404, "User not found");
                return;
            }
            const valid = await bcrypt.compare(body.data.password, user.password);
            if (!valid) {
                console.log('invalid password');
                sendErrorResponse(res, 400, "invalid password");
                return;
            }
            const hashedPassword = await bcrypt.hash(body.data.newPassword, 10);
            const updatedUser = await prisma.user.update({
                where: { id },
                data: { password: hashedPassword }
            });
            updatedUser.password = "";
            sendSuccessResponse(res, updatedUser);
        } catch (error) {
            console.log("error", error);
            sendErrorResponse(res, 500, "Internal server error");
        }
    });

    app.post("/login", async (req, res) => {
        try {
            const body = ZOD_USER_LOGIN.safeParse(req.body);
            if (!body.success) {
                console.log(body.error.errors);
                sendErrorResponse(res, 400, "Payload is not valid");
                return;
            }
            const user = await prisma.user.findFirst({
                where: {
                    email: body.data.email,
                }
            });
            if (!user) {
                sendErrorResponse(res, 400, "Email or password is wrong");
                return;
            }
            const valid = await bcrypt.compare(body.data.password, user.password);
            if (!valid) {
                console.log('invalid password');
                sendErrorResponse(res, 400, "Email or password is wrong");
                return;
            }
            const token = generateJwtToken({
                email: user.email,
                id: user.id
            });
            user.password = "";
            sendSuccessResponse<UserLoginDto>(res, { duration: TOKEN_EXPIRY, user, token: token });
            return;
        } catch (error) {
            console.log('error', error);
            sendErrorResponse(res, 500, "Internal server error");
        }
    });

    app.post("/register", upload.single("picture"), async (req, res) => {
        try {
            const payload = ZOD_USER_REGISTER.safeParse(JSON.parse(req.body.data));
            if (!payload.success) {
                console.log(payload.error.errors);
                sendErrorResponse(res, 400, "Invalid data");
                return;
            }
            if (!req.file) {
                sendErrorResponse(res, 400, "Profile picture is required");
                return;
            }

            const userExist = await prisma.user.findFirst({ where: { email: payload.data.email } });
            if (userExist) {
                sendErrorResponse(res, 400, "User already exist");
                return;
            }
            const ACCEPTED_EXT = ["png", "jpg", "jpeg"];
            const ext = getFileExtension(req.file.originalname ?? '');
            if (!ACCEPTED_EXT.includes(ext)) {
                sendErrorResponse(res, 400, "Invalid file type");
                return;
            }
            const filename = `${payload.data.email}_${new Date().getTime()}.${ext}`;
            const success = saveFile(req.file, filename);
            if (!success) {
                sendErrorResponse(res, 500, "Internal server error");
                return;
            }

            const hashedPassword = await bcrypt.hash(payload.data.password, 10);
            const newUser = await prisma.user.create({
                data: {
                    ...payload.data,
                    password: hashedPassword,
                    profil_pic_url: `${STATIC_DIR}/${filename}`,
                }
            });
            newUser.password = "";
            sendSuccessResponse(res, newUser);
        } catch (error) {
            console.log('error', error);
            sendErrorResponse(res, 400, "Internal server error");
        }
    });

    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });
};

main();
