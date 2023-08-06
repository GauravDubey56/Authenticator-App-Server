interface UserToken {
    FirstName: string;
    LastName: string;
    FullName?: string
    EmailAddress: string;
    TokenCreatedAt? : string
}


interface ServiceResponse {
    code: number,
    message: string,
    data: object | null | string
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