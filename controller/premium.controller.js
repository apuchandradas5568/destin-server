import { paymentsCollection, usersCollection } from "../db/mongoConnect.js";
import { stripe } from "../index.js";
import { sendPaymentConfirmationMail } from "../nodemailer/nodeMailer.js";

export const makePayment = async (req, res) => {
  const { price } = req.body;

  const amount = parseInt(price * 100);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types: ["card"],
  });

  // console.log(paymentIntent);

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};

export const newPaymentDataCreate = async (req, res) => {
  const payment = req.body;

  const { email } = req.user;

  const transactionId = payment.transactionId

  try {
    const newPayment = await paymentsCollection.insertOne(payment);
    // console.log(newPayment);
     await usersCollection.findOneAndUpdate(
      {
        email: email,
      },
      {
        $set: {
          isPremium: true,
        },
      }
    )
    .then(()=>{
      sendPaymentConfirmationMail(email, transactionId)
    })
;
    res.json(newPayment);
  } catch (error) {
    res.json(error);
  }
};
