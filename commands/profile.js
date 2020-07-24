const Discord = require("discord.js");
const getUser = require("../functions/cache").user;
const fetchId = require("../functions/cache").id;
const getColor = require("../functions/details").color;

async function getProfile(name, type, message) {
  getUser(name, type, function (res) {
    if (res == null) return message.reply("user not found.");
    let color = getColor(res.tetraLeague.rank).toString();
    const embed = new Discord.MessageEmbed()
      .setColor(color)
      .setThumbnail(
        `https://tetr.io/res/league-ranks/${res.tetraLeague.rank}.png`
      )
      .setTimestamp().setDescription(`**▸ Rank:** #${
      res.tetraLeague.standing
    } (${Math.round(res.tetraLeague.rating)}TR)
    **▸ Glicko:** ${res.tetraLeague.glicko} ± ${res.tetraLeague.rd}
    **▸ Games Won:** ${res.tetraLeague.gamesWon}/${
      res.tetraLeague.gamesPlayed
    } (${
      Math.round(
        (res.tetraLeague.gamesWon / res.tetraLeague.gamesPlayed) * 1000
      ) / 10
    }%)
    **▸ APM:** ${res.tetraLeague.apm} **▸ PPS:** ${
      res.tetraLeague.pps
    } **▸ VS:** ${res.tetraLeague.vs}
    **▸ Experience:** ${res.exp}`);
    let authorFlag = "";
    if (res.country) {
      authorFlag = `https://tetr.io/res/flags/${res.country.toLowerCase()}.png`;
    }
    embed.setAuthor(
      `TETR.IO Profile for ${
        res.username[0].toUpperCase() + res.username.slice(1)
      }`,
      authorFlag,
      `https://tetrio.team2xh.net/?t=player&p=${res.username}`
    );

    message.channel.send(embed);
  });
}

module.exports = {
  name: "profile",
  description: "Get a TETR.IO profile.",
  aliases: ["p"],
  criteria: "[username]",
  options: "**Criterias:**\nUsername: TETR.IO username of the player.\n",
  execute(message, args) {
    if (args.length == 0) {
      fetchId(message.author.id, function (res) {
        if (res == null)
          return message.reply(
            "please set your TETR.IO username. `(%help set)`"
          );
        getProfile(res.id, "id", message);
      });
    } else {
      getProfile(args[0].toLowerCase(), "username", message);
    }
  },
};
