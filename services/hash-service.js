const crypto = require('node:crypto')

class hashService{
    hashOtp(data){
        return crypto.createHmac('sha256', Bun.env.OTP_HASH_SECRET)
        .update(data)
        .digest('hex');
    }
}

export default new hashService();