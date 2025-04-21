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
        id: 'title',
        label: 'title',
    },
    {
        id: 'sharedByUser',
        label: 'sharedBy',
    },
    {
        id: 'category',
        label: 'category',
    },
    {
        id: 'subcategory',
        label: 'subcategory',
    },
] as const;

export const DOCUMENT_TYPE_FILTER = [
    {
        key: '0',
        label: 'TAXATION',
        children: [
            {
                key: '0-0',
                label: 'W2',
            },
            {
                key: '0-1',
                label: '1099',
            },
            {
                key: '0-2',
                label: '1099-G',
            },
            {
                key: '0-3',
                label: '1099-K',
            },
        ]
    },
    {
        key: '1',
        label: 'AUTO_INSURANCE',
        children: []
    },
    {
        key: '2',
        label: 'LEGAL',
        children: []
    },
    {
        key: '3',
        label: 'PERSONAL',
        children: [
            {
                key: '0-0',
                label: 'PASSPORT',
            },
            {
                key: '0-1',
                label: 'AUTO_POLICY',
            },
            {
                key: '0-2',
                label: 'DL',
            },
        ]
    },
];