module.exports = {
	config: {
		name: "kick",
		version: "1.2",
		author: "NTKhang",
		countDown: 5,
		role: 1,
		shortDescription: {
			vi: "Kick thành viên",
			en: "Kick member"
		},
		longDescription: {
			vi: "Kick thành viên khỏi box chat",
			en: "Kick member out of chat box"
		},
		category: "box chat",
		guide: {
			vi: "   {pn} @tags: dùng để kick những người được tag",
			en: "   {pn} @tags: use to kick members who are tagged"
		}
	},

	langs: {
		vi: {
			needAdmin: "Vui lòng thêm quản trị viên cho bot trước khi sử dụng tính năng này",
			kickSuccess: "Đã kick thành công",
			kickError: "Không thể kick thành viên này",
			noPermission: "Bot không có quyền admin để kick thành viên"
		},
		en: {
			needAdmin: "Please add admin for bot before using this feature",
			kickSuccess: "Successfully kicked member",
			kickError: "Cannot kick this member", 
			noPermission: "Bot doesn't have admin permission to kick members"
		}
	},

	onStart: async function ({ message, event, args, threadsData, api, getLang }) {
		const adminIDs = await threadsData.get(event.threadID, "adminIDs");
		if (!adminIDs.includes(api.getCurrentUserID()))
			return message.reply(getLang("needAdmin"));
			
		async function kickAndCheckError(uid) {
			try {
				await api.removeUserFromGroup(uid, event.threadID);
				return "SUCCESS";
			}
			catch (e) {
				message.reply(getLang("needAdmin"));
				return "ERROR";
			}
		}
		
		if (!args[0]) {
			if (!event.messageReply)
				return message.SyntaxError();
			const result = await kickAndCheckError(event.messageReply.senderID);
			if (result === "SUCCESS") {
				message.reply(getLang("kickSuccess"));
			}
		}
		else {
			const uids = Object.keys(event.mentions);
			if (uids.length === 0)
				return message.SyntaxError();
			
			const result = await kickAndCheckError(uids.shift());
			if (result === "ERROR")
				return;
				
			for (const uid of uids) {
				try {
					await api.removeUserFromGroup(uid, event.threadID);
				} catch (e) {
					console.log("Error kicking user:", uid);
				}
			}
			message.reply(getLang("kickSuccess"));
		}
	}
};
