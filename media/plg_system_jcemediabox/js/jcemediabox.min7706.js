/* jcemediabox - 2.2.1 | 2024-09-23 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2024 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
if ("undefined" === window.jQuery)
  throw new Error("JQuery is required to run Mediabox!");
!(function ($) {
  var autoplayInterval;
  var MediaBox = {
    util: {},
    settings: {
      selector: ".jcepopup,.wfpopup,[data-mediabox],.jcebox",
      labels: { close: "Close", next: "Next", previous: "Previous" },
      convert_local_url: !0,
      autoplay: 0,
      expand_on_click: !0,
    },
    popups: [],
    items: [],
    activator: null,
    getSite: function () {
      var parts,
        base = this.settings.base || "";
      return base
        ? (parts = document.location.href.split("://"))[0] +
            "://" +
            (parts =
              -1 !== (parts = parts[1]).indexOf(base)
                ? parts.substr(0, parts.indexOf(base))
                : parts.substr(0, parts.indexOf("/")) || parts) +
            base
        : null;
    },
    isPrint: function () {
      return -1 !== document.location.href.indexOf("&print=1");
    },
    init: function (settings) {
      if (this.isPrint())
        return $(this.settings.selector).children().unwrap(), !0;
      $.extend(this.settings, settings),
        (this.site = this.getSite()),
        this.create(),
        $(".jcetooltip, .jce_tooltip").each(function () {
          var text = $(this).attr("title") || "",
            cls = $(this).attr("class");
          -1 !== text.indexOf("::") &&
            ((parts = text.split("::")),
            $.trim(parts[0]),
            (text = $.trim(parts[1]))),
            $(this).attr("title", text);
          var parts = (parts = /tooltip-(top|bottom|left|right)/.exec(cls))
            ? parts[1]
            : "top";
          window.UIkit && UIkit.tooltip
            ? UIkit.tooltip(this, { title: text, position: parts })
            : void 0 !== $.fn.tooltip &&
              $(".jcetooltip, .jce_tooltip").tooltip({
                title: text,
                placement: parts,
              });
        });
    },
    getPopups: function (s, p) {
      s = s || this.settings.selector;
      return $(s, p).filter("a[href], area[href]");
    },
    translate: function (s) {
      var labels = this.settings.labels;
      return (s =
        s &&
        ("{{" === s.substr(0, 2)
          ? s.replace(/\{\{(\w+?)\}\}/g, function (a, b) {
              return labels[b] || a;
            })
          : labels[s] || s));
    },
    getStyles: function (o) {
      var x = [];
      return o
        ? ($.each(o.split(";"), function (i, s) {
            (s = s.replace(/(.*):(.*)/, function (a, b, c) {
              return '"' + b + '":"' + c + '"';
            })),
              x.push(s);
          }),
          $.parseJSON("{" + x.join(",") + "}"))
        : {};
    },
    islocal: function (s) {
      return !/^(\w+):\/\//.test(s) || new RegExp("^(" + Env.url + ")").test(s);
    },
    auto: function () {
      var key,
        self = this;
      $(this.popups).each(function (i, el) {
        var src, url;
        el.auto &&
          ("single" == el.auto
            ? ((key =
                el.id ||
                ((src = el.src),
                (url = document.location.href),
                (url = (url = (url = window.btoa(url + src)).replace(
                  /[^\w]/g,
                  ""
                )).substr(0, 24)))),
              MediaBox.Storage.get("wf_mediabox_" + key + "_" + i) ||
                (MediaBox.Storage.set("wf_mediabox_" + key + "_" + i, 1),
                setTimeout(function () {
                  self.start(el);
                }, el.delay)))
            : "multiple" == el.auto &&
              setTimeout(function () {
                self.start(el);
              }, el.delay));
      });
    },
    getData: function (n) {
      var o = {},
        re = /\w+\[[^\]]+\]/,
        data = $(n).attr("data-mediabox") || $(n).attr("data-json");
      if (data)
        n.removeAttribute("data-json"),
          n.removeAttribute("data-mediabox"),
          re.test(data) && (o = MediaBox.Parameter.parse(data));
      else {
        var args,
          data = $(n).attr("rel");
        if (data && re.test(data))
          return (
            (args = []),
            (data = data.replace(/\b((\w+)\[(.*?)\])(;?)/g, function (a, b, c) {
              return args.push(b), "";
            })),
            (o = MediaBox.Parameter.parse(args) || {}),
            $(n).attr("rel", data || o.rel || ""),
            o
          );
      }
      for (var attrs = n.attributes, i = attrs.length - 1; 0 <= i; i--) {
        var attrName = attrs[i].name;
        attrName &&
          -1 !== attrName.indexOf("data-mediabox-") &&
          (o[attrName.replace("data-mediabox-", "")] = attrs[i].value);
      }
      return o;
    },
    preloadMedia: function () {},
    process: function (el) {
      var data,
        title,
        caption,
        type,
        rel,
        s = this.settings,
        o = {},
        group = "",
        auto = !1,
        delay = 0,
        src = el.getAttribute("href");
      if (src)
        return (
          (src = src.replace(/b(w|h)=([0-9]+)/g, function (s, k, v) {
            return (k = "w" === k ? "width" : "height") + "=" + v;
          })),
          (title = (data = this.getData(el) || {}).title || el.title || ""),
          (caption = data.caption || ""),
          (type = data.type || el.type || ""),
          (rel = el.rel || ""),
          /\w+\[[^\]]+\]/.test(rel) ||
            (group = $.trim(
              rel.replace(
                new RegExp(
                  "(^|\\s+)alternate|stylesheet|start|next|prev|contents|index|glossary|copyright|chapter|section|subsection|appendix|help|bookmark|nofollow|noopener|noreferrer|licence|tag|friend|(lightbox([(.*?)])?)|(lyte(box|frame|show)([(.*?)])?)(\\s+|$)",
                  "g"
                ),
                "",
                "gi"
              )
            )),
          "AREA" == el.nodeName &&
            ((group = group || "AREA_ELEMENT"),
            (data = data || MediaBox.Parameter.parse(src)).type ||
              ((rel =
                /\b(ajax|iframe|image|flash|director|shockwave|mplayer|windowsmedia|quicktime|realaudio|real|divx|pdf)\b/.exec(
                  el.className
                )) &&
                (data.type = rel[0]))),
          (auto =
            (auto = /autopopup-(single|multiple)/.test(el.className)
              ? /(multiple)/.test(el.className)
                ? "multiple"
                : "single"
              : auto) ||
            data.autopopup ||
            ""),
          (delay = data.delay || 0),
          (delay = parseInt(delay)),
          (delay *= 1e3),
          (group = (!$(el).hasClass("nogroup") && (group || data.group)) || ""),
          (rel = data.width || s.width),
          (s = data.height || s.height),
          $.each(
            ["src", "title", "caption", "group", "width", "height"],
            function (i, k) {
              delete data[k];
            }
          ),
          /!\D/.test(rel) && (rel = parseInt(rel)),
          /!\D/.test(s) && (s = parseInt(s)),
          $.extend(o, {
            node: el,
            src: src,
            title: title,
            caption: caption,
            group: group,
            width: rel,
            height: s,
            params: data,
            auto: auto,
            type: type,
            delay: delay,
          }),
          (src = src.replace(/&type=(ajax|text\/html|text\/xml)/, "")),
          el.setAttribute("href", src),
          o
        );
    },
    create: function (elements) {
      var self = this,
        s = this.settings,
        pageload = !1;
      elements ||
        ((pageload = !0),
        (this.popups = []),
        1 === s.legacy && MediaBox.Convert.legacy(),
        1 === s.lightbox && MediaBox.Convert.lightbox(),
        1 === s.shadowbox && MediaBox.Convert.shadowbox()),
        (this.elements = elements || this.getPopups()),
        $(this.elements)
          .removeClass("jcelightbox jcebox jcepopup")
          .addClass("wfpopup")
          .each(function (i) {
            var $img,
              rel,
              flt,
              o = self.process(this);
            if (!o) return !0;
            "_blank" === $(this).attr("target") &&
              (-1 === (rel = $(this).attr("rel") || "").indexOf("noopener") &&
                (rel += " noopener"),
              -1 === rel.indexOf("noreferrer") && (rel += " noreferrer"),
              $(this).attr("rel", $.trim(rel))),
              $(this).attr("class", function (i, v) {
                return v.replace(
                  /(zoom|icon)-(top|right|bottom|left|center)(-(top|right|bottom|left|center))?/,
                  function (match, prefix, pos1, pos2) {
                    pos1 = "wf-icon-zoom-" + pos1;
                    return pos2 && (pos1 += pos2), pos1;
                  }
                );
              }),
              1 !== s.icons ||
                $(this).hasClass("noicon") ||
                (($img = $("img:first", this)).length
                  ? ((rel = {}),
                    $('<span class="wf-icon-zoom-image" />')
                      .html(function () {
                        return MediaBox.getSVGIcon("search");
                      })
                      .insertAfter($img),
                    (flt = $img.css("float")) &&
                      "none" !== flt &&
                      ($img.parent().css("float", flt),
                      $img.css("float", ""),
                      $(this).addClass("wf-mediabox-has-float"),
                      $img.attr("width")) &&
                      /%/.test($img.attr("width")) &&
                      $img.attr("width", $img.width()),
                    $.each(
                      ["top", "right", "bottom", "left"],
                      function (i, pos) {
                        var m = $img.css("margin-" + pos),
                          p = $img.css("padding-" + pos);
                        m &&
                          /\d/.test(m) &&
                          0 < parseInt(m) &&
                          $img.parent().css("margin-" + pos, m),
                          p &&
                            /\d/.test(p) &&
                            0 < parseInt(p) &&
                            $img.parent().css("padding-" + pos, p);
                      }
                    ),
                    "auto" == (flt = $((flt = $img)).get(0)).style.marginLeft &&
                      "auto" == flt.style.marginRight &&
                      "block" == flt.style.display &&
                      ((rel["max-width"] = $img.width()),
                      $(this).addClass("wf-mediabox-is-centered"),
                      (rel["margin-left"] = ""),
                      (rel["margin-right"] = "")),
                    $img.css({ margin: 0, padding: 0, float: "none" }),
                    $img.parent().css(rel),
                    $(this).addClass("wf-zoom-image"))
                  : $('<span class="wf-icon-zoom-link" />')
                      .html(function () {
                        return MediaBox.getSVGIcon("link");
                      })
                      .appendTo(this)
                      .find("svg")
                      .css("fill", $(this).css("color"))),
              MediaBox.Env.ios && (/\.pdf$/i.test(o.src) || "pdf" === o.type)
                ? $(this).attr({
                    target: "_blank",
                    rel: "noopener noreferrer",
                    type: "application/pdf",
                  })
                : (self.popups.push(o),
                  pageload || (i = self.popups.length - 1),
                  $(this).on("click", function (e) {
                    return (
                      e.preventDefault(),
                      (o.src = this.getAttribute("href")),
                      o.params.skipfocus || (self.activator = this),
                      self.start(o, i)
                    );
                  }));
          }),
        0 === $(".wf-mediabox").length && self.auto();
    },
    open: function (data, title, group, type, params) {
      var x = 0,
        o = {},
        found = !1;
      return (
        "string" == typeof data &&
          ($.extend(o, {
            src: data,
            title: title,
            group: group,
            type: type,
            params: params || {},
          }),
          o.params.width && (o.width = o.params.width),
          o.params.height && (o.height = o.params.height),
          $.each(this.popups, function (i, obj) {
            obj.src == o.src && (found = !0);
          }),
          found || this.popups.push(o)),
        !data.nodeName ||
          ("A" !== data.nodeName && "AREA" !== data.nodeName) ||
          (0 <= (title = $.inArray(this.elements, data))
            ? ((o = this.popups[title]), (x = title))
            : ((o = this.process(data)), (x = this.popups.push(o)), x--)),
        this.start(o, x)
      );
    },
    start: function (p, i) {
      var len,
        overlayDuration,
        self = this,
        n = 0,
        items = [];
      return (
        !!this.build() &&
        (p.group
          ? ($.each(this.popups, function (x, o) {
              o.group === p.group &&
                ((len = items.push(o)), i) &&
                x === i &&
                (n = len - 1);
            }),
            p.auto || void 0 !== i || (items.push(p), (n = items.length - 1)))
          : items.push(p),
        (overlayDuration = $(".wf-mediabox-overlay").css(
          "transition-duration"
        )),
        (overlayDuration = 1e3 * parseFloat(overlayDuration) || 300),
        window.setTimeout(function () {
          return self.show(items, n);
        }, overlayDuration),
        !0)
      );
    },
    build: function () {
      var $page,
        self = this,
        s = this.settings;
      return (
        0 === $(".wf-mediabox").length &&
          (($page = $(
            '<div class="wf-mediabox" role="dialog" aria-modal="true" aria-labelledby="" aria-describedby="" tabindex="-1" />'
          ).appendTo("body")).addClass("wf-mediabox-overlay-transition"),
          MediaBox.Env.ie6 && $page.addClass("ie6"),
          MediaBox.Env.ios && $page.addClass("ios"),
          1 === s.overlay &&
            $('<div class="wf-mediabox-overlay" tabindex="-1" />')
              .appendTo($page)
              .css("background-color", s.overlay_color),
          $page.append(
            '<div class="wf-mediabox-frame" role="document" tabindex="-1"><div class="wf-mediabox-loader" role="status" aria-label="' +
              this.translate("loading") +
              '" tabindex="-1"></div><div class="wf-mediabox-body" aria-hidden="true" tabindex="-1" /></div>'
          ),
          $page.addClass("wf-mediabox-theme-" + s.theme),
          MediaBox.Addons.Theme.parse(
            s.theme,
            function (s) {
              return self.translate(s);
            },
            ".wf-mediabox-body"
          ),
          $(".wf-mediabox-frame").children().hide(),
          MediaBox.Env.ios &&
            $(".wf-mediabox-content").css({
              webkitOverflowScrolling: "touch",
              overflow: "auto",
            }),
          2 === s.close &&
            $(".wf-mediabox-frame").on("click", function (e) {
              e.target && e.target === this && self.close();
            }),
          $(".wf-mediabox-close, .wf-mediabox-cancel")
            .on("click", function (e) {
              e.preventDefault(), self.close();
            })
            .attr("tabindex", 0)
            .attr("svg-icon", function (i, val) {
              val && $(this).append(MediaBox.getSVGIcon(val));
            }),
          $(".wf-mediabox-next")
            .on("click", function (e) {
              e.preventDefault(), self.nextItem();
            })
            .attr("tabindex", 0)
            .attr("svg-icon", function (i, val) {
              val && $(this).append(MediaBox.getSVGIcon(val));
            }),
          $(".wf-mediabox-prev")
            .on("click", function (e) {
              e.preventDefault(), self.previousItem();
            })
            .attr("tabindex", 0)
            .attr("svg-icon", function (i, val) {
              val && $(this).append(MediaBox.getSVGIcon(val));
            }),
          $(".wf-mediabox-numbers")
            .data("html", $(".wf-mediabox-numbers").html())
            .attr("aria-hidden", !0),
          $page.addClass("wf-mediabox-open"),
          $(".wf-mediabox-overlay").css("opacity", s.overlayopacity || 0.8)),
        !0
      );
    },
    show: function (items, n) {
      var s = this.settings;
      return (
        (this.items = items),
        this.bind(!0),
        $(".wf-mediabox-body").show(),
        1 === s.overlay &&
          $(".wf-mediabox-overlay").length &&
          s.overlay_opacity &&
          $(".wf-mediabox-overlay")
            .css("opacity", 0)
            .animate(
              { opacity: parseFloat(s.overlay_opacity) },
              s.transition_speed
            ),
        $(".wf-mediabox").addClass("wf-mediabox-transition-scale"),
        this.change(n)
      );
    },
    bind: function (open) {
      var xDown,
        yDown,
        self = this,
        s = this.settings,
        open =
          (open
            ? ($(document).on("keydown.wf-mediabox", function (e) {
                self.addListener(e);
              }),
              !1 !== s.swipe &&
                $(".wf-mediabox-body")
                  .on("touchstart", function (e) {
                    1 === e.originalEvent.touches.length &&
                      1 !== self.items.length &&
                      ((xDown = e.originalEvent.touches[0].clientX),
                      (yDown = e.originalEvent.touches[0].clientY));
                  })
                  .on("touchmove", function (e) {
                    var xUp, yUp;
                    xDown &&
                      yDown &&
                      1 === e.originalEvent.touches.length &&
                      1 !== self.items.length &&
                      ((xUp = e.originalEvent.touches[0].clientX),
                      (yUp = e.originalEvent.touches[0].clientY),
                      (xUp = xDown - xUp),
                      (yUp = yDown - yUp),
                      Math.abs(xUp) > Math.abs(yUp) &&
                        (0 < xUp ? self.nextItem() : self.previousItem(),
                        e.preventDefault()),
                      (yDown = xDown = null));
                  }))
            : ($(document).off("keydown.wf-mediabox"),
              $(".wf-mediabox").off("keydown.wf-mediabox")),
          MediaBox.Tools.debounce(function () {
            var popup = self.items[self.index];
            popup && self.updateBodyWidth(popup);
          }, 300));
      $(window).on("resize.wf-mediabox, orientationchange.wf-mediabox", open),
        s.autoplay &&
          (autoplayInterval = setInterval(function () {
            !1 === self.nextItem() && clearInterval(autoplayInterval);
          }, 1e3 * s.autoplay));
    },
    updateBodyWidth: function (popup) {
      var ratio,
        framePaddingLeft,
        framePaddingTop,
        ww = $(window).width(),
        wh = $(window).height(),
        fw = $(".wf-mediabox-frame").width(),
        fh = $(".wf-mediabox-frame").height();
      "scroll" === this.settings.scrolling &&
        ((framePaddingLeft = $(".wf-mediabox-frame").css("padding-left")),
        (framePaddingTop = $(".wf-mediabox-frame").css("padding-top")),
        (fw = ww - 2 * parseInt(framePaddingLeft)),
        (fh = wh - 2 * parseInt(framePaddingTop))),
        (ww = MediaBox.Tools.parseWidth(popup.width)),
        (framePaddingLeft = MediaBox.Tools.parseHeight(popup.height || fh)),
        $(".wf-mediabox-content").hasClass("wf-mediabox-content-ratio-flex") &&
          ((framePaddingTop =
            $(".wf-mediabox-body").height() -
            $(".wf-mediabox-content").height()),
          (framePaddingTop =
            wh -
            (framePaddingLeft = Math.min(framePaddingLeft, fh)) +
            framePaddingTop),
          $(".wf-mediabox-content-item").css(
            "height",
            "calc(100vh - " + framePaddingTop + "px)"
          ));
      var bw = MediaBox.Tools.resize(ww, framePaddingLeft, fw, fh).width,
        bh =
          ($(".wf-mediabox-body").css("max-width", bw),
          $(".wf-mediabox-body").height());
      if (fh < fw)
        (ratio = (bw / bh).toFixed(1)),
          fh < bh &&
            ((bw = ratio * (fh - 16) - 32),
            $(".wf-mediabox-body").css("max-width", bw));
      else if (((ratio = (bh / bw).toFixed(1)), fh < bh)) {
        for (ratio = (bh < bw ? bh / bw : bw / bh).toFixed(1); fh < bh; )
          bh = ratio * (bw = Math.max(260, bw));
        $(".wf-mediabox-body").css("max-width", bw - 16);
      }
      if ("scroll" === this.settings.scrolling) {
        popup = ".wf-mediabox-body";
        if ("scrollBehavior" in document.documentElement.style)
          try {
            return void $(popup).get(0).scrollIntoView({ block: "center" });
          } catch (e) {}
        (popup = $(popup).offset().top + $(popup).outerHeight(!0) / 2),
          (wh = window.innerHeight / 2);
        window.scrollTo(0, popup - wh);
      }
    },
    addListener: function (e) {
      switch (e.keyCode) {
        case 27:
          this.close();
          break;
        case 37:
          this.previousItem();
          break;
        case 39:
          this.nextItem();
      }
    },
    queue: function (n) {
      var self = this;
      if (!!1)
        $(".wf-mediabox-body").removeClass("wf-mediabox-transition"),
          self.change(n);
    },
    nextItem: function () {
      var n;
      return (
        1 !== this.items.length &&
        !((n = this.index + 1) < 0 || n >= this.items.length) &&
        this.queue(n)
      );
    },
    previousItem: function () {
      var n;
      return (
        1 !== this.items.length &&
        !((n = this.index - 1) < 0 || n >= this.items.length) &&
        this.queue(n)
      );
    },
    info: function () {
      var text,
        h,
        ex,
        ux,
        popup = this.items[this.index];
      $(".wf-mediabox-focus").removeClass("wf-mediabox-focus"),
        $("a[download]", ".wf-mediabox-content").remove(),
        popup.params.download &&
          $(
            '<a href="' +
              popup.src +
              '" target="_blank" download>' +
              this.translate("download") +
              "</a>"
          ).appendTo(".wf-mediabox-content"),
        $(".wf-mediabox-caption").length &&
          ((title = popup.title || ""),
          (text = popup.caption || ""),
          (h = ""),
          (ex =
            /([-!#$%&\'\*\+\\./0-9=?A-Z^_`a-z{|}~]+@[-!#$%&\'\*\+\\/0-9=?A-Z^_`a-z{|}~]+\.[-!#$%&\'*+\\./0-9=?A-Z^_`a-z{|}~]+)/gi),
          (ux = /([a-zA-Z]{3,9}:\/\/[^\s]+)/gi),
          (title = MediaBox.Entities.decode(title)),
          (text = MediaBox.Entities.decode(text)),
          -1 !== title.indexOf("::") &&
            ((parts = title.split("::")),
            (title = $.trim(parts[0])),
            (text = $.trim(parts[1]))),
          title &&
            ((h += '<h4 id="wf-mediabox-modal-title">' + title + "</h4>"),
            $(".wf-mediabox").attr(
              "aria-labelledby",
              "wf-mediabox-modal-title"
            )),
          text &&
            ((h += '<p id="wf-mediabox-modal-description">' + text + "</p>"),
            $(".wf-mediabox").attr(
              "aria-describedby",
              "wf-mediabox-modal-description"
            )),
          $(".wf-mediabox-caption")
            .html(h)
            .addClass("wf-mediabox-caption-hidden"),
          h) &&
          $(".wf-mediabox-caption")
            .find(":not(a)")
            .each(function () {
              var s = $(this).html();
              s &&
                /(@|:\/\/)/.test(s) &&
                -1 === s.indexOf("<") &&
                (s = s
                  .replace(ex, '<a href="mailto:$1" target="_blank">$1</a>')
                  .replace(ux, '<a href="$1" target="_blank">$1</a>')) &&
                $(this).replaceWith(s);
            });
      var self = this,
        len = this.items.length;
      if ($(".wf-mediabox-numbers").length && 1 < len) {
        var parts = $(".wf-mediabox-numbers").data("html") || "{{numbers}}";
        if (-1 !== parts.indexOf("{{numbers}}")) {
          $(".wf-mediabox-numbers").empty().append("<ol />");
          for (var i = 0; i < len; i++) {
            var n = i + 1,
              title = this.items[i].title || n,
              n = $(
                '<button aria-label="' +
                  title +
                  '" tabindex="0" class="wf-mediabox-number" />'
              ).html(n);
            this.index === i && $(n).addClass("active"),
              $("<li />").append(n).appendTo($("ol", ".wf-mediabox-numbers")),
              $(n).on("click", function (e) {
                e = parseInt(e.target.innerHTML) - 1;
                return self.index != e && self.queue(e);
              });
          }
        }
        -1 !== parts.indexOf("{{current}}") &&
          $(".wf-mediabox-numbers").html(
            parts
              .replace("{{current}}", this.index + 1)
              .replace("{{total}}", len)
          ),
          $(".wf-mediabox-numbers").attr("aria-hidden", !1);
      } else $(".wf-mediabox-numbers").empty().attr("aria-hidden", !0);
      $(".wf-mediabox-info-top, .wf-mediabox-info-bottom").show(),
        $(".wf-mediabox-next, .wf-mediabox-prev")
          .hide()
          .attr("aria-hidden", !0),
        1 < len
          ? (0 < this.index
              ? $(".wf-mediabox-prev")
                  .show()
                  .attr("aria-hidden", !1)
                  .addClass("wf-mediabox-focus")
              : $(".wf-mediabox-prev").hide().attr("aria-hidden", !0),
            this.index < len - 1
              ? $(".wf-mediabox-next")
                  .show()
                  .attr("aria-hidden", !1)
                  .addClass("wf-mediabox-focus")
              : $(".wf-mediabox-next").hide().attr("aria-hidden", !0))
          : $(".wf-mediabox-close").addClass("wf-mediabox-focus"),
        popup.params.css && $(".wf-mediabox-body").addClass(popup.params.css),
        1 < len &&
          ($(".wf-mediabox-thumbnails").empty(),
          $.each(this.items, function (i, item) {
            $('<img src="' + item.src + '" class="loading" />')
              .on("click", function () {
                return self.queue(i);
              })
              .toggleClass("active", self.index == i)
              .on("load", function () {
                $(this).removeClass("loading");
              })
              .appendTo(".wf-mediabox-thumbnails");
          }));
    },
    change: function (n) {
      var popup, type, html, plugin;
      this.settings;
      return (
        n < 0 ||
          n >= this.items.length ||
          ((this.index = n),
          $(".wf-mediabox-container, .wf-mediabox-cancel").show(),
          $(".wf-mediabox")
            .addClass("wf-mediabox-loading")
            .find(".wf-mediabox-loader")
            .attr("aria-hidden", !1),
          (popup = this.items[n]),
          (type = "error"),
          (html = ""),
          (plugin = MediaBox.Addons.Plugin.getPlugin(popup)) &&
            ((html = plugin.html(popup)),
            (type = plugin.type),
            !popup.width && plugin.width && (popup.width = plugin.width),
            !popup.height && plugin.height && (popup.height = plugin.height),
            (popup.type = type)),
          $(".wf-mediabox-content")
            .attr("class", "wf-mediabox-content")
            .addClass("wf-mediabox-content-" + type)
            .css("height", ""),
          (popup.html = html),
          (this.items[n] = popup),
          this.setup()),
        !1
      );
    },
    setup: function () {
      this.info(),
        MediaBox.Env.ie &&
          $(".wf-mediabox-content img").css(
            "-ms-interpolation-mode",
            "bicubic"
          );
      var tabIndex = 0;
      return (
        $(".wf-mediabox").on("keydown.wf-mediabox", function (e) {
          var $items;
          9 === e.keyCode &&
            (e.preventDefault(),
            ($items = $(".wf-mediabox")
              .find("[tabindex]:visible")
              .filter(function () {
                return 0 <= parseInt(this.getAttribute("tabindex"));
              })).each(function (i) {
              $(this).hasClass("wf-mediabox-focus") && (tabIndex = i);
            }),
            (tabIndex = Math.max(tabIndex, 0)),
            e.shiftKey ? tabIndex-- : tabIndex++,
            (tabIndex = Math.max(tabIndex, 0)) === $items.length &&
              (tabIndex = 0),
            $items.removeClass("wf-mediabox-focus"),
            $items.eq(tabIndex).focus().addClass("wf-mediabox-focus"));
        }),
        this.animate()
      );
    },
    animate: function () {
      var self = this,
        s = this.settings,
        popup = this.items[this.index],
        cw = popup.width || 0,
        ch = popup.height || 0,
        $cache =
          ($(".wf-mediabox-content").removeClass(
            "wf-mediabox-broken-image wf-mediabox-broken-media"
          ),
          $(".wf-mediabox-content .wf-icon-404")
            .removeClass("wf-icon-404")
            .find("svg")
            .remove(),
          $(".wf-mediabox-caption").removeClass("wf-mediabox-caption-hidden"),
          $(".wf-mediabox-content").hasClass("wf-mediabox-content-ajax") &&
            $(".wf-mediabox-body").css("max-width", 640),
          $('<div class="wf-mediabox-cache" />'));
      "iframe" == popup.type || "ajax" == popup.type
        ? $(".wf-mediabox-content-item").html(popup.html)
        : $cache.html(popup.html).appendTo(".wf-mediabox"),
        $("img, video, audio, object, embed", $cache)
          .add("iframe", ".wf-mediabox-content")
          .each(function () {
            var node = this,
              hasTriggered = !1;
            function triggerItemLoaded() {
              hasTriggered ||
                ((hasTriggered = !0),
                function () {
                  var w, h, ifr;
                  "IFRAME" !== this.nodeName &&
                    $(".wf-mediabox-content-item").html(popup.html),
                    $(".wf-mediabox")
                      .removeClass("wf-mediabox-loading")
                      .find(".wf-mediabox-loading")
                      .attr("aria-hidden", !0),
                    $(".wf-mediabox-content-item").css("padding-bottom", ""),
                    $(".wf-mediabox").addClass("wf-mediabox-show"),
                    $(
                      ".wf-mediabox-info-top, .wf-mediabox-info-bottom"
                    ).addClass("wf-info-show"),
                    "IMG" === this.nodeName
                      ? ((cw = cw || this.naturalWidth || this.width),
                        (ch = ch || this.naturalHeight || this.height),
                        (cw = MediaBox.Tools.parseWidth(cw)),
                        (ch = MediaBox.Tools.parseWidth(ch)),
                        (popup.width = cw),
                        (popup.height = ch))
                      : ("VIDEO" === this.nodeName &&
                          ((cw = cw || this.videoWidth || 0),
                          (ch = ch || this.videoHeight || 0)),
                        (cw = cw || 640) &&
                          ch &&
                          ((w = MediaBox.Tools.parseWidth(cw)),
                          (h = MediaBox.Tools.parseHeight(ch)),
                          (h = parseFloat((h / w).toFixed(2))),
                          0.75 ===
                          (h = $(this).is(
                            ".wf-mediabox-iframe-video, .wf-mediabox-video, .wf-mediabox-audio"
                          )
                            ? 0.56
                            : h)
                            ? $(".wf-mediabox-content").addClass(
                                "wf-mediabox-content-ratio-4by3"
                              )
                            : 0.56 !== h &&
                              $(".wf-mediabox-content").addClass(
                                "wf-mediabox-content-ratio-flex"
                              )),
                        $(".wf-mediabox-content-item").addClass(
                          "wf-mediabox-content-ratio"
                        ),
                        (popup.width = cw)),
                    self.updateBodyWidth(popup),
                    "scroll" === s.scrolling &&
                      $("body").addClass("wf-mediabox-scrolling"),
                    $(".wf-mediabox-body")
                      .addClass("wf-mediabox-transition")
                      .attr("aria-hidden", !1),
                    "IFRAME" === this.nodeName &&
                      ((ifr = this),
                      setTimeout(function () {
                        ifr.contentWindow.focus();
                      }, 10)),
                    ("VIDEO" !== this.nodeName && "AUDIO" !== this.nodeName) ||
                      (MediaBox.Env.ie && this.autoplay && this.play()),
                    $(this).trigger("mediabox:load"),
                    $(this).on("mediabox:resize", function () {
                      self.updateBodyWidth(popup);
                    });
                }.apply(node));
            }
            $(node).one("load loadedmetadata error", function (e) {
              "error" === e.type
                ? ((hasTriggered = !0),
                  function (e) {
                    var n = this;
                    $cache.empty().remove(),
                      $(".wf-mediabox").removeClass("wf-mediabox-loading"),
                      $(".wf-mediabox-content").addClass(function () {
                        return "IMG" === n.nodeName
                          ? "wf-mediabox-broken-image"
                          : "wf-mediabox-broken-media";
                      }),
                      $(".wf-mediabox-body")
                        .addClass("wf-mediabox-transition")
                        .css("max-width", "")
                        .attr("aria-hidden", !1),
                      $(".wf-mediabox").addClass("wf-mediabox-show"),
                      $(".wf-mediabox-content > div")
                        .addClass("wf-icon-404")
                        .html(function () {
                          return MediaBox.getSVGIcon("404");
                        });
                  }.apply(node))
                : triggerItemLoaded();
            }),
              setTimeout(function () {
                triggerItemLoaded();
              }, 5e3);
          });
    },
    close: function (keepopen) {
      var self = this,
        transitionDuration = $(".wf-mediabox-container").css(
          "transition-duration"
        ),
        transitionDuration = 1e3 * parseFloat(transitionDuration) || 300,
        transitionTimer =
          ($(".wf-mediabox-body").removeClass("wf-mediabox-transition"),
          setTimeout(function () {
            var overlayDuration, overlayTimer;
            $("iframe, video", ".wf-mediabox-content-item").attr("src", ""),
              $(".wf-mediabox-content-item").empty(),
              clearTimeout(transitionTimer),
              keepopen ||
                (self.bind(!1),
                $(".wf-mediabox-info-bottom, .wf-mediabox-info-top").hide(),
                $(".wf-mediabox-frame").remove(),
                (overlayDuration = $(".wf-mediabox-overlay").css(
                  "transition-duration"
                )),
                (overlayDuration = 1e3 * parseFloat(overlayDuration) || 300),
                $(".wf-mediabox").removeClass(
                  "wf-mediabox-open wf-mediabox-show"
                ),
                $(".wf-mediabox-overlay").css("opacity", 0),
                (overlayTimer = setTimeout(function () {
                  $(".wf-mediabox").remove(),
                    $("body").removeClass("wf-mediabox-scrolling"),
                    clearTimeout(overlayTimer);
                }, overlayDuration)),
                self.activator && $(self.activator).focus());
          }, transitionDuration));
      return (
        $(".wf-mediabox-close").hide(),
        window.clearInterval(autoplayInterval),
        !1
      );
    },
  };
  window.WfMediabox = window.jcepopup = MediaBox;
})(jQuery),
  (function () {
    var opera,
      webkit,
      ie,
      ie6,
      mac,
      Android,
      nav = navigator,
      userAgent = nav.userAgent;
    (opera = window.opera && window.opera.buildNumber),
      (android = /Android/.test(userAgent)),
      (ie6 =
        (ie =
          !(webkit = /WebKit/.test(userAgent)) &&
          !opera &&
          /MSIE/gi.test(userAgent) &&
          /Explorer/gi.test(nav.appName) &&
          /MSIE (\w+)\./.exec(userAgent)[1] &&
          !webkit) && !window.XMLHttpRequest),
      (ie11 =
        -1 != userAgent.indexOf("Trident/") &&
        (-1 != userAgent.indexOf("rv:") ||
          -1 != nav.appName.indexOf("Netscape")) &&
        11),
      (ie = ie || ie11),
      (nav = !webkit && !ie && /Gecko/.test(userAgent)),
      (mac = -1 != userAgent.indexOf("Mac")),
      (iDevice = /(iPad|iPhone)/.test(userAgent)),
      (Android = /Android/.test(userAgent)),
      (Safari =
        /AppleWebKit/.test(userAgent) &&
        /Safari/.test(userAgent) &&
        !/Chrome/.test(userAgent));
    var iDevice,
      isIOS =
        (iDevice =
          iDevice ||
          ((isIOS = /iPad/.test(userAgent)),
          (isTouchEnabled = 1 < navigator.maxTouchPoints),
          (userAgent = /Macintosh/.test(userAgent)),
          isIOS) ||
          (isTouchEnabled && userAgent)) || Android,
      isTouchEnabled = {
        opera: opera,
        webkit: webkit,
        ie6: ie6,
        ie: ie,
        gecko: nav,
        mac: mac,
        ios: iDevice,
        android: Android,
        video: (function () {
          var h264,
            el = document.createElement("video"),
            o = {};
          try {
            if (el.canPlayType)
              return (
                (o.ogg = el.canPlayType('video/ogg; codecs="theora"')),
                (h264 = 'video/mp4; codecs="avc1.42E01E'),
                (o.mp4 =
                  el.canPlayType(h264 + '"') ||
                  el.canPlayType(h264 + ', mp4a.40.2"')),
                (o.webm = el.canPlayType('video/webm; codecs="vp8, vorbis"')),
                o
              );
          } catch (e) {}
          return !1;
        })(),
        audio: (function () {
          var el = document.createElement("audio"),
            o = {};
          try {
            if (el.canPlayType)
              return (
                (o.ogg = el.canPlayType('audio/ogg; codecs="vorbis"')),
                (o.mp3 = el.canPlayType("audio/mpeg;")),
                (o.wav = el.canPlayType('audio/wav; codecs="1"')),
                (o.m4a =
                  el.canPlayType("audio/x-m4a;") ||
                  el.canPlayType("audio/aac;")),
                (o.webm = el.canPlayType('audio/webm; codecs="vp8, vorbis"')),
                o
              );
          } catch (e) {}
          return !1;
        })(),
        mobile: isIOS,
        safari: Safari,
      };
    window.WfMediabox.Env = isTouchEnabled;
  })(),
  (function ($) {
    for (
      var y,
        ext,
        lookup = {},
        mimes = {},
        items =
          "application/x-director,dcr,video/divx,divx,application/pdf,pdf,application/x-shockwave-flash,swf swfl,audio/mpeg,mpga mpega mp2 mp3,audio/ogg,ogg spx oga,audio/x-wav,wav,video/mpeg,mpeg mpg mpe,video/mp4,mp4 m4v,video/ogg,ogg ogv,video/webm,webm,video/quicktime,qt mov,video/x-flv,flv,video/vnd.rn-realvideo,rv".split(
            /,/
          ),
        i = 0;
      i < items.length;
      i += 2
    )
      for (ext = items[i + 1].split(/ /), y = 0; y < ext.length; y++)
        mimes[ext[y]] = items[i];
    $.each(
      {
        flash: {
          classid: "CLSID:D27CDB6E-AE6D-11CF-96B8-444553540000",
          type: "application/x-shockwave-flash",
          codebase:
            "http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,1,53,64",
        },
        shockwave: {
          classid: "CLSID:166B1BCA-3F9C-11CF-8075-444553540000",
          type: "application/x-director",
          codebase:
            "http://download.macromedia.com/pub/shockwave/cabs/director/sw.cab#version=10,2,0,023",
        },
        windowsmedia: {
          classid: "CLSID:6BF52A52-394A-11D3-B153-00C04F79FAA6",
          type: "application/x-mplayer2",
          codebase:
            "http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=10,00,00,3646",
        },
        quicktime: {
          classid: "CLSID:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B",
          type: "video/quicktime",
          codebase:
            "http://www.apple.com/qtactivex/qtplugin.cab#version=7,3,0,0",
        },
        divx: {
          classid: "CLSID:67DABFBF-D0AB-41FA-9C46-CC0F21721616",
          type: "video/divx",
          codebase: "http://go.divx.com/plugin/DivXBrowserPlugin.cab",
        },
        realmedia: {
          classid: "CLSID:CFCDAA03-8BE4-11CF-B84B-0020AFBBCCFA",
          type: "audio/x-pn-realaudio-plugin",
        },
        java: {
          classid: "CLSID:8AD9C840-044E-11D1-B3E9-00805F499D93",
          type: "application/x-java-applet",
          codebase:
            "http://java.sun.com/products/plugin/autodl/jinstall-1_5_0-windows-i586.cab#Version=1,5,0,0",
        },
        silverlight: {
          classid: "CLSID:DFEAF541-F3E1-4C24-ACAC-99C30715084A",
          type: "application/x-silverlight-2",
        },
        video: { type: "video/mpeg" },
        audio: { type: "audio/mpeg" },
        iframe: {},
      },
      function (key, value) {
        (value.name = key),
          value.classid && (lookup[value.classid] = value),
          value.type && (lookup[value.type] = value),
          (lookup[key.toLowerCase()] = value);
      }
    ),
      (window.WfMediabox.Mimetype = {
        props: function (value) {
          return lookup[value] || !1;
        },
        guess: function (value) {
          return mimes[value] || !1;
        },
      });
  })(jQuery),
  (function () {
    var entities = {
      '"': "&quot;",
      "'": "&#39;",
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
    };
    window.WfMediabox.Entities = {
      encode: function (str) {
        return ("" + str).replace(/[<>&\"\']/g, function (c) {
          return entities[c] || c;
        });
      },
      decode: function (str) {
        var el;
        try {
          str = decodeURIComponent(str);
        } catch (e) {}
        return (
          ((el = document.createElement("div")).innerHTML = str),
          el.innerHTML || str
        );
      },
    };
  })(),
  (function ($, Entities) {
    window.WfMediabox.Parameter = {
      parse: function (s) {
        var items,
          a = [],
          x = [];
        if ("string" == typeof s) {
          if (/^\{[\w\W]+\}$/.test(s)) return $.parseJSON(s);
          if (/\w+\[[^\]]+\]/.test(s))
            return (
              (items = []),
              $.each(s.split(";"), function (i, item) {
                item = item.match(/([\w]+)\[([^\]]+)\]/);
                item &&
                  3 == item.length &&
                  items.push('"' + item[1] + '":"' + item[2] + '"');
              }),
              $.parseJSON("{" + items.join(",") + "}")
            );
          -1 !== s.indexOf("=") &&
            (-1 !== s.indexOf("&") ? (x = s.split(/&(amp;)?/g)) : x.push(s));
        }
        return (
          $.isArray(s) && (x = s),
          $.each(x, function (i, n) {
            (n =
              n &&
              n.replace(
                /^([^\[]+)(\[|=|:)([^\]]*)(\]?)$/,
                function (a, b, c, d) {
                  return d
                    ? /[^0-9]/.test(d)
                      ? '"' + b + '":"' + Entities.encode($.trim(d)) + '"'
                      : '"' + b + '":' + parseInt(d)
                    : "";
                }
              )) && a.push(n);
          }),
          $.parseJSON("{" + a.join(",") + "}")
        );
      },
    };
  })(jQuery, WfMediabox.Entities),
  window.sessionStorage ||
    ((window.sessionStorage = {
      getItem: function (sKey) {
        return sKey && this.hasOwnProperty(sKey)
          ? unescape(
              document.cookie.replace(
                new RegExp(
                  "(?:^|.*;\\s*)" +
                    escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") +
                    "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"
                ),
                "$1"
              )
            )
          : null;
      },
      key: function (nKeyId) {
        return unescape(
          document.cookie
            .replace(/\s*\=(?:.(?!;))*$/, "")
            .split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]
        );
      },
      setItem: function (sKey, sValue) {
        sKey &&
          ((document.cookie = escape(sKey) + "=" + escape(sValue) + "; path=/"),
          (this.length = document.cookie.match(/\=/g).length));
      },
      length: 0,
      removeItem: function (sKey) {
        sKey &&
          this.hasOwnProperty(sKey) &&
          ((document.cookie = escape(sKey) + "=; path=/"), this.length--);
      },
      hasOwnProperty: function (sKey) {
        return new RegExp(
          "(?:^|;\\s*)" +
            escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") +
            "\\s*\\="
        ).test(document.cookie);
      },
    }),
    (window.sessionStorage.length = (
      document.cookie.match(/\=/g) || window.sessionStorage
    ).length)),
  (window.WfMediabox.Storage = {
    get: function (n) {
      return sessionStorage.getItem(n);
    },
    set: function (n, v) {
      return sessionStorage.setItem(n, v);
    },
  }),
  (function () {
    var _keyStr =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var Base64_encode = function (input) {
        var chr1,
          chr3,
          enc1,
          enc2,
          enc3,
          enc4,
          output = "",
          i = 0;
        for (
          input = (function (string) {
            string = string.replace(/\r\n/g, "\n");
            for (var utftext = "", n = 0; n < string.length; n++) {
              var c = string.charCodeAt(n);
              c < 128
                ? (utftext += String.fromCharCode(c))
                : (utftext =
                    127 < c && c < 2048
                      ? (utftext += String.fromCharCode((c >> 6) | 192)) +
                        String.fromCharCode((63 & c) | 128)
                      : (utftext =
                          (utftext += String.fromCharCode((c >> 12) | 224)) +
                          String.fromCharCode(((c >> 6) & 63) | 128)) +
                        String.fromCharCode((63 & c) | 128));
            }
            return utftext;
          })(input);
          i < input.length;

        )
          (enc1 = (chr1 = input.charCodeAt(i++)) >> 2),
            (enc2 = ((3 & chr1) << 4) | ((chr1 = input.charCodeAt(i++)) >> 4)),
            (enc3 = ((15 & chr1) << 2) | ((chr3 = input.charCodeAt(i++)) >> 6)),
            (enc4 = 63 & chr3),
            isNaN(chr1) ? (enc3 = enc4 = 64) : isNaN(chr3) && (enc4 = 64),
            (output =
              output +
              _keyStr.charAt(enc1) +
              _keyStr.charAt(enc2) +
              _keyStr.charAt(enc3) +
              _keyStr.charAt(enc4));
        return output;
      },
      Base64_decode = function (input) {
        var chr2,
          chr3,
          enc1,
          enc2,
          enc3,
          enc4,
          output = "",
          i = 0;
        for (
          input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
          i < input.length;

        )
          (enc1 = _keyStr.indexOf(input.charAt(i++))),
            (chr2 =
              ((15 & (enc2 = _keyStr.indexOf(input.charAt(i++)))) << 4) |
              ((enc3 = _keyStr.indexOf(input.charAt(i++))) >> 2)),
            (chr3 =
              ((3 & enc3) << 6) | (enc4 = _keyStr.indexOf(input.charAt(i++)))),
            (output += String.fromCharCode((enc1 << 2) | (enc2 >> 4))),
            64 != enc3 && (output += String.fromCharCode(chr2)),
            64 != enc4 && (output += String.fromCharCode(chr3));
        return (output = (function (utftext) {
          for (var c, c2, string = "", i = 0, c1 = 0; i < utftext.length; )
            (c = utftext.charCodeAt(i)) < 128
              ? ((string += String.fromCharCode(c)), i++)
              : 191 < c && c < 224
              ? ((c1 = utftext.charCodeAt(i + 1)),
                (string += String.fromCharCode(((31 & c) << 6) | (63 & c1))),
                (i += 2))
              : ((c1 = utftext.charCodeAt(i + 1)),
                (c2 = utftext.charCodeAt(i + 2)),
                (string += String.fromCharCode(
                  ((15 & c) << 12) | ((63 & c1) << 6) | (63 & c2)
                )),
                (i += 3));
          return string;
        })(output));
      };
    window.btoa || (window.btoa = Base64_encode),
      window.atob || (window.atob = Base64_decode);
  })(),
  (function ($, Parameter) {
    window.WfMediabox.Convert = {
      legacy: function () {
        $("a[href]").each(function () {
          var oc, img, title;
          /com_jce/.test(this.href) &&
            ((oc = $(this).attr("onclick")) &&
              ((oc = oc.replace(/&#39;/g, "'").split("'")),
              (img = (oc = Parameter.parse(oc[1])).img || ""),
              (title = oc.title || "")),
            img) &&
            (/http:\/\//.test(img) ||
              ("/" === img.charAt(0) && (img = img.substr(1)),
              (img = JCEMediaBox.site.replace(/http:\/\/([^\/]+)/, "") + img)),
            $(this).attr({
              href: img,
              title: title.replace(/_/, " "),
              onclick: "",
            }),
            $(this).addClass("jcepopup"));
        });
      },
      lightbox: function () {
        $("a[rel*=lightbox]")
          .addClass("jcepopup")
          .each(function () {
            var r = this.rel.replace(/lightbox\[?([^\]]*)\]?/, function (a, b) {
              return b ? "group[" + b + "]" : "";
            });
            $(this).attr("rel", r);
          });
      },
      shadowbox: function () {
        $("a[rel*=shadowbox]")
          .addClass("jcepopup")
          .each(function () {
            var r = this.rel.replace(
              /shadowbox\[?([^\]]*)\]?/,
              function (a, b) {
                var attribs = "",
                  b = b ? "group[" + b + "]" : "";
                return (
                  /;=/.test(a) &&
                    (attribs = a.replace(/=([^;"]+)/g, function (x, z) {
                      return "[" + z + "]";
                    })),
                  b && attribs ? b + ";" + attribs : b || attribs || ""
                );
              }
            );
            $(this).attr("rel", r);
          });
      },
    };
  })(jQuery, WfMediabox.Parameter),
  (function ($) {
    function Addons() {
      (this.items = []), (this.lookup = {});
    }
    (Addons.prototype = {
      add: function (id, addOn) {
        return (
          this.items.push(addOn), (this.lookup[id] = { instance: addOn }), addOn
        );
      },
      get: function (name) {
        return name && this.lookup[name]
          ? this.lookup[name].instance
          : this.lookup;
      },
    }),
      (Addons.Plugin = new Addons()),
      (Addons.Theme = new Addons()),
      (Addons.Plugin.getPlugin = function (v, n) {
        var r,
          n = this.get(n);
        return (
          $.each(n, function (k, o) {
            o = new o.instance(v);
            if (o && o.is(v)) return (r = o), !1;
          }),
          r
        );
      }),
      (Addons.Theme.parse = function (name, translate, parent) {
        var name = this.get(name);
        if (
          (name = new (name =
            "function" != typeof name ? this.get("standard") : name)())
        )
          return (
            (parent = parent || document.createElement("div")),
            (translate =
              translate ||
              function (s) {
                return s;
              }),
            (function createNode(o, el) {
              $.each(o, function (k, v) {
                "string" == typeof v
                  ? ((v = translate(v)),
                    "text" === k ? $(el).html(v) : $(el).attr(k, v))
                  : $.isArray(v) || "string" != typeof k
                  ? createNode(v, el)
                  : ((k = document.createElement(k)),
                    $(el).append(k),
                    createNode(v, k));
              });
            })(name, parent),
            parent
          );
      }),
      (window.WfMediabox.Addons = Addons),
      (window.WfMediabox.Plugin = Addons.Plugin),
      (window.WfMediabox.Theme = Addons.Theme);
  })(jQuery),
  (function ($) {
    var svg = {
      close: {
        standard:
          "M720.571 309.714q0 14.857-10.857 25.714l-103.429 103.429 103.429 103.429q10.857 10.857 10.857 25.714 0 15.429-10.857 26.286l-51.429 51.429q-10.857 10.857-26.286 10.857-14.857 0-25.714-10.857l-103.429-103.429-103.429 103.429q-10.857 10.857-25.714 10.857-15.429 0-26.286-10.857l-51.429-51.429q-10.857-10.857-10.857-26.286 0-14.857 10.857-25.714l103.429-103.429-103.429-103.429q-10.857-10.857-10.857-25.714 0-15.429 10.857-26.286l51.429-51.429q10.857-10.857 26.286-10.857 14.857 0 25.714 10.857l103.429 103.429 103.429-103.429q10.857-10.857 25.714-10.857 15.429 0 26.286 10.857l51.429 51.429q10.857 10.857 10.857 26.286zM941.714 438.857q0-119.429-58.857-220.286t-159.714-159.714-220.286-58.857-220.286 58.857-159.714 159.714-58.857 220.286 58.857 220.286 159.714 159.714 220.286 58.857 220.286-58.857 159.714-159.714 58.857-220.286z",
        squeeze:
          "M690.857 334.286l-83.429-83.429q-5.714-5.714-13.143-5.714t-13.143 5.714l-78.286 78.286-78.286-78.286q-5.714-5.714-13.143-5.714t-13.143 5.714l-83.429 83.429q-5.714 5.714-5.714 13.143t5.714 13.143l78.286 78.286-78.286 78.286q-5.714 5.714-5.714 13.143t5.714 13.143l83.429 83.429q5.714 5.714 13.143 5.714t13.143-5.714l78.286-78.286 78.286 78.286q5.714 5.714 13.143 5.714t13.143-5.714l83.429-83.429q5.714-5.714 5.714-13.143t-5.714-13.143l-78.286-78.286 78.286-78.286q5.714-5.714 5.714-13.143t-5.714-13.143zM813.714 438.857q0 84.571-41.714 156t-113.143 113.143-156 41.714-156-41.714-113.143-113.143-41.714-156 41.714-156 113.143-113.143 156-41.714 156 41.714 113.143 113.143 41.714 156zM941.714 438.857q0-119.429-58.857-220.286t-159.714-159.714-220.286-58.857-220.286 58.857-159.714 159.714-58.857 220.286 58.857 220.286 159.714 159.714 220.286 58.857 220.286-58.857 159.714-159.714 58.857-220.286z",
        shadow: "",
      },
      next: {
        standard:
          "M798.286 438.857q0 15.429-10.286 25.714l-258.857 258.857q-10.286 10.286-25.714 10.286t-25.714-10.286l-52-52q-10.286-10.286-10.286-25.714t10.286-25.714l108-108h-286.857q-14.857 0-25.714-10.857t-10.857-25.714v-73.143q0-14.857 10.857-25.714t25.714-10.857h286.857l-108-108q-10.857-10.857-10.857-25.714t10.857-25.714l52-52q10.286-10.286 25.714-10.286t25.714 10.286l258.857 258.857q10.286 10.286 10.286 25.714zM941.714 438.857q0-119.429-58.857-220.286t-159.714-159.714-220.286-58.857-220.286 58.857-159.714 159.714-58.857 220.286 58.857 220.286 159.714 159.714 220.286 58.857 220.286-58.857 159.714-159.714 58.857-220.286z",
        squeeze:
          "M740.571 438.857q0-21.143-18.286-31.429l-310.857-182.857q-8.571-5.143-18.286-5.143-9.143 0-18.286 4.571-18.286 10.857-18.286 32v365.714q0 21.143 18.286 32 18.857 10.286 36.571-0.571l310.857-182.857q18.286-10.286 18.286-31.429zM813.714 438.857q0 84.571-41.714 156t-113.143 113.143-156 41.714-156-41.714-113.143-113.143-41.714-156 41.714-156 113.143-113.143 156-41.714 156 41.714 113.143 113.143 41.714 156zM941.714 438.857q0-119.429-58.857-220.286t-159.714-159.714-220.286-58.857-220.286 58.857-159.714 159.714-58.857 220.286 58.857 220.286 159.714 159.714 220.286 58.857 220.286-58.857 159.714-159.714 58.857-220.286z",
        shadow:
          "M25.714 7.428q-10.857-10.857-18.286-7.429t-7.429 18.286v841.143q0 14.857 7.429 18.286t18.286-7.429l405.714-405.714q5.143-5.143 7.429-10.857v405.714q0 14.857 7.429 18.286t18.286-7.429l405.714-405.714q10.857-10.857 10.857-25.714t-10.857-25.714l-405.714-405.714q-10.857-10.857-18.286-7.429t-7.429 18.286v405.714q-2.286-5.714-7.429-10.857z",
      },
      prev: {
        standard:
          "M795.429 402.286v73.143q0 14.857-10.857 25.714t-25.714 10.857h-286.857l108 108q10.857 10.857 10.857 25.714t-10.857 25.714l-52 52q-10.286 10.286-25.714 10.286t-25.714-10.286l-258.857-258.857q-10.286-10.286-10.286-25.714t10.286-25.714l258.857-258.857q10.286-10.286 25.714-10.286t25.714 10.286l52 52q10.286 10.286 10.286 25.714t-10.286 25.714l-108 108h286.857q14.857 0 25.714 10.857t10.857 25.714zM941.714 438.857q0-119.429-58.857-220.286t-159.714-159.714-220.286-58.857-220.286 58.857-159.714 159.714-58.857 220.286 58.857 220.286 159.714 159.714 220.286 58.857 220.286-58.857 159.714-159.714 58.857-220.286z",
        squeeze:
          "M283.429 438.857q0-21.143 18.286-31.429l310.857-182.857q8.571-5.143 18.286-5.143 9.143 0 18.286 4.571 18.286 10.857 18.286 32v365.714q0 21.143-18.286 32-18.857 10.286-36.571-0.571l-310.857-182.857q-18.286-10.286-18.286-31.429zM210.286 438.857q0 84.571 41.714 156t113.143 113.143 156 41.714 156-41.714 113.143-113.143 41.714-156-41.714-156-113.143-113.143-156-41.714-156 41.714-113.143 113.143-41.714 156zM82.286 438.857q0-119.429 58.857-220.286t159.714-159.714 220.286-58.857 220.286 58.857 159.714 159.714 58.857 220.286-58.857 220.286-159.714 159.714-220.286 58.857-220.286-58.857-159.714-159.714-58.857-220.286z",
        shadow:
          "M925.143 870.286q10.857 10.857 18.286 7.429t7.429-18.286v-841.143q0-14.857-7.429-18.286t-18.286 7.429l-405.714 405.714q-5.143 5.143-7.429 10.857v-405.714q0-14.857-7.429-18.286t-18.286 7.429l-405.714 405.714q-10.857 10.857-10.857 25.714t10.857 25.714l405.714 405.714q10.857 10.857 18.286 7.429t7.429-18.286v-405.714q2.286 5.714 7.429 10.857z",
      },
      search:
        "M292.714 475.428q0 105.714 75.143 180.857t180.857 75.143 180.857-75.143 75.143-180.857-75.143-180.857-180.857-75.143-180.857 75.143-75.143 180.857zM0.143 0q0-29.714 21.714-51.429t51.429-21.714q30.857 0 51.429 21.714l196 195.429q102.286-70.857 228-70.857 81.714 0 156.286 31.714t128.571 85.714 85.714 128.571 31.714 156.286-31.714 156.286-85.714 128.571-128.571 85.714-156.286 31.714-156.286-31.714-128.571-85.714-85.714-128.571-31.714-156.286q0-125.714 70.857-228l-196-196q-21.143-21.143-21.143-51.429z",
      link: "M804.571 420.571v-182.857q0-68-48.286-116.286t-116.286-48.286h-475.429q-68 0-116.286 48.286t-48.286 116.286v475.429q0 68 48.286 116.286t116.286 48.286h402.286q8 0 13.143-5.143t5.143-13.143v-36.571q0-8-5.143-13.143t-13.143-5.143h-402.286q-37.714 0-64.571-26.857t-26.857-64.571v-475.429q0-37.714 26.857-64.571t64.571-26.857h475.429q37.714 0 64.571 26.857t26.857 64.571v182.857q0 8 5.143 13.143t13.143 5.143h36.571q8 0 13.143-5.143t5.143-13.143zM1024 914.286v-292.571q0-14.857-10.857-25.714t-25.714-10.857-25.714 10.857l-100.571 100.571-372.571-372.571q-5.714-5.714-13.143-5.714t-13.143 5.714l-65.143 65.143q-5.714 5.714-5.714 13.143t5.714 13.143l372.571 372.571-100.571 100.571q-10.857 10.857-10.857 25.714t10.857 25.714 25.714 10.857h292.571q14.857 0 25.714-10.857t10.857-25.714z",
      404: "M712 248.571q4.571-14.286-2.286-27.714t-21.143-18-28 2.286-18.286 21.714q-14.286 45.714-52.857 74t-86.571 28.286-86.571-28.286-52.857-74q-4.571-14.857-18-21.714t-27.714-2.286q-14.857 4.571-21.714 18t-2.286 27.714q21.143 69.143 78.857 111.429t130.286 42.286 130.286-42.286 78.857-111.429zM429.714 585.143q0-30.286-21.429-51.714t-51.714-21.429-51.714 21.429-21.429 51.714 21.429 51.714 51.714 21.429 51.714-21.429 21.429-51.714zM722.286 585.143q0-30.286-21.429-51.714t-51.714-21.429-51.714 21.429-21.429 51.714 21.429 51.714 51.714 21.429 51.714-21.429 21.429-51.714zM868.571 438.857q0 74.286-29.143 142t-78 116.571-116.571 78-142 29.143-142-29.143-116.571-78-78-116.571-29.143-142 29.143-142 78-116.571 116.571-78 142-29.143 142 29.143 116.571 78 78 116.571 29.143 142zM941.714 438.857q0-119.429-58.857-220.286t-159.714-159.714-220.286-58.857-220.286 58.857-159.714 159.714-58.857 220.286 58.857 220.286 159.714 159.714 220.286 58.857 220.286-58.857 159.714-159.714 58.857-220.286z",
    };
    window.WfMediabox.getSVGIcon = function (name, attribs) {
      var $svg = $(
          '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024"><g stroke="none" stroke-width="1"></g><path></path></svg>'
        ),
        attribs = ($svg.attr(attribs || {}), name.split(":")),
        name = attribs[0],
        attribs = attribs[1] || "",
        name = svg[name];
      return (name =
        "object" == typeof name && attribs ? name[attribs] || "" : name)
        ? ($svg.find("path").attr("d", name), $("<div />").append($svg).html())
        : "";
    };
  })(jQuery),
  (function ($) {
    var Tools = {};
    function now() {
      return new Date().getTime();
    }
    (Tools.debounce = function (func, wait, immediate) {
      function later() {
        var last = now() - timestamp;
        last < wait && 0 < last
          ? (timeout = setTimeout(later, wait - last))
          : ((timeout = null),
            immediate ||
              ((result = func.apply(context, args)), timeout) ||
              (context = args = null));
      }
      var timeout, args, context, timestamp, result;
      return function () {
        (context = this), (args = arguments), (timestamp = now());
        var callNow = immediate && !timeout;
        return (
          (timeout = timeout || setTimeout(later, wait)),
          callNow &&
            ((result = func.apply(context, args)), (context = args = null)),
          result
        );
      };
    }),
      (Tools.resize = function (w, h, x, y) {
        return (
          x < w
            ? ((h *= x / w), (w = x), y < h && ((w *= y / h), (h = y)))
            : y < h &&
              ((w *= y / h), (h = y), x < w) &&
              ((h *= x / w), (w = x)),
          (w = Math.round(w)),
          (h = Math.round(h)),
          { width: Math.round(w), height: Math.round(h) }
        );
      }),
      (Tools.parseWidth = function (w) {
        return (
          /%/.test(w) &&
            (w = Math.floor(($(window).width() * parseInt(w)) / 100)),
          (w = /\d/.test(w) ? parseInt(w) : w)
        );
      }),
      (Tools.parseHeight = function (h) {
        return (
          /%/.test(h) &&
            (h = Math.floor(($(window).height() * parseInt(h)) / 100)),
          (h = /\d/.test(h) ? parseInt(h) : h)
        );
      }),
      (window.WfMediabox.Tools = Tools);
  })(jQuery),
  (function ($, WfMediabox) {
    function isBool(attr) {
      return (
        -1 !==
        $.inArray(attr, [
          "async",
          "checked",
          "compact",
          "declare",
          "defer",
          "disabled",
          "ismap",
          "multiple",
          "nohref",
          "noresize",
          "noshade",
          "nowrap",
          "readonly",
          "selected",
          "autoplay",
          "loop",
          "controls",
          "itemscope",
          "playsinline",
          "contenteditable",
          "spellcheck",
          "contextmenu",
          "draggable",
          "hidden",
        ])
      );
    }
    function islocal(s) {
      return (
        !/^([a-z]+)?:\/\//.test(s) ||
        new RegExp("(" + WfMediabox.site + ")").test(s)
      );
    }
    function parseURL(url) {
      var o = {};
      return (
        (url =
          /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/.exec(
            url
          )),
        $.each(
          [
            "source",
            "protocol",
            "authority",
            "userInfo",
            "user",
            "password",
            "host",
            "port",
            "relative",
            "path",
            "directory",
            "file",
            "query",
            "anchor",
          ],
          function (i, v) {
            i = url[i];
            i && (o[v] = i);
          }
        ),
        o
      );
    }
    function createComponentURL(src) {
      var uri, url;
      return (
        WfMediabox.settings.convert_local_url &&
          ((uri = parseURL(src)),
          islocal(src) &&
            (uri.query
              ? -1 == uri.query.indexOf("tmpl") &&
                (uri.query += "&tmpl=component")
              : (uri.query = "tmpl=component")),
          (url = ""),
          (uri = uri).protocol && (url += uri.protocol + "://"),
          uri.userInfo && (url += uri.userInfo + "@"),
          uri.host && (url += uri.host),
          uri.port && (url += ":" + uri.port),
          uri.path && (url += uri.path),
          uri.query && (url += "?" + uri.query),
          uri.anchor && (url += "#" + uri.anchor),
          (src = url)),
        src
      );
    }
    function createObject(data, embed) {
      delete data.group,
        delete data.title,
        delete data.caption,
        delete data.width,
        delete data.height;
      var attribs = [
          "id",
          "name",
          "style",
          "codebase",
          "classid",
          "type",
          "data",
        ],
        html = '<object class="wf-mediabox-focus"';
      for (n in data)
        -1 !== attribs.indexOf(n) &&
          "string" == typeof data[n] &&
          ((html += " " + n + '="' + decodeURIComponent(data[n]) + '"'),
          delete data[n]);
      for (n in ((html += ">"), data))
        "string" == typeof data[n] &&
          (html +=
            ' <param name="' +
            n +
            '" value="' +
            decodeURIComponent(data[n]) +
            '" />');
      if (embed) {
        for (var n in ((html += "<embed"), data))
          "string" == typeof data[n] &&
            (html += " " + n + '="' + decodeURIComponent(data[n]) + '"');
        html += "></embed>";
      }
      return (html += "</object>");
    }
    function createIframe(src) {
      return (
        '<iframe src="' +
        src +
        '" frameborder="0" scrolling="0" allowfullscreen="allowfullscreen" />'
      );
    }
    WfMediabox.Plugin.add("flash", function () {
      (this.type = "object"),
        (this.html = function (data) {
          return (
            (data.type = "application/x-shockwave-flash"),
            (data.data = data.src),
            $(createObject(data, !0))
          );
        }),
        (this.is = function (data) {
          return /\.swf\b/.test(data.src);
        });
    }),
      WfMediabox.Plugin.add("video", function () {
        (this.type = "video"),
          (this.html = function (data) {
            var n,
              attribs = ['class="wf-mediabox-video wf-mediabox-focus"'],
              params = data.params || {};
            for (n in params)
              isBool(n)
                ? attribs.push(n)
                : attribs.push(n + '="' + params[n] + '"');
            params.autoplay || attribs.push("controls"),
              WfMediabox.Env.mobile && attribs.push("playsinline");
            var ext = data.src.split(".").pop(),
              ext = WfMediabox.Mimetype.guess(ext) || "video/mpeg";
            return $("<video " + attribs.join(" ") + ' tabindex="0" />')
              .on("loadedmetadata", function (e) {
                $(this).attr({
                  width: this.videoWidth || "",
                  height: this.videoHeight || "",
                });
              })
              .append('<source src="' + data.src + '" type="' + ext + '" />');
          }),
          (this.is = function (data) {
            var src = (src = data.src).split("?")[0];
            return (
              (/video\/(mp4|mpeg|webm|ogg)/.test(data.type) ||
                /\.(mp4|webm|ogg)\b/.test(src)) &&
              WfMediabox.Env.video
            );
          });
      }),
      WfMediabox.Plugin.add("audio", function () {
        (this.type = "audio"),
          (this.html = function (data) {
            var n,
              attribs = [
                'src="' + data.src + '"',
                'class="wf-mediabox-audio wf-mediabox-focus"',
              ],
              params = data.params || {};
            for (n in params)
              isBool(n)
                ? attribs.push(n)
                : attribs.push(n + '="' + params[n] + '"');
            return (
              params.autoplay || attribs.push("controls"),
              $("<audio " + attribs.join(" ") + ' tabindex="0" />')
            );
          }),
          (this.is = function (data) {
            var src = (src = data.src).split("?")[0];
            return (
              (/audio\/(mp3|mpeg|oga|x-wav)/.test(data.type) ||
                /\.(mp3|oga|wav|m4a)\b/.test(src)) &&
              WfMediabox.Env.audio
            );
          });
      }),
      WfMediabox.Plugin.add("dailymotion", function () {
        (this.is = function (data) {
          return /dai\.?ly(motion)/.test(data.src);
        }),
          (this.width = 480),
          (this.type = "iframe"),
          (this.html = function (data) {
            var u,
              data = $(
                createIframe(
                  ((data = data.src),
                  (u = "https://dailymotion.com/embed/video/"),
                  (data = data.match(
                    /dai\.?ly(motion)?(.+)?\/(swf|video)?\/?([a-z0-9]+)_?/
                  )) && (u += data[4]),
                  u)
                )
              );
            return $(data).addClass("wf-mediabox-iframe-video"), data;
          });
      }),
      WfMediabox.Plugin.add("quicktime", function () {
        (this.html = function (data) {
          return (
            (data.type = "video/quicktime"),
            (data.classid = "clsid:02bf25d5-8c17-4b23-bc80-d3488abddc6b"),
            (data.codebase =
              "https://www.apple.com/qtactivex/qtplugin.cab#version=6,0,2,0"),
            $(createObject(data))
          );
        }),
          (this.type = "object"),
          (this.width = 853),
          (this.is = function (data) {
            return /\.(mov)\b/.test(data.src);
          });
      }),
      WfMediabox.Plugin.add("windowsmedia", function () {
        (this.type = "object"),
          (this.html = function (data) {
            return (
              (data.type = "application/x-mplayer2"),
              (data.classid = "clsid:6bf52a52-394a-11d3-b153-00c04f79faa6"),
              (data.codebase =
                "https://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701"),
              $(createObject(data, !0))
            );
          }),
          (this.is = function (data) {
            return /\.(wmv|avi)\b/.test(data.src);
          });
      }),
      WfMediabox.Plugin.add("youtube", function () {
        var props = [
          "autoplay",
          "cc_lang_pref",
          "cc_load_policy",
          "color",
          "controls",
          "disablekb",
          "enablejsapi",
          "end",
          "fs",
          "hl",
          "iv_load_policy",
          "list",
          "listType",
          "loop",
          "modestbranding",
          "origin",
          "playlist",
          "playsinline",
          "rel",
          "start",
          "widget_referrer",
        ];
        (this.is = function (data) {
          return /youtu(\.)?be([^\/]+)?\/(.+)/.test(data.src);
        }),
          (this.width = 560),
          (this.type = "iframe"),
          (this.html = function (data) {
            var allow,
              params,
              src = data.src
                .replace(/youtu(\.)?be([^\/]+)?\/(.+)/, function (a, b, c, d) {
                  return (
                    "youtube" +
                    (c = b && !c ? ".com" : c) +
                    "/embed/" +
                    (d =
                      -1 ===
                      (d = d.replace(
                        /(watch\?v=|v\/|embed\/|live\/)/,
                        ""
                      )).indexOf("?")
                        ? d.replace(/&/, "?")
                        : d)
                  );
                })
                .replace(/\/\/youtube/i, "//www.youtube")
                .replace(/^http:\/\//, "https://"),
              ifr = $(createIframe(src));
            return (
              data.params &&
                ((allow = [
                  "accelerometer",
                  "encrypted-media",
                  "gyroscope",
                  "picture-in-picture",
                  "allowfullscreen",
                ]),
                (params = {}),
                $.each(data.params, function (key, value) {
                  -1 !== key.indexOf("youtube-") &&
                    (key = key.replace("youtube-", "")),
                    -1 != $.inArray(props, key) &&
                      ((params[key] = value), "autoplay" == key) &&
                      value &&
                      (allow.push(key), (params.mute = 1));
                }),
                allow.length && $(ifr).attr("allow", allow.join(";")),
                (params = $.param(params))) &&
                (-1 !== src.indexOf("?")
                  ? (src += "&" + params)
                  : (src += "?" + params),
                $(ifr).attr("src", src)),
              $(ifr).addClass("wf-mediabox-iframe-video"),
              ifr
            );
          });
      }),
      WfMediabox.Plugin.add("vimeo", function () {
        (this.is = function (data) {
          return /vimeo\.com\/(\w+\/)?(\w+\/)?([0-9]+)/.test(data.src);
        }),
          (this.width = 500),
          (this.type = "iframe"),
          (this.html = function (data) {
            var params,
              s = (s = (s =
                -1 == (s = data.src).indexOf("player.vimeo.com/video/")
                  ? s.replace(
                      /vimeo\.com\/(?:\w+\/){0,3}((?:[0-9]+\b)(?:\/[a-z0-9]+)?)/,
                      function (match, value) {
                        var hash = "",
                          value = value.split("/");
                        return (
                          "player.vimeo.com/video/" +
                          value[0] +
                          ((hash = 2 == value.length ? value[1] : hash)
                            ? "?h=" + hash
                            : "")
                        );
                      }
                    )
                  : s).replace(/^http:\/\//, "https://")),
              ifr = $(createIframe(s));
            return (
              $(ifr).addClass("wf-mediabox-iframe-video"),
              data.params &&
                ((params = {}),
                $.each(data.params, function (key, value) {
                  -1 !== key.indexOf("vimeo-") &&
                    ((key = key.replace("vimeo-", "")), (params[key] = value));
                }),
                (params = $.param(params))) &&
                (-1 !== s.indexOf("?")
                  ? (s += "&" + params)
                  : (s += "?" + params),
                $(ifr).attr("src", s)),
              ifr
            );
          });
      }),
      $(".wf-mediabox").on("WfMediabox:plugin", function (e, data) {
        var $img;
        return (function (data) {
          var src = (src = data.src).split("?")[0];
          return (
            /image\/?/.test(data.type) ||
            /\.(jpg|jpeg|png|apng|gif|bmp|tif|webp)$/i.test(src)
          );
        })(data)
          ? (($img = $(
              '<img src="' +
                data.src +
                '" class="wf-mediabox-img" alt="' +
                decodeURIComponent(data.alt || data.title || "") +
                '" tabindex="0" />'
            )),
            data.params &&
              $.each(data.params, function (name, value) {
                "srcset" === name &&
                  (value = value.replace(
                    /(?:[^\s]+)\s*(?:[\d\.]+[wx])?(?:\,\s*)?/gi,
                    function (match) {
                      return islocal(match) ? WfMediabox.site + match : match;
                    }
                  )),
                  $img.attr(name, value);
              }),
            $img)
          : "";
      }),
      WfMediabox.Plugin.add("image", function () {
        (this.type = "image"),
          (this.html = function (data) {
            var html,
              tmp,
              alt = decodeURIComponent(data.alt || data.title || ""),
              $img =
                ((html = alt),
                ((tmp = document.createElement("DIV")).innerHTML = html),
                (alt = tmp.textContent || tmp.innerText || ""),
                $(
                  '<img src="' +
                    data.src +
                    '" class="wf-mediabox-img" alt="' +
                    alt +
                    '" tabindex="0" />'
                ));
            return (
              data.params &&
                $.each(data.params, function (name, value) {
                  "srcset" === name &&
                    (value = value.replace(
                      /(?:[^\s]+)\s*(?:[\d\.]+[wx])?(?:\,\s*)?/gi,
                      function (match) {
                        return islocal(match) ? WfMediabox.site + match : match;
                      }
                    )),
                    $img.attr(name, value);
                }),
              $img.on("mediabox:load", function () {
                var cw = this.clientWidth,
                  ch = this.clientHeight,
                  nw = this.naturalWidth,
                  nh = this.naturalHeight;
                $("body").hasClass("wf-mediabox-scrolling") ||
                  (!1 !== WfMediabox.settings.expand_on_click &&
                    (cw < nw || ch < nh) &&
                    $(this)
                      .on("click", function () {
                        $(
                          ".wf-mediabox-body",
                          ".wf-mediabox-frame:not(.wf-mediabox-fullscreen)"
                        ).css("max-width", nw + "px"),
                          $(".wf-mediabox-frame").toggleClass(
                            "wf-mediabox-fullscreen"
                          ),
                          $(this).trigger("mediabox:resize");
                      })
                      .parent()
                      .addClass("wf-mediabox-content-item-expand"));
              }),
              $img
            );
          }),
          (this.is = function (data) {
            var src = (src = data.src).split("?")[0];
            return (
              /image\/?/.test(data.type) ||
              /\.(jpg|jpeg|png|gif|bmp|tif|webp)$/i.test(src)
            );
          });
      }),
      WfMediabox.Plugin.add("pdf", function () {
        (this.type = "object"),
          (this.html = function (data) {
            var name = data.src.replace(/^.*[\/\\]/g, ""),
              name = data.title || "PDF display of " + name;
            return (
              (data.width = data.width || "100%"),
              (data.height = data.height || "100%"),
              WfMediabox.Env.safari
                ? $(
                    '<object data="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" aria-label="' +
                      name +
                      '" />'
                  ).on("mediabox:load", function () {
                    (url = data.src),
                      (timestamp = Date.now()),
                      (separator = url.includes("?") ? "&" : "?");
                    var timestamp,
                      separator,
                      url = url + separator + "ts=" + timestamp;
                    $(this).attr({ data: url, type: "application/pdf" });
                  })
                : $(
                    '<object data="' +
                      data.src +
                      '" type="application/pdf" aria-label="' +
                      name +
                      '" />'
                  )
            );
          }),
          (this.is = function (data) {
            return (
              "pdf" === data.type ||
              /application\/(x-)?pdf/.test(data.type) ||
              /\.pdf$/i.test(data.src)
            );
          });
      }),
      WfMediabox.Plugin.add("content", function () {
        (this.type = "ajax"),
          (this.html = function (data) {
            return (
              (src = createComponentURL(data.src)),
              (data.width = data.width || "100%"),
              (data.height = data.height || "100%"),
              $('<iframe src="' + src + '" />').on(
                "mediabox:load",
                function () {
                  var n = this,
                    $parent = $(this).parent(),
                    html = this.contentWindow.document.body.innerHTML,
                    html =
                      (window.setTimeout(function () {
                        $(n).remove();
                      }, 10),
                      $parent.append(html),
                      parseURL(this.src));
                  html.anchor &&
                    (html = $parent.find("#" + html.anchor).get(0)) &&
                    html.scrollIntoView(),
                    $parent.find('a[href^="#"]').on("click", function (e) {
                      e.preventDefault();
                      (e = $(this).attr("href")), (e = $parent.find(e).get(0));
                      e && e.scrollIntoView();
                    }),
                    WfMediabox.create(WfMediabox.getPopups("", $parent)),
                    data.params &&
                      data.params.style &&
                      $('<style type="text/css" />')
                        .text(
                          ".wf-mediabox-content{" +
                            $("<div />").attr("style", data.params.style).get(0)
                              .style.cssText +
                            "}"
                        )
                        .insertBefore($parent);
                }
              )
            );
          }),
          (this.is = function (data) {
            return (
              "ajax" === data.type ||
              "text/html" === data.type ||
              $(data.node).hasClass("ajax")
            );
          });
      }),
      WfMediabox.Plugin.add("dom", function () {
        (this.type = "dom"),
          (this.html = function (data) {
            data = $(data.src);
            return data ? $(data).get(0).outerHTML : "";
          }),
          (this.is = function (data) {
            return "dom" === data.type;
          });
      }),
      WfMediabox.Plugin.add("iframe", function () {
        (this.type = "iframe"),
          (this.html = function (data) {
            (data.width = data.width || "100%"),
              (data.height = data.height || "100%");
            data = createIframe((src = createComponentURL(data.src)));
            return $(data);
          }),
          (this.is = function (data) {
            return !data.type || "iframe" === data.type;
          });
      });
  })(jQuery, WfMediabox),
  WfMediabox.Theme.add("bootstrap", function () {
    return [
      {
        div: {
          class: "wf-mediabox-container modal",
          content: [
            {
              div: {
                class: "modal-header p-2",
                content: [
                  {
                    button: {
                      type: "button",
                      class:
                        "close btn-close position-relative top-0 end-0 wf-mediabox-close",
                      title: "{{close}}",
                      "aria-label": "{{close}}",
                      content: [
                        {
                          span: {
                            "aria-hidden": "true",
                            class: "invisible",
                            text: "&times;",
                          },
                        },
                      ],
                    },
                    div: { class: "wf-mediabox-caption" },
                  },
                ],
              },
            },
            {
              div: {
                class: "wf-mediabox-content",
                content: [
                  {
                    nav: {
                      class: "wf-mediabox-nav modal-body carousel",
                      role: "navigation",
                      content: [
                        {
                          a: {
                            role: "button",
                            class: "left carousel-control wf-mediabox-prev",
                            title: "{{previous}}",
                            "aria-label": "{{previous}}",
                            content: [
                              {
                                span: {
                                  "aria-hidden": "true",
                                  class: "glyphicon glyphicon-chevron-left",
                                },
                              },
                            ],
                          },
                        },
                        {
                          a: {
                            role: "button",
                            class: "right carousel-control wf-mediabox-next",
                            title: "{{next}}",
                            "aria-label": "{{next}}",
                            content: [
                              {
                                span: {
                                  "aria-hidden": "true",
                                  class: "glyphicon glyphicon-chevron-right",
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                    div: { class: "wf-mediabox-content-item" },
                  },
                ],
              },
            },
          ],
        },
      },
    ];
  }),
  WfMediabox.Theme.add("light", function () {
    return [
      {
        div: {
          class: "wf-mediabox-container",
          content: [
            {
              div: {
                class: "wf-mediabox-content",
                content: [
                  { div: { class: "wf-mediabox-content-item" } },
                  {
                    button: {
                      class: "wf-mediabox-next",
                      title: "{{next}}",
                      "aria-label": "{{next}}",
                    },
                  },
                  {
                    button: {
                      class: "wf-mediabox-prev",
                      title: "{{previous}}",
                      "aria-label": "{{previous}}",
                    },
                  },
                ],
              },
            },
            { div: { class: "wf-mediabox-caption" } },
            {
              nav: {
                class: "wf-mediabox-nav",
                role: "navigation",
                content: [
                  {
                    button: {
                      class: "wf-mediabox-close",
                      title: "{{close}}",
                      "aria-label": "{{close}}",
                      text: "{{close}}",
                    },
                  },
                  {
                    span: {
                      class: "wf-mediabox-numbers",
                      text: "{{numbers_count}}",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ];
  }),
  WfMediabox.Theme.add("shadow", function () {
    return [
      {
        div: {
          class: "wf-mediabox-info-top",
          content: [{ div: { class: "wf-mediabox-caption" } }],
        },
      },
      {
        div: {
          class: "wf-mediabox-container",
          content: [
            {
              div: {
                class: "wf-mediabox-content",
                content: [{ div: { class: "wf-mediabox-content-item" } }],
              },
            },
          ],
        },
      },
      {
        div: {
          class: "wf-mediabox-info-bottom",
          content: [
            {
              div: {
                class: "wf-mediabox-nav",
                role: "navigation",
                content: [
                  {
                    span: { class: "wf-mediabox-numbers", text: "{{numbers}}" },
                  },
                  {
                    button: {
                      class: "wf-mediabox-close",
                      title: "{{close}}",
                      "aria-label": "{{close}}",
                    },
                  },
                  {
                    button: {
                      class: "wf-mediabox-next",
                      title: "{{next}}",
                      "aria-label": "{{next}}",
                      "svg-icon": "next:shadow",
                    },
                  },
                  {
                    button: {
                      class: "wf-mediabox-prev",
                      title: "{{previous}}",
                      "aria-label": "{{previous}}",
                      "svg-icon": "prev:shadow",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ];
  }),
  WfMediabox.Theme.add("squeeze", function () {
    return [
      {
        div: {
          class: "wf-mediabox-container",
          content: [
            {
              button: {
                class: "wf-mediabox-close",
                title: "{{close}}",
                "aria-label": "{{close}}",
                "svg-icon": "close:squeeze",
              },
            },
            {
              div: {
                class: "wf-mediabox-content",
                content: [{ div: { class: "wf-mediabox-content-item" } }],
              },
            },
            { div: { class: "wf-mediabox-caption" } },
            {
              nav: {
                class: "wf-mediabox-nav",
                role: "navigation",
                content: [
                  {
                    button: {
                      class: "wf-mediabox-prev",
                      title: "{{previous}}",
                      "aria-label": "{{previous}}",
                      "svg-icon": "prev:squeeze",
                    },
                  },
                  {
                    button: {
                      class: "wf-mediabox-next",
                      title: "{{next}}",
                      "aria-label": "{{next}}",
                      "svg-icon": "next:squeeze",
                    },
                  },
                  {
                    span: { class: "wf-mediabox-numbers", text: "{{numbers}}" },
                  },
                ],
              },
            },
          ],
        },
      },
    ];
  }),
  jQuery(".wf-mediabox").on("wf-mediabox:template", function () {}),
  WfMediabox.Theme.add("standard", function () {
    return [
      {
        div: {
          class: "wf-mediabox-container",
          content: [
            {
              div: {
                class: "wf-mediabox-content",
                content: [{ div: { class: "wf-mediabox-content-item" } }],
              },
            },
            { div: { class: "wf-mediabox-caption" } },
            {
              nav: {
                class: "wf-mediabox-nav",
                role: "navigation",
                content: [
                  {
                    button: {
                      class: "wf-mediabox-close",
                      title: "{{close}}",
                      "aria-label": "{{close}}",
                      "svg-icon": "close:standard",
                    },
                  },
                  {
                    button: {
                      class: "wf-mediabox-prev",
                      title: "{{previous}}",
                      "aria-label": "{{previous}}",
                      "svg-icon": "prev:standard",
                    },
                  },
                  {
                    button: {
                      class: "wf-mediabox-next",
                      title: "{{next}}",
                      "aria-label": "{{next}}",
                      "svg-icon": "next:standard",
                    },
                  },
                  {
                    span: { class: "wf-mediabox-numbers", text: "{{numbers}}" },
                  },
                ],
              },
            },
          ],
        },
      },
    ];
  });
