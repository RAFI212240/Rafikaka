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
    cooldowns: 5,
    guide: "Use {pn}flatpfp <cover_image_url> <profile_image_url>",
  },

  onStart: async function ({ message, args }) {
    if (args.length < 2) {
      return message.reply(
        "❌ Please provide cover and profile image URLs.\nExample:\nflatpfp <cover_url> <profile_url>"
      );
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
    const width = 700, height
    
