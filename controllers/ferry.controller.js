import { fatchAllFerryschema, fatchSingleFerryMakschema, fatchSingleFerryNtkSchema } from '../validator/validation.schema.js'
import { ErrorHandler } from '../errors/ErrorHandler.js';
import ferryService from '../services/ferry-service.js';
import { MKZSelectschedule } from '../api/Ferry/makruzz.js';

class ferryController{


    async fatchAllFerry({request, body}){

        const { dept, dest, trav, date } = (request.aws && JSON.parse(request.aws.body)) || body || {}
        

        const validationResult = fatchAllFerryschema.validate({ dept, dest, date });
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

        
        const ferrySearchData = { dept, dest, trav, date }

        const ferryList = await ferryService.fatchallferry(ferrySearchData)

        return { ststus:"success", ststusCode:"200", data: ferryList }
    }
    

    async fatchSingleFerryMak({request, body}){

        const { scheduleID, date, dest, dept, trav } = (request.aws && JSON.parse(request.aws.body)) || body || {}
        

        const validationResult = fatchSingleFerryMakschema.validate({ scheduleID, dept, dest, date, trav });
        if(validationResult.error){
            const errorDetail = validationResult.error.details[0]
            let errorMessage = errorDetail.message.replace(/["\\]/g, '');

            if(errorDetail.type === "string.pattern.base" || errorDetail.type === "any.invalid" || errorDetail.type === "any.only" || errorDetail.type === "date.base" || errorDetail.type === "date.min"){
                ErrorHandler.validationError(errorMessage, 422)
            }
            if(errorDetail.type === "any.required"){
                ErrorHandler.notFoundError(errorMessage, 404)
            }
            console.log(errorDetail)
            ErrorHandler.validationError("Not Acceptable", 422)
        }

        const ferrySearchData = { dept, dest, trav, date, scheduleID }

        const singleFerryDataMak = await ferryService.fatchSingleFerryMak(ferrySearchData)

        return { ststus:"success", ststusCode:"200", data: singleFerryDataMak }
    }

    async fatchSingleFerryNtk({request, body}){

        const { ferryId, tripId, dept, dest, date, trav } = (request.aws && JSON.parse(request.aws.body)) || body || {}
        

        const validationResult = fatchSingleFerryNtkSchema.validate({ ferryId, tripId, dept, dest, date, trav });
        if(validationResult.error){
            const errorDetail = validationResult.error.details[0]
            let errorMessage = errorDetail.message.replace(/["\\]/g, '');

            if(errorDetail.type === "string.pattern.base" || errorDetail.type === "any.invalid" || errorDetail.type === "any.only" || errorDetail.type === "date.base" || errorDetail.type === "date.min"){
                ErrorHandler.validationError(errorMessage, 422)
            }
            if(errorDetail.type === "any.required"){
                ErrorHandler.notFoundError(errorMessage, 404)
            }
            console.log(errorDetail)
            ErrorHandler.validationError("Not Acceptable", 422)
        }

        const ferrySearchData = { ferryId, tripId, dept, dest, date, trav }

        const singleFerryDataNtk = await ferryService.fatchSingleFerryNtk(ferrySearchData)

        return { ststus:"success", ststusCode:"200", data: singleFerryDataNtk }
    }
    

    async addFerrytoCart({request, body}){
        const { scheduleID, date, classID } = (request.aws && JSON.parse(request.aws.body)) || body || {}

        const sclectScheduleData = { scheduleID, date, classID }

        const data = await MKZSelectschedule(sclectScheduleData)
        return data
    }

}

export default new ferryController();