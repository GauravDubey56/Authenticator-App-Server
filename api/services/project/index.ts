import Project from "../../db/schema/Project";
import { generateAccessIdAndKey } from "../../utils/crypt";

export const createNewProject = async (Name: string, UserId: string, callbackParams: callbackParams) => {
    const resp: ServiceResponse = { code: 400, message: "Error", data: null };
    const key = generateAccessIdAndKey('');
    const newProject = await Project.create({
        Name,
        UserId,
        ...callbackParams,
        ...key
    })
    resp.code = 200;
    resp.message = "New project added";
    return resp;
}