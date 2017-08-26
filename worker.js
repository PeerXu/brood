const WORKER = self;

WORKER.addEventListener("message", function(evt) {
  WORKER.importScripts("bee.js");
  let bee = get_bee();

  if ("command" in evt.data) {
    let cmd = evt.data["command"];
    switch (cmd) {
    case "start":
      bee.start();
      break;
    case "terminate":
      break;
    }
  }
});
