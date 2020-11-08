/*=========================================================================================
	File Name: knob.js
	Description: Nice, downward compatible, touchable, jQuery dial.
	----------------------------------------------------------------------------------------
	Item Name: Stack - Responsive Admin Theme
	Version: 1.0
	Author: GeeksLabs
	Author URL: http://www.themeforest.net/user/geekslabs
==========================================================================================*/
$(document).ready(function(){

    var rtl = false;
    if($('html').data('textdirection') == 'rtl')
        rtl = true;

    $(".knob").knob({
        rtl: rtl,
        change: function(value) {
            //console.log("change : " + value);
            console.log(value);
            console.log(this.$[0]);
            var evt = new CustomEvent('change');
            this.$[0].dispatchEvent(evt);
        },
        release: function(value) {
            //console.log(this.$.attr('value'));
            // console.log("release : " + value);
        },
        cancel: function() {
            // console.log("cancel : ", this);
        },
        /*format : function (value) {
         return value + '%';
         },*/
        draw: function() {

            // "tron" case
            if (this.$.data('skin') == 'tron') {

                this.cursorExt = 0.3;

                var a = this.arc(this.cv), // Arc
                    pa, // Previous arc
                    r = 1;

                this.g.lineWidth = this.lineWidth;

                if (this.o.displayPrevious) {
                    pa = this.arc(this.v);
                    this.g.beginPath();
                    this.g.strokeStyle = this.pColor;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, pa.s, pa.e, pa.d);
                    this.g.stroke();
                }

                this.g.beginPath();
                this.g.strokeStyle = r ? this.o.fgColor : this.fgColor;
                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, a.s, a.e, a.d);
                this.g.stroke();

                this.g.lineWidth = 2;
                this.g.beginPath();
                this.g.strokeStyle = this.o.fgColor;
                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                this.g.stroke();

                return false;
            }
        }
    });
});

