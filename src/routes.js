import userAuthController from '../controllers/userAuth.controller.js'
import notificationController from '../controllers/notification.controller.js'

export default function router(routes) {
  
    //Group 1: User Auth Api-Endpoint
    routes.group('/api/user/auth', app => app
        .post('/phone-signin', userAuthController.phoneSignin)
        .post('/email-signin', userAuthController.emailSignin)
    );

    routes.group('/api/comm/send', app => app
        .post('/send-phone-otp', notificationController.sendPhoneOTP)
        .post('/send-email-otp', notificationController.sendEmailOTP)
        .post('/int-email-otp', notificationController.sendINTEmailOTP)
    );

}