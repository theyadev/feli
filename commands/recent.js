const Discord = require("discord.js");

const getUser = require("../functions/cache").user;
const getUserRecent = require("../functions/cache").recent;
const fetchId = require("../functions/cache").id;
const getReplay = require("../functions/cache").replay;
const getColor = require("../functions/details").color;
const msToTime = require("../functions/details.js").msToTime;

function pps(ms, pieces) {
  var seconds = ms / 1000;
  var minutes = parseInt(seconds / 60, 10);
  //seconds = seconds % 60;
  var hours = parseInt(minutes / 60, 10);
  minutes = minutes % 60;
  //seconds = Math.round(seconds * 1000) / 1000;

  return Math.round((pieces / seconds) * 100) / 100;
}

function finesse(pP, pieces) {
  let finesse = Math.round((pP / pieces) * 1000) / 10;
  return finesse;
}

async function getRecentRecords(name, type, message, gameType) {
  console.log(name, type, gameType);
  getUser(name, type, async function (user) {
    getUserRecent(name, type, async function (res) {
      let recent;
      if (gameType == 0) recent = res[gameType];
      else {
        for (var i = 0; i < res.length; i++) {
          if (res[i].gameType == gameType) {
            recent = res[i];
            break;
          }
        }
      }
      if (!recent) {
        return message.reply("no data find.");
      }
      let color = getColor(user.tetraLeague.rank).toString();
      let authorFlag = "";
      if (user.country)
        authorFlag = `https://tetr.io/res/flags/${user.country.toLowerCase()}.png`;

      let fieldValue;
      const shortId = await getReplay(recent.replayId);
      if (recent.gameType == "blitz") {
        fieldValue = `**▸ Score:** ${recent.score}\n**▸ PPS:** ${
          Math.round((recent.endcontext.piecesPlaced / 120) * 100) / 100
        }\n**▸ Replay Link:**  : https://tetr.io/#R:${shortId}`;
      } else if (recent.gameType == "40l") {
        fieldValue = `**▸ Time:** ${msToTime(recent.finalTime)}\n**▸ PPS:** ${
          Math.round(
            (recent.endcontext.piecesPlaced / (recent.finalTime / 1000)) * 100
          ) / 100
        }\n**▸ Replay Link:**  : https://tetr.io/#R:${shortId}`;
      }

      const embed = new Discord.MessageEmbed()
        .setColor(color)
        .setAuthor(
          `TETR.IO Recent Record for ${
            user.username[0].toUpperCase() + user.username.slice(1)
          }`,
          authorFlag,
          `https://tetrio.team2xh.net/?t=player&p=${user.username}`
        )
        .addFields({ name: "**__Recent Record__**", value: fieldValue })
        .setTimestamp(recent.date);
      message.channel.send(embed);
    });
  });
}

module.exports = {
  name: "recent",
  description: "Get TETR.IO user recent play.",
  aliases: ["rs"],
  criteria: "[username]",
  options:
    "**Criterias:**\nUsername: TETR.IO username of the player.\nBLITZ `(-b)`: Get user most recent blitz play.\nSprint `(-s)`: Get user most recent sprint play.\n",
  execute(message, args) {
    function fetch(gameType) {
      fetchId(message.author.id, function (res) {
        if (res == null)
          return message.reply(
            "please set your TETR.IO username. `(%help set)`"
          );
        getRecentRecords(res.id, "id", message, gameType);
      });
    }

    if (args.length == 0) {
      fetch(0);
    } else {
      let gameType = 0;
      let user = 0;
      args.forEach((e) => {
        if (e == "-b" || e == "-blitz") {
          gameType = "blitz";
        } else if (e == "-s" || e == "-sprint" || e == "-40l") {
          gameType = "40l";
        } else {
          user = e;
        }
      });
      if (user == 0) fetch(gameType);
      else getRecentRecords(user, "username", message, gameType);
    }
  },
};
