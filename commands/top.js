const Discord = require("discord.js");

const getUser = require("../functions/cache").user;
const fetchId = require("../functions/cache").id;
const getReplay = require("../functions/cache").replay;
const getColor = require("../functions/details").color;
const msToTime = require("../functions/details.js").msToTime;

function pad(n, width, z) {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function getDate(date) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayIndex = date.getDay();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const monthIndex = date.getMonth();
  const dayDate = date.getDate();
  const year = date.getFullYear();
  return (
    days[dayIndex] +
    " " +
    dayDate +
    " " +
    months[monthIndex] +
    " " +
    year +
    " at " +
    hours +
    ":" +
    pad(minutes, 2)
  );
}

async function getTopRecords(name, type, message) {
  getUser(name, type, async function (res) {
    if (res == null) return message.reply("user not found.");
    const blitzShortId = await getReplay(res.records.blitz.replayId);
    const sprintShortId = await getReplay(res.records.sprint.replayId);

    let color = getColor(res.tetraLeague.rank).toString();
    let authorFlag = "";
    if (res.country)
      authorFlag = `https://tetr.io/res/flags/${res.country.toLowerCase()}.png`;

    let sprintRank;
    if (res.records.sprintRank) sprintRank = res.records.sprintRank;
    let blitzRank;
    if (res.records.blitzRank) blitzRank = res.records.blitzRank;
    let sprintRankB = sprintRank ? " **(#" + sprintRank + ")**" : "";
    let blitzRankB = blitzRank ? " **(#" + blitzRank + ")**" : "";
    let sprintValue = `**▸ Time:** ${msToTime(
      res.records.sprint.finalTime
    )} ${sprintRankB}\n**▸ PPS:** ${
      Math.round(
        (res.records.sprint.endcontext.piecesPlaced /
          (res.records.sprint.finalTime / 1000)) *
          100
      ) / 100
    }\n**▸ Replay Link:**  : https://tetr.io/#R:${sprintShortId}\n*${getDate(
      new Date(res.records.sprint.date)
    )}*`;
    let blitzValue = `**▸ Score:** ${
      res.records.blitz.score
    } ${blitzRankB}\n**▸ PPS:** ${
      Math.round((res.records.blitz.endcontext.piecesPlaced / 120) * 100) / 100
    }\n**▸ Replay Link:**  : https://tetr.io/#R:${blitzShortId}\n*${getDate(
      new Date(res.records.blitz.date)
    )}*`;

    const embed = new Discord.MessageEmbed()
      .setColor(color)
      .setAuthor(
        `TETR.IO Best Records for ${
          res.username[0].toUpperCase() + res.username.slice(1)
        }`,
        authorFlag,
        `https://tetrio.team2xh.net/?t=player&p=${res.username}`
      )
      .addFields(
        { name: "**__40L Personnal Best__**", value: sprintValue },
        { name: "**__BLITZ Personnal Best__**", value: blitzValue }
      );

    message.channel.send(embed);
  });
}

module.exports = {
  name: "top",
  description: "Get user's top blitz/sprint plays.",
  criteria: "[username]",
  options: "**Criterias:**\nUsername: TETR.IO username of the player.\n",
  execute(message, args) {
    if (args.length == 0) {
      fetchId(message.author.id, function (res) {
        if (res == null)
          return message.reply(
            "please set your TETR.IO username. `(%help set)`"
          );
        getTopRecords(res.id, "id", message);
      });
    } else {
      if (args[0].startsWith("<@") && args[0].endsWith(">")) {
        let id = args[0].slice(2, -1);
        if (id.startsWith("!")) {
          id = id.slice(1);
        }
        fetchId(id, function (res) {
          if (res == null)
            return message.reply(
              "please set your TETR.IO username. `(%help set)`"
            );
          getTopRecords(res.id, "id", message);
        });
      } else getTopRecords(args[0].toLowerCase(), "username", message);
    }
  },
};
