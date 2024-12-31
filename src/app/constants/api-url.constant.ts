export const BASE_URL = 'http://3.214.246.121/api/';

export const ENDPOINTS = {
    USER_CRUD: 'user/{user_id}',
    USER_LOGIN: 'user/token',
    ACCOUNT_CRUD: 'account/{account_id}',
    DOCUMENTS_LIST: 'documents/files',
    DOCUMENT_UPLOAD: 'documents/upload',
    DOCUMENT_DELETE: 'documents/delete',
    DOCUMENT_DOWNLOAD: 'documents/download',
    NOTIFICATIONS_CREATE: 'notifications',
    NOTIFICATIONS_GET: 'notifications/user/{user_id}',
    NOTIFICATIONS_DELETE: 'notifications/{preference_id}',
    NOTIFICATIONS_UPDATE: 'notifications/{notification_id}',
};