const axios = require('axios');
const fs = require('fs');

module.exports = {
  config: {
    name: 'fbcover',
    version: '2.0',
    author: 'Updated API',
    countDown: 5,
    role: 0,
    shortDescription: 'Create Facebook banner',
    longDescription: 'Create beautiful Facebook cover photos with custom details',
    category: 'image',
    guide: {
      en: '{p}{n} <name> | <subname> | <address> | <phone> | <email> | <color>',
    }
  },

  onStart: async function ({ message, args, event, api }) {
    try {
      const info = args.join(' ');
      
      if (!info) {
        const guideMsg = `🌸┌─────────────────┐🌸\n` +
          `   🌟│  𝐅𝐁 𝐂𝐨𝐯𝐞𝐫 𝐆𝐮𝐢𝐝𝐞   │🌟\n` +
          `   🌸└─────────────────┘🌸\n\n` +
          `🖤┌───【 𝐅𝐎𝐑𝐌𝐀𝐓 】───┐🦋\n` +
          `🎀 │ /fbcover name | subname | address | phone | email | color\n` +
          `🌷└─────────────────┘🌸\n\n` +
          `🖤┌───【 𝐄𝐗𝐀𝐌𝐏𝐋𝐄 】───┐🦋\n` +
          `🎀 │ /fbcover John Doe | Web Developer | New York | +1234567890 | john@email.com | blue\n` +
          `🌷└─────────────────┘🌸\n\n` +
          `✨ 𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐂𝐨𝐥𝐨𝐫𝐬: red, blue, green, purple, orange, pink`;
        
        return message.reply(guideMsg);
      }

      const msg = info.split('|');
      
      if (msg.length < 5) {
        return message.reply(`❌ Please provide all required information:\nname | subname | address | phone | email | color`);
      }

      const name = msg[0]?.trim();
      const subname = msg[1]?.trim();
      const address = msg[2]?.trim();
      const phone = msg[3]?.trim();
      const email = msg[4]?.trim();
      const color = msg[5]?.trim() || 'blue';

      // Processing message
      const processingMsg = `🌸┌─────────────────┐🌸\n` +
        `   🌟│  𝐏𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠...   │🌟\n` +
        `   🌸└─────────────────┘🌸\n\n` +
        `🖤┌───【 𝐃𝐄𝐓𝐀𝐈𝐋𝐒 】───┐🦋\n` +
        `🎀 │ 𝐍𝐚𝐦𝐞: ${name}\n` +
        `🎀 │ 𝐒𝐮𝐛𝐧𝐚𝐦𝐞: ${subname}\n` +
        `🎀 │ 𝐀𝐝𝐝𝐫𝐞𝐬𝐬: ${address}\n` +
        `🎀 │ 𝐏𝐡𝐨𝐧𝐞: ${phone}\n` +
        `🎀 │ 𝐄𝐦𝐚𝐢𝐥: ${email}\n` +
        `🎀 │ 𝐂𝐨𝐥𝐨𝐫: ${color}\n` +
        `🌷└─────────────────┘🌸\n\n` +
        `⏳ Creating your cover, senpai... ❤️`;

      await message.reply(processingMsg);

      // Multiple working APIs (fallback system)
      const apis = [
        `https://api.popcat.xyz/fbcover?name=${encodeURIComponent(name)}&text=${encodeURIComponent(subname)}&color=${encodeURIComponent(color)}`,
        `https://api-canvacord.herokuapp.com/fbcover?name=${encodeURIComponent(name)}&text=${encodeURIComponent(subname)}&avatar=https://graph.facebook.com/${event.senderID}/picture?width=512&height=512`,
        `https://some-random-api.ml/canvas/fbcover?name=${encodeURIComponent(name)}&text=${encodeURIComponent(subname)}&color=${encodeURIComponent(color)}`,
        `https://api.zahwazein.xyz/photooxy/facebook-cover?name=${encodeURIComponent(name)}&text=${encodeURIComponent(subname)}&apikey=zenzkey_92266df0c4c6f4`
      ];

      let imageUrl = null;
      let apiWorked = false;

      // Try each API until one works
      for (const api of apis) {
        try {
          const response = await axios.get(api, { 
            timeout: 10000,
            responseType: 'arraybuffer'
          });
          
          if (response.status === 200 && response.data) {
            // Save image temporarily
            const tempPath = `./temp_cover_${event.senderID}.png`;
            fs.writeFileSync(tempPath, response.data);
            imageUrl = tempPath;
            apiWorked = true;
            break;
          }
        } catch (error) {
          console.log(`API failed: ${api}`);
          continue;
        }
      }

      // If no API worked, try manual canvas creation
      if (!apiWorked) {
        try {
          imageUrl = await createManualCover(name, subname, address, phone, email, color, event.senderID);
          apiWorked = true;
        } catch (error) {
          console.error("Manual cover creation failed:", error);
        }
      }

      if (apiWorked && imageUrl) {
        // Success message
        const successMsg = `🌸┌─────────────────┐🌸\n` +
          `   🌟│  𝐂𝐨𝐯𝐞𝐫 𝐑𝐞𝐚𝐝𝐲!   │🌟\n` +
          `   🌸└─────────────────┘🌸\n\n` +
          `🖤┌───【 𝐒𝐔𝐂𝐂𝐄𝐒𝐒 】───┐🦋\n` +
          `🎀 │ Your Facebook cover has been created successfully! 💕\n` +
          `🎀 │ Enjoy your new cover, senpai! 😻❤️\n` +
          `🌷└─────────────────┘🌸`;

        const form = {
          body: successMsg,
          attachment: fs.createReadStream(imageUrl)
        };

        await message.reply(form);
        
        // Clean up temp file
        if (fs.existsSync(imageUrl)) {
          fs.unlinkSync(imageUrl);
        }
      } else {
        // All APIs failed
        const errorMsg = `🌸┌─────────────────┐🌸\n` +
          `   🌟│  𝐀𝐏𝐈 𝐄𝐫𝐫𝐨𝐫   │🌟\n` +
          `   🌸└─────────────────┘🌸\n\n` +
          `🖤┌───【 𝐄𝐑𝐑𝐎𝐑 】───┐🦋\n` +
          `🎀 │ ❌ All APIs are currently down\n` +
          `🎀 │ 🔄 Please try again later\n` +
          `🎀 │ 📞 Contact admin if issue persists\n` +
          `🌷└─────────────────┘🌸`;
        
        message.reply(errorMsg);
      }

    } catch (error) {
      console.error("FB Cover command error:", error);
      message.reply(`❌ An error occurred while creating your cover. Please try again.`);
    }
  }
};

