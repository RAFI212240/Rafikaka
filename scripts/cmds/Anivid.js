const axios = require('axios');

async function getStreamFromURL(url) {
  const response = await axios.get(url, { responseType: 'stream' });
  return response.data;
}

async function fetchRandomAnimeVideos() {
  try {
    // Random anime search terms
    const searchTerms = [
      "anime edit", "anime amv", "anime compilation", "best anime moments",
      "anime fight scenes", "anime emotional moments", "anime opening",
      "anime music video", "anime tribute", "anime mashup"
    ];
    
    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    
    const response = await axios.get(`https://lyric-search-neon.vercel.app/kshitiz?keyword=${encodeURIComponent(randomTerm)}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = {
  config: {
    name: "anivid",
    version: "5.0",
    author: "OpenAI",
    countDown: 20,
    role: 0,
    shortDescription: "Get random anime video",
    longDescription: "Get random anime video using API (no anime name allowed)",
    category: "anime",
    guide: "{pn} (no arguments allowed)",
  },

  onStart: async function ({ api, event, message, args }) {
    // Check if user provided any arguments
    if (args.length > 0) {
      return message.reply("❌ This command doesn't accept any anime names!\nJust use: /anivid\n\nFor specific anime search, use: /anisearch <anime name>");
    }

    api.setMessageReaction("✨", event.messageID, (err) => {}, true);
    
    const loading = await message.reply("🌸 Loading random anime video... Please wait! ✨");

    try {
      const videos = await fetchRandomAnimeVideos();

      if (!videos || videos.length === 0) {
        return message.reply("❌ No anime videos found. Please try again!");
      }

      const selectedVideo = videos[Math.floor(Math.random() * videos.length)];
      const videoUrl = selectedVideo.videoUrl;

      if (!videoUrl) {
        return message.reply('❌ Error: Video not found. Please try again!');
      }

      const videoStream = await getStreamFromURL(videoUrl);

      await message.reply({
        body: `✨ 𝗥𝗔𝗡𝗗𝗢𝗠 𝗔𝗡𝗜𝗠𝗘 𝗩𝗜𝗗𝗘𝗢 ✨
━━━━━━━━━━━━━━━━━━
🎬 Random Anime Content
🎵 Surprise Video
🔥 High Quality
🌸 API Powered
━━━━━━━━━━━━━━━━━━
Enjoy your random anime video! 🌸`,
        attachment: videoStream,
      });

      api.setMessageReaction("✅", event.messageID, (err) => {}, true);

    } catch (error) {
      console.error(error);
      await message.reply("❌ An error occurred while loading video.\nPlease try again later!");
    }

    setTimeout(() => api.unsendMessage(loading.messageID), 5000);
  }
};
