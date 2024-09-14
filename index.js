const express = require("express");
const app = express();
const cors = require("cors");
const authRoute = require("./route/auth");
const forgotPasswordRoute = require("./route/forgotPassword");
const serviceRoute = require("./route/service");
const menuRoute = require("./route/menu");
const outletRoute = require("./route/outlet");
const customerRoute = require("./route/customer");
const viewerRoute = require("./route/viewer");
const incomeRoute = require("./route/income");
const productRoute = require("./route/product");
require("./config/database");
const port = process.env.PORT;
require("dotenv").config();
const fileUpload = require("express-fileupload");

app.use(cors());

app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(fileUpload());

app.use("/", forgotPasswordRoute);

app.use("/", authRoute);

app.use("/", serviceRoute);

app.use("/", menuRoute);

app.use("/", outletRoute);

app.use("/", customerRoute);

app.use("/", viewerRoute);

app.use("/", incomeRoute);

app.use("/", productRoute);

app.listen(port, () => {
  console.log("server is running");
});
