NexT.utils = NexT.$u = {
  wrapImageWithFancyBox: function() {
    $(".content img").not(".group-picture img").each(function() {
      var e = $(this),
        t = e.attr("title"),
        i = e.parent("a");
      i.size() < 1 && (i = e.wrap('<a href="' + this.getAttribute("src") + '"></a>').parent("a")), i.addClass("fancybox"), i.attr("rel", "group"), t && (i.append('<p class="image-caption">' + t + "</p>"), i.attr("title", t))
    }), $(".fancybox").fancybox({
      helpers: {
        overlay: {
          locked: !1
        }
      }
    })
  },
  lazyLoadPostsImages: function() {
    $("#posts").find("img").lazyload({
      placeholder: "/images/loading.gif",
      effect: "fadeIn"
    })
  },
  registerBackToTop: function() {
    var e = 50,
      t = $(".back-to-top");
    $(window).on("scroll", function() {
      t.toggleClass("back-to-top-on", window.pageYOffset > e)
    }), t.on("click", function() {
      $("body").velocity("scroll")
    })
  },
  embeddedVideoTransformer: function() {
    function e(e) {
      return {
        width: e.width(),
        height: e.height()
      }
    }

    function t(e, t) {
      return t / e * 100
    }
    var i = $("iframe"),
      n = ["www.youtube.com", "player.vimeo.com", "player.youku.com", "music.163.com", "www.tudou.com"],
      o = new RegExp(n.join("|"));
    i.each(function() {
      var i, n = this,
        s = $(this),
        a = e(s);
      if (this.src.search(o) > 0) {
        var r = t(a.width, a.height);
        s.width("100%").height("100%").css({
          position: "absolute",
          top: "0",
          left: "0"
        });
        var c = document.createElement("div");
        c.className = "fluid-vids", c.style.position = "relative", c.style.marginBottom = "20px", c.style.width = "100%", c.style.paddingTop = r + "%";
        var d = n.parentNode;
        if (d.insertBefore(c, n), c.appendChild(n), this.src.search("music.163.com") > 0) {
          i = e(s);
          var l = i.width > a.width || i.height < a.height;
          l && (c.style.paddingTop = t(i.width, a.height) + "%")
        }
      }
    })
  },
  addActiveClassToMenuItem: function() {
    var e = window.location.pathname;
    e = "/" === e ? e : e.substring(0, e.length - 1), $('.menu-item a[href="' + e + '"]').parent().addClass("menu-item-active")
  },
  hasMobileUA: function() {
    var e = window.navigator,
      t = e.userAgent,
      i = /iPad|iPhone|Android|Opera Mini|BlackBerry|webOS|UCWEB|Blazer|PSP|IEMobile|Symbian/g;
    return i.test(t)
  },
  isTablet: function() {
    return window.screen.width < 992 && window.screen.width > 767 && this.hasMobileUA()
  },
  isMobile: function() {
    return window.screen.width < 767 && this.hasMobileUA()
  },
  isDesktop: function() {
    return !this.isTablet() && !this.isMobile()
  },
  escapeSelector: function(e) {
    return e.replace(/[!"$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&")
  },
  displaySidebar: function() {
    this.isDesktop() && !this.isPisces() && $(".sidebar-toggle").trigger("click")
  },
  isMist: function() {
    return "Mist" === CONFIG.scheme
  },
  isPisces: function() {
    return "Pisces" === CONFIG.scheme
  },
  getScrollbarWidth: function() {
    var e = $("<div />").addClass("scrollbar-measure").prependTo("body"),
      t = e[0],
      i = t.offsetWidth - t.clientWidth;
    return e.remove(), i
  },
  needAffix: function() {
    return this.isPisces()
  }
};