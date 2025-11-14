  function opennurl(url, proxytype) {
  localStorage.setItem("proxyType", proxytype)
  input.value = url;
  input.dispatchEvent(
    new KeyboardEvent("keyup", { key: "Enter", keyCode: 13, bubbles: true })
  );
}
