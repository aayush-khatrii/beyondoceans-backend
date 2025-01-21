import otpService from '../services/otp-service.js'
import { phoneLoginschema, emailLoginschema, intEmailLoginschema, updateReqschema } from '../validator/validation.schema.js'
import userService from "../services/userAuth-service.js" 
import tokenService from "../services/token-service.js"
import sessionService from "../services/session-service.js"
import { ErrorHandler } from "../errors/ErrorHandler.js";
import { v4 as uuidv4 } from 'uuid';

class userAuthController{

    async phoneSignin({body, request, cookie, accessTokenjwt, refreshTokenjwt, sessionTokenjwt}){

        const JWTFunction = {
            JWTAccess: accessTokenjwt,
            JWTRefresh: refreshTokenjwt,
            JWTSession: sessionTokenjwt
        }

        const ClientAccessToken = cookie.accessToken
        const ClientRefreshToken = cookie.refreshToken
        const ClientSessionToken = cookie.sessionToken
        const authToken = cookie.isAuthToken

        const { phone, country, otp, hash} = (request.aws && JSON.parse(request.aws.body)) || body || {}

        //step:1 = Validate phone, hash, otp and country is avalible
        const phoneSignInValidation = phoneLoginschema.validate({ phone, country, otp, hash });

        if(phoneSignInValidation.error){
            const errorDetail = phoneSignInValidation.error.details[0]
            let errorMessage = errorDetail.message.replace(/["\\]/g, '');

            if(errorDetail.type === "string.pattern.base" || errorDetail.type === "any.only" || errorDetail.type === "number.min" || errorDetail.type === "number.max"){
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

        const resData = `${phone}.${expires}.${country}.${otp}`; 
        const isValid = await otpService.validateOTP(hashedData, resData)
        if (!isValid){
            ErrorHandler.validationError("Invalid OTP", 422112)
        }

        //step:3 = create the user if user is not avalible
        const userCreationData = { userId: uuidv4().toString(), phone, country, Auth_Lv: "Lv1" }
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
            await sessionService.addUserIdinSession(sessionData.Session_Id, sessionData.User_Id, user.User_Id )
            sessionID = sessionData.Session_Id

        }else if(!sessionData){
            const newSessionID = await sessionService.generateSessionWithID(user.User_Id)
            sessionID = newSessionID
        }

        const sessionToken = await sessionService.createSessionToken(sessionID, JWTFunction)
        
        //step:8 = store Tokens
        ClientAccessToken.set({
            value: accessToken,
            maxAge: 60 * 60 * 24,
            sameSite: 'none',
            httpOnly: true,
            secure: true
        })

        ClientRefreshToken.set({
            value: refreshToken,
            maxAge: 60 * 60 * 24 * 3,
            sameSite: 'none',
            httpOnly: true,
            secure: true
        })

        ClientSessionToken.set({
            value: sessionToken,
            maxAge: 60 * 60 * 24 * 30,
            sameSite: 'none',
            httpOnly: true,
            secure: true
        })

        authToken.set({
            value: true,
            maxAge: 60 * 60 * 24 * 2,
            sameSite: 'none',
            httpOnly: true,
            secure: true
        })
        
        return { ststus:"success", ststusCode:"200" , data: user }
    }

    async emailSignin({body, request, cookie, accessTokenjwt, refreshTokenjwt, sessionTokenjwt}){

        const JWTFunction = {
            JWTAccess: accessTokenjwt,
            JWTRefresh: refreshTokenjwt,
            JWTSession: sessionTokenjwt
        }
        const ClientAccessToken = cookie.accessToken
        const ClientRefreshToken = cookie.refreshToken
        const ClientSessionToken = cookie.sessionToken
        const authToken = cookie.isAuthToken


        const { email, country, otp, hash} = (request.aws && JSON.parse(request.aws.body)) || body || {}

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
        
        const resData = `${email}.${expires}.${country}.${otp}`; 
        const isValid = await otpService.validateOTP(hashedData, resData)
        if (!isValid){
            ErrorHandler.validationError("Invalid OTP", 422115)
        }

        //step:3 = create the user if user is not avalible
        const userCreationData = { userId: uuidv4().toString(), email, country, Auth_Lv: "Lv1" }
        let user;
        
        user = await userService.findbyEmail(email)
        if(!user){
            user = await userService.createUserbyEmail(userCreationData)
        }

        if(!user){
            ErrorHandler.internalServerError(undefined, 500116)
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
            await sessionService.addUserIdinSession(sessionData.Session_Id, sessionData.User_Id, user.User_Id )
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
            sameSite: 'none',
            httpOnly: true,
            secure: true
        })

        ClientRefreshToken.set({
            value: refreshToken,
            maxAge: 60 * 60 * 24 * 30,
            sameSite: 'none',
            httpOnly: true,
            secure: true
        })

        ClientSessionToken.set({
            value: sessionToken,
            maxAge: 60 * 60 * 24 * 30,
            sameSite: 'none',
            httpOnly: true,
            secure: true
        })

        authToken.set({
            value: true,
            maxAge: 60 * 60 * 24 * 2,
            sameSite: 'none',
            httpOnly: true,
            secure: true
        })
        
        return { ststus:"success", ststusCode:"200" , data: user }
    }

    async intEmailSignin({body, request, cookie, accessTokenjwt, refreshTokenjwt, sessionTokenjwt}){

        const JWTFunction = {
            JWTAccess: accessTokenjwt,
            JWTRefresh: refreshTokenjwt,
            JWTSession: sessionTokenjwt
        }
        const ClientAccessToken = cookie.accessToken
        const ClientRefreshToken = cookie.refreshToken
        const ClientSessionToken = cookie.sessionToken
        const authToken = cookie.isAuthToken

        const { phone, email, country, otp, hash} = (request.aws && JSON.parse(request.aws.body)) || body || {}

        //step:1 = Validate phone, hash, otp and country is avalible
        const phoneSignInValidation = intEmailLoginschema.validate({ phone, email, country, otp, hash });
        if(phoneSignInValidation.error){
            const errorDetail = phoneSignInValidation.error.details[0]
            let errorMessage = errorDetail.message.replace(/["\\]/g, '');

            if(errorDetail.type === "string.pattern.base"  || errorDetail.type === "number.min" || errorDetail.type === "number.max" || errorDetail.type === "any.invalid"){
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
        
        const resData = `${phone}.${email}.${expires}.${country}.${otp}`; 
        const isValid = await otpService.validateOTP(hashedData, resData)
        if (!isValid){
            ErrorHandler.validationError("Invalid OTP", 422115)
        }

        //step:3 = create the user if user is not avalible
        const userCreationData = { userId: uuidv4().toString(), phone, email, country, Auth_Lv: "IntLv1" }
        let user;
        
        user = await userService.findbyIntEmail({phone, email})
        if(!user){
            user = await userService.createUserbyIntEmail(userCreationData)
        }

        if(!user){
            ErrorHandler.internalServerError(undefined, 500116)
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
            await sessionService.addUserIdinSession(sessionData.Session_Id, sessionData.User_Id, user.User_Id )
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
            sameSite: 'none',
            httpOnly: true,
            secure: true
        })

        ClientRefreshToken.set({
            value: refreshToken,
            maxAge: 60 * 60 * 24 * 30,
            sameSite: 'none',
            httpOnly: true,
            secure: true
        })

        ClientSessionToken.set({
            value: sessionToken,
            maxAge: 60 * 60 * 24 * 30,
            sameSite: 'none',
            httpOnly: true,
            secure: true
        })

        authToken.set({
            value: true,
            maxAge: 60 * 60 * 24 * 2,
            sameSite: 'none',
            httpOnly: true,
            secure: true
        })
        
        return { ststus:"success", ststusCode:"200" , data: user }
    }

    async routeProtector({ body, request, cookie, refreshTokenjwt }){

        const JWTFunction = {
            JWTRefresh: refreshTokenjwt
        }
        
        const ClientRefreshToken = cookie.refreshToken
        const authToken = cookie.isAuthToken

        if(!authToken) ErrorHandler.notFoundError("Unauthorized Access", 401117, 401)
        if(!ClientRefreshToken) ErrorHandler.notFoundError("Unauthorized Access", 401118, 401)

        const userId = await tokenService.getUserIDfromRefToken(ClientRefreshToken.value, JWTFunction)
        
        if (!userId) return {auth: false}

        const isAuth = await userService.isUserAvalible(userId)
        return {auth: isAuth}

    }

    async autoAuth({ body, request, cookie, refreshTokenjwt }){

        const JWTFunction = {
            JWTRefresh: refreshTokenjwt
        }

        const ClientAccessToken = cookie.accessToken
        const ClientRefreshToken = cookie.refreshToken
        const ClientSessionToken = cookie.sessionToken
        const authToken = cookie.isAuthToken

        if(!authToken.value) {
            ErrorHandler.notFoundError("Unauthorized Access", 401119, 401)
            return
        }

        if(!ClientRefreshToken.value) {
            ErrorHandler.notFoundError("Unauthorized Access", 401119, 401)
            return
        }

        const userId = await tokenService.getUserIDfromRefToken(ClientRefreshToken.value, JWTFunction)

        if (!userId) return {auth: false}
        const user = await userService.findbyUserId(userId)

        if(!user){
            ClientAccessToken.set({
                value: "",
                maxAge: 0,
                sameSite: 'none',
                httpOnly: true,
                secure: true
            })
            ClientRefreshToken.set({
                value: "",
                maxAge: 60 * 60 * 24 * 30,
                sameSite: 'none',
                httpOnly: true,
                secure: true
            })
            authToken.set({
                value: "",
                maxAge: 0,
                sameSite: 'none',
                httpOnly: true,
                secure: true
            })
            ErrorHandler.notFoundError("User is not avalible", 4041110)
        }

        return { ststus:"success", ststusCode:"200" , data: user }

    }

    async updateProfile({body, request, cookie, accessTokenjwt}){
        
        const JWTFunction = {
            JWTAccess: accessTokenjwt,
        }

        const ClientAccessToken = cookie.accessToken

        const updateReqData = (request.aws && JSON.parse(request.aws.body)) || body || {}

        const updateReqValidation = updateReqschema.validate(updateReqData);
        
        if(updateReqValidation.error){
            const errorDetail = updateReqValidation.error.details[0]
            let errorMessage = errorDetail.message.replace(/["\\]/g, '');
            if(errorDetail.type === "string.pattern.base"  || errorDetail.type === "number.min" || errorDetail.type === "number.max" || errorDetail.type === "any.invalid"){
                ErrorHandler.validationError(errorMessage, 422)
            }
            if(errorDetail.type === "any.required"){
                ErrorHandler.notFoundError(errorMessage, 404)
            }
            
            ErrorHandler.validationError(errorMessage, 422)
        }

        const userId = await tokenService.getUserIDfromAccToken(ClientAccessToken.value, JWTFunction)
        // const userId = "258d05bc-19f4-494e-806e-cf5adc481927"


        if(!userId) ErrorHandler.notFoundError("User is not Avalible to Update", 4041111)
        

        const updateUserData = await userService.updateUserProfile(updateReqData, userId)
        return updateUserData

    }

    async logout({ body, request, cookie, refreshTokenjwt }){

        const JWTFunction = {
            JWTRefresh: refreshTokenjwt
        }

        const ClientAccessToken = cookie.accessToken
        const ClientRefreshToken = cookie.refreshToken
        const ClientSessionToken = cookie.sessionToken
        const authToken = cookie.isAuthToken

        const userId = await tokenService.getUserIDfromRefToken(ClientRefreshToken.value, JWTFunction)

        if(userId){
            await tokenService.removeRefreshTokenfromDB(userId)
        }

        ClientAccessToken.set({
            value: "",
            maxAge: 0,
            sameSite: 'none',
            httpOnly: true,
            secure: true
        })
        ClientRefreshToken.set({
            value: "",
            maxAge: 60 * 60 * 24 * 30,
            sameSite: 'none',
            httpOnly: true,
            secure: true
        })
        authToken.set({
            value: "",
            maxAge: 0,
            sameSite: 'none',
            httpOnly: true,
            secure: true
        })

        return { ststus:"success", ststusCode:"200" , data: "logged Out!" }
    }

    
}

export default new userAuthController();