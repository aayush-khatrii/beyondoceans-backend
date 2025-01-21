import dbconnect from "../config/db.config.js"
import { PutItemCommand, ScanCommand, QueryCommand, UpdateItemCommand  } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ErrorHandler } from "../errors/ErrorHandler.js";

class AdminModel{

    async CreateAdminUser(newUserModifiedData){

        if(!newUserModifiedData){
            ErrorHandler.internalServerError(undefined, 1002001)
        }

        const createAdminUserParams = {
            TableName: Bun.env.AWS_ADMIN_DB_TBNAME,
            Item: marshall(newUserModifiedData),
        }

        try{
            const putItemCommand = new PutItemCommand(createAdminUserParams);
            const {$metadata} = await dbconnect.send(putItemCommand)
            if($metadata.httpStatusCode !== 200){
                return undefined
            }
            return true
            
        } catch (error) {

            console.log(error)
            ErrorHandler.internalServerError(undefined, 1002002)
        }

    }

    async getUsersList(){

        const fetchAllUsersParams = {
            TableName: Bun.env.AWS_ADMIN_DB_TBNAME,
            ProjectionExpression: 'User_Id, User_Name, User_Email, User_Phone, User_Designation, User_Role',
        }

        const fetchAllUserCMD = new ScanCommand(fetchAllUsersParams);

        try {
            const fetchAllUserRESP = await dbconnect.send(fetchAllUserCMD);
            const usersDataList = fetchAllUserRESP.Items.map((item) => unmarshall(item))
            if(usersDataList.length === 0){
                return undefined
            }
            return usersDataList

        } catch (err) {
            ErrorHandler.internalServerError("Cant get all dashboard users list", 1002003)
        }

    }

    async fetchSingleUser(userLoginData){

        if(!userLoginData.email || !userLoginData.password){
            ErrorHandler.internalServerError(undefined, 1002004)
        }

        const fetchSingleUserParams = {
            TableName: Bun.env.AWS_ADMIN_DB_TBNAME,
            IndexName: Bun.env.DB_ADMIN_EMAIL_INDEX,
            KeyConditionExpression: "User_Email = :userEmail",
            ExpressionAttributeValues: marshall({":userEmail": userLoginData.email}),
        }

        const fetchSingleUserCMD = new QueryCommand(fetchSingleUserParams);

        try {
            const fetchSingleUserRESP = await dbconnect.send(fetchSingleUserCMD);
            const userData = fetchSingleUserRESP.Items.map((item) => unmarshall(item))
            // console.log(userData)
            if(userData.length === 0){
                return undefined
            }
            return userData[0]

        } catch (err) {
            ErrorHandler.internalServerError("Cant get all dashboard users list", 1002005)
        }

    }

    async findUserbyUserId(userId){
        if(!userId){
            ErrorHandler.internalServerError(undefined, 1002006)
        }

        const findbyPHNParams = {
            TableName: Bun.env.AWS_ADMIN_DB_TBNAME,
            KeyConditionExpression: "User_Id = :userId",
            ExpressionAttributeValues: marshall({":userId": userId}),
        }

        const findbyUIDCMD = new QueryCommand(findbyPHNParams);

        try {
            const findByUIDRESP = await dbconnect.send(findbyUIDCMD);
            const userData = findByUIDRESP.Items.map((item) => unmarshall(item))
            if(userData.length === 0){
                return false
            }
            if(userData[0].User_Email){
                return userData[0]
            }

        } catch (err) {
            ErrorHandler.internalServerError(undefined, 1002007)
        }
    }

    async fetchEnquiriesList(){

        const fetchAllEnquiriesParams = {
            TableName: Bun.env.AWS_INQ_DB_TBNAME,
            ProjectionExpression: 'Inq_Id, #name, Email, Phone, #duration, Trip_Date, Inq_Type, Inq_Status_Data, DT',
            ExpressionAttributeNames: {
                "#name": "Name",
                "#duration": "Duration",
            },
        }

        const fetchAllEnquiryCMD = new ScanCommand(fetchAllEnquiriesParams);

        try {
            const fetchAllEnquiryRESP = await dbconnect.send(fetchAllEnquiryCMD);
            const enquiryList = fetchAllEnquiryRESP.Items.map((item) => unmarshall(item))
            if(enquiryList.length === 0){
                return undefined
            }
            return enquiryList

        } catch (err) {
            console.log(err)
            ErrorHandler.internalServerError("Cant fetch All Enquiry", 1002008)
        }
    }

