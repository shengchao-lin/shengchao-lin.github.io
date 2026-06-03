(function () {
  var root = document.querySelector(".design-stage");
  var select = document.querySelector("#designSelect");
  var key = "shengchao-static-design";

  if (!root || !select) return;

  var saved = window.localStorage.getItem(key);
  if (saved) {
    root.setAttribute("data-design", saved);
    select.value = saved;
  }

  select.addEventListener("change", function () {
    root.setAttribute("data-design", select.value);
    window.localStorage.setItem(key, select.value);
  });
})();
