require("dotenv").config();

const https = require("https");
const fs = require("fs");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const userRoute = require("./routes/user.js");
const productRoute = require("./routes/product.js");
const cartRoute = require("./routes/cart.js");

const mongoUtil = require("./database/conection");

const app = express();
let origin =
  process.env.NODE_ENV === "dev"
    ? "https://localhost:3000"
    : "https://frontend-tcc.vercel.app";
app.use(
  cors({
    credentials: true,
    origin: origin,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  res.send("Servidor Backend");
});

// SSL
const privateKey = fs.readFileSync("cert/selfsigned.key", "utf8");
const certificate = fs.readFileSync("cert/selfsigned.crt", "utf8");
const credentials = { key: privateKey, cert: certificate };

mongoUtil.connectToServer(function (err, client) {
  if (err) console.log(err);
  // start the rest of your app here
  app.use(userRoute);
  app.use(productRoute);
  app.use(cartRoute);

  if (process.env.NODE_ENV === "dev") {
    https.createServer(credentials, app).listen(process.env.PORT || 3333);
  } else {
    app.listen(process.env.PORT || 3333);
  }
});

console.log(`Server at: ${process.env.PORT}`);
