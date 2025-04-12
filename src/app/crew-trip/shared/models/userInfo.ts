import {environment} from 'src/environments/environment';

interface Role {
  id: number;
  name : string;
}
export class UserLogin {
  email: string;
  id: number;
  fullName: string;
  department: string;
  avartarUrl: string;
  phone: string;
  gender: number;
  description: string;
  roles: number[];

  constructor(
    email: string,
    id = 0,
    fullName: string,
    department: string,
    avartarUrl: string,
    phone: string,
    gender: number,
    description: string,
    roles: Role[] = []
  ) {
    this.email = email;
    this.id = id;
    this.fullName = fullName;
    this.department = department;
    this.avartarUrl = avartarUrl.includes(environment.baseUrl) ? this.avartarUrl = avartarUrl : `${environment.baseUrl}/${avartarUrl}`;
    this.phone = phone;
    this.gender = !gender ? 0 : 1;
    this.description = description;
    this.roles = roles.map(item => item.id);
  }

  static fromObject(obj: any): UserLogin {
    return new UserLogin(
      obj.email || '',
      obj.id || 0,
      obj.fullName || '',
      obj.department || '',
      obj.avartarUrl || '',
      obj.phone || '',
      obj.gender || null,
      obj.description || '',
      obj.roles || [],
    );
  }
}
