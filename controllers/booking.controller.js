import { ErrorHandler } from '../errors/ErrorHandler.js'
import sessionService from '../services/session-service.js'
import bookingService from '../services/booking-service.js'
import tokenService from '../services/token-service.js'
import packageService from '../services/package-service.js'
import activityService from '../services/activity-service.js'
import userService from '../services/userAuth-service.js'
import storageService from '../services/storage-service.js'
import { bookingIdschema } from '../validator/validation.schema.js'

class bookingController{

    async getBookingData({body, request, cookie, accessTokenjwt, sessionTokenjwt}){
        
        const JWTFunction = {
            JWTAccess: accessTokenjwt,
            JWTSession: sessionTokenjwt
        }

        const ClientAccessToken = cookie.accessToken
        const ClientSessionToken = cookie.sessionToken
        const authToken = cookie.isAuthToken

        if(!authToken.value){
            ErrorHandler.notFoundError("You're Logged Out 😨🧐! Please Login again, we are waiting for you...", 401, 401)
        }

        if(!ClientAccessToken.value){
            ErrorHandler.notFoundError("You're Logged Out 😨🧐! Please Login again, we are waiting for you...", 401, 401)
        }

        const sessionData = await sessionService.checkSession(ClientSessionToken.value, JWTFunction)
        
        if(!sessionData){
            ErrorHandler.notFoundError("Session time out 🤐⏳! Please signin again and try!", 5001011)
        }

        if(!sessionData.Active_Booking){
            ErrorHandler.notFoundError("Booking not avalible!", 5001012)
        }

        const userId = await tokenService.getUserIDfromAccToken(ClientAccessToken.value, JWTFunction)
        if(!userId){
            ErrorHandler.notFoundError("Please Login to continue!", 5001013)
        }

        const bookingData = await bookingService.getBookingData(sessionData.Active_Booking.Booking_Id)

        if(bookingData.Booking_Id !== sessionData.Active_Booking.Booking_Id){
            ErrorHandler.notFoundError("Booking not avalible!", 5001014)
        }

        if(bookingData.Payment_Status === "Initiated"){
            const initbookingDataDTO = {
                Booking_Id: bookingData.Booking_Id,
                Booking_Type: bookingData.Booking_Type,
                Payment_Status: bookingData.Payment_Status,
            }
            return { ststus:"success", ststusCode:"200" , data: initbookingDataDTO }
        }

        if(bookingData.Payment_Status === "FAILED"){
            const failbookingDataDTO = {
                Booking_Id: bookingData.Booking_Id,
                Booking_Type: bookingData.Booking_Type,
                Payment_Status: bookingData.Payment_Status,
            }
            return { ststus:"success", ststusCode:"200" , data: failbookingDataDTO }
        }

        if(bookingData.Payment_Status === "COMPLETED"){
            if(bookingData.Booking_Type === "Package"){

                const packageItem = bookingData.Booking_Items.filter(obj => obj.Item_Type === "Package")[0]
    
                const packageData = await packageService.fetchSinglePackages(packageItem.Package_Id)
    
                const selectedPackageOption = packageData.Package_Options.filter(obj => obj.Option_Id === packageItem.Package_Option_Id)[0]
    
                const bookingDataDTO = {
                    Booking_Id: bookingData.Booking_Id,
                    User_Id: userId,
                    Booking_Email: bookingData.Contact_Details.Email,
                    Booking_Type: bookingData.Booking_Type,
                    Payment_Status: bookingData.Payment_Status,
                    Item: {
                        Package_Id: packageData.Package_Id,
                        Package_Title: packageData.Package_Title,
                        Package_Option_Title: selectedPackageOption.Option_Title,
                        Pack_Duration: packageData.Pack_Duration,
                        Departure_Place: packageData.Destination[0]
                    },
                    Traveler: bookingData.Traveler,
                    Travel_Date: bookingData.Travel_Date,   
                    Total_Amount: bookingData.Payment_Deatils.Payment_Total_With_TAX,
                    Paid_Amount: bookingData.Gateway_Response.Paid_Amount,
                    Payment_GW: bookingData.Payment_Deatils.Payment_Gateway,
                }
    
                return { ststus:"success", ststusCode:"200" , data: bookingDataDTO }
    
            }

            if(bookingData.Booking_Type === "Activity"){

                const activityItem = bookingData.Booking_Items.filter(obj => obj.Item_Type === "Activity")[0]
    
                const activityData = await activityService.fetchSingleActivity(activityItem.Activity_Id)
    
                const selectedActivityOption = activityData.Activity_Options.filter(obj => obj.Option_Id === activityItem.Activity_Option_Id)[0]
    
                const bookingDataDTO = {
                    Booking_Id: bookingData.Booking_Id,
                    User_Id: userId,
                    Booking_Email: bookingData.Contact_Details.Email,
                    Booking_Type: bookingData.Booking_Type,
                    Payment_Status: bookingData.Payment_Status,
                    Item: {
                        Activity_Id: activityData.Activity_Id,
                        Activity_Title: activityData.Activity_Title,
                        Activity_Option_Title: selectedActivityOption.Option_Title,
                        Activity_Duration: activityData.Activity_Duration,
                        Activity_Place: activityData.Activity_Place
                    },
                    Traveler: bookingData.Traveler,
                    Travel_Date: bookingData.Travel_Date,   
                    Total_Amount: bookingData.Payment_Deatils.Payment_Total_With_TAX,
                    Paid_Amount: bookingData.Gateway_Response.Paid_Amount,
                    Payment_GW: bookingData.Payment_Deatils.Payment_Gateway,
                }
    
                return { ststus:"success", ststusCode:"200" , data: bookingDataDTO }
    
            }
        }


        // if(bookingData.Booking_Type === "Activity"){

        //     const packageItem = bookingData.Items.filter(obj => obj.Item_Type === "Package")[0]

        //     const packageData = await packageService.fetchSinglePackages(packageItem.Package_Id)

        //     const selectedPackageOption = packageData.Package_Options.filter(obj => obj.Option_Id === packageItem.Package_Option_Id)[0]

        //     const bookingDataDTO = {
        //         Booking_Id: bookingData.Booking_Id,
        //         Booking_Type: bookingData.Booking_Type,
        //         Items: {
        //             Package_Title: packageData.Package_Title,
        //             Package_Option_Title: selectedPackageOption.Option_Title,
        //             Pack_Duration: packageData.Pack_Duration,
        //             Traveler: bookingData.Traveler,
        //             Departure_Place: packageData.Destination[0]
        //         },
        //         Total_Amount: bookingData.Payment_Deatils.Payment_Total_With_TAX,
        //         Paid_Amount: bookingData.Gateway_Response.Paid_Amount,
        //         Payment_GW: bookingData.Payment_Deatils.Payment_Gateway,
        //     }

        //     return { ststus:"success", ststusCode:"200" , data: bookingDataDTO }
            
        // }




    }

