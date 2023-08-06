import * as Controllers from "../../controllers/Authentication";
const authRouters: APIRegister = {
    routes: [
        { route: "/signup", method: "POST", controller: Controllers.signup },
        { route: "/login", method: "POST", controller: Controllers.login }
    ],
    path: "/auth"
}
const appv1: Array<APIRegister> = [];
appv1.push(authRouters);

export default appv1;
