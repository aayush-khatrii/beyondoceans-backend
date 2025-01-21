import { ErrorHandler } from '../errors/ErrorHandler';
import AuthModel from '../models/auth-model'

class userAuthService{
    async findbyPhone(phone){
        return await AuthModel.findUserbyPhone(phone)
    }

    async createUserbyPhone(data){
        return await AuthModel.CreateUserbyPhone(data)
    }

    async findbyEmail(email){
        return await AuthModel.findUserbyEmail(email)
    }

    async createUserbyEmail(data){
        return await AuthModel.CreateUserbyEmail(data)
    }

    async findbyIntEmail(data){
        return await AuthModel.findUserbyIntEmail(data)
    }

    async createUserbyIntEmail(data){
        return await AuthModel.CreateUserbyIntEmail(data)
    }

    async isUserAvalible(userId){
        if(!userId){
            return false
        }
        return await AuthModel.isUserAvalible(userId)
    }

    async findbyUserId(userId){
        if(!userId){
            return false
        }
        return await AuthModel.findUserbyUserId(userId)
    }

    async updateUserProfile(updateReqData, userId){

        if(!updateReqData || !userId) return false

        // Below log create an object that hase data that is requested by the user to update and the logic 
        // check that if any value dosent exist then the main object(object to Update in DB) dont contain that property and also value in main object
        const userDataAddress = updateReqData.address

        function notEmptyObj(obj){
            if (!obj) return false;
            for (let key in obj) {
                if (obj[key] !== '' && obj[key] !== null && obj[key] !== undefined) return true;
            }
            return false;
        }

        const userAddress = {}
        const updateData = {}

        const isValidAdd = (notEmptyObj(updateReqData.address) && updateReqData.address && updateReqData.address !== '')
 
        if(updateReqData.name && updateReqData.name !== '') updateData.User_Name = updateReqData.name
        if(updateReqData.DOB && updateReqData.DOB !== '') updateData.DOB = updateReqData.DOB
        if(updateReqData.maritalStatus && updateReqData.maritalStatus !== '') updateData.MaritalStatus = updateReqData.maritalStatus     
        if(userDataAddress?.Address && userDataAddress?.Address !== '') userAddress.User_Address = userDataAddress.Address
        if(userDataAddress?.City && userDataAddress?.City !== '') userAddress.User_City = userDataAddress?.City
        if(userDataAddress?.State && userDataAddress?.State !== '') userAddress.User_State = userDataAddress.State
        if(userDataAddress?.Pincode && userDataAddress?.Pincode !== '') userAddress.User_Pincode = userDataAddress.Pincode
        if(userDataAddress?.Nationality && userDataAddress?.Nationality !== '') userAddress.User_Nationality = userDataAddress.Nationality
        if(isValidAdd) updateData.User_Address = userAddress
        
        
        return await AuthModel.updateUserData(updateData, userId)

    }

    async storeBookingIDinUserID(bookingId, userId, bookingType){
        return await AuthModel.storeBookingIDinUserID(bookingId, userId, bookingType)
    }

}

export default new userAuthService();