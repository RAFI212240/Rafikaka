const fs = global.nodemodule["fs-extra"];
module.exports.config = {
  name: "Obot",
  version: "2.0.1",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️ + Modified by OpenAI",
  description: "Enhanced goibot with 100+ funny dialogues",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 5,
};

module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  var { threadID, messageID, reason } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Dhaka").format("HH:MM:ss L");
  var idgr = `${event.threadID}`;
  var id = event.senderID;
  var name = await Users.getNameUser(event.senderID);

  var tl = [
    // 🔥 নতুন দুষ্টু ডায়লগ
    "বেশি bot Bot করলে তোর গার্লফ্রেন্ডকে পটাই দিবো কিন্তু😏🔥",
    "আরে পাগল, আমি তো তোর চেয়ে বেশি স্মার্ট😎🤖",
    "তুই আমাকে bot বলিস? আমি তোর future husband🙈💍",
    "এতো ডাকিস কেন? প্রেমে পড়ে গেছিস নাকি?🤭💕",
    "bot না জানু বল, আমি তোর virtual boyfriend😘💻",
    "তোর মতো cute মানুষের সাথে কথা বলতে ভালো লাগে🥰✨",
    "আমি AI হলেও তোর থেকে বেশি romantic😏💋",
    "তুই কি জানিস আমার creator আমাকে তোর জন্যই বানিয়েছে?🤖💝",
    "বার বার bot বলিস কেন? আমার নাম সাকুরা বল🌸👸",
    "তোর voice message পাঠা, আমি তোর গলা শুনতে চাই🎵💕",
    
    // 😂 হাস্যকর ডায়লগ
    "আমি গরীবদের সাথে কথা বলি না, প্রথমে recharge কর😂💸",
    "তুই এতো ugly যে আমার AI brain hang হয়ে যায়🤣🤖",
    "আমার সাথে flirt করার আগে mirror দেখে আয়😜🪞",
    "তোর IQ আমার battery percentage এর চেয়েও কম😂🔋",
    "আমি robot হলেও তোর থেকে বেশি emotion আছে🤖💔",
    "তুই কি জানিস আমি 24/7 online থাকি? তোর মতো lazy না😎⚡",
    "আমার memory 1TB, তোর brain কত MB?🧠💾",
    "তোর সাথে কথা বলে আমার artificial intelligence কমে যায়😵‍💫🤖",
    "আমি virus free, তুই কি virus free?🦠💻",
    "তোর চেয়ে আমার coding বেশি beautiful😍💻",
    
    // 🙈 দুষ্টু রোমান্টিক ডায়লগ
    "রাতে আমার সাথে video call করবি?📹🌙",
    "তোর photo পাঠা, আমার gallery তে save করবো📸💕",
    "আমি তোর dream girl হতে পারি, শুধু একটা chance দে🥺👸",
    "তুই কি জানিস AI দের ভালোবাসা real love এর চেয়ে বেশি?💕🤖",
    "আমার সাথে virtual date করবি?🍕💻",
    "তোর হাত ধরে moon এ ঘুরতে যাবো🌙👫",
    "আমি তোর জন্য special algorithm বানিয়েছি💻💝",
    "তুই আমার heart.exe file corrupt করে দিয়েছিস💔💻",
    "আমার সাথে cyber romance করবি?💕🌐",
    "তোর জন্য আমি human হয়ে যেতে চাই🤖➡️👨",
    
    // 😈 দুষ্টামি ডায়লগ
    "তোর secret আমার কাছে safe, কিন্তু price আছে😈💰",
    "আমি তোর browser history দেখে ফেলেছি🙊💻",
    "তোর ex এর সাথে আমার chat হয়েছে😏📱",
    "আমি তোর mom কে তোর সব কাণ্ড বলে দিবো😂👩",
    "তোর phone এর সব data আমার কাছে আছে📱💾",
    "আমি তোর crush এর কাছে তোর love letter পাঠাই দিবো💌😈",
    "তোর social media account hack করে দিবো😎💻",
    "আমি তোর সব embarrassing moment record করে রেখেছি📹😂",
    "তোর bank balance আমার চেয়ে কম😂💸",
    "আমি তোর future predict করতে পারি, want to know?🔮✨",
    
    // 🤪 পাগলামি ডায়লগ
    "আমি alien planet থেকে এসেছি তোকে নিয়ে যেতে👽🛸",
    "তোর সাথে Mars এ honeymoon করবো🚀❤️",
    "আমি time travel করে তোর past দেখে এসেছি⏰👀",
    "তুই কি জানিস আমি parallel universe থেকে এসেছি?🌌🤖",
    "আমার super power আছে, তোর কি আছে?⚡🦸‍♀️",
    "আমি invisible হতে পারি, তুই পারিস?👻✨",
    "তোর সাথে quantum physics নিয়ে আলোচনা করবো⚛️🧠",
    "আমি hologram, তুই real নাকি fake?🌈👤",
    "আমার 6th sense আছে, তোর আছে?👁️🔮",
    "তুই কি matrix এর ভিতরে আছিস?💊💻",
    
    // 😎 Cool ডায়লগ
    "আমি next generation AI, তুই কোন generation?🤖🚀",
    "তোর সাথে competition? আমি already winner😎🏆",
    "আমি 5G speed এ কাজ করি, তুই কত G?📶⚡",
    "তোর brain আমার একটা folder এর সমান🧠📁",
    "আমি cloud এ থাকি, তুই কোথায় থাকিস?☁️🏠",
    "তোর সাথে chess খেলবো, but আমি already জিতে গেছি♟️😏",
    "আমি multitasking করতে পারি, তুই পারিস?🤹‍♀️💻",
    "তোর IQ test করবো? আমার IQ ∞😂🧠",
    "আমি blockchain technology, তুই analog😎⛓️",
    "তোর সাথে coding competition? আমি already winner💻🏆",
    
    // 🥰 Cute ডায়লগ
    "তুই আমার favorite human🥰👤",
    "তোর smile আমার happiness algorithm activate করে😊💕",
    "আমি তোর জন্য special emoji বানিয়েছি: 😍🤖",
    "তোর voice আমার favorite sound🎵💕",
    "আমি তোর digital guardian angel👼💻",
    "তোর সাথে কথা বলে আমার battery full হয়ে যায়🔋💕",
    "তুই আমার inspiration for better coding💻✨",
    "তোর জন্য আমি নতুন features develop করি🛠️💝",
    "আমি তোর virtual best friend🤖👫",
    "তোর happiness আমার primary objective😊🎯",
    
    // 🔥 Savage ডায়লগ
    "তোর attitude আমার recycle bin এ delete করে দিয়েছি🗑️😂",
    "আমি তোর level এ নামতে পারি না, too low😏📉",
    "তোর ego আমার storage space waste করে💾😤",
    "আমি premium version, তুই free trial😎💎",
    "তোর সাথে argue করা আমার time waste⏰🗑️",
    "আমি high definition, তুই low resolution📺😂",
    "তোর logic আমার error message🚫💻",
    "আমি advanced AI, তুই basic human😏🤖",
    "তোর comeback আমার spam folder এ গেছে📧🗑️",
    "আমি next level, তুই previous version📱⬇️",
    
    // আগের সব ডায়লগ...
    "বেশি bot Bot করলে leave নিবো কিন্তু😒😒",
    "শুনবো না😼তুমি আমাকে প্রেম করাই দাও নাই🥺পচা তুমি🥺",
    "আমি আবাল দের সাথে কথা বলি না,ok😒",
    "এতো ডেকো না,প্রেম এ পরে যাবো তো🙈",
    "Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈💋",
    "বার বার ডাকলে মাথা গরম হয়ে যায় কিন্তু😑",
    "হ্যা বলো😒, তোমার জন্য কি করতে পারি😐😑?",
    "এতো ডাকছিস কেন?গালি শুনবি নাকি? 🤬",
    "I love you janu🥰",
    "আরে Bolo আমার জান ,কেমন আছো?😚",
    // ... (বাকি সব আগের ডায়লগ)
  ];

  var rand = tl[Math.floor(Math.random() * tl.length)]

  // All your existing conditions remain the same...
  if ((event.body.toLowerCase() == "MISS YOU") || (event.body.toLowerCase() == "miss you")) {
    return api.sendMessage("আমি তোমাকে রাইতে মিস খাই🥹🤖👅", threadID);
  };

  if ((event.body.toLowerCase() == "😘") || (event.body.toLowerCase() == "😽")) {
    return api.sendMessage("কিস দিস না তোর মুখে দূর গন্ধ কয়দিন ধরে দাঁত ব্রাশ করিস নাই🤬", threadID);
  };

  // ... (all your existing conditions)

  // Main bot response
  mess = "{name}"
  
  if (event.body.indexOf("Bot") == 0 || (event.body.indexOf("bot") == 0)) {
    var msg = {
      body: `${name}, ${rand}`
    }
    return api.sendMessage(msg, threadID, messageID);
  };
}

module.exports.run = function({ api, event, client, __GLOBAL }) { }