!function(t) {
    "object" == typeof exports ? module.exports = t(require("jquery")) : "function" == typeof define && define.amd ? define(["jquery"], t) : t(jQuery)
}(function(t) {
    "use strict";
    var i = {}
      , s = Math.max
      , h = Math.min;
    i.c = {},
    i.c.d = t(document),
    i.c.t = function(t) {
        return t.originalEvent.touches.length - 1
    }
    ,
    i.o = function() {
        var s = this;
        this.o = null,
        this.$ = null,
        this.i = null,
        this.g = null,
        this.v = null,
        this.cv = null,
        this.x = 0,
        this.y = 0,
        this.w = 0,
        this.h = 0,
        this.$c = null,
        this.c = null,
        this.t = 0,
        this.isInit = !1,
        this.fgColor = null,
        this.pColor = null,
        this.dH = null,
        this.cH = null,
        this.eH = null,
        this.rH = null,
        this.scale = 1,
        this.relative = !1,
        this.relativeWidth = !1,
        this.relativeHeight = !1,
        this.$div = null,
        this.run = function() {
            var i = function(t, i) {
                var h;
                for (h in i)
                    s.o[h] = i[h];
                s._carve().init(),
                s._configure()._draw()
            };
            if (!this.$.data("kontroled")) {
                if (this.$.data("kontroled", !0),
                this.extend(),
                this.o = t.extend({
                    min: void 0 !== this.$.data("min") ? this.$.data("min") : 0,
                    max: void 0 !== this.$.data("max") ? this.$.data("max") : 10,
                    stopper: !0,
                    readOnly: this.$.data("readonly") || "readonly" === this.$.attr("readonly"),
                    cursor: this.$.data("cursor") === !0 && 30 || this.$.data("cursor") || 0,
                    thickness: this.$.data("thickness") && Math.max(Math.min(this.$.data("thickness"), 1), .01) || .35,
                    lineCap: this.$.data("linecap") || "butt",
                    width: this.$.data("width") || 65,
                    height: this.$.data("height") || 65,
                    displayInput: null == this.$.data("displayinput") || this.$.data("displayinput"),
                    displayPrevious: this.$.data("displayprevious"),
                    fgColor: this.$.data("fgcolor") || "#7a412a",
                    inputColor: this.$.data("inputcolor"),
                    font: this.$.data("font") || "Arial",
                    fontWeight: this.$.data("font-weight") || "bold",
                    inline: !1,
                    step: this.$.data("step") || 1,
                    rotation: this.$.data("rotation"),
                    rtl: !1,
                    draw: null,
                    change: test(),
                    cancel: null,
                    release: null,
                    format: function(t) {
                        return t
                    },
                    parse: function(t) {
                        return parseFloat(t)
                    }
                }, this.o),
                this.o.flip = "anticlockwise" === this.o.rotation || "acw" === this.o.rotation,
                this.o.inputColor || (this.o.inputColor = this.o.fgColor),
                this.$.is("fieldset") ? (this.v = {},
                this.i = this.$.find("input"),
                this.i.each(function(i) {
                    var h = t(this);
                    s.i[i] = h,
                    s.v[i] = s.o.parse(h.val()),
                    h.bind("change blur", function() {
                        var t = {};
                        t[i] = h.val(),
                        s.val(s._validate(t))
                    })
                }),
                this.$.find("legend").remove()) : (this.i = this.$,
                this.v = this.o.parse(this.$.val()),
                "" === this.v && (this.v = this.o.min),
                this.$.bind("change blur", function() {
                    s.val(s._validate(s.o.parse(s.$.val())))
                })),
                !this.o.displayInput && this.$.hide(),
                this.$c = t(document.createElement("canvas")).attr({
                    width: this.o.width,
                    height: this.o.height
                }),
                this.$div = t('<div style="' + (this.o.inline ? "display:inline;" : "") + "width:" + this.o.width + "px;height:" + this.o.height + 'px;"></div>'),
                this.$.wrap(this.$div).before(this.$c),
                this.$div = this.$.parent(),
                "undefined" != typeof G_vmlCanvasManager && G_vmlCanvasManager.initElement(this.$c[0]),
                this.c = this.$c[0].getContext ? this.$c[0].getContext("2d") : null,
                !this.c)
                    throw {
                        name: "CanvasNotSupportedException",
                        message: "Canvas not supported. Please use excanvas on IE8.0.",
                        toString: function() {
                            return this.name + ": " + this.message
                        }
                    };
                return this.scale = (window.devicePixelRatio || 1) / (this.c.webkitBackingStorePixelRatio || this.c.mozBackingStorePixelRatio || this.c.msBackingStorePixelRatio || this.c.oBackingStorePixelRatio || this.c.backingStorePixelRatio || 1),
                this.relativeWidth = this.o.width % 1 !== 0 && this.o.width.indexOf("%"),
                this.relativeHeight = this.o.height % 1 !== 0 && this.o.height.indexOf("%"),
                this.relative = this.relativeWidth || this.relativeHeight,
                this._carve(),
                this.v instanceof Object ? (this.cv = {},
                this.copy(this.v, this.cv)) : this.cv = this.v,
                this.$.bind("configure", i).parent().bind("configure", i),
                this._listen()._configure()._xy().init(),
                this.isInit = !0,
                this.$.val(this.o.format(this.v)),
                this._draw(),
                this
            }
        }
        ,
        this._carve = function() {
            if (this.relative) {
                var t = this.relativeWidth ? this.$div.parent().width() * parseInt(this.o.width) / 100 : this.$div.parent().width()
                  , i = this.relativeHeight ? this.$div.parent().height() * parseInt(this.o.height) / 100 : this.$div.parent().height();
                this.w = this.h = Math.min(t, i)
            } else
                this.w = this.o.width,
                this.h = this.o.height;
            return this.$div.css({
                width: this.w + "px",
                height: this.h + "px"
            }),
            this.$c.attr({
                width: this.w,
                height: this.h
            }),
            1 !== this.scale && (this.$c[0].width = this.$c[0].width * this.scale,
            this.$c[0].height = this.$c[0].height * this.scale,
            this.$c.width(this.w),
            this.$c.height(this.h)),
            this
        }
        ,
        this._draw = function() {
            var t = !0;
            s.g = s.c,
            s.clear(),
            s.dH && (t = s.dH()),
            t !== !1 && s.draw()
        }
        ,
        this._touch = function(t) {
            var h = function(t) {
                var i = s.xy2val(t.originalEvent.touches[s.t].pageX, t.originalEvent.touches[s.t].pageY);
                i != s.cv && (s.cH && s.cH(i) === !1 || (s.change(s._validate(i)),
                s._draw()))
            };
            return this.t = i.c.t(t),
            h(t),
            i.c.d.bind("touchmove.k", h).bind("touchend.k", function() {
                i.c.d.unbind("touchmove.k touchend.k"),
                s.val(s.cv)
            }),
            this
        }
        ,
        this._mouse = function(t) {
            var h = function(t) {
                var i = s.xy2val(t.pageX, t.pageY);
                i != s.cv && (s.cH && s.cH(i) === !1 || (s.change(s._validate(i)),
                s._draw()))
            };
            return h(t),
            i.c.d.bind("mousemove.k", h).bind("keyup.k", function(t) {
                if (27 === t.keyCode) {
                    if (i.c.d.unbind("mouseup.k mousemove.k keyup.k"),
                    s.eH && s.eH() === !1)
                        return;
                    s.cancel()
                }
            }).bind("mouseup.k", function(t) {
                i.c.d.unbind("mousemove.k mouseup.k keyup.k"),
                s.val(s.cv)
            }),
            this
        }
        ,
        this._xy = function() {
            var t = this.$c.offset();
            return this.x = t.left,
            this.y = t.top,
            this
        }
        ,
        this._listen = function() {
            return this.o.readOnly ? this.$.attr("readonly", "readonly") : (this.$c.bind("mousedown", function(t) {
                t.preventDefault(),
                s._xy()._mouse(t)
            }).bind("touchstart", function(t) {
                t.preventDefault(),
                s._xy()._touch(t)
            }),
            this.listen()),
            this.relative && t(window).resize(function() {
                s._carve().init(),
                s._draw()
            }),
            this
        }
        ,
        this._configure = function() {
            return this.o.draw && (this.dH = this.o.draw),
            this.o.change && (this.cH = this.o.change),
            this.o.cancel && (this.eH = this.o.cancel),
            this.o.release && (this.rH = this.o.release),
            this.o.displayPrevious ? (this.pColor = this.h2rgba(this.o.fgColor, "0.4"),
            this.fgColor = this.h2rgba(this.o.fgColor, "0.6")) : this.fgColor = this.o.fgColor,
            this
        }
        ,
        this._clear = function() {
            this.$c[0].width = this.$c[0].width
        }
        ,
        this._validate = function(t) {
            var i = ~~((0 > t ? -.5 : .5) + t / this.o.step) * this.o.step;
            return Math.round(100 * i) / 100
        }
        ,
        this.listen = function() {}
        ,
        this.extend = function() {}
        ,
        this.init = function() {}
        ,
        this.change = function(t) {}
        ,
        this.val = function(t) {}
        ,
        this.xy2val = function(t, i) {}
        ,
        this.draw = function() {}
        ,
        this.clear = function() {
            this._clear()
        }
        ,
        this.h2rgba = function(t, i) {
            var s;
            return t = t.substring(1, 7),
            s = [parseInt(t.substring(0, 2), 16), parseInt(t.substring(2, 4), 16), parseInt(t.substring(4, 6), 16)],
            "rgba(" + s[0] + "," + s[1] + "," + s[2] + "," + i + ")"
        }
        ,
        this.copy = function(t, i) {
            for (var s in t)
                i[s] = t[s]
        }
    }
    ,
    i.Dial = function() {
        i.o.call(this),
        this.startAngle = null,
        this.xy = null,
        this.radius = null,
        this.lineWidth = null,
        this.cursorExt = null,
        this.w2 = null,
        this.PI2 = 2 * Math.PI,
        this.extend = function() {
            this.o = t.extend({
                bgColor: this.$.data("bgcolor") || "#EEEEEE",
                angleOffset: this.$.data("angleoffset") || 0,
                angleArc: this.$.data("anglearc") || 360,
                inline: !0
            }, this.o)
        }
        ,
        this.val = function(t, i) {
            return null == t ? this.v : (t = this.o.parse(t),
            void (i !== !1 && t != this.v && this.rH && this.rH(t) === !1 || (this.cv = this.o.stopper ? s(h(t, this.o.max), this.o.min) : t,
            this.v = this.cv,
            this.$.val(this.o.format(this.v)),
            this._draw())))
        }
        ,
        this.xy2val = function(t, i) {
            var e, n;
            return e = Math.atan2(t - (this.x + this.w2), -(i - this.y - this.w2)) - this.angleOffset,
            this.o.flip && (e = this.angleArc - e - this.PI2),
            this.angleArc != this.PI2 && 0 > e && e > -.5 ? e = 0 : 0 > e && (e += this.PI2),
            n = e * (this.o.max - this.o.min) / this.angleArc + this.o.min,
            this.o.stopper && (n = s(h(n, this.o.max), this.o.min)),
            n
        }
        ,
        this.listen = function() {
            var i, e, n, a, o = this, r = function(t) {
                t.preventDefault();
                var n = t.originalEvent
                  , a = n.detail || n.wheelDeltaX
                  , r = n.detail || n.wheelDeltaY
                  , l = o._validate(o.o.parse(o.$.val())) + (a > 0 || r > 0 ? o.o.step : 0 > a || 0 > r ? -o.o.step : 0);
                l = s(h(l, o.o.max), o.o.min),
                o.val(l, !1),
                o.rH && (clearTimeout(i),
                i = setTimeout(function() {
                    o.rH(l),
                    i = null
                }, 100),
                e || (e = setTimeout(function() {
                    i && o.rH(l),
                    e = null
                }, 200)))
            }, l = 1, c = {
                37: -o.o.step,
                38: o.o.step,
                39: o.o.step,
                40: -o.o.step
            };
            this.$.bind("keydown", function(i) {
                var e = i.keyCode;
                if (e >= 96 && 105 >= e && (e = i.keyCode = e - 48),
                n = parseInt(String.fromCharCode(e)),
                isNaN(n) && (13 !== e && 8 !== e && 9 !== e && 189 !== e && (190 !== e || o.$.val().match(/\./)) && i.preventDefault(),
                t.inArray(e, [37, 38, 39, 40]) > -1)) {
                    i.preventDefault();
                    var r = o.o.parse(o.$.val()) + c[e] * l;
                    o.o.stopper && (r = s(h(r, o.o.max), o.o.min)),
                    o.change(o._validate(r)),
                    o._draw(),
                    a = window.setTimeout(function() {
                        l *= 2
                    }, 30)
                }
            }).bind("keyup", function(t) {
                isNaN(n) ? a && (window.clearTimeout(a),
                a = null,
                l = 1,
                o.val(o.$.val())) : o.$.val() > o.o.max && o.$.val(o.o.max) || o.$.val() < o.o.min && o.$.val(o.o.min)
            }),
            this.$c.bind("mousewheel DOMMouseScroll", r),
            this.$.bind("mousewheel DOMMouseScroll", r)
        }
        ,
        this.init = function() {
            (this.v < this.o.min || this.v > this.o.max) && (this.v = this.o.min),
            this.$.val(this.v),
            this.w2 = this.w / 2,
            this.cursorExt = this.o.cursor / 100,
            this.xy = this.w2 * this.scale,
            this.lineWidth = this.xy * this.o.thickness,
            this.lineCap = this.o.lineCap,
            this.radius = this.xy - this.lineWidth / 2,
            this.o.angleOffset && (this.o.angleOffset = isNaN(this.o.angleOffset) ? 0 : this.o.angleOffset),
            this.o.angleArc && (this.o.angleArc = isNaN(this.o.angleArc) ? this.PI2 : this.o.angleArc),
            this.angleOffset = this.o.angleOffset * Math.PI / 180,
            this.angleArc = this.o.angleArc * Math.PI / 180,
            this.startAngle = 1.5 * Math.PI + this.angleOffset,
            this.endAngle = 1.5 * Math.PI + this.angleOffset + this.angleArc;
            var t = s(String(Math.abs(this.o.max)).length, String(Math.abs(this.o.min)).length, 2) + 2;
            this.o.displayInput && this.i.css({
                width: (this.w / 2 + 4 >> 0) + "px",
                height: (this.w / 3 >> 0) + "px",
                position: "absolute",
                "vertical-align": "middle",
                "margin-top": (this.w / 3 >> 0) + "px",
                border: 0,
                background: "none",
                font: this.o.fontWeight + " " + (this.w / t >> 0) + "px " + this.o.font,
                "text-align": "center",
                color: this.o.inputColor || this.o.fgColor,
                padding: "0px",
                "-webkit-appearance": "none"
            }) && (this.o.rtl ? this.i.css({
                "margin-right": "-" + (3 * this.w / 4 + 2 >> 0) + "px"
            }) : this.i.css({
                "margin-left": "-" + (3 * this.w / 4 + 2 >> 0) + "px"
            })) || this.i.css({
                width: "0px",
                visibility: "hidden"
            })
        }
        ,
        this.change = function(t) {
            this.cv = t,
            this.$.val(this.o.format(t))
        }
        ,
        this.angle = function(t) {
            return (t - this.o.min) * this.angleArc / (this.o.max - this.o.min)
        }
        ,
        this.arc = function(t) {
            var i, s;
            return t = this.angle(t),
            this.o.flip ? (i = this.endAngle + 1e-5,
            s = i - t - 1e-5) : (i = this.startAngle - 1e-5,
            s = i + t + 1e-5),
            this.o.cursor && (i = s - this.cursorExt) && (s += this.cursorExt),
            {
                s: i,
                e: s,
                d: this.o.flip && !this.o.cursor
            }
        }
        ,
        this.draw = function() {
            var t, i = this.g, s = this.arc(this.cv), h = 1;
            i.lineWidth = this.lineWidth,
            i.lineCap = this.lineCap,
            "none" !== this.o.bgColor && (i.beginPath(),
            i.strokeStyle = this.o.bgColor,
            i.arc(this.xy, this.xy, this.radius, this.endAngle - 1e-5, this.startAngle + 1e-5, !0),
            i.stroke()),
            this.o.displayPrevious && (t = this.arc(this.v),
            i.beginPath(),
            i.strokeStyle = this.pColor,
            i.arc(this.xy, this.xy, this.radius, t.s, t.e, t.d),
            i.stroke(),
            h = this.cv == this.v),
            i.beginPath(),
            i.strokeStyle = h ? this.o.fgColor : this.fgColor,
            i.arc(this.xy, this.xy, this.radius, s.s, s.e, s.d),
            i.stroke()
        }
        ,
        this.cancel = function() {
            this.val(this.v)
        }
    }
    ,
    t.fn.dial = t.fn.knob = function(s) {
        return this.each(function() {
            var h = new i.Dial;
            h.o = s,
            h.$ = t(this),
            h.run()
        }).parent()
    }
});

function test() {
    console.log("FUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU");
}
