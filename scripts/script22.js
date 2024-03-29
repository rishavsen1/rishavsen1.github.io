!(function (e, t, r) {
  "use strict";
  if ("undefined" != typeof wpgdprcData) {
    var n,
      c,
      o = function (e, r, n) {
        var c = new Date();
        (r = r || ""),
          (n = n || 365),
          c.setTime(c.getTime() + 24 * n * 60 * 60 * 1e3),
          (t.cookie =
            e +
            "=" +
            encodeURIComponent(r) +
            "; expires=" +
            c.toGMTString() +
            "; path=" +
            u);
      },
      a = function (e) {
        return Object.keys(e)
          .map(function (t) {
            var r = e[t];
            return "object" == typeof r && (r = JSON.stringify(r)), t + "=" + r;
          })
          .join("&");
      },
      s = !1,
      i = wpgdprcData.ajaxURL,
      l = wpgdprcData.ajaxSecurity,
      d = wpgdprcData.isMultisite,
      p = wpgdprcData.blogId,
      u = wpgdprcData.path,
      g = void 0 !== wpgdprcData.consents ? wpgdprcData.consents : [],
      f = function (e, t, r, n) {
        var c = r.querySelector(".wpgdprc-message"),
          o = t.slice(0, 1);
        if (o.length > 0) {
          var s = r.querySelector('tr[data-id="' + o[0] + '"]');
          s.classList.remove("wpgdprc-status--error"),
            s.classList.add("wpgdprc-status--processing"),
            c.setAttribute("style", "display: none;"),
            c.classList.remove("wpgdprc-message--error"),
            (c.innerHTML = ""),
            setTimeout(function () {
              var n = new XMLHttpRequest();
              (e.data.value = o[0]),
                n.open("POST", i),
                n.setRequestHeader(
                  "Content-type",
                  "application/x-www-form-urlencoded; charset=UTF-8"
                ),
                n.send(a(e)),
                n.addEventListener("load", function () {
                  if (n.response) {
                    var o = JSON.parse(n.response);
                    s.classList.remove("wpgdprc-status--processing"),
                      o.error
                        ? (s.classList.add("wpgdprc-status--error"),
                          (c.innerHTML = o.error),
                          c.classList.add("wpgdprc-message--error"),
                          c.removeAttribute("style"))
                        : (t.splice(0, 1),
                          s.querySelector('input[type="checkbox"]').remove(),
                          s.classList.add("wpgdprc-status--removed"),
                          f(e, t, r, 500));
                  }
                });
            }, n || 0);
        }
      },
      v = function () {
        var r = t.querySelector("#wpgdprc-consent-modal");
        if (null !== r && "undefined" != typeof MicroModal) {
          var c,
            a,
            s,
            i,
            l = t.querySelector(
              "[data-micromodal-trigger=wpgdprc-consent-modal]"
            );
          (a = (c = r).querySelectorAll(
            'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
          )),
            (s = a[0]),
            (i = a[a.length - 1]),
            c.addEventListener("keydown", function (e) {
              ("Tab" === e.key || 9 === e.keyCode) &&
                (e.shiftKey
                  ? t.activeElement === s && (i.focus(), e.preventDefault())
                  : t.activeElement === i && (s.focus(), e.preventDefault()));
            }),
            MicroModal.init({
              disableScroll: !0,
              disableFocus: !0,
              onShow: function () {
                l && l.setAttribute("aria-expanded", "true");
              },
              onClose: function (e) {
                var t = e.querySelectorAll(
                    ".wpgdprc-consent-modal__description"
                  ),
                  r = e.querySelectorAll(
                    ".wpgdprc-consent-modal__navigation > a"
                  ),
                  n = e.querySelectorAll('input[type="checkbox"]');
                if (t.length > 0)
                  for (var c = 0; c < t.length; c++)
                    t[c].style.display = 0 === c ? "block" : "none";
                if (r.length > 0)
                  for (c = 0; c < r.length; c++)
                    r[c].classList.remove("wpgdprc-button--active");
                if (n.length > 0)
                  for (c = 0; c < n.length; c++) n[c].checked = !1;
                l && l.setAttribute("aria-expanded", "false");
              },
            });
          var d = t.querySelector(".wpgdprc-consents-settings-link");
          null !== d &&
            d.addEventListener("click", function (e) {
              e.preventDefault(), MicroModal.show("wpgdprc-consent-modal");
            });
          var p = r.querySelectorAll(".wpgdprc-consent-modal__navigation > a");
          if (p.length > 0)
            for (
              var u = r.querySelectorAll(".wpgdprc-consent-modal__description"),
                g = 0;
              g < p.length;
              g++
            )
              p[g].addEventListener("click", function (e) {
                e.preventDefault();
                var t = r.querySelector(
                  '.wpgdprc-consent-modal__description[data-target="' +
                    this.dataset.target +
                    '"]'
                );
                if (null !== t) {
                  for (var n = 0; n < p.length; n++)
                    p[n].classList.remove("wpgdprc-button--active");
                  this.classList.add("wpgdprc-button--active");
                  for (n = 0; n < u.length; n++) u[n].style.display = "none";
                  t.style.display = "block";
                }
              });
          var f = r.querySelector(".wpgdprc-button--secondary");
          null !== f &&
            f.addEventListener("click", function (t) {
              t.preventDefault();
              var c = r.querySelectorAll('input[type="checkbox"]'),
                a = [];
              if (c.length > 0) {
                for (var s = 0; s < c.length; s++) {
                  var i = c[s],
                    l = i.value;
                  !0 !== i.checked || isNaN(l) || a.push(parseInt(l));
                }
                a.length > 0 ? o(n, a) : o(n, "decline");
              } else o(n, "accept");
              e.location.reload(!0);
            });
        }
      },
      y = function () {
        if ("undefined" != typeof postscribe)
          for (
            var e = function (e) {
                var r = (function (e) {
                  var r;
                  switch (e) {
                    case "head":
                      r = t.head;
                      break;
                    case "body":
                      if (
                        null === (r = t.querySelector("#wpgdprc-consent-body"))
                      ) {
                        var n = t.createElement("div");
                        (n.id = "wpgdprc-consent-body"),
                          t.body.prepend(n),
                          (r = "#" + n.id);
                      }
                      break;
                    case "footer":
                      r = t.body;
                  }
                  return r;
                })(e.placement);
                null !== r && postscribe(r, e.content);
              },
              r = null !== c && "accept" !== c ? c.split(",") : [],
              n = 0;
            n < g.length;
            n++
          )
            if (g.hasOwnProperty(n)) {
              var o = g[n];
              (r.indexOf(o.id) >= 0 || o.required || "accept" === c) && e(o);
            }
      },
      w = function () {
        var e = t.querySelectorAll(".wpgdprc-form--delete-request");
        e.length < 1 ||
          e.forEach(function (e) {
            var t = e.querySelector(".wpgdprc-select-all");
            e.addEventListener("submit", function (e) {
              e.preventDefault();
              var r = e.target,
                n = r.querySelectorAll(".wpgdprc-checkbox"),
                c = {
                  action: "wpgdprc_process_action",
                  security: l,
                  data: {
                    type: "delete_request",
                    token: wpgdprcData.token,
                    settings: JSON.parse(r.dataset.wpgdprc),
                  },
                };
              (t.checked = !1),
                f(
                  c,
                  (function (e) {
                    var t = [];
                    return (
                      e.length &&
                        e.forEach(function (e) {
                          var r = parseInt(e.value);
                          e.checked && r > 0 && t.push(r);
                        }),
                      t
                    );
                  })(n),
                  r
                );
            }),
              null !== t &&
                t.addEventListener("change", function (t) {
                  var r = t.target.checked;
                  e.querySelectorAll(".wpgdprc-checkbox").forEach(function (e) {
                    e.checked = r;
                  });
                });
          });
      };
    t.addEventListener("DOMContentLoaded", function () {
      "object" == typeof g &&
        g.length > 0 &&
        ((n =
          (d ? p + "-wpgdprc-consent-" : "wpgdprc-consent-") +
          wpgdprcData.consentVersion),
        (c = (function (e) {
          if (e)
            for (
              var r = encodeURIComponent(e) + "=",
                n = t.cookie.split(";"),
                c = 0;
              c < n.length;
              c++
            ) {
              for (var o = n[c]; " " === o.charAt(0); )
                o = o.substring(1, o.length);
              if (0 === o.indexOf(r))
                return decodeURIComponent(o.substring(r.length, o.length));
            }
          return null;
        })(n)),
        (function () {
          if (null === c) {
            var r = t.querySelector(".wpgdprc-consent-bar");
            if (null !== r) {
              t.querySelector("body").prepend(r), (r.style.display = "block");
              var a = r.querySelector(".wpgdprc-consent-bar__button");
              null !== a &&
                a.addEventListener("click", function (t) {
                  t.preventDefault(), o(n, "accept"), e.location.reload(!0);
                });
            }
          }
        })(),
        v(),
        y()),
        (function () {
          var e = t.querySelector(".wpgdprc-form--access-request");
          if (null !== e) {
            var r = e.querySelector(".wpgdprc-message"),
              n = e.querySelector("#wpgdprc-form__email"),
              c = e.querySelector("#wpgdprc-form__consent");
            e.addEventListener("submit", function (t) {
              if ((t.preventDefault(), !s)) {
                (s = !0),
                  (r.style.display = "none"),
                  r.classList.remove(
                    "wpgdprc-message--success",
                    "wpgdprc-message--error"
                  ),
                  (r.innerHTML = "");
                var o = {
                    action: "wpgdprc_process_action",
                    security: l,
                    data: {
                      type: "access_request",
                      email: n.value,
                      consent: c.checked,
                    },
                  },
                  d = new XMLHttpRequest();
                (o = a(o)),
                  d.open("POST", i, !0),
                  d.setRequestHeader(
                    "Content-type",
                    "application/x-www-form-urlencoded; charset=UTF-8"
                  ),
                  d.send(o),
                  d.addEventListener("load", function () {
                    if (d.response) {
                      var t = JSON.parse(d.response);
                      t.message &&
                        (e.reset(),
                        n.blur(),
                        (r.innerHTML = t.message),
                        r.classList.add("wpgdprc-message--success"),
                        r.removeAttribute("style")),
                        t.error &&
                          (n.focus(),
                          (r.innerHTML = t.error),
                          r.classList.add("wpgdprc-message--error"),
                          r.removeAttribute("style"));
                    }
                    s = !1;
                  });
              }
            });
          }
        })(),
        w();
    });
  }
})(window, document);
