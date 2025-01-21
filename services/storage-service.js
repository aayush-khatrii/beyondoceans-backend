import awsS3client from '../config/s3.config.js'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ErrorHandler } from '../errors/ErrorHandler.js';

class storageService{
    async getPresignedURL(bookingId, timeStamps){

        const [day, month, yearTime] = timeStamps.split('/');
        const [year] = yearTime.split(', ');
        
        // Create a Date object using the extracted month and year
        const date = new Date(`${year}-${month}-${day}`);
        
        // Get the full month name using Intl.DateTimeFormat
        const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date).toLowerCase();

        const invoiceFileName = `invoice_${bookingId}.pdf`

        const s3FormatedKey = `${year}/${monthName}/${invoiceFileName}`;

        try {

            const getObjectCommand = new GetObjectCommand({
                Bucket: Bun.env.S3_INVOICE_BUCKET,
                Key: s3FormatedKey,
                ResponseContentDisposition: `attachment; filename="${invoiceFileName}"`
            });

            const signedUrl = await getSignedUrl(awsS3client, getObjectCommand, { expiresIn: 300 })
            return { preSignedUrl: signedUrl, fileName: invoiceFileName}
            
        } catch (error) {
            console.log("500122111212",error)
            ErrorHandler.internalServerError("cant genereate presigned url", 500122111212)
        }

    }
}

export default new storageService()