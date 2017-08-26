(function() {
  var worker = new Worker("worker.js");

  worker.postMessage({command: "start"});
})();
