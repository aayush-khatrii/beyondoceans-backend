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
            console.log(err)
            ErrorHandler.internalServerError(undefined, 500122)
        }
    }

    async CreateUserbyPhone({ userId, phone, country }){
        if( !userId || !phone || !country){
            ErrorHandler.internalServerError(undefined, 500123)
        }

        const newUserData = {
            User_Id: userId,
            User_Phone : parseInt(phone, 10),
            CTRY: country,
        }

        const createbyPHNParams = {
            TableName: Bun.env.AWS_USER_DB_TBNAME,
            Item: marshall({
                'User_Id': userId,
                'User_Phone': parseInt(phone, 10),
                'CTRY': country,
                'DT': new Date().toISOString()
            }),
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
            KeyConditionExpression: "User_Email = :userEmai",
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

    async CreateUserbyEmail({ userId, email, country }){
        if( !userId || !email || !country){
            ErrorHandler.internalServerError(undefined, 500127)
        }

        const newUserData = {
            User_Id: userId,
            User_Email : email,
            CTRY: country,
        }

        const createbyEmailParams = {
            TableName: Bun.env.AWS_USER_DB_TBNAME,
            Item: marshall({
                'User_Id': userId,
                'User_Email': email,
                'CTRY': country,
                'DT': new Date().toISOString()
            }),
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

}

export default new AuthModel();