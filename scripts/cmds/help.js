const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "2.0",
    author: "Amit Max ⚡ + Modified by OpenAI",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Show all commands or command details" },
    longDescription: { en: "Get a stylish list of all commands, or details for a specific command/category." },
    category: "info",
    guide: { en: "{pn} | {pn} [category] | {pn} commandName" },
    priority: 1,
  },

  onStart: async function ({ message, args, event, role }) {
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

    // Random banner images
    const banners = [
      "https://files.catbox.moe/d6brz0.png",
      "https://i.imgur.com/6RLwKQk.png",
      "https://i.imgur.com/1Q9Z1Zm.png"
    ];
    const banner = banners[Math.floor(Math.random() * banners.length)];

    const rawInput = args.join(" ").trim();

    // 🌸 1. Full Help Menu
    if (!rawInput) {
      let msg = `🌸 𝙎𝘼𝙆𝙐𝙍𝘼 𝘽𝙊𝙏 𝙃𝙀𝙇𝙋 𝙈𝙀𝙉𝙐 🌸\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `🔹 Total Commands: ${commands.size}\n`;
      msg += `🔹 Categories: ${Object.keys(categories).length}\n`;
      msg += `🔹 Prefix: ${prefix}\n`;
      msg += `🔹 Owner: Ew'r Saim\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;

      for (const category of Object.keys(categories).sort()) {
        msg += `\n🌺 [${stylizeCaps(category)}] (${categories[category].length})\n`;
        msg += categories[category].sort().map(cmd => `  ⦿ ${cmd}`).join("\n");
        msg += `\n━━━━━━━━━━━━━━`;
      }

      msg += `\n\n💡 Use: ${prefix}help [category] or ${prefix}help [command]`;

      const sentMsg = await message.reply({
        body: msg,
        attachment: await global.utils.getStreamFromURL(banner),
      });
      setTimeout(() => message.unsend(sentMsg.messageID), 120000);
      return;
    }

    // 🌸 2. Category Help
    if (rawInput.startsWith("[") && rawInput.endsWith("]")) {
      const categoryName = rawInput.slice(1, -1).toLowerCase();
      if (!categories[categoryName]) {
        return message.reply(`❌ Category "${categoryName}" not found.\nAvailable: ${Object.keys(categories).map(c => `[${c}]`).join(", ")}`);
      }
      let msg = `🌸 𝙃𝙀𝙇𝙋: [${stylizeCaps(categoryName)}]\n━━━━━━━━━━━━━━\n`;
      msg += categories[categoryName].sort().map(cmd => `⦿ ${cmd}`).join("\n");
      msg += `\n━━━━━━━━━━━━━━\n💡 Use: ${prefix}help [command]`;
      const sentMsg = await message.reply({
        body: msg,
        attachment: await global.utils.getStreamFromURL(banner),
      });
      setTimeout(() => message.unsend(sentMsg.messageID), 120000);
      return;
    }

    // 🌸 3. Command Details
    const commandName = rawInput.toLowerCase();
    const command = commands.get(commandName) || commands.get(aliases.get(commandName));
    if (!command || !command?.config) {
      return message.reply(`❌ Command "${commandName}" not found.\nTry: ${prefix}help or ${prefix}help [category]`);
    }
    const config = command.config;
    const roleText = roleTextToString(config.role);
    const author = config.author || "Unknown";
    const desc = config.longDescription?.en || "No description";
    const guide = (config.guide?.en || "No guide available.").replace(/{pn}/g, `${prefix}${config.name}`);

    let msg = `🌸 𝘾𝙊𝙈𝙈𝘼𝙉𝘿 𝘿𝙀𝙏𝘼𝙄𝙇𝙎 🌸\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🔹 Name: ${stylizeCaps(config.name)}\n`;
    msg += `🔹 Description: ${desc}\n`;
    msg += `🔹 Author: ${author}\n`;
    msg += `🔹 Version: ${config.version || "1.0"}\n`;
    msg += `🔹 Role: ${roleText}\n`;
    msg += `🔹 Usage: ${guide}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━`;

    const sentMsg = await message.reply(msg);
    setTimeout(() => message.unsend(sentMsg.messageID), 120000);
  }
};

// 🔡 Small Caps Converter
function stylizeCaps(text) {
  const map = {
    a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ',
    j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ',
    s: 'ꜱ', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ',
    A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ꜰ', G: 'ɢ', H: 'ʜ', I: 'ɪ',
    J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ', Q: 'ǫ', R: 'ʀ',
    S: 'ꜱ', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x', Y: 'ʏ', Z: 'ᴢ',
    0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9'
  };
  return text.split('').map(c => map[c] || c).join('');
}

// 🔰 Role Text
function roleTextToString(role) {
  if (role == 0) return "Everyone";
  if (role == 1) return "Group Admin";
  if (role == 2) return "Bot Admin";
  if (role == 3) return "Bot Owner";
  return "Unknown";
  }
