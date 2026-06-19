const express=require("express");

const router=express.Router();

const {
registerUser, loginUser, getAllUsers, getDashboardStats
}=require("../controllers/authControllers");

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/users",getAllUsers);
router.get("/dashboard-stats",getDashboardStats);

module.exports=router;