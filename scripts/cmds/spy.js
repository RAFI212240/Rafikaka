const axios = require("axios");
const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`,
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "spy",
    aliases: ["whois", "stalk", "profile", "userinfo"],
    version: "2.0",
    role: 0,
    author: "Mahin",
    Description: "🔍 Get ultra-detailed user info with stunning visuals!",
    category: "information",
    countDown: 5,
  },

  onStart: async function ({ event, message, usersData, api, args }) {
    const uid1 = event.senderID;
    const uid2 = Object.keys(event.mentions)[0];
    let uid;

    if (args[0]) {
      if (/^\d+$/.test(args[0])) uid = args[0];
      else {
        const match = args[0].match(/profile\.php\?id=(\d+)/);
        if (match) uid = match[1];
      }
    }

    if (!uid) uid = event.type === "message_reply" ? event.messageReply.senderID : uid2 || uid1;

    // Fetching data
    const response = await axios.get(`${await baseApiUrl()}/baby?list=all`);
    const dataa = response.data || { teacher: { teacherList: [] } };
    let babyTeach = dataa?.teacher?.teacherList?.find((t) => t[uid])?.[uid] || 0;

    const userInfo = await api.getUserInfo(uid);
    const avatarUrl = await usersData.getAvatarUrl(uid);
    const userData = await usersData.get(uid);
    const allUser = await usersData.getAll();
    
    // Ranks
    const rank = allUser.slice().sort((a, b) => b.exp - a.exp).findIndex(user => user.userID === uid) + 1;
    const moneyRank = allUser.slice().sort((a, b) => b.money - a.money).findIndex(user => user.userID === uid) + 1;
    const level = Math.floor(userData.exp / 1000) || 1;

    // Gender & Role
    let genderText;
    switch (userInfo[uid].gender) {
      case 1: genderText = "♀️ | 𝔾𝕚𝕣𝕝 💃✨"; break;
      case 2: genderText = "♂️ | 𝔹𝕠𝕪 🕺🔥"; break;
      default: genderText = "🌈 | 𝔾𝕒𝕪/𝕋𝕣𝕒𝕟𝕤 🏳️‍⚧️✨";
    }

    const position = userInfo[uid].type ? userInfo[uid].type.toUpperCase() : "ℕ𝕆ℝ𝕄𝔸� 𝕌𝕊𝔼ℝ 🥺";

    // Last Active (if possible)
    const lastActive = userInfo[uid].lastActiveTimestamp 
      ? new Date(userInfo[uid].lastActiveTimestamp * 1000).toLocaleString() 
      : "🔒 𝙿𝚛𝚒𝚟𝚊𝚝𝚎";

    // 🌟 USER INFO CARD 🌟
    const userInformation = `
╔═══════════◇◆◇═══════════╗
         🄿🅁🄾🄵🄸🄻🄴 🄸🄽🄵🄾
╚═══════════◇◆◇═══════════╝

📛 𝗡𝗔𝗠𝗘 » ${userInfo[uid].name.toUpperCase()} ${userInfo[uid].isVerified ? "✅" : ""}
⚡ 𝗨𝗜𝗗 » ${uid}
🎭 𝗚𝗘𝗡𝗗𝗘𝗥 » ${genderText}
🏆 𝗖𝗟𝗔𝗦𝗦 » ${position} ${position.includes("ADMIN") ? "👑" : ""}
🔖 𝗨𝗦𝗘𝗥𝗡𝗔𝗠𝗘 » ${userInfo[uid].vanity ? `@${userInfo[uid].vanity}` : "🚫 𝗡𝗼𝗻𝗲"}
🌐 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 𝗟𝗜𝗡𝗞 » ${userInfo[uid].profileUrl}
🎂 𝗕𝗜𝗥𝗧𝗛𝗗𝗔𝗬 » ${userInfo[uid].isBirthday ? userInfo[uid].isBirthday : "🔒 𝗣𝗿𝗶𝘃𝗮𝘁𝗲"}
🏷️ 𝗡𝗜𝗖𝗞𝗡𝗔𝗠𝗘 » ${userInfo[uid].alternateName || "🚫 𝗡𝗼𝗻𝗲"}
🤖 𝗕𝗢𝗧 𝗙𝗥𝗜𝗘𝗡𝗗 » ${userInfo[uid].isFriend ? "🤝 𝗬𝗲𝘀" : "❌ 𝗡𝗼"}
⏳ 𝗟𝗔𝗦𝗧 𝗔𝗖𝗧𝗜𝗩𝗘 » ${lastActive}

╔═══════════◇◆◇═══════════╗
      🅂🅃🄰🅃🅄🅂 🄸🄽🄵🄾
╚═══════════◇◆◇═══════════╝

💰 𝗠𝗢𝗡𝗘𝗬 » $${formatMoney(userData.money)} ${userData.money > 1000000 ? "💎" : "💵"}
📈 𝗘𝗫𝗣 » ${userData.exp} XP
📊 𝗟𝗘𝗩𝗘𝗟 » ${level} 🌟
🏅 𝗥𝗔𝗡𝗞 » #${rank} / ${allUser.length} 🏆
💸 𝗠𝗢𝗡𝗘𝗬 𝗥𝗔𝗡𝗞 » #${moneyRank} / ${allUser.length} 💰
👶 𝗕𝗔𝗕𝗬 𝗧𝗘𝗔𝗖𝗛 » ${babyTeach} 👼

╔══════════════════════════╗
   ✨ 𝗖𝗥𝗘𝗔𝗧𝗘𝗗 𝗕𝗬 : 𝐘𝐮 𝐑𝐢 ✨
╚══════════════════════════╝
`;

    // Send with Avatar & Stylish Reply
    message.reply({
      body: userInformation,
      attachment: await global.utils.getStreamFromURL(avatarUrl),
      mentions: [{
        tag: `@${userInfo[uid].name}`,
        id: uid,
      }]
    });
  },
};

function formatMoney(num) {
  const units = ["", "K", "M", "B", "T", "Q", "Qi", "Sx", "Sp", "Oc", "N", "D"];
  let unit = 0;
  while (num >= 1000 && ++unit < units.length) num /= 1000;
  return num.toFixed(1).replace(/\.0$/, "") + units[unit];
}
