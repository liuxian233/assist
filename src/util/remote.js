var mouseDownX, mouseDownY, mouseDownTime, mouseUpX, mouseUpY, mouseUpTime, xPercent, yPercent, endXPercent, endYPercent;
function getPointOnCanvas(e) {
  var x = e.pageX
  var y = e.pageY
  var canvas = e.target
  var bbox = canvas.getBoundingClientRect();
//   console.log('mouse down getBoundingClientRect:' + x + ' ' + y)
//   console.log('mouse down getBoundingClientRect:' + bbox.left + ' ' + bbox.top)
//   console.log('mouse down getBoundingClientRect:' + bbox.width + ' ' + bbox.height)
//   console.log('mouse down getBoundingClientRect:' + canvas.width + ' ' + canvas.height)
//   return {
//     x: x - bbox.left * (canvas.width / bbox.width),
//     y: y - bbox.top * (canvas.height / bbox.height)
//   }
  return {
    x: (x - bbox.left) / bbox.width,
    y: (y - bbox.top) / bbox.height
  }
}
var dataChannel
export default {
  dataChannel,
  mouseDown(e) {
    var downDate = new Date();
    mouseDownX = e.x;
    mouseDownY = e.y;
    mouseDownTime = downDate.getTime();

    var loc = getPointOnCanvas(e)
    xPercent = loc.x;
    yPercent = loc.y;
    console.log('mouse down at point( x:' + loc.x + ', y:' + loc.y + ')')
    if (dataChannel) {
      dataChannel.binaryType = 'arraybuffer'
      dataChannel.send(JSON.stringify(''))
    }
  },
  mouseMove(e) {
  },
  mouseUp(e) {
    var message;
    var upDate = new Date();
    mouseUpX = event.clientX;
    mouseUpY = event.clientY;
    var location = getPointOnCanvas(e)
    endXPercent = location.x;
    endYPercent = location.y;
    mouseUpTime = upDate.getTime();
    if (((mouseUpTime - mouseDownTime) > 1000) && (Math.abs(mouseUpX - mouseDownX) < 10) && (Math.abs(mouseUpY - mouseDownY) < 10)) { // longClick
      message = {type: 2, x: xPercent, y: yPercent};
    } else if (Math.abs(mouseUpX - mouseDownX) > Math.abs(mouseUpY - mouseDownY) && (mouseUpX > mouseDownX)) { // left
      message = {type: 6, x: xPercent, y: yPercent, endX: endXPercent, endY: endYPercent};
    } else if (Math.abs(mouseUpX - mouseDownX) > Math.abs(mouseUpY - mouseDownY) && (mouseUpX < mouseDownX)) { // right
      message = {type: 7, x: xPercent, y: yPercent, endX: endXPercent, endY: endYPercent};
    } else if (Math.abs(mouseUpX - mouseDownX) < Math.abs(mouseUpY - mouseDownY) && (mouseUpY > mouseDownY)) { // down
      message = {type: 4, x: xPercent, y: yPercent, endX: endXPercent, endY: endYPercent};
    } else if (Math.abs(mouseUpX - mouseDownX) < Math.abs(mouseUpY - mouseDownY) && (mouseUpY < mouseDownY)) { // up
      message = {type: 5, x: xPercent, y: yPercent, endX: endXPercent, endY: endYPercent};
    } else {
      message = {type: 1, x: xPercent, y: yPercent};
    }
    return message;
  }
}
