function hookTemplate() {
  var o = DUOSHUO.templates.post;
  DUOSHUO.templates.post = function(e, a) {
    var s = o(e, a),
      r = e.post.agent,
      n = e.post.author.user_id,
      i = "";
    return n && n == CONFIG.duoshuo.userId && (i = '<span class="duoshuo-ua-admin">' + CONFIG.duoshuo.author + "</span>"), r && /^Mozilla/.test(r) && (s = s.replace(/<\/div><p>/, i + getAgentInfo(r) + "</div><p>")), s
  }
}

function getAgentInfo(o) {
  function e() {
    var o = u.toLowerCase();
    return o.match(/WeChat/i) ? "wechat" : o.match(/QQBrowser/i) ? "qq" : o
  }

  function a() {
    var o = window.navigator.userAgent,
      e = null !== o.match(/iPad/i),
      a = ["iphone", "android", "phone", "mobile", "wap", "netfront", "x11", "java", "opera mobi", "opera mini", "ucweb", "windows ce", "symbian", "symbianos", "series", "webos", "sony", "blackberry", "dopod", "nokia", "samsung", "palmsource", "xda", "pieplus", "meizu", "midp", "cldc", "motorola", "foma", "docomo", "up.browser", "up.link", "blazer", "helio", "hosin", "huawei", "novarra", "coolpad", "webos", "techfaith", "palmsource", "alcatel", "amoi", "ktouch", "nexian", "ericsson", "philips", "sagem", "wellcom", "bunjalloo", "maui", "smartphone", "iemobile", "spice", "bird", "zte-", "longcos", "pantech", "gionee", "portalmmm", "jig browser", "hiptop", "benq", "haier", "^lct", "320x320", "240x320", "176x220"],
      s = new RegExp(a.join("|"), "i");
    return !e && o.match(s)
  }
  $.ua.set(o);
  var s = "Unknown",
    r = $.ua,
    n = a() ? "<br><br>" : '<span class="duoshuo-ua-separator"></span>',
    i = r.os.name || s,
    t = r.os.version || s,
    u = r.browser.name || s,
    p = r.browser.version || s,
    l = {
      os: {
        android: "android",
        linux: "linux",
        windows: "windows",
        ios: "apple",
        "mac os": "apple",
        unknown: "desktop"
      },
      browser: {
        chrome: "chrome",
        chromium: "chrome",
        firefox: "firefox",
        opera: "opera",
        safari: "safari",
        ie: "internet-explorer",
        wechat: "wechat",
        qq: "qq",
        unknown: "globe"
      }
    },
    c = l.os[i.toLowerCase()],
    m = l.browser[e()];
  return n + '<span class="duoshuo-ua-platform duoshuo-ua-platform-' + i.toLowerCase() + '"><i class="fa fa-' + c + '"></i>' + i + " " + t + "</span>" + n + '<span class="duoshuo-ua-browser duoshuo-ua-browser-' + u.toLowerCase() + '"><i class="fa fa-' + m + '"></i>' + u + " " + p + "</span>"
}
"undefined" != typeof DUOSHUO ? hookTemplate() : $("#duoshuo-script")[0].onload = hookTemplate;