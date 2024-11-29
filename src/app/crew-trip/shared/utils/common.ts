export const truncateDate = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};
export const truncateDateUTC = (date: Date): Date => {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
};