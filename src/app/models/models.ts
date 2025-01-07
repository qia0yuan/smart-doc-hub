export interface SessionUser {
    token: string;
    currentUser: User;
}

export interface User {
    firstname: string;
    lastname: string;
    address2: string;
    phonenumber: string;
    userid: string;
    accountid: number;
    id: number;
    address1: string;
    emailid: string;
    role: number;
    password: string;
}

export interface ToastConfig {
    type?: string;
    title?: string;
    message?: string;
}
