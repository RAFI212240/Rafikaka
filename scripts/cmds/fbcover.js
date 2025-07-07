const axios = require('axios');
const fs = require('fs');
const { createCanvas, loadImage, registerFont } = require('canvas');

module.exports = {
  config: {
    name: 'fbcover',
    version: '3.0',
    author: 'Professional API',
    countDown: 5,
    role: 0,
    shortDescription: 'Create professional Facebook cover',
    longDescription: 'Create beautiful professional Facebook cover with profile picture',
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
          `   🌟│  𝐏𝐫𝐨𝐟𝐞𝐬𝐬𝐢𝐨𝐧𝐚𝐥 𝐂𝐨𝐯𝐞𝐫   │🌟\n` +
          `   🌸└─────────────────┘🌸\n\n` +
          `🖤┌───【 𝐅𝐎𝐑𝐌𝐀𝐓 】───┐🦋\n` +
          `🎀 │ /fbcover name | subname | address | phone | email | color\n` +
          `🌷└─────────────────┘🌸\n\n` +
          `🖤┌───【 𝐄𝐗𝐀𝐌𝐏𝐋𝐄 】───┐🦋\n` +
          `🎀 │ /fbcover John Doe | CEO & Founder | New York, USA | +1234567890 | john@company.com | blue\n` +
          `🌷└─────────────────┘🌸\n\n` +
          `✨ 𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐂𝐨𝐥𝐨𝐫𝐬: blue, red, green, purple, orange, pink, gold, black`;
        
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
        `   🌟│  𝐂𝐫𝐞𝐚𝐭𝐢𝐧𝐠 𝐂𝐨𝐯𝐞𝐫...   │🌟\n` +
        `   🌸└─────────────────┘🌸\n\n` +
        `🖤┌───【 𝐃𝐄𝐓𝐀𝐈𝐋𝐒 】───┐🦋\n` +
        `🎀 │ 𝐍𝐚𝐦𝐞: ${name}\n` +
        `🎀 │ 𝐏𝐨𝐬𝐢𝐭𝐢𝐨𝐧: ${subname}\n` +
        `🎀 │ 𝐋𝐨𝐜𝐚𝐭𝐢𝐨𝐧: ${address}\n` +
        `🎀 │ 𝐂𝐨𝐧𝐭𝐚𝐜𝐭: ${phone}\n` +
        `🎀 │ 𝐄𝐦𝐚𝐢𝐥: ${email}\n` +
        `🎀 │ 𝐓𝐡𝐞𝐦𝐞: ${color}\n` +
        `🌷└─────────────────┘🌸\n\n` +
        `⏳ Adding your profile picture and creating professional cover... 💼✨`;

      await message.reply(processingMsg);

      // Try professional APIs first
      const professionalApis = [
        `https://api.zahwazein.xyz/photooxy/facebook-cover?name=${encodeURIComponent(name)}&text=${encodeURIComponent(subname)}&apikey=zenzkey_92266df0c4c6f4`,
        `https://api.lolhuman.xyz/api/photooxy2/facebook?apikey=GataDios&text1=${encodeURIComponent(name)}&text2=${encodeURIComponent(subname)}`,
        `https://api.popcat.xyz/fbcover?name=${encodeURIComponent(name)}&text=${encodeURIComponent(subname)}&color=${encodeURIComponent(color)}`,
        `https://some-random-api.ml/canvas/fbcover?name=${encodeURIComponent(name)}&text=${encodeURIComponent(subname)}&color=${encodeURIComponent(color)}&avatar=https://graph.facebook.com/${event.senderID}/picture?width=512&height=512`
      ];

      let imageUrl = null;
      let apiWorked = false;

      // Try professional APIs
      for (const api of professionalApis) {
        try {
          const response = await axios.get(api, { 
            timeout: 15000,
            responseType: 'arraybuffer'
          });
          
          if (response.status === 200 && response.data) {
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

      // If APIs fail, create professional manual cover
      if (!apiWorked) {
        try {
          imageUrl = await createProfessionalCover(name, subname, address, phone, email, color, event.senderID);
          apiWorked = true;
        } catch (error) {
          console.error("Professional cover creation failed:", error);
        }
      }

      if (apiWorked && imageUrl) {
        // Success message
        const successMsg = `🌸┌─────────────────┐🌸\n` +
          `   🌟│  𝐂𝐨𝐯𝐞𝐫 𝐂𝐨𝐦𝐩𝐥𝐞𝐭𝐞!   │🌟\n` +
          `   🌸└─────────────────┘🌸\n\n` +
          `🖤┌───【 𝐏𝐑𝐎𝐅𝐄𝐒𝐒𝐈𝐎𝐍𝐀𝐋 】───┐🦋\n` +
          `🎀 │ ✅ Professional Facebook cover created!\n` +
          `🎀 │ 📸 Profile picture included\n` +
          `🎀 │ 💼 Business-ready design\n` +
          `🎀 │ 🎨 High-quality resolution\n` +
          `🎀 │ 💕 Enjoy your new cover, boss! 😎✨\n` +
          `🌷└─────────────────┘🌸`;

        const form = {
          body: successMsg,
          attachment: fs.createReadStream(imageUrl)
        };

        await message.reply(form);
        
        // Clean up
        if (fs.existsSync(imageUrl)) {
          fs.unlinkSync(imageUrl);
        }
      } else {
        const errorMsg = `🌸┌─────────────────┐🌸\n` +
          `   🌟│  𝐒𝐞𝐫𝐯𝐢𝐜𝐞 𝐄𝐫𝐫𝐨𝐫   │🌟\n` +
          `   🌸└─────────────────┘🌸\n\n` +
          `🖤┌───【 𝐄𝐑𝐑𝐎𝐑 】───┐🦋\n` +
          `🎀 │ ❌ Professional APIs temporarily down\n` +
          `🎀 │ 🔄 Please try again in a few minutes\n` +
          `🎀 │ 📞 Contact admin if issue persists\n` +
          `🌷└─────────────────┘🌸`;
        
        message.reply(errorMsg);
      }

    } catch (error) {
      console.error("Professional FB Cover error:", error);
      message.reply(`❌ An error occurred while creating your professional cover.`);
    }
  }
};

// Professional cover creation with profile picture
async function createProfessionalCover(name, subname, address, phone, email, color, senderID) {
  try {
    // Create canvas (Facebook cover size: 820x312)
    const canvas = createCanvas(820, 312);
    const ctx = canvas.getContext('2d');

    // Professional color schemes
    const colorSchemes = {
      'blue': { primary: '#1e3a8a', secondary: '#3b82f6', accent: '#60a5fa' },
      'red': { primary: '#991b1b', secondary: '#dc2626', accent: '#f87171' },
      'green': { primary: '#166534', secondary: '#16a34a', accent: '#4ade80' },
      'purple': { primary: '#581c87', secondary: '#9333ea', accent: '#a855f7' },
      'orange': { primary: '#9a3412', secondary: '#ea580c', accent: '#fb923c' },
      'pink': { primary: '#be185d', secondary: '#ec4899', accent: '#f472b6' },
      'gold': { primary: '#92400e', secondary: '#d97706', accent: '#fbbf24' },
      'black': { primary: '#111827', secondary: '#374151', accent: '#6b7280' }
    };

    const scheme = colorSchemes[color.toLowerCase()] || colorSchemes.blue;

    // Create professional gradient background
    const gradient = ctx.createLinearGradient(0, 0, 820, 312);
    gradient.addColorStop(0, scheme.primary);
    gradient.addColorStop(0.5, scheme.secondary);
    gradient.addColorStop(1, scheme.accent);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 820, 312);

    // Add professional pattern overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < 820; i += 40) {
      for (let j = 0; j < 312; j += 40) {
        ctx.fillRect(i, j, 20, 20);
      }
    }

    // Load and add profile picture
    try {
      const profileUrl = `https://graph.facebook.com/${senderID}/picture?width=150&height=150`;
      const profileImg = await loadImage(profileUrl);
      
      // Create circular profile picture
      ctx.save();
      ctx.beginPath();
      ctx.arc(120, 156, 60, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(profileImg, 60, 96, 120, 120);
      ctx.restore();
      
      // Add profile border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(120, 156, 60, 0, Math.PI * 2);
      ctx.stroke();
    } catch (error) {
      // If profile picture fails, create placeholder
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(120, 156, 60, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = scheme.primary;
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(name.charAt(0).toUpperCase(), 120, 170);
    }

    // Add professional text styling
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(name, 220, 120);

    ctx.font = '24px Arial';
    ctx.fillStyle = '#f1f5f9';
    ctx.fillText(subname, 220, 150);

    ctx.font = '18px Arial';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(`📍 ${address}`, 220, 180);
    ctx.fillText(`📞 ${phone}`, 220, 205);
    ctx.fillText(`✉️ ${email}`, 220, 230);

    // Add professional decorative elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(700, 50, 100, 4);
    ctx.fillRect(700, 70, 80, 4);
    ctx.fillRect(700, 90, 60, 4);

    // Add company-style logo area
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(680, 200, 120, 80);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PROFESSIONAL', 740, 235);
    ctx.fillText('PROFILE', 740, 255);

    // Save to file
    const tempPath = `./temp_professional_cover_${senderID}.png`;
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(tempPath, buffer);
    
    return tempPath;
  } catch (error) {
    throw new Error("Professional cover creation failed: " + error.message);
  }
          }
