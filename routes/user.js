const express=require("express")
const {handleUserSignup,handleUserLogin}= require("../controllers/user");
const router = express.Router();  // ✅ Capital "R" in Router

router.post("/",handleUserSignup);
router.post("/login",handleUserLogin);
module.exports = router;  // ✅ This properly exports the router
