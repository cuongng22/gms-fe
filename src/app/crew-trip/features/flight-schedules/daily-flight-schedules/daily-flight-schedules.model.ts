export const months = [
    { code: '01', value: 'Tháng 1' },
    { code: '02', value: 'Tháng 2' },
    { code: '03', value: 'Tháng 3' },
    { code: '04', value: 'Tháng 4' },
    { code: '05', value: 'Tháng 5' },
    { code: '06', value: 'Tháng 6' },
    { code: '07', value: 'Tháng 7' },
    { code: '08', value: 'Tháng 8' },
    { code: '09', value: 'Tháng 9' },
    { code: '10', value: 'Tháng 10' },
    { code: '11', value: 'Tháng 11' },
    { code: '12', value: 'Tháng 12' },
];

export function getYear() {
    let years = [];
    const currentYear = new Date().getFullYear();
    for (let index = -5; index < 5; index++) {
        years.push(currentYear + index);
    }
    return years;
}