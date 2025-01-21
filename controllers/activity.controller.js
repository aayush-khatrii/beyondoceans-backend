import { ErrorHandler } from '../errors/ErrorHandler.js'
import activityService from '../services/activity-service.js'
import { fatchSingleActivityschema, fatchFilterActivityschema } from '../validator/validation.schema.js'
import { fatchHotelSchema } from '../validator/validation.schema.js'

class activityController{
    async getAllactivities(){
        const allActivities = await activityService.fetchAllActivities()
        return { ststus:"success", ststusCode:"200" , data: allActivities }
    }

    async getFilterActivities({params}){

        const { category } = params
        const validationResult = fatchFilterActivityschema.validate({ category });

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

        const allFilterActivities = await activityService.fetchFilterActivities(category)

        if(!allFilterActivities){
            return { ststus:"success", ststusCode:"200" , data: "Not Found" }
        }

        return { ststus:"success", ststusCode:"200" , data: allFilterActivities }
    }

    async getSingleActivity({request, body}){

        const { activityId } = (request.aws && JSON.parse(request.aws.body)) || body || {}

        const validationResult = fatchSingleActivityschema.validate({ activityId });
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

        const activityData = await activityService.fetchSingleActivity(activityId)

        if(!activityData){
            ErrorHandler.notFoundError("Sorry, package data not found...")
        }

        return { ststus:"success", ststusCode:"200" , data: activityData }

    }

}

export default new activityController();