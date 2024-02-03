import * as M from "../lib/materialize-src/js/bin/materialize";

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems, { class: "calulator-select" });
});
