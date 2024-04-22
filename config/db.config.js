import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { awsDBCredProvider } from '../providers/awsProvider'

const dbconnect = new DynamoDBClient(awsDBCredProvider);

export default dbconnect;
