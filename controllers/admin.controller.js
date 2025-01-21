import { ErrorHandler } from "../errors/ErrorHandler";
import adminService from "../services/admin-service";
import packageService from "../services/package-service";
import sendService from "../services/send-service";
import tokenService from "../services/token-service";
import { changeEnquiryStatusSchema, createAdminUserSchema, fetchHotelbyFilterSchema, fetchSSbyFilterSchema, getSingleEnquirySchema, loginAdminUserSchema } from "../validator/validation.schema";

class adminController{

    async createAdminUser({body, request}){

        const {name, email, phone, designation, role, password} = (request.aws && JSON.parse(request.aws.body)) || body || {}

        const validationResult = createAdminUserSchema.validate({name, email, phone, designation, role, password});
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

        const newUserData = {name, email, phone, designation, role, password}
        const isUserCreated = await adminService.createAdminUser(newUserData)

        if(!isUserCreated){
            ErrorHandler.internalServerError("Internal Server Error for the Admin Section", 500)
        }

        const sendCredential = await sendService.sendUserPassword(email, newUserData)

        if(!sendCredential){
            ErrorHandler.internalServerError("Can't send Email for User Credentials to given Email", 500)
        }

        return { ststus:"success", ststusCode:"200" }

    }

    async getUsersList({body, request}){
        
        const usersList = await adminService.getUsersList()
        return { ststus:"success", ststusCode:"200" , data: usersList }

    }

