const chalk = require('chalk');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "blue",
    aliases: ["blueimg", "ba"],
    version: "1.0",
    author: "Hridoy",
    countDown: 5,
    role: 0, // Set to 0 since we'll handle VIP and admin checks manually
    shortDescription: "Blue Archive images (VIP and Admins only)",
    longDescription: "Sends an image from the Blue Archive API (VIP and Admins only)",
    category: "media",
    guide: {
      en: "{pn} - Sends an image from Blue Archive API (VIP and Admins only)"
    }
  },

  onStart: async function ({ message, api, event, args, usersData, threadsData, commandName, getLang }) {
    const { threadID, messageID, senderID } = event;

    // Path to the vip.json file
    const vipFilePath = path.join(__dirname, '../../assets/vip.json');

    // Initialize vip.json if it doesn't exist
    let vipData = { vips: [] };
    if (!fs.existsSync(vipFilePath)) {
      // Create assets directory if it doesn't exist
      const assetsDir = path.dirname(vipFilePath);
      if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
      }
      fs.writeFileSync(vipFilePath, JSON.stringify(vipData, null, 2));
      console.log(chalk.green(`[Blue Command] Created vip.json file: ${vipFilePath}`));
    } else {
      // Read the existing vip.json file
      try {
        const fileContent = fs.readFileSync(vipFilePath, 'utf8');
        vipData = JSON.parse(fileContent);
      } catch (err) {
        console.log(chalk.red(`[Blue Error] Failed to parse vip.json: ${err.message}`));
        vipData = { vips: [] }; // Reset to default if parsing fails
      }
    }

    try {
      // Set "processing" reaction
      api.setMessageReaction("🕥", messageID, () => {}, true);

      // Check if the user is an admin or a VIP
      const config = global.GoatBot.config;
      const isAdmin = config.adminBot.includes(senderID) || config.vipUser?.includes(senderID);
      const isVip = vipData.vips.some(vip => vip.id === senderID);

      // If the user is neither an admin nor a VIP, deny access
      if (!isAdmin && !isVip) {
        api.setMessageReaction("❌", messageID, () => {}, true);
        console.log(chalk.cyan(`[Blue Command] Non-VIP/Non-admin tried to use command | SenderID: ${senderID} | ThreadID: ${threadID}`));
        
        return message.reply(
          "❌ **Access Denied**\n\n" +
          "🔒 This command is restricted to VIP members and admins only.\n" +
          "💎 Contact admin to get VIP access.\n\n" +
          "👑 **VIP Benefits:**\n" +
          "• Access to exclusive Blue Archive images\n" +
          "• High-quality content\n" +
          "• Priority bot features"
        );
      }

      // Get user data for personalization
      let userName = "User";
      try {
        const userData = await usersData.get(senderID);
        userName = userData.name || "User";
      } catch (error) {
        console.log("Could not get user data");
      }

      // Processing message
      const processingMsg = await message.reply(
        `💙 **Blue Archive VIP Access**\n\n` +
        `👑 **VIP User:** ${userName}\n` +
        `🎮 **Status:** Fetching exclusive content...\n` +
        `⏳ **Please wait...**`
      );

      // Fetch image from API
      const apiUrl = "https://nexalo-api.vercel.app/api/ba";
      console.log(chalk.blue(`[Blue Command] Fetching image from: ${apiUrl}`));

      const response = await axios.get(apiUrl, {
        timeout: 20000,
        headers: {
          'User-Agent': 'GoatBot-V2-BlueArchive-VIP/1.0',
          'Accept': 'application/json'
        }
      });

      const data = response.data;
      console.log(chalk.blue(`[Blue Command] API Response:`, JSON.stringify(data, null, 2)));

      // Validate response
      if (!data || !data.url) {
        throw new Error("Invalid API response - no image URL");
      }

      // Delete processing message
      api.unsendMessage(processingMsg.messageID);

      // Create response message
      let responseText = `💙 **Blue Archive VIP Content**\n\n`;
      responseText += `👑 **Exclusive for:** ${userName}\n`;
      
      if (data.character) {
        responseText += `👩‍🎓 **Character:** ${data.character}\n`;
      }
      if (data.school) {
        responseText += `🏫 **School:** ${data.school}\n`;
      }
      if (data.rarity) {
        responseText += `⭐ **Rarity:** ${data.rarity}\n`;
      }
      if (data.weapon) {
        responseText += `🔫 **Weapon:** ${data.weapon}\n`;
      }

      responseText += `\n🔗 **Source:** ${data.url}\n`;
      responseText += `💎 **VIP Status:** Active ✅\n\n`;
      responseText += `🎯 **Enjoy your exclusive Blue Archive content!**`;

      // Send image using GoatBot V2 method
      const attachment = await global.utils.getStreamFromURL(data.url);
      
      await message.reply({
        body: responseText,
        attachment: attachment
      });

      // Set success reaction
      api.setMessageReaction("✅", messageID, () => {}, true);
      
      console.log(chalk.green(`[Blue Command] Successfully sent VIP image | User: ${userName} | ThreadID: ${threadID}`));

    } catch (error) {
      console.error(chalk.red(`[Blue Error] ${error.message}`));
      
      // Set error reaction
      api.setMessageReaction("❌", messageID, () => {}, true);
      
      // Clean up processing message if exists
      try {
        if (processingMsg && processingMsg.messageID) {
          api.unsendMessage(processingMsg.messageID);
        }
      } catch (cleanupError) {
        console.log("Failed to cleanup processing message");
      }

      // Send error message
      let errorMsg = "❌ **Blue Archive VIP Error**\n\n";
      
      if (error.code === 'ECONNABORTED') {
        errorMsg += "⏰ **Timeout Error**\nAPI took too long to respond\n🔄 Please try again";
      } else if (error.response?.status >= 500) {
        errorMsg += "🛠️ **Server Error**\nBlue Archive API is temporarily down\n🔄 Try again in a few minutes";
      } else if (error.message.includes('Invalid API response')) {
        errorMsg += "📝 **API Error**\nReceived invalid response format\n🔧 Contact administrator";
      } else {
        errorMsg += `📝 **Error:** ${error.message}\n🔄 Please try again later`;
      }
      
      errorMsg += `\n\n💎 **VIP Support:** Contact admin for assistance`;
      
      return message.reply(errorMsg);
    }
  }
};
