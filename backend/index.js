const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const nodemailer = require("nodemailer");
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://ahsank0811:KX9f3SjYk3PoLuct@kooglecluster0.xsmaexw.mongodb.net/",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `/images/${req.file.filename}`,
  });
});

// Route for Images folder
app.use("/images", express.static("upload/images"));

// MiddleWare to fetch user from token
const fetchuser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .send({ errors: "Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    return res
      .status(401)
      .send({ errors: "Please authenticate using a valid token" });
  }
};

// Schema for creating user model
const Users = mongoose.model("Users", {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object },
  isAdmin: { type: Boolean, default: false },
  date: { type: Date, default: Date.now() },
});

app.get("/", (req, res) => {
  res.send("Root");
});

app.post("/login", async (req, res) => {
  console.log("Login");
  let success = false;
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      success = true;
      console.log(user.id);
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success, token });
    } else {
      return res.status(400).json({
        success: success,
        errors: "please try with correct email/password",
      });
    }
  } else {
    return res.status(400).json({
      success: success,
      errors: "please try with correct email/password",
    });
  }
});

//Create an endpoint at ip/auth for regestring the user & sending auth-token
app.post("/signup", async (req, res) => {
  console.log("Sign Up");
  let success = false;
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: success,
      errors: "existing user found with this email",
    });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });
  await user.save();
  const data = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(data, "secret_ecom");
  success = true;
  res.json({ success, token });
});

// endpoint for getting all products data
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("Fetching All Products");
  res.send(products);
});

// endpoint for getting latest products data
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let arr = products.slice(0).slice(-8);
  console.log("New Collections");
  res.send(arr);
});

// endpoint for getting womens products data
app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  let arr = products.splice(0, 4);
  console.log("Popular In Women");
  res.send(arr);
});

// endpoint for getting womens products data
app.post("/relatedproducts", async (req, res) => {
  console.log("Related Products");
  const { category } = req.body;
  const products = await Product.find({ category });
  const arr = products.slice(0, 4);
  res.send(arr);
});

// Create an endpoint for saving the product in cart
app.post("/addtocart", fetchuser, async (req, res) => {
  console.log("Add Cart", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Added");
});

// Create an endpoint for removing the product in cart
app.post("/removefromcart", fetchuser, async (req, res) => {
  console.log("Remove Cart");
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] != 0) {
    userData.cartData[req.body.itemId] -= 1;
  }
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Removed");
});

// Create an endpoint for getting cartdata of user
app.post("/getcart", fetchuser, async (req, res) => {
  console.log("Get Cart");
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});

// Create an endpoint for adding products using admin panel
// app.post("/addproduct", async (req, res) => {
//   let products = await Product.find({});
//   //let id;
//   // if (products.length > 0) {
//   //   let last_product_array = products.slice(-1);
//   //   let last_product = last_product_array[0];
//   //   id = last_product.id + 1;
//   // } else {
//   //   id = 1;
//   // }
//   const product = new Product({
//     // id: id,
//     name: req.body.name,
//     description: req.body.description,
//     image: req.body.image,
//     category: req.body.category,
//     type: req.body.type,
//     new_price: req.body.new_price,
//     old_price: req.body.old_price,

//   });
//   console.log("Product Added", product);
//   await product.save();
//   console.log("Saved");
//   console.log(product, req.body);
//   res.json({ success: true, name: req.body.name });
// });

app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({ success: true, name: req.body.name });
});

const Review = mongoose.model("Review", {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
  shippingDetails: {
    name: String,
    email: String,
    address: String,
    phone: String,
  },
  totalAmount: Number,
  promoCodeUsed: String,
  discountAmount: Number,
  date: { type: Date, default: Date.now },
});

const Category = mongoose.model("Category", {
  name: { type: String, required: true },
  subcategories: [{ type: String }],
});

const PromoCode = mongoose.model("PromoCode", {
  code: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  validUntil: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});

const Product = mongoose.model("Product", {
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String },
  type: { type: String },
  new_price: { type: Number },
  old_price: { type: Number },
  inventoryCount: { type: Number, default: 0 },
  quantity: { type: Number, default: 0 },
  productSize: [{ type: String }],
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-email-password",
  },
});

