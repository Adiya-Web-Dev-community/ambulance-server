const User = require('../model/user')
//helpers
const createOTP = require("../helper/generateOTP");
const jwt = require('jsonwebtoken');

//register-send otp
const sendOtp = async (req, res) => {
    const { primaryContact } = req.body
    if (!primaryContact) {
        return res.send({ success: false, message: 'Primary contact number cannot be empty' })
    }

    const isAccount = await User.findOne({
        $or: [
            { "primaryContact.contact": primaryContact },
            { "alternateContact.contact": primaryContact }
        ]
    });
    if (isAccount) {
        return res.send({ success: false, message: "Account already exists", isAccount })
    }

    try {
        //generate OTP
        const primaryContactOTP = createOTP()

        const newAccount = await User.create({
            primaryContact: {
                contact: primaryContact,
                otp: primaryContactOTP
            },
        })
        return res.send({ success: true, message: 'account created and otp sent', newAccount })
    } catch (err) {
        return res.send({ suceess: false, message: err.message })
    }
}

//verify primary contact otp
const verifyPrimaryContactOTP = async (req, res) => {
    const { primaryContact, primaryContactOTP } = req.body
    if (!primaryContact || !primaryContactOTP) {
        return res.send({ success: false, message: 'Primary contact or otp cannot be empty' })
    }
    const isAccount = await User.findOne({ "primaryContact.contact": primaryContact })
    if (!isAccount) {
        return res.send({ success: false, message: 'Account not exists. Please try again ' })
    }

    try {
        if (isAccount.primaryContact.otp !== primaryContactOTP) {
            return res.send({ success: false, message: 'Incorrect OTP' })
        }

        if (isAccount.primaryContact.otp === primaryContactOTP) {
            isAccount.primaryContact.isVerified = true
            await isAccount.save()
            const token = jwt.sign({ _id: isAccount._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
            return res.send({ success: true, message: "Account Verified", isAccount, token })
        }

    } catch (err) {
        return res.send({ success: false, message: err.message })
    }
}

//profile setup
const profileSetup = async (req, res) => {
    const { firstName, lastName, gender, age, alternateContact } = req.body

    const isAccount = await User.findById(req.accountId)
    if (!isAccount) {
        return res.send({ success: false, message: 'Account not found with this _id' })
    }

    try {
        const updateAccount = await User.updateOne({ _id: req.accountId }, {
            $set: {
                firstName: firstName,
                lastName: lastName,
                gender: gender,
                age: age,
                "alternateContact.contact": alternateContact
            }
        })
        const updatedAccount = await User.findById(req.accountId)
        if (updatedAccount.alternateContact.isVerified) {
            return res.send({ success: true, message: 'Profile setup successfully', updatedAccount })
        }
        else {
            return res.send({ success: false, message: "Please verify your alternate contact number" })
        }

    } catch (err) {
        return res.send({ success: false, message: err.message })
    }
}

//send alternate contact otp
const sendAlternateContactOtp = async (req, res) => {
    const { alternateContact } = req.body
    if (!alternateContact) {
        return res.send({ success: false, message: 'Alternate contact number cannot be empty' })
    }

    const isAccount = await User.findById(req.accountId)
    if (!isAccount) {
        return res.send({ success: false, message: "Account not exists" })
    }

    if (isAccount.primaryContact.contact === alternateContact) {
        return res.send({ success: false, message: 'Alternate contact cannot be same as primary contact ' })
    } else {
        try {
            //generate OTP
            const alternateContactOTP = createOTP()
            //update alternate contact and otp in data
            isAccount.alternateContact.contact = alternateContact
            isAccount.alternateContact.otp = alternateContactOTP
            await isAccount.save();
            console.log(isAccount)
            return res.send({ success: true, message: 'otp sent', isAccount })
        } catch (err) {
            return res.send({ suceess: false, message: err.message })
        }
    }
}

//verify alyernate contact otp
const verifyAlternateContactOTP = async (req, res) => {
    const { alternateContactOTP } = req.body
    if (!alternateContactOTP) {
        return res.send({ success: false, message: 'Alternate contact otp cannot be empty' })
    }
    const isAccount = await User.findById(req.accountId)
    if (!isAccount) {
        return res.send({ success: false, message: 'Account not exists. Please try again ' })
    }

    try {
        if (isAccount.alternateContact.otp !== alternateContactOTP) {
            return res.send({ success: false, message: 'Incorrect OTP' })
        }

        if (isAccount.alternateContact.otp === alternateContactOTP) {
            isAccount.alternateContact.isVerified = true
            await isAccount.save()
            return res.send({ success: true, message: "alternate contact Verified", isAccount, token })
        }

    } catch (err) {
        return res.send({ success: false, message: err.message })
    }
}

module.exports = {
    sendOtp,
    verifyPrimaryContactOTP,
    profileSetup,
    sendAlternateContactOtp,
    verifyAlternateContactOTP
}
