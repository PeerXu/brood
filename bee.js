let _bee = null;

function new_bee() {
  let bee = {};

  bee._state = "building";
  bee._workers = {};

  bee.logger = {
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error
  };

  bee._start_mainloop = function() {
    bee._mainloop();
  };

  bee._fetch_task = function() {
    return new Promise((resolve) => setTimeout(() => resolve({
      path: "localhost:8000/examples/bee/adder",
      data: [1, 2]
    }), 2000));
  };

  bee._fetch_bee_description = async (path) => {
    return new Promise((resolve) => fetch(path).then((res) => res.json()).then((json) => resolve(json)));
  };

  bee._parse_task = async function(task) {
    let desc_path = `http://${task.path}/bee.json`;
    let desc = await bee._fetch_bee_description(desc_path);
    return {
      name: desc.name,
      main: `http://${task.path}/${desc.main}`,
      data: "data" in task ? task.data : []
    };
  };

  bee._get_execute_task_result = function(worker) {
    return new Promise((resolve) => worker.addEventListener("message", (evt) => resolve(evt.data)));
  };

  bee._execute_task = function(task) {
    let worker = new Worker(task.main);
    bee._workers[task.name] = worker;

    let promise = new Promise((resolve) => {
      worker.addEventListener("message", (evt) => {
        console.log("received: " + evt.data);
        resolve(evt.data);
        // delete bee._workers[task.name];
        // worker.terminate();
      });
      worker.postMessage(task.data);
    });

    return promise;
  };

  bee._epoch_counts = 0;
  bee._epoch = async function() {
    let t = await bee._fetch_task();
    t = await bee._parse_task(t);
    let ret = await bee._execute_task(t);
    console.log(ret);
  };

  bee._mainloop = function() {
    bee._epoch().then(() => bee._mainloop());
  };

  bee.state = function() {
    return self._state;
  };

  bee.set_state = function(state) {
    self._state = state;
  };

  bee.start = function() {
    bee.logger.info("bee start...");

    bee.set_state("ready");

    bee._start_mainloop();
  };

  bee.terminate = function() {
    bee.logger.info("bee terminated...");
  };

  return bee;
}

function get_bee() {
  if (_bee === null) {
    _bee = new_bee();
  }

  return _bee;
}
