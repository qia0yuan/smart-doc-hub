export const USER_FILTER = [
    {
        id: 'firstname',
        label: 'First Name',
    },
    {
        id: 'lastname',
        label: 'Last Name',
    },
    {
        id: 'emailid',
        label: 'Email ID',
    },
    {
        id: 'phonenumber',
        label: 'Phone Number',
    }
] as const;

export const DOCUMENT_FILTER = [
    {
        id: 'sharedByUser',
        label: 'sharedBy',
    },
] as const;