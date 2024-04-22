import dbconnect from "../config/db.config.js"
import { PutItemCommand, QueryCommand, UpdateItemCommand, DeleteItemCommand  } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ErrorHandler } from "../errors/ErrorHandler.js";

class TokenModel{

    async storeRefreshToken(UserId, refreshToken){
        if(!UserId || !refreshToken){
            ErrorHandler.internalServerError(undefined, 500221)
        } 

        const storeRefTokenParems = {
            TableName: Bun.env.AWS_TOKEN_DB_TBNAME,
            Item: {
                'User_Id': { S: UserId },
                'User_RefreshToken': { S: refreshToken },
                'DT': { S: new Date().toISOString() }
              },
        }

        try {
            const putItemCommand = new PutItemCommand(storeRefTokenParems);
            const {$metadata} = await dbconnect.send(putItemCommand)
            if($metadata.httpStatusCode !== 200){
                return undefined
            }
            return

        } catch (error) {
            ErrorHandler.internalServerError(undefined, 500222)
        }
    }

    async deleteRefToken(userId){
        if(!userId){
            ErrorHandler.internalServerError(undefined, 500223)
        }
        
        const deleteRefTokenParams = {
            TableName: Bun.env.AWS_TOKEN_DB_TBNAME,
            Key: {
              User_Id: { S: userId },
            },
        }
        
        const deleteCMD = new DeleteItemCommand(deleteRefTokenParams);
        
        try {
            const {$metadata} = await dbconnect.send(deleteCMD)
            if($metadata.httpStatusCode !== 200){
                return undefined
            }
            return
        } catch (error) {
            ErrorHandler.internalServerError(undefined, 500224)
        }
    }
}

export default new TokenModel();