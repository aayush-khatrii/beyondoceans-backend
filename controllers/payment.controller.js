import { packagePaymentInitschema, activityPaymentInitschema, ferryPaymentInitschema } from '../validator/validation.schema.js'
import sessionService from '../services/session-service.js'
import { ErrorHandler } from '../errors/ErrorHandler.js'
import tokenService from "../services/token-service.js"
import paymentService from "../services/payment-service.js"
import packageService from '../services/package-service.js'
import activityService from '../services/activity-service.js'
import bookingService from '../services/booking-service.js'
import userAuthService from '../services/userAuth-service.js'
import ferryService from '../services/ferry-service.js'


class paymentController{

    async packagePaymentInit({body, request, cookie, accessTokenjwt, sessionTokenjwt}){

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
        
        const sessionData = await sessionService.checkSession(ClientSessionToken.value, JWTFunction)
        
        if(!sessionData){
            ErrorHandler.notFoundError("Session time out 🤐⏳! Please signin again and try!", 500911)
        }

        if(!sessionData.Checkout?.Package){
            ErrorHandler.notFoundError("Session time out 🤐⏳! Please choose package again!", 500912)
        }
        const userData = await tokenService.getUserfromAccToken(ClientAccessToken.value, JWTFunction)

        if(!userData){
            ErrorHandler.notFoundError("Access Denied🤨⛔! Please signin again and try!", 500913)
        }
        
        const { contactData, Sub_Items, paymentType, PAYGW, discount, contributionAmt, isTermsAgree } = (request.aws && JSON.parse(request.aws.body)) || body || {}
        
        const userId = userData.User_Id
        const sessionId = sessionData.Session_Id
        const traveler = sessionData.Checkout.Package.Traveler
        const travelDate = sessionData.Checkout.Package.Travel_Date
        const checkoutPackageData = {Package_Id: sessionData.Checkout.Package.Package_Id, Package_Option_Id: sessionData.Checkout.Package.Package_Option_Id}
        
        
        const validationResult = packagePaymentInitschema.validate({ userId, sessionId, traveler, travelDate, Sub_Items, checkoutPackageData, contactData, paymentType, PAYGW, discount, contributionAmt, isTermsAgree });

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

        //fetch the package that is in the checkout and filter the Option ID
        const packageData = await packageService.fetchSinglePackages(checkoutPackageData.Package_Id)
        
        if(!packageData){
            ErrorHandler.notFoundError("The package you trying to checkout is not avalible or changed...🤐🩷")
        }

        const selectedPackageOption = packageData.Package_Options.find(obj => obj.Option_Id === checkoutPackageData.Package_Option_Id)   

        const selectedPackageAddon = Sub_Items && Sub_Items.map(subItem => {
            const matchedAddon = packageData.Package_Addon.find(addon => addon.Addon_Id === subItem.Sub_Item_Id);
            if (matchedAddon) {

                const Item_SubTotal = subItem.Sub_Item_QTY * matchedAddon.Addon_Offer_Price;
                // Calculate taxes (example: 5% for UTGST and 5% for CGST)
                const UTGST = 2.5
                const CGST = 2.5

                let Item_GST 

                if(subItem.Addon_IsGST){
                    Item_GST = {
                        UTGST: Item_SubTotal * (100 / UTGST),
                        CGST: Item_SubTotal * (100 / CGST),
                    };
                }

                return {
                    ...{Item_Type: "Addon"},
                    ...subItem,
                    ...matchedAddon,
                    ...Item_SubTotal,
                    ...(subItem.Addon_IsGST && Item_GST)
                };
            }
            return subItem;
        })

        // const baseDiscount = await paymentService.calculateBaseDiscount(selectedPackageOption, packageData)
        const contributionAmount = contributionAmt ? contributionAmt : 0
        
        const packageSubTotal = await paymentService.calculatePackageSubtotal(selectedPackageOption, traveler, selectedPackageAddon, discount)
        
        // taxable addon sub total
        const addonSubTotal = await paymentService.calculateAddonSubTota(selectedPackageAddon)

        const packageTax = await paymentService.calculatePackageTax(packageSubTotal, addonSubTotal)

        const bookingTax = await paymentService.calculateBookingTax(packageSubTotal, addonSubTotal, contributionAmount)

        const totalAmount = await paymentService.calculatePackageTotalWithTax(packageSubTotal, addonSubTotal, contributionAmount, selectedPackageAddon, bookingTax)

        const partialTotal = await paymentService.calculatePartialTotalWithTax(totalAmount)

        const paymentAmount = (paymentType === 1 && totalAmount) || (paymentType === 2 && partialTotal) || 0; 


        const bookingDraftData = {
            userData, sessionData, packageData, packageTax, Sub_Items, selectedPackageOption, selectedPackageAddon, contactData, travelDate, paymentType, PAYGW, packageSubTotal, addonSubTotal, bookingTax, totalAmount, paymentAmount, contributionAmount, isTermsAgree
        }

        const createBooking = await bookingService.createPackageBooking(bookingDraftData)

        if(!createBooking){
            ErrorHandler.notAcceptableError("Can't book the package! Please select the package again and try to checkout. 😥💝")
        }

        const storeBookingIdinUserData = await userAuthService.storeBookingIDinUserID(createBooking.Booking_Id, userData.User_Id, createBooking.Booking_Type)

        if(!storeBookingIdinUserData){
            ErrorHandler.notAcceptableError("Can't book the package! Please select the package again and try to checkout. 😥💝")
        }

        const storeBookingIdinSession = await sessionService.storeBookingIdinSession(createBooking.Booking_Id, sessionId)



        if(PAYGW !== 1 && PAYGW !== 2){
            ErrorHandler.notAcceptableError("Can't book the package! Please select the package again and try to checkout. 😥💝")
        }

        if(PAYGW === 1){
            // console.log("phonePePaymentURL :", createBooking.Booking_Id)
            const phonePePaymentURL = await paymentService.generatePhonePePaymentURL(userId, createBooking.Booking_Id, paymentAmount)
            return phonePePaymentURL
        }

    }