    async loginAdminUser({body, request, cookie, accessTokenjwt, refreshTokenjwt, sessionTokenjwt}){

        const JWTFunction = {
            JWTAccess: accessTokenjwt,
            JWTRefresh: refreshTokenjwt,
            JWTSession: sessionTokenjwt
        }

        const ClientRefreshToken = cookie.refreshToken
        const authToken = cookie.isAuthToken

        const {email, password} = (request.aws && JSON.parse(request.aws.body)) || body || {}

        const validationResult = loginAdminUserSchema.validate({email, password});
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

        const loginData = {email, password}

        const userData = await adminService.validateSingleUser(loginData)

        const {accessToken, refreshToken} = await tokenService.generateTokens({ payload:userData.User_Id, JWTFunction});

        await tokenService.deleteRefToken(ClientRefreshToken.value, JWTFunction, userData.User_Id)

        await tokenService.storeRefreshToken(userData.User_Id, refreshToken)

        const { Created_At, User_Password, ...filteredResponse } = userData

        ClientRefreshToken.set({
            value: refreshToken,
            maxAge: 60 * 60 * 24 * 3,
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
        
        return { ststus:"success", ststusCode:"200" , data: filteredResponse }

    }

    async autoAdminUserLogin({body, request, cookie, refreshTokenjwt}){

        const JWTFunction = {
            JWTRefresh: refreshTokenjwt
        }

        const ClientRefreshToken = cookie.refreshToken
        const authToken = cookie.isAuthToken

        if(!authToken.value) {
            ErrorHandler.notFoundError("Unauthorized Access", 1001001, 401)
            return
        }

        if(!ClientRefreshToken.value) {
            ErrorHandler.notFoundError("Unauthorized Access", 1001002, 401)
            return
        }

        const userId = await tokenService.getUserIDfromRefToken(ClientRefreshToken.value, JWTFunction)

        if (!userId) return {auth: false}
        const user = await adminService.findUserbyID(userId)

        if(!user){
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
            ErrorHandler.notFoundError("User is not avalible", 1001003)
        }

        const { Created_At, User_Password, ...filteredResponse } = user

        return { ststus:"success", ststusCode:"200" , data: filteredResponse }

    }

    async logoutAdminUser({ body, request, cookie, refreshTokenjwt }){
        const JWTFunction = {
            JWTRefresh: refreshTokenjwt
        }

        const ClientRefreshToken = cookie.refreshToken
        const authToken = cookie.isAuthToken

        const userId = await tokenService.getUserIDfromRefToken(ClientRefreshToken.value, JWTFunction)

        if(userId){
            await tokenService.removeRefreshTokenfromDB(userId)
        }

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

    async getEnquiriesList({body, request}){
        
        const enquiriesList = await adminService.fetchEnquiriesList()
        return { ststus:"success", ststusCode:"200" , data: enquiriesList }

    }

     async getHotelbyFilter({request, body}){
    
            const { destination } = (request.aws && JSON.parse(request.aws.body)) || body || {}
    
            const validationResult = fetchHotelbyFilterSchema.validate({ destination });
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
    
            const hotelData = await adminService.fetchHotelsbyFilter(destination)
    
            if(!hotelData){
                ErrorHandler.notFoundError("Sorry, hotels list not found...")
            }
    
            return { ststus:"success", ststusCode:"200" , data: hotelData }
    }

    async getSightseeingbyFilter({request, body}){
    
            const { destination } = (request.aws && JSON.parse(request.aws.body)) || body || {}
    
            const validationResult = fetchSSbyFilterSchema.validate({ destination });
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
    
            const sightseeingData = await adminService.fetchSSbyFilter(destination)
    
            if(!sightseeingData){
                ErrorHandler.notFoundError("Sorry, sightseeing list not found...")
            }
    
            return { ststus:"success", ststusCode:"200" , data: sightseeingData }
    }

    async getSingleEnquiry({request, body}){
    
        const { Inq_Id } = (request.aws && JSON.parse(request.aws.body)) || body || {}
    
        const validationResult = getSingleEnquirySchema.validate({ Inq_Id });
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
    
        const singleInquiry = await adminService.fetchSingleInquiry(Inq_Id)

    
        if(!singleInquiry){
            ErrorHandler.notFoundError("Sorry, Inquiry not found...")
        }

        const singlePackageData = await packageService.fetchSinglePackages(singleInquiry.Package_Id)

        const selectedPackageOption = singlePackageData.Package_Options.filter(option => option.Option_Id === singleInquiry.Package_Option_Id)[0]

        let productLink

        if(singleInquiry.Inq_Type === "Package"){
            const packageTitleURL = singlePackageData.Package_Title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')
            productLink = `https://www.beyondoceans.in/packages/${singlePackageData.Tour_Type.URL_Value}/${packageTitleURL}/${singleInquiry.Package_Id}` 
        }

        const formatedInqData = {
            Inquiry_Deatils: {
                Inq_Id: singleInquiry.Inq_Id,
                Name: singleInquiry.Name,
                Phone: singleInquiry.Phone,
                Email: singleInquiry.Email,
                Traveler: singleInquiry.Traveler,
                Travel_Date: singleInquiry.Trip_Date,
                Inquiry_Time: singleInquiry.DT,
                Inquiry_Type: singleInquiry.Inq_Type,
                Inquiry_Status: singleInquiry.Inq_Status_Data?.Inq_Status || "Canceled",
                Inquiry_Status_Data: singleInquiry.Inq_Status_Data || {},
            },
            Package_Data: {
                Package_Id: singleInquiry.Package_Id,
                Package_Opt_Id: singleInquiry.Package_Option_Id,
                Package_Name: singlePackageData.Package_Title,
                Package_Option_Name: selectedPackageOption.Option_Title,
                Package_Option_Pricing: selectedPackageOption.Option_Price,
                Package_Type: singlePackageData.Tour_Type.Value,
                Package_Link: productLink,
            }
        }
    
        return { ststus:"success", ststusCode:"200" , data: formatedInqData }
    }

    async changeEnquiryStatus({ body, request, cookie, refreshTokenjwt }){

        const JWTFunction = {
            JWTRefresh: refreshTokenjwt
        }

        const ClientRefreshToken = cookie.refreshToken
        const authToken = cookie.isAuthToken

        if(!authToken.value) {
            ErrorHandler.notFoundError("Unauthorized Access", 1001004, 401)
            return
        }

        if(!ClientRefreshToken.value) {
            ErrorHandler.notFoundError("Unauthorized Access", 1001005, 401)
            return
        }
    
        const { Inq_Id, Status } = (request.aws && JSON.parse(request.aws.body)) || body || {}

        const validationResult = changeEnquiryStatusSchema.validate({ Inq_Id, Status });
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

        const userId = await tokenService.getUserIDfromRefToken(ClientRefreshToken.value, JWTFunction)

        if (!userId) return {auth: false}
        const user = await adminService.findUserbyID(userId)

        const changeInqStatus = await adminService.updateInquiry(user, Inq_Id, Status)

        if(!changeInqStatus) {
            ErrorHandler.notFoundError("Inquiry status not updated", 401)
            return
        }
    
        return { ststus:"success", ststusCode:"200", Status: Status}
    }

}

export default new adminController();

