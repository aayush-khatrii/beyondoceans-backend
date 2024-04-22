import { ErrorHandler } from '../errors/ErrorHandler.js'
import SessionModel from '../models/session-model.js'
import { v4 as uuidv4 } from 'uuid';

class sessionService{

    async checkSession(sessionToken, JWTFunction){
        const {sessionID} = await JWTFunction.JWTSession.verify(sessionToken)
        if(!sessionID){
            return
        }
        return await SessionModel.findSession(sessionID)
    }

    async addUserIdinSession(sessionID, userID){
        return await SessionModel.addUserIdinSession(sessionID, userID)
    }

    async generateSessionWithID(userID){
        const sessionID = uuidv4().toString()
        await SessionModel.createSessionWithID(sessionID, userID)
        return sessionID
    }

    async createSessionToken(sessionID, JWTFunction){
        return await JWTFunction.JWTSession.sign({sessionID})
    }

}

export default new sessionService()