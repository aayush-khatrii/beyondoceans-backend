import dbconnect from "../config/db.config.js"
import { PutItemCommand, QueryCommand, UpdateItemCommand  } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ErrorHandler } from "../errors/ErrorHandler.js";

class AuthModel{
    
    async findUserbyPhone(phone){
        if(!phone){
            ErrorHandler.internalServerError(undefined, 500121)
        }

        const findbyPHNParams = {
            TableName: Bun.env.AWS_USER_DB_TBNAME,
            IndexName: Bun.env.DB_USER_PHONE_INDEX,
            KeyConditionExpression: "User_Phone = :userPhone",
            ExpressionAttributeValues: marshall({ ":userPhone": parseInt(phone, 10)}),
        }

        const findbyPHNCMD = new QueryCommand(findbyPHNParams);

        try {
            const findByPhoneRESP = await dbconnect.send(findbyPHNCMD);
            const userData = findByPhoneRESP.Items.map((item) => unmarshall(item))
            if(userData.length === 0){
                return undefined
            }
            return userData[0]

        } catch (err) {
            ErrorHandler.internalServerError(undefined, 500122)
        }
    }

    async CreateUserbyPhone({ userId, phone, country, Auth_Lv }){
        if( !userId || !phone || !country || !Auth_Lv){
            ErrorHandler.internalServerError(undefined, 500123)
        }

        const newUserData = {
            User_Id: userId,
            User_Phone : parseInt(phone, 10),
            User_Address: {
                Country: country
            },
            Auth_Lv,
            DT: new Date().toISOString()
        }

        const createbyPHNParams = {
            TableName: Bun.env.AWS_USER_DB_TBNAME,
            Item: marshall(newUserData),
        }

        try{
            const putItemCommand = new PutItemCommand(createbyPHNParams);
            const {$metadata} = await dbconnect.send(putItemCommand)
            if($metadata.httpStatusCode !== 200){
                return undefined
            }
            return newUserData
            
        } catch (error) {
            ErrorHandler.internalServerError(undefined, 500124)
        }
    }

    async findUserbyEmail(email){
        if(!email){
            ErrorHandler.internalServerError(undefined, 500125)
        }

        const findbyEmailParams = {
            TableName: Bun.env.AWS_USER_DB_TBNAME,
            IndexName: Bun.env.DB_USER_EMAIL_INDEX,
            KeyConditionExpression: "User_Email = :userEmail",
            ExpressionAttributeValues: marshall({ ":userEmail": email}),
        }

        const findbyEmailCMD = new QueryCommand(findbyEmailParams);

        try {
            const findByEmailRESP = await dbconnect.send(findbyEmailCMD);
            const userData = findByEmailRESP.Items.map((item) => unmarshall(item))
            if(userData.length === 0){
                return undefined
            }
            return userData[0]

        } catch (err) {
            ErrorHandler.internalServerError(undefined, 500126)
        }
    }

    async CreateUserbyEmail({ userId, email, country, Auth_Lv }){
        if( !userId || !email || !country || !Auth_Lv){
            ErrorHandler.internalServerError(undefined, 500127)
        }

        const newUserData = {
            User_Id: userId,
            User_Email : email,
            User_Address: {
                Country: country
            },
            Auth_Lv,
            DT: new Date().toISOString()
        }

        const createbyEmailParams = {
            TableName: Bun.env.AWS_USER_DB_TBNAME,
            Item: marshall(newUserData),
        }

        try{
            const putItemCommand = new PutItemCommand(createbyEmailParams);
            const {$metadata} = await dbconnect.send(putItemCommand)
            if($metadata.httpStatusCode !== 200){
                return undefined
            }
            return newUserData
            
        } catch (error) {
            ErrorHandler.internalServerError(undefined, 500128)
        }
    }

