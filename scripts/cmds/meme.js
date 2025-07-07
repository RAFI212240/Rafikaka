const axios = require('axios');

module.exports = {
  config: {
    name: 'meme',
    aliases: ['funnymeme', 'memepic'],
    version: '2.0',
    author: 'Advanced Meme Bot',
    role: 0,
    category: 'funny',
    shortDescription: {
      en: 'Get random memes or anime-specific memes'
    },
    longDescription: {
      en: 'Get random memes or search for specific anime memes in Bangla and English'
    },
    guide: {
      en: '{pn} [empty for random] or {pn} <anime name>'
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const searchTerm = args.join(' ').toLowerCase();

      // Processing message
      const processingMsg = `🌸┌─────────────────┐🌸\n` +
        `   🌟│  𝐌𝐞𝐦𝐞 𝐋𝐨𝐚𝐝𝐢𝐧𝐠...   │🌟\n` +
        `   🌸└─────────────────┘🌸\n\n` +
        `🖤┌───【 𝐒𝐄𝐀𝐑𝐂𝐇 】───┐🦋\n` +
        `🎀 │ ${searchTerm ? `Finding ${searchTerm} memes...` : 'Getting random memes...'}\n` +
        `🌷└─────────────────┘🌸\n\n` +
        `⏳ Please wait, preparing funny content... 😂`;

      await message.reply(processingMsg);

      let imageURL = null;
      let memeText = '';

      if (searchTerm) {
        // Search for specific anime/topic memes
        imageURL = await getSpecificMeme(searchTerm);
        memeText = `🎌 ${searchTerm.toUpperCase()} MEME`;
      } else {
        // Get random meme
        imageURL = await getRandomMeme();
        memeText = '🎭 RANDOM MEME';
      }

      if (!imageURL) {
        throw new Error('No meme found');
      }

      // Success message
      const successMsg = `🌸┌─────────────────┐🌸\n` +
        `   🌟│  ${memeText}   │🌟\n` +
        `   🌸└─────────────────┘🌸\n\n` +
        `🖤┌───【 𝐄𝐍𝐉𝐎𝐘 】───┐🦋\n` +
        `🎀 │ 😂 Here's your funny meme!\n` +
        `🎀 │ 🔄 Type /meme for another random\n` +
        `🎀 │ 🎌 Type /meme <anime> for specific\n` +
        `🌷└─────────────────┘🌸`;

      const stream = await global.utils.getStreamFromURL(imageURL);

      if (!stream) {
        throw new Error('Failed to fetch image');
      }

      await message.reply({
        body: successMsg,
        attachment: stream
      });

    } catch (error) {
      console.error(`Meme command error: ${error.message}`);
      
      const errorMsg = `🌸┌─────────────────┐🌸\n` +
        `   🌟│  𝐌𝐞𝐦𝐞 𝐄𝐫𝐫𝐨𝐫   │🌟\n` +
        `   🌸└─────────────────┘🌸\n\n` +
        `🖤┌───【 𝐄𝐑𝐑𝐎𝐑 】───┐🦋\n` +
        `🎀 │ ❌ Failed to load meme\n` +
        `🎀 │ 🔄 Please try again\n` +
        `🎀 │ 💡 Try: /meme or /meme naruto\n` +
        `🌷└─────────────────┘🌸`;
      
      message.reply(errorMsg);
    }
  }
};

