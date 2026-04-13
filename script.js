const header = document.getElementById("header");

window.addEventListener("scroll", function() {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

window.addEventListener("DOMContentLoaded", function() {
  const header = document.getElementById("header");

  window.addEventListener("scroll", function() {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
});

const container = document.querySelector(".productos-container");

document.querySelector(".next").onclick = () => {
  container.scrollLeft += 300;
};

document.querySelector(".prev").onclick = () => {
  container.scrollLeft -= 300;
};