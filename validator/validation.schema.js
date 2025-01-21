import Joi from 'joi';

const minDate = new Date();
minDate.setDate(minDate.getDate() + 6);

export const phoneOTPschema = Joi.object({
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).message('The phone number is not valid').required(),
    country: Joi.string().valid('india').required()
});

export const phoneLoginschema = Joi.object({
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).message('The phone number is not valid').required(),
    country: Joi.string().valid('india').required(),
    otp: Joi.number().integer().min(100000).max(999999).required().messages({'number.min': 'OTP must be a 6-digit number','number.max': 'OTP must be a 6-digit number','any.required': 'OTP is required'}),
    hash: Joi.string().pattern(/^.*\..*$/).required().messages({'string.empty': 'Hash is required','string.pattern.base': 'Invalid Hash'})
});

export const emailOTPschema = Joi.object({
    email: Joi.string().email().message('The email address is not valid').required(),
    country: Joi.string().required(),
});

export const emailLoginschema = Joi.object({
    email: Joi.string().email().message('The email address is not valid').required(),
    country: Joi.string().required(),
    otp: Joi.number().integer().min(100000).max(999999).required().messages({'number.min': 'OTP must be a 6-digit number','number.max': 'OTP must be a 6-digit number','any.required': 'OTP is required'}),
    hash: Joi.string().pattern(/^.*\..*$/).required().messages({'string.empty': 'Hash is required','string.pattern.base': 'Invalid Hash'})
});

export const intEmailOTPschema = Joi.object({
    phone: Joi.string().pattern(/^\d{6,15}$/).message('The phone number is not valid').required(),
    email: Joi.string().email().message('The email address is not valid').required(),
    country: Joi.string().invalid('india').required()
});

export const intEmailLoginschema = Joi.object({
    phone: Joi.string().pattern(/^\d{6,15}$/).message('The phone number is not valid').required(),
    email: Joi.string().email().message('The email address is not valid').required(),
    country: Joi.string().invalid('india').required(),
    otp: Joi.number().integer().min(100000).max(999999).required().messages({'number.min': 'OTP must be a 6-digit number','number.max': 'OTP must be a 6-digit number','any.required': 'OTP is required'}),
    hash: Joi.string().pattern(/^.*\..*$/).required().messages({'string.empty': 'Hash is required','string.pattern.base': 'Invalid Hash'})
});

export const fatchAllFerryschema = Joi.object({
    dept: Joi.number().min(1).max(3).required(),
    dest: Joi.number().min(1).max(3).required().invalid(Joi.ref('dept')),
    date: Joi.date().min('now').required(),
});

export const fatchSingleFerryMakschema = Joi.object({
    scheduleID: Joi.string().required(),
    dept: Joi.number().min(1).max(3).required(),
    dest: Joi.number().min(1).max(3).required().invalid(Joi.ref('dept')),
    date: Joi.date().min('now').required(),
    trav: Joi.number().min(1).required()
});

export const fatchSingleFerryNtkSchema = Joi.object({
    ferryId: Joi.string().required(),
    tripId: Joi.string().required(),
    dept: Joi.number().min(1).max(3).required(),
    dest: Joi.number().min(1).max(3).required().invalid(Joi.ref('dept')),
    date: Joi.date().min('now').required(),
    trav: Joi.number().min(1).max(10).required()
});

