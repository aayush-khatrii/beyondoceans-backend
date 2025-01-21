import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid';
import adminModel from '../models/admin-model';
import { ErrorHandler } from '../errors/ErrorHandler';


class adminService{

    async createAdminUser(newUserData){
        
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newUserData.password, salt)

        const date = new Date();
        const options = { timeZone: "Asia/Kolkata", hour12: false };
        const istDate = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata" }).format(date);
        const istTime = date.toLocaleTimeString("en-GB", { ...options });
        const formattedDate = `${istDate}, ${istTime}`;

        const newUserModifiedData = {
            User_Id: uuidv4().toString(),
            User_Name: newUserData.name,
            User_Email: newUserData.email,
            User_Phone: newUserData.phone,
            User_Designation: newUserData.designation,
            User_Role: newUserData.role,
            User_Password: hashedPassword,
            Created_At: formattedDate,
        }

        
        return await adminModel.CreateAdminUser(newUserModifiedData)

    }

    async getUsersList(){
        return await adminModel.getUsersList()
    }
    
    async validateSingleUser(loginData){

        const userData = await adminModel.fetchSingleUser(loginData)
        
        if(!userData){
            ErrorHandler.notFoundError("Wrong Credentials!", 1003001)
        }

        const isPasswordValid = await bcrypt.compare(loginData.password, userData.User_Password)

        if(userData){
            if(isPasswordValid){
                return userData
            }
            ErrorHandler.validationError("Wrong Password!", 1003001)
        }

    }

    async findUserbyID(userId){
        if(!userId){
            return false
        }
        return await adminModel.findUserbyUserId(userId)
    }

    async fetchEnquiriesList(){
        return await adminModel.fetchEnquiriesList()
    }
    
    async fetchHotelsbyFilter(destination){
        return await adminModel.fetchHotelsbyFilter(destination)
    }
    
    async fetchSSbyFilter(destination){
        return await adminModel.fetchSSbyFilter(destination)
    }
    
    async fetchSingleInquiry(inqId){
        return await adminModel.fetchSingleInquiry(inqId)
    }

    async updateInquiry(user, inqId, status){
        return await adminModel.updateInquiry(user, inqId, status)
    }
}

export default new adminService();