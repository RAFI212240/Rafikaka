const axios = require("axios");

module.exports = {
  config: {
    name: "animeme",
    version: "1.0.0",
    author: "YourName",
    countDown: 5,
    role: 0,
    shortDescription: "Send anime memes/gifs, random or by keyword",
    longDescription: "Get anime memes from Reddit, OtakuGifs, or Waifu.pics",
    category: "anime",
    guide: {
      en: "{pn} [keyword]"
    }
  },

  // Reddit থেকে meme আনার ফাংশন
  async getRedditMeme(subreddit = "animemes") {
    try {
      const res = await axios.get(`https://www.reddit.com/r/${subreddit}/hot.json?limit=50`);
      const posts = res.data.data.children.filter(post => 
        !post.data.over_18 && 
        post.data.post_hint === "image"
      );
      if (!posts.length) return null;
      
      const randomPost = posts[Math.floor(Math.random() * posts.length)].data;
      return { 
        url: randomPost.url, 
        title: randomPost.title 
      };
    } catch {
      return null;
    }
  },

  // OtakuGifs থেকে gif আনার ফাংশন
  async getOtakuGif(reaction = "anime-meme") {
    try {
      const res = await axios.get(`https://api.otakugifs.xyz/gif?reaction=${reaction}`);
      if (res.data && res.data.url) {
        return { 
          url: res.data.url, 
          title: `Anime Gif: ${reaction}` 
        };
      }
      return null;
    } catch {
      return null;
    }
  },

  // Waifu.pics থেকে নির্দিষ্ট ছবি রিটার্ন করার ফাংশন
  async getFixedWaifuPic() {
    return {
      url: "https://i.waifu.pics/qUY7BBo.jpg",
      title: "Fixed Waifu Pic"
    };
  },

  onStart: async function({ message, args, api, event }) {
    const keyword = args[0] ? args[0].toLowerCase() : "";

    try {
      // যদি keyword থাকে, Reddit সাবরে
      
