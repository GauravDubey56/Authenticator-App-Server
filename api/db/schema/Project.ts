import { Schema, model, connect } from 'mongoose';
const projectSchema = new Schema<Project>({
    Name: { type: String, required: true },
    UserId: { type: String, required: true },
    WebhookUrl: { type: String },
    CallbackUrl: { type: String, required: true },
    AccessKey: { type: String, required: true },
    AccessKeyId: { type: String, required: true }
});

const Project = model<Project>('User', projectSchema);

export default Project;