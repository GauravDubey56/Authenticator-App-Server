import { Schema, model, connect } from 'mongoose';
interface User {
  FirstName: string;
  LastName: string;
  PasswordHash: string;
  EmailAddress: string;
  FullName?: string
}
const getFullName = (userObject: User): string => {
  return `${userObject?.FirstName || ''} ${userObject?.LastName || ''}`
}
const userSchema = new Schema<User>({
  FirstName: { type: String, required: true },
  LastName: String,
  EmailAddress: { type: String, required: true },
  PasswordHash: { type: String, required: true },
  FullName: { type: String, get: getFullName }
});

const Users = model<User>('users', userSchema);

export default Users;