interface UserToken {
    FirstName: string;
    LastName: string;
    FullName?: string
    EmailAddress: string;
    TokenCreatedAt? : string
}

type fetchDocuments = {
    list: Array<any>,
    count: number
}
interface ServiceResponse {
    code: number,
    message: string,
    data: object | null | string | fetchDocuments
}
interface TokenResponse extends ServiceResponse {
    data: object
}
interface NewUser {
    FirstName: string,
    LastName: string,
    EmailAddress: string,
    Password?: string,
    PasswordHash?: string
}
interface UserToken {
    FirstName?: string,
    LastName?: string,
    EmailAddress?: string,
    UserId?: string
}
interface UserLogin {
    EmailAddress: string,
    Password: string
}
type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH'
interface RouterRegister {
    route: string,
    controller: function,
    middlewares?: Array<function>,
    method: HttpMethods
    userAuth?: boolean
}
interface APIRegister {
    routes: Array<RouterRegister>,
    path: string
}
interface ProtectedRequest extends Request {
    user: object | string | null
}
interface Project {
    Name: string;
    UserId: string;
    WebhookUrl?: string;
    CallbackUrl: string;
    AccessKeyId: string;
    AccessKey: string
}
interface AccessKey {
    AccessKeyId: string,
    AccessKey: string
}
interface callbackParams {
    WebhookUrl?: string,
    CallbackUrl: string
}

interface findOptions {
    limit?: number,
    offset?: number,
    count?: boolean
}