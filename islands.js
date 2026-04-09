document.addEventListener("DOMContentLoaded", function () {
  const islands = document.querySelectorAll(".islandToHover");
  const descriptionText = document.getElementById("island-description-text");
  const descriptionBox = document.getElementById("island-description-box");

  islands.forEach(function (island) {
    island.addEventListener("click", function () {
      const description = island.getAttribute("data-description");

      // remove active state from all islands
      islands.forEach(function (el) {
        el.classList.remove("active");
      });

      // if clicking the already-active island, deselect it
      if (island === document.querySelector(".island.was-active")) {
        descriptionText.textContent = "Click an island to learn more.";
        island.classList.remove("was-active");
        return;
      }

      // set active on clicked island
      island.classList.add("active");
      document
        .querySelectorAll(".islandToHover")
        .forEach((el) => el.classList.remove("was-active"));
      island.classList.add("was-active");

      // fade out then swap text
      descriptionBox.style.opacity = "0";
      setTimeout(function () {
        descriptionText.textContent = description;
        descriptionBox.style.opacity = "1";
      }, 180);
    });
  });
});