    async varifyBookingPayment({body, request, cookie, accessTokenjwt, sessionTokenjwt}){
     
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
            ErrorHandler.notFoundError("Session time out 🤐⏳! Please signin again and try!", 500914)
        }

        if(!sessionData.Active_Booking){
            ErrorHandler.notFoundError("Booking not avalible!", 500915)
        }

        const bookingData = await bookingService.getBookingData(sessionData.Active_Booking.Booking_Id)

        if(bookingData.Booking_Id !== sessionData.Active_Booking.Booking_Id){
            ErrorHandler.notFoundError("Booking not avalible!", 500916)
        }


        if(bookingData.Payment_Deatils.Payment_Gateway === "Phone Pe"){
            const paymentStatusPP = await paymentService.paymentStatusPP(bookingData)

            const bookingStatus = bookingData.Payment_Status

            if(paymentStatusPP.data.state === bookingStatus){
                if(bookingStatus === "FAILED"){
                    return { ststus:"success", ststusCode:"200" , data: {Booking_Status: "FAILED"} }
                }
                if(bookingStatus === "COMPLETED"){
                    return { ststus:"success", ststusCode:"200" , data: {Booking_Status: "COMPLETED"} }
                }
            }

            if(paymentStatusPP.data.state === "PENDING"){
                return { ststus:"success", ststusCode:"200" , data: {Booking_Status: "PENDING"} }
            }

            if(bookingStatus === "Initiated" && paymentStatusPP.data.state !== "PENDING"){

                const changeBookingStatus = await bookingService.changeBookingStatus(bookingData, paymentStatusPP)
                return { ststus:"success", ststusCode:"200" , data: {Booking_Status: paymentStatusPP.data.state} }
            }   

        }
    }

    
    async activityPaymentInit({body, request, cookie, accessTokenjwt, sessionTokenjwt}){

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
        
        const sessionData = await sessionService.checkSession(ClientSessionToken.value, JWTFunction)
        
        if(!sessionData){
            ErrorHandler.notFoundError("Session time out 🤐⏳! Please signin again and try!", 500911)
        }

        if(!sessionData.Checkout?.Activity){
            ErrorHandler.notFoundError("Session time out 🤐⏳! Please choose package again!", 500912)
        }
        const userData = await tokenService.getUserfromAccToken(ClientAccessToken.value, JWTFunction)

        if(!userData){
            ErrorHandler.notFoundError("Access Denied🤨⛔! Please signin again and try!", 500913)
        }
        
        const { contactData, Sub_Items, PAYGW, discount, contributionAmt, isTermsAgree } = (request.aws && JSON.parse(request.aws.body)) || body || {}
        
        const userId = userData.User_Id
        const sessionId = sessionData.Session_Id
        const traveler = sessionData.Checkout.Activity.Traveler
        const travelDate = sessionData.Checkout.Activity.Travel_Date
        const checkoutActivityData = {Activity_Id: sessionData.Checkout.Activity.Activity_Id, Activity_Option_Id: sessionData.Checkout.Activity.Activity_Option_Id}
        
        
        const validationResult = activityPaymentInitschema.validate({ userId, sessionId, traveler, travelDate, Sub_Items, checkoutActivityData, contactData, PAYGW, discount, contributionAmt, isTermsAgree });

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

        //fetch the package that is in the checkout and filter the Option ID
        const activityData = await activityService.fetchSingleActivity(checkoutActivityData.Activity_Id)
        
        if(!activityData){
            ErrorHandler.notFoundError("The activity you trying to checkout is not avalible or changed...🤐🩷")
        }

        const selectedActivityOption = activityData.Activity_Options.find(obj => obj.Option_Id === checkoutActivityData.Activity_Option_Id)   

        const selectedActivityAddon = Sub_Items && Sub_Items.map(subItem => {

            const matchedAddon = activityData.Package_Addon.find(addon => addon.Addon_Id === subItem.Sub_Item_Id);
            if (matchedAddon) {

                const Item_SubTotal = subItem.Sub_Item_QTY * matchedAddon.Addon_Offer_Price;
                // Calculate taxes (example: 5% for UTGST and 5% for CGST)
                const UTGST = 2.5
                const CGST = 2.5

                let Item_GST 

                if(subItem.Addon_IsGST){
                    Item_GST = {
                        UTGST: Item_SubTotal * (100 / UTGST),
                        CGST: Item_SubTotal * (100 / CGST),
                    };
                }

                return {
                    ...{Item_Type: "Addon"},
                    ...subItem,
                    ...matchedAddon,
                    ...Item_SubTotal,
                    ...(subItem.Addon_IsGST && Item_GST)
                };
            }
            return subItem;
        })

        // const baseDiscount = await paymentService.calculateBaseDiscount(selectedPackageOption, packageData)
        const contributionAmount = contributionAmt ? contributionAmt : 0
        
        const activitySubTotal = await paymentService.calculateActivitySubtotal(selectedActivityOption, traveler, selectedActivityAddon, discount)
        
        // taxable addon sub total
        const addonSubTotal = await paymentService.calculateAddonSubTota(selectedActivityAddon)

        const activityTax = await paymentService.calculateActivityTax(activitySubTotal, addonSubTotal)

        const bookingTax = await paymentService.calculateBookingTax(activitySubTotal, addonSubTotal, contributionAmount)

        const totalAmount = await paymentService.calculateActivityTotalWithTax(activitySubTotal, addonSubTotal, contributionAmount, selectedActivityAddon, bookingTax)

        // const partialTotal = await paymentService.calculatePartialTotalWithTax(totalAmount)

        // const paymentAmount = (paymentType === 1 && totalAmount) || (paymentType === 2 && partialTotal) || 0; 


        const bookingDraftData = {
            userData, sessionData, activityData, activityTax, Sub_Items, selectedActivityOption, selectedActivityAddon, contactData, travelDate, PAYGW, activitySubTotal, addonSubTotal, bookingTax, totalAmount, contributionAmount, isTermsAgree
        }

        const createBooking = await bookingService.createActivityBooking(bookingDraftData)

        if(!createBooking){
            ErrorHandler.notAcceptableError("Can't book the activity! Please select the package again and try to checkout. 😥💝")
        }

        const storeBookingIdinUserData = await userAuthService.storeBookingIDinUserID(createBooking.Booking_Id, userData.User_Id, createBooking.Booking_Type)

        if(!storeBookingIdinUserData){
            ErrorHandler.notAcceptableError("Can't book the package! Please select the package again and try to checkout. 😥💝")
        }

        const storeBookingIdinSession = await sessionService.storeBookingIdinSession(createBooking.Booking_Id, sessionId)


        if(PAYGW !== 1 && PAYGW !== 2){
            ErrorHandler.notAcceptableError("Can't book the package! Please select the package again and try to checkout. 😥💝")
        }

        if(PAYGW === 1){
            // console.log("phonePePaymentURL :", createBooking.Booking_Id)
            const phonePePaymentURL = await paymentService.generatePhonePePaymentURL(userId, createBooking.Booking_Id, totalAmount)
            return phonePePaymentURL
        }

    }

    async ferryPaymentInit({body, request, cookie, accessTokenjwt, sessionTokenjwt}){

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
        
        const sessionData = await sessionService.checkSession(ClientSessionToken.value, JWTFunction)
        
        if(!sessionData){
            ErrorHandler.notFoundError("Session time out 🤐⏳! Please signin again and try!", 500914)
        }

        if(!sessionData.Checkout?.Ferry){
            ErrorHandler.notFoundError("Session time out 🤐⏳! Please choose ferry again!", 500915)
        }
        const userData = await tokenService.getUserfromAccToken(ClientAccessToken.value, JWTFunction)

        if(!userData){
            ErrorHandler.notFoundError("Access Denied🤨⛔! Please signin again and try!", 500916)
        }
        
        const { contactData, PAYGW, discount, contributionAmt, isTermsAgree, PaxData } = (request.aws && JSON.parse(request.aws.body)) || body || {}
        
        const userId = userData.User_Id
        const sessionId = sessionData.Session_Id
        const ferryData = sessionData.Checkout.Ferry
        const traveler = ferryData.Traveler
        const travelDate = ferryData.Ferry_Data.Travel_Date
        // const checkoutFerryData = { Ferry_Id: sessionData.Checkout.Ferry.Activity_Id, Ferry_class_Id: sessionData.Checkout.Activity.Activity_Option_Id}

        let checkoutFerryData
        if(ferryData.Ferry_Operator !== "MAK" && ferryData.Ferry_Operator !== "NTK"){
            ErrorHandler.notFoundError("Session time out 🤐⏳! Please choose ferry again!", 500917)
        }

        if(ferryData.Ferry_Operator === "MAK"){
            checkoutFerryData = {
                Ferry_Id: ferryData.Ferry_Data.Schedule_Id,
                Ferry_class_Id: ferryData.Ferry_Data.Class_Id,
                Ferry_Operator: ferryData.Ferry_Operator
            }
        }
        if(ferryData.Ferry_Operator === "NTK"){
            checkoutFerryData = {
                Ferry_Id: ferryData.Ferry_Data.Ferry_Id,
                Trip_Id: ferryData.Ferry_Data.Trip_Id,
                Ferry_Operator: ferryData.Ferry_Operator
            }
        }

        const validationResult = ferryPaymentInitschema.validate({ userId, sessionId, traveler, travelDate, checkoutFerryData, contactData, PaxData, PAYGW, discount, contributionAmt, isTermsAgree });

        if(validationResult.error){
            const errorDetail = validationResult.error.details[0]
            let errorMessage = errorDetail.message.replace(/["\\]/g, '');

            if(errorDetail.type === "string.pattern.base" || errorDetail.type === "any.invalid" || errorDetail.type === "any.only" || errorDetail.type === "date.base" || errorDetail.type === "date.min"){
                ErrorHandler.validationError(errorMessage, 422)
            }
            if(errorDetail.type === "any.required"){
                ErrorHandler.notFoundError(errorMessage, 404)
            }
            if(errorDetail.type === "date.invalid"){
                ErrorHandler.notFoundError(errorMessage, 404)
            }
            ErrorHandler.validationError("Not Acceptable", 422)
        }


        //fetch the ferry that is in the checkout and filter the Option ID

        let singleFerryData

        if(ferryData.Ferry_Operator === "MAK"){

            const singleFerrySearchDataMak = { 
                dept: ferryData.Ferry_Data.Departure, 
                dest: ferryData.Ferry_Data.Destination, 
                trav: traveler.Adults + traveler.Infants,
                date: travelDate, 
                scheduleID: ferryData.Ferry_Data.Schedule_Id
            }

            singleFerryData = await ferryService.fatchSingleFerryMak(singleFerrySearchDataMak)
        }

        if(ferryData.Ferry_Operator === "NTK"){

            const singleFerrySearchDataNTK = { 
                ferryId: ferryData.Ferry_Data.Ferry_Id,
                tripId: ferryData.Ferry_Data.Trip_Id.toString(),
                dept: ferryData.Ferry_Data.Departure,
                dest: ferryData.Ferry_Data.Destination,
                date: ferryData.Ferry_Data.Travel_Date,
                trav: ferryData.Traveler.Adults
            }

            singleFerryData = await ferryService.fatchSingleFerryNtk(singleFerrySearchDataNTK)
        }

        if(!singleFerryData){
            ErrorHandler.notFoundError("The ferry you trying to book is not avalible or changed...🤐🩷")
        }

        // const selectedActivityOption = activityData.Activity_Options.find(obj => obj.Option_Id === checkoutActivityData.Activity_Option_Id)   

        // const baseDiscount = await paymentService.calculateBaseDiscount(selectedPackageOption, packageData)

        const contributionAmount = contributionAmt ? contributionAmt : 0
        
        const ferrySubTotal = await paymentService.calculateFerrySubtotal(ferryData.Ferry_Operator, singleFerryData, checkoutFerryData.Ferry_class_Id, traveler, PaxData, discount)

        const totalPSFcost = await paymentService.psfCalculator(ferryData.Ferry_Operator, traveler)

        // change the below function if required in Ferry checkout

        // const activityTax = await paymentService.calculateActivityTax(activitySubTotal, addonSubTotal)

        // const bookingTax = await paymentService.calculateBookingTax(activitySubTotal, addonSubTotal, contributionAmount)

        const totalAmount = await paymentService.calculateFerryTotalWithPSF(ferrySubTotal, contributionAmount, totalPSFcost)

        // const partialTotal = await paymentService.calculatePartialTotalWithTax(totalAmount)

        // const paymentAmount = (paymentType === 1 && totalAmount) || (paymentType === 2 && partialTotal) || 0; 

        let isSeatAvalible

        if(ferryData.Ferry_Operator === "MAK"){
            isSeatAvalible = await ferryService.checkSeatAvaliblityMAK(singleFerryData, traveler, checkoutFerryData.Ferry_class_Id)
        }

        if(ferryData.Ferry_Operator === "NTK"){
            isSeatAvalible = await ferryService.checkSeatAvaliblityNTK(singleFerryData, PaxData)
        }

        // check for nautika seat avaliblity
        
        if(!isSeatAvalible){
            ErrorHandler.notFoundError("There are no seats avalibele for your selected ferry...🤐🩷")
        }

        let makCNFData

        if(ferryData.Ferry_Operator === "MAK"){
            makCNFData = await ferryService.saveMakPassanger(singleFerryData, checkoutFerryData, travelDate, contactData, PaxData, traveler)
        }

        if(ferryData.Ferry_Operator === "MAK" && makCNFData.code !== "200"){
            ErrorHandler.notFoundError("Can't book the selected ferry at this time!")
        }

        const bookingDraftData = {
            userData, sessionData, PaxData, makCNFData, singleFerryData, checkoutFerryData, contactData, travelDate, PAYGW, ferrySubTotal, totalAmount, totalPSFcost, contributionAmount, isTermsAgree
        }

        const createBooking = await bookingService.createFerryBooking(bookingDraftData)

        if(!createBooking){
            ErrorHandler.notAcceptableError("Can't book the ferry! Please select the ferry again and try to checkout. 😥💝")
        }

        const storeBookingIdinUserData = await userAuthService.storeBookingIDinUserID(createBooking.Booking_Id, userData.User_Id, createBooking.Booking_Type)

        if(!storeBookingIdinUserData){
            ErrorHandler.notAcceptableError("Can't book the package! Please select the package again and try to checkout. 😥💝")
        }

        const storeBookingIdinSession = await sessionService.storeBookingIdinSession(createBooking.Booking_Id, sessionId)

        if(PAYGW !== 1 && PAYGW !== 2){
            ErrorHandler.notAcceptableError("Can't book the ferry! Please select the ferry again and try to checkout. 😥💝")
        }

        if(PAYGW === 1){
            // console.log("phonePePaymentURL :", createBooking.Booking_Id)
            const phonePePaymentURL = await paymentService.generatePhonePePaymentURL(userId, createBooking.Booking_Id, totalAmount)
            return phonePePaymentURL
        }

    }
}

export default new paymentController();