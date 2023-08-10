import * as AuthControllers from "../../controllers/Authentication";
import * as ProjectControllers from '../../controllers/Project';
import * as Middlewares from '../../utils/middlewares'
const authRouters: APIRegister = {
    routes: [
        { route: "/signup", method: "POST", controller: AuthControllers.signup },
        { route: "/login", method: "POST", controller: AuthControllers.login }
    ],
    path: "/auth"
}
const projectRouters: APIRegister = {
    routes: [
        { route: "/", method: "POST", middlewares: [Middlewares.authorizeUser], controller: ProjectControllers.addProject },
    ],
    path: "/project"
}
const appv1: Array<APIRegister> = [];
appv1.push(authRouters);
appv1.push(projectRouters)

export default appv1;
