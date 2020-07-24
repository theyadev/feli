const mapRating = require("../../theya/functions/details.js").mapRating;
const mapLength = require("../../theya/functions/details.js").mapLength;
const randomMap = require("../../theya/functions/get.js").randomMap;
const getDefaultMode = require("../../theya/functions/get.js").defaultMode;

module.exports = {
  name: "recommend",
  aliases: ["r"],
  criteria: "[criterias]",
  options:
    "**Criterias:**\nStar rating `(number)`: Recommend a map with specific star rating. `(int)`\nGenre [(genre)](http://theyabot.ddns.net/#criteria) : Recommend a map with a specific genre.\nBPM `(number)`: Recommend a map with a specific bpm.\nArtist `(text)`: Recommend a map with a specific artist.\nTitle `(text)`: Recommend a map with a specific title.\n",
  description: "Recommend a beatmap.",
  execute(message, args) {
    getDefaultMode(message.author.id, function (mode) {
      randomMap(args, mode, function (err, map) {
        if (map == null || map.length == 0) {
          message.channel.send(
            "Sorry, no match was found with these criterias."
          );
          return;
        }

        let artist = map.artist;
        artist = artist.replace(/\s/g, "").toLowerCase();
        let n = 0;
        for (var i = 0; i < artist.length; i++) {
          let u = artist.charCodeAt(i) - 64;
          n += u * (i * u);
        }

        let embed;
        let couleur = n;

        if (map.mode == "mania") {
          embed = {
            timestamp: new Date(),
            color: couleur,
            thumbnail: {
              url: `https://b.ppy.sh/thumb/${map.beatmapset_id}.jpg`,
            },
            title: `${map.artist} - ${map.title} by ${map.creator} `,
            url: `https://osu.ppy.sh/b/${map.id}`,
            description: `**▸Length:** ${mapLength(map.length)} ♪ **▸BPM:** ${
              map.bpm
            } **▸Genre:** ${
              map.genre[0].toUpperCase() + map.genre.slice(1)
            }\n**Download:** [map](https://osu.ppy.sh/d/${
              map.beatmapset_id
            })([no video](https://osu.ppy.sh/d/${map.beatmapset_id}n))\n`,
            fields: [
              {
                name: `__${map.version}__`,
                value: `**▸Star Rating:** ${mapRating(
                  map.rating
                )} ★ **▸Key Count:** ${map.cs}\n**▸OD:** ${map.od} **▸AR:** ${
                  map.ar
                } **▸HP:** ${map.hp}`,
              } /*,
                            {
                                name: `${map.counts.favorites} ❤︎ | Request by ${message.author.username} | Last Update: ${lastUpdates}`,
                                value: '\u200b',
                                inline: true,
                            },*/,
            ],
          };
        } else if (map.mode == "osu") {
          embed = {
            color: couleur,
            timestamp: new Date(),
            thumbnail: {
              url: `https://b.ppy.sh/thumb/${map.beatmapset_id}.jpg`,
            },
            title: `${map.artist} - ${map.title} by ${map.creator} `,
            url: `https://osu.ppy.sh/b/${map.id}`,
            description: `**▸Length:** ${mapLength(map.length)} ♪ **▸BPM:** ${
              map.bpm
            } **▸Genre:** ${
              map.genre[0].toUpperCase() + map.genre.slice(1)
            }\n**Download:** [map](https://osu.ppy.sh/d/${
              map.beatmapset_id
            })([no video](https://osu.ppy.sh/d/${map.beatmapset_id}n))\n`,
            fields: [
              {
                name: `__${map.version}__`,
                value: `**▸Star Rating:** ${mapRating(
                  map.rating
                )} ★ **▸Max Combo:** ${map.max_combo}x\n**▸CS:** ${
                  map.cs
                } **▸OD:** ${map.od} **▸AR:** ${map.ar} **▸HP:** ${
                  map.hp
                }\n**▸Aim:** ${mapRating(map.aim)} **▸Speed:** ${mapRating(
                  map.speed
                )}`,
              } /*,
                {
                    name: `${map.counts.favorites} ❤︎ | Request by ${message.author.username} | Last Update: ${lastUpdates}`,
                    value: '\u200b',
                    inline: true,
                },*/,
            ],
          };
        }

        message.channel.send({ embed: embed });
      });
    });
  },
};
