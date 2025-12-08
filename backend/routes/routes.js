import express from "express";

import {
  changePassword,
  getMydetail,
  sendOTPEmail,
  userLogin,
  Usersign,
  verifyOtp,
  
} from "../controller/userController.js";
import {
  getCategory,
  DeleteProduct,
  productdata,
  update,
  searchProduct,
  getproducts,
  getProductsByCategoryId,
} from "../controller/ProductController.js";

const router = express.Router();
router.post("/signup",Usersign);
router.post("/login", userLogin);
router.post("/otp", sendOTPEmail);
router.post("/product", productdata);
// router.get("/product", getAllProducts);
router.delete("/DelProduct/:id", DeleteProduct);
router.patch("/updateProduct/:id", update);
router.get("/productcategory",getCategory);
router.get("/productcategory/:id",getProductsByCategoryId);
router.get("/product-search/",searchProduct)
router.get("/product",getproducts)
router.post("/verifyOtp",verifyOtp)
router.get("/changePassword" ,changePassword)
router.get("/getMydetail" ,getMydetail)
export default router;
console.log("User routes loaded");

