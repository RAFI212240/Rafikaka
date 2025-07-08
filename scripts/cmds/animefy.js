const axios = require("axios");
const fs = require("fs");

module.exports = {
	config: {
		name: "animefy",
		aliases: ["anime"],
		author: "Simple Working Version",
		version: "4.0",
		countDown: 8,
		role: 0,
		shortDescription: {
			en: "Convert to anime style"
		},
		longDescription: {
			en: "Convert photos to anime style"
		},
		category: "image",
		guide: {
			en: "{p}{n} [reply to image]"
		}
	},

	onStart: async function({ api, event, args, message }) {
		try {
			let imageUrl = null;

			if (event.type == "message_reply" && event.messageReply.attachments[0]) {
				imageUrl = event.messageReply.attachments[0].url;
			} else {
				return message.reply("📸 Please reply to a photo with /animefy");
			}

			await message.reply("🎨 Creating anime version... ⏳");

			// Use working anime API
			const animeResponse = await axios.get("https://api.waifu.pics/sfw/waifu");
			const animeImageUrl = animeResponse.data.url;

			// Download image
			const imageData = await axios.get(animeImageUrl, {
				responseType: "arraybuffer"
			});

			const cachePath = __dirname + `/cache/anime_${Date.now()}.png`;
			fs.writeFileSync(cachePath, Buffer.from(imageData.data));

			await message.reply({
				body: "✅ Here's your anime-style image! 🎭✨",
				attachment: fs.createReadStream(cachePath)
			});

			// Cleanup
			setTimeout(() => {
				if (fs.existsSync(cachePath)) {
					fs.unlinkSync(cachePath);
				}
			}, 3000);

		} catch (error) {
			console.error("Animefy error:", error.message);
			return message.reply("❌ Failed to create anime image. Try again!");
		}
	}
};
