var five = require("johnny-five"),
    keypress = require('keypress'),
    mouse = require('macmouse'),
    board = new five.Board({
      repl: false,
      debug: false
    }),
    stdin = process.stdin,
    moving = false,
    turning = false,
    leftSpeed = 0,
    rightSpeed = 0,
    prevY, prevY;

mouse.init();

keypress(process.stdin);
stdin.setRawMode(true);
stdin.resume();

board.on("ready", function() {
  // Johnny-Five provides pre-packages shield configurations!
  // http://johnny-five.io/api/motor/#pre-packaged-shield-configs
  var motors = new five.Motors([
        five.Motor.SHIELD_CONFIGS.POLOLU_DRV8835_SHIELD.M1,
        five.Motor.SHIELD_CONFIGS.POLOLU_DRV8835_SHIELD.M2,
      ]),
      leftMotor = motors[0],
      rightMotor = motors[1];

  console.log('Place cursor in top right corner to calibrate...');
  setTimeout(function() {
    var pos = mouse.getRealPos();

    prevX = pos.x / 2;
    prevY = pos.y / 2;

    mouse.Place(prevX, prevY);
    robot();
  }, 1000)

  function robot() {
    console.log('Ready!');
    
    setInterval(function() {
      var pos = mouse.getRealPos(),
          newY = pos.y,
          newX = pos.x;

      // forward/backward
      leftSpeed = leftSpeed + (newY - prevY) / 2;
      rightSpeed = rightSpeed + (newY - prevY) / 2;

      // left/right
      leftSpeed = leftSpeed + (prevX - newX) / 2;
      rightSpeed = rightSpeed - (prevX - newX) / 2;


      if (leftSpeed > 0) {
        leftMotor.fwd(leftSpeed);
      } else {
        leftMotor.rev(Math.abs(leftSpeed));
      }

      if (rightSpeed > 0) {
        rightMotor.fwd(rightSpeed);
      } else {
        rightMotor.rev(Math.abs(rightSpeed));
      }

      prevX = newX;
      prevY = newY;
    }, 250);

    stdin.on("keypress", function (chunk, key) {
      if (!key) return;

      if (key.ctrl && key.name == 'c' || key.name == 'q') {
        mouse.quit();
        process.exit();
      }

      switch(key.name) {
        case "up":
          motors.fwd(255);
          moving = true;
          break;
        case "down":
          motors.rev(255);
          moving = true;
          break;
        case "space":
          motors.stop();
          moving = false;
          leftSpeed = 0;
          rightSpeed = 0;
          break;
        case "right":
          if (moving) {
            motors[0].speed(150);
            motors[1].speed(255);
          } else {
            motors[1].fwd(75);
            motors[0].rev(75);
          }
          break;
        case "left":
          if (moving) {
            motors[1].speed(150);
            motors[0].speed(255);
          } else {
            motors[0].fwd(75);
            motors[1].rev(75);
          }
          break;
        default:
          break;
      }
    });
  }
});
