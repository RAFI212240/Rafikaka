const axios = require("axios");

module.exports = {
  config: {
    name: "animeinfo",
    version: "2.0",
    author: "OpenAI",
    countDown: 10,
    role: 0,
    shortDescription: "Anime info with 4K photo",
    longDescription: "Get full anime details with high quality photo",
    category: "anime",
    guide: "{pn} <anime name>",
  },

  onStart: async function ({ api, event, message, args }) {
    if (!args.length) {
      return message.reply("❌ Please provide an anime name!\nExample: /animeinfo Naruto");
    }

    const animeName = args.join(" ");
    const loading = await message.reply("🔎 Searching for anime info and photo...");

    try {
      // Jikan API থেকে anime details
      const animeRes = await axios.get(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(animeName)}&limit=1`
      );

      if (!animeRes.data.data.length) {
        return message.reply("❌ No anime found with that name!");
      }

      const anime = animeRes.data.data[0];

      // Anime info text
      const info = `🌸 𝘼𝙉𝙄𝙈𝙀 𝙄𝙉𝙁𝙊 🌸
━━━━━━━━━━━━━━━━━━━━━━
🎬 Title: ${anime.title}
🈶 Japanese: ${anime.title_japanese || "N/A"}
📅 Aired: ${anime.aired?.string || "N/A"}
📺 Type: ${anime.type}
🔢 Episodes: ${anime.episodes || "Unknown"}
⭐ Score: ${anime.score || "N/A"}
🔞 Rating: ${anime.rating || "N/A"}
📊 Status: ${anime.status}
🏆 Rank: #${anime.rank || "N/A"}
👥 Members: ${anime.members?.toLocaleString() || "N/A"}
🔗 MyAnimeList: ${anime.url}
━━━━━━━━━━━━━━━━━━━━━━
📝 Synopsis: ${anime.synopsis?.slice(0, 300) || "No synopsis available"}...`;

      // High quality image থেকে anime photo
      let imageUrl = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;

      // যদি MAL থেকে ভালো image না পাওয়া যায়, তাহলে alternative search
      if (!imageUrl) {
        try {
          const searchRes = await axios.get(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(anime.title + " anime")}&client_id=YOUR_UNSPLASH_ACCESS_KEY&per_page=1`
          );
          if (searchRes.data.results.length > 0) {
            imageUrl = searchRes.data.results[0].urls.full;
          }
        } catch (e) {
          // Fallback to MAL image
          imageUrl = anime.images?.jpg?.image_url;
        }
      }

      await message.reply({
        body: info,
        attachment: await global.utils.getStreamFromURL(imageUrl)
      });

    } catch (error) {
      console.error(error);
      await message.reply("❌ Error fetching anime info. Please try again later!");
    }

    setTimeout(() => api.unsendMessage(loading.messageID), 3000);
  }
};
