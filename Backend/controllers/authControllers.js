const User = require("../models/User");
const bcrypt=require("bcryptjs");

const registerUser = async (req,res)=>{
    try{

        const {name,email,password,role}=req.body;

        const userExists = await User.findOne({email});

        if(userExists){
            return res.status(400).json({
                message:"User already exists"
            });
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const user=await User.create({
            name,
            email,
            password:hashedPassword,
            role
            });

        res.status(201).json({
            message:"User Registered",
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        });

    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const { role, page = 1, limit = 10 } = req.query;

        let query = {};
        if (role) {
            query.role = role;
        }

        const users = await User.find(query)
            .select("-password")
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            data: users,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error.message
        });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const TransportDriver = require("../models/TransportDriver");

        const totalUsers = await User.countDocuments();
        const totalFarmers = await User.countDocuments({ role: "farmer" });
        const totalBuyers = await User.countDocuments({ role: "buyer" });
        const totalStorageOwners = await User.countDocuments({ role: "storage_owner" });
        const totalDrivers = await TransportDriver.countDocuments();
        const pendingDrivers = await TransportDriver.countDocuments({ status: "submitted" });
        const approvedDrivers = await TransportDriver.countDocuments({ status: "approved" });
        const rejectedDrivers = await TransportDriver.countDocuments({ status: "rejected" });
        const draftDrivers = await TransportDriver.countDocuments({ status: "draft" });

        const recentUsers = await User.find().select("-password").sort({ createdAt: -1 }).limit(5);
        const recentDrivers = await TransportDriver.find().sort({ createdAt: -1 }).limit(5);

        res.status(200).json({
            success: true,
            data: {
                users: { total: totalUsers, farmers: totalFarmers, buyers: totalBuyers, storageOwners: totalStorageOwners },
                drivers: { total: totalDrivers, pending: pendingDrivers, approved: approvedDrivers, rejected: rejectedDrivers, draft: draftDrivers },
                recentUsers,
                recentDrivers
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching dashboard stats",
            error: error.message
        });
    }
};

module.exports={registerUser, loginUser, getAllUsers, getDashboardStats};