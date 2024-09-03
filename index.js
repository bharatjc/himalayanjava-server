const express = require("express");
const app = express();
const cors = require("cors");
const authRoute = require("./route/auth");
const forgotPasswordRoute = require("./route/forgotPassword");
require("./config/database");
const port = process.env.PORT;
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/", forgotPasswordRoute);

app.use("/api", authRoute);

app.listen(port, () => {
  console.log("server is running");
});
