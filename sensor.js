var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var servo = new five.Servo(11);
  var rotary = new five.Sensor("A0");

  // scale accepts a single array or two arguments
  rotary.scale(0, 180).on("change", function() {
    servo.to(this.value);
  });
});
