import dbconnect from "../config/db.config.js"
import { PutItemCommand, QueryCommand, UpdateItemCommand  } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ErrorHandler } from "../errors/ErrorHandler.js";

class SessionModel{

    async findSession(sessionID){
        if(!sessionID){
            ErrorHandler.internalServerError(undefined, 500321)
        }

        const findSessionParams = {
            TableName: Bun.env.AWS_SESSION_DB_TBNAME,
            KeyConditionExpression: "Session_Id = :sessionID",
            ExpressionAttributeValues: marshall({ ":sessionID": sessionID}),
        };

        const findSessionCMD = new QueryCommand(findSessionParams);
        try {
            const findSessionRESP = await dbconnect.send(findSessionCMD);
            const sessionData = findSessionRESP.Items.map((item) => unmarshall(item))
            if(sessionData.length === 0){
              return undefined
            }
            return sessionData[0]

        } catch (error) {
            ErrorHandler.internalServerError(undefined, 500322)
        }
    }

    async addUserIdinSession(sessionID, userID){
        if(!sessionID || !userID){
            ErrorHandler.internalServerError(undefined, 500323)
        }
        const sessionUpdateUIDParams = {
            TableName: Bun.env.AWS_SESSION_DB_TBNAME,
            Key: marshall({
                Session_Id: sessionID,
            }),
            UpdateExpression: 'set User_Id = :newValue, DT = :newDate',
            ExpressionAttributeValues: marshall({
                ':newValue': userID,
                ':newDate': new Date().toISOString()
            }), 
            ReturnValues: 'ALL_NEW',
        }

        try {
            const updateCommand = new UpdateItemCommand(sessionUpdateUIDParams)
            const {$metadata} = await dbconnect.send(updateCommand)
            if($metadata.httpStatusCode !== 200){
                ErrorHandler.internalServerError(undefined, 500324)
            }
            return

        } catch (error) {
            ErrorHandler.internalServerError(undefined, 500325)
        }

    }
    
    async createSessionWithID(sessionID, userID){
        if(!sessionID || !userID){
            ErrorHandler.internalServerError(undefined, 500326)
        }
        const createSessionWithIDParems = {
            TableName: Bun.env.AWS_SESSION_DB_TBNAME,
            Item: {
                'Session_Id': { S: sessionID },
                'User_Id': { S: userID },
                'DT': { S: new Date().toISOString() }
            },
        }
        try {
            const putItemCommand = new PutItemCommand(createSessionWithIDParems);
            const {$metadata} = await dbconnect.send(putItemCommand)
            if($metadata.httpStatusCode !== 200){
                ErrorHandler.internalServerError(undefined, 500327)
            }
            return
        } catch (error) {
            ErrorHandler.internalServerError(undefined, 500328)
        }
        
    }
    
    async storePackDatainSession(sessionID, bookingData){
        if(!sessionID || !bookingData){
            ErrorHandler.internalServerError(undefined, 500329)
        }

        const bookingDataUP = {
            Package_Id: bookingData.packageId,
            Package_Option_Id: bookingData.packageOptionId,
            Travel_Date: bookingData.travelDate,
            Traveler: {
                Rooms: bookingData.traveler.rooms,
                Adults: bookingData.traveler.adults,
                Child: bookingData.traveler.child,
                Infant: bookingData.traveler.infant
            },
            Package_Price: bookingData.packagePrice,
            Booking_Price: bookingData.bookingPrice
        }

        const initializeCheckoutParams = {
            TableName: Bun.env.AWS_SESSION_DB_TBNAME,
            Key: marshall({
                Session_Id: sessionID,
            }),
            UpdateExpression: 'set Checkout = if_not_exists(Checkout, :emptyMap)',
            ExpressionAttributeValues: marshall({
                ":emptyMap": {},  // Initialize Checkout as an empty map if it doesn't exist
            }),
            ReturnValues: 'NONE',
        };

        try {
            const initializeCheckout = new UpdateItemCommand(initializeCheckoutParams)
            const {$metadata} = await dbconnect.send(initializeCheckout)
            if($metadata.httpStatusCode !== 200){
                ErrorHandler.internalServerError(undefined, 5003210)
            }
        } catch (error) {
            ErrorHandler.internalServerError(undefined, 5003211)
        }

        const SesStorePackDataParams = {
            TableName: Bun.env.AWS_SESSION_DB_TBNAME,
            Key: marshall({
                Session_Id: sessionID,
            }),
            UpdateExpression: 'set Checkout.Package = :bookingData',
            ExpressionAttributeValues: marshall({
                ":bookingData": bookingDataUP
            }), 
            ReturnValues: 'ALL_NEW',
        }

        try {
            const updateCommand = new UpdateItemCommand(SesStorePackDataParams)
            const {$metadata} = await dbconnect.send(updateCommand)
            if($metadata.httpStatusCode !== 200){
                ErrorHandler.internalServerError(undefined, 5003212)
            }
            return
        } catch (error) {
            ErrorHandler.internalServerError(undefined, 5003213)
        }

    }


