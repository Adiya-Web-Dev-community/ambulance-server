const express = require('express')
const router = express.Router()
//controllers
const {
    sendOtp,
    verifyPrimaryContactOTP,
    profileSetup,
    sendAlternateContactOtp,
    verifyAlternateContactOTP,
    getProfileData
} = require('../controller/user')
// middleware
const middleware = require("../middleware/account")

router.post('/send-otp', sendOtp)
router.post("/verify-primary-contact", verifyPrimaryContactOTP)
router.post('/setup-profile', middleware, profileSetup)
router.post('/send-alternate-contact-otp', middleware, sendAlternateContactOtp)
router.post("/verify-alternate-contact-otp", middleware, verifyAlternateContactOTP)
router.get("/profile", middleware, getProfileData)

module.exports = router