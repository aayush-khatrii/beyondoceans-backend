import InquiryModel from "../models/inquiry-model"
import { v4 as uuidv4 } from 'uuid';

class inquiryService{
    async storePackageInquiry(inqData){
        const inqId = uuidv4().toString()
        const isPackageInqStore = await InquiryModel.storePackageInquiry(inqData, inqId)
        return isPackageInqStore
    }

    async storeDestinationInquiry(inqData){
        const inqId = uuidv4().toString()
        const isDestinationInqStore = await InquiryModel.storeDestinationInquiry(inqData, inqId)
        return isDestinationInqStore
    }
}

export default new inquiryService()