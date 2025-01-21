import { initiatePaymentPP, paymentStatusPP } from "../api/Payment/phonePe"
import { v4 as uuidv4 } from 'uuid';
import { ErrorHandler } from "../errors/ErrorHandler";
import BookingModel from "../models/booking-model";


class paymentService{
    async calculatePackageSubtotal(packageOption, traveler, discount){
        
        const packageOptionPrice = packageOption.Option_Price
        const totalTraveler = traveler.Adults + traveler.Child

        const packageTotalPrice = packageOptionPrice * totalTraveler

        return packageTotalPrice
    }

    async calculateActivitySubtotal(packageOption, traveler, discount){
        const packageOptionPrice = packageOption.Option_Price
        const totalTraveler = traveler.Persons
        
        const packageTotalPrice = packageOptionPrice * totalTraveler

        return packageTotalPrice
    }

    async calculateFerrySubtotal(FerryOpr, singleFerryData, selectedClassId, traveler, PaxData, discount){

        let ferryClassPrice
        let ferryTotalPrice

        if(FerryOpr !== "MAK" && FerryOpr !== "NTK"){
            return
        }

        if(FerryOpr === "MAK"){
            ferryClassPrice = singleFerryData.Classes.find(obj => obj.ship_class_id.toString() === selectedClassId).ship_class_price
            ferryTotalPrice = ferryClassPrice * traveler.Adults
        }

        if(FerryOpr === "NTK"){
            const ntkFerryFares = singleFerryData.fares

            function mergeSeats(PaxData) {
                // Extract seats from adults and infants and merge into a single array
                const mergedSeats = [
                  ...PaxData.adults.map((person) => person.seat || []), // Handle missing seat with fallback
                  ...PaxData.infants.map((person) => person.seat || []),
                ].flat(); // Flatten the array in case 'seat' contains nested arrays
              
                // Separate seats by their tier
                const separatedSeats = mergedSeats.reduce(
                  (result, seat) => {
                    if (seat.tier === "P") {
                      result.pClass.push(seat);
                    } else if (seat.tier === "B") {
                      result.bClass.push(seat);
                    }
                    return result;
                  },
                  { pClass: [], bClass: [] } // Initial structure for separated seats
                );
              
                return separatedSeats; // Return the separated seats
            }

            const selectedSeats = mergeSeats(PaxData);

            const pClassTotal = selectedSeats.pClass.length * ntkFerryFares.pBaseFare
            const bClassTotal = selectedSeats.bClass.length * ntkFerryFares.bBaseFare
            const infantTotal = traveler.Infants * ntkFerryFares.infantFare

            ferryTotalPrice = pClassTotal + bClassTotal + infantTotal

        }

        return ferryTotalPrice
    }

    async calculateAddonSubTota(selectedAddon){

        // taxable addon sub total
        const addonSubTotal = selectedAddon ? selectedAddon.reduce((total, item) => {
            if (!item.Addon_IsGST) { 
                return total + item.Item_SubTotal
            }
            return total;
        }, 0) : 0

        return addonSubTotal
    }

    async calculateBookingTax(packageSubTotal, addonSubTotal, contributionAmount){
        const UTGSTValue = 2.5
        const CGSTValue = 2.5

        const bookingSubTotal = packageSubTotal + addonSubTotal + contributionAmount

        const UTGST = bookingSubTotal * (UTGSTValue / 100)
        const CGST = bookingSubTotal * (CGSTValue / 100)


        return {UTGST, CGST}
    }

    async calculatePackageTax(packageSubTotal){
        const UTGSTValue = 2.5
        const CGSTValue = 2.5


        const UTGST = packageSubTotal * (UTGSTValue / 100)
        const CGST = packageSubTotal * (CGSTValue / 100)

        return {UTGST, CGST}
    }

    async calculateActivityTax(activitySubTotal){
        const UTGSTValue = 2.5
        const CGSTValue = 2.5


        const UTGST = activitySubTotal * (UTGSTValue / 100)
        const CGST = activitySubTotal * (CGSTValue / 100)

        return {UTGST, CGST}
    }

    async calculatePackageTotalWithTax(packageSubTotal, addonSubTotal, contributionAmount, packageSelectedAddon, tax){

        const UTGST = tax.UTGST
        const CGST = tax.CGST
        
        // non taxable addons
        const packageAddonSubTotal = packageSelectedAddon ? packageSelectedAddon.reduce((total, item) => {
            if (!item.Addon_IsGST) { 
                return total + item.Item_SubTotal
            }
            return total;
        }, 0) : 0

        const fullPaymentTotalWithTax = packageSubTotal + addonSubTotal + packageAddonSubTotal + contributionAmount + UTGST + CGST

        return fullPaymentTotalWithTax
    }

    async calculateActivityTotalWithTax(activitySubTotal, addonSubTotal, contributionAmount, activitySelectedAddon, tax){

        const UTGST = tax.UTGST
        const CGST = tax.CGST
        
        // non taxable addons
        const activityAddonSubTotal = activitySelectedAddon ? activitySelectedAddon.reduce((total, item) => {
            if (!item.Addon_IsGST) { 
                return total + item.Item_SubTotal
            }
            return total;
        }, 0) : 0

        const fullPaymentTotalWithTax = activitySubTotal + addonSubTotal + activityAddonSubTotal + contributionAmount + UTGST + CGST

        return fullPaymentTotalWithTax
    }

    async calculateFerryTotalWithPSF(ferrySubTotal, contributionAmount, totalPSF){
        
        const fullPaymentTotalWithTax = ferrySubTotal + contributionAmount + totalPSF

        return fullPaymentTotalWithTax
    }

    async calculatePartialTotalWithTax(totalAmount){
        
        const partialPercentage = 40 
        
        return totalAmount * (partialPercentage / 100)

    }

    async generatePhonePePaymentURL(userId, transectionID, totalAmount){


        const totalAmountInPaisa = totalAmount * 100

        const paymentGWResponse = await initiatePaymentPP(userId, transectionID, totalAmountInPaisa)

        if(!paymentGWResponse.success){
            await BookingModel.setPackagePaymentFailedInit(transectionID)
            ErrorHandler.internalServerError("Payment Initialization Failed! 🤐")
        }
        
        return paymentGWResponse.data.instrumentResponse.redirectInfo.url
        // return paymentGWResponse
    }

    async paymentStatusPP(bookingData){

        const paymentStatusData = await paymentStatusPP(bookingData)
        return paymentStatusData

    }

    async psfCalculator(FerryOpr, traveler){

        const PSF = 50

        let totalPSFcost

        if(FerryOpr === "MAK"){
            totalPSFcost = traveler.Adults * PSF
        }

        if(FerryOpr === "NTK"){
            totalPSFcost = (traveler.Adults + traveler.Infants) * PSF
        }

        return totalPSFcost

    }
}

export default new paymentService()