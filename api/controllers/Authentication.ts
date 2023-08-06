import * as Auth from '../services/authn'
export const signup = async (req: any, res: any) => {
    try {
        const resp = await Auth.registerUser(req.body);
        return res.status(resp.code || 400).json({
            message: resp.message,
            data: resp.data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const login = async (req: any, res: any) => {
    try {
        const resp = await Auth.loginUser(req.body);
        return res.status(resp.code || 400).json({
            message: resp.message,
            data: resp.data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

