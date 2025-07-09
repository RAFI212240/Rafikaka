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
    countdown: 10,
    shortDescription: { en: 'Get a random anime meme' },
    longDescription: { en: 'Get a random anime meme from Reddit' },
    category: 'fun',
    guide: { en: '{p}animeme' }
  },

  onStart: async function ({ event, api }) {
    const tempDir = path.join(__dirname, 'tmp');
    const tempImagePath = path.join(tempDir, `${event.threadID}_${Date.now()}_animeme.png`);

    try {
      const loadingMessage = await api.sendMessage("⏳ | Searching for an animeme for you...", event.threadID);

      // Ensure temp directory exists
      await fs.ensureDir(tempDir);

      // Fetch meme data from Reddit with proper headers
      const response = await axios.get('https://www.reddit.com/r/animememes/top.json?sort=top&t=week&limit=100', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.data || !response.data.data || !response.data.data.children) {
        throw new Error('No data received from Reddit');
      }

      const posts = response.data.data.children;
      console.log(`[ANIMEME] Found ${posts.length} posts`);

      let post, imageUrl;
      let attempts = 0;
      const maxAttempts = 20;

      // Find a post with a valid image URL
      do {
        post = posts[Math.floor(Math.random() * posts.length)].data;
        imageUrl = null;
        
        // Check different sources for image URL
        if (post.url && post.url.match(/\.(jpg|jpeg|png|gif)$/i)) {
          imageUrl = post.url;
        } else if (post.preview && post.preview.images && post.preview.images[0]) {
          // Get the largest preview image
          const previewImage = post.preview.images[0];
          if (previewImage.source && previewImage.source.url) {
            imageUrl = previewImage.source.url.replace(/&amp;/g, '&');
          }
        } else if (post.url_overridden_by_dest) {
          imageUrl = post.url_overridden_by_dest;
        }

        attempts++;
        console.log(`[ANIMEME] Attempt ${attempts}: ${imageUrl || 'No valid URL found'}`);
        
      } while (!imageUrl && attempts < maxAttempts);

      if (!imageUrl) {
        await api.unsendMessage(loadingMessage.messageID);
        return api.sendMessage("❌ | Could not find a valid image meme. Please try again.", event.threadID, event.messageID);
      }

      const title = post.title || 'Anime Meme';
      console.log(`[ANIMEME] Downloading: ${imageUrl}`);

      // Download the image
      const imageResponse = await axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'stream',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 30000
      });

      // Save the image
      const writer = fs.createWriteStream(tempImagePath);
      imageResponse.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // Verify file exists and has content
      const stats = await fs.stat(tempImagePath);
      if (stats.size === 0) {
        throw new Error('Downloaded file is empty');
      }

      console.log(`[ANIMEME] Image saved successfully: ${stats.size} bytes`);

      // Send the meme
      await api.sendMessage({
        body: `🎭 𝗔𝗻𝗶𝗺𝗲 𝗠𝗲𝗺𝗲\n\n𝗧𝗶𝘁𝗹𝗲: ${title}`,
        attachment: fs.createReadStream(tempImagePath)
      }, event.threadID);

      await api.unsendMessage(loadingMessage.messageID);

    } catch (error) {
      console.error('[ANIMEME] Detailed Error:', {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        } : null,
        stack: error.stack
      });

      let errorMessage = '❌ | An error occurred while fetching the anime meme.';
      
      if (error.code === 'ENOTFOUND') {
        errorMessage = '❌ | Network error. Please check your internet connection.';
      } else if (error.response && error.response.status === 429) {
        errorMessage = '❌ | Too many requests. Please try again later.';
      } else if (error.message.includes('No data received')) {
        errorMessage = '❌ | Reddit is not responding. Please try again later.';
      }

      await api.sendMessage(errorMessage, event.threadID);
    } finally {
      // Cleanup
      try {
        if (await fs.pathExists(tempImagePath)) {
          await fs.unlink(tempImagePath);
          console.log('[ANIMEME] Cleanup completed');
        }
      } catch (cleanupError) {
        console.error('[ANIMEME] Cleanup error:', cleanupError);
      }
    }
  }
};
