onmessage = function(evt) {
  var x, y = evt.data[0], evt.data[1];
  var z = parseInt(x) + parseInt(y);
  postMessage(z);
};
