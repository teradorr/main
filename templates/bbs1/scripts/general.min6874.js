(window.Modernizr = (function (r, d, o) {
  function e(e) {
    l.cssText = e;
  }
  function n(e, t) {
    return typeof e === t;
  }
  var t,
    i,
    a = {},
    f = d.documentElement,
    p = "modernizr",
    c = d.createElement(p),
    l = c.style,
    s = {}.toString,
    u = " -webkit- -moz- -o- -ms- ".split(" "),
    h = "http://www.w3.org/2000/svg",
    m = {},
    v = [],
    y = v.slice,
    g = function (e, t, n, r) {
      var o,
        i,
        a,
        c,
        l = d.createElement("div"),
        s = d.body,
        u = s || d.createElement("body");
      if (parseInt(n, 10))
        for (; n--; )
          ((a = d.createElement("div")).id = r ? r[n] : p + (n + 1)),
            l.appendChild(a);
      return (
        (o = ["&#173;", '<style id="s', p, '">', e, "</style>"].join("")),
        (l.id = p),
        ((s ? l : u).innerHTML += o),
        u.appendChild(l),
        s ||
          ((u.style.background = ""),
          (u.style.overflow = "hidden"),
          (c = f.style.overflow),
          (f.style.overflow = "hidden"),
          f.appendChild(u)),
        (i = t(l, e)),
        s
          ? l.parentNode.removeChild(l)
          : (u.parentNode.removeChild(u), (f.style.overflow = c)),
        !!i
      );
    },
    E = {}.hasOwnProperty;
  for (var b in ((i =
    n(E, "undefined") || n(E.call, "undefined")
      ? function (e, t) {
          return t in e && n(e.constructor.prototype[t], "undefined");
        }
      : function (e, t) {
          return E.call(e, t);
        }),
  Function.prototype.bind ||
    (Function.prototype.bind = function (r) {
      var o = this;
      if ("function" != typeof o) throw new TypeError();
      var i = y.call(arguments, 1),
        a = function () {
          if (this instanceof a) {
            var e = function () {};
            e.prototype = o.prototype;
            var t = new e(),
              n = o.apply(t, i.concat(y.call(arguments)));
            return Object(n) === n ? n : t;
          }
          return o.apply(r, i.concat(y.call(arguments)));
        };
      return a;
    }),
  (m.touch = function () {
    var t;
    return (
      "ontouchstart" in r || (r.DocumentTouch && d instanceof DocumentTouch)
        ? (t = !0)
        : g(
            [
              "@media (",
              u.join("touch-enabled),("),
              p,
              ")",
              "{#modernizr{top:9px;position:absolute}}",
            ].join(""),
            function (e) {
              t = 9 === e.offsetTop;
            }
          ),
      t
    );
  }),
  (m.svg = function () {
    return !!d.createElementNS && !!d.createElementNS(h, "svg").createSVGRect;
  }),
  (m.inlinesvg = function () {
    var e = d.createElement("div");
    return (
      (e.innerHTML = "<svg/>"), (e.firstChild && e.firstChild.namespaceURI) == h
    );
  }),
  (m.svgclippaths = function () {
    return (
      !!d.createElementNS &&
      /SVGClipPath/.test(s.call(d.createElementNS(h, "clipPath")))
    );
  }),
  m))
    i(m, b) &&
      ((t = b.toLowerCase()), (a[t] = m[b]()), v.push((a[t] ? "" : "no-") + t));
  return (
    (a.addTest = function (e, t) {
      if ("object" == typeof e) for (var n in e) i(e, n) && a.addTest(n, e[n]);
      else {
        if (((e = e.toLowerCase()), a[e] !== o)) return a;
        (t = "function" == typeof t ? t() : t),
          (f.className += " " + (t ? "" : "no-") + e),
          (a[e] = t);
      }
      return a;
    }),
    e(""),
    (c = null),
    (function (e, l) {
      function s() {
        var e = h.elements;
        return "string" == typeof e ? e.split(" ") : e;
      }
      function u(e) {
        var t = c[e[r]];
        return t || ((t = {}), a++, (e[r] = a), (c[a] = t)), t;
      }
      function d(e, t, n) {
        return (
          t || (t = l),
          p
            ? t.createElement(e)
            : (n || (n = u(t)),
              (r = n.cache[e]
                ? n.cache[e].cloneNode()
                : i.test(e)
                ? (n.cache[e] = n.createElem(e)).cloneNode()
                : n.createElem(e)).canHaveChildren && !o.test(e)
                ? n.frag.appendChild(r)
                : r)
        );
        var r;
      }
      function t(e) {
        e || (e = l);
        var t,
          n,
          r,
          o,
          i,
          a,
          c = u(e);
        return (
          h.shivCSS &&
            !f &&
            !c.hasCSS &&
            (c.hasCSS =
              ((o =
                "article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}"),
              (i = (r = e).createElement("p")),
              (a = r.getElementsByTagName("head")[0] || r.documentElement),
              (i.innerHTML = "x<style>" + o + "</style>"),
              !!a.insertBefore(i.lastChild, a.firstChild))),
          p ||
            ((t = e),
            (n = c).cache ||
              ((n.cache = {}),
              (n.createElem = t.createElement),
              (n.createFrag = t.createDocumentFragment),
              (n.frag = n.createFrag())),
            (t.createElement = function (e) {
              return h.shivMethods ? d(e, t, n) : n.createElem(e);
            }),
            (t.createDocumentFragment = Function(
              "h,f",
              "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" +
                s()
                  .join()
                  .replace(/\w+/g, function (e) {
                    return (
                      n.createElem(e), n.frag.createElement(e), 'c("' + e + '")'
                    );
                  }) +
                ");return n}"
            )(h, n.frag))),
          e
        );
      }
      var f,
        p,
        n = e.html5 || {},
        o =
          /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
        i =
          /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
        r = "_html5shiv",
        a = 0,
        c = {};
      !(function () {
        try {
          var e = l.createElement("a");
          (e.innerHTML = "<xyz></xyz>"),
            (f = "hidden" in e),
            (p =
              1 == e.childNodes.length ||
              (function () {
                l.createElement("a");
                var e = l.createDocumentFragment();
                return (
                  void 0 === e.cloneNode ||
                  void 0 === e.createDocumentFragment ||
                  void 0 === e.createElement
                );
              })());
        } catch (e) {
          p = f = !0;
        }
      })();
      var h = {
        elements:
          n.elements ||
          "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",
        shivCSS: !1 !== n.shivCSS,
        supportsUnknownElements: p,
        shivMethods: !1 !== n.shivMethods,
        type: "default",
        shivDocument: t,
        createElement: d,
        createDocumentFragment: function (e, t) {
          if ((e || (e = l), p)) return e.createDocumentFragment();
          for (
            var n = (t = t || u(e)).frag.cloneNode(),
              r = 0,
              o = s(),
              i = o.length;
            r < i;
            r++
          )
            n.createElement(o[r]);
          return n;
        },
      };
      (e.html5 = h), t(l);
    })(this, d),
    (a._version = "2.6.2"),
    (a._prefixes = u),
    (a.mq = function (e) {
      var t,
        n = r.matchMedia || r.msMatchMedia;
      return n
        ? n(e).matches
        : (g(
            "@media " + e + " { #" + p + " { position: absolute; } }",
            function (e) {
              t =
                "absolute" ==
                (r.getComputedStyle
                  ? getComputedStyle(e, null)
                  : e.currentStyle
                ).position;
            }
          ),
          t);
    }),
    (a.testStyles = g),
    (f.className =
      f.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + " js " + v.join(" ")),
    a
  );
})(this, this.document)),
  (function (e, f, c) {
    function d(e) {
      return "[object Function]" == o.call(e);
    }
    function p(e) {
      return "string" == typeof e;
    }
    function h() {}
    function m(e) {
      return !e || "loaded" == e || "complete" == e || "uninitialized" == e;
    }
    function v() {
      var e = b.shift();
      (S = 1),
        e
          ? e.t
            ? g(function () {
                ("c" == e.t
                  ? y.injectCss
                  : y.injectJs)(e.s, 0, e.a, e.x, e.e, 1);
              }, 0)
            : (e(), v())
          : (S = 0);
    }
    function t(e, t, n, r, o) {
      return (
        (S = 0),
        (t = t || "j"),
        p(e)
          ? (function (n, r, e, t, o, i, a) {
              function c(e) {
                if (
                  !s &&
                  m(l.readyState) &&
                  ((d.r = s = 1),
                  !S && v(),
                  (l.onload = l.onreadystatechange = null),
                  e)
                )
                  for (var t in ("img" != n &&
                    g(function () {
                      w.removeChild(l);
                    }, 50),
                  M[r]))
                    M[r].hasOwnProperty(t) && M[r][t].onload();
              }
              a = a || y.errorTimeout;
              var l = f.createElement(n),
                s = 0,
                u = 0,
                d = { t: e, s: r, e: o, a: i, x: a };
              1 === M[r] && ((u = 1), (M[r] = [])),
                "object" == n ? (l.data = r) : ((l.src = r), (l.type = n)),
                (l.width = l.height = "0"),
                (l.onerror =
                  l.onload =
                  l.onreadystatechange =
                    function () {
                      c.call(this, u);
                    }),
                b.splice(t, 0, d),
                "img" != n &&
                  (u || 2 === M[r]
                    ? (w.insertBefore(l, C ? null : E), g(c, a))
                    : M[r].push(l));
            })("c" == t ? s : a, e, t, this.i++, n, r, o)
          : (b.splice(this.i++, 0, e), 1 == b.length && v()),
        this
      );
    }
    function l() {
      var e = y;
      return (e.loader = { load: t, i: 0 }), e;
    }
    var n,
      y,
      r = f.documentElement,
      g = e.setTimeout,
      E = f.getElementsByTagName("script")[0],
      o = {}.toString,
      b = [],
      S = 0,
      i = "MozAppearance" in r.style,
      C = i && !!f.createRange().compareNode,
      w = C ? r : E.parentNode,
      a =
        ((r = e.opera && "[object Opera]" == o.call(e.opera)),
        (r = !!f.attachEvent && !r),
        i ? "object" : r ? "script" : "img"),
      s = r ? "script" : a,
      j =
        Array.isArray ||
        function (e) {
          return "[object Array]" == o.call(e);
        },
      N = [],
      M = {},
      T = {
        timeout: function (e, t) {
          return t.length && (e.timeout = t[0]), e;
        },
      };
    ((y = function (e) {
      function u(e, t, n, r, o) {
        var i = (function (e) {
            e = e.split("!");
            var t,
              n,
              r,
              o = N.length,
              i = e.pop(),
              a = e.length;
            for (i = { url: i, origUrl: i, prefixes: e }, n = 0; n < a; n++)
              (r = e[n].split("=")), (t = T[r.shift()]) && (i = t(i, r));
            for (n = 0; n < o; n++) i = N[n](i);
            return i;
          })(e),
          a = i.autoCallback;
        i.url.split(".").pop().split("?").shift(),
          i.bypass ||
            (t &&
              (t = d(t)
                ? t
                : t[e] || t[r] || t[e.split("/").pop().split("?")[0]]),
            i.instead
              ? i.instead(e, t, n, r, o)
              : (M[i.url] ? (i.noexec = !0) : (M[i.url] = 1),
                n.load(
                  i.url,
                  i.forceCSS ||
                    (!i.forceJS &&
                      "css" == i.url.split(".").pop().split("?").shift())
                    ? "c"
                    : c,
                  i.noexec,
                  i.attrs,
                  i.timeout
                ),
                (d(t) || d(a)) &&
                  n.load(function () {
                    l(),
                      t && t(i.origUrl, o, r),
                      a && a(i.origUrl, o, r),
                      (M[i.url] = 2);
                  })));
      }
      function t(e, t) {
        function n(n, e) {
          if (n) {
            if (p(n))
              e ||
                (c = function () {
                  var e = [].slice.call(arguments);
                  l.apply(this, e), s();
                }),
                u(n, c, t, 0, i);
            else if (Object(n) === n)
              for (o in ((r = (function () {
                var e,
                  t = 0;
                for (e in n) n.hasOwnProperty(e) && t++;
                return t;
              })()),
              n))
                n.hasOwnProperty(o) &&
                  (!e &&
                    !--r &&
                    (d(c)
                      ? (c = function () {
                          var e = [].slice.call(arguments);
                          l.apply(this, e), s();
                        })
                      : (c[o] = (function (t) {
                          return function () {
                            var e = [].slice.call(arguments);
                            t && t.apply(this, e), s();
                          };
                        })(l[o]))),
                  u(n[o], c, t, o, i));
          } else !e && s();
        }
        var r,
          o,
          i = !!e.test,
          a = e.load || e.both,
          c = e.callback || h,
          l = c,
          s = e.complete || h;
        n(i ? e.yep : e.nope, !!a), a && n(a);
      }
      var n,
        r,
        o = this.yepnope.loader;
      if (p(e)) u(e, 0, o, 0);
      else if (j(e))
        for (n = 0; n < e.length; n++)
          p((r = e[n]))
            ? u(r, 0, o, 0)
            : j(r)
            ? y(r)
            : Object(r) === r && t(r, o);
      else Object(e) === e && t(e, o);
    }).addPrefix = function (e, t) {
      T[e] = t;
    }),
      (y.addFilter = function (e) {
        N.push(e);
      }),
      (y.errorTimeout = 1e4),
      null == f.readyState &&
        f.addEventListener &&
        ((f.readyState = "loading"),
        f.addEventListener(
          "DOMContentLoaded",
          (n = function () {
            f.removeEventListener("DOMContentLoaded", n, 0),
              (f.readyState = "complete");
          }),
          0
        )),
      (e.yepnope = l()),
      (e.yepnope.executeStack = v),
      (e.yepnope.injectJs = function (e, t, n, r, o, i) {
        var a,
          c,
          l = f.createElement("script");
        r = r || y.errorTimeout;
        for (c in ((l.src = e), n)) l.setAttribute(c, n[c]);
        (t = i ? v : t || h),
          (l.onreadystatechange = l.onload =
            function () {
              !a &&
                m(l.readyState) &&
                ((a = 1), t(), (l.onload = l.onreadystatechange = null));
            }),
          g(function () {
            a || t((a = 1));
          }, r),
          o ? l.onload() : E.parentNode.insertBefore(l, E);
      }),
      (e.yepnope.injectCss = function (e, t, n, r, o, i) {
        var a;
        (r = f.createElement("link")), (t = i ? v : t || h);
        for (a in ((r.href = e),
        (r.rel = "stylesheet"),
        (r.type = "text/css"),
        n))
          r.setAttribute(a, n[a]);
        o || (E.parentNode.insertBefore(r, E), g(t, 0));
      });
  })(this, document),
  (Modernizr.load = function () {
    yepnope.apply(window, [].slice.call(arguments, 0));
  }),
  Modernizr.addTest("ie8compat", function () {
    return (
      !window.addEventListener &&
      document.documentMode &&
      7 === document.documentMode
    );
  });
