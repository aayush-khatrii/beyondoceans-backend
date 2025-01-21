import awsSESclient from "../config/ses.config.js"
const { CreateTemplateCommand } = require("@aws-sdk/client-ses");

const htmlContent = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">

  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
  </head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&amp;display=swap" rel="stylesheet" />

  <body>
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;background-color:#1E2C70;font-family:&quot;DM Sans&quot;, sans-serif;padding:30px 20px">
      <tbody>
        <tr style="width:100%">
          <td>
            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="margin:0 auto">
              <tbody>
                <tr>
                  <td><img alt="Beyond Oceans Logo" src="https://assets-bo.s3.ap-south-1.amazonaws.com/BO_Email_Temp_LOGO.png" style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto" width="100" />
                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;border-radius:8px;background-color:#fffffe;overflow:hidden;margin:30px auto;padding:30px 0;padding-bottom:20px">
                      <tbody>
                        <tr style="width:100%">
                          <td><img alt="Beyond Oceans Logo" src="https://assets-bo.s3.ap-south-1.amazonaws.com/BO_Email_Temp_Hero.png" style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto" width="180" />
                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;height:1px;width:100%;background-color:#E9E9E9">
                              <tbody>
                                <tr style="width:100%">
                                  <td></td>
                                </tr>
                              </tbody>
                            </table>
                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;text-align:center;margin-top:12px">
                              <tbody>
                                <tr style="width:100%">
                                  <td>
                                    <p style="font-size:clamp(20px, 2vw, 25px);line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#1E2C70;font-weight:700">Hi, Traveler</p>
                                    <p style="font-size:clamp(14px, 2vw, 20px);line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#000;font-weight:500;margin-top:clamp(1px, 0.5vw, 10px)">Welcome to Beyond Oceans</p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;background-color:#EBF7F3;text-align:center;border-radius:5px;padding:18px 14px;margin:15px auto;width:88%">
                              <tbody>
                                <tr style="width:100%">
                                  <td>
                                    <p style="font-size:clamp(8.5px, 2vw, 11px);line-height:1.2;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#696969;font-weight:500">To proceed further with your registration process please enter the OTP. </p>
                                    <p style="font-size:clamp(10.5px, 2vw, 15px);line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#000;font-weight:600;margin-top:clamp(1.5px, 0.5vw, 10px)">Your Email Verification OTP is</p>
                                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;background-color:#38B089;border-radius:6px;width:125px;height:40px;border-width:2px;border-color:#A3DBC9;border-style:solid;margin-top:4.5px;font-family:&quot;DM Sans&quot;, sans-serif">
                                      <tbody>
                                        <tr style="width:100%">
                                          <td>
                                            <p style="font-size:clamp(15px, 2vw, 18px);line-height:24px;margin:0 auto;font-family:&quot;DM Sans&quot;, sans-serif;color:#fff;width:fit-content;font-weight:700;letter-spacing:2px">{{otp}}</p>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <p style="font-size:clamp(9px, 2vw, 11px);line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#989898;font-weight:500;text-align:center">Please note that this OTP will be valid for 5 mins only.</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="text-align:center">
                      <tbody style="width:100%">
                        <tr style="width:100%">
                          <td data-id="__react-email-column"><a href="https://www.beyondoceans.in/terms-conditions" style="color:#989EBD;text-decoration:none;font-size:clamp(8px, 2vw, 14px)" target="_blank">Terms &amp; Condition</a></td>
                          <td data-id="__react-email-column"><a href="https://www.beyondoceans.in/privacy-policy" style="color:#989EBD;text-decoration:none;font-size:clamp(8px, 2vw, 14px)" target="_blank">Privacy Policy</a></td>
                          <td data-id="__react-email-column"><a href="https://www.beyondoceans.in/contact-us" style="color:#989EBD;text-decoration:none;font-size:clamp(8px, 2vw, 14px)" target="_blank">Contact Us</a></td>
                          <td data-id="__react-email-column"><a href="https://www.beyondoceans.in/" style="color:#989EBD;text-decoration:none;font-size:clamp(8px, 2vw, 14px)" target="_blank">Visit Website</a></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>

</html>
`;

// Define the template content
const templateContent = {
  Template: {
    TemplateName: "BO_Template",
    HtmlPart: htmlContent,
    SubjectPart: "OTP for Login to Beyond Oceans"
  }
};

const awsSesTempCMD = new CreateTemplateCommand(templateContent)

try {
    const data = await awsSESclient.send(awsSesTempCMD);
    console.log("Template created successfully:", data);
  } catch (err) {
    console.error("Error creating template:", err);
  }