const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require("cors");
const logger = require("morgan");
const Router = require("./Route/index.js");
const ytdl = require("ytdl-core");

// var corsOptions = {
//   origin: PORT,
//   optionsSuccessStatus: 200,
// };

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//middleware
app.use(logger("dev"));

app.use(express.static("public"));

// cors(corsOptions),
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "public/index.html");
});

app.get("/getInfor", async (req, res) => {
  const url = req.query.url;
  const infor = await ytdl.getInfo(url);

  res.status(200).json(infor);
});
app.use("/download", async (req, res) => {
  try {
    const url = req.query.url;

    if (!ytdl.validateURL(url)) {
      return res.sendStatus(400);
    } else {
      const title = "video";

      await ytdl.getInfo(
        url,
        {
          format: "mp4",
        },
        (err, info) => {
          console.log("infor", info.player_response.videoDetails);
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
