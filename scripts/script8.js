/*! This file is auto-generated */
!(function (I) {
  I.fn.hoverIntent = function (e, t, n) {
    function r(e) {
      (o = e.pageX), (v = e.pageY);
    }
    var o,
      v,
      i,
      u,
      s = { interval: 100, sensitivity: 6, timeout: 0 },
      s =
        "object" == typeof e
          ? I.extend(s, e)
          : I.isFunction(t)
          ? I.extend(s, { over: e, out: t, selector: n })
          : I.extend(s, { over: e, out: e, selector: t }),
      h = function (e, t) {
        if (
          ((t.hoverIntent_t = clearTimeout(t.hoverIntent_t)),
          Math.sqrt((i - o) * (i - o) + (u - v) * (u - v)) < s.sensitivity)
        )
          return (
            I(t).off("mousemove.hoverIntent", r),
            (t.hoverIntent_s = !0),
            s.over.apply(t, [e])
          );
        (i = o),
          (u = v),
          (t.hoverIntent_t = setTimeout(function () {
            h(e, t);
          }, s.interval));
      },
      t = function (e) {
        var n = I.extend({}, e),
          o = this;
        o.hoverIntent_t && (o.hoverIntent_t = clearTimeout(o.hoverIntent_t)),
          "mouseenter" === e.type
            ? ((i = n.pageX),
              (u = n.pageY),
              I(o).on("mousemove.hoverIntent", r),
              o.hoverIntent_s ||
                (o.hoverIntent_t = setTimeout(function () {
                  h(n, o);
                }, s.interval)))
            : (I(o).off("mousemove.hoverIntent", r),
              o.hoverIntent_s &&
                (o.hoverIntent_t = setTimeout(function () {
                  var e, t;
                  (e = n),
                    ((t = o).hoverIntent_t = clearTimeout(t.hoverIntent_t)),
                    (t.hoverIntent_s = !1),
                    s.out.apply(t, [e]);
                }, s.timeout)));
      };
    return this.on(
      { "mouseenter.hoverIntent": t, "mouseleave.hoverIntent": t },
      s.selector
    );
  };
})(jQuery);
