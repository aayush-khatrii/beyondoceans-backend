import userAuthController from '../controllers/userAuth.controller.js'
import notificationController from '../controllers/notification.controller.js'
import ferryController from '../controllers/ferry.controller.js'
import packageController from '../controllers/package.controller.js'
import sessionController from '../controllers/session.controller.js'
import inquiryController from '../controllers/inquiry.controller.js'
import activityController from '../controllers/activity.controller.js'
import paymentController from '../controllers/payment.controller.js'
import bookingController from '../controllers/booking.controller.js'
import adminController from '../controllers/admin.controller.js'

export default function router(routes) {
      //Group 1: User Auth Api-Endpoint
    routes.group('/api/test', app => app
        .post('/test', userAuthController.test)
    );
    
    routes.group('/api/user/auth', app => app
        .post('/phone-signin', userAuthController.phoneSignin)
        .post('/email-signin', userAuthController.emailSignin)
        .post('/intemail-signin', userAuthController.intEmailSignin)
        .post('/update-profile', userAuthController.updateProfile)
        .post('/logout', userAuthController.logout)
        .post('/route-protector', userAuthController.routeProtector)
        .post('/auto-auth', userAuthController.autoAuth)
    );

    routes.group('/api/user/session', app => app
        .post('/store-package', sessionController.sessionStorePackData)
        .post('/store-activity', sessionController.sessionStoreActivityData)
        .post('/get-package-checkout', sessionController.sesGetPackageCheckout)
        .post('/get-activity-checkout', sessionController.sesGetActivityCheckout)
        .post('/store-mak-checkout', sessionController.sessionStoreMakFerryCheckout)
        .post('/store-ntk-checkout', sessionController.sessionStoreNtkFerryCheckout)
        .post('/get-ferry-checkout', sessionController.sesGetFerryCheckout)
    );

    routes.group('/api/comm/send', app => app
        .post('/send-phone-otp', notificationController.sendPhoneOTP)
        .post('/send-email-otp', notificationController.sendEmailOTP)
        .post('/int-email-otp', notificationController.sendINTEmailOTP)
    );

    routes.group('/api/forms', app => app
        .post('/package-inquiry', inquiryController.packageForm)
        .post('/destination-inquiry', inquiryController.destinationForm)
    );

    routes.group('/api/service/ferry', app => app
        .post('/search-all', ferryController.fatchAllFerry)
        .post('/search-single-mak', ferryController.fatchSingleFerryMak)
        .post('/add-ferry', ferryController.addFerrytoCart)
        .post('/search-single-ntk', ferryController.fatchSingleFerryNtk)
    );

    routes.group('/api/service/package', app => app
        .post('/get-all', packageController.getAllPackage)
        .get('/get-filter/:category', packageController.getFilterPackages)
        .post('/get-featured', packageController.getFeaturedPackages)
        .post('/get-single', packageController.getSinglePackage)
        .post('/get-hotels', packageController.getHotels)

        .post('/get-hotels-filter', adminController.getHotelbyFilter)
        // .post('/add-ferry', ferryController.addFerrytoCart)
    );

    routes.group('/api/service/activities', app => app
        .post('/get-all', activityController.getAllactivities)
        .get('/get-filter/:category', activityController.getFilterActivities)
        .post('/get-single', activityController.getSingleActivity)
        // .post('/add-ferry', ferryController.addFerrytoCart)
    );

    routes.group('/api/service/sightseeing', app => app
        .post('/get-sightseeing-filter', adminController.getSightseeingbyFilter)
    );

    routes.group('/api/checkout', app => app
        .post('/initate-package-payment', paymentController.packagePaymentInit)
        .post('/initate-activity-payment', paymentController.activityPaymentInit)
        .post('/initate-ferry-payment', paymentController.ferryPaymentInit)
    );

    routes.group('/api/payment', app => app
        .post('/varify-booking', paymentController.varifyBookingPayment)
    );

    routes.group('/api/booking', app => app
        .post('/get-booking', bookingController.getBookingData)
        .post('/user/get-bookings', bookingController.getUserBookingData)
        .post('/user/get-booking/invoice', bookingController.getBookingInvoice)
    );

    routes.group('/api/admin', app => app
        .post('/user/create-user', adminController.createAdminUser)
        .post('/user/get-users-list', adminController.getUsersList)
        .post('/user/login', adminController.loginAdminUser)
        .post('/user/auto-login', adminController.autoAdminUserLogin)
        .post('/user/logout', adminController.logoutAdminUser)

        .post('/enquiry/get-all', adminController.getEnquiriesList)
        .post('/enquiry/get-single', adminController.getSingleEnquiry)
        .post('/enquiry/change-status', adminController.changeEnquiryStatus)
    );

}