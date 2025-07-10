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

const axios = require("axios");

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

module.exports.run = async function({ api, event, args }) {
  const keyword = args[0] ? args[0].toLowerCase() : "";
  let meme = null;

  if (keyword) meme = await getRedditMeme(keyword);
  if (!meme) meme = await getRedditMeme();

  if (!meme) return api.sendMessage("❌ Couldn't find any meme.", event.threadID, event.messageID);

  return api.sendMessage(
    { body: meme.title, attachment: await global.utils.getStreamFromURL(meme.url) },
    event.threadID,
    event.messageID
  );
};
  
