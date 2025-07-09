const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: 'animeme',
    aliases: ['anime-meme'],
    author: 'Xemon (Fixed by D-Jukie)',
    version: '1.1.0',
    role: 0,
    countdown: 10, // Increased countdown to prevent spam
    shortDescription: { en: 'Get a random anime meme' },
    longDescription: { en: 'Get a random anime meme from Reddit' },
    category: 'fun',
    guide: { en: '{p}animeme' }
  },

  onStart: async function ({ event, api }) {
    // Define a unique path for the temporary image file to avoid conflicts
    const tempImagePath = path.join(__dirname, '/tmp/', `${event.threadID}_${Date.now()}_animeme.png`);

    try {
      // Send a "processing" message to the user
      const loadingMessage = await api.sendMessage("⏳ | Searching for an animeme for you...", event.threadID);

      // Ensure the temporary directory exists
      await fs.ensureDir(path.join(__dirname, '/tmp/'));

      // Fetch meme data from Reddit
      const response = await axios.get('https://www.reddit.com/r/animememes/top.json?sort=top&t=week&limit=100');
      const posts = response.data.data.children;

      let post, imageUrl;
      let attempts = 0;
      const maxAttempts = 10;

      // Find a post with a valid image URL
      do {
        post = posts[Math.floor(Math.random() * posts.length)].data;
        imageUrl = post.url;
        attempts++;
      } while (!imageUrl.match(/\.(jpg|jpeg|png|gif)$/) && attempts < maxAttempts);
      
      // If no valid image is found after several attempts, inform the user
      if (!imageUrl.match(/\.(jpg|jpeg|png|gif)$/)) {
        await api.unsendMessage(loadingMessage.messageID);
        return api.sendMessage("❌ | Could not find a valid image meme after multiple attempts. Please try again.", event.threadID, event.messageID);
      }
      
      const title = post.title;

      // Download the image using axios
      const imageResponse = await axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'stream'
      });

      // Create a write stream to save the image
      const writer = fs.createWriteStream(tempImagePath);
      imageResponse.data.pipe(writer);

      // Wait for the download to finish
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // Send the meme with title and image
      await api.sendMessage({
        body: `𝗧𝗶𝘁𝗹𝗲: ${title}`,
        attachment: fs.createReadStream(tempImagePath)
      }, event.threadID);

      // Unsend the loading message
      await api.unsendMessage(loadingMessage.messageID);

    } catch (error) {
      console.error('[ANIMEME] Error:', error);
      await api.sendMessage('❌ | An error occurred while fetching the anime meme. Please try again later.', event.threadID);
    } finally {
      // Cleanup: always delete the temporary file if it exists
      if (fs.existsSync(tempImagePath)) {
        await fs.unlink(tempImagePath);
      }
    }
  }
};
