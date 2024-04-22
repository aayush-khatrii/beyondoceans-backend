import { ErrorHandler } from '../errors/ErrorHandler.js';
import { phoneOTPschema, emailOTPschema} from '../validator/validation.schema.js'
import otpService from '../services/otp-service.js'
import hashService from '../services/hash-service.js'
import { Constants } from "../config/constants.js"

class notificationController{
    async sendPhoneOTP(req){
        const { phone, country} = req.body || {}
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
        const data = `${phone}.${expires}.${otp}`; 

        const hash = hashService.hashOtp(data)

        //step:5 = Send OTP to Phone

        return { phone, otp, hash: `${hash}.${expires}`}
    }
    

    async sendEmailOTP(req){
        const { email, country} = req.body || {}

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
            ErrorHandler.validationError(errorDetail.message, 422)
        }

        //step:3 = generate OTP
        const otp = await otpService.genarateOtp()

        //step:4 = generate HASH
        const ttl = Constants.TTL;
        const expires = Date.now() + ttl;
        const data = `${email}.${expires}.${otp}`; 

        const hash = hashService.hashOtp(data)

        //step:5 = Send OTP to Email

        return { email, otp, hash: `${hash}.${expires}`}
    }

    async sendINTEmailOTP(req){
      
    }
}

export default new notificationController();