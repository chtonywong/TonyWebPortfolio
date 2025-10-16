const navbarToggle = document.querySelector(".navbar-toggle");
const navbarMenu = document.querySelector(".navbar-menu");
const full_nav = document.querySelector(".Full_nav");

navbarToggle.addEventListener("click", () => {
  navbarToggle.classList.toggle("active");
  navbarMenu.classList.toggle("active");
});
$(document).ready(function () {
  $(window).resize(function () {
    if ($(window).width() < 880) {
      $(".timeline_progress-bar").css("inset", "0 auto 50vh 12%");
      $(".timeline_text").css("font-size", "16px");
    } else {
      $(".timeline_progress-bar").css("inset", "0 auto 50vh");
      $(".timeline_text").css("font-size", "24px");
    }
  });
});
