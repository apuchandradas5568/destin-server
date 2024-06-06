import { Router } from "express";
import verifyToken from "../utils/verifyToken.js";
import { makePayment, newPaymentDataCreate } from "../controller/premium.controller.js";


const router = Router();


router.post("/create-payment-intent", verifyToken, makePayment)

router.post('/new-collection', verifyToken, newPaymentDataCreate)




export default router;