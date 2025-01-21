import axios from "axios";
import hashService from "../../services/hash-service";
import { ErrorHandler } from "../../errors/ErrorHandler";

const api = axios.create({
    baseURL: Bun.env.PHONEPE_BASEURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
    },
})

export const initiatePaymentPP = async(userId, transectionId, amt) => {

    const PaymentParams = {
        merchantId: Bun.env.PHONEPE_MID,
        merchantTransactionId: transectionId,
        merchantUserId: userId,
        amount: amt,
        redirectUrl: `https://www.beyondoceans.in/payment-varifyer`,
        redirectMode: "REDIRECT",
        callbackUrl: `${Bun.env.PHONEPE_CALLBACK_HOST}/devstag/v1/api/payment/phonepe/phonepe-callback`,
        paymentInstrument: {
            type: "PAY_PAGE"
        }
    }
    // JSON.stringify(PaymentParams)

    let objJsonStr = JSON.stringify(PaymentParams);
    const base64str = Buffer.from(objJsonStr).toString('base64');
    const plainTextbase64 = `${base64str}/pg/v1/pay${Bun.env.PHONEPE_MKEY}`
    
    const headerVerifiersha256 = hashService.hashPaymentToken(plainTextbase64)

    const headers = {
        ...api.defaults.headers,
        'X-VERIFY': `${headerVerifiersha256}###1`
      };

    const requestData = {
        request:base64str
    }

    try {
        const {data} = await api.post("/pg/v1/pay", requestData, {headers});
        return data
    } catch (error) {
        return error.response.data
    }
}

export const paymentStatusPP = async(bookingData) => {


    const bookingId = bookingData.Booking_Id

    const plainTextbase64 = `/pg/v1/status/${Bun.env.PHONEPE_MID}/${bookingId}${Bun.env.PHONEPE_MKEY}`
    
    const headerVerifiersha256 = hashService.hashPaymentToken(plainTextbase64)

    const headers = {
        ...api.defaults.headers,
        'X-VERIFY': `${headerVerifiersha256}###1`,
        'X-MERCHANT-ID': Bun.env.PHONEPE_MID
      };

    try {
        const {data} = await api.get(`/pg/v1/status/${Bun.env.PHONEPE_MID}/${bookingId}`, {headers});
        return data
    } catch (error) {
        return error.response.data
    }
}

