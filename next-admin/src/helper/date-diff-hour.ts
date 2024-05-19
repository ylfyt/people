export function dateDiffHour(s1: Date | string, s2: Date | string) {
    const startDate = new Date(s1);
    const endDate = new Date(s2);
    const millisecondsDiff = endDate.getTime() - startDate.getTime();
    const hoursDiff = millisecondsDiff / (1000 * 60 * 60); // 1000 milliseconds * 60 seconds * 60 minutes
    return hoursDiff.toFixed(1);
} 