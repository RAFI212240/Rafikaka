const axios = require('axios');

module.exports = {
  config: {
    name: "animelogo",
    aliases: ["alogo", "anilogo"],
    version: "2.0",
    author: "Your Name",
    countDown: 8,
    role: 0,
    shortDescription: "Create anime style logo",
    longDescription: "Generate anime logo with multiple styles",
    category: "Image",
    guide: {
      en: "{pn} <text> [style] | {pn} list | {pn} random <text>"
    }
  },

  onStart: async function ({ message, args, api, event }) {
    // Show help if no arguments
    if (args.length === 0) {
      return message.reply(
        "🎨 **ANIME LOGO GENERATOR**\n\n" +
        "📝 **Commands:**\n" +
        "• animelogo <text> [style] - Create logo\n" +
        "• animelogo list - Show all styles\n" +
        "• animelogo random <text> - Random style\n\n" +
        "🎯 **Examples:**\n" +
        "• animelogo NARUTO 5\n" +
        "• animelogo ONE PIECE\n" +
        "• animelogo random SASUKE\n\n" +
        "🔢 **Styles:** 1-10 available"
      );
    }

    // Show style list
    if (args[0]?.toLowerCase() === 'list') {
      return message.reply(
        "🎨 **Available Anime Logo Styles:**\n\n" +
        "1️⃣ Classic Fire Style\n" +
        "2️⃣ Electric Blue\n" +
        "3️⃣ Dark Shadow\n" +
        "4️⃣ Golden Light\n" +
        "5️⃣ Purple Magic\n" +
        "6️⃣ Green Nature\n" +
        "7️⃣ Ice Crystal\n" +
        "8️⃣ Blood Red\n" +
        "9️⃣ Ocean Wave\n" +
        "🔟 Rainbow Burst\n\n" +
        "💡 Usage: animelogo <text> <style_number>"
      );
    }

    // Handle random style
    let text, styleNumber;
    if (args[0]?.toLowerCase() === 'random') {
      text = args.slice(1).join(' ');
      styleNumber = Math.floor(Math.random() * 10) + 1;
    } else {
      text = args[0];
      styleNumber = args[1] || Math.floor(Math.random() * 10) + 1;
    }

    if (!text) {
      return message.reply("❌ Please provide text for the logo!\n📝 Example: animelogo NARUTO 5");
    }

    // Validate inputs
    if (text.length > 15) {
      return message.reply("❌ Text too long! Maximum 15 characters allowed.");
    }

    if (isNaN(styleNumber) || styleNumber < 1 || styleNumber > 10) {
      styleNumber = Math.floor(Math.random() * 10) + 1;
    }

    const processingMsg = await message.reply(
      `🎨 **Creating Anime Logo**\n\n` +
      `📝 Text: ${text.toUpperCase()}\n` +
      `🎯 Style: ${styleNumber}\n` +
      `⏳ Processing... Please wait!`
    );

    try {
      const apiUrl = `https://nexalo-api.vercel.app/api/anime-logo-generator?text=${encodeURIComponent(text.toUpperCase())}&number=${styleNumber}`;
      
      console.log("API Call:", apiUrl); // For debugging
      
      const response = await axios.get(apiUrl, {
        timeout: 45000, // 45 seconds
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Bot/1.0)'
        }
      });

      const data = response.data;

      if (!data.status) {
        throw new Error(data.message || "API returned false status");
      }

      // Success response
      api.unsendMessage(processingMsg.messageID);

      const styleNames = {
        1: "🔥 Fire Style", 2: "⚡ Electric", 3: "🌑 Dark Shadow", 
        4: "✨ Golden Light", 5: "🔮 Purple Magic", 6: "🌿 Nature",
        7: "❄️ Ice Crystal", 8: "🩸 Blood Red", 9: "🌊 Ocean Wave", 10: "🌈 Rainbow"
      };

      return message.reply({
        body: `✅ **Anime Logo Created!**\n\n` +
              `📝 Text: ${text.toUpperCase()}\n` +
              `🎨 Style: ${styleNames[styleNumber] || styleNumber}\n` +
              `👨‍💻 Created by: ${data.operator}\n` +
              `🔗 URL: ${data.url}\n\n` +
              `💡 Try "animelogo list" for all styles!`,
        attachment: await global.utils.getStreamFromURL(data.url)
      });

    } catch (error) {
      console.error("Anime Logo Error:", error);
      
      api.unsendMessage(processingMsg.messageID);
      
      let errorMsg = "❌ **Logo Creation Failed!**\n\n";
      
      if (error.code === 'ECONNABORTED') {
        errorMsg += "⏰ Timeout: API is taking too long\n🔄 Please try again";
      } else if (error.response?.status === 429) {
        errorMsg += "🚫 Rate limited: Too many requests\n⏳ Wait a moment and try again";
      } else if (error.response?.status >= 500) {
        errorMsg += "🛠️ Server error: API is down\n🔄 Try again later";
      } else {
        errorMsg += `📝 Error: ${error.message}\n🔄 Please try again`;
      }
      
      return message.reply(errorMsg);
    }
  }
};
