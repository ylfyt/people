import express from 'express';
import cors from 'cors';
import { STATIC_DIR } from './contants.js';
import { userController } from './controllers/user-controller.js';
import { ENV } from './helper/env.js';
import { presenceController } from './controllers/presence-controller.js';
import path from 'path';
import fs from 'fs';

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

    app.get('*', async function (req, res) {
        const target = path.join('dist-ui', req.path);
        let isExist = true;
        let isDirectory = false;
        try {
            const t = fs.statSync(target);
            isDirectory = t.isDirectory();
        } catch (error) {
            isExist = false;
        }
        if (!isExist || isDirectory) {
            res.sendFile(path.join(process.cwd(), "dist-ui", "index.html"));
            return;
        }
        res.sendFile(path.join(process.cwd(), target));
    });

    app.listen(ENV.PORT || 4000, () => {
        console.log(`App listening on port ${ENV.PORT || 4000}`);
    });
};

main();
