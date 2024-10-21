export class CreateMarketFlight {
    marketCode: string;
    marketName: string;
    nationId: number;
    marketType: string;
    flightGroup: string;
    serviceFeeCode: string[];
    statusUsage: string;
    note: string;
    overnight: boolean;

    constructor(data?: any) {
        this.marketCode = data?.marketCode;
        this.marketName = data?.marketName;
        this.nationId = data?.nationId;
        this.marketType = data?.marketType;
        this.flightGroup = data?.flightGroup;
        this.serviceFeeCode = data?.serviceFeeCode;
        this.statusUsage = data?.statusUsage;
        this.note = data?.notes;
        this.overnight = data?.overnight;
    }
}

export class CreateHotel {
    code: string;
    name: string;
    address: string;
    fullName: string;
    email: string;
    phone: string;
    notes: string;
    active: boolean;
    flightMarketId: number;

    constructor(data?: any) {
        this.code = data?.hotelName;
        this.name = data?.hotelName;
        this.address = data?.address;
        this.fullName = data?.fullName;
        this.email = data?.email;
        this.phone = data?.phone;
        this.notes = data?.notes;
        this.active = data?.active;
        this.flightMarketId = data?.flightMarketId;
    }
}

export class CreateVehiclePartner {
    code: string;
    name: string;
    address: string;
    fullName: string;
    email: string;
    phone: string;
    notes: string;
    active: boolean;
    flightMarketId: number;

    constructor(data?: any) {
        this.code = data?.code;
        this.name = data?.name;
        this.address = data?.address;
        this.fullName = data?.fullName;
        this.email = data?.email;
        this.phone = data?.phone;
        this.notes = data?.notes;
        this.active = data?.active;
        this.flightMarketId = data?.flightMarketId;
    }
}


export class CreateFlightMarketDTO {
    marketFlight: CreateMarketFlight;
    hotels: CreateHotel[];
    vehiclePartners: CreateVehiclePartner[];

    constructor(marketFlight: CreateMarketFlight, hotels: CreateHotel[], vehiclePartners: CreateVehiclePartner[]) {
        this.marketFlight = marketFlight;
        this.hotels = hotels;
        this.vehiclePartners = vehiclePartners;
    }
}




export class UpdateFlightMarket {
    marketName: string;
    nationId: number;
    marketType: string;
    flightGroup: string;
    serviceFeeCode: string[];
    statusUsage: string;
    notes: string;
    deleteItems: { id: number; type: string }[];
    updateItems: UpdateHotelAndCar[];
    insertItems: InsertHotelAndCar[];
    overnight: boolean;

    constructor(data: any) {
        this.marketName = data.marketName;
        this.nationId = data.nationId;
        this.marketType = data.marketType;
        this.flightGroup = data.flightGroup;
        this.serviceFeeCode = data.serviceFeeCode;
        this.statusUsage = data.statusUsage;
        this.notes = data.notes;
        this.deleteItems = data.deleteItems;
        this.updateItems = data.updateItems;
        this.insertItems = data.insertItems;
        this.overnight = data.overnight;
    }
}

export class InsertHotelAndCar {
    type: string;
    code: string;
    name: string;
    address: string;
    fullName: string;
    email: string;
    phone: string;
    notes: string;
    active: boolean;
    marketId: number;

    constructor(data?: any) {
        this.code = data?.code;
        this.type = data?.type;
        this.name = data?.name;
        this.address = data?.address;
        this.fullName = data?.fullName;
        this.email = data?.email;
        this.phone = data?.phone;
        this.notes = data?.notes;
        this.active = data?.active;
        this.marketId = data?.marketId;
        if (data.type === 'HOTEL') {
            this.code = data?.hotelCode;
            this.name = data?.hotelName;
        }
        
    }
}

export class UpdateHotelAndCar {
    type: string;
    id: number;
    name: string;
    fullName: string;
    address: string;
    email: string;
    phone: string;
    notes: string;
    active: boolean;

    constructor(data?: any) {
        this.type = data?.type;
        this.id = data?.id;
        this.name = data?.name;
        this.fullName = data?.fullName;
        this.address = data?.address;
        this.email = data?.email;
        this.phone = data?.phone;
        this.notes = data?.notes;
        this.active = data?.active;
        if (data.type === 'HOTEL') {
            this.name = data?.hotelName;
        }
    }
}