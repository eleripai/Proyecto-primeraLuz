
const header = document.getElementById("header");

window.addEventListener("scroll", () => {

  if(window.scrollY > 50){
    header.classList.add("scrolled");
  }else{
    header.classList.remove("scrolled");
  }

});

const container = document.querySelector(".productos-container");

const next = document.querySelector(".next");

const prev = document.querySelector(".prev");

function getScrollAmount(){

  if(window.innerWidth < 768){
    return 250;
  }

  return 350;
}

next.addEventListener("click", () => {

  container.scrollLeft += getScrollAmount();

});

prev.addEventListener("click", () => {

  container.scrollLeft -= getScrollAmount();

});