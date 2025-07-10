const axios = require("axios");

module.exports.config = {
  name: "animeme",
  version: "1.0.0",
  hasPermission: 0,
  credits: "YourName",
  description: "Send anime memes/gifs, random or by keyword",
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

// Waifu.pics থেকে নির্দিষ্ট ছবি রিটার্ন করার ফাংশন
async function getFixedWaifuPic() {
  // আপনার চাওয়া ছবি URL সরাসরি রিটার্ন করলাম
  return {
    url: "https://i.waifu.pics/qUY7BBo.jpg",
    title: "Fixed Waifu Pic"
  };
}

module.exports.run = async function({ api, event, args }) {
  const keyword = args[0] ? args[0].toLowerCase() : "";

  // যদি keyword থাকে, Reddit সাবরেডিট হিসেবে চেষ্টা করুন
  if (keyword) {
    const meme = await getRedditMeme(keyword);
    if (meme) {
      return api.sendMessage(
        { body: meme.title, attachment: await global.utils.getStreamFromURL(meme.url) },
        event.threadID,
        event.messageID
      );
    }
  }

  // না হলে OtakuGifs থেকে র্যান্ডম anime meme gif দিন
  const gif = await getOtakuGif("anime-meme");
  if (gif) {
    return api.sendMessage(
      { body: gif.title, attachment: await global.utils.getStreamFromURL(gif.url) },
      event.threadID,
      event.messageID
    );
  }

  // OtakuGifs কাজ না করলে Waifu.pics থেকে নির্দিষ্ট ছবি দিন
  const waifu = await getFixedWaifuPic();
  if (waifu) {
    return api.sendMessage(
      { body: waifu.title, attachment: await global.utils.getStreamFromURL(waifu.url) },
      event.threadID,
      event.messageID
    );
  }

  return api.sendMessage("❌ Sorry, couldn't find any meme for your request.", event.threadID, event.messageID);
};
    
