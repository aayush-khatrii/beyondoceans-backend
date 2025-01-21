import dbconnect from "../config/db.config.js"
import { ScanCommand, QueryCommand, BatchGetItemCommand  } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ErrorHandler } from "../errors/ErrorHandler.js";

class PackageModel{

    async fetchAllPackages(){

        const fetchAllPackParams = {
            TableName: Bun.env.AWS_PACK_DB_TBNAME,
            ProjectionExpression: 'Package_Id, Img_Path, Pack_Duration, Package_Title, Featurs, Pack_Schedule, Tags, Price, Destination, Tour_Type',
        }

        const fetchAllPackCMD = new ScanCommand(fetchAllPackParams);

        try {
            const fetchAllPackRESP = await dbconnect.send(fetchAllPackCMD);
            const packagesData = fetchAllPackRESP.Items.map((item) => unmarshall(item))
            if(packagesData.length === 0){
                return undefined
            }
            return packagesData

        } catch (err) {
            ErrorHandler.internalServerError(undefined, 500721)
        }
    }

    async fetchSinglePackages(packageID){

        if(!packageID){
            ErrorHandler.internalServerError(undefined, 500722)
        }

        const findSessionParams = {
            TableName: Bun.env.AWS_PACK_DB_TBNAME,
            KeyConditionExpression: "Package_Id = :packageID",
            ExpressionAttributeValues: marshall({ ":packageID": packageID}),
        };

        const findSessionCMD = new QueryCommand(findSessionParams);
        try {
            const findSessionRESP = await dbconnect.send(findSessionCMD);
            const packageData = findSessionRESP.Items.map((item) => unmarshall(item))
            if(packageData.length === 0){
                return undefined
            }
            return packageData[0]

        } catch (error) {
            ErrorHandler.internalServerError(undefined, 500723)
        }
    }

    async fetchOptionHotels(hotelIds){

        if(!hotelIds || !Array.isArray(hotelIds) || hotelIds.length === 0){
            ErrorHandler.internalServerError(undefined, 500724)
        }

        const tableName = Bun.env.AWS_HOTEL_DB_TBNAME

        const keysForBatchGet = hotelIds.map(id => ({
            Hotel_Id: { S: id }
        }));

        const params = {
            RequestItems: {
                [tableName]: {
                    Keys: keysForBatchGet,
                    ProjectionExpression: 'Hotel_Id, Hotel_Destination, Hotel_Images, Hotel_Name, Stay_Type'
                }
            }
        };

        const betchGetCMD = new BatchGetItemCommand(params);
        try {
            const betchGetRESP = await dbconnect.send(betchGetCMD);
            const hotelsData = betchGetRESP.Responses[tableName].map((item) => unmarshall(item))
            //below logic reordere Items
            const reorderedItems = hotelIds.map(id => hotelsData.find(item => item.Hotel_Id === id));
            if(reorderedItems.length === 0){
                return undefined
            }
            return reorderedItems

        } catch (error) {
            ErrorHandler.internalServerError(undefined, 500725)
        }
    }

    async fetchFilterPackages(category){

        if(!category){
            ErrorHandler.internalServerError(undefined, 500726)
        }

        const fetchFilterPackParams = {
            TableName: Bun.env.AWS_PACK_DB_TBNAME,
            FilterExpression: "Tour_Type.URL_Value = :filterCategory",
            ExpressionAttributeValues: {
                ":filterCategory": marshall(category)
            },
            ProjectionExpression: 'Package_Id, Img_Path, Pack_Duration, Package_Title, Featurs, Pack_Schedule, Tags, Price, Destination, Tour_Type',
        }

        const fetchFilterPackCMD = new ScanCommand(fetchFilterPackParams);

        try {
            const fetchFilterPackRESP = await dbconnect.send(fetchFilterPackCMD);
            const filterPackagesData = fetchFilterPackRESP.Items.map((item) => unmarshall(item))
            if(filterPackagesData.length === 0){
                return undefined
            }
            return filterPackagesData

        } catch (err) {
            ErrorHandler.internalServerError(undefined, 500727)
        }
    }

    async fetchFeaturedPackages(category){

        if(!category){
            ErrorHandler.internalServerError(undefined, 500728)
        }

        const featuredPackParams = {
            TableName: Bun.env.AWS_PACK_DB_TBNAME,
            FilterExpression: "Theam = :featuredName",
            ExpressionAttributeValues: {
                ":featuredName": marshall(category)
            },
            ProjectionExpression: 'Package_Id, Img_Path, Package_Title, Price, Tour_Type',
        }

        const fetchFeaturedPackCMD = new ScanCommand(featuredPackParams);

        try {
            const fetchFeaturedPackRESP = await dbconnect.send(fetchFeaturedPackCMD);
            const featuredPackagesData = fetchFeaturedPackRESP.Items.map((item) => unmarshall(item))
            if(featuredPackagesData.length === 0){
                return undefined
            }
            return featuredPackagesData

        } catch (err) {
            ErrorHandler.internalServerError(undefined, 500729)
        }
    }

    
}

export default new PackageModel();