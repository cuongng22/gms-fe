export class Response<T> {
    data: {
        totalPages: number;
        totalElements: number;
        pageable: {
            pageNumber: number;
            pageSize: number;
            sort: {
                sorted: boolean;
                empty: boolean;
                unsorted: boolean;
            },
            offset: number;
            paged: boolean;
            unpaged: false
        },
        size: number;
        content: T[],
        number: number;
        sort: {
            sorted: false,
            empty: boolean;
            unsorted: boolean;
        },
        numberOfElements: number;
        first: boolean;
        last: boolean;
        empty: boolean;
    };
    status: number;
}


export class Role {
    userCount: number;
    roleId: number;
    roleName: string;
    functionCount: number;
    isActive: number;
}


export class User {
    email: string;
    fullName: string;
    active: boolean;
    department: string;
    avartar_url: string;
    phone: string;
    gender: boolean
    description: string;
    roles: {
        id: number;
        name: string;
        active: boolean;
    }[];
    password: string;
}

export class ResetPasswordRequest {
    constructor(public newPassword: string, public email: string) { }
}

