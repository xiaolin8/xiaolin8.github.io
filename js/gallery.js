! function(i) {
  i(".entry").each(function(t) {
    i(this).find("img").each(function() {
      if (!i(this).hasClass("nofancybox")) {
        var a = this.alt;
        a && i(this).after('<span class="caption">' + a + "</span>"), i(this).wrap('<a href="' + this.src + '" title="' + a + '" class="fancybox" rel="gallery' + t + '" />')
      }
    })
  });
  var t = function(i, t, a) {
    var n = i.width();
    t.imagesLoaded(function() {
      var t = this[0],
        e = t.naturalWidth,
        c = t.naturalHeight;
      a(), this.animate({
        opacity: 1
      }, 500), i.animate({
        height: n * c / e
      }, 500)
    })
  };
  i(".gallery").each(function() {
    var a = i(this),
      n = 0,
      e = a.children(".photoset").children(),
      c = e.length,
      h = !0;
    t(a, e.eq(0), function() {
      h = !1
    }), a.on("click", ".prev", function() {
      if (!h) {
        var i = (n - 1) % c;
        h = !0, t(a, e.eq(i), function() {
          e.eq(n).animate({
            opacity: 0
          }, 500), h = !1, n = i
        })
      }
    }).on("click", ".next", function() {
      if (!h) {
        var i = (n + 1) % c;
        h = !0, t(a, e.eq(i), function() {
          e.eq(n).animate({
            opacity: 0
          }, 500), h = !1, n = i
        })
      }
    })
  })
}(jQuery);