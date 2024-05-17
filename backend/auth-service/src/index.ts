
import { PrismaClient } from '@prisma/client';
import express from 'express';
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

const TOKEN_EXPIRY = 2 * 60 * 60;

function generateJwtToken(claim: UserClaim) {
    const token = jwt.sign(claim, 'your_secret_key', { expiresIn: TOKEN_EXPIRY });
    return token;
}


function saveFile(file: Express.Multer.File, filename: string) {
    try {
        const filePath = path.join(process.cwd(), './uploads/', filename);
        fs.writeFileSync(filePath, file.buffer);
        return true;
    } catch (error) {
        console.log('error', error);
        return false;
    }
}

const main = async () => {
    const app = express();
    const port = 3000;
    const upload = multer();
    const prisma = new PrismaClient();

    app.use(cors({ origin: "*" }));
    app.use(express.json());

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.post("/login", async (req, res) => {
        try {
            const body = ZOD_USER_LOGIN.safeParse(req.body);
            console.log(req.body);
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
                    profil_pic_url: `/upload/${filename}`,
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
