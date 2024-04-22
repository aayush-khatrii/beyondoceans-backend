import dbconnect from "../config/db.config.js"
import { PutItemCommand, QueryCommand, UpdateItemCommand  } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ErrorHandler } from "../errors/ErrorHandler.js";

class SessionModel{

    async findSession(sessionID){
        if(!sessionID){
            return
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
            return {sessionData}

        } catch (error) {
            ErrorHandler.internalServerError(undefined, 500321)
        }
    }

    async addUserIdinSession(sessionID, userID){
        if(!sessionID || !userID){
            ErrorHandler.internalServerError(undefined, 500322)
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
                ErrorHandler.internalServerError(undefined, 500323)
            }
            return

        } catch (error) {
            ErrorHandler.internalServerError(undefined, 500324)
        }

    }

    async createSessionWithID(sessionID, userID){
        if(!sessionID || !userID){
            ErrorHandler.internalServerError(undefined, 500325)
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
                ErrorHandler.internalServerError(undefined, 500326)
            }
            return
        } catch (error) {
            ErrorHandler.internalServerError(undefined, 500327)
        }

    }

}

export default new SessionModel()