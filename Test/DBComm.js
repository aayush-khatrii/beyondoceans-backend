import dbconnect from "../config/db.config.js"
import { PutItemCommand, QueryCommand, UpdateItemCommand  } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const userId = "39d93383-03c8-4328-a31e-5246af1f18e4"
const bookingId = "awdawdwdwdawd aw"

async function caller(){
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
        console.log($metadata)
    }
} catch (error) {
    console.log(error)
}


const updateDataParams = {
    TableName: Bun.env.AWS_USER_DB_TBNAME,
    Key: marshall({
        User_Id: userId,
    }),
    UpdateExpression: 'SET Bookings.Packages = list_append(if_not_exists(Bookings.Packages, :emptyList), :newBookingId)',
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
        console.log(Attributes)
    }
    const userData = unmarshall(Attributes)
    console.log(userData)

} catch (error) {
    console.log(error)
}
}
caller()