app.post("/addreview", fetchuser, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const order = await Order.findOne({
      userId: req.user.id,
      "products.productId": productId,
    });

    if (!order) {
      return res
        .status(403)
        .json({ error: "You must purchase this product to review it" });
    }

    const review = new Review({
      userId: req.user.id,
      productId,
      rating,
      comment,
    });

    await review.save();
    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/placeorder", fetchuser, async (req, res) => {
  try {
    const { products, shippingDetails, promoCode } = req.body;

    let totalAmount = 0;
    let discountAmount = 0;

    for (let item of products) {
      console.log("item", item.productId);
      // const productId = new mongoose.Types.ObjectId(item.productId);
      const product = await Product.findById(item.productId);

      if (!product || product.inventoryCount < item.quantity) {
        return res
          .status(400)
          .json({ error: `Insufficient inventory for ${product.name}` });
      }
      totalAmount += product.new_price * item.quantity;
      console.log(`Actual Amount ${totalAmount}`);
    }

    if (promoCode) {
      const validPromo = await PromoCode.findOne({
        code: promoCode,
        isActive: true,
        validUntil: { $gt: new Date() },
      });

      if (validPromo) {
        discountAmount = (totalAmount * validPromo.discountPercentage) / 100;
        totalAmount -= discountAmount;
      }
    }
    console.log("promo code amount " + totalAmount);

    const order = new Order({
      userId: req.user.id,
      products,
      shippingDetails,
      totalAmount,
      promoCodeUsed: promoCode,
      discountAmount,
    });

    await order.save();
    console.log("Order Placed", order);

    for (let item of products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { inventoryCount: -item.quantity },
      });
    }

    const mailOptions = {
      from: "your-email@gmail.com",
      to: "ahsank0811@gmail.com",
      subject: "New Order Placed",
      text: `
        New order details:
        Customer: ${shippingDetails.name}
        Email: ${shippingDetails.email}
        Address: ${shippingDetails.address}
        Phone: ${shippingDetails.phone}
        Total Amount: ${totalAmount}
      `,
    };

    transporter.sendMail(mailOptions);

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/addcategory", async (req, res) => {
  try {
    // console.log("user", req.user);
    // const user = await Users.findById(req.user.id);
    // if (!user.isAdmin) {
    //   return res
    //     .status(403)
    //     .json({ error: "You are not authorized to perform this action" });
    // }
    const { name, subcategories } = req.body;
    const category = new Category({ name, subcategories });
    await category.save();
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    console.log("Fetching Categories");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/addpromocode", async (req, res) => {
  try {
    const { code, discountPercentage, validUntil } = req.body;
    const promoCode = new PromoCode({
      code,
      discountPercentage,
      validUntil: new Date(validUntil),
    });
    await promoCode.save();
    console.log("Promo Code Added", promoCode);
    res.json({ success: true, promoCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//api to get all active promocodes
app.get("/activepromocodes", async (req, res) => {
  try {
    const promoCodes = await PromoCode.find({
      isActive: true,
      validUntil: { $gt: new Date() },
    });
    res.json(promoCodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//api to delete promocode that gets the id from request
app.post("/disablepromocode", async (req, res) => {
  try {
    await PromoCode.findByIdAndUpdate(req.body.id, { isActive: false });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/addproduct", async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      category: req.body.category,
      subcategory: req.body.subcategory,
      type: req.body.type,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
      inventoryCount: req.body.inventoryCount || 0,
      quantity: req.body.quantity || 0,
      productSize: req.body.productSize || [],
    });

    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const BannerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Banner = mongoose.model("Banner", BannerSchema);

// Create a new banner
app.post("/banners", async (req, res) => {
  try {
    const banner = new Banner(req.body);
    await banner.save();
    res.json({ success: true, banner });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all banners
app.get("/all/banners", async (req, res) => {
  try {
    const banners = await Banner.find();
    console.log("Fetching Banners");

    res.json({
      message: "success",
      data: banners,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a banner by ID
app.get("/banners/:id", async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a banner by ID
app.put("/banners/:id", async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a banner by ID
app.delete("/banners/:id", async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.json({ message: "Banner deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, (error) => {
  if (!error) console.log("Server Running on port " + port);
  else console.log("Error : ", error);
});