    async findUserbyIntEmail({phone, email}){

        if(!phone || !email){
            ErrorHandler.internalServerError(undefined, 500129)
        }

        const findbyPHNParams = {
            TableName: Bun.env.AWS_USER_DB_TBNAME,
            IndexName: Bun.env.DB_USER_PHONE_INDEX,
            KeyConditionExpression: "User_Phone = :userPhone",
            ExpressionAttributeValues: marshall({ ":userPhone": parseInt(phone, 10)}),
        }
        
        const findbyPHNCMD = new QueryCommand(findbyPHNParams);
        let userDatabyPhone

        try {
            const findByPhoneRESP = await dbconnect.send(findbyPHNCMD);
            userDatabyPhone = findByPhoneRESP.Items.map((item) => unmarshall(item))

        } catch (err) {
            ErrorHandler.internalServerError(undefined, 5001210)
        }

        if(userDatabyPhone.length === 0){

            const findbyEmailParams = {
                TableName: Bun.env.AWS_USER_DB_TBNAME,
                IndexName: Bun.env.DB_USER_EMAIL_INDEX,
                KeyConditionExpression: "User_Email = :userEmail",
                ExpressionAttributeValues: marshall({ ":userEmail": email}),
            }
        
            const findbyEmailCMD = new QueryCommand(findbyEmailParams);
            let userDatabyEmail
        
            try {
                const findByEmailRESP = await dbconnect.send(findbyEmailCMD);
                userDatabyEmail = findByEmailRESP.Items.map((item) => unmarshall(item))
            } catch (err) {
                ErrorHandler.internalServerError(undefined, 5001211)
            }

            if(userDatabyEmail.length !== 0){
                ErrorHandler.notAcceptableError("Email is already linked with other phone Number", 5001212)
            }
            return

        }else if (userDatabyPhone[0].User_Email && userDatabyPhone[0].User_Email !== email){
            ErrorHandler.internalServerError("Phone Number is linked with other email", 5001213)
        }

        return userDatabyPhone[0]
            
    }

    async CreateUserbyIntEmail({ userId, phone, email, country, Auth_Lv }){
        if( !userId || !phone || !email || !country || !Auth_Lv){
            ErrorHandler.internalServerError(undefined, 5001214)
        }

        const newUserData = {
            User_Id: userId,
            User_Phone: parseInt(phone, 10),
            User_Email : email,
            User_Address: {
                Country: country
            },
            Auth_Lv,
            DT: new Date().toISOString()
        }

        const createbyIntEmailParams = {
            TableName: Bun.env.AWS_USER_DB_TBNAME,
            Item: marshall(newUserData),
        }

        try{
            const putItemCommand = new PutItemCommand(createbyIntEmailParams);
            const {$metadata} = await dbconnect.send(putItemCommand)
            if($metadata.httpStatusCode !== 200){
                return undefined
            }
            return newUserData
            
        } catch (error) {
            ErrorHandler.internalServerError(undefined, 5001215)
        }
    }

    async isUserAvalible(userId){
        if(!userId){
            ErrorHandler.internalServerError(undefined, 5001216)
        }

        const findbyPHNParams = {
            TableName: Bun.env.AWS_USER_DB_TBNAME,
            KeyConditionExpression: "User_Id = :userId",
            ExpressionAttributeValues: marshall({ ":userId": userId}),
        }

        const findbyPHNCMD = new QueryCommand(findbyPHNParams);

        try {
            const findByPhoneRESP = await dbconnect.send(findbyPHNCMD);
            const userData = findByPhoneRESP.Items.map((item) => unmarshall(item))
            if(userData.length === 0){
                return undefined
            }
            if(userData[0].User_Email || userData[0].User_Phone || userData[0].DT){
                return true
            }

        } catch (err) {
            ErrorHandler.internalServerError(undefined, 5001217)
        }
    }


    async findUserbyUserId(userId){
        if(!userId){
            ErrorHandler.internalServerError(undefined, 5001216)
        }

        const findbyPHNParams = {
            TableName: Bun.env.AWS_USER_DB_TBNAME,
            KeyConditionExpression: "User_Id = :userId",
            ExpressionAttributeValues: marshall({ ":userId": userId}),
        }

        const findbyPHNCMD = new QueryCommand(findbyPHNParams);

        try {
            const findByPhoneRESP = await dbconnect.send(findbyPHNCMD);
            const userData = findByPhoneRESP.Items.map((item) => unmarshall(item))
            if(userData.length === 0){
                return false
            }
            if(userData[0].User_Email || userData[0].User_Phone || userData[0].DT){
                return userData[0]
            }

        } catch (err) {
            ErrorHandler.internalServerError(undefined, 5001217)
        }
    }

