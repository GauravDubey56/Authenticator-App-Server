import { generateHash, validatePassword, createJwtToken } from '../../utils/crypt'
import Users from '../../db/schema/User'
export const registerUser = async (user: NewUser): Promise<ServiceResponse> => {
    const res = { code: 400, message: "Please try again", data: {} }
    const existingUser = await Users.findOne({ EmailAddress: user.EmailAddress });
    if (existingUser) {
        res.message = "Email already exists";
        return res;
    }
    user.PasswordHash = await generateHash(user.Password || '');
    delete user['Password'];
    await Users.create(user)
    res.code = 200;
    res.message = "Regitration successful, proceed to login"
    return res;
}

export const loginUser = async (user: UserLogin) : Promise<ServiceResponse>  => {
    const res = { code: 400, message: "Please try again", data: {} }
    const existingUser = await Users.findOne({EmailAddress: user.EmailAddress});
    if(!existingUser) {
        res.message = "User with email id does not exists";
        return res;
    }
    const isPasswordValid = await validatePassword(user.Password, existingUser.PasswordHash);
    if(!isPasswordValid) {
        res.message = "Invalid password";
        return res;
    }
    const userToken: UserToken= {};
    userToken.EmailAddress = existingUser.EmailAddress;
    userToken.FirstName = existingUser.FirstName;
    userToken.LastName = existingUser.LastName;
    userToken.UserId = existingUser.id;
    userToken.FullName = existingUser.FullName;
    const jwtToken = createJwtToken(userToken);
    res.code = 200;
    res.message = `HI ${existingUser.FirstName}!, Welcome to authenticator`
    res.data = jwtToken
    return res;
}