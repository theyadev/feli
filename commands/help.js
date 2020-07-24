const Discord = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["commands"],
  description: "Show an help embed.",
  execute(message, args) {
    const data = [];
    const { commands } = message.client;

    if (!args.length) {
      const embed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setAuthor(
          "Command list for Feli:",
          "https://cdn.discordapp.com/avatars/661375772765716480/0328a8e4a5e8c8a4b740e3d17d4fd22c.png?size=256",
          "https://theyabot.ddns.net"
        )
        .setDescription(
          "**Administration** - `reload`\n**osu!** - `recommend` `mode` `request` `maps`\n**TETR.IO** - `set` `profile` `top` `recent`"
        )
        .setTimestamp()
        .setFooter("https://discord.gg/bUsRruH");
      return message.channel.send(embed);
    }
    const name = args[0].toLowerCase();
    const command =
      commands.get(name) ||
      commands.find((c) => c.aliases && c.aliases.includes(name));

    if (!command) {
      return message.reply("that's not a valid command!");
    }
    let desc = "";
    const embed_ = new Discord.MessageEmbed()
      .setColor("#0099ff")
      //.setTitle()
      .setTimestamp()
      .setFooter("https://discord.gg/bUsRruH");

    //data.push(`**Name:** ${command.name}`);

    desc = desc.concat(
      "```%" + command.name + " " + (command.criteria || "") + "```"
    );

    if (command.description) {
      if (desc.length != 0) {
        desc = desc.concat("\n");
      }
      desc = desc.concat(`${command.description}\n`);
    }

    if (command.options) {
      if (desc.length != 0) {
        desc = desc.concat("\n");
      }
      desc = desc.concat(`${command.options}`);
    }

    if (command.aliases) {
      if (desc.length != 0) {
        desc = desc.concat("\n");
      }
      desc = desc.concat(`**Aliases:** ${command.aliases}`);
    }

    //data.push(`**Aliases:** ${command.aliases.join(", ")}`);
    //data.push(`**Description:** ${command.description}`);
    if (command.usage) {
      if (desc.length != 0) {
        desc = desc.concat("\n");
      }
      desc = desc.concat(
        `**Usage:** ${prefix}${command.name} ${command.usage}`
      );
    }
    //data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

    if (desc.length != 0) {
      desc = desc.concat("\n");
    }
    desc = desc.concat(`**Cooldown:** ${command.cooldown || 3} second(s)`);
    embed_.setDescription(desc);
    // data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

    message.channel.send(embed_);
  },
};
