const axios = require("axios");

module.exports.config = {
  name: "animeme",
  version: "1.0.0",
  hasPermission: 0,
  credits: "YourName",
  description: "Send anime memes, random or by keyword",
  commandCategory: "Anime",
  usages: "animeme [keyword]",
  cooldowns: 5,
  dependencies: ["axios"]
};

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

async function getOtakuGif(reaction = "anime-meme") {
  try {
    const res = await axios.get(`https://api.otakugifs.xyz/gif?reaction=${reaction}`);
    if (res.data && res.data.url) return { url: res.data.url, title: `Anime Gif: ${reaction}` };
    return null;
  } catch {
    return null;
  }
}

module.exports.run = async function({ api, event, args }) {
  const keyword = args[0] || "";

  // যদি keyword থাকে, প্রথমে Reddit এ সাবরেডিট হিসেবে চেষ্টা করুন
  if (keyword) {
    const meme = await getRedditMeme(keyword.toLowerCase());
    if (meme) {
      return api.sendMessage({ body: meme.title, attachment: await global.utils.getStreamFromURL(meme.url) }, event.threadID, event.messageID);
    }
  }

  // না হলে OtakuGifs থেকে র্যান্ডম anime meme gif দিন
  const gif = await getOtakuGif("anime-meme");
  if (gif) {
    return api.sendMessage({ body: gif.title, attachment: await global.utils.getStreamFromURL(gif.url) }, event.threadID, event.messageID);
  }

  return api.sendMessage("❌ Sorry, couldn't find any meme for your request.", event.threadID, event.messageID);
};
                                                
