/**
 * Customed bookshelf.js v1.0.0
 * http://www.codrops.com
 *
 */

var startPageNumber = 1;
var flip_direction;
var initOpen;
var menuText;
var showMenuText;
var closeAction;

jQuery(function ($) {
  "use strict";

  // Loading...
  $("body").imagesLoaded(function () {
    $("#main-loading").fadeOut(600);
  });

  var win_h = $(window).height();
  var win_w = $(window).width();

  var easyMod = !Modernizr.csstransforms3d || win_w < 769;
  var phoneMod = $(window).width() < 769;

  var menuClass = showMenuText == "1" ? "show-text" : "";

  // Build the Navigation html structure for each page
  function initNav() {
    if (easyMod) {
      $(".bb-bookblock").each(function () {
        $(this).append(
          '<a class="bb-flip bb-nav-prev">Previous<img src="' +
            template_url +
            '/img/necessity/nav-prev.png"/></a>'
        );
      });
      $(".bb-bookblock").each(function () {
        $(this).append(
          '<a class="menu-button open-menu ' +
            menuClass +
            '">' +
            menuText +
            '<div></div><div></div><div></div></a><a class="bb-flip bb-nav-next">Next<img src="' +
            template_url +
            '/img/necessity/nav-next.png"/></a>'
        );
      });
      $(".bb-flip.bb-nav-prev").hide();
    } else {
      $(".bb-custom-side")
        .not($(".cover").parents(".bb-custom-side"))
        .each(function () {
          $(this).append(
            '<div class="page-head-cover"></div><div class="page-foot-cover"></div>'
          );
        });

      $(".bb-custom-side:even").each(function () {
        $(this).append(
          '<a class="bb-flip bb-nav-prev">Previous<img src="' +
            template_url +
            '/img/necessity/nav-prev.png"/></a>'
        );
      });

      $(".bb-custom-side:odd").each(function () {
        $(this).append(
          '<a class="menu-button open-menu ' +
            menuClass +
            '">' +
            menuText +
            '<div></div><div></div><div></div></a><a class="bb-flip bb-nav-next">Next<img src="' +
            template_url +
            '/img/necessity/nav-next.png"/></a>'
        );
      });

      //$(".bb-flip:first").hide();
      // $(".bb-flip:last").hide();
    }
  }

  var supportAnimations =
      "WebkitAnimation" in document.body.style ||
      "MozAnimation" in document.body.style ||
      "msAnimation" in document.body.style ||
      "OAnimation" in document.body.style ||
      "animation" in document.body.style,
    animEndEventNames = {
      WebkitAnimation: "webkitAnimationEnd",
      OAnimation: "oAnimationEnd",
      msAnimation: "MSAnimationEnd",
      animation: "animationend",
    },
    // animation end event name
    animEndEventName = animEndEventNames[Modernizr.prefixed("animation")],
    //	scrollWrap = document.getElementById( 'scroll-wrap' ),
    docscroll = 0,
    books = document.querySelectorAll(".main");

  function scrollY() {
    return window.pageYOffset || window.document.documentElement.scrollTop;
  }

  // Main function of the book
  function Book(el) {
    this.el = el;
    this.book = this.el.querySelector(".book");
    //---------- this.ctrls =  this.el.querySelector( '.buttons' )
    // create the necessary structure for the books to rotate in 3d
    this._layout();

    this.bbWrapper = document.getElementById(
      this.book.getAttribute("data-book")
    );
    if (this.bbWrapper) {
      this._initBookBlock();
    }
    this._initEvents();
  }

  Book.prototype._layout = function () {
    if (Modernizr.csstransforms3d) {
      this.book.innerHTML =
        '<div class="cover"><a href="###"><img src="' +
        template_url +
        '/img/necessity/page-corner.png" id="page-corner" /></a><div class="front"></div><div class="inner inner-left"></div></div><div class="inner inner-right"></div>';
    }
  };

  Book.prototype._initBookBlock = function () {
    var current_page = 0;

    var easyMod = !Modernizr.csstransforms3d || $(window).width() < 769;

    var $bookBlock = $(".bb-bookblock");

    this.bb = $bookBlock.bookblock({
      speed: 800,
      //shadowSides : 0.8,
      direction: flip_direction,
      //shadowFlip : 0.7,
      shadows: false,
      easing: "linear",
      onEndFlip: function (old, page, isLimit) {
        $(".bb-bookblock .book-page:first-child").remove();

        var page_slug = "";
        $(".bb-item").each(function () {
          if ($(this).css("display") == "block") {
            page_slug = $(this).data("slug");
          }
        });

        $("#nav-scroll li.menu-item-object-page").each(function () {
          var link = $(this).find("a").attr("href");
          if (link.indexOf(page_slug) > -1) {
            $(this).addClass("bb-current").siblings().removeClass("bb-current");
          }
        });

        $(".content-wrapper").perfectScrollbar("update");

        //fast gallery plugin
        $(".fastgallery.brick-masonry").masonry({
          singleMode: true,
          itemSelector: ".fg-gallery-item",
        });

        //Media Grid plugin
        $(".mg_container").masonry({
          singleMode: true,
          itemSelector: ".mg_box",
        });

        try {
          if (magicbook_container && typeof magicbook_container == "function") {
            magicbook_container();
          } else {
          }
        } catch (e) {}

        (function smoothscroll() {
          var currentScroll =
            document.documentElement.scrollTop || document.body.scrollTop;
          if (currentScroll > 0) {
            window.requestAnimationFrame(smoothscroll);
            window.scrollTo(0, currentScroll - currentScroll / 5);
          }
        })();

        $(".bb-item")
          .eq(page)
          .find(".unslider")
          .trigger({ type: "cust1", test: true, name: "gao1" });
        $(".bb-item")
          .eq(page)
          .find(".portfolio-container")
          .trigger({ type: "cust2", test: true, name: "gao2" });

        if (easyMod) {
          updateNavigation(isLimit);
        }
      },
    });

    $(".portfolio-container").one("cust2", function () {
      $(this).isotope({
        // options
        itemSelector: ".portfolio-item",
        layoutMode: "fitRows",
      });
    });

    // filter items when filter link is clicked
    $(".portfolio-filters li").click(function () {
      //reset
      $(".isotope-item").find(".fancybox").removeAttr("rel");
      $(".isotope-item")
        .not(".isotope-hidden")
        .find(".fancybox")
        .attr("rel", "xxx");
      //reset current filter item
      $(".portfolio-filters>li.active").removeClass("active");
      $(this).addClass("active");
      return false;
    });

    // Hide the first and last Navi in easymode
    function updateNavigation(isLastPage) {
      if (current_page === 0) {
        $(".bb-flip.bb-nav-prev").hide();
        $(".bb-flip.bb-nav-next").show();
      } else if (isLastPage) {
        $(".bb-flip.bb-nav-prev").show();
        $(".bb-flip.bb-nav-next").hide();
      } else {
        $(".bb-flip.bb-nav-prev").show();
        $(".bb-flip.bb-nav-next").show();
      }
    }
  };

  Book.prototype._initEvents = function () {
    var self = this;
    if (this.bb) {
      // add Click Flip events
      $(".bb-nav-prev").each(function () {
        $(this).on("touchstart click", function () {
          self._prevPage();
          return false;
        });
      });
      $(".bb-nav-next").each(function () {
        $(this).on("touchstart click", function () {
          self._nextPage();
          return false;
        });
      });

      // add Swipe Flip events
      /* Since V1.08: Comment it out.
       * V1.15: Enabled again.
       */

      var $slides = $(".bb-bookblock").children();
      $slides.on({
        swipeleft: function (event) {
          self._nextPage();
          return false;
        },
        swiperight: function (event) {
          self._prevPage();
          return false;
        },
      });

      // add keyboard events
      $(document).keydown(function (e) {
        var keyCode = e.keyCode || e.which,
          arrow = {
            left: 37,
            up: 38,
            right: 39,
            down: 40,
          };

        switch (keyCode) {
          case arrow.left:
            self._prevPage();
            break;
          case arrow.right:
            self._nextPage();
            break;
        }
      });

      //open the book
      function openBook() {
        if (easyMod) {
          //If browser do not support the 3D animate
          $("#top-perspective").show(0, function () {
            bigBookPosition();
          });
          self._open();
          $("#phone-menu-default").hide();
          $("#scroll-wrap").fadeOut(500);
        } else {
          //Intro Wrapper fadeOut
          $(".intro-wrapper").fadeOut(800);
          $("#top-perspective").show(0, function () {
            bigBookPosition();
          });
          $(".book").animate(
            { marginLeft: "50%" },
            500,
            "easeInBack",
            function () {
              self._open();
              $("#phone-menu-default").hide();
              function hideLittleBook() {
                $("#scroll-wrap").hide();
                $("#map-wrapper").css({ opacity: "1", visibility: "visible" });
              }
              setTimeout(hideLittleBook, 500);
            }
          );
        }
      }

      $("#page-corner,#open-it").on("click touchstart", function () {
        openBook();
      });

      $(window).load(function () {
        if (initOpen) {
          openBook();
        }
      });

      $(".bb-flip:last").on("click touchstart", function () {
        //	$menuItems.removeClass( 'bb-current' );
        //	$menuItems.first().addClass('bb-current');

        if (phoneMod) {
          // $("#menu-wrapper").hide();
        }

        if (easyMod) {
          //	self._close();
          //$("#scroll-wrap").fadeIn(500,function(){
          //reset the book cover position
          //		smallBookPosition();
          //	});
          //$("#top-perspective").removeClass("animate");
          //$("#top-perspective").hide();
        } else {
          $("#top-perspective").removeClass("animate");
          if (!Modernizr.csstransitions) {
            $("#top-wrapper").css({ left: "+=300px" });
          }
          $(document).ready(function () {
            function closeBook() {
              self._close();
              // Back to front Cover
              $("#phone-menu-default").show();
              // hide the map
              $("#map-wrapper").css({ opacity: "0", visibility: "hidden" });
              $("#scroll-wrap").show(0, function () {
                //reset the book cover position
                smallBookPosition();
              });
              setTimeout(moveBack, 500);
              function moveBack() {
                $(".book").animate({ marginLeft: "0%" }, 400, "easeOutCubic");
                $(".intro-wrapper").fadeIn(1100);
                $("#top-perspective").hide();
              }
            }
            setTimeout(closeBook, 300);
          });
        }
      });

      //close the book
      $(".bb-flip:first").on("click touchstart", function () {
        //	$menuItems.removeClass( 'bb-current' );
        //	$menuItems.first().addClass('bb-current');

        if (phoneMod) {
          //  $("#menu-wrapper").hide();
        }

        if (easyMod) {
          //self._close();
          //	$("#scroll-wrap").fadeIn(500,function(){
          //	reset the book cover position
          //		smallBookPosition();
          //	});
          ///	$("#top-perspective").removeClass("animate");
          //	$("#top-perspective").hide();
        } else {
          $("#top-perspective").removeClass("animate");
          if (!Modernizr.csstransitions) {
            $("#top-wrapper").css({ left: "+=300px" });
          }
          $(document).ready(function () {
            function closeBook() {
              self._close();
              $("#phone-menu-default").show();
              // hide the map
              $("#map-wrapper").css({ opacity: "0", visibility: "hidden" });
              $("#scroll-wrap").show(0, function () {
                //reset the book cover position
                smallBookPosition();
              });
              setTimeout(moveBack, 500);
              function moveBack() {
                $(".book").animate({ marginLeft: "0%" }, 400, "easeOutCubic");
                $(".book,.intro-wrapper").fadeIn(1100);
                $("#top-perspective").hide();
              }
            }
            setTimeout(closeBook, 300);
          });
        }
      });

      //close the book
      $("#close-button").on("click touchstart", function () {
        if (!Modernizr.csstransitions) {
          $("#top-wrapper").css({ left: "+=300px" });
        }

        function moveBack() {
          $(".book").animate({ marginLeft: "0%" }, 400, "easeOutCubic");
          $(".book,.intro-wrapper").fadeIn(1100);
          $("#top-perspective").hide();
        }

        if (phoneMod) {
          $("#menu-wrapper").hide();
          setTimeout(moveBack, 100);
        }

        if (easyMod) {
          self._close();
          $("#phone-menu-default").show();
          $("#scroll-wrap").fadeIn(500, function () {
            //reset the book cover position
            smallBookPosition();
          });
          $("#top-perspective").removeClass("animate");
          $("#top-perspective").hide();
        } else {
          $("#top-perspective").removeClass("animate");
          if (!Modernizr.csstransitions) {
            $("#top-wrapper").css({ left: "+=300px" });
          }
          $(document).ready(function () {
            function closeBook() {
              self._close();
              $("#phone-menu-default").show();
              // hide the map
              $("#map-wrapper").css({ opacity: "0", visibility: "hidden" });
              $("#scroll-wrap").show(0, function () {
                //reset the book cover position
                smallBookPosition();
              });
              setTimeout(moveBack, 500);
            }

            if (closeAction == 1) {
              setTimeout(closeBook, 10);
            }
          });
        }
      });

      /****************************************************
       * ThemeVan Modified:
       * 1. Open the specific page directly
       * 2. Flipping the page by the custom link
       ****************************************************/
      $(document).ready(function () {
        //AUTO-OPEN FUNCTION
        function autoOpenPage(hash) {
          //Get the order number of the specific page
          $("#nav-scroll li").each(function (i) {
            var menu_item_hash_name = $(this)
              .children("a")
              .attr("href")
              .split("#");
            var hash_name = hash.split("#");
            if (hash_name[1] == menu_item_hash_name[1]) {
              startPageNumber = $(this).attr("pageid");
            }
          });
          //If URL includes hash, just automatically Open the page
          if (hash !== "" && hash !== "#") {
            if (easyMod) {
              //If browser do not support the 3D animate
              $("#top-perspective").show(0, function () {
                bigBookPosition();
              });
              self._open();
              $("#phone-menu-default").hide();
              $("#scroll-wrap").fadeOut(500);
            } else {
              //Intro Wrapper fadeOut
              $(".intro-wrapper").fadeOut(800);
              $("#top-perspective").show(0, function () {
                bigBookPosition();
              });
              $(".book").animate(
                { marginLeft: "50%" },
                500,
                "easeInBack",
                function () {
                  self._open();
                  $("#phone-menu-default").hide();
                  function hideLittleBook() {
                    $("#scroll-wrap").hide();
                  }
                  setTimeout(hideLittleBook, 500);
                }
              );
            }

            setTimeout(self._jumpPage(startPageNumber), 200);
          }
        }

        if (window.location.hash !== "" && window.location.hash !== "#") {
          autoOpenPage(window.location.hash);
        }

        $("a.flipover,.flipover a,.pushy li a").click(function () {
          $("#phone-menu-default").hide();
          var getlink = $(this).attr("href");
          //Get Hash Value
          var splitUrl = getlink.split("#");
          //Recombine the Hash
          var getHash = "#" + splitUrl[1];

          // window.location.href=getlink;
          //location.reload();

          autoOpenPage(getHash);
        });
      });

      //book menu funcion;
      var menuItems = $("#nav-scroll li.menu-item-object-page");
      var page_slugs = [];
      $(".bb-item").each(function () {
        page_slugs.push($(this).data("slug"));
      });

      var menu_order = [];
      page_slugs.reduce(function (acc, ele, index) {
        if (acc.indexOf(ele) === -1) {
          acc.push(ele);
          menu_order.push(index + 1);
        }
        return acc;
      }, []);

      //var menu_order = [...new Set(page_slugs)].map(v => page_slugs.indexOf(v) + 1);
      console.log(menu_order);
      for (var i = 0; i < menu_order.length; i++) {
        menuItems.eq(i).attr("pageid", menu_order[i]);
      }

      menuItems.on("click touchstart", function () {
        if (!Modernizr.csstransitions) {
          $("#top-wrapper").css({ left: "+=300px" });
        }

        if (phoneMod) {
          $("#menu-wrapper").hide();
        }
        var $el = $(this),
          idx = $el.index();
        $("#top-perspective").removeClass("animate");

        setTimeout(self._jumpPage(parseInt($(this).attr("pageid"))), 200);
      });
    }
  };

  Book.prototype._open = function () {
    docscroll = scrollY();

    classie.add(this.el, "book-open");
    classie.add(this.bbWrapper, "book-show");
    animateBars();
    var self = this,
      onOpenBookEndFn = function (ev) {
        this.removeEventListener(animEndEventName, onOpenBookEndFn);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        //classie.add( scrollWrap, 'hide-overflow' );
      };

    if (supportAnimations) {
      this.bbWrapper.addEventListener(animEndEventName, onOpenBookEndFn);
    } else {
      onOpenBookEndFn.call();
    }
  };

  Book.prototype._close = function () {
    //classie.remove( scrollWrap, 'hide-overflow' );
    setTimeout(function () {
      document.body.scrollTop = document.documentElement.scrollTop = docscroll;
    }, 25);
    classie.remove(this.el, "book-open");
    classie.add(this.el, "book-close");
    classie.remove(this.bbWrapper, "book-show");
    classie.add(this.bbWrapper, "book-hide");
    resetBars();
    var self = this,
      onCloseBookEndFn = function (ev) {
        this.removeEventListener(animEndEventName, onCloseBookEndFn);
        // reset bookblock starting page
        // self.bb.bookblock( 'jump', 1);
        classie.remove(self.el, "book-close");
        classie.remove(self.bbWrapper, "book-hide");
      };

    if (supportAnimations) {
      this.bbWrapper.addEventListener(animEndEventName, onCloseBookEndFn);
    } else {
      onCloseBookEndFn.call();
    }
  };
  Book.prototype._nextPage = function () {
    $(".content-wrapper").perfectScrollbar("update");
    this.bb.bookblock("next");
    $("body").scrollTop(0);
  };

  Book.prototype._prevPage = function () {
    $(".content-wrapper").perfectScrollbar("update");
    this.bb.bookblock("prev");
    $("body").scrollTop(0);
  };

  Book.prototype._jumpPage = function (xp) {
    this.bb.bookblock("jump", xp);
  };

  function psScrollTop() {
    $(".content-wrapper").scrollTop(0);
    $(".content-wrapper").perfectScrollbar("update");
  }

  function initBook() {
    [].slice.call(books).forEach(function (el) {
      new Book(el);
    });
  }

  //init the PerfectScrollBar
  function initPsScroll() {
    $(".content-wrapper,.outer-nav").perfectScrollbar({
      wheelSpeed: 0.5,
      wheelPropagation: false,
      minScrollbarLength: 20,
      suppressScrollX: 1,
      useKeyboard: false,
    });
  }

  /*------Position Reset functions------*/

  function smallBookPosition() {
    var win_h = $(window).height();
    $("#scroll-wrap").css({ height: win_h + "px" });
    $(".main").each(function () {
      var book = $(".book");
      var intro = $(".intro-wrapper");
      var b_top = (win_h - book.height() - 0) / 2;
      var i_top = (win_h - intro.height() - 0) / 2;
      if (b_top > 0) {
        book.css({ top: b_top });
        intro.css({ top: i_top });
      } else {
        book.css({ top: 10 });
        intro.css({ top: i_top });
      }
    });
  }

  function class_vertical_center(the_class) {
    var win_h = $(window).height();
    $the_target = $("." + the_class);
    $the_target.each(function () {
      target = $(this);
      p_top = (win_h - target.height() - 0) / 2;
      if (p_top > 0)
        target.css({
          "padding-top": p_top,
        });
      else
        target.css({
          "padding-top": 10,
        });
    });
  }
  function class_horizon_center(the_class) {
    var win_w = $(window).width();
    var $the_target = $("." + the_class);
    var target = $($the_target);
    var m_left = (win_w - target.width() - 0) / 2;
    if (m_left > 0)
      target.css({
        left: m_left,
      });
    else
      target.css({
        left: m_left,
      });
  }
  function id_horizon_center(the_id) {
    var win_w = $(window).width();
    var $the_target = $("#" + the_id);
    var target = $($the_target);
    var m_left = (win_w - target.width() - 0) / 2;
    if (m_left > 0)
      target.css({
        left: m_left,
      });
    else
      target.css({
        left: m_left,
      });
  }
  function id_vertical_center(the_id) {
    var win_h = $(window).height();
    var $the_target = $("#" + the_id);
    var target = $($the_target);
    var m_top = (win_h - target.height() - 0) / 2;
    if (m_top > 0)
      target.css({
        top: m_top,
      });
    else
      target.css({
        top: m_top,
      });
  }

  //reset the limit size book position in the big screen
  function bigBookPosition() {
    var win_w = $(window).width();
    var win_h = $(window).height();

    if (win_w > 1200) {
      id_horizon_center("top-wrapper");
    } else {
      $("#top-wrapper").css("left", "");
    }

    if (win_h > 768) {
      id_vertical_center("top-wrapper");
    } else {
      $("#top-wrapper").css("top", "");
    }
  }

  //the Menu Button hover animate;
  function menuButtonHover() {
    $(".menu-button").each(function () {
      $(this).mouseover(function () {
        $(this).children("div:eq(0)").width(28);
        $(this).children("div:eq(1)").width(32);
        $(this).children("div:eq(2)").width(26);
      });
      $(this).mouseout(function () {
        $(this).children("div:eq(0)").width(30);
        $(this).children("div:eq(1)").width(20);
        $(this).children("div:eq(2)").width(10);
      });
    });
  }

  //init the Skill bar;
  function initBars() {
    $(".progress-bar").prepend('<div class="bar-percent"></div>');
  }

  //reset the Skill bar;
  function resetBars() {
    $(".progress-bar").each(function () {
      var bar = $(this);
      bar.find(".bar-percent").animate({ width: "6%" }, 1500, "swing");
    });
  }

  //animate the Skill bar;
  function animateBars() {
    $(".progress-bar").each(function () {
      var bar = $(this);
      var percent = bar.attr("data-percent");
      bar.find(".bar-percent").animate({ width: percent + "%" }, 1500, "swing");
    });
  }

  //run the functions, when the document ready
  jQuery(document).ready(function ($) {
    //inte the skill progress bars
    initBars();

    //inte the page navigations
    initNav();

    //the Menu Button hover animate;
    menuButtonHover();

    //form functions
    $("input, textarea").placeholder();

    //init fancybox
    //$('.fancybox').fancybox();
    //init fancybox Media helper
    /*$('.fancybox-media').fancybox({
             openEffect  : 'none',
             closeEffect : 'none',
             helpers : {
                 media : {}
             }
         });	*/

    //init the portfolio filter
    $("li.portfolio-item").addClass("active");

    //Close button-tip animate function
    if (!easyMod) {
      $("#close-button").mouseover(function () {
        $("#close-tip").css({ right: "15%", opacity: ".8" });
      });
      $("#close-button").bind("mouseout click", function () {
        $("#close-tip").css({ right: "-30%", opacity: "0" });
      });
    }

    //init the book(main functions)
    initBook();

    //set element position
    smallBookPosition();
    bigBookPosition();

    var isMobile = {
      Android: function () {
        return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
      },
      any: function () {
        return (
          isMobile.Android() ||
          isMobile.BlackBerry() ||
          isMobile.iOS() ||
          isMobile.Opera() ||
          isMobile.Windows()
        );
      },
    };

    //init the perfect-scroll when it's needed
    if (win_w > 768 && !isMobile.Windows()) {
      initPsScroll();
    }
    if (isMobile.Windows()) {
      $(".content-wrapper").css("overflow", "auto");
    }
  });

  //run the functions, when the window resize
  $(window).bind("resize", function (event) {
    var win_h_n = $(window).height();
    var win_w_n = $(window).width();

    //reset element position
    smallBookPosition();
    bigBookPosition();

    //reload the page when it's needed
    if (win_w > 768) {
      if (win_w_n < 769) {
        location.reload();
      }
    } else {
      if (win_w_n > 768) {
        location.reload();
      }
    }
  });

  //the Phone Menu Function
  $(window).scroll(function () {
    if (
      $(this).scrollTop() > 40 &&
      !$("#top-perspective").hasClass("animate")
    ) {
      $("#phone-menu").fadeIn(500);
    } else {
      $("#phone-menu").fadeOut(500);
    }
  });
});

