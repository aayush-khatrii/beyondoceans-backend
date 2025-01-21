import { ErrorHandler } from '../errors/ErrorHandler.js';
import { phoneOTPschema, emailOTPschema, intEmailOTPschema} from '../validator/validation.schema.js'
import otpService from '../services/otp-service.js'
import hashService from '../services/hash-service.js'
import sendService from '../services/send-service.js'
import { Constants } from "../config/constants.js"
import userService from '../services/userAuth-service.js';

class notificationController{

    async sendPhoneOTP({request, body}){

        const { phone, country } = (request.aws && JSON.parse(request.aws.body)) || body || {}
        //step:1 = Validate phone and the phone hase valid country
        const validationResult = phoneOTPschema.validate({phone, country});

        if(validationResult.error){
            const errorDetail = validationResult.error.details[0]
            let errorMessage = errorDetail.message.replace(/["\\]/g, '');

            if(errorDetail.type === "string.pattern.base"){
                ErrorHandler.validationError(errorMessage, 422)
            }
            if(errorDetail.type === "any.required"){
                ErrorHandler.notFoundError(errorMessage, 404)
            }
            ErrorHandler.validationError("Not Acceptable", 422)
        }

        //step:3 = generate OTP
        const otp = await otpService.genarateOtp()

        //step:4 = generate HASH
        const ttl = Constants.TTL;
        const expires = Date.now() + ttl;
        const data = `${phone}.${expires}.${country}.${otp}`; 

        const hash = hashService.hashOtp(data)

        // step:5 = Send OTP to Phone
        const sendOTPSMS = await sendService.sendOTPSMS(phone, otp)
        console.log(sendOTPSMS)
        if(!sendOTPSMS.return){
            ErrorHandler.internalServerError("Can't send OTP to given Phone.(NC)", 500411)
        }
        console.log("Phone",otp)
        return { phone, country, hash: `${hash}.${expires}`}
    }
    

    async sendEmailOTP({request, body}){
        const { email, country } = (request.aws && JSON.parse(request.aws.body)) || body || {}

        //step:1 = Validate phone and the phone hase valid country
        const validationResult = emailOTPschema.validate({email, country});

        if(validationResult.error){
            const errorDetail = validationResult.error.details[0]
            let errorMessage = errorDetail.message.replace(/["\\]/g, '');

            if(errorDetail.type === "string.pattern.base"){
                ErrorHandler.validationError(errorMessage, 422)
            }
            if(errorDetail.type === "any.required"){
                ErrorHandler.notFoundError(errorMessage, 404)
            }
            ErrorHandler.validationError("Not Acceptable", 422)
        }

        //step:3 = generate OTP
        const otp = await otpService.genarateOtp()

        //step:4 = generate HASH
        const ttl = Constants.TTL;
        const expires = Date.now() + ttl;
        const data = `${email}.${expires}.${country}.${otp}`; 

        const hash = hashService.hashOtp(data)

        // step:5 = Send OTP to Email
        const sendEmailOTP = await sendService.sendEmailOTP(email, otp)
        if(!sendEmailOTP){
            ErrorHandler.internalServerError("Can't send OTP to given Email.(NC)", 500412)
        }

        console.log("Email",otp)
        return { email, country, hash: `${hash}.${expires}`}
    }

    async sendINTEmailOTP({request, body}){

        const { phone, email, country } = (request.aws && JSON.parse(request.aws.body)) || body || {}

        //step:1 = Validate phone and the phone hase valid country
        const validationResult = intEmailOTPschema.validate({phone, email, country});

        if(validationResult.error){
            const errorDetail = validationResult.error.details[0]
            let errorMessage = errorDetail.message.replace(/["\\]/g, '');

            if(errorDetail.type === "string.pattern.base" || errorDetail.type === "any.invalid"){
                ErrorHandler.validationError(errorMessage, 422)
            }
            if(errorDetail.type === "any.required"){
                ErrorHandler.notFoundError(errorMessage, 404)
            }
            ErrorHandler.validationError("Not Acceptable", 422)
        }

        //step:3 = generate OTP
        const otp = await otpService.genarateOtp()

        //step:4 = generate HASH
        const ttl = Constants.TTL;
        const expires = Date.now() + ttl;
        const data = `${phone}.${email}.${expires}.${country}.${otp}`; 

        const hash = hashService.hashOtp(data)

        await userService.findbyIntEmail({phone, email})

        //step:5 = Send OTP to Email
        const sendEmailOTP = await sendService.sendEmailOTP(email, otp)
        if(!sendEmailOTP){
            ErrorHandler.internalServerError("Can't send OTP to given Email.(NC)", 500413)
        }

        console.log("int Email",otp)
        return { phone, email, country, hash: `${hash}.${expires}`}
    }
}

export default new notificationController();