// Define the schema for the Traveler object
const travelerSchema = Joi.object({
    rooms: Joi.number().integer().min(1).max(3).required(),
    adults: Joi.number().integer().min(1).required(),
    child: Joi.number().integer().min(0).required(),
    infant: Joi.number().integer().min(0).required()
}).custom((value, helpers) => {
    const { rooms, adults, child, infant } = value;
  
    // Validate the number of adults based on the number of rooms
    const maxAdults = rooms * 3;
    if (adults < 1 || adults > maxAdults) {
      return helpers.error('any.invalid', { message: `Number of adults must be between 1 and ${maxAdults}` });
    }
  
    // Validate the number of children based on the number of adults
    const maxChildren = rooms * 2;
    if (child > maxChildren) {
      return helpers.error('any.invalid', { message: `Number of children must be between 0 and ${maxChildren}` });
    }
  
    // Validate the number of infants based on the number of rooms
    if (infant < 0 || infant > rooms) {
      return helpers.error('any.invalid', { message: `Number of infants must be between 0 and ${rooms}` });
    }
  
    // Specific rules for the number of children based on the number of adults in each room
    if (rooms === 1) {
      if (adults === 3 && child > 1) {
        return helpers.error('any.invalid', { message: 'If there are 3 adults in one room, there can only be 1 child' });
      }
      if (adults === 2 && child > 2) {
        return helpers.error('any.invalid', { message: 'If there are 2 adults in one room, there can only be 2 children' });
      }
    } else if (rooms === 2) {
      if (adults === 6 && child > 2) {
        return helpers.error('any.invalid', { message: 'If there are 6 adults in two rooms, there can only be 2 children' });
      }
      if (adults === 4 && child > 4) {
        return helpers.error('any.invalid', { message: 'If there are 4 adults in two rooms, there can only be 4 children' });
      }
      if (adults === 5 && child > 3) {
        return helpers.error('any.invalid', { message: 'If there are 5 adults in two rooms, there can only be 3 children' });
      }
    } else if (rooms === 3) {
      if (adults === 9 && child > 3) {
        return helpers.error('any.invalid', { message: 'If there are 9 adults in three rooms, there can only be 3 children' });
      }
      if (adults === 6 && child > 6) {
        return helpers.error('any.invalid', { message: 'If there are 6 adults in three rooms, there can only be 6 children' });
      }
      if (adults === 7 && child > 5) {
        return helpers.error('any.invalid', { message: 'If there are 7 adults in three rooms, there can only be 5 children' });
      }
      if (adults === 8 && child > 4) {
        return helpers.error('any.invalid', { message: 'If there are 8 adults in three rooms, there can only be 4 children' });
      }
    }
    return value;
  }, 'Traveler Custom Validation');
  

export const SesStorePackschema = Joi.object({
    packageId: Joi.string().required(),
    packageOptionId: Joi.string().required(),
    travelDate: Joi.date().min(minDate).required(),
    traveler: travelerSchema.required(),
    packagePrice: Joi.number().integer().required(),
    bookingPrice: Joi.number().integer().required(),
});

const activityTravelerSchema = Joi.object({
  persons: Joi.number().integer().min(1).required(),
})

export const SesStoreActivityschema = Joi.object({
    activityId: Joi.string().required(),
    activityOptionId: Joi.string().required(),
    travelDate: Joi.date().min(minDate).required(),
    traveler: activityTravelerSchema.required(),
    activityPrice: Joi.number().integer().required(),
    bookingPrice: Joi.number().integer().required(),
});

const addressSchema = Joi.object({
    Address: Joi.string().min(3).max(95).optional(),
    City: Joi.string().min(3).max(35).optional(),
    State: Joi.string().min(3).max(35).optional(),
    Pincode: Joi.string().min(3).max(10).optional(),
    Nationality: Joi.string().min(3).max(35).optional()
}).or('Address', 'City', 'State', 'Pincode', 'Nationality');

export const updateReqschema = Joi.object({
    name: Joi.string().min(3).max(50).optional(),
    DOB: Joi.date().max('now').optional(),
    maritalStatus: Joi.string().min(3).max(20).optional(),
    address: addressSchema.optional(),
}).or('name', 'DOB', 'maritalStatus', 'address');


const travelerSchemaV2 = Joi.object({
    Adults: Joi.number().min(1).max(10).required(),
    Infants: Joi.number().min(0).max(10).required()
});

const timePattern = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

const makFerrySchema = Joi.object({
    Travel_Date: Joi.date().min('now').required(),
    Schedule_Id: Joi.string().required(),
    Class_Id: Joi.string().required(),
    Departure: Joi.number().min(1).max(3).required().invalid(Joi.ref('Destination')),
    Destination: Joi.number().min(1).max(3).required(),
    Departure_Time: Joi.string().pattern(timePattern).required(),
    Arrival_Time: Joi.string().pattern(timePattern).required(),
    Fare: Joi.number().required()
});

