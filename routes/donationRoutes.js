import express from "express"
import {isAuthenticatedUser} from "../middleware/auth.js"

const router=express.Router();

import {donate} from "../controllers/donationController.js"

router.route("/donate").post(isAuthenticatedUser,donate)

export default router;