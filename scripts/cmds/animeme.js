const axios = require("axios");

module.exports.config = {
  name: "animeme",
  version: "1.0.0",
  hasPermission: 0,
  credits: "YourName",
  description: "Send anime memes/gifs from multiple APIs",
  commandCategory: "Anime",
  usages: "animeme [keyword]",
  cooldowns: 5,
  dependencies: ["axios"]
};

// Reddit থেকে meme আনার ফাংশন
async function getRedditMeme(subreddit = "animemes") {
  try {
    const res = await axios.get(`https://www.reddit.com/r/${subreddit}/hot.json?limit=50`);
    const posts = res.data.data.children.filter(post => !post.data.over_18 && post.data.post_hint === "image");
    if (!posts.length) return null;
    const randomPost = posts[Math.floor(Math.random() * posts.length)].data;
    return { url: randomPost.url, title: randomPost.title };
  } catch {
    return null;
  }
}

// OtakuGifs থেকে gif আনার ফাংশন
async function getOtakuGif(reaction = "anime-meme") {
  try {
    const res = await axios.get(`https://api.otakugifs.xyz/gif?reaction=${reaction}`);
    if (res.data && res.data.url) return { url: res.data.url, title: `Anime Gif: ${reaction}` };
    return null;
  } catch {
    return null;
  }
}

// Waifu.pics থেকে ছবি আনার ফাংশন
async function getWaifuPic(type = "waifu") {
  try {
    const res = await axios.get(`https://api.waifu.pics/sfw/${type}`);
    if (res.data && res.data.url) return { url: res.data.url, title: `Waifu Pic: ${type}` };
    return null;
  } catch {
    return null;
  }
}

// Acceptable Anime GIFs API থেকে র্যান্ডম gif আনার ফাংশন
async function getAcceptableAnimeGif() {
  try {
    const res = await axios.get("https://acceptable-anime-gifs-api.loca.lt/random/gif");
    if (res.data && res.data.url) return { url: res.data.url, title: "Acceptable Anime GIF" };
    return null;
  } catch {
    return null;
  }
}

module.exports.run = async function({ api, event, args }) {
  const keyword = args[0] ? args[0].toLowerCase() : "";

  // ১. যদি keyword থাকে, Reddit সাবরেডিট হিসেবে চেষ্টা করুন
  if (keyword) {
    const meme = await getRedditMeme(keyword);
    if (meme) {
      return api.sendMessage({ body: meme.title, attachment: await global.utils.getStreamFromURL(meme.url) }, event.threadID, event.messageID);
    }
  }

  // ২. OtakuGifs থেকে র্যান্ডম anime meme gif দিন
  const otakuGif = await getOtakuGif("anime-meme");
  if (otakuGif) {
    return api.sendMessage({ body: otakuGif.title, attachment: await global.utils.getStreamFromURL(otakuGif.url) }, event.threadID, event.messageID);
  }

  // ৩. Waifu.pics থেকে Waifu ছবি দিন
  const waifu = await getWaifuPic("waifu");
  if (waifu) {
    return api.sendMessage({ body: waifu.title, attachment: await global.utils.getStreamFromURL(waifu.url) }, event.threadID, event.messageID);
  }

  // ৪. Acceptable Anime GIFs API থেকে র্যান্ডম gif দিন
  const acceptableGif = await getAcceptableAnimeGif();
  if (acceptableGif) {
    return api.sendMessage({ body: acceptableGif.title, attachment: await global.utils.getStreamFromURL(acceptableGif.url) }, event.threadID, event.messageID);
  }

  return api.sendMessage("❌ Sorry, couldn't find any meme or gif for your request.", event.threadID, event.messageID);
};
