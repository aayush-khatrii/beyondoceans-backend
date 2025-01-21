import awsS3client from '../config/s3.config.js'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const timeStamps = "18/08/2024, 03:32:07"
const bookingId = "BOP45db97900c90cf3"

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
        Bucket: "beyond-oceans-invoice",
        Key: s3FormatedKey,
        ResponseContentDisposition: `attachment; filename="${invoiceFileName}"`
    });

    const signedUrl = await getSignedUrl(awsS3client, getObjectCommand, { expiresIn: 300 })
    console.log(signedUrl)
    
} catch (error) {
    console.log(error)
}