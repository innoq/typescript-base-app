export const DB_CONN_URL = dbConnUrl();
export const DB_NAME = process.env.NODE_ENV === 'test' ? 'ts-base-service_test' : 'ts-base-service';
export const SERVER_PORT = 8000;

function dbConnUrl() {
    const userName = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
    const host = process.env.DB_HOST || '127.0.0.1';
    const port = process.env.DB_PORT || '27017';
    if (userName && password) {
        return `mongodb://${userName}:${password}@${host}:${port}`;
    }
    return `mongodb://${host}:${port}`;
}