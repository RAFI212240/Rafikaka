const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`
  );
  return base.data.api;
};

module.exports.config = {
  name: "song",
  version: "2.1.0",
  aliases: ["music", "play"],
  credits: "dipto",
  hasPermssion: 0,
  description: "Download audio from YouTube",
  commandCategory: "media",
  usages:
    "{pn} [<song name>|<song link>]\nExample:\n{pn} chipi chipi chapa chapa",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args, handleReply }) {
  const checkurl =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;

  if (!args.length)
    return api.sendMessage(
      "❌ Please enter a YouTube link or a song name to search.",
      event.threadID,
      event.messageID
    );

  let videoID;
  const urlYtb = checkurl.test(args[0]);

  if (urlYtb) {
    // If user sends a YouTube URL directly
    const match = args[0].match(checkurl);
    videoID = match ? match[1] : null;

    try {
      const { data } = await axios.get(
        `${await baseApiUrl()}/ytDl3?link=${videoID}&format=mp3`
      );

      const title = data.title;
      const downloadLink = data.downloadLink;

      const audioPath = path.resolve(__dirname, "audio.mp3");

      await downloadFile(downloadLink, audioPath);

      return api.sendMessage(
        {
          body: `🎵 Now playing: ${title}`,
          attachment: fs.createReadStream(audioPath),
        },
        event.threadID,
        () => fs.unlinkSync(audioPath),
        event.messageID
      );
    } catch (err) {
      return api.sendMessage(
        `❌ Error: ${err.message}`,
        event.threadID,
        event.messageID
      );
    }
  } else {
    // If user sends a search keyword
    let keyWord = args.join(" ");
    keyWord = keyWord.replace("?feature=share", "");

    try {
      const maxResults = 6;
      const { data } = await axios.get(
        `${await baseApiUrl()}/ytFullSearch?songName=${encodeURIComponent(
          keyWord
        )}`
      );

      const results = data.slice(0, maxResults);

      if (!results.length)
        return api.sendMessage(
          `⭕ No search results for: ${keyWord}`,
          event.threadID,
          event.messageID
        );

      let msg = "🔍 Search results:\n\n";
      const attachments = [];

      results.forEach((item, index) => {
        msg += `${index + 1}. ${item.title}\nTime: ${item.time}\nChannel: ${
          item.channel.name
        }\n\n`;
        attachments.push(
          axios
            .get(item.thumbnail, { responseType: "arraybuffer" })
            .then((res) => {
              const imagePath = path.resolve(
                __dirname,
                `thumb_${index}.jpg`
              );
              fs.writeFileSync(imagePath, Buffer.from(res.data));
              return fs.createReadStream(imagePath);
            })
        );
      });

      const resolvedAttachments = await Promise.all(attachments);

      return api.sendMessage(
        {
          body: msg + "Reply with the number of the song you want to listen to.",
          attachment: resolvedAttachments,
        },
        event.threadID,
        (err, info) => {
          if (err) return console.error(err);
          global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            results,
          });
        },
        event.messageID
      );
    } catch (err) {
      return api.sendMessage(
        `❌ An error occurred: ${err.message}`,
        event.threadID,
        event.messageID
      );
    }
  }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  try {
    const { results } = handleReply;
    const choice = parseInt(event.body);

    if (isNaN(choice) || choice < 1 || choice > results.length)
      return api.sendMessage(
        `❌ Invalid choice. Please enter a number between 1 and ${results.length}.`,
        event.threadID,
        event.messageID
      );

    const selected = results[choice - 1];
    const videoID =
                         
