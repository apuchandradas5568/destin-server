import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoConnect from "./db/mongoConnect.js";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)





dotenv.config();

const PORT = process.env.PORT || 5050;
const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", 'https://destin-20e01.firebaseapp.com', 'https://destin-20e01.web.app' ],
  credentials: true
}

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// import routes
import userRoutes from "./routes/users.routes.js";
import biodatasRoutes from "./routes/biodatas.routes.js";
import paymentsRoutes from "./routes/premium.routes.js";
import adminRoutes from "./routes/admin.routes.js";
// using routes

app.use("/users", userRoutes);
app.use('/biodatas', biodatasRoutes)
app.use('/payments', paymentsRoutes)
app.use('/admin', adminRoutes)



mongoConnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
