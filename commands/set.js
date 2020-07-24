const axios = require("axios");
const { tetrioToken } = require("../config.json");const config = {
  headers: { Authorization: "Bearer " + tetrioToken },
};

var mysql = require("mysql");
const db_config = require('../config.json')
var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
  // the old one cannot be reused.

  connection.connect(function (err) {
    // The server is either down
    if (err) {
      // or restarting (takes a while sometimes).
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    } // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else {
      // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
}

module.exports = {
  name: "set",
  description: "Set your TETR.IO profile.",
  criteria: "[username...]",
  options: "**Criterias:**\nUsername: Your TETR.IO username.\n",
  execute(message, args) {
    if (!args) {
      return message.reply("please specify your username.");
    }
    axios
      .get(
        "https://tetr.io/api/users/" + args[0].toLowerCase() + "/resolve",
        config
      )
      .then((res) => {
        axios
          .get("https://tetr.io/api/users/" + res.data._id, config)
          .then((tetrUser) => {
            handleDisconnect();
            connection.query(
              `SELECT * FROM users WHERE discord_id = "${message.author.id}"`,
              function (err, res, fields) {
                if (res.length == 0) {
                  connection.query(
                    `INSERT INTO users (username, id, discord_id) VALUES ("${tetrUser.data.user.username}", "${tetrUser.data.user._id}", "${message.author.id}")`,
                    function (err, res, fields) {
                      message.reply(
                        "your TETR.IO username is now set to: " + args[0]
                      );
                      connection.end();
                    }
                  );
                } else {
                  connection.query(
                    `UPDATE users SET username = "${tetrUser.data.user.username}", id = "${tetrUser.data.user._id}" WHERE discord_id = "${message.author.id}"`,
                    function (err, res, fields) {
                      message.reply(
                        "your TETR.IO username is now changed to: " + args[0]
                      );
                      connection.end();
                    }
                  );
                }
              }
            );
          });
      })
      .catch(function (error) {
        return message.reply("username not found.");
      });
  },
};
