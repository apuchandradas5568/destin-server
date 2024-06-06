import { Router } from "express";
import verifyToken from "../utils/verifyToken.js";
import { deleteUserController, getApprovedListController, getPendingListController, getUsersListController, makeAdminController, makePremiumController, cancelPremiumMembershipController, removeAdminController, cancelPremiumController, adminDashboardDataController, deleteStoryController } from "../controller/admin.controllers.js";


const router = Router();


router.get('/approved-list', verifyToken, getApprovedListController)
router.get('/pending-list', verifyToken, getPendingListController)
router.patch('/cancel-premium-membership', verifyToken, cancelPremiumMembershipController)
router.patch('/approve-contact/:email', verifyToken, makePremiumController)
router.get('/users-list', verifyToken, getUsersListController)

router.patch('/make-admin/:email', verifyToken, makeAdminController)
router.patch('/make-user/:email', verifyToken, removeAdminController)
router.patch('/cancel-premium/:email', verifyToken, cancelPremiumController)
router.delete('/delete-user/:email', verifyToken, deleteUserController)

router.delete('/delete-story/:id', verifyToken, deleteStoryController)


// admin dashboard routes
router.get('/admin-dashboard-data', adminDashboardDataController)

export default router;