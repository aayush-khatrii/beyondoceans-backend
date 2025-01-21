import dbconnect from "../config/db.config.js"
import { ScanCommand, QueryCommand, BatchGetItemCommand  } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ErrorHandler } from "../errors/ErrorHandler.js";

class ActivityModel{

    async fetchAllActivities(){

        const fetchAllActivityParams = {
            TableName: Bun.env.AWS_ACTIVITY_DB_TBNAME,
            ProjectionExpression: 'Activity_Id, Img_Path, Activity_Title, Tags, Activity_Duration, Activity_Place, Activity_Age, Activity_INC, Price, Activity_Type',
        }

        const fetchAllActivityCMD = new ScanCommand(fetchAllActivityParams);

        try {
            const fetchAllActivityRESP = await dbconnect.send(fetchAllActivityCMD);
            const ActivitiesData = fetchAllActivityRESP.Items.map((item) => unmarshall(item))
            if(ActivitiesData.length === 0){
                return undefined
            }
            return ActivitiesData

        } catch (err) {
            ErrorHandler.internalServerError(undefined, 500821)
        }
    }

    async fetchFilterActivities(category){

        if(!category){
            ErrorHandler.internalServerError(undefined, 500822)
        }

        const fetchFilterActivitiesParams = {
            TableName: Bun.env.AWS_ACTIVITY_DB_TBNAME,
            FilterExpression: "Activity_Type.URL_Value = :filterCategory",
            ExpressionAttributeValues: {
                ":filterCategory": marshall(category)
            },
            ProjectionExpression: 'Activity_Id, Img_Path, Activity_Title, Tags, Activity_Duration, Activity_Place, Activity_Age, Activity_INC, Price, Activity_Type',
        }

        const fetchFilterActivityCMD = new ScanCommand(fetchFilterActivitiesParams);

        try {
            const fetchFilterActivityRESP = await dbconnect.send(fetchFilterActivityCMD);
            const filterActivitiesData = fetchFilterActivityRESP.Items.map((item) => unmarshall(item))
            if(filterActivitiesData.length === 0){
                return undefined
            }
            return filterActivitiesData

        } catch (err) {
            ErrorHandler.internalServerError(undefined, 500823)
        }
    }

    async fetchSingleActivity(activityId){

        if(!activityId){
            ErrorHandler.internalServerError(undefined, 500824)
        }

        const findActivityParams = {
            TableName: Bun.env.AWS_ACTIVITY_DB_TBNAME,
            KeyConditionExpression: "Activity_Id = :activityID",
            ExpressionAttributeValues: marshall({ ":activityID": activityId}),
        };

        const findActivityCMD = new QueryCommand(findActivityParams);
        try {
            const findActivityRESP = await dbconnect.send(findActivityCMD);
            const activityData = findActivityRESP.Items.map((item) => unmarshall(item))
            if(activityData.length === 0){
                return undefined
            }
            return activityData[0]

        } catch (error) {
            ErrorHandler.internalServerError(undefined, 500825)
        }
    }

}

export default new ActivityModel();