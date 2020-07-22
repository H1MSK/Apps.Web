/*jshint esversion: 6 */

$(document).ready(function () {
  "use strict";

  // Randomly choose a background picture when document is ready
  var s_vertical_background_url =
    "./imgs/chieruv" + Math.floor(Math.random() * 5) + ".png";
  var s_horizontal_background_url =
    "./imgs/chieruh" + Math.floor(Math.random() * 1) + ".png";

  // Change layout dynamically to support multi-platform
  function flushLayout(forced = false) {
    var body = $(document.body);

    do {
      if (window.innerWidth < window.innerHeight) {
        if (!forced && body.hasClass("mobile")) break;
        body.addClass("mobile");
        body.css("background-image", "url(" + s_vertical_background_url + ")");
      } else {
        if (!forced && !body.hasClass("mobile")) break;
        body.removeClass("mobile");
        body.css(
          "background-image",
          "url(" + s_horizontal_background_url + ")"
        );
      }
    } while (0);
  }

  $("#banner").click(function() {
    $("#info").toggleClass("display-info");
  });

  $(".dropdown-select").click(function () {
    console.assert(
      $(this).parent().hasClass("dropdown"),
      "Select should occur in .dropdown!"
    );
  
    $(this).parent().toggleClass("dropdown-menu-show");
  });
  
  $(window).resize(function () {
    flushLayout();
  });
  
  $(".dropdown-item").click(function () {
    console.assert(
      $(this).parent().parent().hasClass("dropdown"),
      "Dropdown is not complete!"
    );
    $(this).parent().prev().text($(this).text());
    $(this).parent().parent().toggleClass("dropdown-menu-show");
  });
  
  flushLayout(true);
});