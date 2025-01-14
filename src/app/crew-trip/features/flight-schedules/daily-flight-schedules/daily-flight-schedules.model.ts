export const months = [
    { code: '1', value: 'Tháng 1' },
    { code: '2', value: 'Tháng 2' },
    { code: '3', value: 'Tháng 3' },
    { code: '4', value: 'Tháng 4' },
    { code: '5', value: 'Tháng 5' },
    { code: '6', value: 'Tháng 6' },
    { code: '7', value: 'Tháng 7' },
    { code: '8', value: 'Tháng 8' },
    { code: '9', value: 'Tháng 9' },
    { code: '10', value: 'Tháng 10' },
    { code: '11', value: 'Tháng 11' },
    { code: '12', value: 'Tháng 12' },
];

export function getYear() {
    let years = [];
    const currentYear = new Date().getFullYear();
    for (let index = 0; index < 5; index++) {
        years.push(currentYear + index);
    }
    return years;
}