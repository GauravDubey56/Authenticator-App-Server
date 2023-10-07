export interface GithubAuthInterface {
    generateAuthUrl(): Promise<string>
}