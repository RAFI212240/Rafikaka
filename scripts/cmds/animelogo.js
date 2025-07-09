const axios = require('axios');

module.exports = {
  config: {
    name: "animelogo",
    aliases: ["alogo", "anilogo"],
    version: "1.0",
    author: "GoatBot Admin",
    countDown: 8,
    role: 0,
    shortDescription: "Create anime style logo",
    longDescription: "Generate anime logo with multiple styles using Nexalo API",
    category: "image",
    guide: {
      en: "{pn} <text> [style] | {pn} list | {pn} random <text>"
    }
  },

  onStart: async function ({ message, args, api, event, usersData, threadsData, commandName, getLang }) {
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
        "🔢 **Styles:** 1-10 available\n" +
        "⏱️ **Cooldown:** 8 seconds"
      );
    }

    // Show style list
    if (args[0]?.toLowerCase() === 'list') {
      return message.reply(
        "🎨 **Available Anime Logo Styles:**\n\n" +
        "1️⃣ **Classic Fire Style** - Blazing flames\n" +
        "2️⃣ **Electric Blue** - Lightning effects\n" +
        "3️⃣ **Dark Shadow** - Mysterious theme\n" +
        "4️⃣ **Golden Light** - Bright golden glow\n" +
        "5️⃣ **Purple Magic** - Mystical energy\n" +
        "6️⃣ **Green Nature** - Forest themed\n" +
        "7️⃣ **Ice Crystal** - Frozen effects\n" +
        "8️⃣ **Blood Red** - Intense red theme\n" +
        "9️⃣ **Ocean Wave** - Water themed\n" +
        "🔟 **Rainbow Burst** - Colorful explosion\n\n" +
        "💡 **Usage:** animelogo <text> <style_number>\n" +
        "🎲 **Random:** animelogo random <text>"
      );
    }

    // Handle random style
    let text, styleNumber;
    if (args[0]?.toLowerCase() === 'random') {
      text = args.slice(1).join(' ');
      styleNumber = Math.floor(Math.random() * 10) + 1;
      
      if (!text) {
        return message.reply(
          "❌ Please provide text for random logo!\n" +
          "📝 **Example:** animelogo random NARUTO\n" +
          "🎲 **Random style will be selected automatically**"
        );
      }
    } else {
      text = args[0];
      styleNumber = parseInt(args[1]) || Math.floor(Math.random() * 10) + 1;
    }

    if (!text) {
      return message.reply(
        "❌ Please provide text for the logo!\n\n" +
        "📝 **Examples:**\n" +
        "• animelogo NARUTO 5\n" +
        "• animelogo SASUKE (random style)\n" +
        "• animelogo random LUFFY"
      );
    }

    // Enhanced input validation
    if (text.length > 20) {
      return message.reply(
        "❌ **Text too long!**\n" +
        `📏 Current: ${text.length} characters\n` +
        "📐 Maximum: 20 characters\n" +
        "💡 Try shorter text"
      );
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(text)) {
      return message.reply(
        "❌ **Invalid characters!**\n" +
        "✅ Allowed: Letters, numbers, spaces\n" +
        "❌ Special symbols not supported"
      );
    }

    // Validate and fix style number
    if (isNaN(styleNumber) || styleNumber < 1 || styleNumber > 10) {
      styleNumber = Math.floor(Math.random() * 10) + 1;
    }

    // Get user data for personalization
    let userName = "User";
    try {
      const userData = await usersData.get(event.senderID);
      userName = userData.name || "User";
    } catch (error) {
      console.log("Could not get user data");
    }

    const processingMsg = await message.reply(
      `🎨 **Creating Anime Logo for ${userName}**\n\n` +
      `📝 **Text:** ${text.toUpperCase()}\n` +
      `🎯 **Style:** ${styleNumber}${args[0]?.toLowerCase() === 'random' ? ' (Random)' : ''}\n` +
      `⚡ **Status:** Generating...\n` +
      `⏳ **Please wait 10-15 seconds...**`
    );

    try {
      // API call with GoatBot V2 compatible error handling
      const apiUrl = `https://nexalo-api.vercel.app/api/anime-logo-generator?text=${encodeURIComponent(text.toUpperCase())}&number=${styleNumber}`;
      
      const response = await axios.get(apiUrl, {
        timeout: 30000, // 30 seconds timeout
        headers: {
          'User-Agent': 'GoatBot-V2-AnimeLogoGenerator/1.0',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      const data = response.data;

      // Validate API response
      if (!data || typeof data !== 'object') {
        throw new Error("Invalid API response format");
      }

      if (!data.status) {
        throw new Error(data.message || "API returned false status");
      }

      if (!data.url || !data.url.startsWith('http')) {
        throw new Error("Invalid image URL received");
      }

      // Delete processing message
      api.unsendMessage(processingMsg.messageID);

      // Enhanced style names with emojis
      const styleNames = {
        1: "🔥 Classic Fire", 2: "⚡ Electric Blue", 3: "🌑 Dark Shadow", 
        4: "✨ Golden Light", 5: "🔮 Purple Magic", 6: "🌿 Green Nature",
        7: "❄️ Ice Crystal", 8: "🩸 Blood Red", 9: "🌊 Ocean Wave", 10: "🌈 Rainbow Burst"
      };

      const successText = 
        `✅ **Anime Logo Created Successfully!**\n\n` +
        `👤 **For:** ${userName}\n` +
        `📝 **Text:** ${text.toUpperCase()}\n` +
        `🎨 **Style:** ${styleNames[styleNumber] || `Style ${styleNumber}`}\n` +
        `👨‍💻 **API by:** ${data.operator || 'Nexalo'}\n` +
        `🔗 **URL:** ${data.url}\n\n` +
        `💡 **Tips:**\n` +
        `• Try "animelogo list" for all styles\n` +
        `• Use "animelogo random <text>" for surprise\n` +
        `• Share with friends! 🎉`;

      // Send response with image attachment using GoatBot V2 method
      return message.reply({
        body: successText,
        attachment: await global.utils.getStreamFromURL(data.url)
      });

    } catch (error) {
      console.error("Anime Logo Generation Error:", error);
      
      // Always clean up processing message
      try {
        api.unsendMessage(processingMsg.messageID);
      } catch (cleanupError) {
        console.error("Failed to cleanup processing message:", cleanupError);
      }
      
      // Enhanced error messages
      let errorMsg = "❌ **Logo Creation Failed!**\n\n";
      
      if (error.code === 'ECONNABORTED') {
        errorMsg += "⏰ **Timeout Error**\n" +
                   "The API took too long to respond (>30s)\n" +
                   "🔄 **Solution:** Try again with shorter text";
      } else if (error.response?.status === 429) {
        errorMsg += "🚫 **Rate Limit Exceeded**\n" +
                   "Too many requests in a short time\n" +
                   "⏳ **Solution:** Wait 1 minute and try again";
      } else if (error.response?.status >= 500) {
        errorMsg += "🛠️ **Server Error**\n" +
                   "The logo generation service is temporarily down\n" +
                   "🔄 **Solution:** Try again in 5-10 minutes";
      } else if (error.response?.status === 404) {
        errorMsg += "❓ **Service Not Found**\n" +
                   "The API endpoint is not available\n" +
                   "📞 **Contact:** Bot administrator";
      } else if (error.message.includes('Invalid')) {
        errorMsg += "📝 **Invalid Response**\n" +
                   "Received unexpected data from API\n" +
                   "🔄 **Solution:** Try different text or style";
      } else {
        errorMsg += `📝 **Unknown Error**\n` +
                   `${error.message || 'Something went wrong'}\n` +
                   "🔄 **Solution:** Try again later";
      }
      
      // Add helpful suggestions
      errorMsg += `\n\n💡 **Quick Fix:**\n` +
                 `• Try: animelogo ${text} ${Math.floor(Math.random() * 10) + 1}\n` +
                 `• Or: animelogo random ${text}`;
      
      return message.reply(errorMsg);
    }
  }
};
