import TokenModel from '../models/token-model.js'
import userService from "../services/userAuth-service.js" 

class tokenService{
    async generateTokens(data){
        const JWTFunc = data.JWTFunction
        const accessToken = await JWTFunc.JWTAccess.sign({userId: data.payload})
        const refreshToken = await JWTFunc.JWTRefresh.sign({userId: data.payload})
        return {accessToken, refreshToken}
    }

    async deleteRefToken(refreshToken, JWTFunction, userId){
        if(!refreshToken){
            return
        }
        const refData = await JWTFunction.JWTRefresh.verify(refreshToken)
        if(!refData.userId){
            return
        }
        if (refData.userId === userId){
            return
        }
        await TokenModel.deleteRefToken(refData.userId)
    }

    async storeRefreshToken(userId, refreshToken){

        return await TokenModel.storeRefreshToken(userId, refreshToken)

    }

    async getUserIDfromRefToken(cookie, JWTFunction){

        if(!cookie) return false
        
        const {userId} = await JWTFunction.JWTRefresh.verify(cookie)

        if(!userId) return false

        if(userId) return userId
    }

    async getUserIDfromAccToken(cookie, JWTFunction){

        if(!cookie) return false
        
        const {userId} = await JWTFunction.JWTAccess.verify(cookie)

        if(!userId) return false

        if(userId) return userId
    }

    async removeRefreshTokenfromDB(userId){
        const deleteRequestData = await TokenModel.deleteRefToken(userId)
        return deleteRequestData
    }

    async getUserfromAccToken(cookie, JWTFunction){
        if(!cookie) return
        
        const {userId} = await JWTFunction.JWTAccess.verify(cookie)

        if(!userId) return
        
        return await userService.findbyUserId(userId)
    }
    
}

export default new tokenService();