export const SesStoreMakCheckoutSchema = Joi.object({
    Ferry_Operator: Joi.string().valid('MAK').required(),
    Ferry_Data: makFerrySchema.required(),
    Traveler: travelerSchemaV2.required()
});

const ntkFaresSchema = Joi.object({
  bBaseFare: Joi.number().required(),
  bBaseFarePBHLNL: Joi.number().required(),
  bIslanderFarePBHLNL: Joi.number().required(),
  infantFare: Joi.number().required(),
  pBaseFare: Joi.number().required(),
  pBaseFarePBHLNL: Joi.number().required(),
  pIslanderFarePBHLNL: Joi.number().required()
});

const seatSchema = Joi.object({
  tier: Joi.string().valid("P", "B").required(),
  number: Joi.string().required(),
  isBooked: Joi.number().valid(0, 1).required(), 
  isBlocked: Joi.number().valid(0, 1).required()
});

const ntkFerrySchema = Joi.object({
  Ferry_Id: Joi.string().required(),
  Trip_Id: Joi.string().required(),
  Travel_Date: Joi.date().min('now').required(),
  Departure: Joi.number().min(1).max(3).required().invalid(Joi.ref('Destination')),
  Destination: Joi.number().min(1).max(3).required(),
  Departure_Time: Joi.string().pattern(timePattern).required(),
  Arrival_Time: Joi.string().pattern(timePattern).required(),
  Fare: ntkFaresSchema.required(),
  Selected_Seats: Joi.object({
    pClass: Joi.array().items(seatSchema).min(0).required(),
    bClass: Joi.array().items(seatSchema).min(0).required()
  }).required().custom((value, helpers) => {
    // Check if combined length of pClass and bClass equals Adults
    const totalSelectedSeats = value.pClass.length + value.bClass.length;
    const adultsCount = helpers.state.ancestors.find(obj => obj.Ferry_Operator === "NTK").Traveler.Adults;
    
    // Check if the total selected seats match the number of adults
    if (totalSelectedSeats !== adultsCount) {
      return helpers.error('any.invalid');
    }

    // Check that at least one of pClass or bClass has seats selected
    if (value.pClass.length === 0 && value.bClass.length === 0) {
      return helpers.error('any.invalid');
    }

    return value;
  })
});

export const SesStoreNtkCheckoutSchema = Joi.object({
    Ferry_Operator: Joi.string().valid('NTK').required(),
    Ferry_Data: ntkFerrySchema.required(),
    Traveler: travelerSchemaV2.required()
});

export const fatchSinglePackschema = Joi.object({
    packageId: Joi.string().required(),
});

export const fatchFilterPackschema = Joi.object({
    category: Joi.string().required(),
});

export const fatchSingleActivityschema = Joi.object({
    activityId: Joi.string().required(),
});

export const fatchFilterActivityschema = Joi.object({
    category: Joi.string().required(),
});

export const fatchHotelSchema = Joi.object({
    hotelIds: Joi.array().items(Joi.string()).required()
});

export const fatchFeaturedPackSchema = Joi.object({
    category: Joi.string().required(),
});

const travelerSchemaPackageForm = Joi.object({
    adults: Joi.number().integer().min(1).required(),
    child: Joi.number().integer().min(0).required(),
    infant: Joi.number().integer().min(0).required()
})



export const packageFormSchema = Joi.object({
    packageId: Joi.string().required(),
    packageOptionId: Joi.string().required(),
    name: Joi.string().required(),
    phonenumber: Joi.string().pattern(/^\d{6,15}$/).message('The phone number is not valid').required(),
    email: Joi.string().email().message('The email address is not valid').required(),
    tripDate: Joi.date().min(minDate).required(),
    tripDuration: Joi.string().required(),
    traveler: travelerSchemaPackageForm.required()
});

