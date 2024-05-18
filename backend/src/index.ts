import express from 'express';
import cors from 'cors';
import { STATIC_DIR } from './contants.js';
import { userController } from './controllers/user-controller.js';
import { ENV } from './helper/env.js';


const main = async () => {
    const app = express();

    app.use(cors({ origin: "*" }));
    app.use("/api/uploads", express.static(STATIC_DIR));
    app.use(express.json());

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.use("/api/user", userController);

    app.listen(ENV.PORT || 4000, () => {
        console.log(`App listening on port ${ENV.PORT || 4000}`);
    });
};

main();
