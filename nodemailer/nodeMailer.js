import nodemailer from 'nodemailer';

import dotenv from 'dotenv'


dotenv.config()

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
})


export const sendVerificationMail = async (email, verificationCode) => {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'Email Verification',
        text: `Your verification code is ${verificationCode}`
    }
    return await transporter.sendMail(mailOptions)
}



export const sendPasswordResetMail = async (email, resetCode) => {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'Password Reset',
        text: `Your password reset code is ${resetCode}`
    }
    return await transporter.sendMail(mailOptions)
}


export const sendPremiumConfirmationMail = async (email) => {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'Premium Membership',
        text: `Congratulations! Your premium membership has been approved.`
    }
    return await transporter.sendMail(mailOptions)
}

// make admin mail 
export const sendAdminMail = async (email) => {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'Admin Status',
        text: `Congratulations! You have been made an admin.`
    }
    return await transporter.sendMail(mailOptions)
}

// remove admin mail
export const sendRemoveAdminMail = async (email) => {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'Admin Status',
        text: `You have been removed from admin status.`
    }
    return await transporter.sendMail(mailOptions)
}

// send payment confirmation mail
export const sendPaymentConfirmationMail = async (email, id) => {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'Payment Confirmation',
        text: `Your payment has been received. Transaction ID: ${id}`
    }
    return await transporter.sendMail(mailOptions)
}

// send payment failure mail
export const sendPaymentFailureMail = async (email) => {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'Payment Failure',
        text: `Your payment has failed.`
    }
    return await transporter.sendMail(mailOptions)
}

// send biodata approval mail
export const sendBiodataApprovalMail = async (email) => {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'Biodata Approval',
        text: `Your biodata has been approved.`
    }
    return await transporter.sendMail(mailOptions)
}