    async fetchHotelsbyFilter(destination){

        if(!destination){
            ErrorHandler.internalServerError(undefined, 1002009)
        }

        const fetchHotelsbyFilterParams = {
            TableName: Bun.env.AWS_HOTEL_DB_TBNAME,
            FilterExpression: 'Hotel_Destination = :destination',
            ExpressionAttributeValues: marshall({":destination": destination}),
        }

        const fetchHotelsbyFilterCMD = new ScanCommand(fetchHotelsbyFilterParams);

        try {
            const fetchHotelsbyFilterRESP = await dbconnect.send(fetchHotelsbyFilterCMD);
            const hotelsList = fetchHotelsbyFilterRESP.Items.map((item) => unmarshall(item))
            if(hotelsList.length === 0){
                return undefined
            }
            return hotelsList

        } catch (err) {
            ErrorHandler.internalServerError("Cant fetch All Enquiry", 1002010)
        }
    }

    async fetchSSbyFilter(destination){

        if(!destination){
            ErrorHandler.internalServerError(undefined, 1002011)
        }

        const fetchSSbyFilterParams = {
            TableName: Bun.env.AWS_SS_DB_TBNAME,
            FilterExpression: 'SS_Island = :destination',
            ExpressionAttributeValues: marshall({":destination": destination}),
        }

        const fetchSSbyFilterCMD = new ScanCommand(fetchSSbyFilterParams);

        try {
            const fetchSSbyFilterRESP = await dbconnect.send(fetchSSbyFilterCMD);
            const sightseeingList = fetchSSbyFilterRESP.Items.map((item) => unmarshall(item))
            if(sightseeingList.length === 0){
                return undefined
            }
            return sightseeingList

        } catch (err) {
            ErrorHandler.internalServerError("Cant fetch All Enquiry", 1002012)
        }
    }

    async fetchSingleInquiry(inqId){
        if(!inqId){
            ErrorHandler.internalServerError(undefined, 1002013)
        }

        const singleInquiryParams = {
            TableName: Bun.env.AWS_INQ_DB_TBNAME,
            KeyConditionExpression: "Inq_Id = :inqId",
            ExpressionAttributeValues: marshall({":inqId": inqId}),
        }

        const fetchSingleInqCMD = new QueryCommand(singleInquiryParams);

        try {
            const fetchSingleInqRESP = await dbconnect.send(fetchSingleInqCMD);
            const singleInquiry = fetchSingleInqRESP.Items.map((item) => unmarshall(item))
            if(singleInquiry.length === 0){
                return false
            }
            return singleInquiry[0]
        } catch (err) {
            ErrorHandler.internalServerError(undefined, 1002014)
        }
    }

    async updateInquiry(user, inqId, status){

        if(!user || !inqId || !status){
            ErrorHandler.internalServerError(undefined, 1002015)
        }

        const inquiryStatusUpdateParam = {
            TableName: Bun.env.AWS_INQ_DB_TBNAME,
            Key: marshall({
                Inq_Id: inqId,
            }),
            // UpdateExpression: 'set Inq_Status_Data.Inq_Status = :newStatus, Inq_Status_Data.User_Data ,Inq_Status_Data.Update_Date = :newDate',
            UpdateExpression: `
                set
                Inq_Status_Data.Inq_Status = :latestStatus,
                Inq_Status_Data.Update_Date = :latestUpdateDate,
                Inq_Status_Data.Inq_Updater_List = list_append(if_not_exists(Inq_Status_Data.Inq_Updater_List, :emptyList), :newLogEntry)
            `,
            ExpressionAttributeValues: marshall({
                ':latestStatus': status,
                ':latestUpdateDate': new Date().toISOString(),
                ':emptyList': [],
                ':newLogEntry': [
                    {
                        User_Id: user.User_Id,
                        User_Name: user.User_Name,
                        User_Role: user.User_Role,
                        Updated_Status: status,
                        Update_Date: new Date().toISOString(),
                    },
                ],
            }), 
            ReturnValues: 'NONE',
        }

        try {
            const updateCommand = new UpdateItemCommand(inquiryStatusUpdateParam)
            const {$metadata} = await dbconnect.send(updateCommand)
            if($metadata.httpStatusCode !== 200){
                return false
            }
            return true

        } catch (error) {
            ErrorHandler.internalServerError(undefined, 1002016)
        }

    }

}

export default new AdminModel();