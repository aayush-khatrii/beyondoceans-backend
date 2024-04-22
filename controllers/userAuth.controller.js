import otpService from '../services/otp-service.js'
import { phoneLoginschema, emailLoginschema } from '../validator/validation.schema.js'
import userService from "../services/userAuth-service.js"
import tokenService from "../services/token-service.js"
import sessionService from "../services/session-service.js"
import { ErrorHandler } from "../errors/ErrorHandler.js";
import { v4 as uuidv4 } from 'uuid';

class userAuthController{

    async phoneSignin(req){

        const JWTFunction = {
            JWTAccess: req.accessTokenjwt,
            JWTRefresh: req.refreshTokenjwt,
            JWTSession: req.sessionTokenjwt
        }
        const ClientAccessToken = req.cookie.accessToken
        const ClientRefreshToken = req.cookie.refreshToken
        const ClientSessionToken = req.cookie.sessionToken

        const { phone, country, otp, hash} = req.body || {}

        //step:1 = Validate phone, hash, otp and country is avalible
        const phoneSignInValidation = phoneLoginschema.validate({ phone, country, otp, hash });

        if(phoneSignInValidation.error){
            const errorDetail = phoneSignInValidation.error.details[0]
            let errorMessage = errorDetail.message.replace(/["\\]/g, '');

            if(errorDetail.type === "string.pattern.base"  || errorDetail.type === "number.min" || errorDetail.type === "number.max"){
                ErrorHandler.validationError(errorMessage, 422)
            }
            if(errorDetail.type === "any.required"){
                ErrorHandler.notFoundError(errorMessage, 404)
            }
            ErrorHandler.validationError("Not Acceptable", 422)
        }

        //step:2 = Validate OTP with Hash
        const [hashedData, expires] = hash.split('.')
        if (Date.now() > +expires){
            ErrorHandler.validationError("OTP is Expired", 422111)
        }

        const resData = `${phone}.${expires}.${otp}`
        const isValid = await otpService.validateOTP(hashedData, resData)
        if (!isValid){
            ErrorHandler.validationError("Invalid OTP", 422112)
        }

        //step:3 = create the user if user is not avalible
        const userCreationData = { userId: uuidv4().toString(), phone, country }
        let user;
        
        user = await userService.findbyPhone(phone)
        if(!user){
            user = await userService.createUserbyPhone(userCreationData)
        }

        if(!user){
            ErrorHandler.internalServerError(undefined, 500113)
        }

        //step:4 = create access and refresh token
        const {accessToken, refreshToken} = await tokenService.generateTokens({ payload:user.User_Id, JWTFunction});

        await tokenService.deleteRefToken(ClientRefreshToken.value, JWTFunction, user.User_Id)

        await tokenService.storeRefreshToken(user.User_Id, refreshToken)


        let sessionID;
        //step:5 = check session
        const sessionData = await sessionService.checkSession(ClientSessionToken.value, JWTFunction)

        //step:6 = if session is avalible then update user ID if not create new session ID and create session token
        if(sessionData){
            await sessionService.addUserIdinSession(data.sessionID, user.User_Id)
            sessionID = sessionData.Session_Id

        }else if(!sessionData){
            const newSessionID = await sessionService.generateSessionWithID(user.User_Id)
            sessionID = newSessionID
        }

        const sessionToken = await sessionService.createSessionToken(sessionID, JWTFunction)
        
        //step:8 = store Tokens
        ClientAccessToken.set({
            value: accessToken,
            maxAge: 60 * 60 * 24 * 30,
            httpOnly: true
        })

        ClientRefreshToken.set({
            value: refreshToken,
            maxAge: 60 * 60 * 24 * 30,
            httpOnly: true
        })

        ClientSessionToken.set({
            value: sessionToken,
            maxAge: 60 * 60 * 24 * 30,
            httpOnly: true
        })

        // Note (23/04/2024 2.32 AM) : add user authantication lavel in user account like lavel 1 that lavel user is only provided only
        // one thing or a phone or email. and following that lavel 2 given more ditels like that
        
        return { ststus:"success", ststusCode:"200" , data: user }
    }

    async emailSignin(req){

        const { email, country, otp, hash} = req.body || {}

        //step:1 = Validate phone, hash, otp and country is avalible
        const phoneSignInValidation = emailLoginschema.validate({ email, country, otp, hash });

        if(phoneSignInValidation.error){
            const errorDetail = phoneSignInValidation.error.details[0]
            let errorMessage = errorDetail.message.replace(/["\\]/g, '');

            if(errorDetail.type === "string.pattern.base"  || errorDetail.type === "number.min" || errorDetail.type === "number.max"){
                ErrorHandler.validationError(errorMessage, 422)
            }
            if(errorDetail.type === "any.required"){
                ErrorHandler.notFoundError(errorMessage, 404)
            }
            ErrorHandler.validationError("Not Acceptable", 422)
        }

        //step:2 = Validate OTP with Hash
        const [hashedData, expires] = hash.split('.')
        if (Date.now() > +expires){
            ErrorHandler.validationError("OTP is Expired", 422114)
        }

        const resData = `${email}.${expires}.${otp}`
        const isValid = await otpService.validateOTP(hashedData, resData)
        if (!isValid){
            ErrorHandler.validationError("Invalid OTP", 422115)
        }

        //step:3 = create the user if user is not avalible
        const userCreationData = { userId: uuidv4().toString(), email, country }
        let user;
        
        user = await userService.findbyEmail(email)
        if(!user){
            user = await userService.createUserbyEmail(userCreationData)
        }

        if(!user){
            ErrorHandler.internalServerError(undefined, 500116)
        }
        //step:4 = check session
        
        //step:5 = if session is avalible then update user ID if not create new session ID and create session token
        //step:6 = create access and refresh token
        //step:7 = store Tokens
        
        return { ststus:"success", data: user }
    }
}

export default new userAuthController();