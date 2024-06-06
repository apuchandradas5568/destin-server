import { Router } from "express";
import { FavoriteController, ReviewController, allFavorite, allReview, checkFavorite, createBiodatas, deleteFromFavorite, deleteUser, generateToken,  getFilterData,  getPremium,  makePremium, makeRequest,  updateUser } from "../controller/users.controller.js";
import verifyToken from "../utils/verifyToken.js";


const router = Router();


router.post("/generate-token", generateToken)
router.post("/create", createBiodatas)

router.put("/update-users", updateUser)
router.delete("/delete-users", deleteUser)


router.get('/get-filter', getFilterData)

router.post('/make-premium',verifyToken, makePremium)
router.post('/make-request', verifyToken, makeRequest)

router.post('/favourite', verifyToken, FavoriteController)
router.delete('/delete-favorite/:biodataId', verifyToken, deleteFromFavorite)
router.get('/check-favorite/:biodataId', verifyToken, checkFavorite)
router.get('/all-favorite', verifyToken, allFavorite)


router.post('/success-story', verifyToken, ReviewController)
router.get('/all-review', allReview)


router.get('/get-premium', getPremium)

export default router;