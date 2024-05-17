
import { PrismaClient } from '@prisma/client';
import express, { Response } from 'express';
import multer from 'multer';
import { ResponseDto } from './dtos/response.js';
import { z } from 'zod';
import path from 'path';
import fs from 'fs';
import { getFileExtension } from './helper/get-file-extension.js';
import bcrypt from 'bcrypt';

const sendErrorResponse = (res: Response, status: number, message: string) => {
    const response: ResponseDto = {
        success: false,
        message: message
    };
    res.status(status).json(response);
};

const sendSuccessResponse = (res: Response, data: any) => {
    const response: ResponseDto = {
        success: true,
        message: "",
        data
    };
    res.status(200).json(response);
};

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

const RegisterUserZod = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    position: z.string().min(1),
    phone: z.string().min(4),
    password: z.string().min(3).max(10)
});

const main = async () => {
    const app = express();
    const port = 3000;
    const upload = multer();
    const prisma = new PrismaClient();

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.post("/register", upload.single("picture"), async (req, res) => {
        try {
            const payload = RegisterUserZod.safeParse(JSON.parse(req.body.data));
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
        console.log(`Example app listening on port ${port}`);
    });
};

main();