const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");
const axios = require("axios").default;
const download = async (req, res) => {
  // const fileName = path.basename(fileUrl);

  // The path of the downloaded file on our machine
  // const localFilePath = path.resolve(__dirname, downloadFolder, fileName);
  // try {
  //   const response = await axios({
  //     method: "GET",
  //     url: fileUrl,
  //     responseType: "stream",
  //   });

  //   const w = response.data.pipe(fs.createWriteStream(localFilePath));
  //   w.on("finish", () => {
  //     console.log("Successfully downloaded file!");
  //   });
  // } catch (err) {
  //   throw new Error(err);
  // }
  // const VIDEO_URL = req.query.url;
  // downloadFile(VIDEO_URL, "download");
  try {
    const url = req.query.url;
    console.log("url,", url);

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
  } catch (error) {
    console.log(error);
  }
};
const get = (req, res) => {
  const url = req.query.url;
  return res.status(200).json({ url });
};
module.exports = {
  download,
  get,
};