!(function (e, n, o, t) {
  e.fn.doubleTapToGo = function (t) {
    return (
      !!(
        "ontouchstart" in n ||
        navigator.msMaxTouchPoints ||
        navigator.userAgent.toLowerCase().match(/windows phone os 7/i)
      ) &&
      (this.each(function () {
        var a = !1;
        e(this).on("click", function (t) {
          var n = e(this);
          n[0] != a[0] && (t.preventDefault(), (a = n));
        }),
          e(o).on("click touchstart MSPointerDown", function (t) {
            for (
              var n = !0, o = e(t.target).parents(), i = 0;
              i < o.length;
              i++
            )
              o[i] == a[0] && (n = !1);
            n && (a = !1);
          });
      }),
      this)
    );
  };
})(jQuery, window, document);
jQuery(document).ready(function () {
  jQuery(".sidr-class-parent:not(.sidr-class-active) ul").slideToggle().hide(),
    jQuery(".sidr-class-parent").prepend("<span class='toggl0r'></span>"),
    jQuery(".sidr-class-parent.sidr-class-active > span.toggl0r").addClass(
      "open"
    ),
    jQuery(".sidr-class-parent > span.toggl0r").click(function () {
      return (
        jQuery(this).siblings("ul").slideToggle(),
        jQuery(this).toggleClass("open"),
        !1
      );
    }),
    (window.onresize = function () {
      jQuery.sidr("close", "sidr-main");
    }),
    jQuery(".nav_trigger").click(function () {
      jQuery(this)
        .toggleClass("active")
        .find(".innerTrigger")
        .toggleClass("open"),
        jQuery(this).parent().toggleClass("active");
    }),
    jQuery("a.close").click(function () {
      jQuery(this).parent().hide();
    }),
    jQuery(".nav.menu li:has(ul)").doubleTapToGo(),
    "de-DE" == jQuery("html").attr("lang") &&
      jQuery(".sigProContainer img").each(function () {
        jQuery(this).attr("title", "Zum Vergrößern klicken");
      }),
    jQuery(
      ".content_fixed_right .moduletable>h3,.content_fixed_left .moduletable > h3"
    ).click(function () {
      jQuery(this).parent().hasClass("active")
        ? jQuery(this).parent().removeClass("active")
        : (jQuery(
            ".content_fixed_right .moduletable, .content_fixed_left .moduletable"
          ).removeClass("active"),
          jQuery(this).parent().addClass("active"));
    }),
    jQuery("button.scroll_to_top").click(function () {
      return jQuery("html, body").animate({ scrollTop: 0 }, "slow"), !1;
    }),
    jQuery(
      ".page-header >h1, .content_main_bottom .moduletable .page-header > h2, .contact-category > h1"
    ).wrapInner("<span></span>"),
    jQuery(".miscBox").click(function () {
      jQuery(this).toggleClass("active");
    }),
    jQuery(window).on("resize scroll", function () {
      ($offset = jQuery(document).scrollTop()),
        50 < $offset ? jQuery(".top_top").show() : jQuery(".top_top").hide(),
        !0 === jQuery("footer").visible(!0)
          ? jQuery(".top_top").addClass("stick")
          : jQuery(".top_top").removeClass("stick");
    });
}),
  jQuery(window).on("scroll", function () {
    ($scroll = jQuery(window).scrollTop()),
      1 <= $scroll
        ? jQuery(".sketchwrap_top").addClass("solid")
        : jQuery(".sketchwrap_top").removeClass("solid");
  }),
  jQuery(window).on("load", function () {
    0 < jQuery("#system-message").length &&
      jQuery("html, body").animate(
        {
          scrollTop:
            jQuery("#system-message").offset().top +
            jQuery("#system-message").outerHeight(!0) -
            jQuery(window).height(),
        },
        1e3
      );
  }),
  jQuery(document).on("click", ".toggleParent", function (e) {
    jQuery(this)
      .parent()
      .find(".toggleContent")
      .toggleClass("active")
      .slideToggle();
  });
