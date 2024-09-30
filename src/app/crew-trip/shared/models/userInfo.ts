export class UserLogin {
  email: string;
  id: number;
  fullName: string;
  department: string;
  avatar_url: string;
  phone: string;
  gender: string;
  constructor(
    email: string,
    id: number = 0,
    fullName: string,
    department: string,
    avatar_url: string,
    phone: string,
    gender: string
  ) {
    this.email = email;
    this.id = id;
    this.fullName = fullName;
    this.department = department;
    this.avatar_url = avatar_url;
    this.phone = phone;
    this.gender = gender;
  }
  static fromObject(obj: any): UserLogin {
    return new UserLogin(
      obj.email || '',
      obj.id || 0,
      obj.fullName || '',
      obj.department || '',
      obj.avatar_url || '',
      obj.phone || '',
      obj.gender || ''
    );
  }
}
