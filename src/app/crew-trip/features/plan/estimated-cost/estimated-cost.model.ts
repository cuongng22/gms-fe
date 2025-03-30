
// Trạng thái màn hình summary
export const StatusesSummary: { code: string, value: string }[] = [
    { code: '', value: '-- All Status --' },
    { code: 'draft', value: 'Draft' },//Bản nháp
    { code: 'completed', value: 'Completed' }, //Hoàn thành 
];

export enum StatusSummaryEnum {
    DRAFT = 'draft',
    COMPLETED = 'completed'
}

export const Categories = [
    { code: '', value: $localize`:@@allCategory:-- All Category --` },
    { code: 'International', value: $localize`:@@international:International` },
    { code: 'Domestic', value: $localize`:@@domestic:Domestic` }
];
export enum CategoriesEnum {
    ALL = '',
    INTERNATIONAL = 'International',
    DOMESTIC = 'Domestic'
}
