import { values } from "lodash"

// - Cấp phê duyệt: cho chọn 1 giá trị, danh sách gồm: HĐQT, TGĐ, PTGĐ- GĐ KTB, GĐ TTĐHKT
export const Authoritys = [
    { code: 'HDQT', value: 'HĐQT' },
    { code: 'TGD', value: 'TGĐ' },
    { code: 'PTGD_GD_KTB', value: 'PTGĐ- GĐ' },
    { code: 'GD_TTDHKT', value: 'GĐ TTĐHKT' },
]

// - Lĩnh vực: Mặc định = 'KT'. cho chọn 1 giá trị. Danh sách gồm: KT; CQ; Tổ
export const Fields = [
    { code: 'KT', value: 'KT' },
    { code: 'CQ', value: 'CQ' },
    { code: 'TO', value: 'Tổ' },
]

export const SelectionMethods = [
    { code: 'OFFER', value: 'Chào giá' },
    { code: 'NEGOTIATE', value: 'Đàm phán' }
]

export const ContractPeriods = [
    { code: 'ZERO', value: 'Dưới 1 năm' },
    { code: 'ONE', value: 'Từ 1 - dưới 2 năm' },
    { code: 'TWO', value: 'Từ 2 - dưới 3 năm' },
    { code: 'THREE', value: 'Từ 3 - dưới 5 năm' },
    { code: 'FIVE', value: 'Trên 5 năm' },
]
// - Đơn vị tính: cho chọn 1 giá trị. Danh sách gồm: Đêm; Phòng; Buổi; Lượt; Lần; Khác
export const SelectionUnits =[
    { code: 'NIGHT', value: 'Đêm' },
    { code: 'ROOM', value: 'Phòng' },
    { code: 'SESSION', value: 'Buổi' },
    { code: 'TURN', value: 'Lượt' },
    { code: 'TIME', value: 'Lần' },
    { code: 'OTHER', value: 'Khác' },
]