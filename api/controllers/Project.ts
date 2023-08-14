import { NextFunction } from "express";
import { createNewProject, getProjectByUserID } from "../services/project";

export const addProject = async (req: any, res: any, next: NextFunction) => {
    try {
        const { WebhookUrl, CallbackUrl } = req.body
        const newProject = await createNewProject(req.body.Name, req.user.UserId, { CallbackUrl, WebhookUrl });
        res.status(newProject.code == 200 ? 200 : 400).json({
            message: newProject.message
        })
    } catch (error) {
        next(error);
    }
}
export const getProjects = async (req: any, res: any, next: NextFunction) => {
    try {
        const response = await getProjectByUserID(req.user.UserId, req.query);
        return res.status(response?.data ? 200 : 400).json(response.data);
    } catch (error) {
        next(error);
    }
}