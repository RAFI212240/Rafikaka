const axios = require('axios');
const jimp = require('jimp');
const fs = require('fs');

module.exports = {
  config: {
    name: "fbcover",
    version: "2.0",
    author: "munem (Modified by Elohime)",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Create a stylish Facebook banner"
    },
    longDescription: {
      en: "Create a personalized Facebook banner with your details."
    },
    category: "image",
    guide: {
      en: "{p}{n} <name> | <subname> | <address> | <phone> | <email> | <color>"
    }
  },

  onStart: async function ({ message, args, event }) {
    try {
      const info = args.join(" ");
      if (!info) {
        return message.reply(`🌸 Please provide the details in this format:\n\n/fbcover <name> | <subname> | <address> | <phone> | <email> | <color>\n\nExample:\n/fbcover John Doe | Developer | New York | +123456789 | john@example.com | #FF5733`);
      }

      // Parse input
      const msg = info.split("|").map(item => item.trim());
      if (msg.length < 6) {
        return message.reply("❌ Please provide all required fields.");
      }

      const [name, subname, address, phone, email, color] = msg;

      // Validate color code
      const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!colorRegex.test(color)) {
        return message.reply("❌ Invalid color code. Please use a valid HEX color (e.g., #FFFFFF).");
      }

      // Processing message
      await message.reply("✨ Creating your Facebook cover... Please wait ❤️");

      // Generate cover image URL
      const imgURL = `https://www.nguyenmanh.name.vn/api/fbcover1?name=${encodeURIComponent(name)}&uid=${event.senderID}&address=${encodeURIComponent(address)}&email=${encodeURIComponent(email)}&subname=${encodeURIComponent(subname)}&sdt=${encodeURIComponent(phone)}&color=${encodeURIComponent(color)}&apikey=sr7dxQss`;

      // Download and send the image
      try {
        const attachment = await global.utils.getStreamFromURL(imgURL);

        // Stylish response
        const resultText = `🌸─────「 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐂𝐨𝐯𝐞𝐫 」─────🌸\n\n` +
          `   👤 Name: ${name}\n` +
          `   📝 Subname: ${subname}\n` +
          `   📍 Address: ${address}\n` +
          `   📞 Phone: ${phone}\n` +
          `   ✉️ Email: ${email}\n` +
          `   🎨 Color: ${color}\n\n` +
          `✨ Here's your personalized Facebook cover! ❤️`;

        await message.reply({
          body: resultText,
          attachment: attachment
        });
      } catch (error) {
        console.error("Image download error:", error);
        return message.reply("❌ Failed to generate the cover. Please try again later.");
      }

    } catch (error) {
      console.error("Fbcover command error:", error);
      message.reply("❌ An unexpected error occurred. Please try again.");
    }
  }
};
