import express from "express";
const router= express.Router();

import  {hospitalSignup,hospitalLogin,getDonor, logout, toggleStatus, getReceiver,  increaseBlood, decreaseBlood,getHospital,hospitalSearch, toggleStatusReceiving} from "../controllers/hospital.js"
import { isAuthenticated } from "../middleware/auth.js";


router.get('/hospital/getdonor',isAuthenticated,getDonor);

router.get('/hospital/getreceiver',isAuthenticated,getReceiver);
router.get('/hospital/togglestatus/:Id',isAuthenticated,toggleStatus)
router.get('/hospital/togglestatus/receiving/:Id',isAuthenticated,toggleStatusReceiving)

router.get('/hospital/logout',isAuthenticated,logout);




router.patch('/hospital/updateblood/increment/:bloodgroup/:quantity',isAuthenticated,increaseBlood)
router.patch('/hospital/updateblood/decrement/:bloodgroup/:quantity',isAuthenticated,decreaseBlood)





router.post('/hospital/signup',hospitalSignup);
router.post('/hospital/login',hospitalLogin);
router.post('/hospital/request/search',hospitalSearch);

router.get('/hospital/gethosp',getHospital);





export default router;