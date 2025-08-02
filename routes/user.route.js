import {Router} from "express";
import {registerUser,login,logout,getUserProfile,updateUserProfile,updatePassword,updateProfilePicture,addAddress,changeAddress,deleteAddress,deleteProfilePicture,deleteUserProfile} from "../controllers/user.controller.js"
import {authMiddleware} from "../middlewares/auth.middleware.js";
const router = Router();
router.post("/register",registerUser);
router.post("/login",login);
router.post("/logout",authMiddleware,logout);
router.get("/profile",authMiddleware,getUserProfile);
router.put("/profile",authMiddleware,updateUserProfile);
router.put("/password",authMiddleware,updatePassword);
router.put("/profile-picture",authMiddleware,updateProfilePicture);
router.post("/address",authMiddleware,addAddress);
router.put("/address",authMiddleware,changeAddress);
router.delete("/address",authMiddleware,deleteAddress);
router.delete("/profile-picture",authMiddleware,deleteProfilePicture);
router.delete("/profile",authMiddleware,deleteUserProfile);

export default  router;