export const destinationFormSchema = Joi.object({
    destinationId: Joi.number().valid(1, 2, 3, 4, 5, 6, 7, 8).required(),
    name: Joi.string().required(),
    phonenumber: Joi.string().pattern(/^\d{6,15}$/).message('The phone number is not valid').required(),
    email: Joi.string().email().message('The email address is not valid').required(),
    tripDate: Joi.date().min(minDate).required(),
    tripDuration: Joi.string().required(),
    traveler: travelerSchemaPackageForm.required()
});


const packageCheckoutTravelerSchema = Joi.object({
  Rooms: Joi.number().integer().min(1).max(3).required(),
  Adults: Joi.number().integer().min(1).required(),
  Child: Joi.number().integer().min(0).required(),
  Infant: Joi.number().integer().min(0).required()
}).custom((value, helpers) => {
  const { Rooms, Adults, Child, Infant } = value;

  // Validate the number of adults based on the number of rooms
  const maxAdults = Rooms * 3;
  if (Adults < 1 || Adults > maxAdults) {
    return helpers.error('any.invalid', { message: `Number of adults must be between 1 and ${maxAdults}` });
  }

  // Validate the number of children based on the number of adults
  const maxChildren = Rooms * 2;
  if (Child > maxChildren) {
    return helpers.error('any.invalid', { message: `Number of children must be between 0 and ${maxChildren}` });
  }

  // Validate the number of infants based on the number of rooms
  if (Infant < 0 || Infant > Rooms) {
    return helpers.error('any.invalid', { message: `Number of infants must be between 0 and ${Rooms}` });
  }

  // Specific rules for the number of children based on the number of adults in each room
  if (Rooms === 1) {
    if (Rooms === 3 && Child > 1) {
      return helpers.error('any.invalid', { message: 'If there are 3 adults in one room, there can only be 1 child' });
    }
    if (Rooms === 2 && Child > 2) {
      return helpers.error('any.invalid', { message: 'If there are 2 adults in one room, there can only be 2 children' });
    }
  } else if (Rooms === 2) {
    if (Adults === 6 && Child > 2) {
      return helpers.error('any.invalid', { message: 'If there are 6 adults in two rooms, there can only be 2 children' });
    }
    if (Adults === 4 && Child > 4) {
      return helpers.error('any.invalid', { message: 'If there are 4 adults in two rooms, there can only be 4 children' });
    }
    if (Adults === 5 && Child > 3) {
      return helpers.error('any.invalid', { message: 'If there are 5 adults in two rooms, there can only be 3 children' });
    }
  } else if (Rooms === 3) {
    if (Adults === 9 && Child > 3) {
      return helpers.error('any.invalid', { message: 'If there are 9 adults in three rooms, there can only be 3 children' });
    }
    if (Adults === 6 && Child > 6) {
      return helpers.error('any.invalid', { message: 'If there are 6 adults in three rooms, there can only be 6 children' });
    }
    if (Adults === 7 && Child > 5) {
      return helpers.error('any.invalid', { message: 'If there are 7 adults in three rooms, there can only be 5 children' });
    }
    if (Adults === 8 && Child > 4) {
      return helpers.error('any.invalid', { message: 'If there are 8 adults in three rooms, there can only be 4 children' });
    }
  }
  return value;
}, 'Traveler Custom Validation');

const packageDataCheckoutSchema = Joi.object({
  Package_Id: Joi.string().required(),
  Package_Option_Id: Joi.string().required(),
})

const packageCheckoutContactSchema = Joi.object({
  Name: Joi.string().pattern(/^(?=.*\S)[a-zA-Z\s]{3,16}$/).message('Name is not valid').required(),
  Email: Joi.string().pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).message('Email Address is not valid').required(),
  Phone: Joi.string().pattern(/^(?=(?:[^0-9]*\d[^0-9]*){8,15}$)[\d+-]{8,15}$/).message('The phone number is not valid').required(),
  City: Joi.string().pattern(/^(?=.*\S)[a-zA-Z\s,]{3,40}$/).message('City is not valid').required(),
  State: Joi.string().pattern(/^(?=.*\S)[a-zA-Z\s,]{3,40}$/).message('State Name is not valid').required(),
  Address: Joi.string().pattern(/^[a-zA-Z0-9\s,\/\-]{10,100}$/).message('Address is not valid').required(),
  Request: Joi.string().pattern(/^[a-zA-Z0-9\s,\/\.\-\n]{10,400}$/).message('Special Request is not valid').optional(),
})

