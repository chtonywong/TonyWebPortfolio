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
      // Apply mobile-specific styles or behavior
      $(".navbar-menu").removeClass("d-none");
      $(".Full_nav").addClass("d-none");
      $(".wrapper").addClass("d-none");
      $("#normNavPic").addClass("d-none");
      $(".alert").removeClass("d-none");
      $("#smolNavPic").removeClass("d-none");
    } else {
      $(".navbar-menu").addClass("d-none");
      $(".Full_nav").removeClass("d-none");
      $("#normNavPic").removeClass("d-none");
      $(".alert").addClass("d-none");
      $("#smolNavPic").addClass("d-none");
    }
  });
  var nav_state = 0;
  $(".navButton").on("click", function () {
    if (nav_state == 0) {
      $(".wrapper").removeClass("d-none");
      $(".wrapper").addClass("start");
      nav_state = 1;
    } else {
      $(".wrapper").addClass("d-none");
      $(".wrapper").removeClass("start");
      nav_state = 0;
    }
  });
});
