import axios from "axios";

const api = axios.create({
    baseURL: Bun.env.F2S_SMS_BASEURL,
    headers: {
        'Content-Type': 'application/json',
        'authorization': Bun.env.F2S_SMS_APIKEY,
    },
})


export const sendOTPSMS = async(phone, otp) => {

    const SMSparams = {
        "route" : "dlt",
        "sender_id" : Bun.env.F2S_SMS_OTP_SID,
        "message" : Bun.env.F2S_SMS_OTP_MSGID,
        "variables_values" : `${otp}|`,
        "flash" : 0,
        "numbers" : phone,
    }

    const {data} = await api.post("/dev/bulkV2", SMSparams);
    return data
}
