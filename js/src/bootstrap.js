$(document).ready(function() {
  $(document).trigger("bootstrap:before"), NexT.utils.isMobile() && window.FastClick.attach(document.body), NexT.utils.lazyLoadPostsImages(), NexT.utils.registerBackToTop(), $(".site-nav-toggle button").on("click", function() {
    var e = $(".site-nav"),
      o = "site-nav-on",
      t = e.hasClass(o),
      i = t ? "slideUp" : "slideDown",
      a = t ? "removeClass" : "addClass";
    e.stop()[i]("fast", function() {
      e[a](o)
    })
  }), CONFIG.fancybox && NexT.utils.wrapImageWithFancyBox(), NexT.utils.embeddedVideoTransformer(), NexT.utils.addActiveClassToMenuItem(), NexT.motion.integrator.add(NexT.motion.middleWares.logo).add(NexT.motion.middleWares.menu).add(NexT.motion.middleWares.postList).add(NexT.motion.middleWares.sidebar), $(document).trigger("motion:before"), CONFIG.motion && NexT.motion.integrator.bootstrap(), $(document).trigger("bootstrap:after")
});