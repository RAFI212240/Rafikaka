module.exports.config = {
	name: "admin",
	version: "1.0.1", 
	hasPermssion: 0,
	credits: "Abdulla Rahaman",
	description: "Abdulla Tech 49",
	commandCategory: "...",
	cooldowns: 1,
	dependencies: 
	{
    "request":"",
    "fs-extra":"",
    "axios":""
  }
};
module.exports.run = async function({ api,event,args,client,Users,Threads,__GLOBAL,Currencies }) {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
var link =["https://imgur.com/a/k8vXS4d", 
            
            "https://imgur.com/a/MVwWyF5", 
            
"",
            
            ""];
  
var callback = () => api.sendMessage({body:`𝗗𝗢 𝗡𝗢𝗧 𝗧𝗥𝗨𝗦𝗧 𝗧𝗛𝗘 𝗕𝗢𝗧 𝗢𝗣𝗘𝗥𝗔 𝗧𝗢𝗥\n
------------------------------------------------\n𝗡𝗮𝗺𝗲       : R A F Iメ\n𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 :   RAFI 卝 চৌধুরীヅ\n𝗥𝗲𝗹𝗶𝗴𝗶𝗼𝗻    : (𝗜𝘀𝗹𝗮𝗺)\n𝗣𝗲𝗿𝗺𝗮𝗻𝗲𝗻𝘁 𝗔𝗱𝗱𝗿𝗲𝘀𝘀 : (Rungpur )\n𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗔𝗱𝗱𝗿𝗲𝘀𝘀 : Dhaka, 𝘽𝙖𝙣𝙜𝙡𝙖𝙙𝙚𝙨𝙝\n𝗚𝗲𝗻𝗱𝗲𝗿     : (𝗠𝗮𝗹𝗲)\n𝗔𝗴𝗲            :  (19)\n𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻𝘀𝗵𝗶𝗽 : (biye korle Invitation dimu ni-)\n𝗪𝗼𝗿𝗸         : 𝙎𝙩𝙪𝙙𝙮\n𝗚𝗺𝗮𝗶𝗹        :  private\n𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 :  private 😑\n𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺  : t.me/R_A_F_I_Official\n𝗙𝗯 𝗹𝗶𝗻𝗸   : https://www.facebook.com/share/16BbdkmzJo/
`,attachment: fs.createReadStream(__dirname + "/cache/juswa.jpg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/juswa.jpg")); 
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/juswa.jpg")).on("close",() => callback());
   };