!(function (t) {
  "use strict";
  "function" == typeof define && define.amd
    ? define(["jquery"], t)
    : "undefined" != typeof module && module.exports
    ? (module.exports = t(require("jquery")))
    : t(jQuery);
})(function (l) {
  var n = -1,
    a = -1,
    h = function (t) {
      return parseFloat(t) || 0;
    },
    c = function (t) {
      var e = l(t),
        n = null,
        a = [];
      return (
        e.each(function () {
          var t = l(this),
            e = t.offset().top - h(t.css("margin-top")),
            o = 0 < a.length ? a[a.length - 1] : null;
          null === o
            ? a.push(t)
            : Math.floor(Math.abs(n - e)) <= 1
            ? (a[a.length - 1] = o.add(t))
            : a.push(t),
            (n = e);
        }),
        a
      );
    },
    p = function (t) {
      var e = { byRow: !0, property: "height", target: null, remove: !1 };
      return "object" == typeof t
        ? l.extend(e, t)
        : ("boolean" == typeof t
            ? (e.byRow = t)
            : "remove" === t && (e.remove = !0),
          e);
    },
    u = (l.fn.matchHeight = function (t) {
      var e = p(t);
      if (e.remove) {
        var o = this;
        return (
          this.css(e.property, ""),
          l.each(u._groups, function (t, e) {
            e.elements = e.elements.not(o);
          }),
          this
        );
      }
      return (
        (this.length <= 1 && !e.target) ||
          (u._groups.push({ elements: this, options: e }), u._apply(this, e)),
        this
      );
    });
  (u.version = "0.7.2"),
    (u._groups = []),
    (u._throttle = 80),
    (u._maintainScroll = !1),
    (u._beforeUpdate = null),
    (u._afterUpdate = null),
    (u._rows = c),
    (u._parse = h),
    (u._parseOptions = p),
    (u._apply = function (t, e) {
      var i = p(e),
        o = l(t),
        n = [o],
        a = l(window).scrollTop(),
        r = l("html").outerHeight(!0),
        s = o.parents().filter(":hidden");
      return (
        s.each(function () {
          var t = l(this);
          t.data("style-cache", t.attr("style"));
        }),
        s.css("display", "block"),
        i.byRow &&
          !i.target &&
          (o.each(function () {
            var t = l(this),
              e = t.css("display");
            "inline-block" !== e &&
              "flex" !== e &&
              "inline-flex" !== e &&
              (e = "block"),
              t.data("style-cache", t.attr("style")),
              t.css({
                display: e,
                "padding-top": "0",
                "padding-bottom": "0",
                "margin-top": "0",
                "margin-bottom": "0",
                "border-top-width": "0",
                "border-bottom-width": "0",
                height: "100px",
                overflow: "hidden",
              });
          }),
          (n = c(o)),
          o.each(function () {
            var t = l(this);
            t.attr("style", t.data("style-cache") || "");
          })),
        l.each(n, function (t, e) {
          var o = l(e),
            a = 0;
          if (i.target) a = i.target.outerHeight(!1);
          else {
            if (i.byRow && o.length <= 1) return void o.css(i.property, "");
            o.each(function () {
              var t = l(this),
                e = t.attr("style"),
                o = t.css("display");
              "inline-block" !== o &&
                "flex" !== o &&
                "inline-flex" !== o &&
                (o = "block");
              var n = { display: o };
              (n[i.property] = ""),
                t.css(n),
                t.outerHeight(!1) > a && (a = t.outerHeight(!1)),
                e ? t.attr("style", e) : t.css("display", "");
            });
          }
          o.each(function () {
            var t = l(this),
              e = 0;
            (i.target && t.is(i.target)) ||
              ("border-box" !== t.css("box-sizing") &&
                ((e +=
                  h(t.css("border-top-width")) +
                  h(t.css("border-bottom-width"))),
                (e += h(t.css("padding-top")) + h(t.css("padding-bottom")))),
              t.css(i.property, a - e + "px"));
          });
        }),
        s.each(function () {
          var t = l(this);
          t.attr("style", t.data("style-cache") || null);
        }),
        u._maintainScroll &&
          l(window).scrollTop((a / r) * l("html").outerHeight(!0)),
        this
      );
    }),
    (u._applyDataApi = function () {
      var o = {};
      l("[data-match-height], [data-mh]").each(function () {
        var t = l(this),
          e = t.attr("data-mh") || t.attr("data-match-height");
        o[e] = e in o ? o[e].add(t) : t;
      }),
        l.each(o, function () {
          this.matchHeight(!0);
        });
    });
  var i = function (t) {
    u._beforeUpdate && u._beforeUpdate(t, u._groups),
      l.each(u._groups, function () {
        u._apply(this.elements, this.options);
      }),
      u._afterUpdate && u._afterUpdate(t, u._groups);
  };
  (u._update = function (t, e) {
    if (e && "resize" === e.type) {
      var o = l(window).width();
      if (o === n) return;
      n = o;
    }
    t
      ? -1 === a &&
        (a = setTimeout(function () {
          i(e), (a = -1);
        }, u._throttle))
      : i(e);
  }),
    l(u._applyDataApi);
  var t = l.fn.on ? "on" : "bind";
  l(window)[t]("load", function (t) {
    u._update(!1, t);
  }),
    l(window)[t]("resize orientationchange", function (t) {
      u._update(!0, t);
    });
});
!(function () {
  "use strict";
  function s(e) {
    return "status" === e
      ? l
      : k[e]
      ? k[e].apply(this, Array.prototype.slice.call(arguments, 1))
      : "function" != typeof e && "string" != typeof e && e
      ? void g.error("Method " + e + " does not exist on jQuery.sidr")
      : k.toggle.apply(this, arguments);
  }
  var n = {
    classCallCheck: function (e, n) {
      if (!(e instanceof n))
        throw new TypeError("Cannot call a class as a function");
    },
  };
  n.createClass = (function () {
    function i(e, n) {
      for (var t = 0; t < n.length; t++) {
        var i = n[t];
        (i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          "value" in i && (i.writable = !0),
          Object.defineProperty(e, i.key, i);
      }
    }
    return function (e, n, t) {
      return n && i(e.prototype, n), t && i(e, t), e;
    };
  })();
  var e,
    t,
    i,
    o,
    a,
    d,
    r,
    u,
    l = { moving: !1, opened: !1 },
    c = {
      isUrl: function (e) {
        return !!new RegExp(
          "^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$",
          "i"
        ).test(e);
      },
      addPrefixes: function (e) {
        this.addPrefix(e, "id"),
          this.addPrefix(e, "class"),
          e.removeAttr("style");
      },
      addPrefix: function (e, n) {
        var t = e.attr(n);
        "string" == typeof t &&
          "" !== t &&
          "sidr-inner" !== t &&
          e.attr(n, t.replace(/([A-Za-z0-9_.\-]+)/g, "sidr-" + n + "-$1"));
      },
      transitions:
        ((d = (document.body || document.documentElement).style),
        (r = !1),
        (u = "transition"),
        u in d
          ? (r = !0)
          : ((i = ["moz", "webkit", "o", "ms"]),
            (a = o = void 0),
            (u = u.charAt(0).toUpperCase() + u.substr(1)),
            (r = (function () {
              for (a = 0; a < i.length; a++) if ((o = i[a]) + u in d) return !0;
              return !1;
            })()),
            (u = r ? "-" + o.toLowerCase() + "-" + u.toLowerCase() : null)),
        { supported: r, property: u }),
    },
    h = jQuery,
    p = "sidr-animating",
    f = "open",
    m = "close",
    y =
      "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
    v = (function () {
      function t(e) {
        n.classCallCheck(this, t),
          (this.name = e),
          (this.item = h("#" + e)),
          (this.openClass =
            "sidr" === e ? "sidr-open" : "sidr-open " + e + "-open"),
          (this.menuWidth = this.item.outerWidth(!0)),
          (this.speed = this.item.data("speed")),
          (this.side = this.item.data("side")),
          (this.displace = this.item.data("displace")),
          (this.timing = this.item.data("timing")),
          (this.method = this.item.data("method")),
          (this.onOpenCallback = this.item.data("onOpen")),
          (this.onCloseCallback = this.item.data("onClose")),
          (this.onOpenEndCallback = this.item.data("onOpenEnd")),
          (this.onCloseEndCallback = this.item.data("onCloseEnd")),
          (this.body = h(this.item.data("body")));
      }
      return (
        n.createClass(t, [
          {
            key: "getAnimation",
            value: function (e, n) {
              var t = {},
                i = this.side;
              return (
                (t[i] =
                  "open" === e && "body" === n
                    ? this.menuWidth + "px"
                    : "close" === e && "menu" === n
                    ? "-" + this.menuWidth + "px"
                    : 0),
                t
              );
            },
          },
          {
            key: "prepareBody",
            value: function (e) {
              var n = "open" === e ? "hidden" : "";
              if (this.body.is("body")) {
                var t = h("html"),
                  i = t.scrollTop();
                t.css("overflow-x", n).scrollTop(i);
              }
            },
          },
          {
            key: "openBody",
            value: function () {
              if (this.displace) {
                var e = c.transitions,
                  n = this.body;
                if (e.supported)
                  n
                    .css(
                      e.property,
                      this.side + " " + this.speed / 1e3 + "s " + this.timing
                    )
                    .css(this.side, 0)
                    .css({ width: n.width(), position: "absolute" }),
                    n.css(this.side, this.menuWidth + "px");
                else {
                  var t = this.getAnimation(f, "body");
                  n.css({ width: n.width(), position: "absolute" }).animate(t, {
                    queue: !1,
                    duration: this.speed,
                  });
                }
              }
            },
          },
          {
            key: "onCloseBody",
            value: function () {
              var e = c.transitions,
                n = { width: "", position: "", right: "", left: "" };
              e.supported && (n[e.property] = ""), this.body.css(n).unbind(y);
            },
          },
          {
            key: "closeBody",
            value: function () {
              var e = this;
              if (this.displace)
                if (c.transitions.supported)
                  this.body.css(this.side, 0).one(y, function () {
                    e.onCloseBody();
                  });
                else {
                  var n = this.getAnimation(m, "body");
                  this.body.animate(n, {
                    queue: !1,
                    duration: this.speed,
                    complete: function () {
                      e.onCloseBody();
                    },
                  });
                }
            },
          },
          {
            key: "moveBody",
            value: function (e) {
              e === f ? this.openBody() : this.closeBody();
            },
          },
          {
            key: "onOpenMenu",
            value: function (e) {
              var n = this.name;
              (l.moving = !1),
                (l.opened = n),
                this.item.unbind(y),
                this.body.removeClass(p).addClass(this.openClass),
                this.onOpenEndCallback(),
                "function" == typeof e && e(n);
            },
          },
          {
            key: "openMenu",
            value: function (e) {
              var n = this,
                t = this.item;
              if (c.transitions.supported)
                t.css(this.side, 0).one(y, function () {
                  n.onOpenMenu(e);
                });
              else {
                var i = this.getAnimation(f, "menu");
                t.css("display", "block").animate(i, {
                  queue: !1,
                  duration: this.speed,
                  complete: function () {
                    n.onOpenMenu(e);
                  },
                });
              }
            },
          },
          {
            key: "onCloseMenu",
            value: function (e) {
              this.item.css({ left: "", right: "" }).unbind(y),
                h("html").css("overflow-x", ""),
                (l.moving = !1),
                (l.opened = !1),
                this.body.removeClass(p).removeClass(this.openClass),
                this.onCloseEndCallback(),
                "function" == typeof e && e(name);
            },
          },
          {
            key: "closeMenu",
            value: function (e) {
              var n = this,
                t = this.item;
              if (c.transitions.supported)
                t.css(this.side, "").one(y, function () {
                  n.onCloseMenu(e);
                });
              else {
                var i = this.getAnimation(m, "menu");
                t.animate(i, {
                  queue: !1,
                  duration: this.speed,
                  complete: function () {
                    n.onCloseMenu();
                  },
                });
              }
            },
          },
          {
            key: "moveMenu",
            value: function (e, n) {
              this.body.addClass(p),
                e === f ? this.openMenu(n) : this.closeMenu(n);
            },
          },
          {
            key: "move",
            value: function (e, n) {
              (l.moving = !0),
                this.prepareBody(e),
                this.moveBody(e),
                this.moveMenu(e, n);
            },
          },
          {
            key: "open",
            value: function (e) {
              var n = this;
              if (l.opened !== this.name && !l.moving) {
                if (!1 !== l.opened)
                  return void new t(l.opened).close(function () {
                    n.open(e);
                  });
                this.move("open", e), this.onOpenCallback();
              }
            },
          },
          {
            key: "close",
            value: function (e) {
              l.opened !== this.name ||
                l.moving ||
                (this.move("close", e), this.onCloseCallback());
            },
          },
          {
            key: "toggle",
            value: function (e) {
              l.opened === this.name ? this.close(e) : this.open(e);
            },
          },
        ]),
        t
      );
    })(),
    b = jQuery,
    g = jQuery,
    C = ["open", "close", "toggle"],
    k = {},
    w = function (t) {
      return function (e, n) {
        "function" == typeof e ? ((n = e), (e = "sidr")) : e || (e = "sidr"),
          (function (e, n, t) {
            var i = new v(n);
            switch (e) {
              case "open":
                i.open(t);
                break;
              case "close":
                i.close(t);
                break;
              case "toggle":
                i.toggle(t);
                break;
              default:
                b.error("Method " + e + " does not exist on jQuery.sidr");
            }
          })(t, e, n);
      };
    };
  for (e = 0; e < C.length; e++) k[(t = C[e])] = w(t);
  var E = jQuery;
  (jQuery.sidr = s),
    (jQuery.fn.sidr = function (e) {
      var n = c.transitions,
        i = E.extend(
          {
            name: "sidr",
            speed: 200,
            side: "left",
            source: null,
            renaming: !0,
            body: "body",
            displace: !0,
            timing: "ease",
            method: "toggle",
            bind: "touchstart click",
            onOpen: function () {},
            onClose: function () {},
            onOpenEnd: function () {},
            onCloseEnd: function () {},
          },
          e
        ),
        o = i.name,
        t = E("#" + o);
      return (
        0 === t.length && (t = E("<div />").attr("id", o).appendTo(E("body"))),
        n.supported &&
          t.css(n.property, i.side + " " + i.speed / 1e3 + "s " + i.timing),
        t
          .addClass("sidr")
          .addClass(i.side)
          .data({
            speed: i.speed,
            side: i.side,
            body: i.body,
            displace: i.displace,
            timing: i.timing,
            method: i.method,
            onOpen: i.onOpen,
            onClose: i.onClose,
            onOpenEnd: i.onOpenEnd,
            onCloseEnd: i.onCloseEnd,
          }),
        (t = (function (n, e) {
          if ("function" == typeof e.source) {
            var t = e.source(name);
            n.html(t);
          } else if ("string" == typeof e.source && c.isUrl(e.source))
            E.get(e.source, function (e) {
              n.html(e);
            });
          else if ("string" == typeof e.source) {
            var i = "",
              o = e.source.split(",");
            if (
              (E.each(o, function (e, n) {
                i += '<div class="sidr-inner">' + E(n).html() + "</div>";
              }),
              e.renaming)
            ) {
              var s = E("<div />").html(i);
              s.find("*").each(function (e, n) {
                var t = E(n);
                c.addPrefixes(t);
              }),
                (i = s.html());
            }
            n.html(i);
          } else null !== e.source && E.error("Invalid Sidr Source");
          return n;
        })(t, i)),
        this.each(function () {
          var e = E(this),
            n = e.data("sidr"),
            t = !1;
          n ||
            ((l.moving = !1),
            (l.opened = !1),
            e.data("sidr", o),
            e.bind(i.bind, function (e) {
              e.preventDefault(),
                t ||
                  ((t = !0),
                  s(i.method, o),
                  setTimeout(function () {
                    t = !1;
                  }, 100));
            }));
        })
      );
    });
})();
!(function (t) {
  var L = t(window);
  t.fn.visible = function (t, i, e) {
    if (!(this.length < 1)) {
      var o = 1 < this.length ? this.eq(0) : this,
        r = o.get(0),
        n = L.width(),
        f = L.height(),
        h = ((e = e || "both"), !0 !== i || r.offsetWidth * r.offsetHeight);
      if ("function" == typeof r.getBoundingClientRect) {
        var l = r.getBoundingClientRect(),
          g = 0 <= l.top && l.top < f,
          u = 0 < l.bottom && l.bottom <= f,
          s = 0 <= l.left && l.left < n,
          c = 0 < l.right && l.right <= n,
          a = t ? g || u : g && u,
          v = t ? s || c : s && c;
        if ("both" === e) return h && a && v;
        if ("vertical" === e) return h && a;
        if ("horizontal" === e) return h && v;
      } else {
        var b = L.scrollTop(),
          d = b + f,
          p = L.scrollLeft(),
          w = p + n,
          m = o.offset(),
          y = m.top,
          z = y + o.height(),
          B = m.left,
          C = B + o.width(),
          R = !0 === t ? z : y,
          j = !0 === t ? y : z,
          q = !0 === t ? C : B,
          H = !0 === t ? B : C;
        if ("both" === e) return !!h && j <= d && b <= R && H <= w && p <= q;
        if ("vertical" === e) return !!h && j <= d && b <= R;
        if ("horizontal" === e) return !!h && H <= w && p <= q;
      }
    }
  };
})(jQuery);
(window.matchMedia =
  window.matchMedia ||
  (function (e) {
    "use strict";
    var t,
      n = e.documentElement,
      a = n.firstElementChild || n.firstChild,
      s = e.createElement("body"),
      i = e.createElement("div");
    return (
      (i.id = "mq-test-1"),
      (i.style.cssText = "position:absolute;top:-100em"),
      (s.style.background = "none"),
      s.appendChild(i),
      function (e) {
        return (
          (i.innerHTML =
            '&shy;<style media="' +
            e +
            '"> #mq-test-1 { width: 42px; }</style>'),
          n.insertBefore(s, a),
          (t = 42 === i.offsetWidth),
          n.removeChild(s),
          { matches: t, media: e }
        );
      }
    );
  })(document)),
  (function (v) {
    "use strict";
    function e() {
      O(!0);
    }
    var t = {};
    if (
      (((v.respond = t).update = function () {}),
      (t.mediaQueriesSupported =
        v.matchMedia && v.matchMedia("only all").matches),
      !t.mediaQueriesSupported)
    ) {
      var g,
        x,
        E,
        w = v.document,
        T = w.documentElement,
        C = [],
        S = [],
        $ = [],
        i = {},
        b = w.getElementsByTagName("head")[0] || T,
        r = w.getElementsByTagName("base")[0],
        R = b.getElementsByTagName("link"),
        o = [],
        n = function () {
          for (var e = 0; R.length > e; e++) {
            var t = R[e],
              n = t.href,
              a = t.media,
              s = t.rel && "stylesheet" === t.rel.toLowerCase();
            n &&
              s &&
              !i[n] &&
              (t.styleSheet && t.styleSheet.rawCssText
                ? (d(t.styleSheet.rawCssText, n, a), (i[n] = !0))
                : ((!/^([a-zA-Z:]*\/\/)/.test(n) && !r) ||
                    n.replace(RegExp.$1, "").split("/")[0] ===
                      v.location.host) &&
                  o.push({ href: n, media: a }));
          }
          l();
        },
        l = function () {
          if (o.length) {
            var t = o.shift();
            a(t.href, function (e) {
              d(e, t.href, t.media),
                (i[t.href] = !0),
                v.setTimeout(function () {
                  l();
                }, 0);
            });
          }
        },
        d = function (e, t, n) {
          var a = e.match(/@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi),
            s = (a && a.length) || 0,
            i = function (e) {
              return e.replace(
                /(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,
                "$1" + t + "$2$3"
              );
            },
            r = !s && n;
          (t = t.substring(0, t.lastIndexOf("/"))).length && (t += "/"),
            r && (s = 1);
          for (var o = 0; o < s; o++) {
            var l, d, m, h;
            r
              ? ((l = n), S.push(i(e)))
              : ((l = a[o].match(/@media *([^\{]+)\{([\S\s]+?)$/) && RegExp.$1),
                S.push(RegExp.$2 && i(RegExp.$2))),
              (h = (m = l.split(",")).length);
            for (var u = 0; u < h; u++)
              (d = m[u]),
                C.push({
                  media:
                    (d.split("(")[0].match(/(only\s+)?([a-zA-Z]+)\s?/) &&
                      RegExp.$2) ||
                    "all",
                  rules: S.length - 1,
                  hasquery: -1 < d.indexOf("("),
                  minw:
                    d.match(
                      /\(\s*min\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/
                    ) && parseFloat(RegExp.$1) + (RegExp.$2 || ""),
                  maxw:
                    d.match(
                      /\(\s*max\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/
                    ) && parseFloat(RegExp.$1) + (RegExp.$2 || ""),
                });
          }
          O();
        },
        M = function () {
          var e,
            t = w.createElement("div"),
            n = w.body,
            a = !1;
          return (
            (t.style.cssText = "position:absolute;font-size:1em;width:1em"),
            n || ((n = a = w.createElement("body")).style.background = "none"),
            n.appendChild(t),
            T.insertBefore(n, T.firstChild),
            (e = t.offsetWidth),
            a ? T.removeChild(n) : n.removeChild(t),
            (E = parseFloat(e))
          );
        },
        O = function (e) {
          var t = "clientWidth",
            n = T[t],
            a = ("CSS1Compat" === w.compatMode && n) || w.body[t] || n,
            s = {},
            i = R[R.length - 1],
            r = new Date().getTime();
          if (e && g && r - g < 30)
            return v.clearTimeout(x), void (x = v.setTimeout(O, 30));
          for (var o in ((g = r), C))
            if (C.hasOwnProperty(o)) {
              var l = C[o],
                d = l.minw,
                m = l.maxw,
                h = null === d,
                u = null === m;
              d && (d = parseFloat(d) * (-1 < d.indexOf("em") ? E || M() : 1)),
                m &&
                  (m = parseFloat(m) * (-1 < m.indexOf("em") ? E || M() : 1)),
                (l.hasquery &&
                  ((h && u) || !(h || d <= a) || !(u || a <= m))) ||
                  (s[l.media] || (s[l.media] = []),
                  s[l.media].push(S[l.rules]));
            }
          for (var c in $)
            $.hasOwnProperty(c) &&
              $[c] &&
              $[c].parentNode === b &&
              b.removeChild($[c]);
          for (var p in s)
            if (s.hasOwnProperty(p)) {
              var f = w.createElement("style"),
                y = s[p].join("\n");
              (f.type = "text/css"),
                (f.media = p),
                b.insertBefore(f, i.nextSibling),
                f.styleSheet
                  ? (f.styleSheet.cssText = y)
                  : f.appendChild(w.createTextNode(y)),
                $.push(f);
            }
        },
        a = function (e, t) {
          var n = s();
          n &&
            (n.open("GET", e, !0),
            (n.onreadystatechange = function () {
              4 !== n.readyState ||
                (200 !== n.status && 304 !== n.status) ||
                t(n.responseText);
            }),
            4 !== n.readyState && n.send(null));
        },
        s = (function () {
          var t = !1;
          try {
            t = new v.XMLHttpRequest();
          } catch (e) {
            t = new v.ActiveXObject("Microsoft.XMLHTTP");
          }
          return function () {
            return t;
          };
        })();
      n(),
        (t.update = n),
        v.addEventListener
          ? v.addEventListener("resize", e, !1)
          : v.attachEvent && v.attachEvent("onresize", e);
    }
  })(this);
jQuery(document).ready(function (e) {
  jQuery(".sketch_dropdown ul.nav li.parent:not(.active) ul")
    .slideToggle()
    .hide(),
    jQuery(".sketch_dropdown ul.nav li.parent").prepend(
      "<span class='toggl0r'></span>"
    ),
    jQuery(".sketch_dropdown span.toggl0r").each(function () {
      1 == jQuery(this).parent().hasClass("active") &&
        jQuery(this).addClass("active");
    }),
    jQuery(".sketch_dropdown ul.nav li.parent > span.toggl0r").click(
      function () {
        return (
          jQuery(this).siblings("ul").slideToggle(),
          jQuery(this).toggleClass("active"),
          !1
        );
      }
    );
});
