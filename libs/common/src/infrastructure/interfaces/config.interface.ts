interface ApiConfigProps {
    apiUrl: string | undefined
    httpTimeout: number
}

interface DatabaseConfigProps {
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}

export interface ConfigProps {
    defaultLanguage: string,
    port: number
    api: ApiConfigProps,
    database: DatabaseConfigProps
}