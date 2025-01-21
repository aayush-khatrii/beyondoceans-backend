import awsSESclient from "../config/ses.config.js"
import { SendTemplatedEmailCommand, SendEmailCommand } from "@aws-sdk/client-ses";
import { ErrorHandler } from "../errors/ErrorHandler.js";
import { sendOTPSMS } from '../api/SMS/FastSMS.js'

class sendService{
    async sendEmailOTP(toEmail, otp){

        const SESparems = {
            Source: `Beyond Oceans <${Bun.env.EMAIL_NOREPLY}>`,
            Destination: {
              ToAddresses: [toEmail],
            },
            Template: 'BO_Template', // Replace with the name of your template
            TemplateData: JSON.stringify({otp}),
            ReplyToAddresses: [Bun.env.EMAIL_REPLY],
        };

        try {
            const command = new SendTemplatedEmailCommand(SESparems);
            const {$metadata} = await awsSESclient.send(command);
            if($metadata.httpStatusCode !== 200){
                return undefined
            }
            return true
        } catch (error) {
            ErrorHandler.internalServerError("Can't send OTP to given Email.(SS)", 500531)
        }
    }

    async sendOTPSMS(phone, otp){
        return await sendOTPSMS(phone, otp)
    }

    async sendUserPassword(email, userData){

        const SESparems = {
            Source: `Beyond Oceans <${Bun.env.EMAIL_NOREPLY}>`,
            Destination: {
                ToAddresses: [email],
            },
            Message: {
                Subject: {
                    Data: `${userData.name}Credentials for Beyond Oceans Dashboard`,
                },
                Body: {
                    Text: {
                        Data: `Hey ${userData.name},\n\nHere are your credentials for the Beyond Oceans dashboard:\n\nName: ${userData.name}\nEmail: ${userData.email}\nPassword: ${userData.password}\nRole: ${userData.role}\n\nIf you are unable to log in, contact Beyond Oceans support. Please do not share your password with anyone.\n\nThank you,\nBeyond Oceans Team`,
                    },
                },
            },
            ReplyToAddresses: [Bun.env.EMAIL_REPLY],
        };

        try {
            const command = new SendEmailCommand(SESparems);
            const {$metadata} = await awsSESclient.send(command);
            if($metadata.httpStatusCode !== 200){
                return undefined
            }
            return true
        } catch (error) {
            ErrorHandler.internalServerError("Can't send Email for User Credentials to given Email.", 1010100002)
        }

    }

}

export default new sendService();