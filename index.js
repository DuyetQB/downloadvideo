const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require("cors");
const logger = require("morgan");
const Router = require("./Route/index.js");
const ytdl = require("ytdl-core");

var corsOptions = {
  origin: PORT,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
// cors(corsOptions),
app.use(cors());
//middleware
app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.use("/download", cors(corsOptions), Router);

// 404

// app.use(function (req, res, next) {
//   const err = new Error("not found");
//   err.status = 404;
//   next(err);
// });

// erorr handle function
// app.use((err, req, res, next) => {
//   const error = app.get("env") === "development" ? err : {};
//   const status = err.status || 500;
//   return res.status(status).json({ error });
// });

app.listen(PORT, () => {
  console.log(`the server is listening on port ${PORT}`);
});
