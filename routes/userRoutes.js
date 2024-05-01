import express from "express"
import  {isAuthenticatedUser,authorizeRoles} from "../middleware/auth.js"
import {upload} from "../middleware/multer.middleware.js";
import csrf from "csurf"

const router=express.Router();

var csrfProtection = csrf({ cookie: true })

import  {registerUser, loginUser, logout,updateuserProfile,getAllUsers,getsingleUser,getuserDetails,updateUSerRole,deleteUser,updatePassword,getAllHospital,deleteHospital,updateStatus, getSingleHospital, addDonor, addReceiver, getHistory} from "../controllers/userController.js"

router.route("/register").post(
    upload.single("avatar"),
    registerUser)
router.route("/login").post(loginUser);
router.route("/logout").get(logout)
router.route("/me").get(isAuthenticatedUser,getuserDetails);
router.route("/me/update").put(isAuthenticatedUser,updateuserProfile);

router.route("/admin/users").get(getAllUsers);

router.route("/admin/user/:id").get(getsingleUser);

router.route("/admin/user/:id").put(updateUSerRole)
.delete(deleteUser);

//update password
router.route("/password/update").put(isAuthenticatedUser,updatePassword);

router.route("/admin/allhospital").get(getAllHospital);
router.route("/admin/deletehospital/:id").delete(deleteHospital);
router.route("/admin/status/:id").put(updateStatus);
router.route("/admin/gethospital/:id").get(getSingleHospital);


//Sending hospital request
router.get('/user/donation/request',addDonor)
router.get('/user/receiving/request',addReceiver)
router.get('/user/history',getHistory)

export default router;