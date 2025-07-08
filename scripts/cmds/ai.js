const axios = require("axios");

module.exports = {
	config: {
		name: "ai",
		aliases: ["blackbox", "ask"],
		version: "2.0",
		author: "Enhanced BlackBox AI",
		countDown: 5,
		role: 0,
		shortDescription: "AI Assistant powered by BlackBox",
		longDescription: "Get intelligent answers for coding, general knowledge, and technical questions",
		category: "ai",
		guide: {
			en: "{pn} <your question>\nExample: {pn} How to create a website?"
		}
	},

	onStart: async function ({ api, event, args, message }) {
		const { messageID, threadID } = event;
		const question = args.join(" ");

		if (!question) {
			const guideMsg = `🤖 BlackBox AI Assistant\n\n` +
				`📝 Usage: /ai <your question>\n\n` +
				`💡 Examples:\n` +
				`• /ai How to learn Python?\n` +
				`• /ai Explain machine learning\n` +
				`• /ai Write a JavaScript function\n` +
				`• /ai What is React.js?\n\n` +
				`🔥 Specialized in: Programming, Tech, General Knowledge`;
			
			return message.reply(guideMsg);
		}

		try {
			// Set reaction and send processing message
			api.setMessageReaction("🤖", messageID, (err) => {}, true);
			
			const processingMsg = `🔍 BlackBox AI is analyzing your question...\n⏳ Please wait a moment...`;
			await message.reply(processingMsg);

			// BlackBox AI API call
			const url = "https://useblackbox.io/chat-request-v4";
			const data = {
				textInput: question,
				allMessages: [{ user: question }],
				stream: "",
				clickedContinue: false,
			};

			const response = await axios.post(url, data, {
				timeout: 30000,
				headers: {
					'Content-Type': 'application/json',
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
				}
			});

			if (response.data && response.data.response && response.data.response[0]) {
				let answer = response.data.response[0][0];
				
				// Clean up the response
				answer = answer.replace(/\*\*/g, '').replace(/\*/g, '');
				
				// Format the response
				const formattedAnswer = `🤖 BlackBox AI Response:\n\n${answer}\n\n💡 Ask me anything else!`;
				
				api.setMessageReaction("✅", messageID, (err) => {}, true);
				return message.reply(formattedAnswer);
			} else {
				throw new Error("Invalid response from BlackBox AI");
			}

		} catch (error) {
			console.error("BlackBox AI Error:", error.message);
			
			api.setMessageReaction("❌", messageID, (err) => {}, true);
			
			const errorMsg = `❌ BlackBox AI Error\n\n` +
				`🔧 Possible issues:\n` +
				`• API temporarily down\n` +
				`• Network connection problem\n` +
				`• Question too complex\n\n` +
				`💡 Please try again or rephrase your question.`;
			
			return message.reply(errorMsg);
		}
	},
};
