export const BASE_URL = 'https://smartdochub.com/api/';
// export const BASE_URL = 'http://ec2-3-214-246-121.compute-1.amazonaws.com:8000/api/';
// export const BASE_URL = 'http://3.214.246.121/api/';

export const ENDPOINTS = {
    USER_CRUD: 'user/{user_id}',
    USER_LOGIN: 'user/token',
    USER: 'user/',
    USER_SEARCH: 'user/search',
    BULK_USER_UPLOAD: 'user/upload',
    USERS_LIST: 'account/{account_id}/user',
    INVITEE: 'invitee/',
    INVITEE_CRUD: 'invitee/{invitee_id}',
    INVITEES_LIST: 'account/{account_id}/invitee',
    SEND_INVITATION: 'user/{user_id}/invite', 
    SUBSCRIBE_INVITEE: 'invitee/{invitee_id}/subscribe',
    INVITEE_DETAILS: 'invitation/user',
    ACCOUNT: 'account/',
    ACCOUNT_CRUD: 'account/{account_id}',
    ALL_USER_BY_ACCOUNT: 'account/{account_id}/user',
    DOCUMENT_QUERRY: 'documents/',
    DOCUMENT_SEARCH: 'documents/search',
    DOCUMENTS_LIST: 'documents/files',
    DOCUMENT_UPLOAD: 'documents/upload',
    DOCUMENT_SHARE: 'documents/share',
    DOCUMENT_DELETE: 'documents/{doc_id}',
    DOCUMENT_DOWNLOAD: 'documents/download/{doc_id}',
    NOTIFICATIONS_CREATE: 'notifications',
    NOTIFICATIONS_GET: 'notifications/user/{user_id}',
    NOTIFICATIONS_DELETE: 'notifications/{preference_id}',
    NOTIFICATIONS_UPDATE: 'notifications/{notification_id}',
};