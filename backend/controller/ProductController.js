import Product from "../model/useProduct.js";

export const productdata = async (req, res) => {
  const {
    title,
    price,
    storeId,
    description,
    category,
    image,
    stock,
    shipping,
    availability,
    discount,
    review,
    tags,
    rating,
    userId,
  } = req.body;

  try {
    if (
      !title ||
      !price ||
      !description ||
      !image ||
      !stock ||
      !shipping ||
      !tags ||
      !category ||
      !availability ||
      !discount ||
      !review ||
      !rating ||
      !userId ||
      !storeId
    ) {
      console.log("Please fill all fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = new Product({
      title,
      price,
      description,
      category,
      image,
      stock,
      shipping,
      availability,
      discount,
      review,
      tags,
      rating,
      userId,
      storeId,
    });

    const savedata = await product.save();
    res.status(201).json(savedata);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// export const getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.status(200).json({products});
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const DeleteProduct = async (req, res) => {
  try {
    const deleId = req.params.id;
    console.log("delete-id", deleId);
    const deleteProduct = await Product.findByIdAndDelete(deleId);
    if (!deleteProduct) {
      return res.status(404).json({ message: "product not found" });
    }

    res.status(200).json({ message: "deleted succesfully" });
  } catch (error) {
    console.error("Error in deleting :", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const update = async (req, res) => {
  const updatedId = req.params.id;
  try {
    const updateProduct = await Product.findByIdAndUpdate(updatedId, req.body, {
      new: true,
    });

    if (!updateProduct) {
      return res.status(404).json({ message: "product not found" });
    }
    res.status(200).json({ message: "update succcesfully" });
  } catch (error) {
    console.error("Error in updating :", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getProductsByCategoryId = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Validate categoryId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID", status: "fail" });
    }

    // Find products with category field equal to this ID
    const products = await Product.find({ category: categoryId });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found in this category", status: "fail" });
    }

    res.status(200).json({ data: products, status: "success" });

  } catch (error) {
    console.error("Error fetching products by category ID:", error.message);
    res.status(500).json({ message: "Internal server error", status: "error" });
  }
};


export const getCategory = async (req, res) => {
  try {
    const categories = await Product.distinct("category"); 
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getproductByid = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    console.log(product, "product====================");

    if (!product || product.length == 0) {
      return res.status(404).json({
        message: "No products found in this category",
        status: "fail",
      });
    }
    res.status(200).json({
      data: product,
      status: "success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      status: "error",
    });
  }
};

export const searchProduct = async (req, res) => {
  const { title, category, price, tags, minprice, maxprice } = req.query;
  const query = {};
  try {
    if (title) query.title = { $regex: title, $options: "i" };
    if (category) query.category = category;
    if (price) {
      query.price = Number(price);
    } else {
      if (minprice || maxprice) {
        query.price = {};
        if (minprice) query.price.$gt = Number(minprice);
        if (maxprice) query.price.$lt = Number(maxprice);
      }
    }
    if (tags) query.tags = tags;
    const products = await Product.find(query);
    return res.json(products);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      status: "error",
    });
  }
};


export const getproducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const doc = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments();
    res.json({
      doc,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
      skip,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Something went wrong while fetching products" });
  }
};


export const addTocart = async (req,res)=>{
try {
const id = req.body
const cart = await Product.find({_id : id })

if(cart){



}




res.status(200).json({message:"succces"})

}
 catch (error) {
  
}




}

// export const searchMultipleCategory =async (req,res)=>{
//   const categoryName = req.params.category
//   const proucuts = await Product.find({category:categoryName})

// try {
//   if (proucuts) {
    
//   }
  
  
// } catch (error) {
  
// }



// }