    async genSesWithPackData(sessionID, bookingData){
        if(!sessionID || !bookingData){
            ErrorHandler.internalServerError(undefined, 5003214)
        }

        const bookingDataUP = {
            Package_Id: bookingData.packageId,
            Package_Option_Id: bookingData.packageOptionId,
            Travel_Date: bookingData.travelDate,
            Traveler: {
                Rooms: bookingData.traveler.rooms,
                Adults: bookingData.traveler.adults,
                Child: bookingData.traveler.child,
                Infant: bookingData.traveler.infant
            },
            Package_Price: bookingData.packagePrice,
            Booking_Price: bookingData.bookingPrice
        }

        const genSesWithPackDataParems = {
            TableName: Bun.env.AWS_SESSION_DB_TBNAME,
            Item: marshall({
                Session_Id: sessionID,
                Checkout: { Package : bookingDataUP },
                DT: new Date().toISOString()
            }),
        }
        try {
            const putItemCommand = new PutItemCommand(genSesWithPackDataParems);
            const {$metadata} = await dbconnect.send(putItemCommand)
            if($metadata.httpStatusCode !== 200){
                ErrorHandler.internalServerError(undefined, 5003215)
            }
            return
        } catch (error) {
            ErrorHandler.internalServerError(undefined, 5003216)
        }
        
    }

    async storeMakFerryinSession(sessionID, makFerryData){
        if(!sessionID || !makFerryData){
            ErrorHandler.internalServerError(undefined, 5003217)
        }

        const SesStoreMakFerryParams = {
            TableName: Bun.env.AWS_SESSION_DB_TBNAME,
            Key: marshall({
                Session_Id: sessionID,
            }),
            UpdateExpression: 'set Checkout.Ferry = :makFerryData',
            ExpressionAttributeValues: marshall({
                ":makFerryData": makFerryData
            }), 
            ReturnValues: 'ALL_NEW',
        }

        try {
            const updateCommand = new UpdateItemCommand(SesStoreMakFerryParams)
            const {$metadata} = await dbconnect.send(updateCommand)
            if($metadata.httpStatusCode !== 200){
                ErrorHandler.internalServerError(undefined, 5003218)
            }
            return

        } catch (error) {
            ErrorHandler.internalServerError(undefined, 5003219)
        }

    }

    async genSesWithMakFerry(sessionID, makFerryData){
        if(!sessionID || !makFerryData){
            ErrorHandler.internalServerError(undefined, 5003220)
        }

        const genSesWithMakFerryParems = {
            TableName: Bun.env.AWS_SESSION_DB_TBNAME,
            Item: marshall({
                Session_Id: sessionID,
                Checkout: { Ferry : makFerryData },
                DT: new Date().toISOString()
            }),
        }
        try {
            const putItemCommand = new PutItemCommand(genSesWithMakFerryParems);
            const {$metadata} = await dbconnect.send(putItemCommand)
            if($metadata.httpStatusCode !== 200){
                ErrorHandler.internalServerError(undefined, 5003221)
            }
            return
        } catch (error) {
            ErrorHandler.internalServerError(undefined, 5003222)
        }
        
    }

    async getCheckoutData(sessionID){
        if(!sessionID){
            ErrorHandler.internalServerError(undefined, 5003223)
        }

        const findSessionParams = {
            TableName: Bun.env.AWS_SESSION_DB_TBNAME,
            KeyConditionExpression: "Session_Id = :sessionID",
            ExpressionAttributeValues: marshall({ ":sessionID": sessionID}),
            ProjectionExpression: 'Session_Id, Checkout'
        };

        const findSessionCMD = new QueryCommand(findSessionParams);
        try {
            const findSessionRESP = await dbconnect.send(findSessionCMD);
            const sessionData = findSessionRESP.Items.map((item) => unmarshall(item))
            if(sessionData.length === 0){
              return undefined
            }
            return sessionData[0]

        } catch (error) {
            ErrorHandler.internalServerError(undefined, 5003224)
        }
    }

    

