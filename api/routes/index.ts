import Express from 'express';
import appv1 from './v1';
const apiRouter =  Express.Router();
const appRouterV1 = Express.Router();


appv1.forEach(register => {
    const router = Express.Router();
    register.routes.forEach(route => {
        switch (route.method) {
            case "GET":
                router.get(route.route, ...(route.middlewares || []), route.controller)
            case "POST":
                router.post(route.route, ...(route.middlewares || []), route.controller)
            case "PATCH": 
                router.patch(route.route, ...(route.middlewares || []), route.controller)
            case "PUT": 
                router.put(route.route, ...(route.middlewares || []), route.controller)
        }
    })
    appRouterV1.use(register.path, router);
})

apiRouter.use('/v1', appRouterV1)
export default apiRouter;