const discountSchema = Joi.object({
  Coupon_Code: Joi.string().optional(),
})

const subItemSchema = Joi.object({
  Sub_Item_Type: Joi.string().required(),
  Sub_Item_Id: Joi.string().required(),
  Sub_Item_Title: Joi.string().required(),
  Sub_Item_QTY: Joi.number().required()
});

export const packagePaymentInitschema = Joi.object({
    userId: Joi.string().required(),
    sessionId: Joi.string().required(),
    traveler: packageCheckoutTravelerSchema.required(),
    travelDate: Joi.date().min(minDate).required(),
    Sub_Items: Joi.array().items(subItemSchema).optional(),
    checkoutPackageData: packageDataCheckoutSchema.required(),
    contactData: packageCheckoutContactSchema.required(),
    paymentType: Joi.number().valid(1,2).required(),
    PAYGW: Joi.number().valid(1).required(),
    discount: discountSchema.optional(),
    contributionAmt: Joi.number().min(0).max(1000000).optional(),
    isTermsAgree: Joi.boolean().valid(true).required(),
});

export const bookingIdschema = Joi.object({
    bookingId: Joi.string().required(),
});

const activityTravelerSchemaV2 = Joi.object({
  Persons: Joi.number().integer().min(1).required(),
})

const activityDataCheckoutSchema = Joi.object({
  Activity_Id: Joi.string().required(),
  Activity_Option_Id: Joi.string().required(),
})


export const activityPaymentInitschema = Joi.object({
  userId: Joi.string().required(),
  sessionId: Joi.string().required(),
  traveler: activityTravelerSchemaV2.required(),
  travelDate: Joi.date().min(minDate).required(),
  Sub_Items: Joi.array().items(subItemSchema).optional(),
  checkoutActivityData: activityDataCheckoutSchema.required(),
  contactData: packageCheckoutContactSchema.required(),
  PAYGW: Joi.number().valid(1).required(),
  discount: discountSchema.optional(),
  contributionAmt: Joi.number().min(0).max(1000000).optional(),
  isTermsAgree: Joi.boolean().valid(true).required(),
});

const ferryDataCheckoutSchema = Joi.object({
  Ferry_Id: Joi.string().required(),
  Ferry_Operator: Joi.string().valid('MAK', 'NTK').required(),
  Trip_Id: Joi.when('Ferry_Operator', {
    is: 'NTK',
    then: Joi.string().required(), // Required if Ferry_Operator is NTK
    otherwise: Joi.forbidden(), // Not allowed if Ferry_Operator is not NTK
  }),
  Ferry_class_Id: Joi.when('Ferry_Operator', {
    is: 'MAK',
    then: Joi.string().required(), // Required if Ferry_Operator is MAK
    otherwise: Joi.forbidden(), // Not allowed if Ferry_Operator is not MAK
  }),
})

