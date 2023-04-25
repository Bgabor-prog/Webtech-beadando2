export interface User {
    id: number;
    firstName: string;
    lastName: string;
    telephoneNumber: string;
    email: string;
    username: string;
    password: string;
    role?: string;
    token?: string;
}
