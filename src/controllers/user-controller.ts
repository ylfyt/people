import express from 'express';
import { UserClaim } from '../dtos/claim.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';
import { prisma } from '../prisma.js';
import { sendErrorResponse, sendSuccessResponse } from '../helper/send-response.js';
import multer from 'multer';
import { ZOD_USER_UPDATE, ZOD_USER_UPDATE_ADMIN } from '../zods/zod-user-update.js';
import { getFileExtension } from '../helper/get-file-extension.js';
import { saveFile } from '../helper/save-file.js';
import { STATIC_DIR, TOKEN_EXPIRY } from '../contants.js';
import { ZOD_USER_CHANGE_PASSWORD } from '../zods/zod-user-change-password.js';
import bcrypt from 'bcrypt';
import { ZOD_USER_LOGIN } from '../zods/zod-user-login.js';
import { UserLoginDto } from '../dtos/login.js';
import { generateJwtToken } from '../helper/generate-jwt.js';
import { ENV } from '../helper/env.js';
import { ZOD_USER_REGISTER } from '../zods/zod-user-register.js';
import { UserRole } from '@prisma/client';

const upload = multer();
const app = express.Router();

export { app as userController };

app.get("/", authMiddleware("ADMIN"), async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });
        users.forEach(el => {
            el.password = "";
        });
        sendSuccessResponse(res, users);
    } catch (error) {
        console.log("error", error);
        sendErrorResponse(res, 500, "Internal server error");
    }
});

app.get("/me", authMiddleware(), async (req, res) => {
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

app.post("/logout", authMiddleware(), async (req, res) => {
    const claim = res.locals.claim as UserClaim;
    console.log("logout", claim);
    sendSuccessResponse(res, true);
});

app.put("/:id", authMiddleware(), upload.single("picture"), async (req, res) => {
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
            const success = saveFile(req.file, STATIC_DIR, filename);
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

app.put("/:id/admin", authMiddleware("ADMIN"), upload.single("picture"), async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const body = ZOD_USER_UPDATE_ADMIN.safeParse(JSON.parse(req.body.data ?? '{}'));
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
            const success = saveFile(req.file, STATIC_DIR, filename);
            if (!success) {
                sendErrorResponse(res, 500, "Internal server error");
                return;
            }
            picturePath = `${STATIC_DIR}/${filename}`;
        }
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                ...body.data,
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


app.put("/:id/change-password", authMiddleware(), async (req, res) => {
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
        const isAdmin = req.query.role === UserRole.ADMIN;
        if (isAdmin && user.role !== UserRole.ADMIN) {
            sendErrorResponse(res, 403, "Forbidden");
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
            id: user.id,
            role: user.role
        }, ENV.JWT_SECRET_KEY);
        user.password = "";
        sendSuccessResponse<UserLoginDto>(res, { duration: TOKEN_EXPIRY, user, token: token });
        return;
    } catch (error) {
        console.log('error', error);
        sendErrorResponse(res, 500, "Internal server error");
    }
});

app.post("/", authMiddleware("ADMIN"), upload.single("picture"), async (req, res) => {
    try {
        const payload = ZOD_USER_REGISTER.safeParse(JSON.parse(req.body.data ?? '{}'));
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
        const success = saveFile(req.file, STATIC_DIR, filename);
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

app.delete("/:id", authMiddleware("ADMIN"), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            sendErrorResponse(res, 400, "Invalid id");
            return;
        }
        const claim = res.locals.claim as UserClaim;
        if (claim.id === id) {
            sendErrorResponse(res, 400, "Cannot delete your self");
            return;
        }

        const user = await prisma.user.findFirst({
            where: { id }
        });
        if (!user) {
            sendErrorResponse(res, 404, "User not found");
            return;
        }
        await prisma.user.delete({
            where: { id },
        });
        sendSuccessResponse(res, true);
    } catch (error) {
        console.log("error", error);
        sendErrorResponse(res, 500, "Internal server error");
    }
});