const PaxDataSchema = Joi.object({
  adults: Joi.array().items(
    Joi.object({
      title: Joi.string().required(), // Allow empty string for title if needed
      name: Joi.string().required(),
      age: Joi.string().required(),
      country: Joi.string().required().default('India'),
      passportNumber: Joi.when('country', {
        is: Joi.string().not('India'),
        then: Joi.string().required(),
        otherwise: Joi.string().allow(''),
      }),
      passportExpiryDate: Joi.when('country', {
        is: Joi.string().not('India'),
        then: Joi.date().required(),
        otherwise: Joi.string().allow(''),
      }),
      seat: Joi.custom((value, helpers) => {
        const ancestors = helpers.state.ancestors[0]; // Root level of the object
        const ferryOperator = ancestors?.checkoutFerryData?.Ferry_Operator;

        // If Ferry_Operator is NTK, validate the seat object
        if (ferryOperator === 'NTK') {
          if (
            !value ||
            typeof value !== 'object' ||
            !value.number ||
            !value.tier ||
            value.isBlocked !== 0 ||
            value.isBooked !== 0
          ) {
            return helpers.error('any.invalid');
          }
        }

        // If not NTK, seat can be undefined or any value
        return value;
      }).message('Invalid seat details for NTK Ferry Operator'),
    })
  ).required(),
  
  infants: Joi.array().items(
    Joi.object({
      title: Joi.string().required(), // Same validation for infants
      name: Joi.string().required(),
      age: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/) // Ensure age is in YYYY-MM-DD format
      .required()
      .custom((value, helpers) => {
        const now = new Date();
        const ancestors = helpers.state.ancestors;
      
        const ferryOperator = ancestors.find((ancestor) => ancestor?.checkoutFerryData)?.checkoutFerryData?.Ferry_Operator;

        const validDate = new Date();
        if (ferryOperator === "MAK") {
          validDate.setFullYear(now.getFullYear() - 2);
        } else {
          validDate.setFullYear(now.getFullYear() - 2);
          validDate.setDate(validDate.getDate() - 1);
        }
        const inputDate = new Date(value);

        if (isNaN(inputDate.getTime())) {
          return helpers.error("any.invalid"); // Invalid date format
        }

        if (inputDate > now || inputDate < validDate) {
          return helpers.error("date.invalid", {
            message: ferryOperator === "MAK"
              ? "Infant age must be less than 2 years from today."
              : "Infant age must be less than or equal to 2 year.",
          });
        }

        return value; // Pass validation
      }).messages({
        "date.base": "Birth date must be a valid date.",
        "date.invalid": "{{#message}}", // Use the custom message from the error helper
      }),
      country: Joi.string().required().default('India'),
      passportNumber: Joi.when('country', {
        is: Joi.string().not('India'),
        then: Joi.string().required(),
        otherwise: Joi.string().allow(''),
      }),
      passportExpiryDate: Joi.when('country', {
        is: Joi.string().not('India'),
        then: Joi.date().required(),
        otherwise: Joi.string().allow(''),
      }),
    })
  ).min(0).required(),
});

const ferryTravelerSchema = Joi.object({
  Adults: Joi.number().integer().min(1).max(10).required(), // Min 1, max 10 adults
  Infants: Joi.number().integer().min(0).max(10).required(), // Max 10 infants
});

const minDateFerry = new Date();
minDateFerry.setDate(minDateFerry.getDate());

export const ferryPaymentInitschema = Joi.object({
  userId: Joi.string().required(),
  sessionId: Joi.string().required(),
  traveler: ferryTravelerSchema.required(),
  travelDate: Joi.date().min(minDateFerry).required(),
  checkoutFerryData: ferryDataCheckoutSchema.required(),
  contactData: packageCheckoutContactSchema.required(),
  PaxData: PaxDataSchema.required(),
  PAYGW: Joi.number().valid(1).required(),
  discount: discountSchema.optional(),
  contributionAmt: Joi.number().min(0).max(1000000).optional(),
  isTermsAgree: Joi.boolean().valid(true).required(),
}).options({ allowUnknown: true });

export const createAdminUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().message('The email address is not valid').required(),
  phone: Joi.string().pattern(/^(?=.*\d)[\d+-]{6,15}$/).message('The phone number is not valid').required(),
  designation: Joi.string().required(),
  role: Joi.string().required(),
  password: Joi.string().pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*_])[A-Za-z\d!@#$%^&*_]{10,12}$/).message('The password not contain valid charecters').required(),
});

export const loginAdminUserSchema = Joi.object({
  email: Joi.string().email().message('The email address is not valid').required(),
  password: Joi.string().pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*_])[A-Za-z\d!@#$%^&*_]{10,12}$/).message('The password not contain valid charecters').required(),
});

export const fetchHotelbyFilterSchema = Joi.object({
    destination: Joi.string().required(),
});

export const fetchSSbyFilterSchema = Joi.object({
    destination: Joi.string().required(),
});

export const getSingleEnquirySchema = Joi.object({
    Inq_Id: Joi.string().required(),
});

export const changeEnquiryStatusSchema = Joi.object({
    Inq_Id: Joi.string().required(),
    Status: Joi.string().required(),
});

