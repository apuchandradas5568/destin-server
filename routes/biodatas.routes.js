import { Router } from "express";
import { createBiodata, deleteBiodata, getBiodata, getBiodataById, getBiodatas, updateBiodata } from "../controller/biodatas.controller.js";
import verifyToken from "../utils/verifyToken.js";



const router = Router();


router.post("/create", createBiodata)
router.get("/get-for-user",verifyToken, getBiodata)
router.get("/get/:id", getBiodataById)
router.get("/get-all", getBiodatas)
router.put("/update/:id", updateBiodata)
router.delete("/delete/:id", deleteBiodata)

export default router;
