const ytdl = require("ytdl-core");

const download = async (req, res, next) => {
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
};
module.exports = {
  download,
};
