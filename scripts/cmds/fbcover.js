const axios = require('axios');
const fs = require('fs');

module.exports = {
  config: {
    name: "fbcover",
    version: "3.0",
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

      // BannerBear API Configuration
      const BANNERBEAR_API_KEY = "YOUR_BANNERBEAR_API_KEY"; // Replace with your BannerBear API key
      const TEMPLATE_UID = "YOUR_TEMPLATE_UID"; // Replace with your template UID

      const payload = {
        template_uid: TEMPLATE_UID,
        modifications: [
          { name: "name", text: name },
          { name: "subname", text: subname },
          { name: "address", text: address },
          { name: "phone", text: phone },
          { name: "email", text: email },
          { name: "background_color", color: color }
        ]
      };

      try {
        // Call BannerBear API
        const response = await axios.post(
          "https://api.bannerbear.com/v2/images",
          payload,
          {
            headers: {
              Authorization: `Bearer ${BANNERBEAR_API_KEY}`,
              "Content-Type": "application/json"
            }
          }
        );

        const imageUrl = response.data.image_url;

        // Download and send the image
        const attachment = await global.utils.getStreamFromURL(imageUrl);

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
        console.error("BannerBear API error:", error.response ? error.response.data : error.message);
        return message.reply("❌ Failed to generate the cover. Please try again later.");
      }

    } catch (error) {
      console.error("Fbcover command error:", error);
      message.reply("❌ An unexpected error occurred. Please try again.");
    }
  }
};
