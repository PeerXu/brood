self.addEventListener("message", (evt) => {
  let x = evt.data[0], y = evt.data[1];
  let z = x + y;
  console.log(`[worker#adder] x=${x}, y=${y}, z=${z}`);
  self.postMessage(z);
});
