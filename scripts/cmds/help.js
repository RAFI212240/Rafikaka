const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "2.0",
    author: "OpenAI ⚡",
    countDown: 5,
    role: 0,
    shortDescription: "Anime style help menu for GoatBot v2",
    longDescription: "Beautiful anime-themed help command with interactive features",
    category: "info",
    guide: "{pn} | {pn} [category] | {pn} [command] | {pn} search [keyword]"
  },

  onStart: async function ({ message, args, event, role, api }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);
    const categories = {};

    // Collect commands by category
    for (const [name, value] of commands) {
      if (!value?.config || typeof value.onStart !== "function") continue;
      if (value.config.role > 1 && role < value.config.role) continue;

      const category = value.config.category?.toLowerCase() || "uncategorized";
      if (!categories[category]) categories[category] = [];
      categories[category].push(name);
    }

    // Anime banners
    const animeBanners = [
      "https://files.catbox.moe/d6brz0.png",
      "https://i.imgur.com/anime1.jpg",
      "https://i.imgur.com/anime2.jpg"
    ];
    const banner = animeBanners[Math.floor(Math.random() * animeBanners.length)];

    const rawInput = args.join(" ").trim();

    // 🌸 1. Main Help Menu
    if (!rawInput) {
      let msg = `╭─────⊰ 🌸 𝘼𝙉𝙄𝙈𝙀 𝘽𝙊𝙏 𝙃𝙀𝙇𝙋 🌸 ⊱─────╮\n`;
      msg += `│                                                                    │\n`;
      msg += `│  ✦ ──────────── ⋆⋅☆⋅⋆ ──────────── ✦  │\n`;
      msg += `│     🎌 Total Commands: ${commands.size}                     │\n`;
      msg += `│     🗂️ Categories: ${Object.keys(categories).length}                          │\n`;
      msg += `│     ⚡ Prefix: ${prefix}                                │\n`;
      msg += `│     👑 Owner: Ew'r Saim                        │\n`;
      msg += `│  ✦ ──────────── ⋆⋅☆⋅⋆ ──────────── ✦  │\n`;
      msg += `╰─────────────────────────────────────╯\n\n`;

      // Category display with anime emojis
      const categoryEmojis = {
        anime: "🎌", media: "🎬", fun: "🎮", utility: "🔧", 
        info: "📊", admin: "👑", economy: "💰", game: "🎯",
        music: "🎵", image: "🖼️", ai: "🤖", other: "⭐"
      };

      for (const category of Object.keys(categories).sort()) {
        const emoji = categoryEmojis[category] || "📁";
        const cmdCount = categories[category].length;
        
        msg += `┌─ ${emoji} 【${stylizeText(category.toUpperCase())}】 (${cmdCount})\n`;
        
        // Show first 4 commands per category
        const cmds = categories[category].sort();
        const displayCmds = cmds.slice(0, 4);
        
        for (const cmd of displayCmds) {
          msg += `├─ ◆ ${cmd}\n`;
        }
        
        if (cmds.length > 4) {
          msg += `├─ ◆ ... +${cmds.length - 4} more\n`;
        }
        
        msg += `└─────────────────────\n\n`;
      }

      msg += `╭─────⊰ 🎯 𝙌𝙐𝙄𝘾𝙆 𝘾𝙊𝙈𝙈𝘼𝙉𝘿𝙎 ⊱─────╮\n`;
      msg += `│ ${prefix}help [category] - View category\n`;
      msg += `│ ${prefix}help [command] - Command info\n`;
      msg += `│ ${prefix}help search [keyword] - Search\n`;
      msg += `╰─────────────────────────────────╯`;

      try {
        const sentMsg = await message.reply({
          body: msg,
          attachment: await global.utils.getStreamFromURL(banner)
        });
        
        // Auto delete after 3 minutes
        setTimeout(() => {
          api.unsendMessage(sentMsg.messageID);
        }, 180000);
      } catch (error) {
        await message.reply(msg);
      }
      return;
    }

    // 🔍 2. Search Function
    if (rawInput.startsWith("search ")) {
      const keyword = rawInput.slice(7).toLowerCase();
      if (!keyword) return message.reply("❌ Please provide a search keyword!");

      const matchedCommands = [];
      for (const [name, value] of commands) {
        if (name.includes(keyword) || 
            value.config?.shortDescription?.toLowerCase().includes(keyword) ||
            value.config?.category?.toLowerCase().includes(keyword)) {
          matchedCommands.push(name);
        }
      }

      if (matchedCommands.length === 0) {
        return message.reply(`❌ No commands found for "${keyword}"`);
      }

      let msg = `╭─────⊰ 🔍 𝙎𝙀𝘼𝙍𝘾𝙃 𝙍𝙀𝙎𝙐𝙇𝙏𝙎 ⊱─────╮\n`;
      msg += `│ Keyword: "${keyword}"\n`;
      msg += `│ Found: ${matchedCommands.length} commands\n`;
      msg += `╰─────────────────────────────────╯\n\n`;

      for (const cmd of matchedCommands.slice(0, 10)) {
        const cmdInfo = commands.get(cmd);
        msg += `◆ ${cmd} - ${cmdInfo.config?.shortDescription || "No description"}\n`;
      }

      if (matchedCommands.length > 10) {
        msg += `\n... and ${matchedCommands.length - 10} more results`;
      }

      const sentMsg = await message.reply(msg);
      setTimeout(() => api.unsendMessage(sentMsg.messageID), 120000);
      return;
    }

    // 📁 3. Category Help
    if (categories[rawInput.toLowerCase()]) {
      const categoryName = rawInput.toLowerCase();
      const cmds = categories[categoryName].sort();
      
      let msg = `╭─────⊰ 🎌 ${stylizeText(categoryName.toUpperCase())} 𝘾𝘼𝙏𝙀𝙂𝙊𝙍𝙔 ⊱─────╮\n`;
      msg += `│ Commands: ${cmds.length}\n`;
      msg += `│ Category: ${categoryName}\n`;
      msg += `╰─────────────────────────────────────╯\n\n`;

      // Display commands in pairs
      for (let i = 0; i < cmds.length; i += 2) {
        const cmd1 = cmds[i];
        const cmd2 = cmds[i + 1];
        
        if (cmd2) {
          msg += `◆ ${cmd1.padEnd(15)} ◆ ${cmd2}\n`;
        } else {
          msg += `◆ ${cmd1}\n`;
        }
      }

      msg += `\n💡 Use: ${prefix}help [command] for details`;

      try {
        const sentMsg = await message.reply({
          body: msg,
          attachment: await global.utils.getStreamFromURL(banner)
        });
        setTimeout(() => api.unsendMessage(sentMsg.messageID), 120000);
      } catch (error) {
        await message.reply(msg);
      }
      return;
    }

    // 🔧 4. Command Details
    const commandName = rawInput.toLowerCase();
    const command = commands.get(commandName) || commands.get(aliases.get(commandName));

    if (!command || !command?.config) {
      return message.reply(`❌ Command "${commandName}" not found!\n💡 Use ${prefix}help search ${commandName} to find similar commands`);
    }

    const config = command.config;
    const roleText = getRoleText(config.role);
    const author = config.author || "Unknown";
    const desc = config.longDescription || config.shortDescription || "No description";
    const guide = (config.guide || "No guide available").replace(/{pn}/g, `${prefix}${config.name}`);

    let msg = `╭─────⊰ ⚡ 𝘾𝙊𝙈𝙈𝘼𝙉𝘿 𝘿𝙀𝙏𝘼𝙄𝙇𝙎 ⊱─────╮\n`;
    msg += `│                                                                │\n`;
    msg += `│  🎯 Name: ${stylizeText(config.name.toUpperCase())}\n`;
    msg += `│  📝 Description: ${desc}\n`;
    msg += `│  👨‍💻 Author: ${author}\n`;
    msg += `│  🔢 Version: ${config.version || "1.0"}\n`;
    msg += `│  👑 Role: ${roleText}\n`;
    msg += `│  📂 Category: ${config.category || "uncategorized"}\n`;
    msg += `│  ⏱️ Cooldown: ${config.countDown || 0}s\n`;
    msg += `│                                                                │\n`;
    msg += `╰─────────────────────────────────────╯\n\n`;
    msg += `╭─────⊰ 📖 𝙐𝙎𝘼𝙂𝙀 𝙂𝙐𝙄𝘿𝙀 ⊱─────╮\n`;
    msg += `│ ${guide}\n`;
    msg += `╰─────────────────────────────────╯`;

    const sentMsg = await message.reply(msg);
    setTimeout(() => api.unsendMessage(sentMsg.messageID), 120000);
  }
};

// 🎨 Helper Functions
function stylizeText(text) {
  const map = {
    'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝘿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄',
    'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈', 'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍',
    'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
    'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞',
    'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢', 'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧',
    's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯'
  };
  return text.split('').map(c => map[c] || c).join('');
}

function getRoleText(role) {
  const roles = {
    0: "👥 Everyone",
    1: "👮‍♂️ Group Admin", 
    2: "🤖 Bot Admin",
    3: "👑 Bot Owner"
  };
  return roles[role] || "❓ Unknown";
}