// Manual cover creation using Canvas (fallback)
async function createManualCover(name, subname, address, phone, email, color, senderID) {
  try {
    const { createCanvas, loadImage, registerFont } = require('canvas');
    
    // Create canvas (Facebook cover size: 820x312)
    const canvas = createCanvas(820, 312);
    const ctx = canvas.getContext('2d');

    // Color mapping
    const colors = {
      'red': '#FF6B6B',
      'blue': '#4ECDC4',
      'green': '#45B7D1',
      'purple': '#96CEB4',
      'orange': '#FFEAA7',
      'pink': '#FD79A8'
    };

    const bgColor = colors[color.toLowerCase()] || '#4ECDC4';

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 820, 312);
    gradient.addColorStop(0, bgColor);
    gradient.addColorStop(1, '#2D3436');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 820, 312);

    // Add decorative elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.arc(700, 50, 80, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(100, 250, 60, 0, Math.PI * 2);
    ctx.fill();

    // Add text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(name, 410, 120);

    ctx.font = '24px Arial';
    ctx.fillText(subname, 410, 160);

    ctx.font = '18px Arial';
    ctx.fillText(address, 410, 200);
    ctx.fillText(`${phone} | ${email}`, 410, 230);

    // Save to file
    const tempPath = `./temp_manual_cover_${senderID}.png`;
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(tempPath, buffer);
    
    return tempPath;
  } catch (error) {
    throw new Error("Manual cover creation failed");
  }
        }
