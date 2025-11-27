function gameloadanimation() {
  gsap.fromTo(
    ".game",
    {
      opacity: 0,
      y: 20,
    },
    {
      delay: 0.5,
      stagger: 0.08,
      opacity: 1,
      y: 0,
      duration: 1,
    }
  );
  console.log("loading games animation...");
}
function onElementReady(selector, callback) {
  const element = document.querySelector(selector);
  if (element) {
    callback(element);
  } else {
    requestAnimationFrame(() => onElementReady(selector, callback));
  }
}
onElementReady('.game', () => {
  gameloadanimation();
});
