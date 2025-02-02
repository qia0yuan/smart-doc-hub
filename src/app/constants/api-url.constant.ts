export const BASE_URL = 'http://ec2-3-214-246-121.compute-1.amazonaws.com/api/';
// export const BASE_URL = 'http://3.214.246.121/api/';

export const ENDPOINTS = {
    USER_CRUD: 'user/{user_id}',
    USER_LOGIN: 'user/token',
    USER: 'user/',
    USERS_LIST: 'account/{account_id}/user',
    INVITEE: 'invitee/',
    INVITEES_LIST: 'account/{account_id}/invitee',
    SEND_INVITATION: 'user/{user_id}/invite', 
    ACCOUNT_CRUD: 'account/{account_id}',
    DOCUMENT_QUERRY: 'documents/',
    DOCUMENTS_LIST: 'documents/files',
    DOCUMENT_UPLOAD: 'documents/upload',
    DOCUMENT_DELETE: 'documents/delete/{doc_id}',
    DOCUMENT_DOWNLOAD: 'documents/download/{doc_id}',
    NOTIFICATIONS_CREATE: 'notifications',
    NOTIFICATIONS_GET: 'notifications/user/{user_id}',
    NOTIFICATIONS_DELETE: 'notifications/{preference_id}',
    NOTIFICATIONS_UPDATE: 'notifications/{notification_id}',
};