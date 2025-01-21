import dbconnect from "../config/db.config.js"
import { PutItemCommand, QueryCommand, UpdateItemCommand, BatchGetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ErrorHandler } from "../errors/ErrorHandler.js";

class BookingModel{
    
    async genratePackageBooking(bookingData){

        if(!bookingData){
            ErrorHandler.internalServerError(undefined, 5001021)
        }

        const createbyPHNParams = {
            TableName: Bun.env.AWS_BOOKING_DB_TBNAME,
            Item: marshall(bookingData),
        }

        try{
            const putItemCommand = new PutItemCommand(createbyPHNParams);
            const {$metadata} = await dbconnect.send(putItemCommand)
            if($metadata.httpStatusCode !== 200){
                return undefined
            }
            return bookingData
            
        } catch (error) {
            ErrorHandler.internalServerError(undefined, 5001022)
        }
    }

    

    async setPackagePaymentFailedInit(bookingId){

        if(!bookingId){
            ErrorHandler.internalServerError(undefined, 5001023)
        }

        const updatePaymentStatusParams = {
            TableName: Bun.env.AWS_BOOKING_DB_TBNAME,
            Key: marshall({
                Booking_Id: bookingId,
            }),
            UpdateExpression: 'set Payment_Status = :paymentStatus',
            ExpressionAttributeValues: marshall({
                ":paymentStatus": "Failed to initiate"
            }), 
            ReturnValues: 'ALL_NEW',
        }

        try {
            const updateCommand = new UpdateItemCommand(updatePaymentStatusParams)
            const {$metadata} = await dbconnect.send(updateCommand)
            if($metadata.httpStatusCode !== 200){
                ErrorHandler.internalServerError(undefined, 5001024)
            }
            return
        } catch (error) {
            ErrorHandler.internalServerError(undefined, 5001025)
        }

    }

    async getBookingData(bookingId){

        if(!bookingId){
            ErrorHandler.internalServerError(undefined, 5001026)
        }

        const getBookingParams = {
            TableName: Bun.env.AWS_BOOKING_DB_TBNAME,
            KeyConditionExpression: "Booking_Id = :bookingId",
            ExpressionAttributeValues: marshall({ ":bookingId": bookingId}),
        };

        const findBookingCMD = new QueryCommand(getBookingParams);
        try {
            const findBookingRESP = await dbconnect.send(findBookingCMD);
            const bookingData = findBookingRESP.Items.map((item) => unmarshall(item))
            if(bookingData.length === 0){
                return undefined
            }
            return bookingData[0]

        } catch (error) {
            ErrorHandler.internalServerError(undefined, 5001027)
        }

    }

