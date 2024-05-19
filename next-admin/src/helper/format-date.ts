export function formatDate(dateStr: Date | string | undefined, { onlyDate, onlyTime }: { onlyDate?: boolean, onlyTime?: boolean; }) {
    if (!dateStr) {
        return "-";
    }
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month index starts from 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    if (onlyTime) {
        return `${hours}:${minutes}`;
    }

    if (onlyDate) {
        return `${day}/${month}/${year}`;
    }

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}