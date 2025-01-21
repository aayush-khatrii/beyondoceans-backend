import PackageModel from "../models/package-model"

class packageService{
    async fetchAllPackages(){
        const allPackagesData = await PackageModel.fetchAllPackages()
        return allPackagesData
    }

    async fetchFilterPackages(category){
        const allFilterdPackagesData = await PackageModel.fetchFilterPackages(category)
        return allFilterdPackagesData
    }
    
    async fetchSinglePackages(packageID){
        const packageData = await PackageModel.fetchSinglePackages(packageID)
        return packageData
    }

    async fetchOptionHotels(hotelIds){
        const hotelsData = await PackageModel.fetchOptionHotels(hotelIds)
        return hotelsData
    }

    async fetchFeaturedPackages(category){
        const featuredPackagesData = await PackageModel.fetchFeaturedPackages(category)
        return featuredPackagesData
    }
}

export default new packageService()