    async getUserBookingData({body, request, cookie, accessTokenjwt, sessionTokenjwt}){
        
        const JWTFunction = {
            JWTAccess: accessTokenjwt,
            JWTSession: sessionTokenjwt
        }

        const ClientAccessToken = cookie.accessToken
        const authToken = cookie.isAuthToken
        
        if(!authToken.value){
            ErrorHandler.notFoundError("You're Logged Out 😨🧐! Please Login again, we are waiting for you...", 401, 401)
        }

        if(!ClientAccessToken.value){
            ErrorHandler.notFoundError("You're Logged Out 😨🧐! Please Login again, we are waiting for you...", 401, 401)
        }

        const userId = await tokenService.getUserIDfromAccToken(ClientAccessToken.value, JWTFunction)

        if(!userId){
            ErrorHandler.notFoundError("You're Logged Out 😨🧐! Please Login again, we are waiting for you...", 401, 401)
        }

        const userData = await userService.findbyUserId(userId)

        if(!userData){
            ErrorHandler.notFoundError("User not found🧐!", 401, 401)
        }

        const bookingIds = [
            ...(userData?.Bookings?.Packages ?? []),
            ...(userData?.Bookings?.Activities ?? []),
            ...(userData?.Bookings?.Sightseeing ?? [])
        ]

        if(bookingIds.length === 0){
            return { ststus:"success", ststusCode:"200" , data: [] }
        }

        const bookingData = await bookingService.getMultiBookingData(bookingIds)

        return { ststus:"success", ststusCode:"200" , data: bookingData }

    }

    async getBookingInvoice({body, request, cookie, accessTokenjwt, sessionTokenjwt}){

        const JWTFunction = {
            JWTAccess: accessTokenjwt,
            JWTSession: sessionTokenjwt
        }

        const ClientAccessToken = cookie.accessToken
        const authToken = cookie.isAuthToken
        
        const { bookingId } = (request.aws && JSON.parse(request.aws.body)) || body || {}

        const validationResult = bookingIdschema.validate({ bookingId });

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

        if(!authToken.value){
            ErrorHandler.notFoundError("You're Logged Out 😨🧐! Please Login again, we are waiting for you...", 401, 401)
        }

        if(!ClientAccessToken.value){
            ErrorHandler.notFoundError("You're Logged Out 😨🧐! Please Login again, we are waiting for you...", 401, 401)
        }

        const userId = await tokenService.getUserIDfromAccToken(ClientAccessToken.value, JWTFunction)

        if(!userId){
            ErrorHandler.notFoundError("You're Logged Out 😨🧐! Please Login again, we are waiting for you...", 401, 401)
        }

        const userData = await userService.findbyUserId(userId)
        
        if(!userData){
            ErrorHandler.notFoundError("User not found🧐!", 401, 401)
        }

        const allBookingIds = [
            ...(userData.Bookings.Packages || []),
            ...(userData.Bookings.Activities || []),
            ...(userData.Bookings.Sightseeing || [])
        ]

        const isBookingExists = allBookingIds.includes(bookingId);

        if(!isBookingExists){
            ErrorHandler.notFoundError("Booking is not avalible in your account!", 401, 401)
        }

        const bookingData = await bookingService.getBookingData(bookingId)

        if(bookingData.Payment_Status === "FAILED"){
            ErrorHandler.notFoundError("Payment for this booking is failed!", 401, 401)
        }

        const preSignedUrl = await storageService.getPresignedURL(bookingId, bookingData.Status_Update_TS)

        return { ststus:"success", ststusCode:"200" , data: preSignedUrl }

    }

}

export default new bookingController();