module.exports.color = function getColor(rank) {
  let color;
  switch (rank) {
    case "x":
      color = "#b852bf";
      break;
    case "u":
      color = "#c75c2e";
      break;
    case "ss":
      color = "#e39d3b";
      break;
    case "s+":
      color = "#dbaf37";
      break;
    case "s":
      color = "#d19e26";
      break;
    case "s-":
      color = "#B79E2B";
      break;
    case "a+":
      color = "#43b536";
      break;
    case "a":
      color = "#3EA750";
      break;
    case "a-":
      color = "#35AA8C";
      break;
    case "b+":
      color = "#4880B2";
      break;
    case "b":
      color = "#4357B5";
      break;
    case "b-":
      color = "#5949BE";
      break;
    case "c+":
      color = "#522278";
      break;
    case "c":
      color = "#67287B";
      break;
    case "c-":
      color = "#6C417C";
      break;
    case "d+":
      color = "#815880";
      break;
    case "d":
      color = "#856C84";
      break;

    default:
      color = "#9db5f2";
      break;
  }
  return color;
};

function pad(n, width, z) {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

module.exports.msToTime = function msToTime(ms) {
  var seconds = ms / 1000;
  var minutes = parseInt(seconds / 60, 10);
  seconds = seconds % 60;
  minutes = minutes % 60;
  seconds = Math.round(seconds * 1000) / 1000;
  let nbr;
  if (seconds < 10) nbr = `0${seconds}`;
  else nbr = seconds;
  return pad(minutes, 2) + ":" + nbr;
}