/**
 * Customed menu.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2013, Codrops
 * http://www.codrops.com
 *
 *  by Kevin-Li.com 2014.3
 */
jQuery(function ($) {
  "use strict";

  function scrollY() {
    return window.pageYOffset || docElem.scrollTop;
  }

  // from http://stackoverflow.com/a/11381730/989439
  function mobilecheck() {
    var check = false;
    (function (a) {
      if (
        /(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  }

  var docElem = window.document.documentElement,
    // support transitions
    support = Modernizr.csstransitions,
    // transition end event name
    transEndEventNames = {
      WebkitTransition: "webkitTransitionEnd",
      MozTransition: "transitionend",
      OTransition: "oTransitionEnd",
      msTransition: "MSTransitionEnd",
      transition: "transitionend",
    },
    transEndEventName = transEndEventNames[Modernizr.prefixed("transition")],
    docscroll = 0,
    // click event (if mobile use touchstart)
    clickevent = mobilecheck() ? "touchstart" : "click";

  function init() {
    var showMenu = document.getElementById("showMenu"),
      perspectiveWrapper = document.getElementById("top-perspective"),
      container = document.getElementById("top-wrapper"),
      contentWrapper = document.getElementById("book-1");

    var phoneMod = $(window).width() < 769;

    $(".open-menu").each(function (ev) {
      $(this).on("click touchstart", function (ev) {
        ev.stopPropagation();
        ev.preventDefault();
        docscroll = scrollY();
        // change top of contentWrapper
        if (closeAction == 1) {
          contentWrapper.style.top = docscroll * -1 + "px";
        }
        // mac chrome issue:
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        // add modalview class
        classie.add(perspectiveWrapper, "modalview");
        // animate..
        $("#phone-menu").fadeOut(300);
        if (phoneMod) {
          $("#menu-wrapper").show();
        }
        setTimeout(function () {
          classie.add(perspectiveWrapper, "animate");
        }, 5);
        if (!Modernizr.csstransitions) {
          $("#top-wrapper").animate({ left: "-=300px" });
        }
      });
    });

    container.addEventListener(clickevent, function (ev) {
      if (classie.has(perspectiveWrapper, "animate")) {
        var onEndTransFn = function (ev) {
          if (
            support &&
            (ev.target.className !== "container" ||
              ev.propertyName.indexOf("transform") == -1)
          )
            return;
          this.removeEventListener(transEndEventName, onEndTransFn);
          classie.remove(perspectiveWrapper, "modalview");
          // mac chrome issue:
          document.body.scrollTop = document.documentElement.scrollTop =
            docscroll;
          // change top of contentWrapper
          contentWrapper.style.top = "0px";
        };
        if (support) {
          perspectiveWrapper.addEventListener(transEndEventName, onEndTransFn);
        } else {
          onEndTransFn.call();
        }
        if (phoneMod) {
          $("#menu-wrapper").hide();
        }
        classie.remove(perspectiveWrapper, "animate");
        if (!Modernizr.csstransitions) {
          $("#top-wrapper").css({ left: "+=300px" });
          //	$('#top-wrapper').css({'left':''});
          //	bigBookPosition();
        }
      }
    });

    perspectiveWrapper.addEventListener(clickevent, function (ev) {
      return false;
    });
  }

  jQuery(document).ready(function ($) {
    init();
  });
});
