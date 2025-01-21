import { destinationFormSchema, packageFormSchema } from '../validator/validation.schema.js'
import { ErrorHandler } from "../errors/ErrorHandler.js";
import inquiryService from "../services/inquiry-service.js"

class inquiryController{

    async packageForm({body, request}){
        const {packageId, packageOptionId, name, phonenumber, email, tripDate, tripDuration, traveler} = (request.aws && JSON.parse(request.aws.body)) || body || {}

        const validationResult = packageFormSchema.validate({packageId, packageOptionId, name, phonenumber, email, tripDate, tripDuration, traveler});
        if(validationResult.error){
            const errorDetail = validationResult.error.details[0]
            let errorMessage = errorDetail.message.replace(/["\\]/g, '');

            if(errorDetail.type === "string.pattern.base" || errorDetail.type === "any.invalid" || errorDetail.type === "any.only" || errorDetail.type === "date.base" || errorDetail.type === "date.min"){
                ErrorHandler.validationError(errorMessage, 422)
            }
            if(errorDetail.type === "any.required"){
                ErrorHandler.notFoundError(errorMessage, 404)
            }
            ErrorHandler.validationError("Not Acceptable", 422)
        }
        const inqData = {packageId, packageOptionId, name, phonenumber, email, tripDate, tripDuration, traveler}
        const isSuccessSave = await inquiryService.storePackageInquiry(inqData)

        if(!isSuccessSave){
            ErrorHandler.internalServerError("can't store the data...")
        }

        return { ststus:"success", ststusCode:"200" }


    }

    async destinationForm({body, request}){
        const {destinationId, name, phonenumber, email, tripDate, tripDuration, traveler} = (request.aws && JSON.parse(request.aws.body)) || body || {}

        const validationResult = destinationFormSchema.validate({destinationId, name, phonenumber, email, tripDate, tripDuration, traveler});
        if(validationResult.error){
            const errorDetail = validationResult.error.details[0]
            let errorMessage = errorDetail.message.replace(/["\\]/g, '');

            if(errorDetail.type === "string.pattern.base" || errorDetail.type === "any.invalid" || errorDetail.type === "any.only" || errorDetail.type === "date.base" || errorDetail.type === "date.min"){
                ErrorHandler.validationError(errorMessage, 422)
            }
            if(errorDetail.type === "any.required"){
                ErrorHandler.notFoundError(errorMessage, 404)
            }
            ErrorHandler.validationError("Not Acceptable", 422)
        }

        const inqData = {destinationId, name, phonenumber, email, tripDate, tripDuration, traveler}
        const isSuccessSave = await inquiryService.storeDestinationInquiry(inqData)

        if(!isSuccessSave){
            ErrorHandler.internalServerError("can't store the data...")
        }

        return { ststus:"success", ststusCode:"200" }


    }
}

export default new inquiryController()