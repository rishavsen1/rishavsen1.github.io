jQuery(document).ready(function ($) {
  /* Set the height of magicbook container */
  function magicbook_container_height() {
    var windowHeight = $(window).height();
    $(".magicbook-wrapper").each(function () {
      var outerHeight = $(this).closest(".bb-custom-side").height();
      var innerHeight = $(this).children(".magicbook-inner-wrapper").height();
      var thisHeight = outerHeight;

      if (innerHeight > outerHeight) {
        thisHeight = innerHeight;
      }
      if (
        typeof $(this).attr("data-fullsize") !== "undefined" &&
        $(this).attr("data-fullsize") == "1"
      ) {
        $(this).addClass("fullsize");
        $(this).height(thisHeight);

        if ($(window).width() <= 768) {
          $(this).css({
            Height: windowHeight,
          });
          $(this)
            .closest(".bb-custom-side")
            .css({
              height: $(this).height(),
            });
        }
      }
      if (typeof $(this).attr("data-bg-color") !== "undefined") {
        $(this).css({
          backgroundColor: $(this).attr("data-bg-color"),
        });
      }
      if (typeof $(this).attr("data-bg-img") !== "undefined") {
        $(this).css({
          backgroundImage: "url(" + $(this).attr("data-bg-img") + ")",
        });
      }
      if (typeof $(this).attr("data-bg-size") !== "undefined") {
        $(this).css({
          backgroundSize: $(this).attr("data-bg-size"),
        });
      }
      if (typeof $(this).attr("data-text-color") !== "undefined") {
        $(this).css({
          color: $(this).attr("data-text-color"),
        });
        $(this)
          .find("div,h1,h2,h3,h4,h5,h6,p,span,blockquote")
          .css("color", $(this).attr("data-text-color"));
      }
    });
  }

  $(window).load(function () {
    magicbook_container_height();
  });

  $(window).resize(function () {
    magicbook_container_height();
  });

  $(window).load(function () {
    $(".bb-custom-side").each(function () {
      if (
        $(this)
          .children(".content-wrapper")
          .children(".container")
          .has(".magicbook-wrapper").length > 0
      ) {
        $(this).find(".page-head-cover").hide();
        $(this).find(".page-foot-cover").hide();
      }
    });
  });
});
