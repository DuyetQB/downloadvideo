const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require("cors");
const logger = require("morgan");
const Router = require("./Route/index.js");
const ytdl = require("ytdl-core");

app.use(cors());

var corsOptions = {
  origin: "https://downloadvideo.vercel.app/",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
//middleware
app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/download", cors(corsOptions), async (req, res, next) => {
  var url = req.query.url;
  console.log("url", url);
  if (!ytdl.validateURL(url)) {
    return res.sendStatus(400);
  } else {
    const title = "video";

    await ytdl.getBasicInfo(
      url,
      {
        format: "mp4",
      },
      (err, info) => {
        title = info.player_response.videoDetails.title.replace(
          /[^\x00-\x7F]/g,
          ""
        );
      }
    );

    res.header("Content-Disposition", `attachment; filename="${title}.mp4"`);

    ytdl(url, {
      format: "mp4",
    }).pipe(res);
  }
});

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
