export const GITHUB_CLIENT_ID: EnvVar = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET: EnvVar = process.env.GITHUB_CLIENT_SECRET;
export const SERVER_HOST_URL: EnvVar = process.env.SERVER_HOST_URL;
export const GITHUB_CALLBACK_URL: string = `${process.env.SERVER_HOST_URL}/auth/githubCallback`;
export const GITHUB_AUTH_URL: string = `https://github.com/login/oauth/authorize`;
export const GITHUB_USER_API: string = `https://api.github.com/user`;
