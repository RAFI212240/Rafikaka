const fs = require("fs");
const request = require("request");
const path = require("path");

async function adminCommand(api, threadID, messageID) {
  const links = [
    "https://i.imgur.com/0Z6GQvF.jpg",
    "https://i.imgur.com/3g7nmJC.jpg"
  ];
  const imgURL = links[Math.floor(Math.random() * links.length)];
  const filePath = path.join(__dirname, "admin.jpg");

  await new Promise((resolve, reject) => {
    request(imgURL)
      .pipe(fs.createWriteStream(filePath))
      .on("finish", resolve)
      .on("error", reject);
  });

  const body = `𝗗𝗢 𝗡𝗢𝗧 𝗧𝗥𝗨𝗦𝗧 𝗧𝗛𝗘 𝗕𝗢𝗧 𝗢𝗣𝗘𝗥𝗔𝗧𝗢𝗥
------------------------------------------------
𝗡𝗮𝗺𝗲       : R A F Iメ
𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 :   RAFI 卝 চৌধুরীヅ
𝗥𝗲𝗹𝗶𝗴𝗶𝗼𝗻    : (𝗜𝘀𝗹𝗮𝗺)
𝗣𝗲𝗿𝗺𝗮𝗻𝗲𝗻𝘁 𝗔𝗱𝗱𝗿𝗲𝘀𝘀 : (Rungpur )
𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗔𝗱𝗱𝗿𝗲𝘀𝘀 : Dhaka, 𝘽𝙖𝙣𝙜𝙡𝙖𝙙𝙚𝙨𝙝
𝗚𝗲𝗻𝗱𝗲𝗿     : (𝗠𝗮𝗹𝗲)
𝗔𝗴𝗲            :  (19)
𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻𝘀𝗵𝗶𝗽 : (biye korle Invitation dimu ni-)
𝗪𝗼𝗿𝗸         : 𝙎𝙩𝙪𝙙𝙮
𝗚𝗺𝗮𝗶𝗹        :  private
𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 :  private 😑
𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺  : t.me/R_A_F_I_Official
𝗙𝗯 𝗹𝗶𝗻𝗸   : https://www.facebook.com/share/16BbdkmzJo/`;

  await api.sendMessage({
    body,
    attachment: fs.createReadStream(filePath)
  }, threadID, () => fs.unlinkSync(filePath), messageID);
}

// ব্যবহার: adminCommand(api, event.threadID, event.messageID);