    async storeBookingIdinSession(bookingId, sessionId){

        if(!bookingId || !sessionId){
            ErrorHandler.internalServerError(undefined, 5003225)
        }

        const activeBookingData = {
            Booking_Id: bookingId,
            Status: "initiated"
        }

        const SesStoreBookingIdParams = {
            TableName: Bun.env.AWS_SESSION_DB_TBNAME,
            Key: marshall({
                Session_Id: sessionId,
            }),
            UpdateExpression: 'set Active_Booking = :activeBooking',
            ExpressionAttributeValues: marshall({
                ":activeBooking": activeBookingData
            }), 
            ReturnValues: 'NONE',
        }

        try {
            const updateCommand = new UpdateItemCommand(SesStoreBookingIdParams)
            const {$metadata} = await dbconnect.send(updateCommand)
            if($metadata.httpStatusCode !== 200){
                ErrorHandler.internalServerError(undefined, 5003226)
            }
            return true

        } catch (error) {
            ErrorHandler.internalServerError(undefined, 5003227)
        }

    }

    async storeActivityDatainSession(sessionID, bookingData){
        if(!sessionID || !bookingData){
            ErrorHandler.internalServerError(undefined, 5003228)
        }

        const bookingDataUP = {
            Activity_Id: bookingData.activityId,
            Activity_Option_Id: bookingData.activityOptionId,
            Travel_Date: bookingData.travelDate,
            Traveler: {
                Persons: bookingData.traveler.persons,
            },
            Activity_Price: bookingData.activityPrice,
            Booking_Price: bookingData.bookingPrice
        }

        const initializeCheckoutParams = {
            TableName: Bun.env.AWS_SESSION_DB_TBNAME,
            Key: marshall({
                Session_Id: sessionID,
            }),
            UpdateExpression: 'set Checkout = if_not_exists(Checkout, :emptyMap)',
            ExpressionAttributeValues: marshall({
                ":emptyMap": {},  // Initialize Checkout as an empty map if it doesn't exist
            }),
            ReturnValues: 'NONE',
        };

        try {
            const initializeCheckout = new UpdateItemCommand(initializeCheckoutParams)
            const {$metadata} = await dbconnect.send(initializeCheckout)
            if($metadata.httpStatusCode !== 200){
                ErrorHandler.internalServerError(undefined, 5003229)
            }
        } catch (error) {
            ErrorHandler.internalServerError(undefined, 5003230)
        }

        const SesStoreActivityDataParams = {
            TableName: Bun.env.AWS_SESSION_DB_TBNAME,
            Key: marshall({
                Session_Id: sessionID,
            }),
            UpdateExpression: 'set Checkout.Activity = :bookingData',
            ExpressionAttributeValues: marshall({
                ":bookingData": bookingDataUP
            }), 
            ReturnValues: 'ALL_NEW',
        }

        try {
            const updateCommand = new UpdateItemCommand(SesStoreActivityDataParams)
            const {$metadata} = await dbconnect.send(updateCommand)
            if($metadata.httpStatusCode !== 200){
                ErrorHandler.internalServerError(undefined, 5003231)
            }
            return
        } catch (error) {
            ErrorHandler.internalServerError(undefined, 5003232)
        }

    }

    async genSesWithActivityData(sessionID, bookingData){
        if(!sessionID || !bookingData){
            ErrorHandler.internalServerError(undefined, 5003233)
        }

        const bookingDataUP = {
            Activity_Id: bookingData.activityId,
            Activity_Option_Id: bookingData.activityOptionId,
            Travel_Date: bookingData.travelDate,
            Traveler: {
                Persons: bookingData.traveler.persons,
            },
            Activity_Price: bookingData.activityPrice,
            Booking_Price: bookingData.bookingPrice
        }

        const genSesWithActivityDataParems = {
            TableName: Bun.env.AWS_SESSION_DB_TBNAME,
            Item: marshall({
                Session_Id: sessionID,
                Checkout: { Activity : bookingDataUP },
                DT: new Date().toISOString()
            }),
        }
        try {
            const putItemCommand = new PutItemCommand(genSesWithActivityDataParems);
            const {$metadata} = await dbconnect.send(putItemCommand)
            if($metadata.httpStatusCode !== 200){
                ErrorHandler.internalServerError(undefined, 5003234)
            }
            return
        } catch (error) {
            ErrorHandler.internalServerError(undefined, 5003235)
        }
        
    }

}

export default new SessionModel()