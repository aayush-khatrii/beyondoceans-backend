import { S3Client } from '@aws-sdk/client-s3';
import { awsS3CredProvider } from '../providers/awsProvider.js'

const awsS3client = new S3Client(awsS3CredProvider);

export default awsS3client;
