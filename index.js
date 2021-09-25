const express = require("express");
const app = express();
const PORT = process.env.PORT;
const cors = require("cors");
const logger = require("morgan");
const Router = require("./Route/index.js");
const ytdl = require("ytdl-core");

var corsOptions = {
  origin: "https://downloadvideo.vercel.app",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors());
//middleware
app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/download", cors(corsOptions), async (req, res) => {
  try {
    var url = req.query.url;

    if (!ytdl.validateURL(url)) {
      return res.sendStatus(400);
    }
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

    return ytdl(url, {
      format: "mp4",
    }).pipe(res);
  } catch (error) {
    console.log(error);
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
