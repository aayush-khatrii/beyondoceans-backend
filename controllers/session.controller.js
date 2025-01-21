import { SesStoreMakCheckoutSchema, SesStorePackschema, SesStoreActivityschema, SesStoreNtkCheckoutSchema } from '../validator/validation.schema.js'
import sessionService from "../services/session-service.js"
import { ErrorHandler } from "../errors/ErrorHandler.js";

class sessionController{
    
    async sessionStorePackData({ body, request, cookie, sessionTokenjwt }){

        const JWTFunction = {
            JWTSession: sessionTokenjwt
        }
        const ClientSessionToken = cookie.sessionToken

        const { packageId, packageOptionId, travelDate, traveler, packagePrice, bookingPrice } = (request.aws && JSON.parse(request.aws.body)) || body || {}
        
        const PackDataValidation = SesStorePackschema.validate({ packageId, packageOptionId, travelDate, traveler, packagePrice, bookingPrice });

        if(PackDataValidation.error){
            const errorDetail = PackDataValidation.error.details[0]
            let errorMessage = errorDetail.message.replace(/["\\]/g, '');

            if(errorDetail.type === "string.pattern.base"  || errorDetail.type === "number.min" || errorDetail.type === "number.max"){
                ErrorHandler.validationError(errorMessage, 422)
            }
            if(errorDetail.type === "any.required"){
                ErrorHandler.notFoundError(errorMessage, 404)
            }
            ErrorHandler.validationError("Not Acceptable", 422)
        }

        const bookingData = { packageId, packageOptionId, travelDate, traveler, packagePrice, bookingPrice }

        let sessionID;

        const sessionData = await sessionService.checkSession(ClientSessionToken.value, JWTFunction)

        if(sessionData){
            await sessionService.storePackDatainSession(sessionData.Session_Id, bookingData)
            sessionID = sessionData.Session_Id

        }else if(!sessionData){
            const newSessionID = await sessionService.generateSessionWithPackData(bookingData)
            sessionID = newSessionID
        }

        const sessionToken = await sessionService.createSessionToken(sessionID, JWTFunction)

        ClientSessionToken.set({
            value: sessionToken,
            maxAge: 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: 'none',
            secure: true
        })
        
        return { ststus:"success", ststusCode:"200" }
    }

    async sessionStoreActivityData({ body, request, cookie, sessionTokenjwt }){

        const JWTFunction = {
            JWTSession: sessionTokenjwt
        }
        const ClientSessionToken = cookie.sessionToken

        const { activityId, activityOptionId, travelDate, traveler, activityPrice, bookingPrice } = (request.aws && JSON.parse(request.aws.body)) || body || {}
        
        const PackDataValidation = SesStoreActivityschema.validate({ activityId, activityOptionId, travelDate, traveler, activityPrice, bookingPrice });

        if(PackDataValidation.error){
            const errorDetail = PackDataValidation.error.details[0]
            let errorMessage = errorDetail.message.replace(/["\\]/g, '');

            if(errorDetail.type === "string.pattern.base"  || errorDetail.type === "number.min" || errorDetail.type === "number.max"){
                ErrorHandler.validationError(errorMessage, 422)
            }
            if(errorDetail.type === "any.required"){
                ErrorHandler.notFoundError(errorMessage, 404)
            }
            ErrorHandler.validationError("Not Acceptable", 422)
        }

        const bookingData = { activityId, activityOptionId, travelDate, traveler, activityPrice, bookingPrice }

        let sessionID;

        const sessionData = await sessionService.checkSession(ClientSessionToken.value, JWTFunction)

        if(sessionData){
            await sessionService.storeActivityDatainSession(sessionData.Session_Id, bookingData)
            sessionID = sessionData.Session_Id

        }else if(!sessionData){
            const newSessionID = await sessionService.generateSessionWithActivityData(bookingData)
            sessionID = newSessionID
        }

        const sessionToken = await sessionService.createSessionToken(sessionID, JWTFunction)

        ClientSessionToken.set({
            value: sessionToken,
            maxAge: 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: 'none',
            secure: true
        })
        
        return { ststus:"success", ststusCode:"200" }
    }


    async sessionStoreMakFerryCheckout({ body, request, cookie, sessionTokenjwt, set }){

        const JWTFunction = {
            JWTSession: sessionTokenjwt
        }

        const ClientSessionToken = cookie.sessionToken

        const { Ferry_Operator, Ferry_Data, Traveler } = (request.aws && JSON.parse(request.aws.body)) || body || {}

        const ferryCheckoutDataValidation = SesStoreMakCheckoutSchema.validate({ Ferry_Operator, Ferry_Data, Traveler });

        if(ferryCheckoutDataValidation.error){
            const errorDetail = ferryCheckoutDataValidation.error.details[0]
            let errorMessage = errorDetail.message.replace(/["\\]/g, '');

            if(errorDetail.type === "number.min" || errorDetail.type === "number.max"){
                ErrorHandler.validationError(errorMessage, 422)
            }
            if(errorDetail.type === "any.required"){
                ErrorHandler.notFoundError(errorMessage, 404)
            }
            ErrorHandler.validationError("Not Acceptable", 422)
        }

        const makFerrySesData = { Ferry_Operator, Ferry_Data, Traveler }


        let sessionID;

        const sessionData = await sessionService.checkSession(ClientSessionToken.value, JWTFunction)
        
        if(sessionData){
            await sessionService.storeMakFerryinSession(sessionData.Session_Id, makFerrySesData )
            sessionID = sessionData.Session_Id

        }else if(!sessionData){
            const newSessionID = await sessionService.generateSessionWithMakFerry(makFerrySesData)
            sessionID = newSessionID
        }

        const sessionToken = await sessionService.createSessionToken(sessionID, JWTFunction)
        console.log(sessionToken)

        ClientSessionToken.set({
            value: sessionToken,
            maxAge: 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: 'none',
            secure: true
        })
    
        
        return { ststus:"success", ststusCode:"200" }
    }

    async sessionStoreNtkFerryCheckout({ body, request, cookie, sessionTokenjwt, set }){

        const JWTFunction = {
            JWTSession: sessionTokenjwt
        }

        const ClientSessionToken = cookie.sessionToken

        const { Ferry_Operator, Ferry_Data, Traveler } = (request.aws && JSON.parse(request.aws.body)) || body || {}

        const ferryCheckoutDataValidation = SesStoreNtkCheckoutSchema.validate({ Ferry_Operator, Ferry_Data, Traveler });

        if(ferryCheckoutDataValidation.error){
            const errorDetail = ferryCheckoutDataValidation.error.details[0]
            let errorMessage = errorDetail.message.replace(/["\\]/g, '');

            if(errorDetail.type === "number.min" || errorDetail.type === "number.max"){
                ErrorHandler.validationError(errorMessage, 422)
            }
            if(errorDetail.type === "any.required"){
                ErrorHandler.notFoundError(errorMessage, 404)
            }
            ErrorHandler.validationError("Not Acceptable", 422)
        }

        const ntkFerrySesData = { Ferry_Operator, Ferry_Data, Traveler }

        let sessionID;

        const sessionData = await sessionService.checkSession(ClientSessionToken.value, JWTFunction)
        
        if(sessionData){
            await sessionService.storeMakFerryinSession(sessionData.Session_Id, ntkFerrySesData )
            sessionID = sessionData.Session_Id

        }else if(!sessionData){
            const newSessionID = await sessionService.generateSessionWithMakFerry(ntkFerrySesData)
            sessionID = newSessionID
        }

        const sessionToken = await sessionService.createSessionToken(sessionID, JWTFunction)

        ClientSessionToken.set({
            value: sessionToken,
            maxAge: 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: 'none',
            secure: true
        })
        
        return { ststus:"success", ststusCode:"200" }
    }

    async sesGetPackageCheckout({ body, request, cookie, sessionTokenjwt }){

        const JWTFunction = {
            JWTSession: sessionTokenjwt
        }

        const ClientSessionToken = cookie.sessionToken

        const packageBookingData = await sessionService.getCheckoutData(ClientSessionToken.value, JWTFunction)

        if(!packageBookingData){
            ErrorHandler.notFoundError("Package is not in cart!")
        }

        if(!packageBookingData.Checkout){
            ErrorHandler.notFoundError("Package is not in cart!")
        }

        const sessionCheckoutData = {
            Session_Id : packageBookingData.Session_Id,
            Package_Checkout: packageBookingData.Checkout.Package,
        }

        return { ststus:"success", ststusCode:"200" , data: sessionCheckoutData }
    }

    async sesGetActivityCheckout({ body, request, cookie, sessionTokenjwt }){

        const JWTFunction = {
            JWTSession: sessionTokenjwt
        }

        const ClientSessionToken = cookie.sessionToken

        const activityBookingData = await sessionService.getCheckoutData(ClientSessionToken.value, JWTFunction)

        if(!activityBookingData){
            ErrorHandler.notFoundError("Activity is not in cart!")
        }

        if(!activityBookingData.Checkout){
            ErrorHandler.notFoundError("Activity is not in cart!")
        }

        if(!activityBookingData.Checkout.Activity){
            ErrorHandler.notFoundError("Activity is not in cart!")
        }

        const sessionCheckoutData = {
            Session_Id : activityBookingData.Session_Id,
            Activity_Checkout: activityBookingData.Checkout.Activity,
        }

        return { ststus:"success", ststusCode:"200" , data: sessionCheckoutData }
    }

    async sesGetFerryCheckout({ body, request, cookie, sessionTokenjwt }){

        const JWTFunction = {
            JWTSession: sessionTokenjwt
        }

        const ClientSessionToken = cookie.sessionToken

        const ferryBookingData = await sessionService.getCheckoutData(ClientSessionToken.value, JWTFunction)

        if(!ferryBookingData){
            ErrorHandler.notFoundError("Ferry is not in cart!")
        }

        if(!ferryBookingData.Checkout){
            ErrorHandler.notFoundError("Ferry is not in cart!")
        }

        if(!ferryBookingData.Checkout.Ferry){
            ErrorHandler.notFoundError("Ferry is not in cart!")
        }

        const sessionCheckoutData = {
            Session_Id : ferryBookingData.Session_Id,
            Ferry_Checkout: ferryBookingData.Checkout.Ferry,
        }

        return { ststus:"success", ststusCode:"200" , data: sessionCheckoutData }
    }
}

export default new sessionController()