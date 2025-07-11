const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

module.exports = {
  config: {
    name: "flatpfp",
    version: "1.0",
    author: "Perplexity AI",
    description: "Generate a flat style cover+profile image like the sample!",
    category: "media",
    countDown: 5,
    guide: "Use {pn}flatpfp <cover_image_url> <profile_image_url>",
  },

  onStart: async function ({ message, args }) {
    if (args.length < 2) {
      return message.reply("❌ Please provide cover and profile image URLs.\nExample:\nflatpfp <cover_url> <profile_url>");
    }

    const coverUrl = args[0];
    const profileUrl = args[1];

    // Load images
    let coverImg, profileImg;
    try {
      coverImg = await loadImage(coverUrl);
      profileImg = await loadImage(profileUrl);
    } catch (e) {
      return message.reply("❌ Couldn't load one or both images. Please check the URLs.");
    }

    // Canvas settings
    const width = 700, height = 700;
    const coverH = 260;
    const avatarSize = 210;
    const avatarY = coverH - 30;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Draw background (white)
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);

    // Draw cover photo (rounded rectangle)
    const radius = 40;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(radius, 30);
    ctx.lineTo(width - radius, 30);
    ctx.quadraticCurveTo(width, 30, width, 30 + radius);
    ctx.lineTo(width, coverH - radius);
    ctx.quadraticCurveTo(width, coverH, width - radius, coverH);
    ctx.lineTo(radius, coverH);
    ctx.quadraticCurveTo(0, coverH, 0, coverH - radius);
    ctx.lineTo(0, 30 + radius);
    ctx.quadraticCurveTo(0, 30, radius, 30);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(coverImg, 0, 0, width, coverH);
    ctx.restore();

    // Draw small stars (optional, for effect)
    ctx.save();
    ctx.globalAlpha = 0.13;
    for (let i = 0; i < 25; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = "#888";
      ctx.fill();
    }
    ctx.restore();

    // Draw profile picture (circle, shadow)
    ctx.save();
    ctx.beginPath();
    ctx.arc(width / 2, avatarY + avatarSize / 2, avatarSize / 2 + 12, 0, Math.PI * 2, true);
    ctx.shadowColor = "rgba(0,0,0,0.20)";
    ctx.shadowBlur = 30;
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(width / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(profileImg, width / 2 - avatarSize / 2, avatarY, avatarSize, avatarSize);
    ctx.restore();

    // Draw white border
    ctx.save();
    ctx.beginPath();
    ctx.arc(width / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true);
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#fff";
    ctx.stroke();
    ctx.restore();

    // Save temp file
    const tempDir = path.join(__dirname, "..", "..", "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    const fileName = `flatpfp_${crypto.randomBytes(8).toString("hex")}.png`;
    const tempFile = path.join(tempDir, fileName);

    const out = fs.createWriteStream(tempFile);
    const stream = canvas.createPNGStream();
    stream.pipe(out);

    await new Promise((resolve, reject) => {
      out.on("finish", resolve);
      out.on("error", reject);
    });

    await message.reply({
      body: "✨ Here is your flat style cover+profile image!",
      attachment: fs.createReadStream(tempFile),
    });

    fs.unlinkSync(tempFile);
  },
};
