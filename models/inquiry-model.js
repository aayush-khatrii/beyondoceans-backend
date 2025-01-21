import dbconnect from "../config/db.config.js"
import { PutItemCommand, QueryCommand, UpdateItemCommand  } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ErrorHandler } from "../errors/ErrorHandler.js";

class PackageModel{

    async storePackageInquiry(inqData, inqId){

        const date = new Date();
        const options = { timeZone: "Asia/Kolkata", hour12: false };
        const istDate = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata" }).format(date);
        const istTime = date.toLocaleTimeString("en-GB", { ...options });
        const formattedDate = `${istDate}, ${istTime}`;

        const newUserData = {
            Inq_Id: inqId,
            Inq_Type: "Package",
            Package_Id: inqData.packageId,
            Package_Option_Id: inqData.packageOptionId,
            Name: inqData.name,
            Phone: inqData.phonenumber,
            Email: inqData.email,
            Trip_Date: inqData.tripDate,
            Duration: inqData.tripDuration,
            Traveler: {
                Adults: inqData.traveler.adults,
                Child: inqData.traveler.child,
                Infant: inqData.traveler.infant,
            },
            DT: formattedDate,
            Inq_Status_Data: {
                Inq_Status: "New"
            }
        }

        const storePackageInqParams = {
            TableName: Bun.env.AWS_INQ_DB_TBNAME,
            Item: marshall(newUserData),
        }

        try{
            const putItemCommand = new PutItemCommand(storePackageInqParams);
            const {$metadata} = await dbconnect.send(putItemCommand)
            if($metadata.httpStatusCode !== 200){
                return undefined
            }
            return true
            
        } catch (error) {
            ErrorHandler.internalServerError(undefined, 7387513210654)
        }
    }

    async storeDestinationInquiry(inqData, inqId){

        const destinationCode = {
            1: "Sri Vijaya Puram",
            2: "Swaraj Dweep",
            3: "Shaheed Dweep",
            4: "Baratang Island",
            5: "Diglipur Island",
            6: "Rangat Island",
            7: "Long Island",
            8: "Little Andaman",
            9: "Barren Island",
        }

        const date = new Date();
        const options = { timeZone: "Asia/Kolkata", hour12: false };
        const istDate = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata" }).format(date);
        const istTime = date.toLocaleTimeString("en-GB", { ...options });
        const formattedDate = `${istDate}, ${istTime}`;

        const newUserData = {
            Inq_Id: inqId,
            Inq_Type: "Destination",
            Destination_Id: inqData.destinationId,
            Destination_Name: destinationCode[inqData.destinationId] || "N/A",
            Name: inqData.name,
            Phone: inqData.phonenumber,
            Email: inqData.email,
            Trip_Date: inqData.tripDate,
            Duration: inqData.tripDuration,
            Traveler: {
                Adults: inqData.traveler.adults,
                Child: inqData.traveler.child,
                Infant: inqData.traveler.infant,
            },
            DT: formattedDate
        }

        const storePackageInqParams = {
            TableName: Bun.env.AWS_DEST_INQ_DB_TBNAME,
            Item: marshall(newUserData),
        }

        try{
            const putItemCommand = new PutItemCommand(storePackageInqParams);
            const {$metadata} = await dbconnect.send(putItemCommand)
            if($metadata.httpStatusCode !== 200){
                return undefined
            }
            return true
            
        } catch (error) {
            ErrorHandler.internalServerError(undefined, 133333456)
        }
    }

   

}

export default new PackageModel();