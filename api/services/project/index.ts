import Project from "../../db/schema/Project";
import { generateAccessIdAndKey } from "../../utils/crypt";
import * as Db from '../../db/dbClient';
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
export const getProjectByUserID = async (UserId: string, options: findOptions) => {
    if (!options.limit) {
        options.limit = 5;
    }
    if (!options.offset) {
        options.offset = 0;
    }
    const db: any = await Db.getDbConnection();
    let resp: ServiceResponse = { code: 200, message: "No projects found", data: {} };
    const [list, count] = await Promise.all([
        db.collection('projects').find({
            UserId
        }, null, {
            limit: options.limit,
            skip: options.offset
        }).toArray(),
        options.count ? db.collection('projects').count({ UserId }) : Promise.resolve()
    ])
    resp.data = {};
    resp.data = {
        list,
        ...(options.count && { count })
    }
    if (count || list.length) {
        resp.message = options.count ? `Fetched ${options.limit} out of ${count}` : `${list.length} projects fetched`
    } else {
        resp.message = 'No projects found';
    }
    return resp;

}