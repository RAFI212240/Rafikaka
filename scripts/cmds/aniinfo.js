const axios = require("axios");

module.exports = {
  config: {
    name: "animeinfo",
    version: "3.0",
    author: "OpenAI",
    countDown: 10,
    role: 0,
    shortDescription: "Anime info + auto video",
    longDescription: "Get full info of any anime by name, plus an auto-fetched YouTube video!",
    category: "anime",
    guide: "{pn} <anime name>",
  },

  onStart: async function ({ message, args }) {
    if (!args[0]) return message.reply("❌ Please provide an anime name!\nExample: animeinfo naruto");

    const animeName = args.join(" ");
    const loading = await message.reply("🔎 Searching for anime info & video...");

    try {
      // 1. Get anime info from Jikan API
      const res = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(animeName)}&limit=1`);
      if (!res.data.data.length) return message.reply("❌ No anime found with that name!");

      const anime = res.data.data[0];
      const info = `🌸 𝘼𝙉𝙄𝙈𝙀 𝙄𝙉𝙁𝙊 🌸
━━━━━━━━━━━━━━
🎬 Name: ${anime.title}
🈶 Japanese: ${anime.title_japanese}
📅 Aired: ${anime.aired.string}
📺 Type: ${anime.type}
🔢 Episodes: ${anime.episodes}
⭐ Score: ${anime.score}
🔞 Rating: ${anime.rating}
📊 Status: ${anime.status}
🔗 [MyAnimeList](${anime.url})
━━━━━━━━━━━━━━
📝 Synopsis: ${anime.synopsis?.slice(0, 400) || "N/A"}...`;

      // 2. Search YouTube for anime edit/AMV/trailer
      // Using pipedapi (no API key needed)
      const yt = await axios.get(`https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(anime.title + " anime edit")}&filter=videos`);
      const videos = yt.data.items;
      if (!videos.length) return message.reply(info + "\n\n❌ No video found!");

      // Get the first video
      const video = videos[0];
      const videoUrl = `https://youtube.com/watch?v=${video.id}`;
      const videoTitle = video.title;

      // Send info + video link (direct download not possible without yt-dlp, but link works)
      await message.reply({
        body: info + `\n\n🎬 [${videoTitle}](${videoUrl})\n\n🔗 Watch: ${videoUrl}`,
        // If you want to try to send as attachment, you need to use a YouTube downloader API (not recommended for copyright)
      });

      setTimeout(() => message.unsend(loading.messageID), 3000);
    } catch (e) {
      message.reply("❌ Error fetching anime info or video. Try again later.");
    }
  }
};
