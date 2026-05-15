"use strict";

// Stop the browser from restoring the previous scroll position on reload.
// The p5 canvas is appended asynchronously (after fonts/images preload), so
// the rest of the page is briefly at the top — if the browser anchors scroll
// during that window, the user lands inside the case studies and has to
// scroll up to see the sketch. Forcing scroll to the top here, and again
// once the page is fully loaded (canvas included), fixes that.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);
window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});

document.addEventListener("DOMContentLoaded", () => {
  const p5holder = document.getElementById("p5jsholder");
  const paragraph = document.querySelector("p");
  const vectorLine = document.querySelector(".vector-line");
  let lastScrollPosition = 0; // Track scroll direction

  window.addEventListener("scroll", () => {
    // Get scroll position and viewport height
    const scrollPosition = window.scrollY;
    const viewportHeight = window.innerHeight;
    const scrollingDown = scrollPosition > lastScrollPosition;

    // Only trigger animations when scrolling down past threshold
    if (scrollPosition > viewportHeight * 0.2 && scrollingDown) {
      p5holder.classList.add("p5js-exit");
      setTimeout(() => {
        paragraph.classList.add("paragraph-enter");
        vectorLine.classList.add("vector-line-enter");
      }, 300);
    }
    // Remove classes when scrolling up past threshold
    else if (scrollPosition <= viewportHeight * 0.2) {
      p5holder.classList.remove("p5js-exit");
      paragraph.classList.remove("paragraph-enter");
      vectorLine.classList.remove("vector-line-enter");
    }

    lastScrollPosition = scrollPosition;
  });
});
