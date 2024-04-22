import { ErrorHandler } from '../errors/ErrorHandler';
import AuthModel from '../models/auth-model'

class userAuthService{
    async findbyPhone(phone){
        return await AuthModel.findUserbyPhone(phone)
    }

    async createUserbyPhone(data){
        return await AuthModel.CreateUserbyPhone(data)
    }

    async findbyEmail(email){
        return await AuthModel.findUserbyEmail(email)
    }

    async createUserbyEmail(data){
        return await AuthModel.CreateUserbyEmail(data)
    }
}

export default new userAuthService();