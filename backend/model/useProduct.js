import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId:{
   type:String,
   require:true,
    },
    storeId: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    tags: {
      type: String,
      require: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    shipping: {
      type: String,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    review: {
      type: Number,
      require: true,
    },
    discount: {
      type: Number,
      require: true,
    },
    rating: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
