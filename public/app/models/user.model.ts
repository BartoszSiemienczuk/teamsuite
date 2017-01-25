export interface User {
    _id: string;
    login: string;
    name?: string;
    email?: string;
    role?: string;
    teams: any[];
    password?: string;
}