    async changeBookingPaymentStatus(bookingId, paymentStatus){
        
        if(!bookingId || !paymentStatus){
            ErrorHandler.internalServerError(undefined, 5001028)
        }

        const paymentStatusPP = paymentStatus.data.state
        const paymentInstrument = paymentStatus.data.paymentInstrument
        const gatewayTransactionId = paymentStatus.data.transactionId
        const paidAmount = paymentStatus.data.amount
        const gatewayFees = paymentStatus.data.feesContext

        const gatewayResponse = {
            Paid_Amount: (paidAmount / 100),
            ...(paymentInstrument && {Payment_Instrument: paymentInstrument}),
            Gateway_Fees: gatewayFees
        }

        const timeOptions = {
            timeZone: 'Asia/Kolkata', // IST timezone
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // 24-hour format
        };

        const bookingStatusTS = new Date().toLocaleDateString('en-IN', timeOptions)

        let changePaymentStatusParams;

        if(paymentStatusPP === "COMPLETED"){
            changePaymentStatusParams = {
                TableName: Bun.env.AWS_BOOKING_DB_TBNAME,
                Key: marshall({
                    Booking_Id: bookingId,
                }),
                UpdateExpression: 'set Payment_Status = :newPaymentStatus, Booking_Status = :newBookingStatus, Gateway_Transaction_Id = :gatewayTransactionId, Gateway_Response = :gatewayResponse, Status_Update_TS = :statusUpdateTS',
                ConditionExpression: "Booking_Id = :bookingId",
                ExpressionAttributeValues: marshall({
                    ':bookingId': bookingId,
                    ':newPaymentStatus': paymentStatusPP,
                    ':newBookingStatus': "Pending Review",
                    ':gatewayTransactionId': gatewayTransactionId,
                    ':gatewayResponse': gatewayResponse,
                    ':statusUpdateTS': bookingStatusTS
                }), 
                ReturnValues: 'ALL_NEW',
            }
        }

        if(paymentStatusPP === "FAILED"){
            changePaymentStatusParams = {
                TableName: Bun.env.AWS_BOOKING_DB_TBNAME,
                Key: marshall({
                    Booking_Id: bookingId,
                }),
                UpdateExpression: 'set Payment_Status = :newPaymentStatus, Gateway_Response = :gatewayResponse, Status_Update_TS = :statusUpdateTS',
                ConditionExpression: "Booking_Id = :bookingId",
                ExpressionAttributeValues: marshall({
                    ':bookingId': bookingId,
                    ':newPaymentStatus': paymentStatusPP,
                    ':gatewayResponse': gatewayResponse,
                    ':statusUpdateTS': bookingStatusTS
                }), 
                ReturnValues: 'ALL_NEW',
            }
        }
        
        try {
            const updateCommand = new UpdateItemCommand(changePaymentStatusParams)
            const {$metadata, Attributes} = await dbconnect.send(updateCommand)
            if($metadata.httpStatusCode !== 200){
                ErrorHandler.internalServerError(undefined, 5001029)
            }
            const bookingData = unmarshall(Attributes)
            return bookingData

        } catch (error) {
            ErrorHandler.internalServerError(undefined, 50010210)
        }

    }

    async getMultiBookingData(bookingIds){

        if(!bookingIds || !Array.isArray(bookingIds)){
            ErrorHandler.internalServerError(undefined, 50010211)
        }

        const tableName = Bun.env.AWS_BOOKING_DB_TBNAME

        const keysForBatchGet = bookingIds.map(id => ({
            Booking_Id: { S: id }
        }));

        const params = {
            RequestItems: {
                [tableName]: {
                    Keys: keysForBatchGet,
                    ProjectionExpression: 'Booking_Id, Booking_Status, Booking_Type, Booking_Items, Payment_Deatils.Payment_Amount, Payment_Deatils.Payment_Due, Payment_Deatils.Payment_Total_With_TAX, Payment_Status, Travel_Date, Traveler'
                }
            }
        };

        const betchGetCMD = new BatchGetItemCommand(params);
        try {
            const betchGetRESP = await dbconnect.send(betchGetCMD);
            const bookingsData = betchGetRESP.Responses[tableName].map((item) => unmarshall(item))
            //below logic reordere Items
            const reorderedItems = bookingIds.map(id => bookingsData.find(item => item.Booking_Id === id));
            if(reorderedItems.length === 0){
                ErrorHandler.internalServerError(undefined, 50010212)
            }
            return reorderedItems

        } catch (error) {
            ErrorHandler.internalServerError(undefined, 50010213)
        }

    }

    async genrateFerryBooking(bookingData){

        if(!bookingData){
            ErrorHandler.internalServerError(undefined, 50010214)
        }

        const createbyPHNParams = {
            TableName: Bun.env.AWS_BOOKING_DB_TBNAME,
            Item: marshall(bookingData),
        }

        try{
            const putItemCommand = new PutItemCommand(createbyPHNParams);
            const {$metadata} = await dbconnect.send(putItemCommand)
            if($metadata.httpStatusCode !== 200){
                return undefined
            }
            return bookingData
            
        } catch (error) {
            ErrorHandler.internalServerError(undefined, 50010215)
        }
    }

}

export default new BookingModel();