import path from 'path';
import fs from 'fs';

export function saveFile(file: Express.Multer.File, dir: string, filename: string) {
    try {
        const filePath = path.join(process.cwd(), `./${dir}/`, filename);
        fs.writeFileSync(filePath, file.buffer);
        return true;
    } catch (error) {
        console.log('error', error);
        return false;
    }
}