// Get random memes from multiple sources
async function getRandomMeme() {
  const memeAPIs = [
    // Reddit memes
    'https://meme-api.herokuapp.com/gimme',
    'https://meme-api.herokuapp.com/gimme/memes',
    'https://meme-api.herokuapp.com/gimme/dankmemes',
    'https://meme-api.herokuapp.com/gimme/wholesomememes',
    
    // ImgFlip memes
    'https://api.imgflip.com/get_memes',
    
    // Other meme sources
    'https://some-random-api.ml/meme',
    'https://api.popcat.xyz/meme'
  ];

  for (const api of memeAPIs) {
    try {
      const response = await axios.get(api, { timeout: 10000 });
      
      if (api.includes('imgflip')) {
        if (response.data.success && response.data.data.memes) {
          const memes = response.data.data.memes;
          const randomMeme = memes[Math.floor(Math.random() * memes.length)];
          return randomMeme.url;
        }
      } else if (api.includes('some-random-api') || api.includes('popcat')) {
        if (response.data.image) {
          return response.data.image;
        }
      } else {
        // Reddit APIs
        if (response.data.url && !response.data.nsfw) {
          return response.data.url;
        }
      }
    } catch (error) {
      console.log(`API failed: ${api}`);
      continue;
    }
  }
  
  return null;
}

// Get specific anime/topic memes
async function getSpecificMeme(searchTerm) {
  // Anime-specific meme sources
  const animeAPIs = [
    `https://meme-api.herokuapp.com/gimme/animemes`,
    `https://meme-api.herokuapp.com/gimme/anime_irl`,
    `https://meme-api.herokuapp.com/gimme/Animemes`,
    `https://api.jikan.moe/v4/random/anime`,
  ];

  // Popular anime keywords mapping
  const animeKeywords = {
    'naruto': ['naruto', 'hokage', 'ninja', 'konoha'],
    'onepiece': ['luffy', 'pirate', 'strawhat', 'onepiece'],
    'dragonball': ['goku', 'vegeta', 'saiyan', 'dragonball'],
    'attackontitan': ['eren', 'titan', 'survey corps', 'aot'],
    'demonslayer': ['tanjiro', 'demon', 'slayer', 'kimetsu'],
    'jujutsu': ['yuji', 'gojo', 'curse', 'jujutsu'],
    'bleach': ['ichigo', 'soul reaper', 'hollow', 'bleach'],
    'pokemon': ['pikachu', 'pokemon', 'ash', 'pokeball']
  };

  // First try anime-specific APIs
  for (const api of animeAPIs) {
    try {
      const response = await axios.get(api, { timeout: 10000 });
      
      if (api.includes('meme-api')) {
        if (response.data.url && !response.data.nsfw) {
          // Check if title contains search term
          const title = response.data.title?.toLowerCase() || '';
          const keywords = animeKeywords[searchTerm] || [searchTerm];
          
          if (keywords.some(keyword => title.includes(keyword))) {
            return response.data.url;
          }
        }
      }
    } catch (error) {
      continue;
    }
  }

  // If no specific anime meme found, try general search
  try {
    const searchAPIs = [
      `https://meme-api.herokuapp.com/gimme/50`,
      `https://api.imgflip.com/get_memes`
    ];

    for (const api of searchAPIs) {
      const response = await axios.get(api, { timeout: 10000 });
      
      if (api.includes('meme-api') && response.data.memes) {
        // Filter memes by search term
        const filteredMemes = response.data.memes.filter(meme => {
          const title = meme.title?.toLowerCase() || '';
          const keywords = animeKeywords[searchTerm] || [searchTerm];
          return keywords.some(keyword => title.includes(keyword)) && !meme.nsfw;
        });
        
        if (filteredMemes.length > 0) {
          const randomMeme = filteredMemes[Math.floor(Math.random() * filteredMemes.length)];
          return randomMeme.url;
        }
      } else if (api.includes('imgflip') && response.data.success) {
        // Use ImgFlip to create custom meme
        const templates = response.data.data.memes;
        const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
        
        // Create custom meme with search term
        const customMemeAPI = `https://api.imgflip.com/caption_image?template_id=${randomTemplate.id}&text0=${searchTerm}&text1=Meme&username=imgflip_hubot&password=imgflip_hubot`;
        
        try {
          const customResponse = await axios.get(customMemeAPI);
          if (customResponse.data.success) {
            return customResponse.data.data.url;
          }
        } catch (error) {
          continue;
        }
      }
    }
  } catch (error) {
    console.log('Search APIs failed');
  }

  // Fallback: return random meme if specific search fails
  return await getRandomMeme();
    }
