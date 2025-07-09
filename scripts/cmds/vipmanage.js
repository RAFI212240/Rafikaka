// File: scripts/cmds/vipmanage.js
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "vipmanage",
    aliases: ["vip"],
    version: "1.0",
    author: "Admin",
    countDown: 5,
    role: 2, // Admin only
    shortDescription: "Manage VIP users",
    longDescription: "Add or remove VIP users for Blue Archive command",
    category: "admin",
    guide: {
      en: "{pn} add <@user> | {pn} remove <@user> | {pn} list"
    }
  },

  onStart: async function ({ message, args, event, usersData }) {
    const vipFilePath = path.join(__dirname, '../../assets/vip.json');
    
    // Initialize vip.json if it doesn't exist
    let vipData = { vips: [] };
    if (!fs.existsSync(vipFilePath)) {
      const assetsDir = path.dirname(vipFilePath);
      if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
      }
      fs.writeFileSync(vipFilePath, JSON.stringify(vipData, null, 2));
    } else {
      try {
        const fileContent = fs.readFileSync(vipFilePath, 'utf8');
        vipData = JSON.parse(fileContent);
      } catch (err) {
        vipData = { vips: [] };
      }
    }

    const action = args[0]?.toLowerCase();

    if (action === 'list') {
      if (vipData.vips.length === 0) {
        return message.reply("📋 **VIP List**\n\n❌ No VIP users found.");
      }

      let listText = "📋 **VIP User List**\n\n";
      for (let i = 0; i < vipData.vips.length; i++) {
        const vip = vipData.vips[i];
        listText += `${i + 1}. **${vip.name || 'Unknown'}**\n`;
        listText += `   🆔 ID: ${vip.id}\n`;
        listText += `   📅 Added: ${vip.addedDate || 'Unknown'}\n\n`;
      }
      return message.reply(listText);
    }

    if (action === 'add') {
      const mentionID = Object.keys(event.mentions)[0];
      if (!mentionID) {
        return message.reply("❌ Please mention a user to add as VIP!\nExample: vip add @user");
      }

      // Check if already VIP
      if (vipData.vips.some(vip => vip.id === mentionID)) {
        return message.reply("⚠️ This user is already a VIP member!");
      }

      // Get user data
      let userName = event.mentions[mentionID] || "Unknown User";
      try {
        const userData = await usersData.get(mentionID);
        userName = userData.name || userName;
      } catch (error) {
        console.log("Could not get user data for VIP add");
      }

      // Add to VIP list
      vipData.vips.push({
        id: mentionID,
        name: userName,
        addedDate: new Date().toISOString().split('T')[0],
        addedBy: event.senderID
      });

      // Save to file
      fs.writeFileSync(vipFilePath, JSON.stringify(vipData, null, 2));

      return message.reply(
        `✅ **VIP Added Successfully!**\n\n` +
        `👑 **New VIP:** ${userName}\n` +
        `🆔 **ID:** ${mentionID}\n` +
        `📅 **Date:** ${new Date().toLocaleDateString()}\n\n` +
        `💎 **Benefits:** Access to Blue Archive VIP command`
      );
    }

    if (action === 'remove') {
      const mentionID = Object.keys(event.mentions)[0];
      if (!mentionID) {
        return message.reply("❌ Please mention a user to remove from VIP!\nExample: vip remove @user");
      }

      // Find and remove VIP
      const vipIndex = vipData.vips.findIndex(vip => vip.id === mentionID);
      if (vipIndex === -1) {
        return message.reply("⚠️ This user is not a VIP member!");
      }

      const removedVip = vipData.vips.splice(vipIndex, 1)[0];
      
      // Save to file
      fs.writeFileSync(vipFilePath, JSON.stringify(vipData, null, 2));

      return message.reply(
        `✅ **VIP Removed Successfully!**\n\n` +
        `👤 **Removed:** ${removedVip.name || 'Unknown'}\n` +
        `🆔 **ID:** ${mentionID}\n` +
        `📅 **Removed on:** ${new Date().toLocaleDateString()}`
      );
    }

    // Show help
    return message.reply(
      "🔧 **VIP Management Commands**\n\n" +
      "📝 **Usage:**\n" +
      "• vip add @user - Add VIP user\n" +
      "• vip remove @user - Remove VIP user\n" +
      "• vip list - Show all VIP users\n\n" +
      "👑 **VIP Benefits:**\n" +
      "• Access to Blue Archive command\n" +
      "• Exclusive content access"
    );
  }
};
