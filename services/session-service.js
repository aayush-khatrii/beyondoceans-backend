import { ErrorHandler } from '../errors/ErrorHandler.js'
import SessionModel from '../models/session-model.js'
import { v4 as uuidv4 } from 'uuid';

class sessionService{

    async checkSession(sessionToken, JWTFunction){
        if(!sessionToken){
            return
        }
        const {sessionID} = await JWTFunction.JWTSession.verify(sessionToken)
        if(!sessionID){
            return
        }
        return await SessionModel.findSession(sessionID)
    }

    async addUserIdinSession(sessionID, userIdinSession, userID){
        if(userIdinSession === userID){
            return
        }
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

    async storePackDatainSession(sessionID, bookingData){
        return await SessionModel.storePackDatainSession(sessionID, bookingData)
    }

    async storeActivityDatainSession(sessionID, bookingData){
        return await SessionModel.storeActivityDatainSession(sessionID, bookingData)
    }

    async generateSessionWithPackData(bookingData){
        const sessionID = uuidv4().toString()
        await SessionModel.genSesWithPackData(sessionID, bookingData)
        return sessionID
    }

    async generateSessionWithActivityData(bookingData){
        const sessionID = uuidv4().toString()
        await SessionModel.genSesWithActivityData(sessionID, bookingData)
        return sessionID
    }

    async storeMakFerryinSession(sessionID, makFerryData){
        return await SessionModel.storeMakFerryinSession(sessionID, makFerryData)
    }

    async generateSessionWithMakFerry(makFerryData){
        const sessionID = uuidv4().toString()
        await SessionModel.genSesWithMakFerry(sessionID, makFerryData)
        return sessionID
    }

    async getCheckoutData(sessionToken, JWTFunction){
        if(!sessionToken){
            return
        }
        const {sessionID} = await JWTFunction.JWTSession.verify(sessionToken)
        if(!sessionID){
            return
        }
        return await SessionModel.getCheckoutData(sessionID)
    }

    async storeBookingIdinSession(bookingId, sessionId){

        const storeBookinginSession = await SessionModel.storeBookingIdinSession(bookingId, sessionId)
        return storeBookinginSession

    }

    async changeBookingStatusSession(sessionId, bookingPaymentStatus){

        const storeBookinginSession = await SessionModel.storeBookingIdinSession(sessionId, bookingPaymentStatus)
        return storeBookinginSession

    }

}

export default new sessionService()