const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require("cors");
const logger = require("morgan");
const ytdl = require("ytdl-core");

const fbdl = require("fb-video-downloader");

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
      const infor = await ytdl.getInfo(url);
      const title =
        infor.videoDetails.author.id + infor.videoDetails.author.name;

      await ytdl.getInfo(
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
  } catch (error) {
    console.log(error);
  }
});

app.get("/getInforFb", async (req, res) => {
  const url = req.query.url;
  const infor = await fbdl.getInfo(url);
  // const convert = JSON.parse(infor.data);
  console.log("infor", infor);
  res.status(200).json(infor);
});

app.use("/downloadFb", async (req, res) => {
  try {
    const url = req.query.url;

    // const infor = await fbdl.getInfo(url);
    const title = "videofb";

    const data = await fbdl.getInfo(url);

    res.header("Content-Disposition", `attachment; filename="${title}.mp4"`);
    new fbdl(url);
    return res.json(data.download.hd);
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`the server is listening on port ${PORT}`);
});
