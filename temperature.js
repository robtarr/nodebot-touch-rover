var five = require("johnny-five");
var board = new five.Board();
var color = require('color-temp');

board.on("ready", function() {
  var temp = new five.Temperature({
    controller: "TMP36",
    pin: "A0"
  });

  var rgb = new five.Led.RGB({
    pins: [3, 5, 6],
    isAnode: true
  });

  temp.on("change", function() {
    var temp = this.celsius,
        color = tempToHex(temp);

    console.log(temp, ':', tempToHex(temp));
    rgb.color(color);
  });
});

function tempToHex(temp) {
  var top = 25,
      bottom = 23;

  blue = Math.abs(temp - bottom);
  red = Math.abs(temp - top);

  return "#" + clamp(red) + clamp(0) + clamp(blue);
}

function kelvinToHex(temp) {
  var rgb = color.temp2rgb(temp);
  return "#" + clamp(rgb[0]) + clamp(rgb[1]) + clamp(rgb[2]);
}

// function tempToHex(temp) {
//   var red = 0,
//       blue = 0,
//       green = 0;
//
//   if (temp > 50) {
//     red = temp * 2;
//   } else {
//     blue = temp * 2;
//   }
//
//   console.log("#" + clamp(red) + clamp(green) + clamp(blue));
//   return "#" + clamp(red) + clamp(green) + clamp(blue);
// }

function pad(n) {
  return (n < 10) ? ("0" + n) : n;
}

function clamp(x, min, max) {
  min = 0 || min;
  max = 255 || max;

  if(x<min){ return min; }
  if(x>max){ return max; }
  return pad(parseInt(x, 10).toString(16));
}
