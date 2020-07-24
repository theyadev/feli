const NodeCache = require("node-cache");
const axios = require("axios");
var mysql = require("mysql");
const { tetrioToken } = require("../config.json");
const tetrioNode = require('tetrio-node');
const tetrioApi = new tetrioNode.Api(tetrioToken);

const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

const { db_config } = require("../config.json");
var connection;

module.exports.user = async function getUser(id, type, callback) {
  let user;
  user = cache.get(id);
  if (user == undefined) {
    await tetrioApi
      .getUser({ user: id, type: type })
      .then((res) => {
        cache.set(id, res, 60);
        user = res;
      })
      .catch((err) => {
        user = null;
      });
  }

  callback(user);
};

module.exports.replay = async function getReplayShort(id, callback) {
  let replay;
  replay = cache.get(id);
  if (replay == undefined) {
    await tetrioApi
      .getReplayShort({ replayId: id })
      .then((res) => {
        cache.set(id, res, 60);
        replay = res;
      })
      .catch((err) => {
        replay = null;
      });
  }

  return replay;
};

module.exports.recent = async function getUserRecent(name, type, callback) {
  let cachename = "recents" + name;
  let recents;
  recents = cache.get(cachename);
  if (recents == undefined) {
    await tetrioApi
      .getRecentScores({ user: name, type: type })
      .then((records) => {
        cache.set(cachename, records, 60);
        recents = records;
      });
  }

  callback(recents);
};

module.exports.id = async function getUserId(discordId, callback) {
  connection = await mysql.createConnection(db_config);
  await connection.query(
    `SELECT * FROM users WHERE discord_id = "${discordId}"`,
    function (error, res, fields) {
      if (res.length != 0) callback(res[0]);
      else callback(null);
    }
  );
  connection.end();
};
