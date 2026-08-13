(function () {
  "use strict";

  document.documentElement.classList.add("boot");

  var clock = document.getElementById("clock");
  var boot = document.getElementById("boot");
  var bootCaret = boot && boot.parentNode.querySelector(".caret");
  var cmd = "./boot --demos";
  var idx = 0;
  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function tick() {
    clock.textContent = new Date().toUTCString().slice(17, 25) + " UTC";
  }
  tick();
  setInterval(tick, 1000);

  function reveal(base) {
    var els = document.querySelectorAll(".reveal");
    for (var i = 0; i < els.length; i++) {
      (function (el, n) {
        setTimeout(function () { el.classList.add("show"); }, base + n * 130);
      })(els[i], i);
    }
  }

  function type() {
    boot.textContent = cmd.slice(0, ++idx);
    if (idx < cmd.length) {
      setTimeout(type, 45);
    } else {
      if (bootCaret) bootCaret.classList.add("done");
      setTimeout(function () { reveal(250); }, 150);
    }
  }

  if (reduce) {
    boot.textContent = cmd;
    if (bootCaret) bootCaret.classList.add("done");
    reveal(0);
  } else {
    type();
  }
})();
