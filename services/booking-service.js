import { v4 as uuidv4 } from 'uuid';
import BookingModel from '../models/booking-model'
import { ErrorHandler } from '../errors/ErrorHandler';

class bookingService{
    async createPackageBooking(bookingData){

        const prefix = "BOP"
        const timestamp = Date.now().toString()
        const salt = Math.random().toString(36).substring(2, 8)
        const uuid = uuidv4().toString().replace(/-/g, '')

        const combinedString = timestamp + salt + uuid
        const dynamicPart = shuffleString(combinedString).substring(0, 15)

        function shuffleString(str) {
            const array = str.split('');
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]]; // Swap elements
            }
            return array.join('');
        }

        const packageBookingId = prefix + dynamicPart

        const PaymentGW = {
            1: "Phone Pe",
            2: "Razorpay",
        }

        const PaymentType = {
            1: "Full Payment",
            2: "Partial Payment",
        }

        const timeOptions = {
            timeZone: 'Asia/Kolkata', // IST timezone
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // 24-hour format
        };

        const packageTraveler = bookingData.sessionData.Checkout.Package.Traveler
        const TotalPackageTraveler = packageTraveler.Adults + packageTraveler.Child

        const packageItem = {
            Item_Type: "Package",
            Package_Id: bookingData.sessionData.Checkout.Package.Package_Id,
            Package_Option_Id: bookingData.sessionData.Checkout.Package.Package_Option_Id,
            Package_Title: bookingData.packageData.Package_Title,
            Option_Title: bookingData.selectedPackageOption.Option_Title,
            Pack_Duration: bookingData.packageData.Pack_Duration,
            Package_BOP: bookingData.packageData.Price.BOP,
            Package_Option_Price: bookingData.selectedPackageOption.Option_Price,
            Traveler: packageTraveler,
            Package_Qty: TotalPackageTraveler,
            Package_SubTotal: bookingData.packageSubTotal,
            Package_IsGST: true,
            Package_GST: {
                UTGST: bookingData.packageTax.UTGST,
                CGST: bookingData.packageTax.CGST,
            }
        };

        let Items = [packageItem]

        if(bookingData.selectedPackageAddon && bookingData.selectedPackageAddon.length > 0){
            Items.push(...bookingData.selectedPackageAddon);
        }

        const genarateBookingParams = {
            Booking_Id: packageBookingId,
            User_Id: bookingData.userData.User_Id,
            Booking_Type: "Package",
            Booking_Items: Items,
            Payment_Deatils: {
                Payment_Gateway: PaymentGW[bookingData.PAYGW],
                Payment_Type: PaymentType[bookingData.paymentType],
                Payment_SubTotal: bookingData.packageSubTotal + bookingData.addonSubTotal,
                Contribution_Amount: bookingData.contributionAmount,
                Payment_Tax: {
                    GST: {
                        UTGST: bookingData.bookingTax.UTGST,
                        CGST: bookingData.bookingTax.CGST,
                    }
                },
                Payment_Total_With_TAX: bookingData.totalAmount,
                Payment_Amount: bookingData.paymentAmount,
                Payment_Due: bookingData.totalAmount - bookingData.paymentAmount,
                // Discount: 
                ...(bookingData.discount && { 
                    Discount: {
                        Coupon_Code: bookingData.discount.Coupon_Code, 
                        Discount_AMT: bookingData.discount.Discount_AMT
                    } 
                }),
            },
            Contact_Details: bookingData.contactData,
            Traveler: bookingData.sessionData.Checkout.Package.Traveler,
            Travel_Date: bookingData.sessionData.Checkout.Package.Travel_Date,
            Payment_Status: "Initiated",
            Booking_Status: "Pending Payment",
            Booking_TS: new Date().toLocaleDateString('en-IN', timeOptions)
        }

        const generateBooking = await BookingModel.genratePackageBooking(genarateBookingParams)

        return generateBooking
    }

    async createActivityBooking(bookingData){

        const prefix = "BOA"
        const timestamp = Date.now().toString()
        const salt = Math.random().toString(36).substring(2, 8)
        const uuid = uuidv4().toString().replace(/-/g, '')

        const combinedString = timestamp + salt + uuid
        const dynamicPart = shuffleString(combinedString).substring(0, 15)

        function shuffleString(str) {
            const array = str.split('');
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]]; // Swap elements
            }
            return array.join('');
        }

        const packageBookingId = prefix + dynamicPart

        const PaymentGW = {
            1: "Phone Pe",
            2: "Razorpay",
        }

        const timeOptions = {
            timeZone: 'Asia/Kolkata', // IST timezone
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // 24-hour format
        };

        const activityTraveler = bookingData.sessionData.Checkout.Activity.Traveler
        const TotalActivityTraveler = activityTraveler.Persons

        const activityItem = {
            Item_Type: "Activity",
            Activity_Id: bookingData.sessionData.Checkout.Activity.Activity_Id,
            Activity_Option_Id: bookingData.sessionData.Checkout.Activity.Activity_Option_Id,
            Activity_Title: bookingData.activityData.Activity_Title,
            Option_Title: bookingData.selectedActivityOption.Option_Title,
            Activity_Duration: bookingData.activityData.Activity_Duration,
            Activity_Place: bookingData.activityData.Activity_Place,
            Activity_BOP: bookingData.activityData.Price.BOP,
            Activity_Option_Price: bookingData.selectedActivityOption.Option_Price,
            Traveler: activityTraveler,
            Activity_Qty: TotalActivityTraveler,
            Activity_SubTotal: bookingData.activitySubTotal,
            Activity_IsGST: true,
            Activity_GST: {
                UTGST: bookingData.activityTax.UTGST,
                CGST: bookingData.activityTax.CGST,
            }
        };


        let Items = [activityItem]

        if(bookingData.selectedActivityAddon && bookingData.selectedActivityAddon.length > 0){
            Items.push(...bookingData.selectedPackageAddon);
        }

        const genarateBookingParams = {
            Booking_Id: packageBookingId,
            User_Id: bookingData.userData.User_Id,
            Booking_Type: "Activity",
            Booking_Items: Items,
            Payment_Deatils: {
                Payment_Gateway: PaymentGW[bookingData.PAYGW],
                Payment_SubTotal: bookingData.activitySubTotal + bookingData.addonSubTotal,
                Contribution_Amount: bookingData.contributionAmount,
                Payment_Tax: {
                    GST: {
                        UTGST: bookingData.activityTax.UTGST,
                        CGST: bookingData.activityTax.CGST,
                    }
                },
                Payment_Total_With_TAX: bookingData.totalAmount,
                Payment_Amount: bookingData.totalAmount,
                Payment_Due: bookingData.totalAmount - bookingData.totalAmount,
                // Discount: 
                ...(bookingData.discount && { 
                    Discount: {
                        Coupon_Code: bookingData.discount.Coupon_Code, 
                        Discount_AMT: bookingData.discount.Discount_AMT
                    } 
                }),
            },
            Contact_Details: bookingData.contactData,
            Traveler: bookingData.sessionData.Checkout.Activity.Traveler,
            Travel_Date: bookingData.sessionData.Checkout.Activity.Travel_Date,
            Payment_Status: "Initiated",
            Booking_Status: "Pending Payment",
            Booking_TS: new Date().toLocaleDateString('en-IN', timeOptions)
        }

        const generateBooking = await BookingModel.genratePackageBooking(genarateBookingParams)

        return generateBooking
    }
    
    async createFerryBooking(bookingData){

        const prefix = "BOF"
        const timestamp = Date.now().toString()
        const salt = Math.random().toString(36).substring(2, 8)
        const uuid = uuidv4().toString().replace(/-/g, '')

        const combinedString = timestamp + salt + uuid
        const dynamicPart = shuffleString(combinedString).substring(0, 15)

        function shuffleString(str) {
            const array = str.split('');
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]]; // Swap elements
            }
            return array.join('');
        }

        const packageBookingId = prefix + dynamicPart

        const PaymentGW = {
            1: "Phone Pe",
            2: "Razorpay",
        }

        const timeOptions = {
            timeZone: 'Asia/Kolkata', // IST timezone
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // 24-hour format
        };

        const ferryTraveler = bookingData.sessionData.Checkout.Ferry.Traveler

        const TotalFerryTraveler = ferryTraveler.Adults + ferryTraveler.Infants

        const Ferry_Operator = bookingData.sessionData.Checkout.Ferry.Ferry_Operator

        let selectedFerryClass

        if(Ferry_Operator === "MAK"){
            selectedFerryClass = bookingData.singleFerryData.Classes.find(obj => obj.ship_class_id.toString() === bookingData.sessionData.Checkout.Ferry.Ferry_Data.Class_Id)
        }

        const IslandCode = {
            1: "Port Blair",
            2: "Swaraj Dweep",
            3: "Shaheed Dweep"
        }

        const ferryDepartureTime = bookingData.sessionData.Checkout.Ferry.Ferry_Data.Departure_Time
        const ferrArrivalTime = bookingData.sessionData.Checkout.Ferry.Ferry_Data.Arrival_Time

        function parseTimeString(timeString) {
            const [hours, minutes, seconds] = timeString.split(':').map(Number);
            return new Date(0, 0, 0, hours, minutes, seconds);
        }
          
        const time1Date = parseTimeString(ferryDepartureTime);
        const time2Date = parseTimeString(ferrArrivalTime);
          
        const diffMilliseconds = time2Date - time1Date;
        const diffMinutes = Math.floor(diffMilliseconds / 1000 / 60);
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
          
        const TravelDuration =  `${minutes < 1 ? `${hours} hour` : `${hours}h`} ${minutes > 1 ? `${minutes}m` : ""}`;

        const paxDataFormated = {
            Adults: bookingData.PaxData.adults.map(person => ({
                Pax_Title: person.title,
                Pax_Name: person.name,
                Pax_Age: person.age,
                Pax_Country: person.country,
                Pax_Passport_Number: person.passportNumber,
                Pax_Passport_ExpiryDate: person.passportExpiryDate,
                ...(Ferry_Operator === "NTK" && { Pax_Seat: person.seat })
            })),
            infants: bookingData.PaxData.infants.map(person => ({
                Pax_Title: person.title,
                Pax_Name: person.name,
                Pax_Age: person.age,
                Pax_Country: person.country,
                Pax_Passport_Number: person.passportNumber,
                Pax_Passport_ExpiryDate: person.passportExpiryDate
              }))
        }

        let Items = []

        if(Ferry_Operator === "MAK"){

            const ferryItem = {
                Item_Type: "Ferry",
                Ferry_Id: bookingData.sessionData.Checkout.Ferry.Ferry_Data.Schedule_Id,
                Ferry_Class_Id: bookingData.sessionData.Checkout.Ferry.Ferry_Data.Class_Id,
                Ferry_Operator: bookingData.singleFerryData.ferryOPR,
                Class_Title: selectedFerryClass.class_title,
                Ferry_Departure: IslandCode[bookingData.sessionData.Checkout.Ferry.Ferry_Data.Departure],
                Ferry_Destination: IslandCode[bookingData.sessionData.Checkout.Ferry.Ferry_Data.Destination],
                Departure_Time: ferryDepartureTime,
                Arrival_Time: ferrArrivalTime,
                Travel_Duration: TravelDuration,
                Ferry_Option_Price: parseInt(selectedFerryClass.ship_class_price, 10),
                Traveler: ferryTraveler,
                Ferry_Ticket_Qty: TotalFerryTraveler,
                Ferry_SubTotal: bookingData.ferrySubTotal,
            };

            Items = [ferryItem]

        }

        if(Ferry_Operator === "NTK"){
            

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

            const selectedSeats = mergeSeats(bookingData.PaxData);

            const { pBaseFare: pClassPrice, bBaseFare: bClassPrice, infantFare } = bookingData.singleFerryData.fares

            const calculateSubTotal = (price, quantity) => price * quantity

            const createFerryItem = (classTitle, price, qty, subTotal) => ({
                Item_Type: "Ferry",
                Ferry_Id: bookingData.sessionData.Checkout.Ferry.Ferry_Data.Ferry_Id,
                Ferry_Trip_Id: bookingData.sessionData.Checkout.Ferry.Ferry_Data.Trip_Id,
                Ferry_Operator: bookingData.singleFerryData.ferryOPR,
                Class_Title: classTitle,
                Vessel_ID: bookingData.singleFerryData.vesselID,
                Ferry_Departure: IslandCode[bookingData.sessionData.Checkout.Ferry.Ferry_Data.Departure],
                Ferry_Destination: IslandCode[bookingData.sessionData.Checkout.Ferry.Ferry_Data.Destination],
                Departure_Time: ferryDepartureTime,
                Arrival_Time: ferrArrivalTime,
                Travel_Duration: TravelDuration,
                Ferry_Option_Price: parseInt(price, 10),
                Traveler: ferryTraveler,
                Ferry_Ticket_Qty: qty,
                Ferry_SubTotal: subTotal,
            });

            const pClassTotalTraveler = selectedSeats.pClass.length;
            const bClassTotalTraveler = selectedSeats.bClass.length;

            if (pClassTotalTraveler > 0) {
                Items.push(createFerryItem("Luxury Class", pClassPrice, pClassTotalTraveler, calculateSubTotal(pClassPrice, pClassTotalTraveler)));
            }
        
            if (bClassTotalTraveler > 0) {
                Items.push(createFerryItem("Royal Class", bClassPrice, bClassTotalTraveler, calculateSubTotal(bClassPrice, bClassTotalTraveler)))
            }
        
            if (ferryTraveler.Infants > 0) {
                Items.push(createFerryItem("N/A", infantFare, ferryTraveler.Infants, calculateSubTotal(infantFare, ferryTraveler.Infants)))
            }

        }

        

        const genarateBookingParams = {
            Booking_Id: packageBookingId,
            User_Id: bookingData.userData.User_Id,
            Booking_Type: "Ferry",
            Ferry_Operator: Ferry_Operator,
            Booking_Items: Items,
            Pax_Data: paxDataFormated,
            ...(bookingData.singleFerryData.ferryOPR === "MAK" && {
                MAK_CNF_Data: bookingData.makCNFData.data,
            }),
            Payment_Deatils: {
                Payment_Gateway: PaymentGW[bookingData.PAYGW],
                Payment_SubTotal: bookingData.ferrySubTotal,
                Contribution_Amount: bookingData.contributionAmount,
                PSF: bookingData.totalPSFcost,
                Payment_Tax: {
                    GST: {
                        UTGST: 0,
                        CGST: 0,
                    }
                },
                Payment_Total_With_PSF: bookingData.totalAmount,
                Payment_Amount: bookingData.totalAmount,
                Payment_Due: bookingData.totalAmount - bookingData.totalAmount,
                // Discount: 
                ...(bookingData.discount && { 
                    Discount: {
                        Coupon_Code: bookingData.discount.Coupon_Code, 
                        Discount_AMT: bookingData.discount.Discount_AMT
                    } 
                }),
            },
            Contact_Details: bookingData.contactData,
            Traveler: ferryTraveler,
            Travel_Date: bookingData.sessionData.Checkout.Ferry.Ferry_Data.Travel_Date,
            Payment_Status: "Initiated",
            Booking_Status: "Pending Payment",
            Booking_TS: new Date().toLocaleDateString('en-IN', timeOptions)
        }

        const generateBooking = await BookingModel.genrateFerryBooking(genarateBookingParams)
        return generateBooking
    }

    async getBookingData(bookingId){

        const bookingData = await BookingModel.getBookingData(bookingId)
        return bookingData

    }

    async changeBookingStatus(bookingData, paymentStatus){

        const bookingId = bookingData.Booking_Id

        const changeBookingStatus = await BookingModel.changeBookingPaymentStatus(bookingId, paymentStatus)
        return changeBookingStatus
    }

    async getMultiBookingData(bookingIds){
        const bookingData = await BookingModel.getMultiBookingData(bookingIds)
        return bookingData
    }
}

export default new bookingService()