const fs = require("fs-extra");
const path = require("path");
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "2.0",
    author: "Elohime",
    role: 0,
    shortDescription: {
      en: "View stylish command list"
    },
    longDescription: {
      en: "View all commands in a stylish format"
    },
    category: "info",
    guide: {
      en: "{pn} [empty | <category>]"
    }
  },

  onStart: async function ({ message, args, event, threadsData }) {
    try {
      const { threadID } = event;
      const prefix = global.GoatBot.config.prefix || "/";
      const categories = {};

      // Group commands by category
      for (const [name, cmd] of commands) {
        const category = cmd.config.category || "other";
        if (!categories[category]) categories[category] = [];
        categories[category].push(cmd.config.name);
      }

      // Build the stylish output
      let resultText = `🌸┌─────────────────┐🌸\n`;
      resultText += `   🌟│  𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐋𝐢𝐬𝐭   │🌟\n`;
      resultText += `   🌸└─────────────────┘🌸\n\n`;

      resultText += `   ✨ 𝓣𝓸𝓽𝓪𝓵 𝓒𝓸𝓶𝓶𝓪𝓷𝓭𝓼: ${commands.size}\n`;
      resultText += `   🦋 𝓟𝓻𝓮𝓯𝓲𝔁: [ ${prefix} ]\n`;
      resultText += `   📌 Type [ ${prefix}help <cmd> ] for details\n\n`;

      const categoryEmojis = {
        "anime": "🎌", "ai": "🤖", "admin": "👑", "fun": "🎮",
        "utility": "🔧", "info": "📊", "media": "🎬", "game": "🎯",
        "economy": "💰", "tools": "🛠️", "owner": "💎", "other": "⭐"
      };

      for (const [category, cmds] of Object.entries(categories)) {
        const emoji = categoryEmojis[category.toLowerCase()] || "📁";
        resultText += `🖤┌───【 ${category.toUpperCase()} 】───┐🦋\n`;
        resultText += `🎀 │ ${cmds.join("  ✧  ")}\n`;
        resultText += `🌷└─────────────────┘🌸\n\n`;
      }

      // Send the result
      await message.reply(resultText);

    } catch (error) {
      console.error("Help command error:", error);
      message.reply("❌ An error occurred while processing the help command.");
    }
  }
};
