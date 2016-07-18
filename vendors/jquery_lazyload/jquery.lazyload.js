! function(e, t, i, o) {
  var n = e(t);
  e.fn.lazyload = function(r) {
    function f() {
      var t = 0;
      l.each(function() {
        var i = e(this);
        if (!h.skip_invisible || i.is(":visible"))
          if (e.abovethetop(this, h) || e.leftofbegin(this, h));
          else if (e.belowthefold(this, h) || e.rightoffold(this, h)) {
          if (++t > h.failure_limit) return !1
        } else i.trigger("appear"), t = 0
      })
    }
    var a, l = this,
      h = {
        threshold: 0,
        failure_limit: 0,
        event: "scroll",
        effect: "show",
        container: t,
        data_attribute: "original",
        skip_invisible: !1,
        appear: null,
        load: null,
        placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
      };
    return r && (o !== r.failurelimit && (r.failure_limit = r.failurelimit, delete r.failurelimit), o !== r.effectspeed && (r.effect_speed = r.effectspeed, delete r.effectspeed), e.extend(h, r)), a = h.container === o || h.container === t ? n : e(h.container), 0 === h.event.indexOf("scroll") && a.bind(h.event, function() {
      return f()
    }), this.each(function() {
      var t = this,
        i = e(t);
      t.loaded = !1, i.attr("src") !== o && i.attr("src") !== !1 || i.is("img") && i.attr("src", h.placeholder), i.one("appear", function() {
        if (!this.loaded) {
          if (h.appear) {
            var o = l.length;
            h.appear.call(t, o, h)
          }
          e("<img />").bind("load", function() {
            var o = i.attr("data-" + h.data_attribute);
            i.hide(), i.is("img") ? i.attr("src", o) : i.css("background-image", "url('" + o + "')"), i[h.effect](h.effect_speed), t.loaded = !0;
            var n = e.grep(l, function(e) {
              return !e.loaded
            });
            if (l = e(n), h.load) {
              var r = l.length;
              h.load.call(t, r, h)
            }
          }).attr("src", i.attr("data-" + h.data_attribute))
        }
      }), 0 !== h.event.indexOf("scroll") && i.bind(h.event, function() {
        t.loaded || i.trigger("appear")
      })
    }), n.bind("resize", function() {
      f()
    }), /(?:iphone|ipod|ipad).*os 5/gi.test(navigator.appVersion) && n.bind("pageshow", function(t) {
      t.originalEvent && t.originalEvent.persisted && l.each(function() {
        e(this).trigger("appear")
      })
    }), e(i).ready(function() {
      f()
    }), this
  }, e.belowthefold = function(i, r) {
    var f;
    return f = r.container === o || r.container === t ? (t.innerHeight ? t.innerHeight : n.height()) + n.scrollTop() : e(r.container).offset().top + e(r.container).height(), f <= e(i).offset().top - r.threshold
  }, e.rightoffold = function(i, r) {
    var f;
    return f = r.container === o || r.container === t ? n.width() + n.scrollLeft() : e(r.container).offset().left + e(r.container).width(), f <= e(i).offset().left - r.threshold
  }, e.abovethetop = function(i, r) {
    var f;
    return f = r.container === o || r.container === t ? n.scrollTop() : e(r.container).offset().top, f >= e(i).offset().top + r.threshold + e(i).height()
  }, e.leftofbegin = function(i, r) {
    var f;
    return f = r.container === o || r.container === t ? n.scrollLeft() : e(r.container).offset().left, f >= e(i).offset().left + r.threshold + e(i).width()
  }, e.inviewport = function(t, i) {
    return !(e.rightoffold(t, i) || e.leftofbegin(t, i) || e.belowthefold(t, i) || e.abovethetop(t, i))
  }, e.extend(e.expr[":"], {
    "below-the-fold": function(t) {
      return e.belowthefold(t, {
        threshold: 0
      })
    },
    "above-the-top": function(t) {
      return !e.belowthefold(t, {
        threshold: 0
      })
    },
    "right-of-screen": function(t) {
      return e.rightoffold(t, {
        threshold: 0
      })
    },
    "left-of-screen": function(t) {
      return !e.rightoffold(t, {
        threshold: 0
      })
    },
    "in-viewport": function(t) {
      return e.inviewport(t, {
        threshold: 0
      })
    },
    "above-the-fold": function(t) {
      return !e.belowthefold(t, {
        threshold: 0
      })
    },
    "right-of-fold": function(t) {
      return e.rightoffold(t, {
        threshold: 0
      })
    },
    "left-of-fold": function(t) {
      return !e.rightoffold(t, {
        threshold: 0
      })
    }
  })
}(jQuery, window, document);