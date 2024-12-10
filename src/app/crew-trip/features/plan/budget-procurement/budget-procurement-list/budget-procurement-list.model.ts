//Bản nháp, Hoàn thành KH quốc tế, Hoàn thành KH quốc nội, Từ chối, Đã duyệt, Xác nhận
export const Statuses: { code: string, value: string }[] = [
    { code: 'draft', value: 'Draft' },//Bản nháp
    { code: 'international_completed', value: 'International completed' }, //Hoàn thành KH quốc tế
    { code: 'domestic_completed', value: 'Domestic completed' }, //Hoàn thành KH quốc nội
    { code: 'dom_int_completed', value: 'Domestic and International completed' }, //Hoàn thành KH quốc tế' VÀ 'Hoàn thành KH quốc nội
    { code: 'confirmed', value: 'Confirmed' }, //Xác nhận
    { code: 'approved', value: 'Approved' }, //Đã duyệt
    { code: 'rejected', value: 'Rejected' }, //Từ chối
];

export function years() {
    let arrYears = []
    const currYear = new Date().getFullYear();
    for (let index = 0; index < 10; index++) {
        arrYears.push({ code: currYear + index, value: currYear + index });
    }
    return arrYears;
}