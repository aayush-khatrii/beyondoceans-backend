import TokenModel from '../models/token-model.js'

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
}

export default new tokenService();