import { ErrorHandler } from '../errors/ErrorHandler.js'
import packageService from '../services/package-service.js'
import { fatchSinglePackschema, fatchFilterPackschema, fatchFeaturedPackSchema } from '../validator/validation.schema.js'
import { fatchHotelSchema } from '../validator/validation.schema.js'

class packageController{
    async getAllPackage(){
        const allPackages = await packageService.fetchAllPackages()
        return { ststus:"success", ststusCode:"200" , data: allPackages }
    }

    async getFilterPackages({params}){

        const { category } = params
        const validationResult = fatchFilterPackschema.validate({ category });

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

        const allFilterPackages = await packageService.fetchFilterPackages(category)

        if(!allFilterPackages){
            return { ststus:"success", ststusCode:"200" , data: "Not Found" }
        }

        return { ststus:"success", ststusCode:"200" , data: allFilterPackages }
    }

    async getSinglePackage({request, body}){

        const { packageId } = (request.aws && JSON.parse(request.aws.body)) || body || {}

        const validationResult = fatchSinglePackschema.validate({ packageId });
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

        const packageData = await packageService.fetchSinglePackages(packageId)

        if(!packageData){
            ErrorHandler.notFoundError("Sorry, package data not found...")
        }

        return { ststus:"success", ststusCode:"200" , data: packageData }

    }

    async getHotels({request, body}){

        const { hotelIds } = (request.aws && JSON.parse(request.aws.body)) || body || {}

        const validationResult = fatchHotelSchema.validate({ hotelIds });
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

        const hotelData = await packageService.fetchOptionHotels(hotelIds)

        if(!hotelData){
            ErrorHandler.notFoundError("Sorry, package data not found...")
        }

        return { ststus:"success", ststusCode:"200" , data: hotelData }
    }


    async getFeaturedPackages({request, body}){

        const { category } = (request.aws && JSON.parse(request.aws.body)) || body || {}

        const validationResult = fatchFeaturedPackSchema.validate({ category });
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

        const featuredPackages = await packageService.fetchFeaturedPackages(category)

        if(!featuredPackages){
            return { ststus:"success", ststusCode:"200" , data: "Not Found" }
        }

        return { ststus:"success", ststusCode:"200" , data: featuredPackages }

    }


}

export default new packageController();