import { MatExpansionPanel } from "@angular/material/expansion";

export const HOTEL = 'Hotel';
export const CAR_RENTAL = 'CarRental';
export enum ServiceType {
    HOTEL = 'Hotel',
    CAR_RENTAL = 'CarRental'
};

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

export const StatusEnum = {
    DRAFT: 'draft',
    INTERNATIONAL_COMPLETED: 'international_completed',
    DOMESTIC_COMPLETED: 'domestic_completed',
    DOM_INT_COMPLETED: 'dom_int_completed',
    CONFIRMED: 'confirmed',
    APPROVED: 'approved',
    REJECTED: 'rejected'
}

export const StatusSummaryEnum = {
    DRAFT: 'draft',
    COMPLETED: 'completed',
}

// Trạng thái màn hình summary
export const StatusesSummary: { code: string, value: string }[] = [
    { code: '', value: '-- All Status --' },
    { code: 'draft', value: 'Draft' },//Bản nháp
    { code: 'completed', value: 'Completed' }, //Hoàn thành 
];

export function years() {
    let arrYears = []
    const currYear = new Date().getFullYear();
    for (let index = 0; index < 10; index++) {
        arrYears.push({ code: currYear + index, value: currYear + index });
    }
    return arrYears;
}

export const categories = [
    { code: '', value: $localize`:@@allCategory:-- All Category --` },
    { code: 'International', value: $localize`:@@international:International` },
    { code: 'Domestic', value: $localize`:@@domestic:Domestic` }
];

export const categoryOfPlans = [
    { code: '', value: $localize`:@@allCategory:-- All Category of plan --` },
    { code: 'BUDGET', value: $localize`:@@budgetPlan:Budget Plan` },
    { code: 'PROCUREMENT', value: $localize`:@@procurementPlan:Procurement Plan` }
]

export enum PlanCategoryEnum {
    BUDGET = 'BUDGET',
    PROCUREMENT = 'PROCUREMENT'
}

export enum CategoryEnum {
    INTERNATIONAL = 'International',
    DOMESTIC = 'Domestic'
}

export const Categories = [
    { code: '', value: $localize`:@@allCategory:-- All Category --` },
    { code: 'International', value: $localize`:@@international:International` },
    { code: 'Domestic', value: $localize`:@@domestic:Domestic` }
];
export const PADDING_0 = '0px !important';


export function openPanel(panel: MatExpansionPanel, isCheckData?: boolean, data?: any[]): void {
    if (isCheckData && !(data && data.length > 0)) {
        return;
    }
    panel.open();
    panel.disabled = false;
}

export function closePanel(panel: MatExpansionPanel): void {
    panel.close();
    panel.disabled = true;
}
