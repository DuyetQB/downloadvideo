const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");
const axios = require("axios").default;
const download = async (req, res) => {
  try {
    const url = req.query.url;
    console.log("url,", url);

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
};
// const get = (req, res) => {
//   const url = req.query.url;
//   return res.status(200).json({ url });
// };
module.exports = {
  download,
};
