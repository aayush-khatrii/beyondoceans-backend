const crypto = require('node:crypto')
import hashService from "./hash-service";

class otpService{
    async genarateOtp(){
        const otp = crypto.randomInt(100000, 999999);
        return otp
    }
    
    async validateOTP(hashedData, resData){
        let computedHash = hashService.hashOtp(resData);
        return computedHash === hashedData;
    }
}

export default new otpService();