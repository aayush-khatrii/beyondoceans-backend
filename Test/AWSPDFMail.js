import awsSESclient from "../config/ses.config.js"
const { SendRawEmailCommand  } = require("@aws-sdk/client-ses");
import fs from "fs";
import path from "path";
import { Buffer } from "buffer";


  // const toEmail = ["k.aayush.1509@gmail.com"]
  const toEmail = ["daxsuthar04@gmail.com", "k.aayush.1509@gmail.com"]

  const SESparams = {
    Source: `Beyond Oceans <${Bun.env.EMAIL_NOREPLY}>`,
    Destination: {
      ToAddresses: toEmail,
    },
  };


  try {

    const filePath = path.join(__dirname, "invoice_BOP45db97900c90cf3.pdf");
    const fileContent = fs.readFileSync(filePath);

    // Build the MIME message
    const boundary = "NextPart";
    const mimeMessage = [
      `From: Beyond Oceans <${Bun.env.EMAIL_NOREPLY}>`,
      `To: ${toEmail}`,
      `Reply-To: ${Bun.env.EMAIL_REPLY}`,
      `Subject: Your Subject Here`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      "",
      `--${boundary}`,
      `Content-Type: multipart/alternative; boundary="templatePart"`,
      "",
      `--templatePart`,
      `Content-Type: text/plain; charset=UTF-8`,
      "",
      `This email requires a client capable of rendering HTML.`,
      "",
      `--templatePart`,
      `Content-Type: text/html; charset=UTF-8`,
      "",
      `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">

  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <style>
      .tableLable{
        width: 100% !important;
      }
      @media (max-width: 980px) {
          .mainWrapper{
            padding: 20px 0px !important;
            width: 100%;
          }
          .midWrapper{
            width: 100%;
          }
          .logoImg{
            width: 200px !important;
          }
          .tableLable{
            width: 100% !important;
          }
      }
    </style>
  </head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&amp;display=swap" rel="stylesheet" />

  <body style="margin:0">
    <table class="mainWrapper" align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;background-color:#fff;min-width:100%;font-family:&quot;DM Sans&quot;, sans-serif;padding:30px 20px">
      <tbody>
        <tr style="width:100%">
          <td>
            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="margin:0 auto">
              <tbody>
                <tr>
                  <td><img class="logoImg" alt="Beyond Oceans Logo" src="https://bo-pub-bucket.s3.ap-south-1.amazonaws.com/email-assets/bo_email_temp_color_logo.png" style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto;width:130px" />
                    <table class="midWrapper" align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;position:relative;background-color:#A3DBC9;box-sizing:border-box;overflow:hidden;margin:30px auto">
                      <tbody>
                        <tr style="width:100%">
                          <td>
                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;min-width:600px;box-sizing:border-box;padding:35px 40px">
                              <tbody>
                                <tr style="width:100%">
                                  <td>
                                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;min-width:100%;margin:0;box-sizing:border-box;padding:25px;border-radius:2px 2px 0 0;background-color:#fff">
                                      <tbody>
                                        <tr style="width:100%">
                                          <td>
                                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;text-align:center">
                                              <tbody>
                                                <tr style="width:100%">
                                                  <td>
                                                    <p style="font-size:20px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#000;font-weight:600">Thank you, Zaman; we have received your booking #BO218759523458. It&#x27;s confirmed now.</p>
                                                    <p style="font-size:17px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#38B089;font-weight:500;margin-top:10px">You’re going to Andaman!</p>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;margin-top:30px;border:1px solid #E9E9E9">
                                              <tbody>
                                                <tr style="width:100%">
                                                  <td>
                                                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;box-sizing:border-box;padding:10px 20px;border-bottom:1px solid #E9E9E9">
                                                      <tbody>
                                                        <tr style="width:100%">
                                                          <td>
                                                            <p style="font-size:18px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#000;font-weight:600;margin-top:1px">Your Order Details</p>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;padding:5px 20px;width:100%;align:left">
                                                      <tbody>
                                                        <tr style="width:100%">
                                                          <td>
                                                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="width:fit-content;margin:6px 0">
                                                              <tbody style="width:100%">
                                                                <tr style="width:100%">
                                                                  <td data-id="__react-email-column" style="vertical-align:top">
                                                                    <p class="tableLable" style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#000;font-weight:600;margin-right:10px;width:100%">Package Name:</p>
                                                                  </td>
                                                                  <td data-id="__react-email-column">
                                                                    <p style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#696969">The perfect andaman odyssey with bo</p>
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="width:fit-content;margin:6px 0">
                                                              <tbody style="width:100%">
                                                                <tr style="width:100%">
                                                                  <td data-id="__react-email-column" style="vertical-align:top">
                                                                    <p class="tableLable" style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#000;font-weight:600;margin-right:10px;width:100%">Booking ID:</p>
                                                                  </td>
                                                                  <td data-id="__react-email-column">
                                                                    <p style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#696969">#BO218759523458</p>
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="width:fit-content;margin:6px 0">
                                                              <tbody style="width:100%">
                                                                <tr style="width:100%">
                                                                  <td data-id="__react-email-column" style="vertical-align:top">
                                                                    <p class="tableLable" style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#000;font-weight:600;margin-right:10px;width:100%">Total Traveler:</p>
                                                                  </td>
                                                                  <td data-id="__react-email-column">
                                                                    <p style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#696969">2 Adults</p>
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="width:fit-content;margin:6px 0">
                                                              <tbody style="width:100%">
                                                                <tr style="width:100%">
                                                                  <td data-id="__react-email-column" style="vertical-align:top">
                                                                    <p class="tableLable" style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#000;font-weight:600;margin-right:10px;width:100%">Trip Duration:</p>
                                                                  </td>
                                                                  <td data-id="__react-email-column">
                                                                    <p style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#696969">6 Nights and 7 Days</p>
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="width:fit-content;margin:6px 0">
                                                              <tbody style="width:100%">
                                                                <tr style="width:100%">
                                                                  <td data-id="__react-email-column" style="vertical-align:top">
                                                                    <p class="tableLable" style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#000;font-weight:600;margin-right:10px;width:100%">Scheduled Date:</p>
                                                                  </td>
                                                                  <td data-id="__react-email-column">
                                                                    <p style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#696969">04/10/2024</p>
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="width:fit-content;margin:6px 0">
                                                              <tbody style="width:100%">
                                                                <tr style="width:100%">
                                                                  <td data-id="__react-email-column" style="vertical-align:top">
                                                                    <p class="tableLable" style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#000;font-weight:600;margin-right:10px;width:100%">Total Amount:</p>
                                                                  </td>
                                                                  <td data-id="__react-email-column">
                                                                    <p style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#696969">₹40,000</p>
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="width:fit-content;margin:6px 0">
                                                              <tbody style="width:100%">
                                                                <tr style="width:100%">
                                                                  <td data-id="__react-email-column" style="vertical-align:top">
                                                                    <p class="tableLable" style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#000;font-weight:600;margin-right:10px;width:100%">Paid Amount:</p>
                                                                  </td>
                                                                  <td data-id="__react-email-column">
                                                                    <p style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#696969">₹18,000</p>
                                                                  </td>
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
                                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;margin-top:30px;border:1px solid #E9E9E9">
                                              <tbody>
                                                <tr style="width:100%">
                                                  <td>
                                                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;box-sizing:border-box;padding:10px 20px;border-bottom:1px solid #E9E9E9">
                                                      <tbody>
                                                        <tr style="width:100%">
                                                          <td>
                                                            <p style="font-size:18px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#000;font-weight:600;margin-top:1px">Your Contact Details</p>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;padding:5px 20px;width:100%;align:left">
                                                      <tbody>
                                                        <tr style="width:100%">
                                                          <td>
                                                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="width:fit-content;margin:6px 0">
                                                              <tbody style="width:100%">
                                                                <tr style="width:100%">
                                                                  <td data-id="__react-email-column" style="vertical-align:top">
                                                                    <p class="tableLable" style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#000;font-weight:600;margin-right:10px;width:100%">Your Name:</p>
                                                                  </td>
                                                                  <td data-id="__react-email-column">
                                                                    <p style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#696969">The perfect andaman odyssey with bo</p>
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="width:fit-content;margin:6px 0">
                                                              <tbody style="width:100%">
                                                                <tr style="width:100%">
                                                                  <td data-id="__react-email-column" style="vertical-align:top">
                                                                    <p class="tableLable" style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#000;font-weight:600;margin-right:10px;width:100%">Email ID:</p>
                                                                  </td>
                                                                  <td data-id="__react-email-column">
                                                                    <p style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#696969">#BO218759523458</p>
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="width:fit-content;margin:6px 0">
                                                              <tbody style="width:100%">
                                                                <tr style="width:100%">
                                                                  <td data-id="__react-email-column" style="vertical-align:top">
                                                                    <p class="tableLable" style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#000;font-weight:600;margin-right:10px;width:100%">Phone Number:</p>
                                                                  </td>
                                                                  <td data-id="__react-email-column">
                                                                    <p style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#696969">2 Adults</p>
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="width:fit-content;margin:6px 0">
                                                              <tbody style="width:100%">
                                                                <tr style="width:100%">
                                                                  <td data-id="__react-email-column" style="vertical-align:top">
                                                                    <p class="tableLable" style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#000;font-weight:600;margin-right:10px;width:100%">Your City:</p>
                                                                  </td>
                                                                  <td data-id="__react-email-column">
                                                                    <p style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#696969">6 Nights and 7 Days</p>
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="width:fit-content;margin:6px 0">
                                                              <tbody style="width:100%">
                                                                <tr style="width:100%">
                                                                  <td data-id="__react-email-column" style="vertical-align:top">
                                                                    <p class="tableLable" style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#000;font-weight:600;margin-right:10px;width:100%">Your State:</p>
                                                                  </td>
                                                                  <td data-id="__react-email-column">
                                                                    <p style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#696969">04/10/2024</p>
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="width:fit-content;margin:6px 0">
                                                              <tbody style="width:100%">
                                                                <tr style="width:100%">
                                                                  <td data-id="__react-email-column" style="vertical-align:top">
                                                                    <p class="tableLable" style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#000;font-weight:600;margin-right:10px;width:100%">Address:</p>
                                                                  </td>
                                                                  <td data-id="__react-email-column">
                                                                    <p style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#696969">₹40,000</p>
                                                                  </td>
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
                                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em">
                                              <tbody>
                                                <tr style="width:100%">
                                                  <td>
                                                    <p style="font-size:10.5px;line-height:1.4;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#696969;text-align:center;margin-top:25px">Thank you for choosing Beyond Oceans for your Andaman journey. We can’t wait to help you create memories that will last a lifetime.</p>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;min-width:100%;margin:0;padding:10px 0;text-align:center;background-color:#EBF7F3;border-radius:0 0 2px 2px">
                                      <tbody>
                                        <tr style="width:100%">
                                          <td>
                                            <p style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#4C4C4C">See you soon in paradise!</p>
                                            <p style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#000;font-weight:500">Beyound Oceans &amp; Team</p>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table><img alt="Beyond Oceans Logo" src="https://bo-pub-bucket.s3.ap-south-1.amazonaws.com/email-assets/order_cnf_clip_path.png" style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto;position:relative;left:-15px;width:110%;height:400px;min-width:110%;object-fit:cover;object-position:top" />
                            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="background-color:#38B089;bottom:20px;position:absolute;z-index:1;height:160px;vertical-align:top">
                              <tbody style="width:100%">
                                <tr style="width:100%">
                                  <td data-id="__react-email-column"><a href="https://www.beyondoceans.in/packages" style="color:#067df7;text-decoration:none" target="_blank">
                                      <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;width:100%;text-align:center">
                                        <tbody>
                                          <tr style="width:100%">
                                            <td>
                                              <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;margin:0 auto;padding:10px;box-sizing:border-box;width:45px;height:45px;border-radius:50px;background-color:#fff">
                                                <tbody>
                                                  <tr style="width:100%">
                                                    <td><img alt="Beyond Oceans Logo" src="https://bo-pub-bucket.s3.ap-south-1.amazonaws.com/email-assets/cnf_email_map.png" style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto" width="100%" /></td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                              <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;font-weight:500;margin-top:10px">
                                                <tbody>
                                                  <tr style="width:100%">
                                                    <td>
                                                      <p style="font-size:16px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#fff;font-weight:300">See Detail</p>
                                                      <p style="font-size:16px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#1E2C70;text-decoration:underline;font-weight:500;margin-top:-3px">Itinerary</p>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </a></td>
                                  <td data-id="__react-email-column"><a href="https://wa.me/917908671247" style="color:#067df7;text-decoration:none" target="_blank">
                                      <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;width:100%;text-align:center">
                                        <tbody>
                                          <tr style="width:100%">
                                            <td>
                                              <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;margin:0 auto;padding:10px;box-sizing:border-box;width:45px;height:45px;border-radius:50px;background-color:#fff">
                                                <tbody>
                                                  <tr style="width:100%">
                                                    <td><img alt="Beyond Oceans Logo" src="https://bo-pub-bucket.s3.ap-south-1.amazonaws.com/email-assets/cnf_email_wp.png" style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto" width="100%" /></td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                              <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;font-weight:500;margin-top:10px">
                                                <tbody>
                                                  <tr style="width:100%">
                                                    <td>
                                                      <p style="font-size:16px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#fff;font-weight:300">Chat With Us</p>
                                                      <p style="font-size:16px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#1E2C70;text-decoration:underline;font-weight:500;margin-top:-3px">WhatsApp</p>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </a></td>
                                  <td data-id="__react-email-column"><a href="https://www.youtube.com/@beyondoceansandaman" style="color:#067df7;text-decoration:none" target="_blank">
                                      <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;width:100%;text-align:center">
                                        <tbody>
                                          <tr style="width:100%">
                                            <td>
                                              <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;margin:0 auto;padding:10px;box-sizing:border-box;width:45px;height:45px;border-radius:50px;background-color:#fff">
                                                <tbody>
                                                  <tr style="width:100%">
                                                    <td><img alt="Beyond Oceans Logo" src="https://bo-pub-bucket.s3.ap-south-1.amazonaws.com/email-assets/cnf_email_yt.png" style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto" width="100%" /></td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                              <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;font-weight:500;margin-top:10px">
                                                <tbody>
                                                  <tr style="width:100%">
                                                    <td>
                                                      <p style="font-size:16px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#fff;font-weight:300">Explore More</p>
                                                      <p style="font-size:16px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#1E2C70;text-decoration:underline;font-weight:500;margin-top:-3px">YouTube</p>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </a></td>
                                  <td data-id="__react-email-column"><a href="https://www.instagram.com/beyondoceansandaman/" style="color:#067df7;text-decoration:none" target="_blank">
                                      <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;width:100%;text-align:center">
                                        <tbody>
                                          <tr style="width:100%">
                                            <td>
                                              <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;margin:0 auto;padding:10px;box-sizing:border-box;width:45px;height:45px;border-radius:50px;background-color:#fff">
                                                <tbody>
                                                  <tr style="width:100%">
                                                    <td><img alt="Beyond Oceans Logo" src="https://bo-pub-bucket.s3.ap-south-1.amazonaws.com/email-assets/cnf_email_insta.png" style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto" width="100%" /></td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                              <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;font-weight:500;margin-top:10px">
                                                <tbody>
                                                  <tr style="width:100%">
                                                    <td>
                                                      <p style="font-size:16px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#fff;font-weight:300">Follow Us</p>
                                                      <p style="font-size:16px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#1E2C70;text-decoration:underline;font-weight:500;margin-top:-3px">Instagram</p>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </a></td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;text-align:center">
                      <tbody>
                        <tr style="width:100%">
                          <td>
                            <p style="font-size:14px;line-height:24px;margin:0;font-family:&quot;DM Sans&quot;, sans-serif;color:#989898;text-align:center">Copyright ©  2024 Beyond Oceans, All rights reserved.</p>
                          </td>
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
      `,
      "",
      `--templatePart--`,
      "",
      `--${boundary}`,
      `Content-Type: application/pdf; name="invoice_BOP45db97900c90cf3.pdf"`,
      `Content-Disposition: attachment; filename="invoice_BOP45db97900c90cf3.pdf"`,
      `Content-Transfer-Encoding: base64`,
      "",
      fileContent.toString("base64"),
      "",
      `--${boundary}--`,
    ].join("\r\n");
    const params = {
        Source: SESparams.Source,
        Destinations: SESparams.Destinations,
        RawMessage: {
          Data: Buffer.from(mimeMessage),
        },
      };    

    
    const command = new SendRawEmailCommand(params);
    const result = await awsSESclient.send(command);

    console.log(result);
  } catch (error) {
    console.log(error)
  }