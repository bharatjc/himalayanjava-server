const express = require("express");
const app = express();
const cors = require("cors");
const authRoute = require("./route/auth");
const forgotPasswordRoute = require("./route/forgotPassword");
const serviceRoute = require("./route/service");
const menuRoute = require("./route/menu");
require("./config/database");
const port = process.env.PORT;
require("dotenv").config();
const fileUpload = require("express-fileupload");

app.use(cors());

app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(fileUpload());

app.use("/", forgotPasswordRoute);

app.use("/api", authRoute);

app.use("/", serviceRoute);

app.use("/", menuRoute);

app.listen(port, () => {
  console.log("server is running");
});
