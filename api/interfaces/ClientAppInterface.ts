export interface CreateNewApp {
    callbackUrl: string,
    appName: string
}

export interface UpdateApp {
    callbackUrl?: string,
    appName?: string
}