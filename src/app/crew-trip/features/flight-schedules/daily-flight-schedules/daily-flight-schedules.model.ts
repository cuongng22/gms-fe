export const months = [
    { code: '01', value: '1' },
    { code: '02', value: '2' },
    { code: '03', value: '3' },
    { code: '04', value: '4' },
    { code: '05', value: '5' },
    { code: '06', value: '6' },
    { code: '07', value: '7' },
    { code: '08', value: '8' },
    { code: '09', value: '9' },
    { code: '10', value: '10' },
    { code: '11', value: '11' },
    { code: '12', value: '12' },
];

export function getYear() {
    let years = [];
    const currentYear = new Date().getFullYear();
    for (let index = -5; index < 5; index++) {
        years.push(currentYear + index);
    }
    return years;
}