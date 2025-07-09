const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: 'animeme',
    aliases: ['anime-meme'],
    author: 'Xemon (Fixed by D-Jukie)',
    version: '1.1.2', // Version updated for clarity
    role: 0,
    countdown: 10,
    shortDescription: { en: 'Get a random anime meme' },
    longDescription: { en: 'Get a random anime meme from Reddit' },
    category: 'fun',
    guide: { en: '{p}animeme' }
  },

  onStart: async function ({ event, api }) {
    const tempImagePath = path.join(__dirname, '/tmp/', `${event.threadID}_${Date.now()}_animeme.png`);

    try {
      const loadingMessage = await api.sendMessage("⏳ | Searching for an animeme for you...", event.threadID);
      await fs.ensureDir(path.join(__dirname, '/tmp/'));

      // Fetch meme data from Reddit with a User-Agent header to mimic a browser
      const response = await axios.get('https://www.reddit.com/r/animememes/top.json?sort=top&t=week&limit=100', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
        }
      });
      
      const posts = response.data.data.children;

      if (!posts || posts.length === 0) {
        await api.unsendMessage(loadingMessage.messageID);
        return api.sendMessage("❌ | Could not fetch any memes from Reddit. The subreddit might be unavailable or empty.", event.threadID, event.messageID);
      }
      
      let post, imageUrl;
      let attempts = 0;
      const maxAttempts = 10;

      // Find a post with a valid image URL
      do {
        post = posts[Math.floor(Math.random() * posts.length)].data;
        // Using 'url_overridden_by_dest' is often more reliable for direct image links
        imageUrl = post.url_overridden_by_dest || post.url;
        attempts++;
      } while (!imageUrl.match(/\.(jpg|jpeg|png|gif)$/) && attempts < maxAttempts);
      
      if (!imageUrl.match(/\.(jpg|jpeg|png|gif)$/)) {
        await api.unsendMessage(loadingMessage.messageID);
        return api.sendMessage("❌ | Could not find a valid image meme after multiple attempts. Please try again.", event.threadID, event.messageID);
      }
      
      const title = post.title;

      // Download the image using axios with the same User-Agent header
      const imageResponse = await axios.get(imageUrl, {
        responseType: 'stream',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
        }
      });

      const writer = fs.createWriteStream(tempImagePath);
      imageResponse.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      await api.sendMessage({
        body: `𝗧𝗶𝘁𝗹𝗲: ${title}`,
        attachment: fs.createReadStream(tempImagePath)
      }, event.threadID);

      await api.unsendMessage(loadingMessage.messageID);

    } catch (error) {
      // This will log the actual technical error to your bot's console for debugging
      console.error('[ANIMEME] Error fetching meme:', error.message);
      await api.sendMessage('❌ | An error occurred while fetching the anime meme. Please check the bot console for details and try again later.', event.threadID);
    } finally {
      if (fs.existsSync(tempImagePath)) {
        await fs.unlink(tempImagePath);
      }
    }
  }
};
