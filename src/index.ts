import express, { Request, Response } from 'express';
import cors from 'cors';
import { STATIC_DIR } from './contants.js';
import { userController } from './controllers/user-controller.js';
import { ENV } from './helper/env.js';
import { presenceController } from './controllers/presence-controller.js';
import path from 'path';
import fs from 'fs';
import { prisma } from './prisma.js';

const MAIN_STATIC_DIR = !ENV.IS_PROD ? "next-main/dist" : "dist-ui";
const ADMIN_STATIC_DIR = !ENV.IS_PROD ? "next-admin/dist" : "dist-admin";

const spaHandler = (staticDir: string, basePath: string) => {
    const escapedBasePath = basePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`^${escapedBasePath}`);

    return async (req: Request, res: Response) => {
        const target = path.join(staticDir, req.path.replace(regex, ""));
        let isExist = true;
        let isDirectory = false;
        try {
            const t = fs.statSync(target);
            isDirectory = t.isDirectory();
            if (isDirectory) {
                const stat = fs.statSync(path.join(target, "index.html"));
                if (stat.isFile()) {
                    res.sendFile(path.join(process.cwd(), target, "index.html"));
                    return;
                }
            }
        } catch (error) {
            isExist = false;
        }
        if (!isExist || isDirectory) {
            res.sendFile(path.join(process.cwd(), staticDir, "index.html"));
            return;
        }
        res.sendFile(path.join(process.cwd(), target));
    };
};

const initUser = async () => {
    try {
        const anyAdmin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
        if (anyAdmin) {
            return;
        }
        const user = await prisma.user.create({
            data: {
                email: "admin@example.com",
                name: "Admin Example",
                password: "$2a$10$9vmoD394c9tU.1sfUz3pEuWqW.lfss9TtF9IUpIbp2cCib4mIeviG", // 123123
                phone: "+6212345678901",
                position: "DEVELOPER",
                profil_pic_url: "",
                role: "ADMIN",
            }
        });
        user.password = "123123";
        console.log("USER SAMPLE===========", user);
    } catch (error) {
        console.log("ERROR", error);
    }
};

const main = async () => {
    await initUser();

    const app = express();

    app.use(cors({ origin: "*" }));
    app.use("/api/uploads", express.static(STATIC_DIR));
    app.use(express.json());

    app.get('/api', (req, res) => {
        res.send('Hello World!');
    });

    app.use("/api/user", userController);
    app.use("/api/presence", presenceController);

    if (ENV.ADMIN_BASE_PATH.length > 1)
        app.get(`${ENV.ADMIN_BASE_PATH}*`, spaHandler(ADMIN_STATIC_DIR, ENV.ADMIN_BASE_PATH));
    app.get('*', spaHandler(MAIN_STATIC_DIR, ""));

    console.log(ENV);

    app.listen(ENV.PORT || 4000, () => {
        console.log(`App listening on port ${ENV.PORT || 4000}`);
    });
};

main();
