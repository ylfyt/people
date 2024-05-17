export const getFileExtension = (filename: string) => {
    const data = filename.split(".");
    return data[data.length - 1];
};