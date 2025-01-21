import ActivityModel from "../models/activity-model"

class activityService{
    async fetchAllActivities(){
        const allPackagesData = await ActivityModel.fetchAllActivities()
        return allPackagesData
    }

    async fetchFilterActivities(category){
        const allFilterdActivitiesData = await ActivityModel.fetchFilterActivities(category)
        return allFilterdActivitiesData
    }
    
    async fetchSingleActivity(activityId){
        const activityData = await ActivityModel.fetchSingleActivity(activityId)
        return activityData
    }

    // async fetchOptionHotels(hotelIds){
    //     const hotelsData = await PackageModel.fetchOptionHotels(hotelIds)
    //     return hotelsData
    // }
}

export default new activityService()