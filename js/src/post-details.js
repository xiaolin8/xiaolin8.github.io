$(document).ready(function() {
  function t() {
    function t() {
      $(i + " " + o).removeClass(o.substring(1))
    }
    var i = ".post-toc",
      e = $(i),
      o = ".active-current";
    e.on("activate.bs.scrollspy", function() {
      var e = $(i + " .active").last();
      t(), e.addClass("active-current")
    }).on("clear.bs.scrollspy", t), $("body").scrollspy({
      target: i
    })
  }

  function i() {
    var t = $(".header-inner").height(),
      i = parseInt($(".main").css("padding-bottom"), 10),
      e = t + 10;
    $(".sidebar-inner").affix({
      offset: {
        top: e,
        bottom: i
      }
    }), $(document).on("affixed.bs.affix", function() {
      o(document.body.clientHeight - 100)
    })
  }

  function e() {
    var t;
    $(window).on("resize", function() {
      t && clearTimeout(t), t = setTimeout(function() {
        var t = document.body.clientHeight - 100;
        o(t)
      }, 0)
    }), o(document.body.clientHeight - 100);
    var i = NexT.utils.getScrollbarWidth();
    $(".post-toc").css("width", "calc(100% + " + i + "px)")
  }

  function o(t) {
    t = t || "auto", $(".post-toc").css("max-height", t)
  }
  t(), NexT.utils.needAffix() && i(), e()
}), $(document).ready(function() {
  var t = $("html"),
    i = 200,
    e = $.isFunction(t.velocity);
  $(".sidebar-nav li").on("click", function() {
    var t = $(this),
      o = "sidebar-nav-active",
      a = "sidebar-panel-active";
    if (!t.hasClass(o)) {
      var n = $("." + a),
        s = $("." + t.data("target"));
      e ? n.velocity("transition.slideUpOut", i, function() {
        s.velocity("stop").velocity("transition.slideDownIn", i).addClass(a)
      }) : n.animate({
        opacity: 0
      }, i, function() {
        n.hide(), s.stop().css({
          opacity: 0,
          display: "block"
        }).animate({
          opacity: 1
        }, i, function() {
          n.removeClass(a), s.addClass(a)
        })
      }), t.siblings().removeClass(o), t.addClass(o)
    }
  }), $(".post-toc a").on("click", function(i) {
    i.preventDefault();
    var o = NexT.utils.escapeSelector(this.getAttribute("href")),
      a = $(o).offset().top;
    e ? t.velocity("stop").velocity("scroll", {
      offset: a + "px",
      mobileHA: !1
    }) : $("html, body").stop().animate({
      scrollTop: a
    }, 500)
  }), NexT.motion.middleWares.sidebar = function() {
    var t = $(".post-toc-content");
    "post" !== CONFIG.sidebar.display && "always" !== CONFIG.sidebar.display || t.length > 0 && t.html().trim().length > 0 && NexT.utils.displaySidebar()
  }
});