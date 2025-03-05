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
    subscriptiontype: string;
}

export interface Account {
    id: number;
    name: string;
    address1: string;
    address2: any;
    emailid: string;
    phonenumber: string;
    createdby: number;
    updatedby: number;
    primarycontact: User;
    secondarycontact: User;
}

export interface Document {
    title: string;
    description: string;
    createdby: number;
    sharedBy: number;
    path: string;
    id: number;
    updatedby: number;
    type: string;
}

export interface ToastConfig {
    type?: string; //success, error, info, warn
    title?: string;
    message?: string;
}
