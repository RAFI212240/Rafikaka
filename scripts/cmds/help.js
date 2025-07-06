module.exports = {
  config: {
    name: "help",
    version: "3.0",
    author: "OpenAI",
    role: 0,
    shortDescription: {
      en: "View command usage"
    },
    longDescription: {
      en: "View command usage and list all commands"
    },
    category: "info",
    guide: {
      en: "{pn} [empty | <page> | <command name>]"
    },
    priority: 1
  },

  langs: {
    en: {
      help: `╭─────⊰ 🌸 𝘼𝙉𝙄𝙈𝙀 𝘽𝙊𝙏 𝙃𝙀𝙇𝙋 🌸 ⊱─────╮
│ ✦ ──────── ⋆⋅☆⋅⋆ ──────── ✦
│ 🎌 Total Commands: %1
│ 🗂️ Page: [ %2/%3 ]
│ ⚡ Prefix: %4
│ 👑 Owner: Ew'r Rafi
│ ✦ ──────── ⋆⋅☆⋅⋆ ──────── ✦
╰─────────────────────────────╯

%5

╭─────⊰ 💡 𝙐𝙎𝘼𝙂𝙀 ⊱─────╮
│ %4help <page> - View page
│ %4help <cmd> - Command info
│ %4help all - All commands
╰───────────────────────╯`,
      help2: `╭─────⊰ ⚡ %1 ⊱─────╮
│ 📝 Info: %2
│ 📂 Category: %3
│ 💫 Usage: %4
│ ⏱️ Cooldown: %5s
│ 👑 Permission: %6
│ ✨ Aliases: %7
╰─────────────────────────╯

📖 Guide:
%8`,
      commandNotFound: `❌ Command "%1" not found`,
      getInfoCommand: `╭─────⊰ 📖 𝙄𝙉𝙁𝙊 ⊱─────╮
│ 📌 Command: %1
│ 📝 Description: %2
│ 🔧 Other names: %3
│ 📂 Category: %4
│ 👤 Version: %5
│ 👑 Role: %6
│ ⏱️ Cooldown: %7s
│ 👨‍💻 Author: %8
╰─────────────────────────╯

💡 Usage:
%9`,
      onlyInfo: `📌 Use: %1help <command name> to see details`,
      page: `│ Page [ %1/%2 ] │`,
      categoryEmojis: {
        "anime": "🎌",
        "media": "🎬", 
        "fun": "🎮",
        "utility": "🔧",
        "info": "📊",
        "admin": "👑",
        "economy": "💰",
        "game": "🎯",
        "ai": "🤖",
        "image": "🖼️",
        "other": "⭐"
      }
    }
  },

  onStart: async function ({ message, args, event, threadsData, getLang, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);
    const { commands } = global.GoatBot;
    const commandName = args[0]?.toLowerCase();

    // Get all commands user can use
    const userCommands = Array.from(commands.values())
      .filter(cmd => cmd.config.role <= role)
      .sort((a, b) => a.config.name.localeCompare(b.config.name));

    if (!commandName) {
      // Show page 1
      return await showHelp(message, prefix, userCommands, 1, getLang);
    }

    if (!isNaN(commandName)) {
      // Show specific page
      const page = parseInt(commandName);
      return await showHelp(message, prefix, userCommands, page, getLang);
    }

    if (commandName === "all") {
      // Show all commands
      return await showAllCommands(message, prefix, userCommands, getLang);
    }

    // Show command details
    const command = commands.get(commandName) || 
                   Array.from(commands.values()).find(cmd => 
                     cmd.config.aliases?.includes(commandName)
                   );

    if (!command) {
      return message.reply(getLang("commandNotFound", commandName));
    }

    return await showCommandDetails(message, prefix, command, getLang);
  }
};

async function showHelp(message, prefix, commands, page, getLang) {
  const cmdsPerPage = 10;
  const totalPages = Math.ceil(commands.length / cmdsPerPage);
  
  if (page < 1 || page > totalPages) {
    page = 1;
  }

  const start = (page - 1) * cmdsPerPage;
  const end = start + cmdsPerPage;
  const cmdsOnPage = commands.slice(start, end);

  // Group by category
  const categories = {};
  cmdsOnPage.forEach(cmd => {
    const category = cmd.config.category || "other";
    if (!categories[category]) categories[category] = [];
    categories[category].push(cmd);
  });

  let commandList = "";
  const categoryEmojis = getLang("categoryEmojis");

  for (const [category, cmds] of Object.entries(categories)) {
    const emoji = categoryEmojis[category] || "📁";
    commandList += `\n${emoji} ◆ ${category.toUpperCase()}\n`;
    commandList += "├─────────────────\n";
    
    cmds.forEach((cmd, index) => {
      const isLast = index === cmds.length - 1;
      const prefix = isLast ? "└─" : "├─";
      commandList += `${prefix} ${cmd.config.name}\n`;
    });
  }

  const helpMsg = getLang("help", 
    commands.length, 
    page, 
    totalPages, 
    prefix, 
    commandList
  );

  const banners = [
    "https://i.imgur.com/6RLwKQk.png",
    "https://i.imgur.com/1Q9Z1Zm.png"
  ];
  const banner = banners[Math.floor(Math.random() * banners.length)];

  try {
    await message.reply({
      body: helpMsg,
      attachment: await global.utils.getStreamFromURL(banner)
    });
  } catch (err) {
    await message.reply(helpMsg);
  }
}

async function showAllCommands(message, prefix, commands, getLang) {
  // Group all commands by category
  const categories = {};
  commands.forEach(cmd => {
    const category = cmd.config.category || "other";
    if (!categories[category]) categories[category] = [];
    categories[category].push(cmd.config.name);
  });

  let msg = `╭─────⊰ 🌸 𝘼𝙇𝙇 𝘾𝙊𝙈𝙈𝘼𝙉𝘿𝙎 🌸 ⊱─────╮\n`;
  msg += `│ Total: ${commands.length} commands\n`;
  msg += `╰─────────────────────────────╯\n`;

  const categoryEmojis = getLang("categoryEmojis");

  for (const [category, cmdNames] of Object.entries(categories)) {
    const emoji = categoryEmojis[category] || "📁";
    msg += `\n${emoji} ${category.toUpperCase()} (${cmdNames.length})\n`;
    msg += `${cmdNames.join(", ")}\n`;
  }

  msg += `\n💡 Use: ${prefix}help <command> for details`;

  await message.reply(msg);
}

async function showCommandDetails(message, prefix, command, getLang) {
  const { name, version, role, author, countDown, aliases = [], shortDescription, longDescription, category, guide } = command.config;

  const roleText = {
    0: "Everyone",
    1: "Group Admin",
    2: "Bot Admin"
  }[role] || "Unknown";

  const desc = longDescription?.en || shortDescription?.en || "No description";
  const usage = (guide?.en || "No guide").replace(/{pn}/g, prefix + name).replace(/{p}/g, prefix);
  const aliasesText = aliases.length ? aliases.join(", ") : "None";

  const info = getLang("getInfoCommand",
    name,
    desc,
    aliasesText,
    category || "Uncategorized",
    version || "1.0",
    roleText,
    countDown || 0,
    author || "Unknown",
    usage
  );

  await message.reply(info);
}

function getPrefix(threadID) {
  return global.GoatBot.config.prefix;
        }
