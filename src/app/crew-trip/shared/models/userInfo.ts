export class UserLogin {
  email: string;
  id: number;
  fullName: string;
  department: string;
  avartarUrl: string;
  phone: string;
  gender: string;
  constructor(
    email: string,
    id = 0,
    fullName: string,
    department: string,
    avartarUrl: string,
    phone: string,
    gender: string
  ) {
    this.email = email;
    this.id = id;
    this.fullName = fullName;
    this.department = department;
    this.avartarUrl = avartarUrl;
    this.phone = phone;
    this.gender = gender;
  }
  static fromObject(obj: any): UserLogin {
    return new UserLogin(
      obj.email || '',
      obj.id || 0,
      obj.fullName || '',
      obj.department || '',
      obj.avartarUrl || '',
      obj.phone || '',
      obj.gender || '',
    );
  }
}
