import express from 'express';
import cors from 'cors';
import { STATIC_DIR } from './contants.js';
import { userController } from './controllers/user-controller.js';
import { ENV } from './helper/env.js';
import { presenceController } from './controllers/presence-controller.js';
import path from 'path';
import fs from 'fs';

const MAIN_STATIC_DIR = !ENV.IS_PROD ? "next-main/dist" : "dist-ui";
const ADMIN_STATIC_DIR = !ENV.IS_PROD ? "next-admin/dist" : "dist-admin";

const main = async () => {
    const app = express();

    app.use(cors({ origin: "*" }));
    app.use("/api/uploads", express.static(STATIC_DIR));
    app.use(express.json());

    app.get('/api', (req, res) => {
        res.send('Hello World!');
    });

    app.use("/api/user", userController);
    app.use("/api/presence", presenceController);

    // SPA Handler
    app.get('*', async function (req, res) {
        const target = path.join(MAIN_STATIC_DIR, req.path);
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
            res.sendFile(path.join(process.cwd(), MAIN_STATIC_DIR, "index.html"));
            return;
        }
        res.sendFile(path.join(process.cwd(), target));
    });

    console.log(ENV);

    app.listen(ENV.PORT || 4000, () => {
        console.log(`App listening on port ${ENV.PORT || 4000}`);
    });
};

main();
