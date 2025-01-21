import awsSESclient from "../config/ses.config.js"
import { DeleteTemplateCommand } from "@aws-sdk/client-ses";

// Set the AWS Region and SES endpoint

// Specify the name of the template you want to delete
const templateName = "BO_Template";

// Set up the command to delete the template
const deleteTemplateParams = {
  TemplateName: templateName,
};

const deleteTemplateCommand = new DeleteTemplateCommand(deleteTemplateParams);

// Delete the template
try {
  const data = await awsSESclient.send(deleteTemplateCommand);
  console.log("Template deleted successfully:", data);
} catch (err) {
  console.error("Error deleting template:", err);
}