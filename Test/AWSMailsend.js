import awsSESclient from "../config/ses.config.js"
const { SendTemplatedEmailCommand } = require("@aws-sdk/client-ses");
const toEmail = "k.aayush.1509@gmail.com"
// const toEmail = "aayush@holehite.com"
// const toEmail = "daxsuthar04@gmail.com"
const otp = 321546

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
  const result = await awsSESclient.send(command);
  console.log(result)
} catch (error) {
  console.log(error)
}