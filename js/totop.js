! function(o) {
  var t = 1e3,
    n = o("#totop"),
    c = 500;
  n.hide(), o(window).scroll(function() {
    var c = o(document).scrollTop();
    c > t ? o(n).stop().fadeTo(300, 1) : o(n).stop().fadeTo(300, 0)
  }), o(n).click(function() {
    return o("html, body").animate({
      scrollTop: 0
    }, c), !1
  })
}(jQuery);