    async updateUserData(updateReqData, userId){

        if(!updateReqData || !userId){
            ErrorHandler.internalServerError(undefined, 5001218)
        }

        // console.log({updateExpression, expressionAttributeValues})

        const updateExpressionParts = [];
        const expressionAttributeValues = {};
      
        for (const [key, value] of Object.entries(updateReqData)) {
          if (value !== undefined) {
            if (key === "User_Address" && typeof value === "object") {
              // Handle nested User_Address attributes
              for (const [nestedKey, nestedValue] of Object.entries(value)) {
                if (nestedValue !== undefined) {
                  const nestedAttributeName = `User_Address.${nestedKey}`;
                  const nestedAttributeValue = `:${nestedKey}`;
      
                  updateExpressionParts.push(`${nestedAttributeName} = ${nestedAttributeValue}`);
                  expressionAttributeValues[nestedAttributeValue] = nestedValue;
                }
              }
            } else {
              // Handle top-level attributes
              const attributeName = `${key}`;
              const attributeValue = `:${key}`;
      
              updateExpressionParts.push(`${attributeName} = ${attributeValue}`);
              expressionAttributeValues[attributeValue] = value;
            }
          }
        }
        const updateExpression = `SET ${updateExpressionParts.join(', ')}`

        const updateDataParams = {
            TableName: Bun.env.AWS_USER_DB_TBNAME,
            Key: marshall({
                User_Id: userId,
            }),
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: marshall(expressionAttributeValues), 
            ReturnValues: 'ALL_NEW',
        }

        try {
            const updateCommand = new UpdateItemCommand(updateDataParams)
            const {$metadata, Attributes} = await dbconnect.send(updateCommand)
            if($metadata.httpStatusCode !== 200){
                ErrorHandler.internalServerError(undefined, 5001219)
            }
            const userData = unmarshall(Attributes)
            return userData

        } catch (error) {
            console.log(error)
            ErrorHandler.internalServerError(undefined, 5001220)
        }

        return updateReqData
    }

    async storeBookingIDinUserID(bookingId, userId, bookingType){


        if(!bookingId || !userId || !bookingType){
            ErrorHandler.internalServerError(undefined, 5001221)
        }

        const initializeBookingParams = {
            TableName: Bun.env.AWS_USER_DB_TBNAME,
            Key: marshall({
                User_Id: userId,
            }),
            UpdateExpression: 'SET Bookings = if_not_exists(Bookings, :emptyMap)',
            ExpressionAttributeValues: marshall({
                ":emptyMap": {},  // Initialize Checkout as an empty map if it doesn't exist
            }),
            ReturnValues: 'NONE',
        };

        try {
            const initializeBooking = new UpdateItemCommand(initializeBookingParams)
            const {$metadata} = await dbconnect.send(initializeBooking)
            if($metadata.httpStatusCode !== 200){
                ErrorHandler.internalServerError(undefined, 5001222)
            }
        } catch (error) {
            ErrorHandler.internalServerError(undefined, 5001223)
        }

        let DynamicUpdateExpression;

        if(bookingType === "Package"){
            DynamicUpdateExpression = 'SET Bookings.Packages = list_append(if_not_exists(Bookings.Packages, :emptyList), :newBookingId)'
        }
        if(bookingType === "Activity"){
            DynamicUpdateExpression = 'SET Bookings.Activity = list_append(if_not_exists(Bookings.Activity, :emptyList), :newBookingId)'
        }
        if(bookingType === "Sightseeing"){
            DynamicUpdateExpression = 'SET Bookings.Sightseeing = list_append(if_not_exists(Bookings.Sightseeing, :emptyList), :newBookingId)'
        }
        if(bookingType === "Ferry"){
            DynamicUpdateExpression = 'SET Bookings.Ferry = list_append(if_not_exists(Bookings.Ferry, :emptyList), :newBookingId)'
        }


        const updateDataParams = {
            TableName: Bun.env.AWS_USER_DB_TBNAME,
            Key: marshall({
                User_Id: userId,
            }),
            UpdateExpression: DynamicUpdateExpression,
            ExpressionAttributeValues: marshall({
                ':newBookingId': [bookingId], // The bookingId you want to add
                ':emptyList': [] // An empty list if Bookings.Packages doesn't exist
            }),
            ReturnValues: 'ALL_NEW',
        }

        try {
            const updateCommand = new UpdateItemCommand(updateDataParams)
            const {$metadata, Attributes} = await dbconnect.send(updateCommand)
            if($metadata.httpStatusCode !== 200){
                return false
            }
            const userData = unmarshall(Attributes)
            return userData

        } catch (error) {
            ErrorHandler.internalServerError(undefined, 5001222)
        }

    }

}

export default new AuthModel();