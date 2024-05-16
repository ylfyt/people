
import express from 'express';

const main = async () => {
    const app = express();
    const port = 3000;

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
};

main();