import { NextFunction } from "express";
import { createNewProject } from "../services/project";

export const addProject = async (req: any, res: any, next: NextFunction) => {
    try {
        const { WebhookUrl, CallbackUrl } = req.body
        const newProject = await createNewProject(req.body.Name, req.user.id, { CallbackUrl, WebhookUrl });
        res.status(newProject.code == 200 ? 200 : 400).json({
            message: newProject.message
        })
    } catch (error) {
        next(error);
    }
}