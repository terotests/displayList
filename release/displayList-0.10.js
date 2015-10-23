// The code template begins here
"use strict";

(function () {

  var __amdDefs__ = {};

  // The class definition is here...
  // let the private classes out

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var later_prototype = function later_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {
      var _initDone;
      var _callers;
      var _oneTimers;
      var _everies;
      var _framers;
      var _localCnt;
      var _easings;
      var _easeFns;

      // Initialize static variables here...

      /**
       * @param float t
       */
      _myTrait_._easeFns = function (t) {
        _easings = {
          bounceOut: function bounceOut(t) {
            if (t < 1 / 2.75) {
              return 7.5625 * t * t;
            } else if (t < 2 / 2.75) {
              return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
            } else if (t < 2.5 / 2.75) {
              return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
            } else {
              return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
            }
          },
          easeIn: function easeIn(t) {
            return t * t;
          },
          easeOut: function easeOut(t) {
            return -1 * t * (t - 2);
          },
          easeInOut: function easeInOut(t) {
            if (t < 0.5) return t * t;
            return -1 * t * (t - 2);
          },
          easeInCirc: function easeInCirc(t) {
            return -1 * (Math.sqrt(1 - t * t) - 1);
          },
          easeInCubic: function easeInCubic(t) {
            return t * t * t;
          },
          easeOutCubic: function easeOutCubic(t) {
            return (1 - t) * (1 - t) * (1 - t) + 1;
          },
          pow: function pow(t) {
            return Math.pow(t, parseFloat(1.5 - t));
          },
          linear: function linear(t) {
            return t;
          }
        };
      };

      /**
       * @param function fn
       * @param float thisObj
       * @param float args
       */
      _myTrait_.add = function (fn, thisObj, args) {
        if (thisObj || args) {
          var tArgs;
          if (Object.prototype.toString.call(args) === "[object Array]") {
            tArgs = args;
          } else {
            tArgs = Array.prototype.slice.call(arguments, 2);
            if (!tArgs) tArgs = [];
          }
          _callers.push([thisObj, fn, tArgs]);
        } else {
          _callers.push(fn);
        }
      };

      /**
       * @param float name
       * @param float fn
       */
      _myTrait_.addEasingFn = function (name, fn) {
        _easings[name] = fn;
      };

      /**
       * @param float seconds
       * @param float fn
       * @param float name
       */
      _myTrait_.after = function (seconds, fn, name) {

        if (!name) {
          name = "aft7491_" + _localCnt++;
        }

        _everies[name] = {
          step: Math.floor(seconds * 1000),
          fn: fn,
          nextTime: 0,
          remove: true
        };
      };

      /**
       * @param function fn
       */
      _myTrait_.asap = function (fn) {
        this.add(fn);
      };

      /**
       * @param String name  - Name of the easing to use
       * @param int delay  - Delay of the transformation in ms
       * @param function callback  - Callback to set the values
       * @param function over  - When animation is over
       */
      _myTrait_.ease = function (name, delay, callback, over) {

        var fn = _easings[name];
        if (!fn) fn = _easings.pow;
        var id_name = "e_" + _localCnt++;
        _easeFns[id_name] = {
          easeFn: fn,
          duration: delay,
          cb: callback,
          over: over
        };
      };

      /**
       * @param float seconds
       * @param float fn
       * @param float name
       */
      _myTrait_.every = function (seconds, fn, name) {

        if (!name) {
          name = "t7491_" + _localCnt++;
        }

        _everies[name] = {
          step: Math.floor(seconds * 1000),
          fn: fn,
          nextTime: 0
        };
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (interval, fn) {
        if (!_initDone) {
          this._easeFns();
          _localCnt = 1;
          this.polyfill();

          var frame, cancelFrame;
          if (typeof window != "undefined") {
            var frame = window["requestAnimationFrame"],
                cancelFrame = window["cancelRequestAnimationFrame"];
            ["", "ms", "moz", "webkit", "o"].forEach(function (x) {
              if (!frame) {
                frame = window[x + "RequestAnimationFrame"];
                cancelFrame = window[x + "CancelAnimationFrame"] || window[x + "CancelRequestAnimationFrame"];
              }
            });
          }

          if (!frame) frame = function (cb) {
            return setTimeout(cb, 16);
          };

          if (!cancelFrame) cancelFrame = function (id) {
            clearTimeout(id);
          };

          _callers = [];
          _oneTimers = {};
          _everies = {};
          _framers = [];
          _easeFns = {};
          var lastMs = 0;

          var _callQueQue = function _callQueQue() {
            var ms = new Date().getTime(),
                elapsed = lastMs - ms;

            if (lastMs == 0) elapsed = 0;
            var fn;
            while (fn = _callers.shift()) {
              if (Object.prototype.toString.call(fn) === "[object Array]") {
                fn[1].apply(fn[0], fn[2]);
              } else {
                fn();
              }
            }

            for (var i = 0; i < _framers.length; i++) {
              var fFn = _framers[i];
              fFn();
            }
            /*
            _easeFns.push({
            easeFn : fn,
            duration : delay,
            cb : callback
            });
               */
            for (var n in _easeFns) {
              if (_easeFns.hasOwnProperty(n)) {
                var v = _easeFns[n];
                if (!v.start) v.start = ms;
                var delta = ms - v.start,
                    dt = delta / v.duration;
                if (dt >= 1) {
                  dt = 1;
                  delete _easeFns[n];
                }
                v.cb(v.easeFn(dt));
                if (dt == 1 && v.over) v.over();
              }
            }

            for (var n in _oneTimers) {
              if (_oneTimers.hasOwnProperty(n)) {
                var v = _oneTimers[n];
                v[0](v[1]);
                delete _oneTimers[n];
              }
            }

            for (var n in _everies) {
              if (_everies.hasOwnProperty(n)) {
                var v = _everies[n];
                if (v.nextTime < ms) {
                  if (v.remove) {
                    if (v.nextTime > 0) {
                      v.fn();
                      delete _everies[n];
                    } else {
                      v.nextTime = ms + v.step;
                    }
                  } else {
                    v.fn();
                    v.nextTime = ms + v.step;
                  }
                }
                if (v.until) {
                  if (v.until < ms) {
                    delete _everies[n];
                  }
                }
              }
            }

            frame(_callQueQue);
            lastMs = ms;
          };
          _callQueQue();
          _initDone = true;
        }
      });

      /**
       * @param  key
       * @param float fn
       * @param float value
       */
      _myTrait_.once = function (key, fn, value) {
        // _oneTimers

        _oneTimers[key] = [fn, value];
      };

      /**
       * @param function fn
       */
      _myTrait_.onFrame = function (fn) {

        _framers.push(fn);
      };

      /**
       * @param float t
       */
      _myTrait_.polyfill = function (t) {};

      /**
       * @param float fn
       */
      _myTrait_.removeFrameFn = function (fn) {

        var i = _framers.indexOf(fn);
        if (i >= 0) {
          if (fn._onRemove) {
            fn._onRemove();
          }
          _framers.splice(i, 1);
          return true;
        } else {
          return false;
        }
      };
    })(this);
  };

  var later = function later(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof later) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != later._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new later(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  later._classInfo = {
    name: "later"
  };
  later.prototype = new later_prototype();

  (function () {
    if (typeof define !== "undefined" && define !== null && define.amd != null) {
      __amdDefs__["later"] = later;
      this.later = later;
    } else if (typeof module !== "undefined" && module !== null && module.exports != null) {
      module.exports["later"] = later;
    } else {
      this.later = later;
    }
  }).call(new Function("return this")());

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var Matrix3D_prototype = function Matrix3D_prototype() {
    // Then create the traits and subclasses for this class here...

    // trait comes here...

    (function (_myTrait_) {

      // Initialize static variables here...

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (t) {

        this._data = {
          m00: 1,
          m01: 0,
          m02: 0,
          m03: 0,
          m10: 0,
          m11: 1,
          m12: 0,
          m13: 0,
          m20: 0,
          m21: 0,
          m22: 1,
          m23: 0,
          m30: 0,
          m31: 0,
          m32: 0,
          m33: 1
        };
      });

      /**
       * @param float t
       */
      _myTrait_.m00 = function (t) {

        if (typeof t != "undefined") {
          if (this._data.m00 != t) this._dirty = true;
          this._data.m00 = t;
          return this;
        }
        return this._data.m00;
      };

      /**
       * @param float t
       */
      _myTrait_.m01 = function (t) {
        if (typeof t != "undefined") {
          if (this._data.m01 != t) this._dirty = true;
          this._data.m01 = t;
          return this;
        }
        return this._data.m01;
      };

      /**
       * @param float t
       */
      _myTrait_.m02 = function (t) {
        if (typeof t != "undefined") {
          if (this._data.m02 != t) this._dirty = true;
          this._data.m02 = t;
          return this;
        }
        return this._data.m02;
      };

      /**
       * @param float t
       */
      _myTrait_.m03 = function (t) {
        if (typeof t != "undefined") {
          if (this._data.m03 != t) this._dirty = true;
          this._data.m03 = t;
          return this;
        }
        return this._data.m03;
      };

      /**
       * @param float t
       */
      _myTrait_.m10 = function (t) {
        if (typeof t != "undefined") {
          if (this._data.m10 != t) this._dirty = true;
          this._data.m10 = t;
          return this;
        }
        return this._data.m10;
      };

      /**
       * @param float t
       */
      _myTrait_.m11 = function (t) {
        if (typeof t != "undefined") {
          if (this._data.m11 != t) this._dirty = true;
          this._data.m11 = t;
          return this;
        }
        return this._data.m11;
      };

      /**
       * @param float t
       */
      _myTrait_.m12 = function (t) {
        if (typeof t != "undefined") {
          if (this._data.m12 != t) this._dirty = true;
          this._data.m12 = t;
          return this;
        }
        return this._data.m12;
      };

      /**
       * @param float t
       */
      _myTrait_.m13 = function (t) {
        if (typeof t != "undefined") {
          if (this._data.m13 != t) this._dirty = true;
          this._data.m13 = t;
          return this;
        }
        return this._data.m13;
      };

      /**
       * @param float t
       */
      _myTrait_.m20 = function (t) {
        if (typeof t != "undefined") {
          if (this._data.m20 != t) this._dirty = true;
          this._data.m20 = t;
          return this;
        }
        return this._data.m20;
      };

      /**
       * @param float t
       */
      _myTrait_.m21 = function (t) {
        if (typeof t != "undefined") {
          if (this._data.m21 != t) this._dirty = true;
          this._data.m21 = t;
          return this;
        }
        return this._data.m21;
      };

      /**
       * @param float t
       */
      _myTrait_.m22 = function (t) {
        if (typeof t != "undefined") {
          if (this._data.m22 != t) this._dirty = true;
          this._data.m22 = t;
          return this;
        }
        return this._data.m22;
      };

      /**
       * @param float t
       */
      _myTrait_.m23 = function (t) {
        if (typeof t != "undefined") {
          if (this._data.m23 != t) this._dirty = true;
          this._data.m23 = t;
          return this;
        }
        return this._data.m23;
      };

      /**
       * @param float t
       */
      _myTrait_.m30 = function (t) {
        if (typeof t != "undefined") {
          if (this._data.m30 != t) this._dirty = true;
          this._data.m30 = t;
          return this;
        }
        return this._data.m30;
      };

      /**
       * @param float t
       */
      _myTrait_.m31 = function (t) {
        if (typeof t != "undefined") {
          if (this._data.m31 != t) this._dirty = true;
          this._data.m31 = t;
          return this;
        }
        return this._data.m31;
      };

      /**
       * @param float t
       */
      _myTrait_.m32 = function (t) {
        if (typeof t != "undefined") {
          if (this._data.m32 != t) this._dirty = true;
          this._data.m32 = t;
          return this;
        }
        return this._data.m32;
      };

      /**
       * @param float t
       */
      _myTrait_.m33 = function (t) {
        if (typeof t != "undefined") {
          if (this._data.m33 != t) this._dirty = true;
          this._data.m33 = t;
          return this;
        }
        return this._data.m33;
      };
    })(this);

    (function (_myTrait_) {
      var _initDone;
      var _m3dSupport;

      // Initialize static variables here...

      /**
       * @param float t
       */
      _myTrait_.blend = function (t) {

        if (this._scaleBlenders) {
          var t = this._scaleBlendFn();
          var m0 = this._scaleBlenders[0];
          var m1 = this._scaleBlenders[1];

          if (typeof t == "undefined") return;

          this.m00(m0.m00() * (1 - t) + m1.m00() * t);
          this.m11(m0.m11() * (1 - t) + m1.m11() * t);
          this.m22(m0.m22() * (1 - t) + m1.m22() * t);
        }
      };

      /**
       * @param float mList
       * @param float blendFn
       */
      _myTrait_.blendScale = function (mList, blendFn) {

        this._scaleBlenders = mList;
        this._scaleBlendFn = blendFn;
      };

      /**
       * @param float matrix
       */
      _myTrait_.copyFrom = function (matrix) {
        var mm = matrix._data;

        this._data.m00 = mm.m00;
        this._data.m01 = mm.m01;
        this._data.m02 = mm.m02;
        this._data.m03 = mm.m03;

        this._data.m10 = mm.m10;
        this._data.m11 = mm.m11;
        this._data.m12 = mm.m12;
        this._data.m13 = mm.m13;

        this._data.m20 = mm.m20;
        this._data.m21 = mm.m21;
        this._data.m22 = mm.m22;
        this._data.m23 = mm.m23;

        this._data.m30 = mm.m30;
        this._data.m31 = mm.m31;
        this._data.m32 = mm.m32;
        this._data.m33 = mm.m33;
      };

      /**
       * @param float t
       */
      _myTrait_.createCopy = function (t) {
        var newM = this.createIdentity();
        newM.updateFromParams(this.m00(), this.m01(), this.m02(), this.m03(), this.m10(), this.m11(), this.m12(), this.m13(), this.m20(), this.m21(), this.m22(), this.m23(), this.m30(), this.m31(), this.m32(), this.m33());

        return newM;
      };

      /**
       * @param float t
       */
      _myTrait_.createIdentity = function (t) {
        return Matrix3D();
      };

      /**
       * @param float t
       */
      _myTrait_.createThreeMatrix = function (t) {
        var m = new THREE.Matrix4();
        m.set(this.m00(), this.m10(), this.m20(), this.m30(), this.m01(), this.m11(), this.m21(), this.m31(), this.m02(), this.m12(), this.m22(), this.m32(), this.m03(), this.m13(), this.m23(), this.m33());
        return m;
      };

      /**
       * @param float t
       */
      _myTrait_.createTransformCopy = function (t) {

        var newM = Matrix3D();

        newM.m30(this.m30());
        newM.m31(this.m31());
        newM.m32(this.m32());

        return newM;
      };

      /**
       * @param float t
       */
      _myTrait_.det = function (t) {
        var m00 = this.m00(),
            m01 = this.m01(),
            m02 = this.m02(),
            m03 = this.m03(),
            m10 = this.m10(),
            m11 = this.m11(),
            m12 = this.m12(),
            m13 = this.m13(),
            m20 = this.m20(),
            m21 = this.m21(),
            m22 = this.m22(),
            m23 = this.m23(),
            m30 = this.m30(),
            m31 = this.m31(),
            m32 = this.m32(),
            m33 = this.m33();

        var a0 = m00 * m11 - m10 * m01;
        var a1 = m00 * m21 - m20 * m01;
        var a2 = m00 * m31 - m30 * m01;
        var a3 = m10 * m21 - m20 * m11;
        var a4 = m10 * m31 - m30 * m11;
        var a5 = m20 * m31 - m30 * m21;
        var b0 = m02 * m13 - m12 * m03;
        var b1 = m02 * m23 - m22 * m03;
        var b2 = m02 * m33 - m32 * m03;
        var b3 = m12 * m23 - m22 * m13;
        var b4 = m12 * m33 - m32 * m13;
        var b5 = m22 * m33 - m32 * m23;

        return a0 * b5 - a1 * b4 + a2 * b3 + a3 * b2 - a4 * b1 + a5 * b0;
      };

      /**
       * @param float t
       */
      _myTrait_.exactInverse = function (t) {

        var m00 = this.m00(),
            m01 = this.m01(),
            m02 = this.m02(),
            m03 = this.m03(),
            m10 = this.m10(),
            m11 = this.m11(),
            m12 = this.m12(),
            m13 = this.m13(),
            m20 = this.m20(),
            m21 = this.m21(),
            m22 = this.m22(),
            m23 = this.m23(),
            m30 = this.m30(),
            m31 = this.m31(),
            m32 = this.m32(),
            m33 = this.m33();

        var a0 = m00 * m11 - m10 * m01;
        var a1 = m00 * m21 - m20 * m01;
        var a2 = m00 * m31 - m30 * m01;
        var a3 = m10 * m21 - m20 * m11;
        var a4 = m10 * m31 - m30 * m11;
        var a5 = m20 * m31 - m30 * m21;
        var b0 = m02 * m13 - m12 * m03;
        var b1 = m02 * m23 - m22 * m03;
        var b2 = m02 * m33 - m32 * m03;
        var b3 = m12 * m23 - m22 * m13;
        var b4 = m12 * m33 - m32 * m13;
        var b5 = m22 * m33 - m32 * m23;

        var divider = a0 * b5 - a1 * b4 + a2 * b3 + a3 * b2 - a4 * b1 + a5 * b0;

        if (divider == 0) return;

        var invDet = 1 / divider;

        this.m00((m11 * b5 - m21 * b4 + m31 * b3) * invDet);
        this.m01((-m01 * b5 + m21 * b2 - m31 * b1) * invDet);
        this.m02((m01 * b4 - m11 * b2 + m31 * b0) * invDet);
        this.m03((-m01 * b3 + m11 * b1 - m21 * b0) * invDet);

        this.m10((-m10 * b5 + m20 * b4 - m30 * b3) * invDet);
        this.m11((m00 * b5 - m20 * b2 + m30 * b1) * invDet);
        this.m12((-m00 * b4 + m10 * b2 - m30 * b0) * invDet);
        this.m13((m00 * b3 - m10 * b1 + m20 * b0) * invDet);

        this.m20((m13 * a5 - m23 * a4 + m33 * a3) * invDet);
        this.m21((-m03 * a5 + m23 * a2 - m33 * a1) * invDet);
        this.m22((m03 * a4 - m13 * a2 + m33 * a0) * invDet);
        this.m23((-m03 * a3 + m13 * a1 - m23 * a0) * invDet);

        this.m30((-m12 * a5 + m22 * a4 - m32 * a3) * invDet);
        this.m31((m02 * a5 - m22 * a2 + m32 * a1) * invDet);
        this.m32((-m02 * a4 + m12 * a2 - m32 * a0) * invDet);
        this.m33((m02 * a3 - m12 * a1 + m22 * a0) * invDet);

        return this;
      };

      /**
       * @param float t
       */
      _myTrait_.getCSSMatrix3D = function (t) {

        _m3dSupport = this.systemHas3D();

        var nn = 5;

        if (_m3dSupport) {
          var tStr = "matrix3d(" + this.m00().toFixed(nn) + ", " + this.m01().toFixed(nn) + ", " + this.m02().toFixed(nn) + ", " + this.m03().toFixed(nn) + "," + this.m10().toFixed(nn) + ", " + this.m11().toFixed(nn) + ", " + this.m12().toFixed(nn) + ", " + this.m13().toFixed(nn) + "," + this.m20().toFixed(nn) + ", " + this.m21().toFixed(nn) + ", " + this.m22().toFixed(nn) + ", " + this.m23().toFixed(nn) + "," + this.m30().toFixed(nn) + ", " + this.m31().toFixed(nn) + ", " + this.m32().toFixed(nn) + ", " + this.m33().toFixed(nn) + ")";

          return tStr + ";-webkit-transform:" + tStr + ";-ms-transform:" + tStr + ";-webkit-transform-origin:0 0;-ms-transform-origin:0 0;";
        } else {
          var tStr = "matrix(" + this.m00().toFixed(nn) + ", " + this.m01().toFixed(nn) + ", " + this.m10().toFixed(nn) + ", " + this.m11().toFixed(nn) + ", " + this.m30().toFixed(nn) + ", " + this.m31().toFixed(nn) + ")";

          return tStr + ";-webkit-transform:" + tStr + ";-ms-transform:" + tStr + ";-webkit-transform-origin:0 0;-ms-transform-origin:0 0;";
        }

        /*
        var nn=10;
        var tStr =  "matrix3d("+this.m00().toFixed(nn)+", "+this.m01().toFixed(nn)+", "+this.m02().toFixed(nn)+", "+this.m03().toFixed(nn)+"," 
        +this.m10().toFixed(nn)+", "+this.m11().toFixed(nn)+", "+this.m12().toFixed(nn)+", "+this.m13().toFixed(nn)+","   
        +this.m20().toFixed(nn)+", "+this.m21().toFixed(nn)+", "+this.m22().toFixed(nn)+", "+this.m23().toFixed(nn)+","   
        +this.m30().toFixed(nn)+", "+this.m31().toFixed(nn)+", "+this.m32().toFixed(nn)+", "+this.m33().toFixed(nn)+")";
        return tStr+";-webkit-transform:"+tStr+";-webkit-transform-origin:0 0;";
        */
        // "", d, 0, 0, 0,    0, 1, 0, tx,   ty, 0, 1)";
      };

      /**
       * @param float t
       */
      _myTrait_.getRotation2D = function (t) {

        var i = this.m00(),
            j = this.m01(),
            r;

        if (j >= 0) {
          r = Math.acos(i);
        } else {
          r = -1 * Math.acos(i);
        }
        return r;
      };

      /**
       * @param float t
       */
      _myTrait_.getSVGTransform = function (t) {
        // matrix(<a> <b> <c> <d> <e> <f>)

        return "matrix(" + this.m00().toFixed(5) + "," + this.m01().toFixed(5) + "," + this.m10().toFixed(5) + "," + this.m11().toFixed(5) + "," + this.m30().toFixed(5) + "," + this.m31().toFixed(5) + ")";
      };

      /**
       * @param float startPoint
       * @param float endPoint
       * @param float origo
       */
      _myTrait_.intersectPlane = function (startPoint, endPoint, origo) {

        // project into plane normal vector
        /*
        var origoX = this.m30(),
        origoY = this.m31(),
        origoZ = this.m32();
        */

        var np = this.normalizeVector3D({
          x: this.m20(),
          y: this.m21(),
          z: this.m22()
        });

        var startToPlane = {
          x: this.m30() - startPoint.x,
          y: this.m31() - startPoint.y,
          z: this.m32() - startPoint.z
        };

        // normalized distance from the starting point
        var totalDist = startToPlane.x * np.x + startToPlane.y * np.y + startToPlane.z * np.z;

        var v = {
          x: endPoint.x - startPoint.x,
          y: endPoint.y - startPoint.y,
          z: endPoint.z - startPoint.z
        };

        var partialDist = v.x * np.x + v.y * np.y + v.z * np.z;

        if (Math.abs(totalDist) > 0 && Math.abs(partialDist) > 0) {

          var t = totalDist / partialDist;

          if (Math.abs(t) > 0) {

            var isect = {
              x: startPoint.x + v.x * t,
              y: startPoint.y + v.y * t,
              z: startPoint.z + v.z * t
            };

            return isect;
          }
        }
      };

      /**
       * @param float t
       */
      _myTrait_.inverse = function (t) {

        var m00 = this.m00(),
            m01 = this.m01(),
            m02 = this.m02(),
            m03 = this.m03(),
            m10 = this.m10(),
            m11 = this.m11(),
            m12 = this.m12(),
            m13 = this.m13(),
            m20 = this.m20(),
            m21 = this.m21(),
            m22 = this.m22(),
            m23 = this.m23(),
            m30 = this.m30(),
            m31 = this.m31(),
            m32 = this.m32(),
            m33 = this.m33();

        var a0 = m00 * m11 - m10 * m01;
        var a1 = m00 * m21 - m20 * m01;
        var a2 = m00 * m31 - m30 * m01;
        var a3 = m10 * m21 - m20 * m11;
        var a4 = m10 * m31 - m30 * m11;
        var a5 = m20 * m31 - m30 * m21;
        var b0 = m02 * m13 - m12 * m03;
        var b1 = m02 * m23 - m22 * m03;
        var b2 = m02 * m33 - m32 * m03;
        var b3 = m12 * m23 - m22 * m13;
        var b4 = m12 * m33 - m32 * m13;
        var b5 = m22 * m33 - m32 * m23;

        var divider = a0 * b5 - a1 * b4 + a2 * b3 + a3 * b2 - a4 * b1 + a5 * b0;

        if (divider == 0) return;

        var invDet = 1 / divider;

        this.m00((m11 * b5 - m21 * b4 + m31 * b3) * invDet);
        this.m01((-m01 * b5 + m21 * b2 - m31 * b1) * invDet);
        this.m02((m01 * b4 - m11 * b2 + m31 * b0) * invDet);
        this.m03((-m01 * b3 + m11 * b1 - m21 * b0) * invDet);

        this.m10((-m10 * b5 + m20 * b4 - m30 * b3) * invDet);
        this.m11((m00 * b5 - m20 * b2 + m30 * b1) * invDet);
        this.m12((-m00 * b4 + m10 * b2 - m30 * b0) * invDet);
        this.m13((m00 * b3 - m10 * b1 + m20 * b0) * invDet);

        this.m20((m13 * a5 - m23 * a4 + m33 * a3) * invDet);
        this.m21((-m03 * a5 + m23 * a2 - m33 * a1) * invDet);
        this.m22((m03 * a4 - m13 * a2 + m33 * a0) * invDet);
        this.m23((-m03 * a3 + m13 * a1 - m23 * a0) * invDet);

        this.m30((-m12 * a5 + m22 * a4 - m32 * a3) * invDet);
        this.m31((m02 * a5 - m22 * a2 + m32 * a1) * invDet);
        this.m32((-m02 * a4 + m12 * a2 - m32 * a0) * invDet);
        this.m33((m02 * a3 - m12 * a1 + m22 * a0) * invDet);

        return this;
      };

      /**
       * @param float
       */
      _myTrait_.isValidMatrix = function () {
        var mm = this._data;

        if (isNaN(mm.m00)) return false;
        if (isNaN(mm.m01)) return false;
        if (isNaN(mm.m02)) return false;
        if (isNaN(mm.m03)) return false;

        if (isNaN(mm.m10)) return false;
        if (isNaN(mm.m11)) return false;
        if (isNaN(mm.m12)) return false;
        if (isNaN(mm.m13)) return false;

        if (isNaN(mm.m20)) return false;
        if (isNaN(mm.m21)) return false;
        if (isNaN(mm.m22)) return false;
        if (isNaN(mm.m23)) return false;

        if (isNaN(mm.m30)) return false;
        if (isNaN(mm.m31)) return false;
        if (isNaN(mm.m32)) return false;
        if (isNaN(mm.m33)) return false;

        return true;
      };

      /**
       * @param float t
       */
      _myTrait_.log = function (t) {

        console.log(this._data);
      };

      /**
       * @param float other
       */
      _myTrait_.matMul = function (other) {
        var m00 = this.m00(),
            m01 = this.m01(),
            m02 = this.m02(),
            m03 = this.m03(),
            m10 = this.m10(),
            m11 = this.m11(),
            m12 = this.m12(),
            m13 = this.m13(),
            m20 = this.m20(),
            m21 = this.m21(),
            m22 = this.m22(),
            m23 = this.m23(),
            m30 = this.m30(),
            m31 = this.m31(),
            m32 = this.m32(),
            m33 = this.m33();

        var t00 = other.m00(),
            t01 = other.m01(),
            t02 = other.m02(),
            t03 = other.m03(),
            t10 = other.m10(),
            t11 = other.m11(),
            t12 = other.m12(),
            t13 = other.m13(),
            t20 = other.m20(),
            t21 = other.m21(),
            t22 = other.m22(),
            t23 = other.m23(),
            t30 = other.m30(),
            t31 = other.m31(),
            t32 = other.m32(),
            t33 = other.m33();

        this.updateFromParams(m00 * t00 + m10 * t01 + m20 * t02 + m30 * t03, m01 * t00 + m11 * t01 + m21 * t02 + m31 * t03, m02 * t00 + m12 * t01 + m22 * t02 + m32 * t03, m03 * t00 + m13 * t01 + m23 * t02 + m33 * t03, m00 * t10 + m10 * t11 + m20 * t12 + m30 * t13, m01 * t10 + m11 * t11 + m21 * t12 + m31 * t13, m02 * t10 + m12 * t11 + m22 * t12 + m32 * t13, m03 * t10 + m13 * t11 + m23 * t12 + m33 * t13, m00 * t20 + m10 * t21 + m20 * t22 + m30 * t23, m01 * t20 + m11 * t21 + m21 * t22 + m31 * t23, m02 * t20 + m12 * t21 + m22 * t22 + m32 * t23, m03 * t20 + m13 * t21 + m23 * t22 + m33 * t23, m00 * t30 + m10 * t31 + m20 * t32 + m30 * t33, m01 * t30 + m11 * t31 + m21 * t32 + m31 * t33, m02 * t30 + m12 * t31 + m22 * t32 + m32 * t33, m03 * t30 + m13 * t31 + m23 * t32 + m33 * t33);

        return this;
      };

      /**
       * @param float t
       */
      _myTrait_.normalize = function (t) {

        this.copyFrom(new Matrix3D());
      };

      /**
       * @param Object v
       */
      _myTrait_.normalizeVector3D = function (v) {

        var len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

        if (len == 0 || isNaN(len)) return {
          x: 1,
          y: 0,
          z: 0
        };

        return {
          x: v.x / len,
          y: v.y / len,
          z: v.z / len
        };
      };

      /**
       * @param float v
       */
      _myTrait_.projectVector = function (v) {
        var m00 = this.m00(),
            m01 = this.m01(),
            m02 = this.m02(),
            m03 = this.m03(),
            m10 = this.m10(),
            m11 = this.m11(),
            m12 = this.m12(),
            m13 = this.m13(),
            m20 = this.m20(),
            m21 = this.m21(),
            m22 = this.m22(),
            m23 = this.m23(),
            m30 = this.m30(),
            m31 = this.m31(),
            m32 = this.m32(),
            m33 = this.m33();

        return {
          x: m00 * v.x + m10 * v.y + m20 * v.z + m30 * v.w,
          y: m01 * v.x + m11 * v.y + m21 * v.z + m31 * v.w,
          z: m02 * v.x + m12 * v.y + m22 * v.z + m32 * v.w,
          w: m03 * v.x + m13 * v.y + m23 * v.z + m33 * v.w
        };
      };

      /**
       * @param Object axis
       * @param float radAngle
       */
      _myTrait_.rotate = function (axis, radAngle) {

        var axis = this.normalizeVector3D(axis);
        var ax = axis.x,
            ay = axis.y,
            az = axis.z;

        var cosA = Math.cos(radAngle);
        var sinA = Math.sin(radAngle);

        this.updateFromParams(cosA + ax * ax * (1 - cosA), ay * ax * (1 - cosA) + az * sinA, az * ax * (1 - cosA) - ay * sinA, 0, ay * ax * (1 - cosA) - az * sinA, cosA + ay * ay * (1 - cosA), az * ay * (1 - cosA) + ax * sinA, 0, az * ax * (1 - cosA) + ay * sinA, ay * az * (1 - cosA) - ax * sinA, cosA + az * az * (1 - cosA), 0, 0, 0, 0, 1);

        if (radAngle == 0) {
          console.log("*** angle is zero****");
          console.log(this._data);
        }

        /*
        def rotate(axis: Vec3, angle: Float) = {
        import axis.{x => ax, y => ay, z => az}
        val cosA = math.cos(angle).toFloat
        val sinA = math.sin(angle).toFloat
        new Mat4(
        cosA + ax * ax * (1 - cosA), ay * ax * (1 - cosA) + az * sinA, az * ax * (1 - cosA) - ay * sinA, 0,
        ay * ax * (1 - cosA) - az * sinA, cosA + ay * ay * (1 - cosA), az * ay * (1 - cosA) + ax * sinA, 0,
        az * ax * (1 - cosA) + ay * sinA, ay * az * (1 - cosA) - ax * sinA, cosA + az * az * (1 - cosA), 0,
        0, 0, 0, 1
        )
        }
        }
        */
      };

      /**
       * @param float s
       */
      _myTrait_.scale = function (s) {

        this.updateFromParams(s, 0, 0, 0, 0, s, 0, 0, 0, 0, s, 0, 0, 0, 0, 1);

        return this;
      };

      /**
       * @param float worldVector
       * @param float camera
       */
      _myTrait_.screenProjection = function (worldVector, camera) {

        var vector = this.projectVector(worldVector);

        // if perspective projection
        if (camera.d) {
          //console.log("--- wrld and scr vects");
          //console.log(worldVector);
          //console.log(vector);
          //console.log(camera);
          var dist = camera.d - vector.z,
              x = vector.x - (camera.cx || 500),
              y = vector.y - (camera.cy || 500);
          if (dist > 0) {
            // console.log("Scale factor ", camera.d / dist);
            return {
              x: camera.cx + x * camera.d / dist,
              y: camera.cy + y * camera.d / dist
            };
          }
        } else {
          x = vector.x; // - (camera.cx || 500),
          y = vector.y; // - (camera.cy || 500);   

          return {
            x: x,
            y: y
          };
        }
      };

      /**
       * @param float ctx
       */
      _myTrait_.setDomContext = function (ctx) {

        // projection maybe could be better...
        ctx.setTransform(this.m00(), this.m01(), this.m10(), this.m11(), this.m30(), this.m31());
      };

      /**
       * @param float t
       */
      _myTrait_.systemHas3D = function (t) {

        if (typeof _m3dSupport != "undefined") return _m3dSupport;

        if (typeof window == "undefined") return false;

        if (!window.getComputedStyle) {
          return false;
        }

        var el = document.createElement("p"),
            has3d,
            transforms = {
          "webkitTransform": "-webkit-transform",
          "OTransform": "-o-transform",
          "msTransform": "-ms-transform",
          "MozTransform": "-moz-transform",
          "transform": "transform"
        };

        // Add it to the body to get the computed style.
        document.body.insertBefore(el, null);

        for (var t in transforms) {
          if (el.style[t] !== undefined) {
            el.style[t] = "translate3d(1px,1px,1px)";
            has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
          }
        }

        document.body.removeChild(el);

        return has3d !== undefined && has3d.length > 0 && has3d !== "none";
      };

      /**
       * @param Object v
       */
      _myTrait_.translate = function (v) {
        this.updateFromParams(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, v.x, v.y, v.z, 1);
      };

      /**
       * @param float t
       */
      _myTrait_.updateFromParams = function (t) {

        var d = this._data;
        var i = 0;

        d.m00 = arguments[i++];
        d.m01 = arguments[i++];
        d.m02 = arguments[i++];
        d.m03 = arguments[i++];

        d.m10 = arguments[i++];
        d.m11 = arguments[i++];
        d.m12 = arguments[i++];
        d.m13 = arguments[i++];

        d.m20 = arguments[i++];
        d.m21 = arguments[i++];
        d.m22 = arguments[i++];
        d.m23 = arguments[i++];

        d.m30 = arguments[i++];
        d.m31 = arguments[i++];
        d.m32 = arguments[i++];
        d.m33 = arguments[i++];
      };
    })(this);
  };

  var Matrix3D = function Matrix3D(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof Matrix3D) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != Matrix3D._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new Matrix3D(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  Matrix3D._classInfo = {
    name: "Matrix3D"
  };
  Matrix3D.prototype = new Matrix3D_prototype();

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var drawLine_prototype = function drawLine_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param float t
       */
      _myTrait_.adjustDivSize = function (t) {

        var d = this.myDiv;
        var len = this.length();

        d._dom.style.width = len + "px";
        d._dom.style.height = (this.options.weight || this.weight || 3) + "px";
      };

      /**
       * @param float t
       */
      _myTrait_.adjustStyleProps = function (t) {

        // this.myDiv

        var vLen = this.length();

        if (!(vLen > 0)) return;

        var dx = this.ex - this.sx,
            dy = -1 * (this.ey - this.sy);

        var cosA = dx / vLen,
            sinA = dy / vLen;

        var tx = this.sx,
            ty = this.sy;

        var mat = cosA.toFixed(5) + "," + (-1 * sinA).toFixed(5) + ",";
        mat += sinA.toFixed(5) + "," + cosA.toFixed(5) + "," + tx.toFixed(5) + "," + ty.toFixed(5);

        var matStr = "transform-origin:0 0;-webkit-transform-origin:0 0; -ms-transform-origin: 0 0;-ms-transform: matrix(" + mat + "); ";
        matStr += "-webkit-transform: matrix(" + mat + "); "; /* Chrome, Safari, Opera */
        matStr += "transform: matrix(" + mat + ");";

        var bgColor = this.options.bgColor || "blue";

        var styleStr = matStr + ";background-color:" + bgColor + ";height:" + this.weight + "px;position:absolute;left:0px;top:0px;width:" + vLen + "px;";

        this.myDiv.attr({
          style: styleStr
        });
      };

      /**
       * @param float v
       */
      _myTrait_.attr = function (v) {
        return this.myDiv.attr(v);
      };

      /**
       * @param float t
       */
      _myTrait_.getElem = function (t) {

        return this.myDiv;
      };

      /**
       * @param float t
       */
      _myTrait_.hide = function (t) {
        this.myDiv.hide();
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (sx, sy, ex, ey, options) {

        this.sx = sx;
        this.sy = sy;
        this.ex = ex;
        this.ey = ey;

        var myDiv = _e("div");

        myDiv.absolute().x(0).y(0);

        this.myDiv = myDiv;

        this.options = options || {};
        this.weight = options.weight || 3;

        this.adjustDivSize();
        this.adjustStyleProps();
      });

      /**
       * @param float t
       */
      _myTrait_.length = function (t) {

        var dx = this.ex - this.sx,
            dy = this.ey - this.sy;

        return Math.sqrt(dx * dx + dy * dy);
      };

      /**
       * @param float sx
       * @param float sy
       * @param float ex
       * @param float ey
       */
      _myTrait_.moveTo = function (sx, sy, ex, ey) {
        this.sx = sx;
        this.sy = sy;
        this.ex = ex;
        this.ey = ey;

        this.adjustDivSize();
        this.adjustStyleProps();
      };

      /**
       * @param float t
       */
      _myTrait_.show = function (t) {

        this.myDiv.show();
      };
    })(this);
  };

  var drawLine = function drawLine(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof drawLine) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != drawLine._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new drawLine(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  drawLine._classInfo = {
    name: "drawLine"
  };
  drawLine.prototype = new drawLine_prototype();

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var surface_prototype = function surface_prototype() {
    // Then create the traits and subclasses for this class here...

    // trait comes here...

    (function (_myTrait_) {
      var _eventOn;
      var _commands;

      // Initialize static variables here...

      /**
       * @param float t
       */
      _myTrait_.guid = function (t) {

        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        //return Math.random();
        // return Math.random().toString(36);

        /*    
        return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
        */
        /*        
        function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();*/
      };

      /**
       * @param float t
       */
      _myTrait_.isArray = function (t) {

        if (typeof t == "undefined") return this.__isA;

        return Object.prototype.toString.call(t) === "[object Array]";
      };

      /**
       * @param float fn
       */
      _myTrait_.isFunction = function (fn) {
        return Object.prototype.toString.call(fn) == "[object Function]";
      };

      /**
       * @param float t
       */
      _myTrait_.isObject = function (t) {

        if (typeof t == "undefined") return this.__isO;

        return t === Object(t);
      };
    })(this);

    (function (_myTrait_) {
      var _renderFns;
      var _sfaceCnt;

      // Initialize static variables here...

      /**
       * @param float t
       */
      _myTrait_.frameClear = function (t) {};

      /**
       * @param float t
       */
      _myTrait_.getDom = function (t) {
        return this._dom;
      };

      /**
       * @param float t
       */
      _myTrait_.getHeight = function (t) {
        return this._height;
      };

      /**
       * @param float t
       */
      _myTrait_.getWidth = function (t) {
        return this._width;
      };

      /**
       * @param float t
       */
      _myTrait_.guid = function (t) {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      };

      /**
       * @param float t
       */
      _myTrait_.id = function (t) {

        if (!this._id) {
          this._id = "sface" + this.guid();
        }
        return this._id;
      };

      /**
       * @param string className
       * @param float initFn
       * @param float refreshFn
       * @param float removeFn
       */
      _myTrait_.registerRenderer = function (className, initFn, refreshFn, removeFn) {

        if (this.isObject(initFn) && !this.isFunction(initFn)) {
          this._renderFns[className] = initFn;
          return;
        }

        this._renderFns[className] = {
          start: initFn,
          refresh: refreshFn,
          end: removeFn
        };
      };

      /**
       * @param float obj
       * @param float display
       */
      _myTrait_.removeObject = function (obj, display) {
        var rt = obj.renderClass();

        var _renderFns = this._renderFns;

        if (_renderFns[rt]) {

          var fnData = _renderFns[rt];
          obj.setRenderScope(this.id());
          var rendData = obj.getRenderData(this.id());

          fnData.end(obj, display, rendData);
          rendData.state = 3;

          obj.setRenderScope(null);

          obj.removeFromDisplay(display.id(), display);
        }
      };

      /**
       * @param float obj
       * @param float display
       */
      _myTrait_.render = function (obj, display) {

        var rt = obj.renderClass();

        var _renderFns = this._renderFns;

        if (_renderFns[rt]) {
          var fnData = _renderFns[rt];

          obj.setRenderScope(this.id());

          var rendData = obj.getRenderData(this.id());

          if (typeof rendData.state == "undefined") rendData.state = 1;

          if (obj.askToRemove(this.id())) {

            fnData.end(obj, display, rendData);
            rendData.state = 3;
            obj.askToRemove(this.id(), false);
          }

          if (rendData.state == 1) {
            if (obj && obj._model && obj._model.isFulfilled()) {
              fnData.start(obj, display, rendData);
              obj.projectToCamera(display.getCamera());
              fnData.refresh(obj, display, rendData);
            }
          }

          if (rendData.state == 2) {
            obj.projectToCamera(display.getCamera());
            fnData.refresh(obj, display, rendData);
          }

          obj.setRenderScope(null);
        }
      };

      /**
       * @param float obj
       * @param float display
       * @param float fromClass
       */
      _myTrait_.restartObject = function (obj, display, fromClass) {

        // The object may have old render class...
        var rt = fromClass || obj.renderClass();
        var _renderFns = this._renderFns;

        if (_renderFns[rt]) {

          var fnData = _renderFns[rt];
          obj.setRenderScope(this.id());
          var rendData = obj.getRenderData(this.id());

          var useG;
          if (rendData.viewG) {
            useG = rendData.viewG;
          }
          fnData.end(obj, display, rendData);
          rendData.state = 1;
          //fnData.start( obj, display, rendData, useG );
          //fnData.refresh( obj, display, rendData, useG );
          obj.setRenderScope(null);
        }
      };

      /**
       * @param float forClass
       */
      _myTrait_.standardHandleRenderers = function (forClass) {
        this.registerRenderer(forClass, function (obj, display, data) {

          if (!obj.areHandlesVisible()) {
            return;
          }

          var camera = display.getCamera(),
              main = _e(display.getSurface().getDom());

          if (!data.rightBottom) {

            var rotPath = "M24.249,15.499c-0.009,4.832-3.918,8.741-8.75,8.75c-2.515,0-4.768-1.064-6.365-2.763l2.068-1.442l-7.901-3.703l0.744,8.694l2.193-1.529c2.244,2.594,5.562,4.242,9.26,4.242c6.767,0,12.249-5.482,12.249-12.249H24.249zM15.499,6.75c2.516,0,4.769,1.065,6.367,2.764l-2.068,1.443l7.901,3.701l-0.746-8.693l-2.192,1.529c-2.245-2.594-5.562-4.245-9.262-4.245C8.734,3.25,3.25,8.734,3.249,15.499H6.75C6.758,10.668,10.668,6.758,15.499,6.75z";
            var icon = drawIconbox(50, 50, 30, rotPath);

            data.rotIcon = icon;

            data.topBar = main.div("handle");
            data.leftBar = main.div("handle");
            // data.rightBar = main.div("handle");
            data.bottomBar = main.div("handle");
            data.rightBottom = main.div("handle");
            data.rightMiddle = main.div("handle");
            data.bottomMiddle = main.div("handle");
            data.rightTop = main.div("handle");
            data.rotCenter = main.div("handle");

            data.rightBar = drawLine(100, 100, 500, 100, {
              bgColor: "red",
              weight: 4
            });
            main.add(data.rightBar.getElem());
            data.rightBar.getElem().addClass("handle");

            // obj.rotatableFor( data.rightTop );
            obj.rotatableFor(data.rotIcon, display);

            obj.resizeableWidthFor(data.rightMiddle);
            obj.resizeableWidthFor(data.rightBar.getElem());
            obj.resizeableHeightFor(data.bottomMiddle);
            obj.resizeableHeightFor(data.bottomBar);
            obj.resizeableFor(data.rightBottom);
            obj.handleRotationCenter(data.rotCenter);

            data.crossLine = drawLine(100, 100, 500, 100, {
              bgColor: "red",
              weight: 10
            });
            main.add(data.crossLine.getElem());
            obj.rotatableFor(data.crossLine.getElem(), display);

            main.add(icon.getElem());

            icon.getElem().addClass("glow");

            if (obj.parent()) {
              var itemList = obj.parent();
              itemList.on("remove", function () {
                if (itemList._removedItem == obj) {
                  data.rotCenter.hide();

                  data.topBar.hide();
                  data.leftBar.hide();
                  data.rightBar.hide();
                  data.bottomBar.hide();

                  data.rightBottom.hide();
                  data.rightMiddle.hide();
                  data.bottomMiddle.hide();
                  data.rightTop.hide();
                  data.crossLine.hide();

                  data.rotIcon.hide();
                }
              });
            }
          }
        }, function (obj, display, data) {

          if (obj.areHandlesVisible()) {

            if (!data._handlesSet) {
              data.rotCenter.show();

              data.topBar.show();
              data.leftBar.show();
              data.rightBar.show();
              data.bottomBar.show();

              data.rightBottom.show();
              data.rightMiddle.show();
              data.bottomMiddle.show();
              data.rightTop.show();
              data.crossLine.show();

              data.rotIcon.show();
            }

            data._handlesSet = true;
          } else {
            if (data._handlesSet) {
              data.rotCenter.hide();

              data.topBar.hide();
              data.leftBar.hide();
              data.rightBar.hide();
              data.bottomBar.hide();

              data.rightBottom.hide();
              data.rightMiddle.hide();
              data.bottomMiddle.hide();
              data.rightTop.hide();
              data.crossLine.hide();

              data.rotIcon.hide();
            }
            data._handlesSet = false;
            return;
          }

          // console.log("***** Refreshing the surface 4 ");
          var camera = display.getCamera(),
              surface = display.getSurface(),
              main = _e(display.getSurface().getDom()),
              perspective = 1000;

          var docWidth = surface.getWidth(),
              docHeight = surface.getHeight();

          data.rightBottom.show();
          data.rightTop.show();
          var rendM = obj.getRenderMatrix().createCopy();
          var move = Matrix3D();
          var a = rendM.m00();
          b = rendM.m10();
          var xScale = Math.sqrt(a * a + b * b);
          if (xScale === 0) return;

          // data.crossLine
          data.crossLine.show();
          rendM = obj.getRenderMatrix().createCopy();
          var start = rendM.projectVector({
            x: obj.w() / 2,
            y: 0,
            z: 0,
            w: 1
          }),
              end = rendM.projectVector({
            x: obj.w() / 2,
            y: obj.h() * -0.3,
            z: 0,
            w: 1
          });

          // data.crossLine.moveTo(start.x,start.y, end.x, end.y);

          rendM = obj.getRenderMatrix().createCopy();

          var rightTop = rendM.screenProjection({
            x: obj.w(),
            y: 0,
            z: 0,
            w: 1
          }, {
            d: perspective,
            cx: docWidth / 2,
            cy: docHeight / 2
          });
          var rightBottom = rendM.screenProjection({
            x: obj.w(),
            y: obj.h(),
            z: 0,
            w: 1
          }, {
            d: perspective,
            cx: docWidth / 2,
            cy: docHeight / 2
          });
          var startV = rendM.screenProjection({
            x: obj.w() / 2,
            y: 0,
            z: 0,
            w: 1
          }, {
            d: perspective,
            cx: docWidth / 2,
            cy: docHeight / 2
          });
          var endV = rendM.screenProjection({
            x: obj.w() / 2,
            y: obj.h() * -0.3,
            z: 0,
            w: 1
          }, {
            d: perspective,
            cx: docWidth / 2,
            cy: docHeight / 2
          });
          data.crossLine.moveTo(startV.x, startV.y, endV.x, endV.y);

          var handleSize = 20 * (1 / xScale);
          move.translate({
            x: obj.w(),
            y: obj.h(),
            z: 0
          });
          rendM.matMul(move);
          data.rightBottom.attr({
            "style": "transform-origin: 0 0;width:" + handleSize + "px;height:" + handleSize + "px;transform:" + rendM.getCSSMatrix3D()
          });

          // new icon rend.
          rendM = obj.getRenderMatrix().createCopy();
          move = Matrix3D();
          move.translate({
            x: obj.w(),
            y: 0,
            z: 0
          });
          rendM.matMul(move);
          data.rotIcon.moveTo(rendM.m30(), rendM.m31());

          rendM = obj.getRenderMatrix().createCopy();
          var sv = rendM.screenProjection({
            x: obj.w(),
            y: 0,
            z: 0,
            w: 1
          }, {
            d: perspective,
            cx: docWidth / 2,
            cy: docHeight / 2
          });
          data.rotIcon.moveTo(sv.x, sv.y, 30);

          rendM = obj.getRenderMatrix().createCopy();
          move = Matrix3D();
          move.translate({
            x: obj.w(),
            y: obj.h() / 2 - handleSize * 0.5,
            z: 0
          });
          rendM.matMul(move);
          data.rightMiddle.attr({
            "style": "transform-origin: 0 0;width:" + handleSize + "px;height:" + handleSize + "px;transform:" + rendM.getCSSMatrix3D()
          });

          rendM = obj.getRenderMatrix().createCopy();
          move = Matrix3D();
          move.translate({
            x: obj.w() * obj.ri() - handleSize * 0.5,
            y: obj.h() * obj.rj() - handleSize * 0.5,
            z: 0
          });
          rendM.matMul(move);
          data.rotCenter.attr({
            "style": "border-radius:30px;background-color:red;transform-origin: 0 0;width:" + handleSize + "px;height:" + handleSize + "px;transform:" + rendM.getCSSMatrix3D()
          });

          rendM = obj.getRenderMatrix().createCopy();
          move = Matrix3D();
          move.translate({
            x: obj.w() / 2 - handleSize * 0.5,
            y: obj.h(),
            z: 0
          });
          rendM.matMul(move);
          data.bottomMiddle.attr({
            "style": "transform-origin: 0 0;width:" + handleSize + "px;height:" + handleSize + "px;transform:" + rendM.getCSSMatrix3D()
          });

          rendM = obj.getRenderMatrix().createCopy();
          data.topBar.attr({
            "style": "background:none;border-color:red;border-width:4px; border-style:solid; transform-origin: 0 0;width:" + obj.w() + "px;height:" + handleSize * 0.2 + "px;transform:" + rendM.getCSSMatrix3D()
          });

          rendM = obj.getRenderMatrix().createCopy();
          data.leftBar.attr({
            "style": "background:none;border-color:red;border-width:4px; border-style:solid; transform-origin: 0 0;width:" + handleSize * 0.2 + "px;height:" + obj.h() + "px;transform:" + rendM.getCSSMatrix3D()
          });

          rendM = obj.getRenderMatrix().createCopy();
          move = Matrix3D();
          move.translate({
            x: 0,
            y: obj.h(),
            z: 0
          });
          rendM.matMul(move);
          data.bottomBar.attr({
            "style": "background:none;border-color:red;border-width:4px; border-style:solid; transform-origin: 0 0;width:" + obj.w() + "px;height:" + handleSize * 0.2 + "px;transform:" + rendM.getCSSMatrix3D()
          });

          data.rightBar.moveTo(rightTop.x, rightTop.y, rightBottom.x, rightBottom.y);
        }, function (obj, display, data) {

          var camera = display.getCamera(),
              main = _e(display.getSurface().getDom());

          if (data.rightBottom) {
            data.rotCenter.hide();

            data.topBar.hide();
            data.leftBar.hide();
            data.rightBar.hide();
            data.bottomBar.hide();

            data.rightBottom.hide();
            data.rightMiddle.hide();
            data.bottomMiddle.hide();
            data.rightTop.hide();
            data.crossLine.hide();

            data.rotIcon.hide();
          }
        });
      };

      /**
       * @param float obj
       * @param float display
       * @param float nothing
       */
      _myTrait_.startObject = function (obj, display, nothing) {
        var rt = obj.renderClass();

        var _renderFns = this._renderFns;

        if (_renderFns[rt]) {
          var fnData = _renderFns[rt];

          obj.setRenderScope(this.id());
          var rendData = obj.getRenderData(this.id());
          rendData.state = 1;

          obj.setRenderScope(null);
        }
      };

      /**
       * @param float forClass
       */
      _myTrait_.svgGroupHandles = function (forClass) {
        /*sface5.registerRenderer( "pathpoint", function(obj, display, data) {
         var surface = display.getSurface();
        if(!data.viewObj) {
            var svg = surface.getSvg();
            var icon = svg.circle();
            icon.attr({
                "fill" : "cyan",
                cx : 0,
                cy : 0,
                r : 56
            })
             data.viewObj = icon;
            obj.draggableFor( data.viewObj, display );
        }
        }, 
        function(obj, display, data) {
        
        var p = obj.parent().parent();
        if(!p.areHandlesVisible() && !obj.areHandlesVisible()) {
            data.viewObj.attr({
                r: 0
            });
            return;
        } else {
         }
        
        var surface = display.getSurface();
        var bgStyle = "";
        var rendM = obj.getRenderMatrix().createCopy();
        var move = Matrix3D();
        var a = rendM.m00();
            b = rendM.m10();
        var xScale = Math.sqrt( a*a + b*b );        
        
        var aList = {
            transform : obj.getRenderMatrix().getSVGTransform()
        };
        aList["r"] = 6*(1/xScale);
          data.viewObj.attr(aList); 
         
        }, function(obj, display, data) {
        data.viewObj.remove();
        });  
        */
        this.registerRenderer(forClass, function (obj, display, data) {

          var surface = display.getSurface();
          if (!data.rotIcon) {
            var svg = surface.getSvg();

            var lineAttr = {
              "stroke": "blue",
              "stroke-width": 2
            };
            var handleAttr = {
              "fill": "blue",
              cx: 0,
              cy: 0,
              cursor: "pointer",
              "class": "svghandle",
              r: 56
            };
            // "stroke-dasharray":"2,2"
            data.rotLine = svg.line("handle", lineAttr);

            data.rotIcon = svg.circle("", handleAttr);

            obj.groupRotationHandler(data.rotIcon, display);

            data.topLine = svg.line("", lineAttr);
            data.rightLine = svg.line("", lineAttr);
            data.bottomLine = svg.line("", lineAttr);
            data.leftLine = svg.line("", lineAttr);

            obj.resizeableHeightFor(data.bottomLine);

            var resizeIcon = svg.circle();
            resizeIcon.attr({
              "fill": "blue",
              cx: 0,
              cy: 0,
              cursor: "pointer",
              r: 56
            });
            data.resizeIcon = resizeIcon;
            obj.groupResizeHandler(data.resizeIcon, display);

            var resizeIconRt = svg.circle();
            resizeIconRt.attr({
              "fill": "blue",
              cx: 0,
              cy: 0,
              cursor: "pointer",
              r: 56
            });
            data.resizeIconRt = resizeIconRt;
            obj.groupResizeHandler(data.resizeIconRt, display, {
              i: 0,
              j: 1
            });

            var resizeIconLt = svg.circle();
            resizeIconLt.attr({
              "fill": "blue",
              cx: 0,
              cy: 0,
              cursor: "pointer",
              r: 56
            });
            data.resizeIconLt = resizeIconLt;
            obj.groupResizeHandler(data.resizeIconLt, display, {
              i: 1,
              j: 1
            });

            var resizeIconLb = svg.circle();
            resizeIconLb.attr({
              "fill": "blue",
              cx: 0,
              cy: 0,
              cursor: "pointer",
              r: 56
            });
            data.resizeIconLb = resizeIconLb;
            obj.groupResizeHandler(data.resizeIconLb, display, {
              i: 1,
              j: 0
            });

            data.resizeBottom = svg.circle("", handleAttr);
            obj.resizeableHeightFor(data.resizeBottom, display);

            data.resizeLeft = svg.circle("", handleAttr);
            obj.resizeableWidthFor(data.resizeLeft, display, {
              inverse: true
            });

            data.resizeRight = svg.circle("", handleAttr);
            obj.resizeableWidthFor(data.resizeRight, display);
            if (obj.parent()) {
              var itemList = obj.parent();
              itemList.on("remove", function () {
                if (itemList._removedItem == obj) {
                  data.rotIcon.remove();
                  data.rotLine.remove();
                  data.resizeIcon.remove();
                  data.topLine.remove();
                  data.rightLine.remove();
                  data.bottomLine.remove();
                  data.leftLine.remove();
                  data.resizeBottom.remove();
                  data.resizeLeft.remove();
                  data.resizeRight.remove();
                  data.resizeIconRt.remove();
                  data.resizeIconLt.remove();
                  data.resizeIconLb.remove();
                }
              });
            }
          }
        }, function (obj, display, data) {

          if (true) {

            if (!data._handlesSet) {
              data.rotIcon.show();
              data.rotLine.show();
              data.topLine.show();
              data.rightLine.show();
              data.bottomLine.show();
              data.leftLine.show();
              data.resizeIcon.show();
              data.resizeBottom.show();
              data.resizeLeft.show();
              data.resizeRight.show();
              data.resizeIconRt.show();
              data.resizeIconLt.show();
              data.resizeIconLb.show();
            }

            data._handlesSet = true;
          } else {
            if (data._handlesSet) {
              data.rotIcon.hide();
              data.rotLine.hide();
              data.resizeIcon.hide();
              data.topLine.hide();
              data.rightLine.hide();
              data.bottomLine.hide();
              data.leftLine.hide();
              data.resizeBottom.hide();
              data.resizeLeft.hide();
              data.resizeRight.hide();
              data.resizeIconRt.hide();
              data.resizeIconLt.hide();
              data.resizeIconLb.hide();
            }
            data._handlesSet = false;
            return;
          }

          // console.log("***** Refreshing the surface 4 ");
          var camera = display.getCamera(),
              surface = display.getSurface(),
              main = _e(display.getSurface().getDom()),
              perspective = 1000;

          var docWidth = surface.getWidth(),
              docHeight = surface.getHeight();

          // OK, then...
          var rendM = obj.getViewMatrix(display.getCamera()).createCopy();
          var move = Matrix3D();
          var a = rendM.m00();
          b = rendM.m10();
          var xScale = Math.sqrt(a * a + b * b);
          if (xScale === 0) return;

          rendM = obj.getViewMatrix(display.getCamera()).createCopy();
          var getPoint = function getPoint(x, y) {
            return rendM.screenProjection({
              x: x,
              y: y,
              z: 0,
              w: 1
            }, {
              d: perspective,
              cx: docWidth / 2,
              cy: docHeight / 2
            });
          };

          var rightTopMiddle = getPoint(obj.w() / 2, 0),
              rightTopMiddleUp = getPoint(obj.w() / 2, -20 / xScale),
              leftTop = getPoint(0, 0),
              rightTop = getPoint(obj.w(), 0),
              rightBottom = getPoint(obj.w(), obj.h()),
              leftBottom = getPoint(0, obj.h()),
              bottomMiddle = getPoint(obj.w() / 2, obj.h()),
              rightMiddle = getPoint(obj.w(), obj.h() / 2),
              leftMiddle = getPoint(0, obj.h() / 2);

          data.rotIcon.attr({
            r: 6,
            cx: rightTopMiddleUp.x,
            cy: rightTopMiddleUp.y
          });
          data.resizeIcon.attr({
            r: 6,
            cx: rightBottom.x,
            cy: rightBottom.y
          });
          data.resizeIconRt.attr({
            r: 6,
            cx: rightTop.x,
            cy: rightTop.y
          });
          data.resizeIconLt.attr({
            r: 6,
            cx: leftTop.x,
            cy: leftTop.y
          });
          data.resizeIconLb.attr({
            r: 6,
            cx: leftBottom.x,
            cy: leftBottom.y
          });
          data.resizeBottom.attr({
            r: 6,
            cx: bottomMiddle.x,
            cy: bottomMiddle.y
          });
          data.resizeLeft.attr({
            r: 6,
            cx: leftMiddle.x,
            cy: leftMiddle.y
          });
          data.resizeRight.attr({
            r: 6,
            cx: rightMiddle.x,
            cy: rightMiddle.y
          });
          data.rotLine.attr({
            x1: rightTopMiddle.x,
            y1: rightTopMiddle.y,
            x2: rightTopMiddleUp.x,
            y2: rightTopMiddleUp.y
          });

          data.topLine.attr({
            x1: leftTop.x,
            y1: leftTop.y,
            x2: rightTop.x,
            y2: rightTop.y
          });
          data.rightLine.attr({
            x1: rightTop.x,
            y1: rightTop.y,
            x2: rightBottom.x,
            y2: rightBottom.y
          });
          data.bottomLine.attr({
            x1: leftBottom.x,
            y1: leftBottom.y,
            x2: rightBottom.x,
            y2: rightBottom.y
          });
          data.leftLine.attr({
            x1: leftTop.x,
            y1: leftTop.y,
            x2: leftBottom.x,
            y2: leftBottom.y
          });
        }, function (obj, display, data) {
          if (!data.rotIcon) return;
          data.rotIcon.hide();
          data.rotLine.hide();
          data.resizeIcon.hide();
          data.topLine.hide();
          data.rightLine.hide();
          data.bottomLine.hide();
          data.leftLine.hide();
          data.resizeBottom.hide();
          data.resizeLeft.hide();
          data.resizeRight.hide();
          data.resizeIconRt.hide();
          data.resizeIconLt.hide();
          data.resizeIconLb.hide();

          data._handlesSet = false;
        });
      };

      /**
       * @param float forClass
       */
      _myTrait_.svgHandleRenderers = function (forClass) {
        /*sface5.registerRenderer( "pathpoint", function(obj, display, data) {
         var surface = display.getSurface();
        if(!data.viewObj) {
            var svg = surface.getSvg();
            var icon = svg.circle();
            icon.attr({
                "fill" : "cyan",
                cx : 0,
                cy : 0,
                r : 56
            })
             data.viewObj = icon;
            obj.draggableFor( data.viewObj, display );
        }
        }, 
        function(obj, display, data) {
        
        var p = obj.parent().parent();
        if(!p.areHandlesVisible() && !obj.areHandlesVisible()) {
            data.viewObj.attr({
                r: 0
            });
            return;
        } else {
         }
        
        var surface = display.getSurface();
        var bgStyle = "";
        var rendM = obj.getRenderMatrix().createCopy();
        var move = Matrix3D();
        var a = rendM.m00();
            b = rendM.m10();
        var xScale = Math.sqrt( a*a + b*b );        
        
        var aList = {
            transform : obj.getRenderMatrix().getSVGTransform()
        };
        aList["r"] = 6*(1/xScale);
          data.viewObj.attr(aList); 
         
        }, function(obj, display, data) {
        data.viewObj.remove();
        });  
        */
        this.registerRenderer(forClass, function (obj, display, data) {

          if (!obj.areHandlesVisible()) {
            return;
          }

          var surface = display.getSurface();
          if (!data.rotIcon) {
            var svg = surface.getSvg();

            var lineAttr = {
              "stroke": "blue",
              "stroke-width": 2
            };
            var handleAttr = {
              "fill": "blue",
              cx: 0,
              cy: 0,
              cursor: "pointer",
              "class": "svghandle",
              r: 56
            };
            // "stroke-dasharray":"2,2"
            data.rotLine = svg.line("handle", lineAttr);

            data.rotIcon = svg.circle("", handleAttr);
            data.rotIcon.addClass("svghandle");
            obj.rotatableFor(data.rotIcon, display);

            data.topLine = svg.line("", lineAttr);
            data.rightLine = svg.line("", lineAttr);
            data.bottomLine = svg.line("", lineAttr);
            data.leftLine = svg.line("", lineAttr);

            obj.resizeableHeightFor(data.bottomLine);

            var resizeIcon = svg.circle();
            resizeIcon.attr({
              "fill": "blue",
              cx: 0,
              cy: 0,
              cursor: "pointer",
              r: 56
            });
            data.resizeIcon = resizeIcon;
            obj.resizeableFor(data.resizeIcon, display);

            data.resizeBottom = svg.circle("", handleAttr);
            obj.resizeableHeightFor(data.resizeBottom, display);

            data.resizeLeft = svg.circle("", handleAttr);
            obj.resizeableWidthFor(data.resizeLeft, display, {
              inverse: true
            });

            data.resizeRight = svg.circle("", handleAttr);
            obj.resizeableWidthFor(data.resizeRight, display);
            if (obj.parent()) {
              var itemList = obj.parent();
              itemList.on("remove", function () {
                if (itemList._removedItem == obj) {
                  data.rotIcon.remove();
                  data.rotLine.remove();
                  data.resizeIcon.remove();
                  data.topLine.remove();
                  data.rightLine.remove();
                  data.bottomLine.remove();
                  data.leftLine.remove();
                  data.resizeBottom.remove();
                  data.resizeLeft.remove();
                  data.resizeRight.remove();
                }
              });
            }
          }
        }, function (obj, display, data) {

          if (obj.areHandlesVisible()) {

            if (!data._handlesSet) {
              data.rotIcon.show();
              data.rotLine.show();
              data.topLine.show();
              data.rightLine.show();
              data.bottomLine.show();
              data.leftLine.show();
              data.resizeIcon.show();
              data.resizeBottom.show();
              data.resizeLeft.show();
              data.resizeRight.show();
            }

            data._handlesSet = true;
          } else {
            if (data._handlesSet) {
              data.rotIcon.hide();
              data.rotLine.hide();
              data.resizeIcon.hide();
              data.topLine.hide();
              data.rightLine.hide();
              data.bottomLine.hide();
              data.leftLine.hide();
              data.resizeBottom.hide();
              data.resizeLeft.hide();
              data.resizeRight.hide();
            }
            data._handlesSet = false;
            return;
          }

          // console.log("***** Refreshing the surface 4 ");
          var camera = display.getCamera(),
              surface = display.getSurface(),
              main = _e(display.getSurface().getDom()),
              perspective = 1000;

          var docWidth = surface.getWidth(),
              docHeight = surface.getHeight();

          // OK, then...
          var rendM = obj.getRenderMatrix().createCopy();
          var move = Matrix3D();
          var a = rendM.m00();
          b = rendM.m10();
          var xScale = Math.sqrt(a * a + b * b);
          if (xScale === 0) return;

          rendM = obj.getRenderMatrix().createCopy();
          var getPoint = function getPoint(x, y) {
            return rendM.screenProjection({
              x: x,
              y: y,
              z: 0,
              w: 1
            }, {
              d: perspective,
              cx: docWidth / 2,
              cy: docHeight / 2
            });
          };

          var rightTopMiddle = getPoint(obj.w() / 2, 0),
              rightTopMiddleUp = getPoint(obj.w() / 2, -20 / xScale),
              leftTop = getPoint(0, 0),
              rightTop = getPoint(obj.w(), 0),
              rightBottom = getPoint(obj.w(), obj.h()),
              leftBottom = getPoint(0, obj.h()),
              bottomMiddle = getPoint(obj.w() / 2, obj.h()),
              rightMiddle = getPoint(obj.w(), obj.h() / 2),
              leftMiddle = getPoint(0, obj.h() / 2);

          data.rotIcon.attr({
            r: 6,
            cx: rightTopMiddleUp.x,
            cy: rightTopMiddleUp.y
          });
          data.resizeIcon.attr({
            r: 6,
            cx: rightBottom.x,
            cy: rightBottom.y
          });
          data.resizeBottom.attr({
            r: 6,
            cx: bottomMiddle.x,
            cy: bottomMiddle.y
          });
          data.resizeLeft.attr({
            r: 6,
            cx: leftMiddle.x,
            cy: leftMiddle.y
          });
          data.resizeRight.attr({
            r: 6,
            cx: rightMiddle.x,
            cy: rightMiddle.y
          });
          data.rotLine.attr({
            x1: rightTopMiddle.x,
            y1: rightTopMiddle.y,
            x2: rightTopMiddleUp.x,
            y2: rightTopMiddleUp.y
          });

          data.topLine.attr({
            x1: leftTop.x,
            y1: leftTop.y,
            x2: rightTop.x,
            y2: rightTop.y
          });
          data.rightLine.attr({
            x1: rightTop.x,
            y1: rightTop.y,
            x2: rightBottom.x,
            y2: rightBottom.y
          });
          data.bottomLine.attr({
            x1: leftBottom.x,
            y1: leftBottom.y,
            x2: rightBottom.x,
            y2: rightBottom.y
          });
          data.leftLine.attr({
            x1: leftTop.x,
            y1: leftTop.y,
            x2: leftBottom.x,
            y2: leftBottom.y
          });
        }, function (obj, display, data) {
          data.resizeLeft.hide();
          data.resizeRight.hide();
          data.rotIcon.hide();
          data.topLine.hide();
          data.rightLine.hide();
          data.bottomLine.hide();
          data.resizeBottom.hide();
          data.resizeIcon.hide();
          data.leftLine.hide();
        });
      };

      /**
       * @param float forClass
       */
      _myTrait_.svgHandles = function (forClass) {
        /*sface5.registerRenderer( "pathpoint", function(obj, display, data) {
         var surface = display.getSurface();
        if(!data.viewObj) {
            var svg = surface.getSvg();
            var icon = svg.circle();
            icon.attr({
                "fill" : "cyan",
                cx : 0,
                cy : 0,
                r : 56
            })
             data.viewObj = icon;
            obj.draggableFor( data.viewObj, display );
        }
        }, 
        function(obj, display, data) {
        
        var p = obj.parent().parent();
        if(!p.areHandlesVisible() && !obj.areHandlesVisible()) {
            data.viewObj.attr({
                r: 0
            });
            return;
        } else {
         }
        
        var surface = display.getSurface();
        var bgStyle = "";
        var rendM = obj.getRenderMatrix().createCopy();
        var move = Matrix3D();
        var a = rendM.m00();
            b = rendM.m10();
        var xScale = Math.sqrt( a*a + b*b );        
        
        var aList = {
            transform : obj.getRenderMatrix().getSVGTransform()
        };
        aList["r"] = 6*(1/xScale);
          data.viewObj.attr(aList); 
         
        }, function(obj, display, data) {
        data.viewObj.remove();
        });  
        */
        this.registerRenderer(forClass, function (obj, display, data) {

          if (!obj.areHandlesVisible()) {
            return;
          }

          var surface = display.getSurface();
          if (!data.rotIcon) {
            var svg = surface.getSvg();

            var lineAttr = {
              "stroke": "blue",
              "stroke-width": 2
            };
            var handleAttr = {
              "fill": "blue",
              "stroke": "white",
              cx: 0,
              cy: 0,
              "stoke-width": 1,
              cursor: "pointer",
              "class": "svghandle",
              r: 56
            };
            // "stroke-dasharray":"2,2"
            data.rotLine = svg.line("handle", lineAttr);

            data.rotIcon = svg.circle("", handleAttr);

            obj.rotatableFor(data.rotIcon, display);

            data.topLine = svg.line("", lineAttr);
            data.rightLine = svg.line("", lineAttr);
            data.bottomLine = svg.line("", lineAttr);
            data.leftLine = svg.line("", lineAttr);

            obj.resizeableHeightFor(data.bottomLine);

            var resizeIcon = svg.circle();
            resizeIcon.attr(handleAttr);
            data.resizeIcon = resizeIcon;
            obj.resizeableFor(data.resizeIcon, display);

            var resizeIconRt = svg.circle();
            resizeIconRt.attr(handleAttr);
            data.resizeIconRt = resizeIconRt;
            obj.resizeableFor(data.resizeIconRt, display, {
              i: 0,
              j: 1
            });

            var resizeIconLt = svg.circle();
            resizeIconLt.attr(handleAttr);
            data.resizeIconLt = resizeIconLt;
            obj.resizeableFor(data.resizeIconLt, display, {
              i: 1,
              j: 1
            });

            var resizeIconLb = svg.circle();
            resizeIconLb.attr(handleAttr);
            data.resizeIconLb = resizeIconLb;
            obj.resizeableFor(data.resizeIconLb, display, {
              i: 1,
              j: 0
            });

            data.resizeBottom = svg.circle("", handleAttr);
            obj.resizeableHeightFor(data.resizeBottom, display);

            data.resizeLeft = svg.circle("", handleAttr);
            obj.resizeableWidthFor(data.resizeLeft, display, {
              inverse: true
            });

            data.resizeRight = svg.circle("", handleAttr);
            obj.resizeableWidthFor(data.resizeRight, display);
            if (obj.parent()) {
              var itemList = obj.parent();
              itemList.on("remove", function () {
                if (itemList._removedItem == obj) {
                  data.rotIcon.remove();
                  data.rotLine.remove();
                  data.resizeIcon.remove();
                  data.topLine.remove();
                  data.rightLine.remove();
                  data.bottomLine.remove();
                  data.leftLine.remove();
                  data.resizeBottom.remove();
                  data.resizeLeft.remove();
                  data.resizeRight.remove();
                  data.resizeIconRt.remove();
                  data.resizeIconLt.remove();
                  data.resizeIconLb.remove();
                }
              });
            }
          }
        }, function (obj, display, data) {

          if (obj.areHandlesVisible()) {

            if (!data._handlesSet) {
              data.rotIcon.show();
              data.rotLine.show();
              data.topLine.show();
              data.rightLine.show();
              data.bottomLine.show();
              data.leftLine.show();
              data.resizeIcon.show();
              data.resizeBottom.show();
              data.resizeLeft.show();
              data.resizeRight.show();
              data.resizeIconRt.show();
              data.resizeIconLt.show();
              data.resizeIconLb.show();
            }

            data._handlesSet = true;
          } else {
            if (data._handlesSet) {
              data.rotIcon.hide();
              data.rotLine.hide();
              data.resizeIcon.hide();
              data.topLine.hide();
              data.rightLine.hide();
              data.bottomLine.hide();
              data.leftLine.hide();
              data.resizeBottom.hide();
              data.resizeLeft.hide();
              data.resizeRight.hide();
              data.resizeIconRt.hide();
              data.resizeIconLt.hide();
              data.resizeIconLb.hide();
            }
            data._handlesSet = false;
            return;
          }

          // console.log("***** Refreshing the surface 4 ");
          var camera = display.getCamera(),
              surface = display.getSurface(),
              main = _e(display.getSurface().getDom()),
              perspective = 1000;

          var docWidth = surface.getWidth(),
              docHeight = surface.getHeight();

          // OK, then...
          var rendM = obj.getViewMatrix(display.getCamera()).createCopy();
          var move = Matrix3D();
          var a = rendM.m00(),
              b = rendM.m10();
          var xScale = Math.sqrt(a * a + b * b);
          if (xScale === 0) return;

          rendM = obj.getViewMatrix(display.getCamera()).createCopy();
          var getPoint = function getPoint(x, y) {
            return rendM.screenProjection({
              x: x,
              y: y,
              z: 0,
              w: 1
            }, {
              d: perspective,
              cx: docWidth / 2,
              cy: docHeight / 2
            });
          };

          var rightTopMiddle = getPoint(obj.w() / 2, 0),
              rightTopMiddleUp = getPoint(obj.w() / 2, -20 / xScale),
              leftTop = getPoint(0, 0),
              rightTop = getPoint(obj.w(), 0),
              rightBottom = getPoint(obj.w(), obj.h()),
              leftBottom = getPoint(0, obj.h()),
              bottomMiddle = getPoint(obj.w() / 2, obj.h()),
              rightMiddle = getPoint(obj.w(), obj.h() / 2),
              leftMiddle = getPoint(0, obj.h() / 2);

          data.rotIcon.attr({
            r: 6,
            cx: rightTopMiddleUp.x,
            cy: rightTopMiddleUp.y
          });
          data.resizeIcon.attr({
            r: 6,
            cx: rightBottom.x,
            cy: rightBottom.y
          });
          data.resizeIconRt.attr({
            r: 6,
            cx: rightTop.x,
            cy: rightTop.y
          });
          data.resizeIconLt.attr({
            r: 6,
            cx: leftTop.x,
            cy: leftTop.y
          });
          data.resizeIconLb.attr({
            r: 6,
            cx: leftBottom.x,
            cy: leftBottom.y
          });
          data.resizeBottom.attr({
            r: 6,
            cx: bottomMiddle.x,
            cy: bottomMiddle.y
          });
          data.resizeLeft.attr({
            r: 6,
            cx: leftMiddle.x,
            cy: leftMiddle.y
          });
          data.resizeRight.attr({
            r: 6,
            cx: rightMiddle.x,
            cy: rightMiddle.y
          });
          data.rotLine.attr({
            x1: rightTopMiddle.x,
            y1: rightTopMiddle.y,
            x2: rightTopMiddleUp.x,
            y2: rightTopMiddleUp.y
          });

          data.topLine.attr({
            x1: leftTop.x,
            y1: leftTop.y,
            x2: rightTop.x,
            y2: rightTop.y
          });
          data.rightLine.attr({
            x1: rightTop.x,
            y1: rightTop.y,
            x2: rightBottom.x,
            y2: rightBottom.y
          });
          data.bottomLine.attr({
            x1: leftBottom.x,
            y1: leftBottom.y,
            x2: rightBottom.x,
            y2: rightBottom.y
          });
          data.leftLine.attr({
            x1: leftTop.x,
            y1: leftTop.y,
            x2: leftBottom.x,
            y2: leftBottom.y
          });
        }, function (obj, display, data) {
          if (!data.rotIcon) return;
          data.rotIcon.hide();
          data.rotLine.hide();
          data.resizeIcon.hide();
          data.topLine.hide();
          data.rightLine.hide();
          data.bottomLine.hide();
          data.leftLine.hide();
          data.resizeBottom.hide();
          data.resizeLeft.hide();
          data.resizeRight.hide();
          data.resizeIconRt.hide();
          data.resizeIconLt.hide();
          data.resizeIconLb.hide();

          data._handlesSet = false;
        });
      };
    })(this);
  };

  var surface = function surface(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof surface) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != surface._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new surface(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  surface._classInfo = {
    name: "surface"
  };
  surface.prototype = new surface_prototype();

  (function () {
    if (typeof define !== "undefined" && define !== null && define.amd != null) {
      __amdDefs__["surface"] = surface;
      this.surface = surface;
    } else if (typeof module !== "undefined" && module !== null && module.exports != null) {
      module.exports["surface"] = surface;
    } else {
      this.surface = surface;
    }
  }).call(new Function("return this")());

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var drawIconbox_prototype = function drawIconbox_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param float t
       */
      _myTrait_.adjustDivSize = function (t) {};

      /**
       * @param float t
       */
      _myTrait_.adjustStyleProps = function (t) {

        var scaleF = (this.width / this.origWidth).toFixed(5);

        var dx = -1 * (1 / scaleF) * this.width / 2,
            dy = -1 * (1 / scaleF) * this.width / 2;
        var matStr = "transform-origin:50% 50%;-webkit-transform-origin:50% 50%; -ms-transform-origin: 50% 50%;";

        var ts = "translate(" + (this.cx + dx) + "px," + (this.cy + dy) + "px) scale(" + scaleF + ")  ;";

        matStr += "transform:" + ts;
        matStr += "-ms-transform:" + ts;
        matStr += "-webkit-transform:" + ts;

        var bgColor = this.options.bgColor || "blue";

        var styleStr = matStr + ";background-color:" + bgColor + ";width:" + this.origWidth + "px;height:" + this.origWidth + "px;position:absolute;left:0px;top:0px;";

        this.iconG.attr({
          "transform": "scale(1)"
        });

        this.myDiv.attr({
          style: styleStr
        });
      };

      /**
       * @param Object v
       */
      _myTrait_.attr = function (v) {

        return this.myDiv.attr(v);
      };

      /**
       * @param float f1
       * @param float f2
       * @param float f3
       */
      _myTrait_.draggable = function (f1, f2, f3) {

        this.myDiv.draggable(f1, f2, f3);
        this.iconG.draggable(f1, f2, f3);

        return this;
      };

      /**
       * @param float t
       */
      _myTrait_.getElem = function (t) {

        return this.myDiv;
      };

      /**
       * @param float t
       */
      _myTrait_.hide = function (t) {
        this.myDiv.hide();
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (cx, cy, width, iconPath, options) {

        this.cx = cx;
        this.cy = cy;
        this.origWidth = width;
        this.width = width;
        this.iconPath = iconPath;
        this.options = options || {};

        var myDiv = _e("div");
        myDiv.absolute().x(0).y(0);
        var svg = myDiv.svg();

        svg.attr({
          width: this.width,
          height: this.width
        });

        this.iconG = svg.g();
        this.iconG.path({
          d: iconPath,
          fill: this.options.iconColor || "white"
        });

        this.myDiv = myDiv;

        this.adjustStyleProps();
      });

      /**
       * @param float t
       */
      _myTrait_.length = function (t) {

        var dx = this.ex - this.sx,
            dy = this.ey - this.sy;

        return Math.sqrt(dx * dx + dy * dy);
      };

      /**
       * @param float cx
       * @param float cy
       * @param float width
       * @param float ey
       */
      _myTrait_.moveTo = function (cx, cy, width, ey) {
        this.cx = cx;
        this.cy = cy;

        if (width) this.width = width;

        this.adjustStyleProps();
      };

      /**
       * @param float t
       */
      _myTrait_.show = function (t) {

        this.myDiv.show();
      };
    })(this);
  };

  var drawIconbox = function drawIconbox(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof drawIconbox) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != drawIconbox._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new drawIconbox(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  drawIconbox._classInfo = {
    name: "drawIconbox"
  };
  drawIconbox.prototype = new drawIconbox_prototype();

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var jsVectors_prototype = function jsVectors_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {
      var projectionMatrix;
      var jVect;
      var iVect;
      var pBase;
      var tn1;
      var nv1;
      var barCoeffs;
      var deVector;

      // Initialize static variables here...

      /**
       * @param Object v1
       * @param Object v2
       */
      _myTrait_.add = function (v1, v2) {

        v1.x = v1.x + v2.x;
        v1.y = v1.y + v2.y;
      };

      /**
       * @param Object v1
       * @param Object v2
       */
      _myTrait_.angleBetween = function (v1, v2) {

        var n1 = this.normalize({
          x: v1.x,
          y: v1.y
        });
        var n2 = this.normalize({
          x: v2.x,
          y: v2.y
        });

        var cp = this.crossProd(n1, n2);
        var dp = this.dotProd(n1, n2);

        var a = Math.acos(dp);
        if (cp < 0) a = a * -1; // other side...
        return a;
      };

      /**
       * @param Object t
       * @param Object p0
       * @param Object p1
       * @param Object p2
       * @param Object p3
       */
      _myTrait_.calc_cat = function (t, p0, p1, p2, p3) {

        var t2 = t * t;
        var t3 = t2 * t;
        return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
      };

      /**
       * @param Object v1
       * @param Object v2
       */
      _myTrait_.crossProd = function (v1, v2) {

        // U x V = Ux*Vy-Uy*Vx
        return v1.x * v2.y - v1.y * v2.x;
      };

      /**
       * @param Object p1
       * @param Object p2
       */
      _myTrait_.diff = function (p1, p2) {

        return {
          x: p2.x - p1.x,
          y: p2.y - p1.y
        };
      };

      /**
       * @param Object p1
       * @param Object p2
       */
      _myTrait_.dist = function (p1, p2) {

        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;
        return Math.sqrt(dx * dx + dy * dy);
      };

      /**
       * @param Object v1
       * @param Object v2
       */
      _myTrait_.dotProd = function (v1, v2) {

        return v1.x * v2.x + v1.y * v2.y;
      };

      /**
       * @param Object p0
       * @param Object p1
       * @param Object p2
       */
      _myTrait_.getBarCoeffs = function (p0, p1, p2) {

        var bb = barCoeffs;
        bb.A = 1 / 2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
        bb.sign = bb.A < 0 ? -1 : 1;
        bb.s1 = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y)) * bb.sign;
        bb.s2 = (p2.y - p0.y) * bb.sign;
        bb.s3 = (p0.x - p2.x) * bb.sign;
        bb.t1 = (p0.x * p1.y - p0.y * p1.x) * bb.sign;
        bb.t2 = (p0.y - p1.y) * bb.sign;
        bb.t3 = (p1.x - p0.x) * bb.sign;
        return bb;
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (t) {

        if (!tn1) {

          tn1 = {
            x: 0,
            y: 0
          };
          nv1 = {
            x: 0,
            y: 0
          };

          projectionMatrix = [0, 0, 0, 0];

          jVect = {
            x: 0,
            y: 0
          };
          iVect = {
            x: 0,
            y: 0
          };
          pBase = {
            x: 0,
            y: 0
          };

          barCoeffs = {
            Area: 0,
            s1: 0,
            s2: 0,
            s3: 0,
            t1: 0,
            t2: 0,
            t3: 0,
            sign: 0
          };
          deVector = {
            x: 0,
            y: 0
          };
        }
      });

      /**
       * @param Object p1
       * @param Object p2
       */
      _myTrait_.initProjection = function (p1, p2) {

        iVect.y = p2.y - p1.y;
        iVect.x = p2.x - p1.x;

        jVect.y = iVect.y;
        jVect.x = iVect.x;

        this.normalize(iVect);
        this.normalize(jVect);

        this.rotate(jVect, Math.PI / 2);

        pBase.x = p1.x;
        pBase.y = p1.y;
      };

      /**
       * @param Object p1
       */
      _myTrait_.length = function (p1) {

        var dx = p1.x;
        var dy = p1.y;
        return Math.sqrt(dx * dx + dy * dy);
      };

      /**
       * @param Object p0
       * @param Object p1
       * @param Object v0
       * @param Object v1
       */
      _myTrait_.linesIntersect = function (p0, p1, v0, v1) {

        var x1 = p0.x,
            y1 = p0.y,
            x2 = p1.x,
            y2 = p1.y,
            x3 = v0.x,
            y3 = v0.y,
            x4 = v1.x,
            y4 = v1.y;

        var x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
        var y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
        if (isNaN(x) || isNaN(y)) {
          return false;
        } else {
          if (x1 >= x2) {
            if (!(x2 <= x && x <= x1)) {
              return false;
            }
          } else {
            if (!(x1 <= x && x <= x2)) {
              return false;
            }
          }
          if (y1 >= y2) {
            if (!(y2 <= y && y <= y1)) {
              return false;
            }
          } else {
            if (!(y1 <= y && y <= y2)) {
              return false;
            }
          }
          if (x3 >= x4) {
            if (!(x4 <= x && x <= x3)) {
              return false;
            }
          } else {
            if (!(x3 <= x && x <= x4)) {
              return false;
            }
          }
          if (y3 >= y4) {
            if (!(y4 <= y && y <= y3)) {
              return false;
            }
          } else {
            if (!(y3 <= y && y <= y4)) {
              return false;
            }
          }
        }
        return true;
      };

      /**
       * @param Object v1
       * @param Object along
       * @param Object base
       */
      _myTrait_.mirrorVector = function (v1, along, base) {

        // the direction tangent and normal are normalized and the vector is projected into it           
        tn1.x = along.x - base.x;
        tn1.y = along.y - base.y;
        nv1.x = -tn1.y;
        nv1.y = tn1.x;

        v1.x = v1.x - base.x;
        v1.y = v1.y - base.y;

        // if the 'j' or normal projection is positive, turn around
        if (this.dotProd(v1, nv1) > 0) this.rotate(nv1, Math.PI);

        this.normalize(tn1);
        this.normalize(nv1);

        // Create positive coordinates of the projection of the vector to the 'base' cordinates
        var nvProd = Math.abs(this.dotProd(v1, nv1));
        //             tnProd = Math.abs( this.dotProd(v1,tn1) );

        var tnProd = this.dotProd(v1, tn1);
        // then, project the length of the base vectors to get the new vector space
        v1.x = nv1.x * nvProd + tn1.x * tnProd, v1.y = nv1.y * nvProd + tn1.y * tnProd;

        v1.x += base.x;
        v1.y += base.y;

        return v1;
      };

      /**
       * @param Object v
       */
      _myTrait_.normalize = function (v) {

        var len = Math.sqrt(v.x * v.x + v.y * v.y);

        if (len == 0) {
          throw "Error normalizing vector: the length of the vector was zero";
        }

        v.x = v.x / len;
        v.y = v.y / len;
        return v;
      };

      /**
       * @param Object v1
       * @param Object along
       */
      _myTrait_.opposeVector = function (v1, along) {

        // the direction tangent and normal are normalized and the vector is projected into it           
        tn1.x = along, x;
        tn1.y = along.y;
        nv1.x = -tn1.y;
        nv1.y = tn1.x;

        this.normalize(tn1);
        this.normalize(nv1);

        // Important: turn the tangent to opposing direction...
        this.rotate(tn1, Math.PI);

        // Create the projection of the vector to the 'base' cordinates
        var nvProd = Math.abs(jsMath.dotProd(v1, nv1)),
            tnProd = Math.abs(jsMath.dotProd(v1, tn1));

        // if the 'j' or normal projection is negative, turn around
        if (this.dotProd(v1, nv1) < 0) this.rotate(nv1, Math.PI);

        // then, project the length of the vector to get the new vector
        v1.x = nv1.x * nvProd + tn1.x * tnProd, v1.y = nv1.y * nvProd + tn1.y * tnProd;

        return v1;
      };

      /**
       * @param Object p
       * @param Object p0
       * @param Object p1
       * @param Object p2
       */
      _myTrait_.pointInTriangle = function (p, p0, p1, p2) {

        var A = 1 / 2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
        var sign = A < 0 ? -1 : 1;
        var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
        var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;

        return s > 0 && t > 0 && s + t < 2 * A * sign;
      };

      /**
       * @param Object p
       * @param Object bb
       */
      _myTrait_.pointInTriangleBc = function (p, bb) {

        var A = bb.A;
        var sign = bb.sign;
        var s = bb.s1 + bb.s2 * p.x + bb.s3 * p.y;
        var t = bb.t1 + bb.t2 * p.x + bb.t3 * p.y;

        return s > 0 && t > 0 && s + t < 2 * A * sign;
      };

      /**
       * @param Object vectorToProject
       */
      _myTrait_.project = function (vectorToProject) {

        var p = vectorToProject;

        pVector.x = p.x - pBase.x;
        pVector.y = p.y - pBase.y;

        prodResult.i = this.dotProd(pVector, iVect);
        prodResult.j = this.dotProd(pVector, jVect);

        return prodResult;
      };

      /**
       * @param Object v
       * @param Object angle
       */
      _myTrait_.rotate = function (v, angle) {

        var s = Math.sin(angle);
        var c = Math.cos(angle);

        var x = v.x,
            y = v.y;

        v.x = x * c + y * s;
        v.y = -x * s + y * c;

        return v;
      };

      /**
       * @param Object angle
       * @param Object v
       * @param Object around
       */
      _myTrait_.rotateAround = function (angle, v, around) {

        this.sub(v, around);
        this.rotate(v, angle);
        this.add(v, around);
      };

      /**
       * @param Object v1
       * @param Object v2
       */
      _myTrait_.sub = function (v1, v2) {

        v1.x = v1.x - v2.x;
        v1.y = v1.y - v2.y;
      };

      /**
       * @param Object v1
       * @param Object v2
       * @param Object v3
       */
      _myTrait_.tangentNormal = function (v1, v2, v3) {

        var t1 = {};
        t1.x = v2.x - v1.x;
        t1.y = v2.y - v1.y;
        var t2 = {};
        t2.x = v3.x - v2.x;
        t2.y = v3.y - v2.y;

        var p = {
          x: t1.x + t2.x,
          y: t1.y + t2.y
        };
        return this.normalize(p);
      };

      /**
       * @param Object A
       * @param Object B
       * @param Object C
       */
      _myTrait_.triangleArea = function (A, B, C) {

        var area = A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y);

        return Math.abs(area / 2);
      };

      /**
       * @param Object p0
       * @param Object p1
       * @param Object p2
       * @param Object q0
       * @param Object q1
       * @param Object q2
       */
      _myTrait_.triangleInTriangle = function (p0, p1, p2, q0, q1, q2) {

        var bb = this.getBarCoeffs(p0, p1, p2);

        if (this.pointInTriangleBc(q0, bb)) return true;
        if (this.pointInTriangleBc(q1, bb)) return true;
        if (this.pointInTriangleBc(q2, bb)) return true;

        var bb = this.getBarCoeffs(q0, q1, q2);

        if (this.pointInTriangleBc(p0, bb)) return true;
        if (this.pointInTriangleBc(p1, bb)) return true;
        if (this.pointInTriangleBc(p2, bb)) return true;

        if (this.linesIntersect(p0, p1, q0, q1)) return true;
        if (this.linesIntersect(p1, p2, q0, q1)) return true;
        if (this.linesIntersect(p2, p0, q0, q1)) return true;

        if (this.linesIntersect(p0, p1, q1, q2)) return true;
        if (this.linesIntersect(p1, p2, q1, q2)) return true;
        if (this.linesIntersect(p2, p0, q1, q2)) return true;

        if (this.linesIntersect(p0, p1, q2, q0)) return true;
        if (this.linesIntersect(p1, p2, q2, q0)) return true;
        if (this.linesIntersect(p2, p0, q2, q0)) return true;

        return false;
      };

      /**
       * @param Object projectedVector
       */
      _myTrait_.unProject = function (projectedVector) {

        var p = projectedVector;
        deVector.x = p.i * iVect.x + p.j * jVect.x;
        deVector.y = p.i * iVect.y + p.j * jVect.y;

        deVector.x += pBase.x;
        deVector.y += pBase.y;
        return deVector;
      };
    })(this);
  };

  var jsVectors = function jsVectors(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof jsVectors) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != jsVectors._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new jsVectors(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  jsVectors._classInfo = {
    name: "jsVectors"
  };
  jsVectors.prototype = new jsVectors_prototype();

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var surfaceDom2D_prototype = function surfaceDom2D_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {
      var _renderFns;
      var _sfaceCnt;

      // Initialize static variables here...

      /**
       * @param float t
       */
      _myTrait_.frameClear = function (t) {};

      /**
       * @param float t
       */
      _myTrait_.getDom = function (t) {
        return this._dom;
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (elem, width, height) {

        this._dom = elem;
        this._width = width;
        this._height = height;

        var d = _e(elem);

        d.attr({
          style: "width:" + width + "px;height:" + height + "px;background-color:none;position:absolute;left:0px;top:0px;overflow:hidden;"
        });

        if (!this._renderFns) {
          this._renderFns = {};
        }
      });
    })(this);
  };

  var surfaceDom2D = function surfaceDom2D(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof surfaceDom2D) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != surfaceDom2D._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new surfaceDom2D(a, b, c, d, e, f, g, h);
  };
  // inheritance is here surface

  surfaceDom2D_prototype.prototype = surface.prototype;

  surfaceDom2D._classInfo = {
    name: "surfaceDom2D"
  };
  surfaceDom2D.prototype = new surfaceDom2D_prototype();

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var display_prototype = function display_prototype() {
    // Then create the traits and subclasses for this class here...

    // trait comes here...

    (function (_myTrait_) {
      var _eventOn;
      var _commands;

      // Initialize static variables here...

      /**
       * @param float t
       */
      _myTrait_.guid = function (t) {

        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        //return Math.random();
        // return Math.random().toString(36);

        /*    
        return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
        */
        /*        
        function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();*/
      };

      /**
       * @param float t
       */
      _myTrait_.isArray = function (t) {

        if (typeof t == "undefined") return this.__isA;

        return Object.prototype.toString.call(t) === "[object Array]";
      };

      /**
       * @param float fn
       */
      _myTrait_.isFunction = function (fn) {
        return Object.prototype.toString.call(fn) == "[object Function]";
      };

      /**
       * @param float t
       */
      _myTrait_.isObject = function (t) {

        if (typeof t == "undefined") return this.__isO;

        return t === Object(t);
      };
    })(this);

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param Object newCamera
       */
      _myTrait_.changeCamera = function (newCamera) {

        var root = this.getCamera().getRootNode(),
            me = this,
            sface = this.getSurface();

        // remove all the objects from the old camera
        root.forChildren(function (n) {
          sface.removeObject(n, me);
        });

        this._camera = newCamera;

        root = newCamera.getRootNode(), root.forChildren(function (n) {
          sface.startObject(n, me);
        });

        // removeObject
      };

      /**
       * @param float t
       */
      _myTrait_.getCamera = function (t) {
        return this._camera;
      };

      /**
       * @param float t
       */
      _myTrait_.getSurface = function (t) {
        return this._surface;
      };

      /**
       * @param float t
       */
      _myTrait_.id = function (t) {
        if (!this._id) {
          this._id = this.guid();
        }
        return this._id;
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (camera, surface) {

        console.log("Display constructor called");
        console.log(camera);
        console.log(surface);

        this._camera = camera;
        this._surface = surface;

        camera.registerDisplay(this);
      });

      /**
       * @param float obj
       * @param float fromClass
       */
      _myTrait_.refreshObject = function (obj, fromClass) {

        // restartObject

        var s = this.getSurface();
        s.restartObject(obj, this, fromClass);

        var dd = this;
        obj.forChildren(function (cObj) {
          if (cObj == obj) return;
          s.restartObject(cObj, dd, cObj.renderClass());
        });
      };

      /**
       * @param float obj
       */
      _myTrait_.render = function (obj) {

        // console.log("Render for ", obj);

        if (obj.addToDisplay) {
          obj.addToDisplay(this.id(), this);
          this._surface.render(obj, this);
        } else {}
      };

      /**
       * @param Obj rootObj
       */
      _myTrait_.renderTree = function (rootObj) {

        if (rootObj && rootObj.isFulfilled && !rootObj.isFulfilled()) return;

        if (!rootObj) {
          var cam = this.getCamera();
          rootObj = cam.getRootNode();
        }

        var sf = this.getSurface();

        if (sf.renderTree) {
          sf.renderTree(rootObj, this);
          return this;
        }

        var me = this;
        me.render(rootObj);
        if (rootObj.items) {
          rootObj.items.forEach(function (i) {
            me.renderTree(i);
          });
        }

        // Might show the handles, but not available here...
      };
    })(this);
  };

  var display = function display(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof display) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != display._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new display(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  display._classInfo = {
    name: "display"
  };
  display.prototype = new display_prototype();

  (function () {
    if (typeof define !== "undefined" && define !== null && define.amd != null) {
      __amdDefs__["display"] = display;
      this.display = display;
    } else if (typeof module !== "undefined" && module !== null && module.exports != null) {
      module.exports["display"] = display;
    } else {
      this.display = display;
    }
  }).call(new Function("return this")());

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var surfaceDom3D_prototype = function surfaceDom3D_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {
      var _renderFns;
      var _sfaceCnt;

      // Initialize static variables here...

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (elem, width, height) {

        this._dom = elem;
        this._width = width;
        this._height = height;

        var d = _e(elem);

        d.attr({
          style: "width:" + width + "px;height:" + height + "px;background-color:#f3f1e7;position:absolute;left:0px;top:0px;overflow:hidden;"
        });

        if (!this._renderFns) {
          this._renderFns = {};
        }
      });
    })(this);
  };

  var surfaceDom3D = function surfaceDom3D(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof surfaceDom3D) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != surfaceDom3D._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new surfaceDom3D(a, b, c, d, e, f, g, h);
  };
  // inheritance is here surface

  surfaceDom3D_prototype.prototype = surface.prototype;

  surfaceDom3D._classInfo = {
    name: "surfaceDom3D"
  };
  surfaceDom3D.prototype = new surfaceDom3D_prototype();

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var surfaceDomCanvas_prototype = function surfaceDomCanvas_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {
      var _renderFns;
      var _sfaceCnt;

      // Initialize static variables here...

      /**
       * @param float obj
       * @param float display
       */
      _myTrait_.canvasRender = function (obj, display) {
        var rt = obj.renderClass();

        var _renderFns = this._renderFns;

        if (_renderFns[rt]) {
          var fnData = _renderFns[rt];

          obj.setRenderScope(this.id());

          var rendData = obj.getRenderData(this.id());

          if (typeof rendData.state == "undefined") rendData.state = 1;

          if (obj.askToRemove(this.id())) {

            fnData.end(obj, display, rendData);
            rendData.state = 3;
            obj.askToRemove(this.id(), false);
          }

          if (rendData.state == 1) {

            // Different canvas specific instructions come here...
            //var ctx = this.getContext();
            // ctx.save();

            fnData.start(obj, display, rendData);
            obj.projectToCamera(display.getCamera());
            fnData.refresh(obj, display, rendData);

            // ctx.restore();
          }

          if (rendData.state == 2) {
            obj.projectToCamera(display.getCamera());
            fnData.refresh(obj, display, rendData);
          }

          obj.setRenderScope(null);
        }
      };

      /**
       * @param float t
       */
      _myTrait_.frameClear = function (t) {

        if (this._clearIndex && t === this._clearIndex) return;

        this._clearIndex = t;

        var context = this.getContext();
        context.clearRect(0, 0, this.getWidth(), this.getHeight());
      };

      /**
       * @param float t
       */
      _myTrait_.getContext = function (t) {

        return this.getDom().getContext("2d");
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (elem, width, height) {

        this._width = width;
        this._height = height;
        var cont = _e(elem);
        var d = cont.canvas();

        d.attr({
          style: "width:" + width + "px;height:" + height + "px;position:absolute;left:0px;top:0px;overflow:hidden;",
          width: width + "px",
          height: height + "px"
        });
        d.width(width);
        d.height(height);
        cont.width(width);
        cont.height(height);

        if (!this._renderFns) {
          this._renderFns = {};
        }

        this._elem = d;
        this._dom = d._dom;
      });

      /**
       * @param float rootObj
       * @param float display
       */
      _myTrait_.renderTree = function (rootObj, display) {
        if (rootObj.isFulfilled && !rootObj.isFulfilled()) return;
        var me = this;
        me.canvasRender(rootObj, display);
        if (rootObj.items) {
          rootObj.items.forEach(function (i) {
            me.renderTree(i, display);
          });
        }
      };
    })(this);
  };

  var surfaceDomCanvas = function surfaceDomCanvas(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof surfaceDomCanvas) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != surfaceDomCanvas._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new surfaceDomCanvas(a, b, c, d, e, f, g, h);
  };
  // inheritance is here surface

  surfaceDomCanvas_prototype.prototype = surface.prototype;

  surfaceDomCanvas._classInfo = {
    name: "surfaceDomCanvas"
  };
  surfaceDomCanvas.prototype = new surfaceDomCanvas_prototype();

  (function () {
    if (typeof define !== "undefined" && define !== null && define.amd != null) {
      __amdDefs__["surfaceDomCanvas"] = surfaceDomCanvas;
      this.surfaceDomCanvas = surfaceDomCanvas;
    } else if (typeof module !== "undefined" && module !== null && module.exports != null) {
      module.exports["surfaceDomCanvas"] = surfaceDomCanvas;
    } else {
      this.surfaceDomCanvas = surfaceDomCanvas;
    }
  }).call(new Function("return this")());

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var surfaceDomSVG_prototype = function surfaceDomSVG_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {
      var _renderFns;
      var _sfaceCnt;

      // Initialize static variables here...

      /**
       * @param float t
       */
      _myTrait_.getHoverLayer = function (t) {
        return this._hoverLayer;
      };

      /**
       * @param float t
       */
      _myTrait_.getSvg = function (t) {
        return this._childHolder;
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (elem, width, height) {

        this._dom = elem;
        this._width = width;
        this._height = height;

        var d = _e(elem);

        this._svgElem = d.svg();
        this._svgElem.attr({
          width: width,
          height: height
        });

        this._childHolder = this._svgElem.g();
        this._hoverLayer = this._svgElem.g();

        d.attr({
          style: "width:" + width + "px;height:" + height + "px;background-color:none;position:absolute;left:0px;top:0px;overflow:hidden;"
        });

        if (!this._renderFns) {
          this._renderFns = {};
        }
      });
    })(this);
  };

  var surfaceDomSVG = function surfaceDomSVG(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof surfaceDomSVG) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != surfaceDomSVG._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new surfaceDomSVG(a, b, c, d, e, f, g, h);
  };
  // inheritance is here surface

  surfaceDomSVG_prototype.prototype = surface.prototype;

  surfaceDomSVG._classInfo = {
    name: "surfaceDomSVG"
  };
  surfaceDomSVG.prototype = new surfaceDomSVG_prototype();

  (function () {
    if (typeof define !== "undefined" && define !== null && define.amd != null) {
      __amdDefs__["surfaceDomSVG"] = surfaceDomSVG;
      this.surfaceDomSVG = surfaceDomSVG;
    } else if (typeof module !== "undefined" && module !== null && module.exports != null) {
      module.exports["surfaceDomSVG"] = surfaceDomSVG;
    } else {
      this.surfaceDomSVG = surfaceDomSVG;
    }
  }).call(new Function("return this")());

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var surfaceDomPixi_prototype = function surfaceDomPixi_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {
      var _renderFns;
      var _sfaceCnt;

      // Initialize static variables here...

      /**
       * @param float t
       */
      _myTrait_.frameClear = function (t) {};

      /**
       * @param float t
       */
      _myTrait_.frameFinish = function (t) {

        if (this._lastFinishT && this._lastFinishT === t) return;

        this._lastFinishT = t;

        this._renderer.render(this._stage);
      };

      /**
       * @param float t
       */
      _myTrait_.getStage = function (t) {
        return this._stage;
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (elem, width, height) {

        this._dom = elem;
        this._width = width;
        this._height = height;

        var d = _e(elem);

        var stage = new PIXI.Stage(16777215);

        // create a renderer instance.
        var renderer = PIXI.autoDetectRenderer(width, height);

        this._stage = stage;
        this._renderer = renderer;

        d._dom.appendChild(renderer.view);

        d.attr({
          style: "width:" + width + "px;height:" + height + "px;background-color:#f0f0f0;position:absolute;left:0px;top:0px;overflow:hidden;"
        });

        if (!this._renderFns) {
          this._renderFns = {};
        }
        /*
        var stage = new PIXI.Stage(0x66FF99);
        // create a renderer instance.
        var renderer = PIXI.autoDetectRenderer(400, 300);
        // add the renderer view element to the DOM
        document.body.appendChild(renderer.view);
        requestAnimFrame( animate );
        // create a texture from an image path
        var texture = PIXI.Texture.fromImage("bunny.png");
        // create a new Sprite using the texture
        var bunny = new PIXI.Sprite(texture);
        // center the sprites anchor point
        bunny.anchor.x = 0.5;
        bunny.anchor.y = 0.5;
        // move the sprite t the center of the screen
        bunny.position.x = 200;
        bunny.position.y = 150;
        stage.addChild(bunny);
        function animate() {
          requestAnimFrame( animate );
          // just for fun, lets rotate mr rabbit a little
        bunny.rotation += 0.1;
          // render the stage   
        renderer.render(stage);
        }
        */
      });
    })(this);
  };

  var surfaceDomPixi = function surfaceDomPixi(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof surfaceDomPixi) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != surfaceDomPixi._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new surfaceDomPixi(a, b, c, d, e, f, g, h);
  };
  // inheritance is here surface

  surfaceDomPixi_prototype.prototype = surface.prototype;

  surfaceDomPixi._classInfo = {
    name: "surfaceDomPixi"
  };
  surfaceDomPixi.prototype = new surfaceDomPixi_prototype();

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var drawBox_prototype = function drawBox_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param float t
       */
      _myTrait_.adjustDivSize = function (t) {};

      /**
       * @param float t
       */
      _myTrait_.adjustStyleProps = function (t) {

        var scaleF = (this.width / this.origWidth).toFixed(5);

        var dx = -1 * (1 / scaleF) * this.width / 2,
            dy = -1 * (1 / scaleF) * this.width / 2;
        var matStr = "transform-origin:50% 50%;-webkit-transform-origin:50% 50%; -ms-transform-origin: 50% 50%;";

        var ts = "translate(" + (this.cx + dx) + "px," + (this.cy + dy) + "px) scale(" + scaleF + ")  ;";

        matStr += "transform:" + ts;
        matStr += "-ms-transform:" + ts;
        matStr += "-webkit-transform:" + ts;

        var bgColor = this.options.bgColor || "blue";

        var styleStr = matStr + ";background-color:" + bgColor + ";width:" + this.origWidth + "px;height:" + this.origWidth + "px;position:absolute;left:0px;top:0px;";

        this.myDiv.attr({
          style: styleStr
        });
      };

      /**
       * @param Object v
       */
      _myTrait_.attr = function (v) {

        return this.myDiv.attr(v);
      };

      /**
       * @param float f1
       * @param float f2
       * @param float f3
       */
      _myTrait_.draggable = function (f1, f2, f3) {

        this.myDiv.draggable(f1, f2, f3);

        return this;
      };

      /**
       * @param float t
       */
      _myTrait_.getElem = function (t) {

        return this.myDiv;
      };

      /**
       * @param float t
       */
      _myTrait_.hide = function (t) {
        this.myDiv.hide();
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (cx, cy, width, options, nothing) {

        this.cx = cx;
        this.cy = cy;
        this.origWidth = width;
        this.width = width;
        this.options = options || {};

        var myDiv = _e("div");
        myDiv.absolute().x(0).y(0);
        this.myDiv = myDiv;
        this.adjustStyleProps();
      });

      /**
       * @param float t
       */
      _myTrait_.length = function (t) {

        var dx = this.ex - this.sx,
            dy = this.ey - this.sy;

        return Math.sqrt(dx * dx + dy * dy);
      };

      /**
       * @param float cx
       * @param float cy
       * @param float width
       * @param float ey
       */
      _myTrait_.moveTo = function (cx, cy, width, ey) {
        this.cx = cx;
        this.cy = cy;

        if (width) this.width = width;

        this.adjustStyleProps();
      };

      /**
       * @param float t
       */
      _myTrait_.show = function (t) {

        this.myDiv.show();
      };
    })(this);
  };

  var drawBox = function drawBox(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof drawBox) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != drawBox._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new drawBox(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  drawBox._classInfo = {
    name: "drawBox"
  };
  drawBox.prototype = new drawBox_prototype();

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var pathTools_prototype = function pathTools_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param float obj
       * @param float ctx
       */
      _myTrait_.childenToContextBezier = function (obj, ctx) {

        var pos = 0;
        while (obj.items.item(pos + 3)) {

          var b1 = obj.items.item(pos).getTransformMatrix(),
              b2 = obj.items.item(pos + 1).getTransformMatrix(),
              b3 = obj.items.item(pos + 2).getTransformMatrix(),
              b4 = obj.items.item(pos + 3).getTransformMatrix();

          if (pos == 0) ctx.moveTo(b1.m30(), b1.m31());

          ctx.bezierCurveTo(b2.m30(), b2.m31(), b3.m30(), b3.m31(), b4.m30(), b4.m31());

          pos += 3;
        }
      };

      /**
       * @param float obj
       */
      _myTrait_.childrenToSvgBezier = function (obj) {

        var pos = 0,
            str = "";
        while (obj.items.item(pos + 3)) {

          var b1 = obj.items.item(pos).getTransformMatrix(),
              b2 = obj.items.item(pos + 1).getTransformMatrix(),
              b3 = obj.items.item(pos + 2).getTransformMatrix(),
              b4 = obj.items.item(pos + 3).getTransformMatrix();

          if (pos == 0) str += "M " + b1.m30() + " " + b1.m31();

          str += " C ";
          str += " " + b2.m30() + " " + b2.m31();
          str += " " + b3.m30() + " " + b3.m31();
          str += " " + b4.m30() + " " + b4.m31();

          pos += 3;
        }

        return str;
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (t) {});
    })(this);
  };

  var pathTools = function pathTools(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof pathTools) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != pathTools._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new pathTools(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  pathTools._classInfo = {
    name: "pathTools"
  };
  pathTools.prototype = new pathTools_prototype();

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var drawLine_prototype = function drawLine_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {

      // Initialize static variables here...

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (sx, sy, ex, ey, options) {});
    })(this);
  };

  var drawLine = function drawLine(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof drawLine) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != drawLine._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new drawLine(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  drawLine._classInfo = {
    name: "drawLine"
  };
  drawLine.prototype = new drawLine_prototype();

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var svgPageRenderer_prototype = function svgPageRenderer_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.end = function (obj, display, data) {
        data.viewG.remove();
        data.viewG = null;
        data.viewObj = null;
      };

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.refresh = function (obj, display, data) {
        var cam = display.getCamera();
        var rm = cam.getRenderMatrix().createCopy().inverse();
        data.viewG.attr({
          transform: rm.getSVGTransform()
        });
      };

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.start = function (obj, display, data) {
        var surface = display.getSurface();
        if (!data.viewObj) {

          var main = surface.getSvg();
          var p = obj.displayParent();

          if (p && p.getRenderData) {
            var pData = p.getRenderData();
            if (pData.viewG) {
              main = pData.childG;
            }
          }

          data.viewG = main.g();
          data.viewObj = data.viewG.g();
          data.childG = data.viewG.g();

          obj.domMVC(data.childG, null, data);

          obj.matchDomPosition(main, data.viewG, obj);
        }
      };
    })(this);
  };

  var svgPageRenderer = function svgPageRenderer(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof svgPageRenderer) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != svgPageRenderer._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new svgPageRenderer(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  svgPageRenderer._classInfo = {
    name: "svgPageRenderer"
  };
  svgPageRenderer.prototype = new svgPageRenderer_prototype();

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var svgRectRenderer_prototype = function svgRectRenderer_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.end = function (obj, display, data) {
        data.viewG.remove();
        data.viewG = null;
        data.viewObj = null;
      };

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.refresh = function (obj, display, data) {
        var surface = display.getSurface();
        var bgStyle = "";
        var aList = {
          x: 0,
          y: 0,
          width: obj.w(),
          height: obj.h()

        };
        if (obj.bgcolor) {
          aList["fill"] = obj.bgcolor();
        }
        if (obj.alpha) {
          aList["fill-opacity"] = obj.alpha();
        }
        // obj.getViewMatrix(display.getCamera()).getSVGTransform()
        data.viewObj.attr(aList);
        data.viewG.attr({
          transform: obj.getLocalTransform().getSVGTransform()
        });
      };

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.start = function (obj, display, data) {

        var surface = display.getSurface();
        if (!data.viewObj) {

          var main = surface.getSvg();
          var p = obj.displayParent();

          if (p) {
            var pData = p.getRenderData();
            if (pData.viewG) {
              main = pData.childG;
            }
          }

          data.viewG = main.g();
          data.viewObj = data.viewG.rect({
            "data-id": obj.model().getID()
          });
          data.childG = data.viewG.g();
          obj.draggableFor(data.viewObj, display);

          obj.domMVC(data.childG, null, data);

          obj.matchDomPosition(main, data.viewG, obj);
          //    data.viewG._index = obj.indexOf();
        }
      };
    })(this);
  };

  var svgRectRenderer = function svgRectRenderer(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof svgRectRenderer) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != svgRectRenderer._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new svgRectRenderer(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  svgRectRenderer._classInfo = {
    name: "svgRectRenderer"
  };
  svgRectRenderer.prototype = new svgRectRenderer_prototype();

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var svgCircleRenderer_prototype = function svgCircleRenderer_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.end = function (obj, display, data) {
        data.viewG.remove();
        data.viewG = null;
        data.viewObj = null;
      };

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.refresh = function (obj, display, data) {
        var surface = display.getSurface();
        var bgStyle = "";
        var r = Math.min(obj.w() / 2, obj.h() / 2);
        var aList = {
          cx: r,
          cy: r,
          r: r
        };
        if (obj.bgcolor) {
          aList["fill"] = obj.bgcolor();
        }
        if (obj.alpha) {
          aList["fill-opacity"] = obj.alpha();
        }
        data.viewObj.attr(aList);
        data.viewG.attr({
          transform: obj.getLocalTransform().getSVGTransform()
        });
      };

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.start = function (obj, display, data) {

        var surface = display.getSurface();
        if (!data.viewObj) {

          var main = surface.getSvg();
          var p = obj.displayParent();

          if (p) {
            var pData = p.getRenderData();
            if (pData.viewG) {
              main = pData.childG;
            }
          }

          data.viewG = main.g();
          data.viewObj = data.viewG.circle({
            "data-id": obj.model().getID()
          });
          data.childG = data.viewG.g();
          obj.draggableFor(data.viewObj, display);

          obj.domMVC(data.childG, null, data);

          obj.matchDomPosition(main, data.viewG, obj);
        }
      };
    })(this);
  };

  var svgCircleRenderer = function svgCircleRenderer(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof svgCircleRenderer) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != svgCircleRenderer._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new svgCircleRenderer(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  svgCircleRenderer._classInfo = {
    name: "svgCircleRenderer"
  };
  svgCircleRenderer.prototype = new svgCircleRenderer_prototype();

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var svgTextRenderer_prototype = function svgTextRenderer_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.end = function (obj, display, data) {
        data.viewG.remove();
        data.viewG = null;
        data.viewObj = null;
      };

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.refresh = function (obj, display, data) {
        var surface = display.getSurface();
        var bgStyle = "";
        var r = Math.min(obj.w() / 2, obj.h() / 2),
            fs = 14;

        var aList = {
          x: 0,
          y: fs
        };

        if (obj.fontSize) {
          fs = aList["font-size"] = obj.fontSize();
        }

        if (obj.bgcolor) {
          aList["fill"] = obj.bgcolor();
        }

        aList["font-family"] = "Verdana";

        if (obj.alpha) {
          aList["fill-opacity"] = obj.alpha();
        }
        data.viewObj.text(obj.text());
        data.viewObj.attr(aList);
        data.viewG.attr({
          transform: obj.getLocalTransform().getSVGTransform()
        });
      };

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.start = function (obj, display, data) {

        var surface = display.getSurface();
        if (!data.viewObj) {

          var main = surface.getSvg();
          var p = obj.displayParent();

          if (p) {
            var pData = p.getRenderData();
            if (pData.viewG) {
              main = pData.childG;
            }
          }

          data.viewG = main.g();
          data.viewObj = data.viewG.svg_text({
            "data-id": obj.model().getID()
          });
          data.childG = data.viewG.g();
          obj.draggableFor(data.viewObj, display);

          obj.domMVC(data.childG, null, data);

          obj.matchDomPosition(main, data.viewG, obj);
        }
      };
    })(this);
  };

  var svgTextRenderer = function svgTextRenderer(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof svgTextRenderer) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != svgTextRenderer._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new svgTextRenderer(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  svgTextRenderer._classInfo = {
    name: "svgTextRenderer"
  };
  svgTextRenderer.prototype = new svgTextRenderer_prototype();

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var svgPathRenderer_prototype = function svgPathRenderer_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.end = function (obj, display, data) {
        data.viewG.remove();
        data.viewG = null;
        data.viewObj = null;
      };

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.refresh = function (obj, display, data) {

        var svgPath = obj.svgPath(),
            w = obj.w(),
            h = obj.h();

        var parser = obj.getSvgParser();
        /*
        parser.parse(svgPath);
        parser.makePathAbsolute();
        parser.fitPathInto( w, h );
        */
        // parser.drawPath( ctx, w, h);

        var pathStr = parser.svgString();
        if (!pathStr) {
          return;
        }

        var surface = display.getSurface();
        var bgStyle = "";
        var r = Math.min(obj.w() / 2, obj.h() / 2);
        var aList = {
          d: pathStr
        };
        if (obj.bgcolor) {
          aList["fill"] = obj.bgcolor();
        }
        if (obj.alpha) {
          aList["fill-opacity"] = obj.alpha();
        }
        data.viewObj.attr(aList);
        data.viewG.attr({
          transform: obj.getLocalTransform().getSVGTransform()
        });
      };

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.start = function (obj, display, data) {

        var surface = display.getSurface();
        if (!data.viewObj) {

          try {
            var main = surface.getSvg();
            var p = obj.displayParent();

            if (p) {
              var pData = p.getRenderData();
              if (pData.viewG) {
                main = pData.childG;
              }
            }

            data.viewG = main.g();
            data.viewObj = data.viewG.path({
              "data-id": obj.model().getID()
            });

            data.childG = data.viewG.g();
            obj.draggableFor(data.viewObj, display);

            obj.domMVC(data.childG, null, data);

            obj.matchDomPosition(main, data.viewG, obj);
          } catch (e) {}
        }
      };
    })(this);
  };

  var svgPathRenderer = function svgPathRenderer(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof svgPathRenderer) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != svgPathRenderer._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new svgPathRenderer(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  svgPathRenderer._classInfo = {
    name: "svgPathRenderer"
  };
  svgPathRenderer.prototype = new svgPathRenderer_prototype();

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var svgBezierObjectRenderer_prototype = function svgBezierObjectRenderer_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.end = function (obj, display, data) {
        data.viewG.remove();
        data.viewG = null;
        data.viewObj = null;
      };

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.refresh = function (obj, display, data) {

        var me = this;

        var svgPath = "",
            i = 0,
            cnt = 0;

        obj.forChildren(function (ch) {
          if (ch == obj) return;
          if (cnt == 0) {
            svgPath += "M " + ch.getX() + " " + ch.getY();
          } else {
            if (i == 0) svgPath += " C ";
            svgPath += ch.getX() + " " + ch.getY() + " ";
            i++;
            if (i == 3) i = 0;
          }
          cnt++;
        });

        var w = obj.w(),
            h = obj.h();
        /*
        var parser = svgPathParser();
        parser.parse(svgPath);
        parser.makePathAbsolute();
        parser.fitPathInto( w, h );
        */

        // parser.drawPath( ctx, w, h);
        var pathStr = svgPath;

        var surface = display.getSurface();
        var bgStyle = "";
        var r = Math.min(obj.w() / 2, obj.h() / 2);
        var aList = {
          d: pathStr
        };
        if (obj.bgcolor) {
          aList["fill"] = obj.bgcolor();
        }
        if (obj.alpha) {
          aList["fill-opacity"] = obj.alpha();
        }
        data.viewObj.attr(aList);
        data.viewG.attr({
          transform: obj.getLocalTransform().getSVGTransform()
        });
      };

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.start = function (obj, display, data) {

        var surface = display.getSurface();
        if (!data.viewObj) {

          var main = surface.getSvg();
          var p = obj.displayParent();

          if (p) {
            var pData = p.getRenderData();
            if (pData.viewG) {
              main = pData.childG;
            }
          }

          data.viewG = main.g();
          data.viewObj = data.viewG.path();
          data.childG = data.viewG.g();
          obj.draggableFor(data.viewObj, display);

          obj.domMVC(data.childG, null, data);

          obj.matchDomPosition(main, data.viewG, obj);
        }
      };
    })(this);
  };

  var svgBezierObjectRenderer = function svgBezierObjectRenderer(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof svgBezierObjectRenderer) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != svgBezierObjectRenderer._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new svgBezierObjectRenderer(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  svgBezierObjectRenderer._classInfo = {
    name: "svgBezierObjectRenderer"
  };
  svgBezierObjectRenderer.prototype = new svgBezierObjectRenderer_prototype();

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var svgBezierHandleRenderer_prototype = function svgBezierHandleRenderer_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.end = function (obj, display, data) {
        data.viewG.remove();
        data.viewG = null;
        data.viewObj = null;
      };

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.refresh = function (obj, display, data) {
        var surface = display.getSurface();
        var bgStyle = "";
        var aList = {
          x: -1 * obj.w() / 2,
          y: -1 * obj.h() / 2,
          width: obj.w(),
          height: obj.h()
        };
        if (obj.bgcolor) {
          aList["fill"] = obj.bgcolor();
        }
        if (obj.alpha) {
          aList["fill-opacity"] = obj.alpha();
        }
        // obj.getViewMatrix(display.getCamera()).getSVGTransform()
        data.viewObj.attr(aList);
        data.viewG.attr({
          transform: obj.getLocalTransform().getSVGTransform()
        });

        var prevObj = obj.prev();
        if (prevObj.renderClass() == "bezierhandle") {
          prevObj = obj.next();
        }

        data.crossLine.attr({
          stroke: "cyan",
          x1: prevObj.getX(),
          y1: prevObj.getY(),
          x2: obj.getX(),
          y2: obj.getY()
        });

        /*
             data.crossLine = drawLine(100,100,500,100, {bgColor:"cyan", weight:1});
            main.add( data.crossLine.getElem() );         
            
            main.add( icon.getElem() );
        }
        }, 
        function(obj, display, data) {
        
        var camera = display.getCamera(),
            surface = display.getSurface(),
            main = _e( display.getSurface().getDom() ),
            perspective = 1000;
            
        var docWidth = surface.getWidth(),
            docHeight = surface.getHeight();    
            
        var prevObj = obj.prev();
        if(prevObj.renderClass()=="pathhandle") {
            prevObj = obj.next();
        }
        
        rendM = obj.getRenderMatrix().createCopy();
        var sv = rendM.screenProjection({
            x: 0, y : 0, z:0, w:1
        }, {
            d : perspective,
            cx : docWidth/2,
            cy : docHeight/2
        });
        data.viewObj.moveTo( sv.x, sv.y, 15 );
         rendM = prevObj.getRenderMatrix().createCopy();
        var sv2 = rendM.screenProjection({
            x: 0, y : 0, z:0, w:1
        }, {
            d : perspective,
            cx : docWidth/2,
            cy : docHeight/2
        });
        data.crossLine.moveTo( sv.x, sv.y, sv2.x, sv2.y);
        */
      };

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.start = function (obj, display, data) {

        var surface = display.getSurface();
        if (!data.viewObj) {

          var main = surface.getSvg();
          var p = obj.displayParent();

          if (p) {
            var pData = p.getRenderData();
            if (pData.viewG) {
              main = pData.childG;
            }
          }

          data.viewG = main.g();
          data.viewObj = data.viewG.rect();

          data.crossLine = data.viewG.parent().parent().line().attr({
            stroke: "cyan",
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0
          });

          data.childG = data.viewG.g();
          obj.draggableFor(data.viewObj, display);

          obj.domMVC(data.childG, null, data);
          obj.matchDomPosition(main, data.viewG, obj);
          //    data.viewG._index = obj.indexOf();
        }
      };
    })(this);
  };

  var svgBezierHandleRenderer = function svgBezierHandleRenderer(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof svgBezierHandleRenderer) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != svgBezierHandleRenderer._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new svgBezierHandleRenderer(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  svgBezierHandleRenderer._classInfo = {
    name: "svgBezierHandleRenderer"
  };
  svgBezierHandleRenderer.prototype = new svgBezierHandleRenderer_prototype();

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var svgBezierPointRenderer_prototype = function svgBezierPointRenderer_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.end = function (obj, display, data) {
        data.viewG.remove();
        data.viewG = null;
        data.viewObj = null;
      };

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.refresh = function (obj, display, data) {
        var surface = display.getSurface();
        var bgStyle = "";
        var r = Math.min(obj.w() / 2, obj.h() / 2);
        var aList = {
          cx: 0,
          cy: 0,
          r: r
        };
        if (obj.bgcolor) {
          aList["fill"] = obj.bgcolor();
        }
        if (obj.alpha) {
          aList["fill-opacity"] = obj.alpha();
        }
        data.viewObj.attr(aList);
        data.viewG.attr({
          transform: obj.getLocalTransform().getSVGTransform()
        });
      };

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.start = function (obj, display, data) {

        var surface = display.getSurface();
        if (!data.viewObj) {

          var main = surface.getSvg();
          var p = obj.displayParent();

          if (p) {
            var pData = p.getRenderData();
            if (pData.viewG) {
              main = pData.childG;
            }
          }

          data.viewG = main.g();
          data.viewObj = data.viewG.circle();
          data.childG = data.viewG.g();
          obj.draggableFor(data.viewObj, display);

          obj.domMVC(data.childG, null, data);

          obj.matchDomPosition(main, data.viewG, obj);
        }
      };
    })(this);
  };

  var svgBezierPointRenderer = function svgBezierPointRenderer(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof svgBezierPointRenderer) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != svgBezierPointRenderer._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new svgBezierPointRenderer(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  svgBezierPointRenderer._classInfo = {
    name: "svgBezierPointRenderer"
  };
  svgBezierPointRenderer.prototype = new svgBezierPointRenderer_prototype();

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var svgImageRenderer_prototype = function svgImageRenderer_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.end = function (obj, display, data) {
        data.viewG.remove();
        data.viewG = null;
        data.viewObj = null;
      };

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.refresh = function (obj, display, data) {
        if (!data._imageObj) return;
        if (!data._width) return;

        var surface = display.getSurface();
        var aList = {};

        if (obj.alpha) {
          aList["opacity"] = obj.alpha();
        }
        /*
        data.viewObj = data.viewG.image({
        "xlink:href" : obj.url(),
        x : 0, y : 0, height : 200, width:200
        });
        */
        // data.viewObj

        data.viewObj.attr(aList);
        data.viewObj.attr({
          "xlink:href": obj.url(),
          "width": obj.w(),
          "height": obj.w() * (data._height / data._width)
        });
        data.viewG.attr({
          "transform": obj.getLocalTransform().getSVGTransform()
        });
      };

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.start = function (obj, display, data) {
        // <image xlink:href="firefox.jpg" x="0" y="0" height="50px" width="50px"/>

        if (!data._imageObj) {
          var imageObj = new Image();
          imageObj.onload = function () {
            data._imageObj = imageObj;
            data._width = data._imageObj.width;
            data._height = data._imageObj.height;
            // context.drawImage(imageObj, 69, 50);
          };
          imageObj.src = obj.url();
        }

        var surface = display.getSurface();
        if (!data.viewObj) {

          var main = surface.getSvg();
          var p = obj.displayParent();

          if (p) {
            var pData = p.getRenderData();
            if (pData.viewG) {
              main = pData.childG;
            }
          }
          /*
          s.g().image({
          "xlink:href" : "/static/s1.png",
          x : 0, y : 0, height : 200, width:200
          });
          */

          data.viewG = main.g();
          data.viewObj = data.viewG.image({
            "xlink:href": obj.url(),
            x: 0,
            y: 0,
            height: obj.w(),
            width: obj.h(),
            "data-id": obj.model().getID()
          });
          data.childG = data.viewG.g();
          obj.draggableFor(data.viewObj, display);

          obj.domMVC(data.childG, null, data);

          obj.matchDomPosition(main, data.viewG, obj);
        }
      };
    })(this);
  };

  var svgImageRenderer = function svgImageRenderer(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof svgImageRenderer) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != svgImageRenderer._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new svgImageRenderer(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  svgImageRenderer._classInfo = {
    name: "svgImageRenderer"
  };
  svgImageRenderer.prototype = new svgImageRenderer_prototype();

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var svgPathRenderer2_prototype = function svgPathRenderer2_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.end = function (obj, display, data) {
        data.viewG.remove();
        data.viewG = null;
        data.viewObj = null;
      };

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.refresh = function (obj, display, data) {
        var svgPath = obj.svgPath(),
            w = obj.w(),
            h = obj.h();

        var surface = display.getSurface();
        var bgStyle = "";
        var r = Math.min(obj.w() / 2, obj.h() / 2);
        var aList = {
          d: svgPath
        };
        if (obj.bgcolor) {
          aList["fill"] = obj.bgcolor();
        }
        if (obj.alpha) {
          aList["fill-opacity"] = obj.alpha();
        }
        data.viewObj.attr(aList);
        data.viewG.attr({
          transform: obj.getLocalTransform().getSVGTransform()
        });
      };

      /**
       * @param float obj
       * @param float display
       * @param float data
       */
      _myTrait_.start = function (obj, display, data) {

        var surface = display.getSurface();
        if (!data.viewObj) {

          var main = surface.getSvg();
          var p = obj.displayParent();

          if (p) {
            var pData = p.getRenderData();
            if (pData.viewG) {
              main = pData.childG;
            }
          }

          data.viewG = main.g();
          data.viewObj = data.viewG.path({
            "data-id": obj.model().getID()
          });

          data.childG = data.viewG.g();
          obj.draggableFor(data.viewObj, display);

          obj.domMVC(data.childG, null, data);

          obj.matchDomPosition(main, data.viewG, obj);
        }
      };
    })(this);
  };

  var svgPathRenderer2 = function svgPathRenderer2(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof svgPathRenderer2) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != svgPathRenderer2._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new svgPathRenderer2(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  svgPathRenderer2._classInfo = {
    name: "svgPathRenderer2"
  };
  svgPathRenderer2.prototype = new svgPathRenderer2_prototype();

  var rendererPackageSVG_prototype = function rendererPackageSVG_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {

      // Initialize static variables here...

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (main) {});

      /**
       * @param float surface
       */
      _myTrait_.initSvg = function (surface) {

        surface.registerRenderer("page", new svgPageRenderer());
        surface.registerRenderer("none", new svgPageRenderer());
        surface.registerRenderer("camera", new svgPageRenderer());

        surface.registerRenderer("box", new svgRectRenderer());
        surface.registerRenderer("circle", new svgCircleRenderer());
        surface.registerRenderer("text", new svgTextRenderer());
        surface.registerRenderer("svgpath", new svgPathRenderer());
        surface.registerRenderer("path", new svgPathRenderer2());

        surface.registerRenderer("bezierpath", new svgBezierObjectRenderer());
        surface.registerRenderer("bezierpoint", new svgBezierPointRenderer());
        surface.registerRenderer("bezierhandle", new svgBezierHandleRenderer());

        // svgImageRenderer

        surface.registerRenderer("image", new svgImageRenderer());
      };
    })(this);
  };

  var rendererPackageSVG = function rendererPackageSVG(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof rendererPackageSVG) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != rendererPackageSVG._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new rendererPackageSVG(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  rendererPackageSVG._classInfo = {
    name: "rendererPackageSVG"
  };
  rendererPackageSVG.prototype = new rendererPackageSVG_prototype();

  (function () {
    if (typeof define !== "undefined" && define !== null && define.amd != null) {
      __amdDefs__["rendererPackageSVG"] = rendererPackageSVG;
      this.rendererPackageSVG = rendererPackageSVG;
    } else if (typeof module !== "undefined" && module !== null && module.exports != null) {
      module.exports["rendererPackageSVG"] = rendererPackageSVG;
    } else {
      this.rendererPackageSVG = rendererPackageSVG;
    }
  }).call(new Function("return this")());

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var surfaceDomSVGLayer_prototype = function surfaceDomSVGLayer_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {
      var _renderFns;
      var _sfaceCnt;

      // Initialize static variables here...

      /**
       * @param float t
       */
      _myTrait_.getHoverLayer = function (t) {};

      /**
       * @param float t
       */
      _myTrait_.getSvg = function (t) {
        return this._svg;
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (elem, width, height) {

        this._dom = elem._dom;
        this._width = width;
        this._height = height;

        this._svg = elem;

        if (!this._renderFns) {
          this._renderFns = {};
        }
      });
    })(this);
  };

  var surfaceDomSVGLayer = function surfaceDomSVGLayer(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof surfaceDomSVGLayer) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != surfaceDomSVGLayer._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new surfaceDomSVGLayer(a, b, c, d, e, f, g, h);
  };
  // inheritance is here surface

  surfaceDomSVGLayer_prototype.prototype = surface.prototype;

  surfaceDomSVGLayer._classInfo = {
    name: "surfaceDomSVGLayer"
  };
  surfaceDomSVGLayer.prototype = new surfaceDomSVGLayer_prototype();

  (function () {
    if (typeof define !== "undefined" && define !== null && define.amd != null) {
      __amdDefs__["surfaceDomSVGLayer"] = surfaceDomSVGLayer;
      this.surfaceDomSVGLayer = surfaceDomSVGLayer;
    } else if (typeof module !== "undefined" && module !== null && module.exports != null) {
      module.exports["surfaceDomSVGLayer"] = surfaceDomSVGLayer;
    } else {
      this.surfaceDomSVGLayer = surfaceDomSVGLayer;
    }
  }).call(new Function("return this")());

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var jsVectors_prototype = function jsVectors_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {
      var projectionMatrix;
      var jVect;
      var iVect;
      var pBase;
      var tn1;
      var nv1;
      var barCoeffs;
      var deVector;

      // Initialize static variables here...

      /**
       * @param Object v1
       * @param Object v2
       */
      _myTrait_.add = function (v1, v2) {

        v1.x = v1.x + v2.x;
        v1.y = v1.y + v2.y;
      };

      /**
       * @param Object v1
       * @param Object v2
       */
      _myTrait_.angleBetween = function (v1, v2) {

        var n1 = this.normalize({
          x: v1.x,
          y: v1.y
        });
        var n2 = this.normalize({
          x: v2.x,
          y: v2.y
        });

        var cp = this.crossProd(n1, n2);
        var dp = this.dotProd(n1, n2);

        var a = Math.acos(dp);
        if (cp < 0) a = a * -1; // other side...
        return a;
      };

      /**
       * @param Object t
       * @param Object p0
       * @param Object p1
       * @param Object p2
       * @param Object p3
       */
      _myTrait_.calc_cat = function (t, p0, p1, p2, p3) {

        var t2 = t * t;
        var t3 = t2 * t;
        return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
      };

      /**
       * @param Object v1
       * @param Object v2
       */
      _myTrait_.crossProd = function (v1, v2) {

        // U x V = Ux*Vy-Uy*Vx
        return v1.x * v2.y - v1.y * v2.x;
      };

      /**
       * @param Object p1
       * @param Object p2
       */
      _myTrait_.diff = function (p1, p2) {

        return {
          x: p2.x - p1.x,
          y: p2.y - p1.y
        };
      };

      /**
       * @param Object p1
       * @param Object p2
       */
      _myTrait_.dist = function (p1, p2) {

        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;
        return Math.sqrt(dx * dx + dy * dy);
      };

      /**
       * @param Object v1
       * @param Object v2
       */
      _myTrait_.dotProd = function (v1, v2) {

        return v1.x * v2.x + v1.y * v2.y;
      };

      /**
       * @param Object p0
       * @param Object p1
       * @param Object p2
       */
      _myTrait_.getBarCoeffs = function (p0, p1, p2) {

        var bb = barCoeffs;
        bb.A = 1 / 2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
        bb.sign = bb.A < 0 ? -1 : 1;
        bb.s1 = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y)) * bb.sign;
        bb.s2 = (p2.y - p0.y) * bb.sign;
        bb.s3 = (p0.x - p2.x) * bb.sign;
        bb.t1 = (p0.x * p1.y - p0.y * p1.x) * bb.sign;
        bb.t2 = (p0.y - p1.y) * bb.sign;
        bb.t3 = (p1.x - p0.x) * bb.sign;
        return bb;
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (t) {

        if (!tn1) {

          tn1 = {
            x: 0,
            y: 0
          };
          nv1 = {
            x: 0,
            y: 0
          };

          projectionMatrix = [0, 0, 0, 0];

          jVect = {
            x: 0,
            y: 0
          };
          iVect = {
            x: 0,
            y: 0
          };
          pBase = {
            x: 0,
            y: 0
          };

          barCoeffs = {
            Area: 0,
            s1: 0,
            s2: 0,
            s3: 0,
            t1: 0,
            t2: 0,
            t3: 0,
            sign: 0
          };
          deVector = {
            x: 0,
            y: 0
          };
        }
      });

      /**
       * @param Object p1
       * @param Object p2
       */
      _myTrait_.initProjection = function (p1, p2) {

        iVect.y = p2.y - p1.y;
        iVect.x = p2.x - p1.x;

        jVect.y = iVect.y;
        jVect.x = iVect.x;

        this.normalize(iVect);
        this.normalize(jVect);

        this.rotate(jVect, Math.PI / 2);

        pBase.x = p1.x;
        pBase.y = p1.y;
      };

      /**
       * @param Object p1
       */
      _myTrait_.length = function (p1) {

        var dx = p1.x;
        var dy = p1.y;
        return Math.sqrt(dx * dx + dy * dy);
      };

      /**
       * @param Object p0
       * @param Object p1
       * @param Object v0
       * @param Object v1
       */
      _myTrait_.linesIntersect = function (p0, p1, v0, v1) {

        var x1 = p0.x,
            y1 = p0.y,
            x2 = p1.x,
            y2 = p1.y,
            x3 = v0.x,
            y3 = v0.y,
            x4 = v1.x,
            y4 = v1.y;

        var x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
        var y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
        if (isNaN(x) || isNaN(y)) {
          return false;
        } else {
          if (x1 >= x2) {
            if (!(x2 <= x && x <= x1)) {
              return false;
            }
          } else {
            if (!(x1 <= x && x <= x2)) {
              return false;
            }
          }
          if (y1 >= y2) {
            if (!(y2 <= y && y <= y1)) {
              return false;
            }
          } else {
            if (!(y1 <= y && y <= y2)) {
              return false;
            }
          }
          if (x3 >= x4) {
            if (!(x4 <= x && x <= x3)) {
              return false;
            }
          } else {
            if (!(x3 <= x && x <= x4)) {
              return false;
            }
          }
          if (y3 >= y4) {
            if (!(y4 <= y && y <= y3)) {
              return false;
            }
          } else {
            if (!(y3 <= y && y <= y4)) {
              return false;
            }
          }
        }
        return true;
      };

      /**
       * @param Object v1
       * @param Object along
       * @param Object base
       */
      _myTrait_.mirrorVector = function (v1, along, base) {

        // the direction tangent and normal are normalized and the vector is projected into it           
        tn1.x = along.x - base.x;
        tn1.y = along.y - base.y;
        nv1.x = -tn1.y;
        nv1.y = tn1.x;

        v1.x = v1.x - base.x;
        v1.y = v1.y - base.y;

        // if the 'j' or normal projection is positive, turn around
        if (this.dotProd(v1, nv1) > 0) this.rotate(nv1, Math.PI);

        this.normalize(tn1);
        this.normalize(nv1);

        // Create positive coordinates of the projection of the vector to the 'base' cordinates
        var nvProd = Math.abs(this.dotProd(v1, nv1));
        //             tnProd = Math.abs( this.dotProd(v1,tn1) );

        var tnProd = this.dotProd(v1, tn1);
        // then, project the length of the base vectors to get the new vector space
        v1.x = nv1.x * nvProd + tn1.x * tnProd, v1.y = nv1.y * nvProd + tn1.y * tnProd;

        v1.x += base.x;
        v1.y += base.y;

        return v1;
      };

      /**
       * @param Object v
       */
      _myTrait_.normalize = function (v) {

        var len = Math.sqrt(v.x * v.x + v.y * v.y);

        if (len == 0) {
          throw "Error normalizing vector: the length of the vector was zero";
        }

        v.x = v.x / len;
        v.y = v.y / len;
        return v;
      };

      /**
       * @param Object v1
       * @param Object along
       */
      _myTrait_.opposeVector = function (v1, along) {

        // the direction tangent and normal are normalized and the vector is projected into it           
        tn1.x = along, x;
        tn1.y = along.y;
        nv1.x = -tn1.y;
        nv1.y = tn1.x;

        this.normalize(tn1);
        this.normalize(nv1);

        // Important: turn the tangent to opposing direction...
        this.rotate(tn1, Math.PI);

        // Create the projection of the vector to the 'base' cordinates
        var nvProd = Math.abs(jsMath.dotProd(v1, nv1)),
            tnProd = Math.abs(jsMath.dotProd(v1, tn1));

        // if the 'j' or normal projection is negative, turn around
        if (this.dotProd(v1, nv1) < 0) this.rotate(nv1, Math.PI);

        // then, project the length of the vector to get the new vector
        v1.x = nv1.x * nvProd + tn1.x * tnProd, v1.y = nv1.y * nvProd + tn1.y * tnProd;

        return v1;
      };

      /**
       * @param Object p
       * @param Object p0
       * @param Object p1
       * @param Object p2
       */
      _myTrait_.pointInTriangle = function (p, p0, p1, p2) {

        var A = 1 / 2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
        var sign = A < 0 ? -1 : 1;
        var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
        var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;

        return s > 0 && t > 0 && s + t < 2 * A * sign;
      };

      /**
       * @param Object p
       * @param Object bb
       */
      _myTrait_.pointInTriangleBc = function (p, bb) {

        var A = bb.A;
        var sign = bb.sign;
        var s = bb.s1 + bb.s2 * p.x + bb.s3 * p.y;
        var t = bb.t1 + bb.t2 * p.x + bb.t3 * p.y;

        return s > 0 && t > 0 && s + t < 2 * A * sign;
      };

      /**
       * @param Object vectorToProject
       */
      _myTrait_.project = function (vectorToProject) {

        var p = vectorToProject;

        pVector.x = p.x - pBase.x;
        pVector.y = p.y - pBase.y;

        prodResult.i = this.dotProd(pVector, iVect);
        prodResult.j = this.dotProd(pVector, jVect);

        return prodResult;
      };

      /**
       * @param Object v
       * @param Object angle
       */
      _myTrait_.rotate = function (v, angle) {

        var s = Math.sin(angle);
        var c = Math.cos(angle);

        var x = v.x,
            y = v.y;

        v.x = x * c + y * s;
        v.y = -x * s + y * c;

        return v;
      };

      /**
       * @param Object angle
       * @param Object v
       * @param Object around
       */
      _myTrait_.rotateAround = function (angle, v, around) {

        this.sub(v, around);
        this.rotate(v, angle);
        this.add(v, around);
      };

      /**
       * @param Object v1
       * @param Object v2
       */
      _myTrait_.sub = function (v1, v2) {

        v1.x = v1.x - v2.x;
        v1.y = v1.y - v2.y;
      };

      /**
       * @param Object v1
       * @param Object v2
       * @param Object v3
       */
      _myTrait_.tangentNormal = function (v1, v2, v3) {

        var t1 = {};
        t1.x = v2.x - v1.x;
        t1.y = v2.y - v1.y;
        var t2 = {};
        t2.x = v3.x - v2.x;
        t2.y = v3.y - v2.y;

        var p = {
          x: t1.x + t2.x,
          y: t1.y + t2.y
        };
        return this.normalize(p);
      };

      /**
       * @param Object A
       * @param Object B
       * @param Object C
       */
      _myTrait_.triangleArea = function (A, B, C) {

        var area = A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y);

        return Math.abs(area / 2);
      };

      /**
       * @param Object p0
       * @param Object p1
       * @param Object p2
       * @param Object q0
       * @param Object q1
       * @param Object q2
       */
      _myTrait_.triangleInTriangle = function (p0, p1, p2, q0, q1, q2) {

        var bb = this.getBarCoeffs(p0, p1, p2);

        if (this.pointInTriangleBc(q0, bb)) return true;
        if (this.pointInTriangleBc(q1, bb)) return true;
        if (this.pointInTriangleBc(q2, bb)) return true;

        var bb = this.getBarCoeffs(q0, q1, q2);

        if (this.pointInTriangleBc(p0, bb)) return true;
        if (this.pointInTriangleBc(p1, bb)) return true;
        if (this.pointInTriangleBc(p2, bb)) return true;

        if (this.linesIntersect(p0, p1, q0, q1)) return true;
        if (this.linesIntersect(p1, p2, q0, q1)) return true;
        if (this.linesIntersect(p2, p0, q0, q1)) return true;

        if (this.linesIntersect(p0, p1, q1, q2)) return true;
        if (this.linesIntersect(p1, p2, q1, q2)) return true;
        if (this.linesIntersect(p2, p0, q1, q2)) return true;

        if (this.linesIntersect(p0, p1, q2, q0)) return true;
        if (this.linesIntersect(p1, p2, q2, q0)) return true;
        if (this.linesIntersect(p2, p0, q2, q0)) return true;

        return false;
      };

      /**
       * @param Object projectedVector
       */
      _myTrait_.unProject = function (projectedVector) {

        var p = projectedVector;
        deVector.x = p.i * iVect.x + p.j * jVect.x;
        deVector.y = p.i * iVect.y + p.j * jVect.y;

        deVector.x += pBase.x;
        deVector.y += pBase.y;
        return deVector;
      };
    })(this);
  };

  var jsVectors = function jsVectors(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof jsVectors) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != jsVectors._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new jsVectors(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  jsVectors._classInfo = {
    name: "jsVectors"
  };
  jsVectors.prototype = new jsVectors_prototype();

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var jsVectors_prototype = function jsVectors_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {
      var projectionMatrix;
      var jVect;
      var iVect;
      var pBase;
      var tn1;
      var nv1;
      var barCoeffs;
      var deVector;

      // Initialize static variables here...

      /**
       * @param Object v1
       * @param Object v2
       */
      _myTrait_.add = function (v1, v2) {

        v1.x = v1.x + v2.x;
        v1.y = v1.y + v2.y;
      };

      /**
       * @param Object v1
       * @param Object v2
       */
      _myTrait_.angleBetween = function (v1, v2) {

        var n1 = this.normalize({
          x: v1.x,
          y: v1.y
        });
        var n2 = this.normalize({
          x: v2.x,
          y: v2.y
        });

        var cp = this.crossProd(n1, n2);
        var dp = this.dotProd(n1, n2);

        var a = Math.acos(dp);
        if (cp < 0) a = a * -1; // other side...
        return a;
      };

      /**
       * @param Object t
       * @param Object p0
       * @param Object p1
       * @param Object p2
       * @param Object p3
       */
      _myTrait_.calc_cat = function (t, p0, p1, p2, p3) {

        var t2 = t * t;
        var t3 = t2 * t;
        return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
      };

      /**
       * @param Object v1
       * @param Object v2
       */
      _myTrait_.crossProd = function (v1, v2) {

        // U x V = Ux*Vy-Uy*Vx
        return v1.x * v2.y - v1.y * v2.x;
      };

      /**
       * @param Object p1
       * @param Object p2
       */
      _myTrait_.diff = function (p1, p2) {

        return {
          x: p2.x - p1.x,
          y: p2.y - p1.y
        };
      };

      /**
       * @param Object p1
       * @param Object p2
       */
      _myTrait_.dist = function (p1, p2) {

        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;
        return Math.sqrt(dx * dx + dy * dy);
      };

      /**
       * @param Object v1
       * @param Object v2
       */
      _myTrait_.dotProd = function (v1, v2) {

        return v1.x * v2.x + v1.y * v2.y;
      };

      /**
       * @param Object p0
       * @param Object p1
       * @param Object p2
       */
      _myTrait_.getBarCoeffs = function (p0, p1, p2) {

        var bb = barCoeffs;
        bb.A = 1 / 2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
        bb.sign = bb.A < 0 ? -1 : 1;
        bb.s1 = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y)) * bb.sign;
        bb.s2 = (p2.y - p0.y) * bb.sign;
        bb.s3 = (p0.x - p2.x) * bb.sign;
        bb.t1 = (p0.x * p1.y - p0.y * p1.x) * bb.sign;
        bb.t2 = (p0.y - p1.y) * bb.sign;
        bb.t3 = (p1.x - p0.x) * bb.sign;
        return bb;
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (t) {

        if (!tn1) {

          tn1 = {
            x: 0,
            y: 0
          };
          nv1 = {
            x: 0,
            y: 0
          };

          projectionMatrix = [0, 0, 0, 0];

          jVect = {
            x: 0,
            y: 0
          };
          iVect = {
            x: 0,
            y: 0
          };
          pBase = {
            x: 0,
            y: 0
          };

          barCoeffs = {
            Area: 0,
            s1: 0,
            s2: 0,
            s3: 0,
            t1: 0,
            t2: 0,
            t3: 0,
            sign: 0
          };
          deVector = {
            x: 0,
            y: 0
          };
        }
      });

      /**
       * @param Object p1
       * @param Object p2
       */
      _myTrait_.initProjection = function (p1, p2) {

        iVect.y = p2.y - p1.y;
        iVect.x = p2.x - p1.x;

        jVect.y = iVect.y;
        jVect.x = iVect.x;

        this.normalize(iVect);
        this.normalize(jVect);

        this.rotate(jVect, Math.PI / 2);

        pBase.x = p1.x;
        pBase.y = p1.y;
      };

      /**
       * @param Object p1
       */
      _myTrait_.length = function (p1) {

        var dx = p1.x;
        var dy = p1.y;
        return Math.sqrt(dx * dx + dy * dy);
      };

      /**
       * @param Object p0
       * @param Object p1
       * @param Object v0
       * @param Object v1
       */
      _myTrait_.linesIntersect = function (p0, p1, v0, v1) {

        var x1 = p0.x,
            y1 = p0.y,
            x2 = p1.x,
            y2 = p1.y,
            x3 = v0.x,
            y3 = v0.y,
            x4 = v1.x,
            y4 = v1.y;

        var x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
        var y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
        if (isNaN(x) || isNaN(y)) {
          return false;
        } else {
          if (x1 >= x2) {
            if (!(x2 <= x && x <= x1)) {
              return false;
            }
          } else {
            if (!(x1 <= x && x <= x2)) {
              return false;
            }
          }
          if (y1 >= y2) {
            if (!(y2 <= y && y <= y1)) {
              return false;
            }
          } else {
            if (!(y1 <= y && y <= y2)) {
              return false;
            }
          }
          if (x3 >= x4) {
            if (!(x4 <= x && x <= x3)) {
              return false;
            }
          } else {
            if (!(x3 <= x && x <= x4)) {
              return false;
            }
          }
          if (y3 >= y4) {
            if (!(y4 <= y && y <= y3)) {
              return false;
            }
          } else {
            if (!(y3 <= y && y <= y4)) {
              return false;
            }
          }
        }
        return true;
      };

      /**
       * @param Object v1
       * @param Object along
       * @param Object base
       */
      _myTrait_.mirrorVector = function (v1, along, base) {

        // the direction tangent and normal are normalized and the vector is projected into it           
        tn1.x = along.x - base.x;
        tn1.y = along.y - base.y;
        nv1.x = -tn1.y;
        nv1.y = tn1.x;

        v1.x = v1.x - base.x;
        v1.y = v1.y - base.y;

        // if the 'j' or normal projection is positive, turn around
        if (this.dotProd(v1, nv1) > 0) this.rotate(nv1, Math.PI);

        this.normalize(tn1);
        this.normalize(nv1);

        // Create positive coordinates of the projection of the vector to the 'base' cordinates
        var nvProd = Math.abs(this.dotProd(v1, nv1));
        //             tnProd = Math.abs( this.dotProd(v1,tn1) );

        var tnProd = this.dotProd(v1, tn1);
        // then, project the length of the base vectors to get the new vector space
        v1.x = nv1.x * nvProd + tn1.x * tnProd, v1.y = nv1.y * nvProd + tn1.y * tnProd;

        v1.x += base.x;
        v1.y += base.y;

        return v1;
      };

      /**
       * @param Object v
       */
      _myTrait_.normalize = function (v) {

        var len = Math.sqrt(v.x * v.x + v.y * v.y);

        if (len == 0) {
          throw "Error normalizing vector: the length of the vector was zero";
        }

        v.x = v.x / len;
        v.y = v.y / len;
        return v;
      };

      /**
       * @param Object v1
       * @param Object along
       */
      _myTrait_.opposeVector = function (v1, along) {

        // the direction tangent and normal are normalized and the vector is projected into it           
        tn1.x = along, x;
        tn1.y = along.y;
        nv1.x = -tn1.y;
        nv1.y = tn1.x;

        this.normalize(tn1);
        this.normalize(nv1);

        // Important: turn the tangent to opposing direction...
        this.rotate(tn1, Math.PI);

        // Create the projection of the vector to the 'base' cordinates
        var nvProd = Math.abs(jsMath.dotProd(v1, nv1)),
            tnProd = Math.abs(jsMath.dotProd(v1, tn1));

        // if the 'j' or normal projection is negative, turn around
        if (this.dotProd(v1, nv1) < 0) this.rotate(nv1, Math.PI);

        // then, project the length of the vector to get the new vector
        v1.x = nv1.x * nvProd + tn1.x * tnProd, v1.y = nv1.y * nvProd + tn1.y * tnProd;

        return v1;
      };

      /**
       * @param Object p
       * @param Object p0
       * @param Object p1
       * @param Object p2
       */
      _myTrait_.pointInTriangle = function (p, p0, p1, p2) {

        var A = 1 / 2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
        var sign = A < 0 ? -1 : 1;
        var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
        var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;

        return s > 0 && t > 0 && s + t < 2 * A * sign;
      };

      /**
       * @param Object p
       * @param Object bb
       */
      _myTrait_.pointInTriangleBc = function (p, bb) {

        var A = bb.A;
        var sign = bb.sign;
        var s = bb.s1 + bb.s2 * p.x + bb.s3 * p.y;
        var t = bb.t1 + bb.t2 * p.x + bb.t3 * p.y;

        return s > 0 && t > 0 && s + t < 2 * A * sign;
      };

      /**
       * @param Object vectorToProject
       */
      _myTrait_.project = function (vectorToProject) {

        var p = vectorToProject;

        pVector.x = p.x - pBase.x;
        pVector.y = p.y - pBase.y;

        prodResult.i = this.dotProd(pVector, iVect);
        prodResult.j = this.dotProd(pVector, jVect);

        return prodResult;
      };

      /**
       * @param Object v
       * @param Object angle
       */
      _myTrait_.rotate = function (v, angle) {

        var s = Math.sin(angle);
        var c = Math.cos(angle);

        var x = v.x,
            y = v.y;

        v.x = x * c + y * s;
        v.y = -x * s + y * c;

        return v;
      };

      /**
       * @param Object angle
       * @param Object v
       * @param Object around
       */
      _myTrait_.rotateAround = function (angle, v, around) {

        this.sub(v, around);
        this.rotate(v, angle);
        this.add(v, around);
      };

      /**
       * @param Object v1
       * @param Object v2
       */
      _myTrait_.sub = function (v1, v2) {

        v1.x = v1.x - v2.x;
        v1.y = v1.y - v2.y;
      };

      /**
       * @param Object v1
       * @param Object v2
       * @param Object v3
       */
      _myTrait_.tangentNormal = function (v1, v2, v3) {

        var t1 = {};
        t1.x = v2.x - v1.x;
        t1.y = v2.y - v1.y;
        var t2 = {};
        t2.x = v3.x - v2.x;
        t2.y = v3.y - v2.y;

        var p = {
          x: t1.x + t2.x,
          y: t1.y + t2.y
        };
        return this.normalize(p);
      };

      /**
       * @param Object A
       * @param Object B
       * @param Object C
       */
      _myTrait_.triangleArea = function (A, B, C) {

        var area = A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y);

        return Math.abs(area / 2);
      };

      /**
       * @param Object p0
       * @param Object p1
       * @param Object p2
       * @param Object q0
       * @param Object q1
       * @param Object q2
       */
      _myTrait_.triangleInTriangle = function (p0, p1, p2, q0, q1, q2) {

        var bb = this.getBarCoeffs(p0, p1, p2);

        if (this.pointInTriangleBc(q0, bb)) return true;
        if (this.pointInTriangleBc(q1, bb)) return true;
        if (this.pointInTriangleBc(q2, bb)) return true;

        var bb = this.getBarCoeffs(q0, q1, q2);

        if (this.pointInTriangleBc(p0, bb)) return true;
        if (this.pointInTriangleBc(p1, bb)) return true;
        if (this.pointInTriangleBc(p2, bb)) return true;

        if (this.linesIntersect(p0, p1, q0, q1)) return true;
        if (this.linesIntersect(p1, p2, q0, q1)) return true;
        if (this.linesIntersect(p2, p0, q0, q1)) return true;

        if (this.linesIntersect(p0, p1, q1, q2)) return true;
        if (this.linesIntersect(p1, p2, q1, q2)) return true;
        if (this.linesIntersect(p2, p0, q1, q2)) return true;

        if (this.linesIntersect(p0, p1, q2, q0)) return true;
        if (this.linesIntersect(p1, p2, q2, q0)) return true;
        if (this.linesIntersect(p2, p0, q2, q0)) return true;

        return false;
      };

      /**
       * @param Object projectedVector
       */
      _myTrait_.unProject = function (projectedVector) {

        var p = projectedVector;
        deVector.x = p.i * iVect.x + p.j * jVect.x;
        deVector.y = p.i * iVect.y + p.j * jVect.y;

        deVector.x += pBase.x;
        deVector.y += pBase.y;
        return deVector;
      };
    })(this);
  };

  var jsVectors = function jsVectors(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof jsVectors) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != jsVectors._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new jsVectors(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  jsVectors._classInfo = {
    name: "jsVectors"
  };
  jsVectors.prototype = new jsVectors_prototype();

  var quaternion_prototype = function quaternion_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param float q
       */
      _myTrait_.copy = function (q) {
        this.x = q.x;
        this.y = q.y;
        this.z = q.z;
        this.w = q.w;
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (x, y, z, w) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = w !== undefined ? w : 1;
      });

      /**
       * @param float t
       */
      _myTrait_.inverse = function (t) {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
        return this;
      };

      /**
       * @param float q1
       * @param float q2
       */
      _myTrait_.multiply = function (q1, q2) {

        if (!q2) {
          q2 = q1;
          q1 = this;
        }

        var x = q1.x * q2.w + q1.y * q2.z - q1.z * q2.y + q1.w * q2.x;
        var y = -q1.x * q2.z + q1.y * q2.w + q1.z * q2.x + q1.w * q2.y;
        var z = q1.x * q2.y - q1.y * q2.x + q1.z * q2.w + q1.w * q2.z;
        var w = -q1.x * q2.x - q1.y * q2.y - q1.z * q2.z + q1.w * q2.w;

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        return this;
      };

      /**
       * @param float v
       */
      _myTrait_.normalizeVector3D = function (v) {
        var len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

        if (len == 0 || isNaN(len)) return {
          x: 1,
          y: 0,
          z: 0
        };

        return {
          x: v.x / len,
          y: v.y / len,
          z: v.z / len
        };
      };

      /**
       * @param float vector
       */
      _myTrait_.projectVector = function (vector) {
        var dest = {
          x: 0,
          y: 0,
          z: 0
        };

        // p=q∗vq

        var x = vector.x,
            y = vector.y,
            z = vector.z,
            qx = this.x,
            qy = this.y,
            qz = this.z,
            qw = this.w;

        // calculate quat * vector

        var ix = qw * x + qy * z - qz * y,
            iy = qw * y + qz * x - qx * z,
            iz = qw * z + qx * y - qy * x,
            iw = -qx * x - qy * y - qz * z;

        // calculate result * inverse quat

        dest.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        dest.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        dest.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

        return dest;
      };

      /**
       * @param float r
       */
      _myTrait_.rotate = function (r) {
        this.setFromAxisRotation({
          x: 0,
          y: 0,
          z: 1
        }, r);

        return this;
      };

      /**
       * @param float v
       * @param float rot
       */
      _myTrait_.setFromAxisRotation = function (v, rot) {

        v = this.normalizeVector3D(v);

        var halfAngle = rot / 2,
            s = Math.sin(halfAngle);

        this.x = v.x * s;
        this.y = v.y * s;
        this.z = v.z * s;
        this.w = Math.cos(halfAngle);

        return this;
      };
    })(this);
  };

  var quaternion = function quaternion(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof quaternion) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != quaternion._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new quaternion(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  quaternion._classInfo = {
    name: "quaternion"
  };
  quaternion.prototype = new quaternion_prototype();

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var jsBezierCurve_prototype = function jsBezierCurve_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {
      var jsMath;

      // Initialize static variables here...

      /**
       * @param Object d
       * @param Object t
       */
      _myTrait_.derivate = function (d, t) {

        var P0 = this._points[d][0],
            P1 = this._points[d][1],
            P2 = this._points[d][2],
            P3 = this._points[d][3];

        var t2 = t * t;
        var nt = 1 - t;
        var nt2 = nt * nt;

        // dP(t) / dt =  -3(1-t)^2 * P0 + 3(1-t)^2 * P1 - 6t(1-t) * P1 - 3t^2 * P2 + 6t(1-t) * P2 + 3t^2 * P3
        // or from Wikipedia
        //
        // F(t)/dt = 3*nt2 * (P1-P0) + 6*t*nt*(P2-P1) + 3*t2*(P3-P2)

        // var derivative = -3*nt2* P0 + 3*nt2 * P1 - 6*t*nt*P1 - 3*t2 * P2 + 6*t*nt * P2 + 3*t2 * P3;

        // This should give the exact derivate of the point at certain position
        var FT_dt = 3 * nt2 * (P1 - P0) + 6 * t * nt * (P2 - P1) + 3 * t2 * (P3 - P2);
        return FT_dt;
      };

      /**
       * @param Object x
       * @param Object y
       */
      _myTrait_.distanceOf = function (x, y) {

        var t = this.findClosestT(x, y);
        var dx = this.x(t) - x,
            dy = this.y(t) - y;
        return Math.sqrt(dx * dx + dy * dy);
      };

      /**
       * @param Object x
       * @param Object y
       */
      _myTrait_.findClosestT = function (x, y) {

        var tStart = 0,
            tMiddle = 0.5,
            tEnd = 1;
        var iterations = 10;

        while (iterations--) {
          var d0_x = this.x(tStart) - x,
              d0_y = this.y(tStart) - y,
              d2_x = this.x(tEnd) - x,
              d2_y = this.y(tEnd) - y;
          var d0 = Math.sqrt(d0_x * d0_x + d0_y * d0_y),
              d2 = Math.sqrt(d2_x * d2_x + d2_y * d2_y);

          if (d0 < d2) {
            tEnd = tMiddle;
          } else {
            tStart = tMiddle;
          }
          tMiddle = tStart + (tEnd - tStart) / 2;
        }
        var d0_x = this.x(tStart) - x,
            d0_y = this.y(tStart) - y,
            d1_x = this.x(tMiddle) - x,
            d1_y = this.y(tMiddle) - y;
        d2_x = this.x(tEnd) - x, d2_y = this.y(tEnd) - y;
        var d0 = Math.sqrt(d0_x * d0_x + d0_y * d0_y),
            d1 = Math.sqrt(d1_x * d1_x + d1_y * d1_y),
            d2 = Math.sqrt(d2_x * d2_x + d2_y * d2_y);

        if (d0 < d1 && d0 < d2) return tStart;
        if (d2 < d1 && d2 < d0) return tEnd;
        return tMiddle;
      };

      /**
       * @param float list
       */
      _myTrait_.fitListTo = function (list) {

        var start = {
          x: list[0].point_x(0),
          y: list[0].point_y(0)
        };

        var ei = list.length - 1;

        var end = {
          x: list[ei].point_x(3),
          y: list[ei].point_y(3)
        };

        // what we have here is a list of segments, starting from (x,y) ending to (x2,y2)
        // have to rotate
        // have to scale

        var myStart = {
          x: this.x(0),
          y: this.y(0)
        };
        var myEnd = {
          x: this.x(1),
          y: this.y(1)
        };
        var dx = myEnd.x - myStart.x,
            dy = myEnd.y - myStart.y;

        var myLen = Math.sqrt(dx * dx + dy * dy);

        var ldx = end.x - start.x,
            ldy = end.y - start.y;

        var listLen = Math.sqrt(ldx * ldx + ldy * ldy);
        var relAngle = jsMath.angleBetween({
          x: dx,
          y: dy
        }, {
          x: ldx,
          y: ldy
        });

        // TODO: convert to path parser fromBezierArray()
        // make a quaternion list
        // scale & rotate the quaternion data to create new path
      };

      /**
       * @param float p0
       * @param float p1
       */
      _myTrait_.fromLine = function (p0, p1) {

        var len = p1.x - p0.x;
        var step = len / 3;
        this.initCoeffs(0, p0.x, p0.x + step, p0.x + step * 2, p1.x);

        var len = p1.y - p0.y;
        var step = len / 3;
        this.initCoeffs(1, p0.y, p0.y + step, p0.y + step * 2, p1.y);
      };

      /**
       * @param float p0
       * @param float p1
       * @param float p2
       * @param float p3
       */
      _myTrait_.fromPoints = function (p0, p1, p2, p3) {
        this.initCoeffs(0, p0.x, p1.x, p2.x, p3.x);
        this.initCoeffs(1, p0.y, p1.y, p2.y, p3.y);
      };

      /**
       * @param float p0
       * @param float p1
       * @param float p2
       */
      _myTrait_.fromQuadCurve = function (p0, p1, p2) {
        //CP1 = QP0 + 2/3 *(QP1-QP0)
        //CP2 = QP2 + 2/3 *(QP1-QP2)
        this.initCoeffs(0, p0.x, p0.x + 2 / 3 * (p1.x - p0.x), p2.x + 2 / 3 * (p1.x - p2.x), p2.x);
        this.initCoeffs(0, p0.y, p0.y + 2 / 3 * (p1.y - p0.y), p2.y + 2 / 3 * (p1.y - p2.y), p2.y);
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (t) {

        this._points = [];
        this._m = [];

        if (!jsMath) jsMath = jsVectors();
      });

      /**
       * @param Object d
       * @param Object v0
       * @param Object v1
       * @param Object v2
       * @param Object v3
       */
      _myTrait_.initCoeffs = function (d, v0, v1, v2, v3) {

        if (!this._coeffs) this._coeffs = [];

        if (!this._coeffs[d]) this._coeffs[d] = [];
        if (!this._points[d]) this._points[d] = [];

        // the actual points used in each dimension
        this._points[d][0] = v0;
        this._points[d][1] = v1;
        this._points[d][2] = v2;
        this._points[d][3] = v3;

        var c = this._coeffs[d];
        c[0] = 3 * (v1 - v0);
        c[1] = 3 * (v2 - v1) - c[0];
        c[2] = v3 - v0 - c[0] - c[1];
        c[3] = v0;
        /*
        if(d==0) {
            this._m[0].x = v0;
            this._m[1].x = v1;
            this._m[2].x = v2;
            this._m[3].x = v3;
        }  
        if(d==1) {
            this._m[0].y = v0;
            this._m[1].y = v1;
            this._m[2].y = v2;
            this._m[3].y = v3;
        }
        */
      };

      /**
       * @param Object projection
       */
      _myTrait_.inverseProject = function (projection) {

        var pt = projection.t;

        var n = this.normal(pt, true);

        var p_x = n.x * projection.nvProd + this.x(pt),
            p_y = n.y * projection.nvProd + this.y(pt);

        var t = this.tangent(pt, true);

        p_x = p_x + projection.tangetProd * t.x;
        p_y = p_y + projection.tangetProd * t.y;

        // inverse x and inverse y
        projection.ix = p_x;
        projection.iy = p_y;
      };

      /**
       * @param float t
       */
      _myTrait_.mirrorControls = function (t) {

        var base = {
          x: this._points[0][0],
          y: this._points[1][0]
        };

        var along = {
          x: this._points[0][3],
          y: this._points[1][3]
        };

        var v1 = {
          x: this._points[0][1],
          y: this._points[1][1]
        };
        var v2 = {
          x: this._points[0][2],
          y: this._points[1][2]
        };

        jsMath.mirrorVector(v1, along, base);
        jsMath.mirrorVector(v2, along, base);

        this.initCoeffs(0, base.x, v1.x, v2.x, along.x);
        this.initCoeffs(1, base.y, v1.y, v2.y, along.y);
      };

      /**
       * @param Object t
       * @param Object bUnitVector
       */
      _myTrait_.normal = function (t, bUnitVector) {

        var v = this.tangent(t);
        // direction of the curve at certain point...
        var vx = v.x;
        v.x = -v.y;
        v.y = vx;
        if (bUnitVector) jsMath.normalize(v);
        return v;
      };

      /**
       * @param Object i
       */
      _myTrait_.point_x = function (i) {

        return this._points[0][i];
      };

      /**
       * @param Object i
       */
      _myTrait_.point_y = function (i) {

        return this._points[1][i];
      };

      /**
       */
      _myTrait_.points = function () {

        return this._m;
      };

      /**
       * @param Object x
       * @param Object y
       * @param Object projection
       */
      _myTrait_.projectPoint = function (x, y, projection) {

        // logaritmic function ?

        var maxCnt = 20;
        var t = 0.5,
            step = 0.25; // start from the middle

        while (maxCnt--) {

          // We try to find a point where the projection to the tangent is as small as possible
          var tn = this.tangent(t, true);
          dv.x = x - this.x(t);
          dv.y = y - this.y(t);
          var prod = dv.x * tn.x + dv.y * tn.y;

          // close enough
          if (Math.abs(prod) < 0.05) {
            // found it...
            break;
          }
          if (prod > 0) {
            t += step;
          } else {
            t += -step;
          }
          step = step / 2;
        }

        var n = this.normal(t, true);
        if (!projection) projection = {};
        projection.tangentProd = prod;
        projection.nvProd = n.x * dv.x + n.y * d.y;
        projection.nv_x = n.x;
        projection.nv_y = n.y;
        projection.tn_x = tn.x;
        projection.tn_y = tn.y;
        projection.ix = 0; // when projected back, the inversed coords here
        projection.iy = 0;
        projection.t = t;

        return projection;
      };

      /**
       * @param Object p0
       * @param Object p1
       * @param Object p2
       * @param Object p3
       * @param Object fn
       */
      _myTrait_.setControls = function (p0, p1, p2, p3, fn) {

        this.initCoeffs(0, p0.x, p1.x, p2.x, p3.x);
        this.initCoeffs(1, p0.y, p1.y, p2.y, p3.y);
      };

      /**
       * @param float t
       */
      _myTrait_.split = function (t) {

        var plist = this._points[0];
        var v1 = this.splitCoeff(plist[0], plist[1], plist[2], plist[3], t);
        plist = this._points[1];
        var v2 = this.splitCoeff(plist[0], plist[1], plist[2], plist[3], t);

        this.fromPoints({
          x: v1.p0,
          y: v2.p0
        }, {
          x: v1.p1,
          y: v2.p1
        }, {
          x: v1.p2,
          y: v2.p2
        }, {
          x: v1.p3,
          y: v2.p3
        });

        var b2 = jsBezierCurve();
        b2.fromPoints({
          x: v1.p3,
          y: v2.p3
        }, {
          x: v1.p4,
          y: v2.p4
        }, {
          x: v1.p5,
          y: v2.p5
        }, {
          x: v1.p6,
          y: v2.p6
        });

        return b2;
      };

      /**
       * @param float P0
       * @param float P1
       * @param float P2
       * @param float P3
       * @param float t
       */
      _myTrait_.splitCoeff = function (P0, P1, P2, P3, t) {
        var v = {};
        v.p0 = P0;
        v.p1 = (1 - t) * P0 + t * P1;
        var m2 = (1 - t) * P1 + t * P2;
        v.p5 = (1 - t) * P2 + t * P3;

        v.p2 = (1 - t) * v.p1 + t * m2;
        v.p4 = (1 - t) * m2 + t * v.p5;
        v.p3 = (1 - t) * v.p2 + t * v.p4;
        v.p6 = P3;

        return v;
      };

      /**
       * @param Object t
       * @param Object dim
       */
      _myTrait_.step = function (t, dim) {

        if (!this._coeffs) return;
        var c = this._coeffs[dim];
        if (!c) return;
        var t2 = t * t,
            t3 = t2 * t;
        return c[2] * t3 + c[1] * t2 + c[0] * t + c[3];
      };

      /**
       * @param Object t
       * @param Object bUnitVector
       */
      _myTrait_.tangent = function (t, bUnitVector) {

        // direction of the curve at certain point...
        var nv = {};
        nv.x = this.derivate(0, t);
        nv.y = this.derivate(1, t);
        if (bUnitVector) jsMath.normalize(nv);
        return nv;
      };

      /**
       * @param Object t
       */
      _myTrait_.x = function (t) {

        return this.step(t, 0);
      };

      /**
       * @param Object t
       */
      _myTrait_.y = function (t) {

        return this.step(t, 1);
      };

      /**
       * @param float t
       */
      _myTrait_.z = function (t) {
        return this.step(t, 2);
      };
    })(this);
  };

  var jsBezierCurve = function jsBezierCurve(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof jsBezierCurve) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != jsBezierCurve._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new jsBezierCurve(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  jsBezierCurve._classInfo = {
    name: "jsBezierCurve"
  };
  jsBezierCurve.prototype = new jsBezierCurve_prototype();

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var jsVectors_prototype = function jsVectors_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {
      var projectionMatrix;
      var jVect;
      var iVect;
      var pBase;
      var tn1;
      var nv1;
      var barCoeffs;
      var deVector;

      // Initialize static variables here...

      /**
       * @param Object v1
       * @param Object v2
       */
      _myTrait_.add = function (v1, v2) {

        v1.x = v1.x + v2.x;
        v1.y = v1.y + v2.y;
      };

      /**
       * @param Object v1
       * @param Object v2
       */
      _myTrait_.angleBetween = function (v1, v2) {

        var n1 = this.normalize({
          x: v1.x,
          y: v1.y
        });
        var n2 = this.normalize({
          x: v2.x,
          y: v2.y
        });

        var cp = this.crossProd(n1, n2);
        var dp = this.dotProd(n1, n2);

        var a = Math.acos(dp);
        if (cp < 0) a = a * -1; // other side...
        return a;
      };

      /**
       * @param Object t
       * @param Object p0
       * @param Object p1
       * @param Object p2
       * @param Object p3
       */
      _myTrait_.calc_cat = function (t, p0, p1, p2, p3) {

        var t2 = t * t;
        var t3 = t2 * t;
        return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
      };

      /**
       * @param Object v1
       * @param Object v2
       */
      _myTrait_.crossProd = function (v1, v2) {

        // U x V = Ux*Vy-Uy*Vx
        return v1.x * v2.y - v1.y * v2.x;
      };

      /**
       * @param Object p1
       * @param Object p2
       */
      _myTrait_.diff = function (p1, p2) {

        return {
          x: p2.x - p1.x,
          y: p2.y - p1.y
        };
      };

      /**
       * @param Object p1
       * @param Object p2
       */
      _myTrait_.dist = function (p1, p2) {

        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;
        return Math.sqrt(dx * dx + dy * dy);
      };

      /**
       * @param Object v1
       * @param Object v2
       */
      _myTrait_.dotProd = function (v1, v2) {

        return v1.x * v2.x + v1.y * v2.y;
      };

      /**
       * @param Object p0
       * @param Object p1
       * @param Object p2
       */
      _myTrait_.getBarCoeffs = function (p0, p1, p2) {

        var bb = barCoeffs;
        bb.A = 1 / 2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
        bb.sign = bb.A < 0 ? -1 : 1;
        bb.s1 = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y)) * bb.sign;
        bb.s2 = (p2.y - p0.y) * bb.sign;
        bb.s3 = (p0.x - p2.x) * bb.sign;
        bb.t1 = (p0.x * p1.y - p0.y * p1.x) * bb.sign;
        bb.t2 = (p0.y - p1.y) * bb.sign;
        bb.t3 = (p1.x - p0.x) * bb.sign;
        return bb;
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (t) {

        if (!tn1) {

          tn1 = {
            x: 0,
            y: 0
          };
          nv1 = {
            x: 0,
            y: 0
          };

          projectionMatrix = [0, 0, 0, 0];

          jVect = {
            x: 0,
            y: 0
          };
          iVect = {
            x: 0,
            y: 0
          };
          pBase = {
            x: 0,
            y: 0
          };

          barCoeffs = {
            Area: 0,
            s1: 0,
            s2: 0,
            s3: 0,
            t1: 0,
            t2: 0,
            t3: 0,
            sign: 0
          };
          deVector = {
            x: 0,
            y: 0
          };
        }
      });

      /**
       * @param Object p1
       * @param Object p2
       */
      _myTrait_.initProjection = function (p1, p2) {

        iVect.y = p2.y - p1.y;
        iVect.x = p2.x - p1.x;

        jVect.y = iVect.y;
        jVect.x = iVect.x;

        this.normalize(iVect);
        this.normalize(jVect);

        this.rotate(jVect, Math.PI / 2);

        pBase.x = p1.x;
        pBase.y = p1.y;
      };

      /**
       * @param Object p1
       */
      _myTrait_.length = function (p1) {

        var dx = p1.x;
        var dy = p1.y;
        return Math.sqrt(dx * dx + dy * dy);
      };

      /**
       * @param Object p0
       * @param Object p1
       * @param Object v0
       * @param Object v1
       */
      _myTrait_.linesIntersect = function (p0, p1, v0, v1) {

        var x1 = p0.x,
            y1 = p0.y,
            x2 = p1.x,
            y2 = p1.y,
            x3 = v0.x,
            y3 = v0.y,
            x4 = v1.x,
            y4 = v1.y;

        var x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
        var y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
        if (isNaN(x) || isNaN(y)) {
          return false;
        } else {
          if (x1 >= x2) {
            if (!(x2 <= x && x <= x1)) {
              return false;
            }
          } else {
            if (!(x1 <= x && x <= x2)) {
              return false;
            }
          }
          if (y1 >= y2) {
            if (!(y2 <= y && y <= y1)) {
              return false;
            }
          } else {
            if (!(y1 <= y && y <= y2)) {
              return false;
            }
          }
          if (x3 >= x4) {
            if (!(x4 <= x && x <= x3)) {
              return false;
            }
          } else {
            if (!(x3 <= x && x <= x4)) {
              return false;
            }
          }
          if (y3 >= y4) {
            if (!(y4 <= y && y <= y3)) {
              return false;
            }
          } else {
            if (!(y3 <= y && y <= y4)) {
              return false;
            }
          }
        }
        return true;
      };

      /**
       * @param Object v1
       * @param Object along
       * @param Object base
       */
      _myTrait_.mirrorVector = function (v1, along, base) {

        // the direction tangent and normal are normalized and the vector is projected into it           
        tn1.x = along.x - base.x;
        tn1.y = along.y - base.y;
        nv1.x = -tn1.y;
        nv1.y = tn1.x;

        v1.x = v1.x - base.x;
        v1.y = v1.y - base.y;

        // if the 'j' or normal projection is positive, turn around
        if (this.dotProd(v1, nv1) > 0) this.rotate(nv1, Math.PI);

        this.normalize(tn1);
        this.normalize(nv1);

        // Create positive coordinates of the projection of the vector to the 'base' cordinates
        var nvProd = Math.abs(this.dotProd(v1, nv1));
        //             tnProd = Math.abs( this.dotProd(v1,tn1) );

        var tnProd = this.dotProd(v1, tn1);
        // then, project the length of the base vectors to get the new vector space
        v1.x = nv1.x * nvProd + tn1.x * tnProd, v1.y = nv1.y * nvProd + tn1.y * tnProd;

        v1.x += base.x;
        v1.y += base.y;

        return v1;
      };

      /**
       * @param Object v
       */
      _myTrait_.normalize = function (v) {

        var len = Math.sqrt(v.x * v.x + v.y * v.y);

        if (len == 0) {
          throw "Error normalizing vector: the length of the vector was zero";
        }

        v.x = v.x / len;
        v.y = v.y / len;
        return v;
      };

      /**
       * @param Object v1
       * @param Object along
       */
      _myTrait_.opposeVector = function (v1, along) {

        // the direction tangent and normal are normalized and the vector is projected into it           
        tn1.x = along, x;
        tn1.y = along.y;
        nv1.x = -tn1.y;
        nv1.y = tn1.x;

        this.normalize(tn1);
        this.normalize(nv1);

        // Important: turn the tangent to opposing direction...
        this.rotate(tn1, Math.PI);

        // Create the projection of the vector to the 'base' cordinates
        var nvProd = Math.abs(jsMath.dotProd(v1, nv1)),
            tnProd = Math.abs(jsMath.dotProd(v1, tn1));

        // if the 'j' or normal projection is negative, turn around
        if (this.dotProd(v1, nv1) < 0) this.rotate(nv1, Math.PI);

        // then, project the length of the vector to get the new vector
        v1.x = nv1.x * nvProd + tn1.x * tnProd, v1.y = nv1.y * nvProd + tn1.y * tnProd;

        return v1;
      };

      /**
       * @param Object p
       * @param Object p0
       * @param Object p1
       * @param Object p2
       */
      _myTrait_.pointInTriangle = function (p, p0, p1, p2) {

        var A = 1 / 2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
        var sign = A < 0 ? -1 : 1;
        var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
        var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;

        return s > 0 && t > 0 && s + t < 2 * A * sign;
      };

      /**
       * @param Object p
       * @param Object bb
       */
      _myTrait_.pointInTriangleBc = function (p, bb) {

        var A = bb.A;
        var sign = bb.sign;
        var s = bb.s1 + bb.s2 * p.x + bb.s3 * p.y;
        var t = bb.t1 + bb.t2 * p.x + bb.t3 * p.y;

        return s > 0 && t > 0 && s + t < 2 * A * sign;
      };

      /**
       * @param Object vectorToProject
       */
      _myTrait_.project = function (vectorToProject) {

        var p = vectorToProject;

        pVector.x = p.x - pBase.x;
        pVector.y = p.y - pBase.y;

        prodResult.i = this.dotProd(pVector, iVect);
        prodResult.j = this.dotProd(pVector, jVect);

        return prodResult;
      };

      /**
       * @param Object v
       * @param Object angle
       */
      _myTrait_.rotate = function (v, angle) {

        var s = Math.sin(angle);
        var c = Math.cos(angle);

        var x = v.x,
            y = v.y;

        v.x = x * c + y * s;
        v.y = -x * s + y * c;

        return v;
      };

      /**
       * @param Object angle
       * @param Object v
       * @param Object around
       */
      _myTrait_.rotateAround = function (angle, v, around) {

        this.sub(v, around);
        this.rotate(v, angle);
        this.add(v, around);
      };

      /**
       * @param Object v1
       * @param Object v2
       */
      _myTrait_.sub = function (v1, v2) {

        v1.x = v1.x - v2.x;
        v1.y = v1.y - v2.y;
      };

      /**
       * @param Object v1
       * @param Object v2
       * @param Object v3
       */
      _myTrait_.tangentNormal = function (v1, v2, v3) {

        var t1 = {};
        t1.x = v2.x - v1.x;
        t1.y = v2.y - v1.y;
        var t2 = {};
        t2.x = v3.x - v2.x;
        t2.y = v3.y - v2.y;

        var p = {
          x: t1.x + t2.x,
          y: t1.y + t2.y
        };
        return this.normalize(p);
      };

      /**
       * @param Object A
       * @param Object B
       * @param Object C
       */
      _myTrait_.triangleArea = function (A, B, C) {

        var area = A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y);

        return Math.abs(area / 2);
      };

      /**
       * @param Object p0
       * @param Object p1
       * @param Object p2
       * @param Object q0
       * @param Object q1
       * @param Object q2
       */
      _myTrait_.triangleInTriangle = function (p0, p1, p2, q0, q1, q2) {

        var bb = this.getBarCoeffs(p0, p1, p2);

        if (this.pointInTriangleBc(q0, bb)) return true;
        if (this.pointInTriangleBc(q1, bb)) return true;
        if (this.pointInTriangleBc(q2, bb)) return true;

        var bb = this.getBarCoeffs(q0, q1, q2);

        if (this.pointInTriangleBc(p0, bb)) return true;
        if (this.pointInTriangleBc(p1, bb)) return true;
        if (this.pointInTriangleBc(p2, bb)) return true;

        if (this.linesIntersect(p0, p1, q0, q1)) return true;
        if (this.linesIntersect(p1, p2, q0, q1)) return true;
        if (this.linesIntersect(p2, p0, q0, q1)) return true;

        if (this.linesIntersect(p0, p1, q1, q2)) return true;
        if (this.linesIntersect(p1, p2, q1, q2)) return true;
        if (this.linesIntersect(p2, p0, q1, q2)) return true;

        if (this.linesIntersect(p0, p1, q2, q0)) return true;
        if (this.linesIntersect(p1, p2, q2, q0)) return true;
        if (this.linesIntersect(p2, p0, q2, q0)) return true;

        return false;
      };

      /**
       * @param Object projectedVector
       */
      _myTrait_.unProject = function (projectedVector) {

        var p = projectedVector;
        deVector.x = p.i * iVect.x + p.j * jVect.x;
        deVector.y = p.i * iVect.y + p.j * jVect.y;

        deVector.x += pBase.x;
        deVector.y += pBase.y;
        return deVector;
      };
    })(this);
  };

  var jsVectors = function jsVectors(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof jsVectors) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != jsVectors._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new jsVectors(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  jsVectors._classInfo = {
    name: "jsVectors"
  };
  jsVectors.prototype = new jsVectors_prototype();

  var pathIterator_prototype = function pathIterator_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param float P0
       * @param float P1
       * @param float P2
       * @param float P3
       * @param float t
       */
      _myTrait_.bezierSplit = function (P0, P1, P2, P3, t) {
        var v = {};
        v.p1 = (1 - t) * P0 + t * P1;
        var m2 = (1 - t) * P1 + t * P2;
        v.p5 = (1 - t) * P2 + t * P3;

        v.p2 = (1 - t) * v.p1 + t * m2;
        v.p4 = (1 - t) * m2 + t * v.p5;
        v.p3 = (1 - t) * v.p2 + t * v.p4;

        return v;
      };

      /**
       * @param float pv
       * @param float m
       * @param float fn
       */
      _myTrait_.endPoint = function (pv, m, fn) {

        if (!pv) {
          pv = {
            x: 0,
            y: 0,
            z: 0
          };
        }
        if (!m) m = quaternion();

        var me = this,
            cnt = 0;

        if (!fn) {
          fn = function (q) {
            return q;
          };
        }

        this.list.forEach(function (c) {

          cnt++;
          if (c.cmd == "Q") {

            var ii = 0;
            c.path.forEach(function (p) {
              p = fn(p);
              var dv = {
                x: p.d,
                y: 0,
                z: 0
              };
              m.multiply(p.q);
              var v = m.projectVector(dv);
              pv.x += v.x;
              pv.y += v.y;
              pv.z += v.z;
              ii++;
            });
          }

          if (c.cmd == "M") {

            c.path.forEach(function (p) {
              p = fn(p);
              var dv = {
                x: p.d,
                y: 0,
                z: 0
              };
              m.multiply(p.q);
              var v = m.projectVector(dv);
              pv.x += v.x;
              pv.y += v.y;
              pv.z += v.z;
            });
          }

          if (c.cmd == "L") {

            c.path.forEach(function (p) {
              p = fn(p);
              var dv = {
                x: p.d,
                y: 0,
                z: 0
              };
              m.multiply(p.q);
              var v = m.projectVector(dv);
              pv.x += v.x;
              pv.y += v.y;
              pv.z += v.z;
            });
          }

          if (c.cmd == "C") {

            var ii = 0;
            c.path.forEach(function (p) {
              p = fn(p);
              var dv = {
                x: p.d,
                y: 0,
                z: 0
              };
              m.multiply(p.q);
              var v = m.projectVector(dv);
              pv.x += v.x;
              pv.y += v.y;
              pv.z += v.z;
              ii++;
            });
          }
        });

        return pv;
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (list) {

        /*
        list of path iterators
        {
        q : quaternion,
        d : distance
        },
        {
        q : quaternion,
        d : distance
        },   
        */

        this.list = list;
      });

      /**
       * @param float start
       * @param float end
       * @param float pv
       * @param float m
       */
      _myTrait_.partToSvgPath = function (start, end, pv, m) {

        var str = "";
        if (!pv) {
          pv = {
            x: 0,
            y: 0,
            z: 0
          };
        }
        if (!m) m = quaternion();

        this.addedObjects = [];
        var me = this,
            cnt = 0;

        this.list.forEach(function (c) {

          cnt++;

          if (cnt < start) return;
          if (cnt > end) return;

          var g = _e("g");
          g.circle().attr({
            fill: "#ffaa88",
            cx: pv.x,
            cy: pv.y,
            r: 10
          });
          g.svg_text().attr({
            x: pv.x,
            y: pv.y + 10,
            "font-size": 20,
            "fill": "black"
          }).text(cnt + "");
          me.addedObjects.push(g);

          if (c.cmd == "Q") {

            var ii = 0;
            c.path.forEach(function (p) {
              var dv = {
                x: p.d,
                y: 0,
                z: 0
              };
              m.multiply(p.q);
              var v = m.projectVector(dv);
              pv.x += v.x;
              pv.y += v.y;
              pv.z += v.z;
              if (ii == 0) {
                str += "Q ";
              }
              str += " " + pv.x.toFixed(3) + ", " + pv.y.toFixed(3);
              ii++;
            });
          }

          if (c.cmd == "M") {

            c.path.forEach(function (p) {
              var dv = {
                x: p.d,
                y: 0,
                z: 0
              };
              m.multiply(p.q);
              var v = m.projectVector(dv);
              pv.x += v.x;
              pv.y += v.y;
              pv.z += v.z;
              str += "M " + pv.x.toFixed(3) + ", " + pv.y.toFixed(3);
            });
          }

          if (c.cmd == "L") {

            c.path.forEach(function (p) {
              var dv = {
                x: p.d,
                y: 0,
                z: 0
              };
              m.multiply(p.q);
              var v = m.projectVector(dv);
              pv.x += v.x;
              pv.y += v.y;
              pv.z += v.z;
              str += "L " + pv.x.toFixed(3) + ", " + pv.y.toFixed(3);
            });
          }

          if (c.cmd == "C") {

            var ii = 0;
            c.path.forEach(function (p) {
              var dv = {
                x: p.d,
                y: 0,
                z: 0
              };
              m.multiply(p.q);
              var v = m.projectVector(dv);
              pv.x += v.x;
              pv.y += v.y;
              pv.z += v.z;
              if (ii == 0) {
                str += "C ";
              }
              str += " " + pv.x.toFixed(3) + ", " + pv.y.toFixed(3);
              ii++;
            });
          }

          // no screen projection here...

          /*
          if(p.sub) {
          var ii = pathIterator( p.sub );
          var subQ = quaternion();
          subQ.copy( m );
          str+= ii.toSvgPath({
            x : pv.x,
            y : pv.y,
            z : pv.z
          }, subQ);
          }
          */
        });

        return str;

        /*
        var v = m.projectVector({
        x : 100,
        y : 0,
        z : 0
        });
        main.p().text(JSON.stringify(v));
        var vLen = Math.sqrt( v.x*v.x + v.y*v.y + v.z*v.z );
        main.p().text("len = "+ vLen); 
        m.multiply( step2 );
        var v = m.projectVector({
        x : 100,
        y : 0,
        z : 0
        });
        main.p().text(JSON.stringify(v));
        var vLen = Math.sqrt( v.x*v.x + v.y*v.y + v.z*v.z );
        main.p().text("len = "+ vLen);
        */
      };

      /**
       * @param float t
       */
      _myTrait_.pathFunction = function (t) {};

      /**
       * @param float P0
       * @param float P1
       * @param float P2
       */
      _myTrait_.quadToCubic = function (P0, P1, P2) {
        //CP1 = QP0 + 2/3 *(QP1-QP0)
        //CP2 = QP2 + 2/3 *(QP1-QP2)

        return {
          p0: P0,
          p1: P0 + 2 / 3 * (P1 - P0),
          p2: P2 + 2 / 3 * (P1 - P2),
          p3: P2
        };
      };

      /**
       * @param float pv
       * @param float m
       */
      _myTrait_.toSvgCubicPath = function (pv, m) {
        var str = "";
        if (!pv) {
          pv = {
            x: 0,
            y: 0,
            z: 0
          };
        }
        if (!m) m = quaternion();

        var ii = 0;
        this.list.forEach(function (p) {
          var dv = {
            x: p.d,
            y: 0,
            z: 0
          };
          m.multiply(p.q);
          var v = m.projectVector(dv);
          pv.x += v.x;
          pv.y += v.y;
          pv.z += v.z;
          // no screen projection here...
          if (ii == 0) {
            str += "C " + pv.x.toFixed(3) + ", " + pv.y.toFixed(3);
          } else {
            str += " " + pv.x.toFixed(3) + ", " + pv.y.toFixed(3);
          }
          ii++;
        });

        return str;
      };

      /**
       * @param float pv
       * @param float m
       * @param float fn
       */
      _myTrait_.toSvgPath = function (pv, m, fn) {

        var str = "";
        if (!pv) {
          pv = {
            x: 0,
            y: 0,
            z: 0
          };
        }
        if (!m) m = quaternion();

        this.addedObjects = [];
        var me = this,
            cnt = 0;

        if (!fn) {
          fn = function (q) {
            return q;
          };
        }

        this.list.forEach(function (c) {

          cnt++;
          /*
          var g = _e("g");
          g.circle().attr({
          fill : "#ffaa77",
          cx : pv.x,
          cy : pv.y,
          r : 10
          });
          g.svg_text().attr({
          x : pv.x,
          y : pv.y + 10,
          "font-size" : 20,
          "fill" : "#222222"
          }).text(cnt+"");
          me.addedObjects.push( g ); */

          if (c.cmd == "Q") {

            var ii = 0;
            c.path.forEach(function (p) {
              p = fn(p);
              var dv = {
                x: p.d,
                y: 0,
                z: 0
              };
              m.multiply(p.q);
              var v = m.projectVector(dv);
              pv.x += v.x;
              pv.y += v.y;
              pv.z += v.z;
              if (ii == 0) {
                str += "Q ";
              }
              str += " " + pv.x.toFixed(3) + ", " + pv.y.toFixed(3);
              ii++;
            });
          }

          if (c.cmd == "M") {

            c.path.forEach(function (p) {
              p = fn(p);
              var dv = {
                x: p.d,
                y: 0,
                z: 0
              };
              m.multiply(p.q);
              var v = m.projectVector(dv);
              pv.x += v.x;
              pv.y += v.y;
              pv.z += v.z;
              str += "M " + pv.x.toFixed(3) + ", " + pv.y.toFixed(3);
            });
          }

          if (c.cmd == "L") {

            c.path.forEach(function (p) {
              p = fn(p);
              var dv = {
                x: p.d,
                y: 0,
                z: 0
              };
              m.multiply(p.q);
              var v = m.projectVector(dv);
              pv.x += v.x;
              pv.y += v.y;
              pv.z += v.z;
              str += "L " + pv.x.toFixed(3) + ", " + pv.y.toFixed(3);
            });
          }

          if (c.cmd == "C") {

            var ii = 0;
            c.path.forEach(function (p) {
              p = fn(p);
              var dv = {
                x: p.d,
                y: 0,
                z: 0
              };
              m.multiply(p.q);
              var v = m.projectVector(dv);
              pv.x += v.x;
              pv.y += v.y;
              pv.z += v.z;
              if (ii == 0) {
                str += "C ";
              }
              str += " " + pv.x.toFixed(3) + ", " + pv.y.toFixed(3);
              ii++;
            });
          }

          // no screen projection here...

          /*
          if(p.sub) {
          var ii = pathIterator( p.sub );
          var subQ = quaternion();
          subQ.copy( m );
          str+= ii.toSvgPath({
            x : pv.x,
            y : pv.y,
            z : pv.z
          }, subQ);
          }
          */
        });

        return str;

        /*
        var v = m.projectVector({
        x : 100,
        y : 0,
        z : 0
        });
        main.p().text(JSON.stringify(v));
        var vLen = Math.sqrt( v.x*v.x + v.y*v.y + v.z*v.z );
        main.p().text("len = "+ vLen); 
        m.multiply( step2 );
        var v = m.projectVector({
        x : 100,
        y : 0,
        z : 0
        });
        main.p().text(JSON.stringify(v));
        var vLen = Math.sqrt( v.x*v.x + v.y*v.y + v.z*v.z );
        main.p().text("len = "+ vLen);
        */
      };
    })(this);
  };

  var pathIterator = function pathIterator(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof pathIterator) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != pathIterator._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new pathIterator(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  pathIterator._classInfo = {
    name: "pathIterator"
  };
  pathIterator.prototype = new pathIterator_prototype();

  var svgPathParser_prototype = function svgPathParser_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {
      var _parsedData;

      // Initialize static variables here...

      /**
       * @param Object ctx
       * @param Object w
       * @param Object h
       */
      _myTrait_.drawPath = function (ctx, w, h) {
        var _firstX, _firstY, x, y;
        ctx.beginPath();
        this._all.forEach(function (cmd) {

          if (cmd.name == "M") {
            x = cmd.points[0];
            y = cmd.points[1];
            ctx.moveTo(x, y);
          }

          if (cmd.name == "m") {
            x = x + cmd.points[0];
            y = y + cmd.points[1];
            ctx.moveTo(x, y);
          }

          if (cmd.name == "q") {
            for (var s = 0; s < cmd.points.length; s += 4) {
              var p = cmd.points;
              var x0 = x + p[s + 0],
                  y0 = y + p[s + 1];
              //x=x0; y=y0;
              var x1 = x + p[s + 2],
                  y1 = y + p[s + 3];
              x = x1;
              y = y1;
              ctx.quadraticCurveTo(x0, y0, x1, y1, x2, y2);
            }
          }

          // Not relative coordinates... the algo is much simpler here...
          if (cmd.name == "Q") {
            var p = cmd.points,
                len = cmd.points.length;
            for (var s = 0; s < len; s += 4) {
              ctx.quadraticCurveTo(p[s + 0], p[s + 1], p[s + 2], p[s + 3]);
            }
          }

          if (cmd.name == "c") {
            for (var s = 0; s < cmd.points.length; s += 6) {
              var p = cmd.points;
              var x0 = x + p[s + 0],
                  y0 = y + p[s + 1];
              //x=x0; y=y0;
              var x1 = x + p[s + 2],
                  y1 = y + p[s + 3];
              // x=x1; y=y1;
              var x2 = x + p[s + 4],
                  y2 = y + p[s + 5];
              x = x2;
              y = y2;
              ctx.bezierCurveTo(x0, y0, x1, y1, x2, y2);
            }
          }

          // Not relative coordinates... the algo is much simpler here...
          if (cmd.name == "C") {
            var p = cmd.points,
                len = cmd.points.length;
            for (var s = 0; s < len; s += 6) {
              ctx.bezierCurveTo(p[s + 0], p[s + 1], p[s + 2], p[s + 3], p[s + 4], p[s + 5]);
            }
          }
          if (cmd.name == "l") {
            for (var s = 0; s < cmd.points.length; s += 2) {
              var p = cmd.points;
              var x0 = x + p[s + 0],
                  y0 = y + p[s + 1];
              x = x0;
              y = y0;
              ctx.lineTo(x0, y0);
            }
          }

          if (cmd.name == "H") {
            for (var s = 0; s < cmd.points.length; s++) {
              var p = cmd.points;
              var x0 = p[s + 0];
              x = x0;
              ctx.lineTo(x0, y);
            }
          }

          if (cmd.name == "V") {
            for (var s = 0; s < cmd.points.length; s++) {
              var p = cmd.points;
              var y0 = p[s + 0];
              y = y0;
              ctx.lineTo(x, y0);
            }
          }

          if (cmd.name == "L") {
            for (var s = 0; s < cmd.points.length; s += 2) {
              var p = cmd.points;
              var x0 = p[s + 0],
                  y0 = p[s + 1];
              x = x0;
              y = y0;
              ctx.lineTo(x0, y0);
            }
          }

          if (cmd.name == "z") {
            ctx.closePath();
          }
        });
      };

      /**
       */
      _myTrait_.findDimensions = function () {

        if (this._limits) return this._limits;

        var _firstX, _firstY;
        var _minX, _minY, _maxX, _maxY, x, y;

        var limits = function limits(x, y) {

          if (typeof _minX == "undefined") {
            _minX = x;
            _maxX = x;
            _minY = y;
            _maxY = y;
          }
          _minX = Math.min(_minX, x);
          _minY = Math.min(_minY, y);
          _maxX = Math.max(_maxX, x);
          _maxY = Math.max(_maxY, y);
        };

        this._all.forEach(function (cmd) {

          if (cmd.name == "M") {

            x = cmd.points[0];
            y = cmd.points[1];

            limits(x, y);
          }

          if (cmd.name == "m") {

            x = x + cmd.points[0];
            y = y + cmd.points[1];
            limits(x, y);
          }

          if (cmd.name == "c") {
            for (var s = 0; s < cmd.points.length; s += 6) {
              var p = cmd.points;
              var x0 = x + p[s + 0],
                  y0 = y + p[s + 1];
              //x=x0; y=y0;
              var x1 = x + p[s + 2],
                  y1 = y + p[s + 3];
              // x=x1; y=y1;
              var x2 = x + p[s + 4],
                  y2 = y + p[s + 5];

              limits(x0, y0);
              limits(x1, y1);
              limits(x2, y2);
              x = x2;
              y = y2;
            }
          }

          if (cmd.name == "C") {
            var p = cmd.points,
                len = cmd.points.length;
            for (var s = 0; s < len; s += 6) {
              limits(p[s + 0], p[s + 1]);
              limits(p[s + 2], p[s + 3]);
              limits(p[s + 4], p[s + 5]);
            }
          }
          if (cmd.name == "l") {
            for (var s = 0; s < cmd.points.length; s += 2) {
              var p = cmd.points;
              var x0 = x + p[s + 0],
                  y0 = y + p[s + 1];
              x = x0;
              y = y0;
              limits(x, y);
            }
          }

          if (cmd.name == "L") {
            for (var s = 0; s < cmd.points.length; s += 2) {
              var p = cmd.points;
              var x0 = p[s + 0],
                  y0 = p[s + 1];
              x = x0;
              y = y0;
              limits(x, y);
            }
          }
        });

        // NOTE: in these SVG photos created by the potrace the y-axis
        // is reversed, so the maxY is actually the minY
        this._limits = [_minX, _minY, _maxX, _maxY];
        return this._limits;
      };

      /**
       * @param Object w
       * @param Object h
       */
      _myTrait_.fitPathInto = function (w, h) {

        var dim = this.findDimensions();

        var allIn = true;
        for (var i = 0; i < 4; i++) {
          if (dim[i] < 0 || dim[i] > w) allIn = false;
        }

        var drawW = Math.abs(dim[2] - dim[0]),
            drawH = Math.abs(dim[3] - dim[1]);

        var flipY = false;

        if (Math.abs(dim[3]) < Math.abs(dim[1])) {
          flipY = true;
        }

        var scale1 = w / drawW,
            scale2 = h / drawH,
            transX = -dim[0],
            transY = -dim[1];

        var scaleX = Math.min(scale1, scale2),
            scaleY = scaleX;

        if (flipY) {
          scaleY = -scaleY;
          transY = -dim[3]; // for example if -100 => +100
        }

        var tx = function tx(x) {
          return (x + transX) * scaleX;
        };
        var ty = function ty(y) {
          return (y + transY) * scaleY;
        };

        this._all.forEach(function (cmd) {

          if (cmd.name == "M") {

            cmd.points[0] = tx(cmd.points[0]);
            cmd.points[1] = ty(cmd.points[1]);
          }
          if (cmd.name == "m") {
            cmd.points[0] *= scaleX;
            cmd.points[1] *= scaleY;
          }

          if (cmd.name == "L") {
            for (var s = 0; s < cmd.points.length; s += 2) {
              var p = cmd.points;
              p[s + 0] = tx(p[s + 0]);
              p[s + 1] = ty(p[s + 1]);
            }
          }

          if (cmd.name == "c") {
            for (var s = 0; s < cmd.points.length; s += 6) {
              var p = cmd.points;
              p[s + 0] *= scaleX;
              p[s + 2] *= scaleX;
              p[s + 4] *= scaleX;
              p[s + 1] *= scaleY;
              p[s + 3] *= scaleY;
              p[s + 5] *= scaleY;
            }
          }

          // Not relative coordinates... the algo is much simpler here...
          if (cmd.name == "C") {
            var p = cmd.points,
                len = cmd.points.length;
            for (var s = 0; s < len; s += 6) {
              p[s + 0] = tx(p[s + 0]);
              p[s + 2] = tx(p[s + 2]);
              p[s + 4] = tx(p[s + 4]);
              p[s + 1] = ty(p[s + 1]);
              p[s + 3] = ty(p[s + 3]);
              p[s + 5] = ty(p[s + 5]);
            }
          }

          if (cmd.name == "Q") {
            var p = cmd.points,
                len = cmd.points.length;
            for (var s = 0; s < len; s += 4) {
              p[s + 0] = tx(p[s + 0]);
              p[s + 2] = tx(p[s + 2]);
              p[s + 1] = ty(p[s + 1]);
              p[s + 3] = ty(p[s + 3]);
            }
          }

          if (cmd.name == "l") {
            for (var s = 0; s < cmd.points.length; s += 2) {
              var p = cmd.points;
              p[s + 0] *= scaleX;
              p[s + 1] *= scaleY;
            }
          }
        });

        this._limits = null;
      };

      /**
       * @param float fn
       */
      _myTrait_.forCmds = function (fn) {
        this._all.forEach(fn);
      };

      /**
       * @param float list
       */
      _myTrait_.fromBezierArray = function (list) {
        var x,
            y,
            i,
            plen = list.length;
        var target = this._all;
        this._all = [];

        for (var i = 0; i < plen; i++) {

          var bez = list[i];
          if (i == 0) {
            var c = {
              name: "M",
              points: [bez.point_x(0), bez.point_y(0)]
            };
            this._all.push(c);
          }
          var c = {
            name: "C",
            points: [bez.point_x(1), bez.point_y(1), bez.point_x(2), bez.point_y(2), bez.point_x(3), bez.point_y(3)]
          };
          this._all.push(c);
        }
        this.saveToOriginals();
      };

      /**
       * @param float t
       */
      _myTrait_.getCommands = function (t) {
        return this._all;
      };

      /**
       * @param float i
       */
      _myTrait_.getPath = function (i) {

        return this._all[i];
      };

      /**
       * @param float t
       */
      _myTrait_.getSegmentCount = function (t) {

        var last = this._all.length;
        if (this._all[last - 1].name == "z") last--;

        return last;
      };

      /**
       * @param float t
       */
      _myTrait_.getSubPaths = function (t) {
        return this._subPaths;
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (w, h, intoDom) {
        this._activeCmd = null;
        this._all = [];
        this._stringLeft = "";

        this._original = null;

        this._x = 0;
        this._y = 0;

        if (!_parsedData) {
          _parsedData = {};
        }
      });

      /**
       * @param Object n
       */
      _myTrait_.initCmd = function (n) {
        this._activeCmd = {
          name: n,
          points: []
        };
        this._all.push(this._activeCmd);
        return this._activeCmd;
      };

      /**
       * @param float t
       */
      _myTrait_.inverse = function (t) {
        var all = this.originals();

        var point = {
          x: 0,
          y: 0
        };

        var x,
            y,
            i,
            plen = all.length;

        this._all.reverse();

        var target = this._all;
        var all = this._all;

        var newCmds = [];

        var getPrevPoints = function getPrevPoints(currCmd, prevCmd) {
          var res = [];
          var n = currCmd.points.length / 2,
              i = currCmd.points.length - 4;
          while (n > 0) {
            if (n == 1) {
              if (!prevCmd) return res;
              i = prevCmd.points.length - 2;
              res.push(prevCmd.points[i]);
              res.push(prevCmd.points[i + 1]);
            } else {
              res.push(currCmd.points[i]);
              res.push(currCmd.points[i + 1]);
              i -= 2;
            }
            n--;
          }
          return res;
        };

        if (all[0].name == "z") {
          all.shift();
          // plen--;
        }

        for (var i = 0; i < plen; i++) {

          var cmd = all[i],
              tCmd = all[i],
              nextCmd = all[i + 1],
              prevCmd;

          if (!cmd) break;
          if (i > 0) prevCmd = all[i - 1];

          if (i == 0) {
            var ii = cmd.points.length - 2;
            var cc = {
              name: "M",
              points: [cmd.points[ii], cmd.points[ii + 1]]
            };
            newCmds.push(cc);
          } else {
            var cc = {
              name: prevCmd.name,
              points: getPrevPoints(prevCmd, cmd)
            };
            newCmds.push(cc);
          }
        }

        var cc = {
          name: "z",
          points: []
        };
        newCmds.push(cc);

        // console.log(newCmds);

        this._all = newCmds;
      };

      /**
       */
      _myTrait_.makePathAbsolute = function () {

        var _firstX, _firstY;
        var x = 0,
            y = 0,
            lastBx,
            lastBy,
            bNoBx = true;

        var firstSmoothPoint = function firstSmoothPoint() {
          if (bNoBx) {
            lastBx = x;
            lastBy = y;
          }
          var dx = x - lastBx,
              dy = y - lastBy;
          return {
            x: x + dx,
            y: y + dy
          };
        };
        this._all.forEach(function (cmd) {

          if (cmd.name == "M") {
            x = cmd.points[0];
            y = cmd.points[1];
            bNoBx = true;
          }

          if (cmd.name == "L") {
            x = cmd.points[0];
            y = cmd.points[1];
            bNoBx = true;
          }

          if (cmd.name == "m") {

            x = x + cmd.points[0];
            y = y + cmd.points[1];

            cmd.points[0] = x;
            cmd.points[1] = y;
            cmd.name = "M";
            bNoBx = true;
          }

          if (cmd.name == "q") {
            for (var s = 0; s < cmd.points.length; s += 4) {
              var p = cmd.points;

              p[s + 0] = x + p[s + 0];
              p[s + 1] = y + p[s + 1];
              p[s + 2] = x + p[s + 2];
              p[s + 3] = y + p[s + 3];
              x = p[s + 2];
              y = p[s + 3];
              cmd.name = "Q";
            }
            bNoBx = true;
          }
          if (cmd.name == "C") {
            var p = cmd.points;
            lastBx = p[2];
            lastBy = p[3];

            x = p[4];
            y = p[5];
            bNoBx = false;
          }
          if (cmd.name == "c") {
            for (var s = 0; s < cmd.points.length; s += 6) {
              var p = cmd.points;

              p[s + 0] = x + p[s + 0];
              p[s + 1] = y + p[s + 1];
              p[s + 2] = x + p[s + 2];
              p[s + 3] = y + p[s + 3];
              p[s + 4] = x + p[s + 4];
              p[s + 5] = y + p[s + 5];
              x = p[s + 4];
              y = p[s + 5];
              lastBx = p[s + 2];
              lastBy = p[s + 3];
              cmd.name = "C";
            }
            bNoBx = false;
          }

          if (cmd.name == "S") {
            var p = cmd.points;
            var first = firstSmoothPoint();
            var newPoints = [];
            newPoints[0] = first.x;
            newPoints[1] = first.y;
            newPoints[2] = p[0];
            newPoints[3] = p[1];
            newPoints[4] = p[2];
            newPoints[5] = p[3];
            x = newPoints[4];
            y = newPoints[5];
            lastBx = newPoints[2];
            lastBy = newPoints[3];
            cmd.name = "C";
            cmd.points = newPoints;
            bNoBx = false;
          }
          if (cmd.name == "s") {
            var p = cmd.points;
            var first = firstSmoothPoint();
            var newPoints = [];
            newPoints[0] = first.x;
            newPoints[1] = first.y;
            newPoints[2] = x + p[0];
            newPoints[3] = y + p[1];
            newPoints[4] = x + p[2];
            newPoints[5] = y + p[3];
            x = newPoints[4];
            y = newPoints[5];
            lastBx = newPoints[2];
            lastBy = newPoints[3];
            cmd.name = "C";
            cmd.points = newPoints;
            bNoBx = false;
          }

          if (cmd.name == "h") {
            bNoBx = true;
            for (var s = 0; s < cmd.points.length; s++) {
              var p = cmd.points;
              var x0 = x + p[s + 0];
              x = x0;
              p[s + 0] = x0;
              cmd.points = [x0, y];
              cmd.name = "L";
              return;
            }
          }

          if (cmd.name == "H") {
            bNoBx = true;
            for (var s = 0; s < cmd.points.length; s++) {
              var p = cmd.points;
              var x0 = p[s + 0];
              x = x0;
              p[s + 0] = x0;
              cmd.points = [x0, y];
              cmd.name = "L";
              return;
            }
          }

          if (cmd.name == "V") {
            bNoBx = true;
            for (var s = 0; s < cmd.points.length; s++) {
              var p = cmd.points;
              //console.log("--- V ----");
              //console.log("Point cnt ", cmd.points.length);
              //console.log(p, "y : ",y, " delta :  ",p[s+0]);
              var y0 = p[s + 0];
              y = y0;
              //console.log("After add : ",y, "and y0 = ", y0);
              cmd.points = [x, y0];
              cmd.name = "L";
              //console.log(cmd);
              return;
            }
          }

          if (cmd.name == "v") {
            bNoBx = true;
            for (var s = 0; s < cmd.points.length; s++) {
              var p = cmd.points;
              var y0 = y + p[s + 0];
              y = y0;
              cmd.points = [x, y0];
              cmd.name = "L";
              return;
            }
          }

          if (cmd.name == "l") {
            bNoBx = true;
            for (var s = 0; s < cmd.points.length; s += 2) {
              var p = cmd.points;
              var x0 = x + p[s + 0],
                  y0 = y + p[s + 1];
              x = x0;
              y = y0;
              p[s + 0] = x0;
              p[s + 1] = y0;
              cmd.name = "L";
            }
          }
        });
      };

      /**
       * @param float width
       * @param float height
       */
      _myTrait_.normalize = function (width, height) {
        if (!width) width = 800;
        if (!height) height = 800;
        this.makePathAbsolute();
        this.fitPathInto(width, height);
      };

      /**
       */
      _myTrait_.originals = function () {

        if (!this._original) {
          this._original = JSON.parse(JSON.stringify(this._all));
        }
        return this._original;
      };

      /**
       * @param string str
       */
      _myTrait_.parse = function (str) {
        /*var old;
        if(old = _parsedData[str]) {
        this._all = JSON.parse( old );
        return;
        }*/

        this._activeCmd = null;
        this._all = [];
        this._stringLeft = "";

        this._original = null;

        this._x = 0;
        this._y = 0;

        this._usedCommands = {};
        if (!str) str = "M25.979,12.896 L 5.979,12.896,5.979,19.562,25.979,19.562z";
        var c,
            leftString = str;
        var lastLen = 0;
        var maxCnt = 10000;

        this._subPaths = str.split("M");
        //console.log("Sub paths");
        //console.log(this._subPaths);

        this._subIndex = 0;

        while (leftString = this.popCommand(leftString)) {

          if (leftString.length == 0) break;
          if (leftString.length == lastLen) break;

          if (maxCnt-- < 0) break;

          lastLen = leftString.length;
        }

        // _parsedData[str] = JSON.stringify( this._all );

        // console.log("Used commands", this._usedCommands);
        return this._all;
      };

      /**
       */
      _myTrait_.path = function () {

        return this._all;
      };

      /**
       * @param float t
       */
      _myTrait_.pathFunction = function (t) {};

      /**
       * @param Object str
       */
      _myTrait_.popCommand = function (str) {

        //console.log("popCommand");
        //console.log(str);

        str = str.trim();

        var cmdStr = str.charAt(0),
            cmd = null;

        if (cmdStr == "M") {
          cmd = this.initCmd(cmdStr);
          str = str.substring(1);
        }

        if (cmdStr == "m") {
          cmd = this.initCmd(cmdStr);
          str = str.substring(1);
        }

        if (cmdStr == "Q") {
          cmd = this.initCmd(cmdStr);
          str = str.substring(1);
        }

        if (cmdStr == "q") {
          cmd = this.initCmd(cmdStr);
          str = str.substring(1);
        }

        if (cmdStr == "S") {
          cmd = this.initCmd(cmdStr);
          str = str.substring(1);
        }

        if (cmdStr == "s") {
          cmd = this.initCmd(cmdStr);
          str = str.substring(1);
        }

        if (cmdStr == "C") {
          cmd = this.initCmd(cmdStr);
          str = str.substring(1);
        }

        if (cmdStr == "c") {
          cmd = this.initCmd(cmdStr);
          str = str.substring(1);
        }

        if (cmdStr == "H") {
          cmd = this.initCmd(cmdStr);
          str = str.substring(1);
        }

        if (cmdStr == "h") {
          cmd = this.initCmd(cmdStr);
          str = str.substring(1);
        }

        if (cmdStr == "V") {
          cmd = this.initCmd(cmdStr);
          str = str.substring(1);
        }

        if (cmdStr == "v") {
          cmd = this.initCmd(cmdStr);
          str = str.substring(1);
        }

        if (cmdStr == "L") {
          cmd = this.initCmd(cmdStr);
          str = str.substring(1);
        }

        if (cmdStr == "l") {
          cmd = this.initCmd(cmdStr);
          str = str.substring(1);
        }

        if (cmdStr == "Z") {
          cmd = this.initCmd(cmdStr);
          str = str.substring(1);
        }

        if (cmdStr == "z") {
          cmd = this.initCmd(cmdStr);
          str = str.substring(1);
        }

        // Find the points....
        if (cmd) {

          this._usedCommands[cmdStr] = "true";
          str = str.trim();

          var ok = true;

          while (ok && str.length > 0) {

            var firstChar = str.charAt(0);
            if (firstChar == ",") {
              str = str.substring(1);
              str = str.trim();
            }
            var allowed = ["-", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."];
            var collect = "",
                minusCnt = 0;

            while (allowed.indexOf(str.charAt(0)) >= 0) {
              if (str.charAt(0) == "-") {
                minusCnt++;
                if (minusCnt > 1) {
                  break;
                }
              }
              collect = collect + str.charAt(0);
              str = str.substring(1);
              minusCnt = 1;
            }

            // we have a number
            if (collect.length > 0) {
              //console.log("Found number "+collect);
              cmd.points.push(parseFloat(collect));
            } else {
              // nothing more there...
              //console.log("Did not find number from "+str);
              break;
            }
            str = str.trim();
          }
        }

        if (!cmd) {
          this._error = true;
          console.error("No command found for");
          console.error(str);
        }

        this._activeCmd = cmd;
        this._stringLeft = str;

        return str;
      };

      /**
       * @param float t
       */
      _myTrait_.relativePosition = function (t) {

        // perhaps faster would be to manage the bezier array directly...
        var list = this.toBezierArray();
        var ntCnt = list.length;

        var t1 = ntCnt * t;
        var t_index = Math.floor(t1);

        if (t_index >= ntCnt) t_index = ntCnt - 1;
        if (t_index < 0) t_index = 0;

        var bez = list[t_index];
        var sub_t = t1 - t_index;

        // for example ntCnt = 10
        // t = 9,5
        var stepLen = 1 / ntCnt,
            // 0,1
        nowStep = t_index / ntCnt,
            // 0,9
        totStep = t,
            // 0,95
        remStep = totStep - nowStep,
            // 0,05
        relStep = remStep / stepLen; // 0,05 / 0,1 = 0,5

        var pathFnData = {
          x: 0,
          y: 0,
          normal: {
            x: 0,
            y: 0
          }
        };
        pathFnData.x = bez.x(relStep);
        pathFnData.y = bez.y(relStep);
        var nn = bez.tangent(relStep, true);
        pathFnData.normal.x = nn.x;
        pathFnData.normal.y = nn.y;

        return pathFnData;
      };

      /**
       * @param float index
       * @param float pathStr
       * @param float invert
       */
      _myTrait_.replacePartWith = function (index, pathStr, invert) {

        var createQuatPath2 = function createQuatPath2(str, invert) {
          var parser = svgPathParser();
          parser.parse(str);
          parser.makePathAbsolute();
          var list = parser.toBezierArray();
          parser.fromBezierArray(list);
          if (invert) parser.inverse();
          var qPath = parser.toQuaternionPath();

          var createQuatPath = function createQuatPath(startPoint, refVector) {

            var iter = pathIterator(qPath);
            var ep = iter.endPoint();
            var str = "M 0 0 " + iter.toSvgPath();
            var sp = startPoint;
            /*
            var refVector = {
            x : -100,
            y : 100
            };*/

            if (refVector.x == 0 && refVector.y == 0) return "";

            var len = Math.sqrt(ep.x * ep.x + ep.y * ep.y),
                refLen = Math.sqrt(refVector.x * refVector.x + refVector.y * refVector.y),
                scale = refLen / len;
            if (len == 0) return str;
            var math = jsVectors();
            var angle = math.angleBetween(ep, refVector);
            // var angle = math.angleBetween(  refVector, ep );
            var str = iter.toSvgPath(sp, quaternion().rotate(angle), function (p) {
              p.d = p.d * scale;
              return p;
            });
            return str;
          };
          return createQuatPath;
        };

        var ppp = this.getPath(index);
        ppp.replaceFunction = createQuatPath2(pathStr, invert);
      };

      /**
       */
      _myTrait_.saveToOriginals = function () {
        this._original = JSON.parse(JSON.stringify(this._all));
      };

      /**
       * @param Object w
       * @param Object h
       */
      _myTrait_.scaleFactor = function (w, h) {

        var dim = this.findDimensions();

        var drawW = Math.abs(dim[2] - dim[0]),
            drawH = Math.abs(dim[3] - dim[1]);

        var scale1 = w / drawW,
            scale2 = h / drawH;
        var x, y;

        var scale = Math.min(scale1, scale2);

        return scale;
      };

      /**
       * @param float t
       */
      _myTrait_.svgString = function (t) {
        var _firstX,
            _firstY,
            x,
            y,
            str = "";

        var dc = this._svgDecimals || 2;

        this._all.forEach(function (cmd) {

          if (cmd.name == "M") {

            x = cmd.points[0];
            y = cmd.points[1];
            str += "M" + x.toFixed(dc) + "," + y.toFixed(dc) + " ";
          }

          if (cmd.name == "m") {
            x = x + cmd.points[0];
            y = y + cmd.points[1];
            str += "M" + x.toFixed(dc) + "," + y.toFixed(dc) + " ";
          }

          if (cmd.name == "q") {

            str += "Q";
            for (var s = 0; s < cmd.points.length; s += 4) {
              var p = cmd.points;
              var x0 = x + p[s + 0],
                  y0 = y + p[s + 1];
              //x=x0; y=y0;
              var x1 = x + p[s + 2],
                  y1 = y + p[s + 3];
              x = x1;
              y = y1;
              str += x0.toFixed(dc) + "," + y0.toFixed(dc) + " " + x1.toFixed(dc) + "," + y1.toFixed(dc) + " ";
            }
          }

          // Not relative coordinates... the algo is much simpler here...
          if (cmd.name == "Q") {
            var p = cmd.points,
                len = cmd.points.length;
            str += "Q";
            for (var s = 0; s < len; s += 4) {
              var x0 = p[s + 0],
                  y0 = p[s + 1];
              var x1 = p[s + 2],
                  y1 = p[s + 3];
              x = x1;
              y = y1;
              str += x0.toFixed(dc) + "," + y0.toFixed(dc) + " " + x1.toFixed(dc) + "," + y1.toFixed(dc) + " ";
            }
          }

          if (cmd.name == "c") {
            str += "C";
            for (var s = 0; s < cmd.points.length; s += 6) {
              var p = cmd.points;
              var x0 = x + p[s + 0],
                  y0 = y + p[s + 1];
              //x=x0; y=y0;
              var x1 = x + p[s + 2],
                  y1 = y + p[s + 3];
              // x=x1; y=y1;
              var x2 = x + p[s + 4],
                  y2 = y + p[s + 5];
              x = x2;
              y = y2;
              str += x0.toFixed(dc) + "," + y0.toFixed(dc) + " " + x1.toFixed(dc) + "," + y1.toFixed(dc) + " " + x2.toFixed(dc) + "," + y2.toFixed(dc) + " ";
            }
          }

          // Not relative coordinates... the algo is much simpler here...
          if (cmd.name == "C") {

            var p = cmd.points,
                len = cmd.points.length;

            if (cmd.replaceFunction) {
              var sp = {
                x: x,
                y: y
              };
              for (var s = 0; s < len; s += 6) {
                // str+=p[s+0]+","+p[s+1]+" "+p[s+2]+","+p[s+3]+" "+p[s+4]+","+p[s+5]+" ";
                x = p[s + 4];
                y = p[s + 5];
              }
              var ref = {
                x: x - sp.x,
                y: y - sp.y
              };
              var strR = cmd.replaceFunction(sp, ref);
              // console.log("The inserted path ", strR);
              str += " " + strR + " ";
            } else {
              str += "C";
              for (var s = 0; s < len; s += 6) {
                str += p[s + 0].toFixed(dc) + "," + p[s + 1].toFixed(dc) + " " + p[s + 2].toFixed(dc) + "," + p[s + 3].toFixed(dc) + " " + p[s + 4].toFixed(dc) + "," + p[s + 5].toFixed(dc) + " ";
                x = p[s + 4];
                y = p[s + 5];
              }
            }
          }
          if (cmd.name == "l") {
            str += "L";
            for (var s = 0; s < cmd.points.length; s += 2) {
              var p = cmd.points;
              var x0 = x + p[s + 0],
                  y0 = y + p[s + 1];
              x = x0;
              y = y0;
              str += x0.toFixed(dc) + "," + y0.toFixed(dc) + " ";
            }
          }

          if (cmd.name == "H") {
            str += "L";
            for (var s = 0; s < cmd.points.length; s++) {
              var p = cmd.points;
              var x0 = p[s + 0];
              x = x0;
              // ctx.lineTo( x0, y );
              str += x0.toFixed(dc) + "," + y.toFixed(dc) + " ";
            }
          }

          if (cmd.name == "V") {
            str += "L";
            for (var s = 0; s < cmd.points.length; s++) {
              var p = cmd.points;
              var y0 = p[s + 0];
              y = y0;
              // ctx.lineTo( x, y0 );
              str += x.toFixed(dc) + "," + y0.toFixed(dc) + " ";
            }
          }

          if (cmd.name == "L") {

            if (cmd.replaceFunction) {
              var sp = {
                x: x,
                y: y
              };
              for (var s = 0; s < cmd.points.length; s += 2) {
                var p = cmd.points;
                var x0 = p[s + 0],
                    y0 = p[s + 1];
                x = x0;
                y = y0;
              }
              var ref = {
                x: x - sp.x,
                y: y - sp.y
              };
              var strR = cmd.replaceFunction(sp, ref);
              console.log("The inserted path ", strR);
              str += " " + strR + " ";
            } else {
              str += "L";
              for (var s = 0; s < cmd.points.length; s += 2) {
                var p = cmd.points;
                var x0 = p[s + 0],
                    y0 = p[s + 1];
                x = x0;
                y = y0;
                // ctx.lineTo( x0,y0 );
                str += x0.toFixed(dc) + "," + y0.toFixed(dc) + " ";
              }
            }
          }

          if (cmd.name == "z") {
            str += "z";
          }
        });
        return str;
      };

      /**
       * @param float t
       */
      _myTrait_.toBezierArray = function (t) {
        var _firstX,
            _firstY,
            x,
            y,
            str = "",
            res = [];
        this._all.forEach(function (cmd) {

          if (cmd.name == "M") {
            x = cmd.points[0];
            y = cmd.points[1];
          }

          // Not relative coordinates... the algo is much simpler here...
          if (cmd.name == "Q") {
            var p = cmd.points,
                len = cmd.points.length;
            for (var s = 0; s < len; s += 4) {
              var x0 = p[s + 0],
                  y0 = p[s + 1];
              var x1 = p[s + 2],
                  y1 = p[s + 3];

              var bc = new jsBezierCurve();
              bc.fromQuadCurve({
                x: x,
                y: y
              }, {
                x: x0,
                y: y0
              }, {
                x: x1,
                y: y1
              });
              res.push(bc);
              x = x1;
              y = y1;
            }
          }

          // Not relative coordinates... the algo is much simpler here...
          if (cmd.name == "C") {
            var p = cmd.points,
                len = cmd.points.length;
            for (var s = 0; s < len; s += 6) {

              var x0 = p[s + 0],
                  y0 = p[s + 1];
              var x1 = p[s + 2],
                  y1 = p[s + 3];
              var x2 = p[s + 4],
                  y2 = p[s + 5];
              var bc = new jsBezierCurve();
              bc.fromPoints({
                x: x,
                y: y
              }, {
                x: x0,
                y: y0
              }, {
                x: x1,
                y: y1
              }, {
                x: x2,
                y: y2
              });
              res.push(bc);
              x = x2;
              y = y2;
            }
          }

          if (cmd.name == "L") {
            str += "L";
            for (var s = 0; s < cmd.points.length; s += 2) {
              var p = cmd.points;
              var x0 = p[s + 0],
                  y0 = p[s + 1];
              var bc = new jsBezierCurve();
              bc.fromLine({
                x: x,
                y: y
              }, {
                x: x0,
                y: y0
              });
              res.push(bc);

              x = x0;
              y = y0;
            }
          }
        });
        return res;
      };

      /**
       * @param float t
       */
      _myTrait_.toQuaternionPath = function (t) {

        var isFirstPoint = true;
        var pv = {
          x: 0,
          y: 0
        };
        var dv = {
          x: 100,
          y: 0
        };
        var lastDv = {
          x: 100,
          y: 0
        };

        var matLib = jsVectors();

        var cmdList = [];

        // {"name":"L","points":[374.29469458855607,171.03419547847162]}
        this.forCmds(function (c) {
          //  main.div().text(JSON.stringify(c));
          var v = {};
          var cmd = {
            cmd: c.name,
            path: []
          };

          var pickQuat = function pickQuat(x, y) {

            dv.x = x - pv.x;
            dv.y = y - pv.y;
            var dist = Math.sqrt(dv.x * dv.x + dv.y * dv.y);
            if (dist == 0) {
              dv.x += 0.2;
              dv.y += 0.2;
              x += 0.02;
              y += 0.02;
              dist = Math.sqrt(dv.x * dv.x + dv.y * dv.y);
            }
            var r = matLib.angleBetween(lastDv, dv);

            var q = quaternion();
            q.setFromAxisRotation({
              x: 0,
              y: 0,
              z: 1
            }, r);

            if (!isFirstPoint) cmd.path.push({
              q: q,
              d: dist
            });
            isFirstPoint = false;
            pv.x = x;
            pv.y = y;
            lastDv.x = dv.x;
            lastDv.y = dv.y;
          };

          if (c.name == "M") {
            pickQuat(c.points[0], c.points[1]);
          }
          if (c.name == "L") {
            pickQuat(c.points[0], c.points[1]);
          }
          if (c.name == "Q") {
            pickQuat(c.points[0], c.points[1]);
            pickQuat(c.points[2], c.points[3]);
          }
          if (c.name == "C") {
            pickQuat(c.points[0], c.points[1]);
            pickQuat(c.points[2], c.points[3]);
            pickQuat(c.points[4], c.points[5]);
          }
          if (cmd.path.length) cmdList.push(cmd);
        });

        return cmdList;
      };

      /**
       * @param Object fn
       */
      _myTrait_.transformPoints = function (fn) {

        // creates a backup of the "all" and then uses the "all" as target
        var all = this.originals();
        var point = {
          x: 0,
          y: 0
        };
        var x,
            y,
            i,
            plen = all.length;
        var target = this._all;

        for (var i = 0; i < plen; i++) {

          var cmd = all[i],
              tCmd = this._all[i];

          if (!cmd) return;

          if (cmd.name == "M") {
            point.x = cmd.points[0];
            point.y = cmd.points[1];
            fn(point);
            tCmd.points[0] = point.x;
            tCmd.points[1] = point.y;
          }

          if (cmd.name == "Q") {
            var p = cmd.points,
                tp = tCmd.points,
                len = cmd.points.length;
            for (var s = 0; s < len; s += 4) {

              point.x = p[s + 0], point.y = p[s + 1];
              fn(point);
              tp[s + 0] = point.x, tp[s + 1] = point.y;

              point.x = p[s + 2], point.y = p[s + 3];
              fn(point);
              tp[s + 2] = point.x, tp[s + 3] = point.y;
            }
          }

          if (cmd.name == "C") {
            var p = cmd.points,
                tp = tCmd.points,
                len = cmd.points.length;
            for (var s = 0; s < len; s += 6) {

              point.x = p[s + 0], point.y = p[s + 1];
              fn(point);
              tp[s + 0] = point.x, tp[s + 1] = point.y;

              point.x = p[s + 2], point.y = p[s + 3];
              fn(point);
              tp[s + 2] = point.x, tp[s + 3] = point.y;

              point.x = p[s + 4], point.y = p[s + 5];
              fn(point);
              tp[s + 4] = point.x, tp[s + 5] = point.y;
            }
          }
          if (cmd.name == "L") {
            for (var s = 0; s < cmd.points.length; s += 2) {
              var p = cmd.points,
                  tp = tCmd.points;
              point.x = p[s + 0], point.y = p[s + 1];
              fn(point);
              tp[s + 0] = point.x, tp[s + 1] = point.y;
            }
          }
        }
      };
    })(this);
  };

  var svgPathParser = function svgPathParser(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof svgPathParser) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != svgPathParser._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new svgPathParser(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  svgPathParser._classInfo = {
    name: "svgPathParser"
  };
  svgPathParser.prototype = new svgPathParser_prototype();

  (function () {
    if (typeof define !== "undefined" && define !== null && define.amd != null) {
      __amdDefs__["svgPathParser"] = svgPathParser;
      this.svgPathParser = svgPathParser;
    } else if (typeof module !== "undefined" && module !== null && module.exports != null) {
      module.exports["svgPathParser"] = svgPathParser;
    } else {
      this.svgPathParser = svgPathParser;
    }
  }).call(new Function("return this")());

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var jsBezierCurve_prototype = function jsBezierCurve_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {
      var jsMath;

      // Initialize static variables here...

      /**
       * @param Object d
       * @param Object t
       */
      _myTrait_.derivate = function (d, t) {

        var P0 = this._points[d][0],
            P1 = this._points[d][1],
            P2 = this._points[d][2],
            P3 = this._points[d][3];

        var t2 = t * t;
        var nt = 1 - t;
        var nt2 = nt * nt;

        // dP(t) / dt =  -3(1-t)^2 * P0 + 3(1-t)^2 * P1 - 6t(1-t) * P1 - 3t^2 * P2 + 6t(1-t) * P2 + 3t^2 * P3
        // or from Wikipedia
        //
        // F(t)/dt = 3*nt2 * (P1-P0) + 6*t*nt*(P2-P1) + 3*t2*(P3-P2)

        // var derivative = -3*nt2* P0 + 3*nt2 * P1 - 6*t*nt*P1 - 3*t2 * P2 + 6*t*nt * P2 + 3*t2 * P3;

        // This should give the exact derivate of the point at certain position
        var FT_dt = 3 * nt2 * (P1 - P0) + 6 * t * nt * (P2 - P1) + 3 * t2 * (P3 - P2);
        return FT_dt;
      };

      /**
       * @param Object x
       * @param Object y
       */
      _myTrait_.distanceOf = function (x, y) {

        var t = this.findClosestT(x, y);
        var dx = this.x(t) - x,
            dy = this.y(t) - y;
        return Math.sqrt(dx * dx + dy * dy);
      };

      /**
       * @param Object x
       * @param Object y
       */
      _myTrait_.findClosestT = function (x, y) {

        var tStart = 0,
            tMiddle = 0.5,
            tEnd = 1;
        var iterations = 10;

        while (iterations--) {
          var d0_x = this.x(tStart) - x,
              d0_y = this.y(tStart) - y,
              d2_x = this.x(tEnd) - x,
              d2_y = this.y(tEnd) - y;
          var d0 = Math.sqrt(d0_x * d0_x + d0_y * d0_y),
              d2 = Math.sqrt(d2_x * d2_x + d2_y * d2_y);

          if (d0 < d2) {
            tEnd = tMiddle;
          } else {
            tStart = tMiddle;
          }
          tMiddle = tStart + (tEnd - tStart) / 2;
        }
        var d0_x = this.x(tStart) - x,
            d0_y = this.y(tStart) - y,
            d1_x = this.x(tMiddle) - x,
            d1_y = this.y(tMiddle) - y;
        d2_x = this.x(tEnd) - x, d2_y = this.y(tEnd) - y;
        var d0 = Math.sqrt(d0_x * d0_x + d0_y * d0_y),
            d1 = Math.sqrt(d1_x * d1_x + d1_y * d1_y),
            d2 = Math.sqrt(d2_x * d2_x + d2_y * d2_y);

        if (d0 < d1 && d0 < d2) return tStart;
        if (d2 < d1 && d2 < d0) return tEnd;
        return tMiddle;
      };

      /**
       * @param float list
       */
      _myTrait_.fitListTo = function (list) {

        var start = {
          x: list[0].point_x(0),
          y: list[0].point_y(0)
        };

        var ei = list.length - 1;

        var end = {
          x: list[ei].point_x(3),
          y: list[ei].point_y(3)
        };

        // what we have here is a list of segments, starting from (x,y) ending to (x2,y2)
        // have to rotate
        // have to scale

        var myStart = {
          x: this.x(0),
          y: this.y(0)
        };
        var myEnd = {
          x: this.x(1),
          y: this.y(1)
        };
        var dx = myEnd.x - myStart.x,
            dy = myEnd.y - myStart.y;

        var myLen = Math.sqrt(dx * dx + dy * dy);

        var ldx = end.x - start.x,
            ldy = end.y - start.y;

        var listLen = Math.sqrt(ldx * ldx + ldy * ldy);
        var relAngle = jsMath.angleBetween({
          x: dx,
          y: dy
        }, {
          x: ldx,
          y: ldy
        });

        // TODO: convert to path parser fromBezierArray()
        // make a quaternion list
        // scale & rotate the quaternion data to create new path
      };

      /**
       * @param float p0
       * @param float p1
       */
      _myTrait_.fromLine = function (p0, p1) {

        var len = p1.x - p0.x;
        var step = len / 3;
        this.initCoeffs(0, p0.x, p0.x + step, p0.x + step * 2, p1.x);

        var len = p1.y - p0.y;
        var step = len / 3;
        this.initCoeffs(1, p0.y, p0.y + step, p0.y + step * 2, p1.y);
      };

      /**
       * @param float p0
       * @param float p1
       * @param float p2
       * @param float p3
       */
      _myTrait_.fromPoints = function (p0, p1, p2, p3) {
        this.initCoeffs(0, p0.x, p1.x, p2.x, p3.x);
        this.initCoeffs(1, p0.y, p1.y, p2.y, p3.y);
      };

      /**
       * @param float p0
       * @param float p1
       * @param float p2
       */
      _myTrait_.fromQuadCurve = function (p0, p1, p2) {
        //CP1 = QP0 + 2/3 *(QP1-QP0)
        //CP2 = QP2 + 2/3 *(QP1-QP2)

        this.initCoeffs(0, p0.x, p0.x + 2 / 3 * (p1.x - p0.x), p2.x + 2 / 3 * (p1.x - p2.x), p2.x);
        this.initCoeffs(0, p0.y, p0.y + 2 / 3 * (p1.y - p0.y), p2.y + 2 / 3 * (p1.y - p2.y), p2.y);

        /*
        p1.x, p2.x, p3.x);
        this.initCoeffs(1, p0.y, p1.y, p2.y, p3.y);
        return {
        p0 : p0,
        p1 : p0 + 2/3 *(p1-p0),
        p2 : p2 + 2/3 *(p1-p2),
        p3 : p2
        }
        */
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (t) {

        this._points = [];
        this._m = [];

        if (!jsMath) jsMath = jsVectors();
      });

      /**
       * @param Object d
       * @param Object v0
       * @param Object v1
       * @param Object v2
       * @param Object v3
       */
      _myTrait_.initCoeffs = function (d, v0, v1, v2, v3) {

        if (!this._coeffs) this._coeffs = [];

        if (!this._coeffs[d]) this._coeffs[d] = [];
        if (!this._points[d]) this._points[d] = [];

        // the actual points used in each dimension
        this._points[d][0] = v0;
        this._points[d][1] = v1;
        this._points[d][2] = v2;
        this._points[d][3] = v3;

        var c = this._coeffs[d];
        c[0] = 3 * (v1 - v0);
        c[1] = 3 * (v2 - v1) - c[0];
        c[2] = v3 - v0 - c[0] - c[1];
        c[3] = v0;
        /*
        if(d==0) {
            this._m[0].x = v0;
            this._m[1].x = v1;
            this._m[2].x = v2;
            this._m[3].x = v3;
        }  
        if(d==1) {
            this._m[0].y = v0;
            this._m[1].y = v1;
            this._m[2].y = v2;
            this._m[3].y = v3;
        }
        */
      };

      /**
       * @param Object projection
       */
      _myTrait_.inverseProject = function (projection) {

        var pt = projection.t;

        var n = this.normal(pt, true);

        var p_x = n.x * projection.nvProd + this.x(pt),
            p_y = n.y * projection.nvProd + this.y(pt);

        var t = this.tangent(pt, true);

        p_x = p_x + projection.tangetProd * t.x;
        p_y = p_y + projection.tangetProd * t.y;

        // inverse x and inverse y
        projection.ix = p_x;
        projection.iy = p_y;
      };

      /**
       * @param float t
       */
      _myTrait_.mirrorControls = function (t) {

        var base = {
          x: this._points[0][0],
          y: this._points[1][0]
        };

        var along = {
          x: this._points[0][3],
          y: this._points[1][3]
        };

        var v1 = {
          x: this._points[0][1],
          y: this._points[1][1]
        };
        var v2 = {
          x: this._points[0][2],
          y: this._points[1][2]
        };

        jsMath.mirrorVector(v1, along, base);
        jsMath.mirrorVector(v2, along, base);

        this.initCoeffs(0, base.x, v1.x, v2.x, along.x);
        this.initCoeffs(1, base.y, v1.y, v2.y, along.y);
      };

      /**
       * @param Object t
       * @param Object bUnitVector
       */
      _myTrait_.normal = function (t, bUnitVector) {

        var v = this.tangent(t);
        // direction of the curve at certain point...
        var vx = v.x;
        v.x = -v.y;
        v.y = vx;
        if (bUnitVector) jsMath.normalize(v);
        return v;
      };

      /**
       * @param Object i
       */
      _myTrait_.point_x = function (i) {

        return this._points[0][i];
      };

      /**
       * @param Object i
       */
      _myTrait_.point_y = function (i) {

        return this._points[1][i];
      };

      /**
       */
      _myTrait_.points = function () {

        return this._m;
      };

      /**
       * @param Object x
       * @param Object y
       * @param Object projection
       */
      _myTrait_.projectPoint = function (x, y, projection) {

        // logaritmic function ?

        var maxCnt = 20;
        var t = 0.5,
            step = 0.25; // start from the middle

        while (maxCnt--) {

          // We try to find a point where the projection to the tangent is as small as possible
          var tn = this.tangent(t, true);
          dv.x = x - this.x(t);
          dv.y = y - this.y(t);
          var prod = dv.x * tn.x + dv.y * tn.y;

          // close enough
          if (Math.abs(prod) < 0.05) {
            // found it...
            break;
          }
          if (prod > 0) {
            t += step;
          } else {
            t += -step;
          }
          step = step / 2;
        }

        var n = this.normal(t, true);
        if (!projection) projection = {};
        projection.tangentProd = prod;
        projection.nvProd = n.x * dv.x + n.y * d.y;
        projection.nv_x = n.x;
        projection.nv_y = n.y;
        projection.tn_x = tn.x;
        projection.tn_y = tn.y;
        projection.ix = 0; // when projected back, the inversed coords here
        projection.iy = 0;
        projection.t = t;

        return projection;
      };

      /**
       * @param Object p0
       * @param Object p1
       * @param Object p2
       * @param Object p3
       * @param Object fn
       */
      _myTrait_.setControls = function (p0, p1, p2, p3, fn) {

        this.initCoeffs(0, p0.x, p1.x, p2.x, p3.x);
        this.initCoeffs(1, p0.y, p1.y, p2.y, p3.y);
      };

      /**
       * @param float t
       */
      _myTrait_.split = function (t) {

        var plist = this._points[0];
        var v1 = this.splitCoeff(plist[0], plist[1], plist[2], plist[3], t);
        plist = this._points[1];
        var v2 = this.splitCoeff(plist[0], plist[1], plist[2], plist[3], t);

        this.fromPoints({
          x: v1.p0,
          y: v2.p0
        }, {
          x: v1.p1,
          y: v2.p1
        }, {
          x: v1.p2,
          y: v2.p2
        }, {
          x: v1.p3,
          y: v2.p3
        });

        var b2 = jsBezierCurve();
        b2.fromPoints({
          x: v1.p3,
          y: v2.p3
        }, {
          x: v1.p4,
          y: v2.p4
        }, {
          x: v1.p5,
          y: v2.p5
        }, {
          x: v1.p6,
          y: v2.p6
        });

        return b2;
      };

      /**
       * @param float P0
       * @param float P1
       * @param float P2
       * @param float P3
       * @param float t
       */
      _myTrait_.splitCoeff = function (P0, P1, P2, P3, t) {
        var v = {};
        v.p0 = P0;
        v.p1 = (1 - t) * P0 + t * P1;
        var m2 = (1 - t) * P1 + t * P2;
        v.p5 = (1 - t) * P2 + t * P3;

        v.p2 = (1 - t) * v.p1 + t * m2;
        v.p4 = (1 - t) * m2 + t * v.p5;
        v.p3 = (1 - t) * v.p2 + t * v.p4;
        v.p6 = P3;

        return v;
      };

      /**
       * @param Object t
       * @param Object dim
       */
      _myTrait_.step = function (t, dim) {

        if (!this._coeffs) return;
        var c = this._coeffs[dim];
        if (!c) return;
        var t2 = t * t,
            t3 = t2 * t;
        return c[2] * t3 + c[1] * t2 + c[0] * t + c[3];
      };

      /**
       * @param Object t
       * @param Object bUnitVector
       */
      _myTrait_.tangent = function (t, bUnitVector) {

        // direction of the curve at certain point...
        var nv = {};
        nv.x = this.derivate(0, t);
        nv.y = this.derivate(1, t);
        if (bUnitVector) jsMath.normalize(nv);
        return nv;
      };

      /**
       * @param Object t
       */
      _myTrait_.x = function (t) {

        return this.step(t, 0);
      };

      /**
       * @param Object t
       */
      _myTrait_.y = function (t) {

        return this.step(t, 1);
      };

      /**
       * @param float t
       */
      _myTrait_.z = function (t) {
        return this.step(t, 2);
      };
    })(this);
  };

  var jsBezierCurve = function jsBezierCurve(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof jsBezierCurve) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != jsBezierCurve._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new jsBezierCurve(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  jsBezierCurve._classInfo = {
    name: "jsBezierCurve"
  };
  jsBezierCurve.prototype = new jsBezierCurve_prototype();

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var displayItem_prototype = function displayItem_prototype() {
    // Then create the traits and subclasses for this class here...

    // trait comes here...

    (function (_myTrait_) {
      var _eventOn;
      var _commands;

      // Initialize static variables here...

      /**
       * @param float t
       */
      _myTrait_.guid = function (t) {

        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        //return Math.random();
        // return Math.random().toString(36);

        /*    
        return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
        */
        /*        
        function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();*/
      };

      /**
       * @param float i
       */
      _myTrait_.indexOf = function (i) {

        if (typeof i == "undefined") {
          return this._model.indexOf();
        }

        if (!this._model || !this._model.items) return -1;

        if (i._callRender) {
          return this._model.items.indexOf(i.model());
        }
        return this._model.items.indexOf(i);
      };

      /**
       * @param float t
       */
      _myTrait_.isArray = function (t) {

        if (typeof t == "undefined") return this.__isA;

        return Object.prototype.toString.call(t) === "[object Array]";
      };

      /**
       * @param float fn
       */
      _myTrait_.isFunction = function (fn) {
        return Object.prototype.toString.call(fn) == "[object Function]";
      };

      /**
       * @param float t
       */
      _myTrait_.isObject = function (t) {

        if (typeof t == "undefined") return this.__isO;

        return t === Object(t);
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {
      var _eventOn;
      var _commands;

      // Initialize static variables here...

      /**
       * @param float t
       */
      _myTrait_.displayParent = function (t) {

        if (this._extParent) return this._extParent;

        var p = this._model.parent();
        if (p) {
          var pp = p.parent();
          if (pp) {
            return displayItem(pp);
          }
        }
      };

      /**
       * @param float t
       */
      _myTrait_.firstChild = function (t) {

        if (this.items) {
          return this.items.item(0);
        }
      };

      /**
       * @param float fn
       */
      _myTrait_.forChildren = function (fn) {
        fn(this);
        if (this.items) {
          var me = this;
          this.items.forEach(function (subItem) {
            subItem.forChildren(fn);
          });
        }
      };

      /**
       * @param float item
       */
      _myTrait_.next = function (item) {

        if (item) {
          return this;
        }

        var i = this._model.indexOf(),
            p = this._model.parent();

        if (p) return p.item(i + 1);
      };

      /**
       * @param float item
       */
      _myTrait_.prev = function (item) {
        if (item) {
          console.error("Setting prev and next not implemented");
          /*
          var oldP = item.parent();
          var myInd = this.indexOf();
          var myP = this.parent();
          if(oldP) {
          if(myP != oldP) {
           item.remove();
           myP.push( item );
          }
          } else {
          myP.push( item );
          }
          item.moveToIndex( myInd  );
          */
          return this;
        }

        var i = this._model.indexOf(),
            p = this._model.parent();

        if (p && i > 0) return p.item(i - 1);
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {
      var _eventOn;
      var _commands;

      // Initialize static variables here...

      /**
       * @param float t
       */
      _myTrait_.createBox = function (t) {};

      /**
       * @param float t
       */
      _myTrait_.createEmptyBook = function (t) {
        return _data({
          "data": {
            "type": "displayItem",
            "renderClass": "book",
            "w": 1000,
            "h": 1000,
            "ri": 0,
            "rj": 0,
            "items": {
              "data": [{
                "data": {
                  "type": "displayItem",
                  "renderClass": "page",
                  "w": 1000,
                  "h": 1000,
                  "ri": 0,
                  "rj": 0,
                  "items": {
                    "data": [],
                    "__id": this.guid()
                  },
                  "rmatrix": {
                    "data": {
                      "m00": 1,
                      "m01": 0,
                      "m02": 0,
                      "m10": 0,
                      "m11": 1,
                      "m12": 0,
                      "m20": 0,
                      "m21": 0,
                      "m22": 1
                    },
                    "__id": this.guid()
                  }
                },
                "__id": this.guid()
              }],
              "__id": this.guid()
            },
            "rmatrix": {
              "data": {
                "m00": 1,
                "m01": 0,
                "m02": 0,
                "m10": 0,
                "m11": 1,
                "m12": 0,
                "m20": 0,
                "m21": 0,
                "m22": 1
              },
              "__id": this.guid()
            }
          },
          "__id": this.guid()
        });
      };

      /**
       * @param float className
       * @param float options
       */
      _myTrait_.createObject = function (className, options) {

        options = options || {};
        /*
        ,
                    "rmatrix": {
                      "data": {
                        "m00": 1,
                        "m01": 0,
                        "m02": 0,
                        "m10": 0,
                        "m11": 1,
                        "m12": 0,
                        "m20": 0,
                        "m21": 0,
                        "m22": 1
                      },
                      "__id": "i7jeyl18loe9i21osxgvsm140w"
                    }
        */
        var plainData = {
          type: "displayItem",
          renderClass: className,
          bgcolor: "red",
          x: 0,
          y: 0,
          w: 300,
          h: 300,
          ri: 0,
          rj: 0,
          alpha: 1,
          scaleFactor: 1,
          rmatrix: {
            m00: 1,
            m01: 0,
            m02: 0,
            m10: 0,
            m11: 1,
            m12: 0,
            m20: 0,
            m21: 0,
            m22: 1
          },
          items: []
        };

        if (options) {
          for (var n in options) {
            if (n == "noParent") continue;
            plainData[n] = options[n];
          }
        }

        if (options.noParent) {
          var obj = _data(plainData);
          return obj;
        }

        var i = this.items.length();
        this.items.push(plainData);

        var newItem = displayItem(this.items.at(i));

        return newItem;

        // --- the old insert is below
        /*
        var obj = _data(plainData);
        var me = this;
        if(this.items && !options.noParent ) {
        obj.then(
        function() {
            console.log("The new item about to be pushed to the array of items");
            me.items.push( obj );
        });
        }
        return obj;
        */
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {
      var _eventOn;
      var _commands;

      // Initialize static variables here...

      /**
       * @param float t
       */
      _myTrait_.align = function (t) {
        if (typeof t != "undefined") {
          this._model.set("align", t);
          return this;
        }
        return this._model.get("align");
      };

      /**
       * @param float t
       */
      _myTrait_.alpha = function (t) {
        if (typeof t != "undefined") {
          this._model.set("alpha", t);
          return this;
        }
        return this._model.get("alpha");
      };

      /**
       * @param float t
       */
      _myTrait_.autoFit = function (t) {
        if (typeof t != "undefined") {
          this._model.set("autoFit", t);
          return this;
        }
        return this._model.get("autoFit");
      };

      /**
       * @param float t
       */
      _myTrait_.bgcolor = function (t) {
        if (typeof t != "undefined") {
          this._model.set("bgcolor", t);
          return this;
        }
        if (this._ext) return this._extModel.get("bgcolor");
        return this._model.get("bgcolor");
      };

      /**
       * @param float t
       */
      _myTrait_.fitToPage = function (t) {
        if (typeof t != "undefined") {
          this._model.set("fitToPage", t);
          return this;
        }
        return this._model.get("fitToPage");
      };

      /**
       * @param float t
       */
      _myTrait_.fontFamily = function (t) {
        if (typeof t != "undefined") {
          this._model.set("fontFamily", t);
          return this;
        }
        return this._model.get("fontFamily");
      };

      /**
       * @param float t
       */
      _myTrait_.fontSize = function (t) {
        if (typeof t != "undefined") {
          this._model.set("fontSize", t);
          return this;
        }
        return this._model.get("fontSize");
      };

      /**
       * @param float n
       */
      _myTrait_.get = function (n) {
        return this._model.get(n);
      };

      /**
       * @param float t
       */
      _myTrait_.h = function (t) {
        if (typeof t != "undefined") {
          this._model.set("h", t);
          return this;
        }
        return this._model.get("h");
      };

      /**
       * @param float propName
       */
      _myTrait_.hasOwn = function (propName) {
        return this._model.hasOwn(propName);
      };

      /**
       * @param float t
       */
      _myTrait_.model = function (t) {
        return this._model;
      };

      /**
       * @param float t
       */
      _myTrait_.parent = function (t) {

        if (this._extParent) {
          return this._extParent._model.items;
        }

        var p = this._model.parent();
        if (p) {
          return this._find(p.getID());
        }
      };

      /**
       * @param float t
       */
      _myTrait_.rad = function (t) {
        if (typeof t != "undefined") {
          this._model.set("rad", t);
          return this;
        }
        return this._model.get("rad");
      };

      /**
       * @param float t
       */
      _myTrait_.renderClass = function (t) {
        if (typeof t != "undefined") {
          this._model.set("renderClass", t);
          return this;
        }
        return this._model.get("renderClass");
      };

      /**
       * @param float t
       */
      _myTrait_.ri = function (t) {
        if (typeof t != "undefined") {
          this._model.set("ri", t);
          return this;
        }
        return this._model.get("ri") || 0;
      };

      /**
       * @param float t
       */
      _myTrait_.rj = function (t) {
        if (typeof t != "undefined") {
          this._model.set("rj", t);
          return this;
        }
        return this._model.get("rj") || 0;
      };

      /**
       * @param float t
       */
      _myTrait_.scaleFactor = function (t) {
        if (typeof t != "undefined") {
          this._model.set("scaleFactor", t);
          return this;
        }
        return this._model.get("scaleFactor");
      };

      /**
       * @param float n
       * @param float v
       */
      _myTrait_.set = function (n, v) {
        if (typeof v != "undefined") {
          this._model.set(n, v);
          return this;
        }
        return this._model.get(n);
      };

      /**
       * @param float t
       */
      _myTrait_.shadowBlur = function (t) {
        if (typeof t != "undefined") {
          this._model.set("shadowBlur", t);
          return this;
        }
        return this._model.get("shadowBlur");
      };

      /**
       * @param float t
       */
      _myTrait_.shadowColor = function (t) {
        if (typeof t != "undefined") {
          this._model.set("shadowColor", t);
          return this;
        }
        return this._model.get("shadowColor");
      };

      /**
       * @param float t
       */
      _myTrait_.svgPath = function (t) {
        if (typeof t != "undefined") {
          this._model.set("svgPath", t);
          return this;
        }
        return this._model.get("svgPath");
      };

      /**
       * @param float t
       */
      _myTrait_.text = function (t) {
        if (typeof t != "undefined") {
          this._model.set("text", t);
          return this;
        }
        return this._model.get("text");
      };

      /**
       * @param float t
       */
      _myTrait_.txtAlign = function (t) {
        if (typeof t != "undefined") {
          this._model.set("txtAlign", t);
          return this;
        }
        return this._model.get("txtAlign");
      };

      /**
       * @param float t
       */
      _myTrait_.w = function (t) {
        if (typeof t != "undefined") {
          this._model.set("w", t);
          return this;
        }
        return this._model.get("w");
      };

      /**
       * @param float t
       */
      _myTrait_.x = function (t) {
        if (typeof t != "undefined") {
          this._model.set("x", t);
          return this;
        }
        return this._model.get("x");
      };

      /**
       * @param float t
       */
      _myTrait_.y = function (t) {
        if (typeof t != "undefined") {
          this._model.set("y", t);
          return this;
        }
        return this._model.get("y");
      };
    })(this);

    // trait comes here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * Binds event name to event function
       * @param string en  - Event name
       * @param float ef
       */
      _myTrait_.on = function (en, ef) {
        if (!this._ev) this._ev = {};
        if (!this._ev[en]) this._ev[en] = [];

        this._ev[en].push(ef);

        if (this._model) {
          this._model.on(en, ef);
        }

        return this;
      };

      /**
       * triggers event with data and optional function
       * @param string en
       * @param float data
       * @param float fn
       */
      _myTrait_.trigger = function (en, data, fn) {

        if (!this._ev) return;
        if (!this._ev[en]) return;
        var me = this;
        this._ev[en].forEach(function (cb) {
          cb(me, data, fn);
        });
        return this;
      };
    })(this);

    (function (_myTrait_) {
      var _renderFunctions;
      var _handleRenderFn;
      var _activeItems;
      var _debugView;
      var _initDone;
      var _renderables;
      var _cameraList;
      var _cameraFunctions;
      var _activeCamera;
      var _displayList;
      var _keyboard;
      var _renderScope;
      var _activeChangeListeners;
      var _objectCache;
      var lastOnMs;
      var minDeltaMs;
      var _batchItems;

      // Initialize static variables here...

      /**
       * @param float t
       */
      _myTrait_._callCamera = function (t) {
        var rt = this.renderClass();

        if (_cameraFunctions[rt]) {
          _cameraFunctions[rt](this);
        }
      };

      /**
       * @param float t
       */
      _myTrait_._callRender = function (t) {
        var rt = this.renderClass();

        if (!_renderFunctions) return;

        if (_renderFunctions[rt]) {
          _renderFunctions[rt](this);
        } else {
          if (this._renderFn) {}
        }

        var data = this.getRenderData();
        data.lastIndex = _renderables.renderIndex;

        if (this.items) {
          this.items.forEach(function (i) {
            i._callRender();
          });
        }

        if (this._handlesVisible) this.showHandles();
      };

      if (!_myTrait_.hasOwnProperty("__factoryClass")) _myTrait_.__factoryClass = [];
      _myTrait_.__factoryClass.push(function (model) {

        if (_objectCache && model && model.getID) {
          var id = model.getID(),
              obj = _objectCache[id];
          if (obj) return obj;
        }
      });

      /**
       * @param float id
       */
      _myTrait_._find = function (id) {
        if (!_objectCache) _objectCache = {};
        var co = _objectCache[id];
        if (co) return co;
        return displayItem(_data(id));
      };

      /**
       * @param Object me
       * @param float model
       */
      _myTrait_._getTransfromFromModel = function (me, model) {

        var o = me;
        me.on("x", function (oo, v) {
          me._setBatchItem(model.getID(), me);
          var tm = o.getTransformMatrix();
          tm.m30(v);
        });
        me.on("y", function (oo, v) {
          me._setBatchItem(model.getID(), me);
          var tm = o.getTransformMatrix();
          tm.m31(v);
        });
        me.on("scaleFactor", function (oo, v) {
          me._setBatchItem(model.getID(), me);
          var sm = o.getScaleMatrix();
          sm.scale(v);
        });

        me.on("rad", function (oo, v) {
          if (isNaN(v)) return;
          me._setBatchItem(model.getID(), me);
          var sn = Math.sin(v),
              cs = Math.cos(v);
          var rm = o.getRotationMatrix();
          rm.m00(cs);
          rm.m11(cs);
          rm.m10(-1 * sn);
          rm.m01(sn);
        });

        var doR = false;
        if (me.x && me.y) {
          me.translate(me.x(), me.y(), 0);
          doR = true;
        }

        if (me.rad) {
          var v = me.rad();
          if (!isNaN(v)) {
            var sn = Math.sin(v),
                cs = Math.cos(v);
            var rm = o.getRotationMatrix();
            rm.m00(cs);
            rm.m11(cs);
            rm.m10(-1 * sn);
            rm.m01(sn);
          }
        }

        if (me.scaleFactor) {
          me.scale(me.scaleFactor());
          doR = true;
        }

        this._batchItems(model.getID(), this);
      };

      /**
       * This function is run on every frame, to update transformations for rendering and eventually to render items on screen.
       * @param float t
       */
      _myTrait_._onFrame = function (t) {
        var ms = new Date().getTime();

        if (lastOnMs) {
          var delta = ms - lastOnMs;
          if (delta > minDeltaMs) {
            minDeltaMs = delta * 2;

            lastOnMs = ms;
            return;
          }
        }

        lastOnMs = ms;

        // check if we have something to render.

        var tot_cnt = 0;

        for (var n in _batchItems) {
          if (_batchItems.hasOwn(n)) {
            tot_cnt++;
            delete _batchItems[n];
          }
        }
        if (tot_cnt == 0) return;

        console.log("Batch cnt ", tot_cnt);

        var index = _renderables.renderIndex;

        var rObj,
            bCamInit = false;

        // if the surface has a bitmap frame, like canvas, now is the time to clear it   
        _displayList.forEach(function (display) {
          display.getSurface().frameClear(index);
        });

        // transform the nodes in their matrix space   
        _displayList.forEach(function (display) {
          var cam = display.getCamera();
          cam._callCamera(); // initialize camera
          var root = cam.getRootNode();
          root.startRootTransform();
        });

        // render the display lists
        _displayList.forEach(function (display) {
          display.renderTree();
        });

        // some advanced surface, like 3rd party libraries, may have their own "render" function, which can be
        // called here before the rendering tree setup.
        _displayList.forEach(function (display) {
          var s = display.getSurface();
          if (s.frameFinish) {
            s.frameFinish(index);
          }
        });

        // saving the new transformations to remote data, if any
        _displayList.forEach(function (display) {
          var cam = display.getCamera();
          var root = cam.getRootNode();
          root.saveTransformUpdates();
        });

        // The renderables is perhaps a bit difficult, is it???
        _renderables.renderIndex++;
      };

      /**
       * @param float t
       */
      _myTrait_._prepareCameras = function (t) {

        if (_cameraList) {
          _cameraList.forEach(function (cam) {
            if (cam._callCamera) cam._callCamera();
          });
        }
      };

      /**
       * @param float id
       * @param float obj
       */
      _myTrait_._setBatchItem = function (id, obj) {
        _batchItems[id] = obj;
      };

      /**
       * The bounding box for the active items.
       * @param float camera
       */
      _myTrait_.activeItemsBB = function (camera) {

        var rect = {};

        // projection....
        this.forActiveItems(function (item) {

          item.projectToCamera(camera);
          var view = item.getViewMatrix(camera);

          var list = [];
          list.push(view.projectVector({
            x: 0,
            y: 0,
            z: 0,
            w: 1
          }));
          list.push(view.projectVector({
            x: item.w(),
            y: 0,
            z: 0,
            w: 1
          }));
          list.push(view.projectVector({
            x: item.w(),
            y: item.h(),
            z: 0,
            w: 1
          }));
          list.push(view.projectVector({
            x: 0,
            y: item.h(),
            z: 0,
            w: 1
          }));

          list.forEach(function (v) {
            if (typeof rect.xmin == "undefined") {
              rect.xmin = v.x;
              rect.xmax = v.x;
            }
            if (typeof rect.ymin == "undefined") {
              rect.ymin = v.y;
              rect.ymax = v.y;
            }

            if (v.x < rect.xmin) rect.xmin = v.x;
            if (v.y < rect.ymin) rect.ymin = v.y;
            if (v.x > rect.xmax) rect.xmax = v.x;
            if (v.y > rect.ymax) rect.ymax = v.y;
          });
        });

        return rect;
      };

      /**
       * @param float item
       * @param float bClearOthers
       */
      _myTrait_.addActiveItem = function (item, bClearOthers) {

        if (bClearOthers) {
          this.clearActiveItems();
        }

        if (this.isArray(item)) {
          var me = this;
          item.forEach(function (ii) {
            me.addActiveItem(ii);
          });
          return this;
        }

        if (_activeItems.indexOf(item) >= 0) return;

        _activeItems.push(item);

        _activeChangeListeners.forEach(function (fn) {
          fn(item);
        });
      };

      /**
       * @param float cam
       */
      _myTrait_.addCamera = function (cam) {

        if (_cameraList.indexOf(cam) < 0) {
          _cameraList.push(cam);
        }
      };

      /**
       * @param float displayId
       * @param float pDisplay
       */
      _myTrait_.addToDisplay = function (displayId, pDisplay) {

        if (!this._displayList) {
          this._displayList = {};
        }

        if (this.isObject(displayId)) {
          pDisplay = displayId;
          displayId = pDisplay.id();
        }

        this._displayList[displayId] = pDisplay;
      };

      /**
       * @param float newParent
       */
      _myTrait_.addToGroup = function (newParent) {

        if (newParent == this) return;

        var p = this.parent();
        if (p) p = p.parent();
        if (p && p != newParent) {

          var transV = this.getRenderMatrix().projectVector({
            x: this.w() * this.ri(),
            y: this.h() * this.rj(),
            z: 0,
            w: 1
          });

          var newPInv = newParent.getRenderMatrix().createCopy().inverse();
          //var myRendTrans = this.getRenderMatrix().createTransformCopy();

          var invV = newPInv.projectVector(transV);

          var newR = newParent._rotMatrix.createCopy().inverse().matMul(this._rotMatrix);
          var newS = newParent._scaleMatrix.createCopy().inverse().matMul(this._scaleMatrix);
          this._transMatrix.m30(invV.x);
          this._transMatrix.m31(invV.y);
          this._transMatrix.m32(invV.z);

          //this._transMatrix.m30( newPInv.m30() );
          //this._transMatrix.m31( newPInv.m31() );
          //this._transMatrix.m32( newPInv.m32() );

          this._rotMatrix.copyFrom(newR);
          this._scaleMatrix.copyFrom(newS);

          this.remove();

          newParent.items.push(this);

          this.callRender();
        }
      };

      /**
       * @param float obj
       */
      _myTrait_.addToRenderList = function (obj) {

        if (obj.isFulfilled && !obj.isFulfilled()) return;

        if (_renderables) {
          var p = obj,
              np;
          while (np = p.parent()) {
            if (np.addToRenderList) {
              p = np;
            } else {
              break;
            }
          }

          if (_renderables.list.indexOf(p) < 0) {
            _renderables.list.push(p);
          }
        }
      };

      /**
       * @param float withRotPoint
       */
      _myTrait_.applyLocalTransform = function (withRotPoint) {
        // Wasting a bit resources here :/

        var local = Matrix3D();

        var ri = 0,
            rj = 0;

        if (withRotPoint) {
          ri = withRotPoint.i;
          rj = withRotPoint.j;
        } else {
          if (this.ri) {
            ri = this.ri();
            rj = this.rj();
          }
        }

        var toCorner = Matrix3D();
        toCorner.translate({
          x: -1 * ri * this.w(),
          y: -1 * rj * this.h(),
          z: 0
        });

        local.matMul(this._transMatrix);
        local.matMul(this._scaleMatrix);
        local.matMul(this._rotMatrix);
        local.matMul(toCorner);

        return local;
      };

      /**
       * @param Matrix3D parentMatrix
       * @param float noRecurse
       */
      _myTrait_.applyTransforms = function (parentMatrix, noRecurse) {
        // Wasting a bit resources here :/

        var local = Matrix3D();

        if (!parentMatrix) {
          parentMatrix = Matrix3D();
        } else {
          parentMatrix = parentMatrix.createCopy();
        }

        if (!this._lastParentMatrix) {
          this._lastParentMatrix = parentMatrix.createCopy();
        } else {
          this._lastParentMatrix.copyFrom(parentMatrix);
        }

        this._scaleMatrix.blend();

        var m0 = 1;

        var ri = 0,
            rj = 0;

        if (this.ri) {
          ri = this.ri();
          rj = this.rj();
        }

        var backToCenter = Matrix3D();
        backToCenter.translate({
          x: ri * this.w(),
          y: rj * this.h(),
          z: 0
        });
        var toCorner = Matrix3D();
        toCorner.translate({
          x: -1 * ri * this.w(),
          y: -1 * rj * this.h(),
          z: 0
        });
        var rotM = this._rotMatrix.createCopy();

        local.matMul(this._transMatrix);

        // -- used to be this:
        //  this._beforeRot = this._renderMatrix.createCopy();
        var beforeRot = parentMatrix.createCopy();
        beforeRot.matMul(this._transMatrix);
        this._beforeRot = beforeRot;

        local.matMul(this._scaleMatrix);
        local.matMul(this._rotMatrix);
        local.matMul(toCorner);

        this._localTransform = local;

        parentMatrix.matMul(local);

        if (this._renderMatrix) {
          this._renderMatrix.copyFrom(parentMatrix);
        }

        if (this.items && !noRecurse) {
          var rm = this._renderMatrix;
          this.items.forEach(function (i) {
            if (i.applyTransforms) {
              i.applyTransforms(rm);
            }
          });
        }

        /*
        if(parentMatrix) {
        this._renderMatrix = parentMatrix.createCopy(); 
        } else {
        this._renderMatrix = Matrix3D();
        }
        if(!this._lastParentMatrix) {
        this._lastParentMatrix = this._renderMatrix.createCopy();
        } else {
        this._lastParentMatrix.copyFrom(this._renderMatrix);
        }
        this._scaleMatrix.blend();
        var m0 = 1;
        var ri = 0,
        rj = 0;
        if(this.ri) {
        ri = this.ri();
        rj = this.rj();
        }
        var backToCenter = Matrix3D();
        backToCenter.translate( { x: ri*this.w(),  y: rj*this.h(), z:0});
        var toCorner = Matrix3D();
        toCorner.translate( { x: -1*ri*this.w(),  y: -1*rj*this.h(), z:0});
        var rotM = this._rotMatrix.createCopy();
        this._renderMatrix.matMul(this._transMatrix);
        this._beforeRot = this._renderMatrix.createCopy();
        this._renderMatrix.matMul(this._scaleMatrix);
        // this._renderMatrix.matMul(backToCenter);
        this._renderMatrix.matMul( this._rotMatrix);
        // **** THE GRAVITY POINT HERE
        this._renderMatrix.matMul(toCorner);
        if(this.items && !noRecurse) {
        var rm = this._renderMatrix;
        this.items.forEach(function(i) {
        if(i.applyTransforms) {
            i.applyTransforms( rm );
        }
        });
        }
        */
        // this._renderMatrix.log();

        return this._renderMatrix;
      };

      /**
       * @param float t
       */
      _myTrait_.areHandlesVisible = function (t) {
        return this._handlesVisible;
      };

      /**
       * @param float id
       * @param float val
       */
      _myTrait_.askToRemove = function (id, val) {

        if (!this._askToRemove) this._askToRemove = {};

        if (typeof val == "undefined") return this._askToRemove[id];

        this._askToRemove[id] = val;
      };

      /**
       * @param float t
       */
      _myTrait_.callRender = function (t) {

        this.render();
      };

      /**
       * @param string newClass
       */
      _myTrait_.changeRenderClass = function (newClass) {

        // refreshObject

        var oldClass = this.renderClass();
        this.renderClass(newClass);
        var me = this;
        this.forDisplays(function (d) {
          d.refreshObject(me, oldClass);
        });
      };

      /**
       * @param float t
       */
      _myTrait_.clearActiveItems = function (t) {

        _activeItems.length = 0;
      };

      /**
       * @param float dispId
       * @param float eventType
       * @param float toObject
       */
      _myTrait_.delegateEvent = function (dispId, eventType, toObject) {

        if (typeof toObject != "undefined") {

          if (!this._eventDelegates) this._eventDelegates = {};
          if (!this._eventDelegates[dispId]) this._eventDelegates[dispId] = {};

          this._eventDelegates[dispId][eventType] = toObject;

          return this;
        }

        return this.findDelegatedEventhandler(dispId, eventType);
        /*
        if(this._eventDelegates) {
        if(this._eventDelegates[dispId]) {
        var obj = this._eventDelegates[dispId][eventType];
        if(obj) {
            if(obj._dragListeners) {
                if(obj._dragListeners[dispId]) {
                    var fns = obj._dragListeners[dispId][eventType];
                    return fns;
                }
            }
            
        }
        }
        }
        */
      };

      /**
       * @param float obj
       * @param float parentElem
       * @param float viewData
       */
      _myTrait_.domMVC = function (obj, parentElem, viewData) {

        if (!parentElem) {
          parentElem = obj;
          obj = this;
        }
        if (!obj) {
          console.error("No obj at domMVC ", viewData);
          return;
        }

        if (!obj._model) {
          console.error("No obj model at domMVC ", viewData);
          return;
        }

        obj._model.then(function () {

          if (!obj._model.items) return;

          obj._model.on("remove", function () {
            if (viewData && viewData.viewObj) {
              viewData.viewG.remove();
              delete viewData.viewObj;
            }
          });

          obj._model.items.on("move", function (o, cmd) {

            var old = parentElem.child(cmd.from),
                after = parentElem.child(cmd.to);

            // a,b,c,d
            // c,a,b,d
            if (cmd.to != cmd.from) {
              // old.remove();
              if (cmd.to < cmd.from) {
                after.insertBefore(old);
              } else {
                after.insertAfter(old);
              }
            }
            return;
          });
          obj._model.items.on("remove", function (o, i) {
            return;
            var ch = parentElem.child(i);
            if (ch) {
              ch.remove();
            }
            if (viewData && viewData.viewObj) {
              delete viewData.viewObj;
            }
          });

          parentElem.reIndex();
        });
      };

      /**
       * @param float box
       * @param float display
       */
      _myTrait_.draggableFor = function (box, display) {

        var me = this;

        this.listenDragEventsFor(box, function () {

          if (!_keyboard.shiftDown) me.clearActiveItems();
          me.addActiveItem(me);
        }, function (dragInfo) {

          if (me._movementLock) {
            if (me._movementLock.x) {
              dragInfo.delta.x = 0;
            }
            if (me._movementLock.y) {
              dragInfo.delta.y = 0;
            }
          }
          me._transMatrix.translate({
            x: dragInfo.start.x + dragInfo.delta.x,
            y: dragInfo.start.y + dragInfo.delta.y,
            z: dragInfo.start.z + dragInfo.delta.z
          });
          me.callRender();
        }, function () {}, display, "move");
      };

      /**
       * @param float t
       */
      _myTrait_.findAndRegisterCameras = function (t) {
        var me = this;

        this.forChildren(function (i) {
          if (i.isCamera && i.isCamera()) {
            me.addCamera(i);
          }
        });
      };

      /**
       * @param float t
       */
      _myTrait_.findCameras = function (t) {

        var list = [];

        this.forChildren(function (i) {
          if (i.isCamera && i.isCamera()) list.push(i);
        });

        return list;
      };

      /**
       * @param float dispId
       * @param float eventType
       */
      _myTrait_.findDelegatedEventhandler = function (dispId, eventType) {

        var obj = this,
            d;
        while (d = obj.isDelegatingEvents(dispId, eventType)) {
          obj = d;
        }
        // if(!obj.isDelegatingEvents(dispId, eventType)) return;

        if (obj._dragListeners) {
          if (obj._dragListeners[dispId]) {
            var fns = obj._dragListeners[dispId][eventType];
            return fns;
          }
        }

        /*
        if(this._eventDelegates) {
        if(this._eventDelegates[dispId]) {
        var obj = this._eventDelegates[dispId][eventType];
        if(obj) {
            if(obj._dragListeners) {
                if(obj._dragListeners[dispId]) {
                    var fns = obj._dragListeners[dispId][eventType];
                    return fns;
                }
            }
            
        }
        }
        }
        */
      };

      /**
       * @param float fn
       */
      _myTrait_.forActiveItems = function (fn) {

        _activeItems.forEach(function (item) {
          fn(item);
        });
      };

      /**
       * @param float fn
       */
      _myTrait_.forDisplays = function (fn) {
        if (!this._displayList) return;

        var list = this._displayList;
        for (var n in list) {
          if (list.hasOwnProperty(n)) {
            var v = list[n];
            fn(v);
          }
        }
      };

      /**
       * @param float t
       */
      _myTrait_.getActiveCamera = function (t) {

        if (!_activeCamera) {
          _activeCamera = _cameraList[0];
        }

        return _activeCamera;
      };

      /**
       * @param float index
       */
      _myTrait_.getCamera = function (index) {

        return _cameraList[index];
      };

      /**
       * @param float elem
       */
      _myTrait_.getDOMOffset = function (elem) {

        while (elem && elem instanceof SVGElement) {
          elem = elem.parentNode;
        }
        if (!elem) return {
          x: 0,
          y: 0
        };

        var doc = elem && elem.ownerDocument,
            docElem = doc.documentElement,
            box;

        // return getOffset(elem, doc, doc.documentElement);
        // function getOffset(elem, doc, docElem, box) {

        try {
          box = elem.getBoundingClientRect();
        } catch (e) {}

        var body = doc.body,
            win = window,
            clientTop = docElem.clientTop || body.clientTop || 0,
            clientLeft = docElem.clientLeft || body.clientLeft || 0,
            scrollTop = win.pageYOffset,
            scrollLeft = win.pageXOffset,
            top = box.top + scrollTop - clientTop,
            left = box.left + scrollLeft - clientLeft;

        return {
          x: left,
          y: top
        };
      };

      /**
       * @param float t
       */
      _myTrait_.getLocalTransform = function (t) {
        return this._localTransform;
      };

      /**
       * @param float id
       */
      _myTrait_.getRenderData = function (id) {

        if (!this._renderData) this._renderData = {};

        if (!id && _renderScope) id = _renderScope;

        if (id) {
          var key = "sub__" + id;
          if (!this._renderData[key]) this._renderData[key] = {};
          return this._renderData[key];
        }

        return this._renderData;
      };

      /**
       * @param float t
       */
      _myTrait_.getRenderFn = function (t) {

        return this._renderFn;
      };

      /**
       * @param float t
       */
      _myTrait_.getRenderMatrix = function (t) {
        return this._renderMatrix;
      };

      /**
       * @param float t
       */
      _myTrait_.getRootNode = function (t) {

        return this._rootNode;
      };

      /**
       * @param float t
       */
      _myTrait_.getRotationMatrix = function (t) {
        return this._rotMatrix;
      };

      /**
       * @param float t
       */
      _myTrait_.getScaleMatrix = function (t) {
        return this._scaleMatrix;
      };

      /**
       * @param float t
       */
      _myTrait_.getSvgParser = function (t) {

        if (!this._svgParser) {
          var parser = this._svgParser = svgPathParser(),
              me = this;
          if (this.svgPath) {
            this.on("svgPath", function (o, v) {
              parser.parse(v);
              parser.makePathAbsolute();
              parser.fitPathInto(me.w(), me.h());
            });
            this.on("w", function (o, v) {
              parser.fitPathInto(me.w(), me.h());
            });
            this.on("h", function (o, v) {
              parser.fitPathInto(me.w(), me.h());
            });
            var v;
            if (v = this.svgPath()) {
              parser.parse(v);
              parser.makePathAbsolute();
              parser.fitPathInto(me.w(), me.h());
            }
          }

          /*
          var parser = svgPathParser();
          parser.parse(svgPath);
          parser.makePathAbsolute();
          parser.fitPathInto( w, h );
          */
        }
        return this._svgParser;
      };

      /**
       * @param float t
       */
      _myTrait_.getTransformMatrix = function (t) {
        return this._transMatrix;
      };

      /**
       * @param float camera
       */
      _myTrait_.getViewMatrix = function (camera) {

        if (!this._viewMatrix) {
          this._viewMatrix = {};
        }

        return this._viewMatrix[camera.localId()];
      };

      /**
       * @param float t
       */
      _myTrait_.getX = function (t) {
        return this.getTransformMatrix().m30();
      };

      /**
       * @param float t
       */
      _myTrait_.getY = function (t) {
        return this.getTransformMatrix().m31();
      };

      /**
       * @param float box
       * @param float display
       * @param float options
       */
      _myTrait_.groupResizeHandler = function (box, display, options) {

        var sx,
            sy,
            me = this;

        options = options || {};
        var startM, startW, m, rendMCopy, skipThese;

        if (!options.i) options.i = 0;
        if (!options.j) options.j = 0;

        this.listenDragEventsFor(box, function (dragInfo) {

          var gr = me._groupDelegate;
          if (gr) {
            // OK, the scale coordinate is found correctly using the screen coords
            var cam = me._groupDisplay.getCamera();
            me.projectToCamera(cam);
            var viewM = me.getViewMatrix(cam);
            // viewM.inverse();
            var rotPoint = viewM.projectVector({
              x: options.i * me.w(),
              y: options.j * me.h(),
              z: 0,
              w: 1
            });

            var bb = gr.activeItemsBB(me._groupDisplay.getCamera());
            var cx = rotPoint.x,
                cy = rotPoint.y;

            skipThese = {};
            gr.forActiveItems(function (ai) {

              gr.forActiveItems(function (i) {
                if (i == ai) return;
                var p = i;
                while (p = p.displayParent()) {
                  if (p == ai) {
                    skipThese[i.localId()] = true;
                  }
                }
              });
            });
            gr.forActiveItems(function (ai) {
              ai._oldRc = {
                i: ai.ri(),
                j: ai.rj()
              };
              ai.moveRotationCenterToSCoords(cx, cy, me._groupDisplay);
            });

            gr.forActiveItems(function (i) {
              i._grScaleM = i.getScaleMatrix().createCopy();
            });
          } else {
            return;
          }
          if (options.i || options.j) {
            me.moveRotationCenterTo(options.i || 0, options.j || 0, display);
          } else {
            me.moveRotationCenterTo(0, 0, display);
          }
          startM = me._scaleMatrix.createCopy();
          startW = Math.sqrt(me.w() * me.w() + me.h() * me.h());
        }, function (dragInfo) {

          if (!me._groupDelegate) return;

          try {
            var scalei = 1,
                scalej = 1;
            if (me.ri() < 1) {
              scalei = 1 / (1 - me.ri());
            }
            if (me.rj() < 1) {
              scalej = 1 / (1 - me.rj());
            }

            if (options.j) scalej = scalej * -1;
            if (options.i) scalei = scalei * -1;

            var ww = dragInfo.deltaIn.x * scalei + me.w(),
                hh = dragInfo.deltaIn.y * scalej + me.h();
            var dragW = Math.sqrt(ww * ww + hh * hh);
            var scaleFactor = dragW / startW;

            var gr = me._groupDelegate;
            if (gr) {
              gr.forActiveItems(function (i) {
                if (skipThese[i.localId()]) return;
                if (i._grScaleM) {
                  var mat = Matrix3D();
                  mat.scale(scaleFactor);
                  mat.matMul(i._grScaleM);
                  i._scaleMatrix.copyFrom(mat);
                  i.callRender();
                }
              });
            }

            var mat = Matrix3D();
            mat.scale(scaleFactor);
            mat.matMul(startM);
            me._scaleMatrix.copyFrom(mat);
            me.callRender();
          } catch (e) {}
        }, function () {
          var gr = me._groupDelegate;
          if (gr) {

            gr.forActiveItems(function (ai) {
              ai.moveRotationCenterTo(ai._oldRc.i, ai._oldRc.j, me._groupDisplay);
            });
          }
        }, display, "groupresize" + options.j + options.i, {
          noActiveReset: true
        });
        /*
        var sx,sy,
        me = this;
        options = options || {};
        var startM,
        startW,
        m,
        rendMCopy;
        if(!options.i) options.i=0;
        if(!options.j) options.j=0;
        this.listenDragEventsFor(box, function() {
        if(options.i || options.j) {
        me.moveRotationCenterTo( options.i || 0, options.j || 0, display );
        } else {
        me.moveRotationCenterTo( 0, 0, display );
        }
        startM = me._scaleMatrix.createCopy();
        startW = Math.sqrt( me.w()*me.w() + me.h()*me.h() );    
        }, function(dragInfo) {
        var scalei = 1,
        scalej = 1;
        if(me.ri()<1) {
        scalei =  (1/(1-me.ri()));
        }  
        if(me.rj()<1) {
        scalej =  (1/(1-me.rj()));
        }      
         if(options.j) scalej = scalej * -1;
        if(options.i) scalei = scalei * -1;
        var ww = dragInfo.deltaIn.x*scalei + me.w(),
        hh = dragInfo.deltaIn.y*scalej + me.h();    
        var dragW = Math.sqrt( ww*ww + hh*hh );
        var scaleFactor = dragW / startW;    
        var mat = Matrix3D();
        mat.scale( scaleFactor );
        mat.matMul( startM );
        me._scaleMatrix.copyFrom( mat );
        me.callRender();  
        }, function() {
        }, display, "resize"+options.j+options.i)
        */
      };

      /**
       * @param float box
       * @param float display
       */
      _myTrait_.groupRotationHandler = function (box, display) {

        var sx,
            sy,
            me = this;

        var startM, startRot, startW, m, rendMCopy, cp_x, cp_y, startCenter;

        var vect = jsVectors(),
            smList = [],
            skipThese = {};

        this.listenDragEventsFor(box, function (dragInfo) {

          var gr = me._groupDelegate;
          if (gr) {

            var cam = me._groupDisplay.getCamera();
            me.projectToCamera(cam);
            var viewM = me.getViewMatrix(cam);
            // viewM.inverse();
            var rotPoint = viewM.projectVector({
              x: 0.5 * me.w(),
              y: 0.5 * me.h(),
              z: 0,
              w: 1
            });

            var cx = rotPoint.x,
                cy = rotPoint.y;

            skipThese = {};
            gr.forActiveItems(function (ai) {

              gr.forActiveItems(function (i) {
                if (i == ai) return;
                var p = i;
                while (p = p.displayParent()) {
                  if (p == ai) {
                    skipThese[i.localId()] = true;
                  }
                }
              });
            });

            gr.forActiveItems(function (ai) {
              ai._oldRc = {
                i: ai.ri(),
                j: ai.rj()
              };
              ai.moveRotationCenterToSCoords(cx, cy, me._groupDisplay);
            });

            gr.forActiveItems(function (i) {
              i._grRotM = i.getRotationMatrix().createCopy();
            });
          } else {
            return;
          }
          startM = me.getRotationMatrix().createCopy();
          me.moveRotationCenterTo(0.5, 0.5, display);
          smList.length = 0;
          // startM = me.getRotationMatrix().createCopy();
          sx = dragInfo.dv.relx;
          sy = dragInfo.dv.rely;

          cp_x = me.w() * me.ri();
          cp_y = me.h() * me.rj();

          startCenter = me.getViewMatrix(display.getCamera()).projectVector({
            x: cp_x,
            y: cp_y,
            z: 0,
            w: 1
          });
        }, function (dragInfo) {

          if (!me._groupDelegate) return;

          try {
            var angle = vect.angleBetween({
              x: dragInfo.dv.relx - startCenter.x,
              y: dragInfo.dv.rely - startCenter.y
            }, {
              x: dragInfo.dv.relx + dragInfo.dv.dx - startCenter.x,
              y: dragInfo.dv.rely + dragInfo.dv.dy - startCenter.y
            });

            var gr = me._groupDelegate;
            if (gr) {
              gr.forActiveItems(function (i) {
                if (skipThese[i.localId()]) return;
                if (i._grRotM) {
                  var sCopy = i._grRotM.createCopy(),
                      rotM = Matrix3D();
                  rotM.rotate({
                    x: 0,
                    y: 0,
                    z: 1
                  }, angle);
                  sCopy.matMul(rotM);
                  if (sCopy.isValidMatrix()) {
                    i._rotMatrix.copyFrom(sCopy);
                    i.callRender();
                  }
                }
              });
            }

            var sCopy = startM.createCopy(),
                rotM = Matrix3D();
            rotM.rotate({
              x: 0,
              y: 0,
              z: 1
            }, angle);

            sCopy.matMul(rotM);
            if (sCopy.isValidMatrix()) {
              me._rotMatrix.copyFrom(sCopy);
              me.callRender();
            }
          } catch (e) {}
        }, function () {
          var gr = me._groupDelegate;
          if (gr) {

            gr.forActiveItems(function (ai) {
              ai.moveRotationCenterTo(ai._oldRc.i, ai._oldRc.j, me._groupDisplay);
            });
          }
        }, display, "rotategroup", {
          noActiveReset: true
        });
      };

      /**
       * @param float box
       * @param float display
       */
      _myTrait_.handleRotationCenter = function (box, display) {
        var origLocalM;
        var startI,
            startJ,
            me = this;

        this.listenDragEventsFor(box, function () {
          origLocalM = me.applyLocalTransform();
          startI = me.ri();
          startJ = me.rj();
        }, function (dragInfo) {

          var deltaI = dragInfo.deltaIn.x / me.w(),
              deltaJ = dragInfo.deltaIn.y / me.h();

          var newRi = startI + deltaI,
              newRj = startJ + deltaJ;

          // two matrixes...
          var origLocalM2 = me.applyLocalTransform({
            i: newRi,
            j: newRj
          });

          // where is the left corner, the position 0,0 is

          var proj1 = origLocalM.projectVector({
            x: 0,
            y: 0,
            z: 0,
            w: 1
          });

          var proj2 = origLocalM2.projectVector({
            x: 0,
            y: 0,
            z: 0,
            w: 1
          });

          console.log("The change of X in the projections is ", proj2.x - proj1.x);

          var diff_x = proj2.x - proj1.x; // origLocalM2.m30() - origLocalM.m30(),
          diff_y = proj2.y - proj1.y; // origLocalM2.m31() - origLocalM.m31(),
          diff_z = proj2.z - proj1.z; // origLocalM2.m32() - origLocalM.m32()

          console.log("diff_x is ", diff_x);
          console.log("diff_y is ", diff_y);
          // OK, the Z is not at the moment "available"

          me.ri(startI + deltaI);
          me.rj(startJ + deltaJ);

          // So, we have to move the transformation so that the origin stays at original position
          //me._transMatrix.m30( origLocalM.m30() - diff_x );
          //me._transMatrix.m31( origLocalM.m31() + diff_y );

          var rr = origLocalM.projectVector({
            x: diff_x,
            y: diff_y,
            z: diff_z,
            w: 0
          });

          me._transMatrix.m30(me._transMatrix.m30() - diff_x);
          me._transMatrix.m31(me._transMatrix.m31() - diff_y);
          me._transMatrix.m32(me._transMatrix.m32() - diff_z);

          me.callRender();
        }, function () {}, display);

        return;

        var sx,
            sy,
            me = this,
            scr_sx,
            scr_sy,
            r_sx,
            r_sy,
            rendM,
            rScreenPos,
            i0,
            i1,
            j0,
            j1,
            o_kk_x,
            o_kk_y,
            scaleF,
            final_dx,
            final_dy,
            origLocalM,
            inverseLocalM;
        this._beforeRot;

        var startI, startJ;
        box.draggable(function (o, dv) {
          // Transforming coordinates...
          rendM = me.getRenderMatrix().createCopy();
          scr_sx = rendM.m30();
          scr_sy = rendM.m31();

          origLocalM = me.applyLocalTransform();
          inverseLocalM = origLocalM.createCopy().inverse();

          startM = me.getRenderMatrix().createCopy().inverse();
          startI = me.ri();
          startJ = me.rj();

          rScreenPos = rendM.projectVector({
            x: startI * me.w(),
            y: startJ * me.h(),
            z: 0,
            w: 1
          });

          console.log("rScreenPos ", rScreenPos);
          console.log("i vector ", rendM.m00(), rendM.m01());
          console.log("j vector ", rendM.m10(), rendM.m11());

          i0 = rendM.m00(), i1 = rendM.m01(), j0 = rendM.m10(), j1 = rendM.m11();

          var len = Math.sqrt(i0 * i0 + i1 * i1);
          scaleF = len;
          i0 = i0 / len;
          i1 = i1 / len;
          j0 = j0 / len;
          j1 = j1 / len;

          sx = me._transMatrix.m30();
          sy = me._transMatrix.m31();

          // a new position for the center of the rotation vector
          var newR_x = rScreenPos.x,
              newR_y = rScreenPos.y;

          // cornerista tähän kohtaan vektori
          var c2r_x = scr_sx - newR_x,
              c2r_y = scr_sy - newR_y;

          // projisoi
          var p2x = c2r_x * i0 - c2r_y * j0,
              p2y = -1 * c2r_x * i1 + c2r_y * j1;

          o_kk_x = newR_x + p2x, o_kk_y = newR_y + p2y;
        }, function (o, dv) {

          try {

            var newDv = me.screenToItemCoords(dv, startM);

            var deltaI = newDv.dx / me.w(),
                deltaJ = newDv.dy / me.h();

            console.log("New ri ", startI, startI + deltaI);
            console.log("New rj ", startJ, startJ + deltaJ);

            var newRi = startI + deltaI,
                newRj = startJ + deltaJ;

            // two matrixes...
            var origLocalM2 = me.applyLocalTransform({
              i: newRi,
              j: newRj
            });

            // where is the left corner, the position 0,0 is

            var proj1 = origLocalM.projectVector({
              x: 0,
              y: 0,
              z: 0,
              w: 1
            });

            var proj2 = origLocalM2.projectVector({
              x: 0,
              y: 0,
              z: 0,
              w: 1
            });

            console.log("The change of X in the projections is ", proj2.x - proj1.x);

            var diff_x = proj2.x - proj1.x; // origLocalM2.m30() - origLocalM.m30(),
            diff_y = proj2.y - proj1.y; // origLocalM2.m31() - origLocalM.m31(),
            diff_z = proj2.z - proj1.z; // origLocalM2.m32() - origLocalM.m32()

            console.log("diff_x is ", diff_x);
            console.log("diff_y is ", diff_y);
            // OK, the Z is not at the moment "available"

            me.ri(startI + deltaI);
            me.rj(startJ + deltaJ);

            // So, we have to move the transformation so that the origin stays at original position
            //me._transMatrix.m30( origLocalM.m30() - diff_x );
            //me._transMatrix.m31( origLocalM.m31() + diff_y );

            var rr = origLocalM.projectVector({
              x: diff_x,
              y: diff_y,
              z: diff_z,
              w: 0
            });

            console.log("inverse produces change ", rr.x, rr.y);

            final_dx = diff_x;
            final_dy = diff_y;

            me._transMatrix.m30(me._transMatrix.m30() - diff_x);
            me._transMatrix.m31(me._transMatrix.m31() - diff_y);
            me._transMatrix.m32(me._transMatrix.m32() - diff_z);

            me.callRender();
          } catch (e) {
            if (_debugView) _debugView.text(e.message);
          }
        }, function (o, dv) {});
      };

      /**
       * @param float t
       */
      _myTrait_.hideHandles = function (t) {

        var rt = this.renderClass();

        this._handlesVisible = false;
        if (!_handleRenderFn) return;

        if (_handleRenderFn[rt]) {
          this._handlesVisible = false;
          _handleRenderFn[rt]._hideHandlesFn(this, this._handleData);
          return;
        }

        if (this._hideHandlesFn) {
          this._handlesVisible = false;
          this._hideHandlesFn(this, this._handleData);
        }
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (model) {

        if (!_batchItems) {
          _batchItems = {};
        }

        this._transMatrix = Matrix3D();
        this._scaleMatrix = Matrix3D();
        this._rotMatrix = Matrix3D();
        this._renderMatrix = Matrix3D();
        this._handleData = {};

        if (model._model) model = model._model;

        // debugger;

        if (!this._movementLock) this._movementLock = {};

        if (!_activeItems) {
          _activeItems = [];
          _objectCache = {};
        }

        var me = this,
            o = this;

        // the display item model
        this._model = model;

        var initExtModel = function initExtModel(id) {
          me._ext = false; // --> loading the model
          me._extModelId = model.get("extModelId");

          var extM = _data(id);
          extM.then(function () {

            me._extModel = extM;
            me._ext = true;
            var localF = extM.localFork();
            localF.then(function () {
              // me._extModel = localF;
              console.log("External model's source fork ");
              console.log(extM.getData());
              console.log("External model's local fork ");
              console.log(localF.getData());
              me._ext = true;
            });
          });
        };

        if (model.get("remoteChannel")) {

          /*
           */
          model.openChannel(model.get("remoteChannel")).then(function (r) {
            var extCh = r.channel;

            var objId = model.get("remoteId"); // vp85p8b6wjc3dnbx9ywct91f9a

            var ns = extCh._client._ns;

            var theDataId = extCh._client._idToNs(objId, ns);

            initExtModel(theDataId);

            return;
            var theData = _data(theDataId);
            theData.then(function () {
              alert("got the remoted obj opened");
            });
          });
        }
        // external model
        if (model.get("extModelId")) {
          initExtModel(model.get("extModelId"));
        }
        model.on("extModelId", function (o, newModel) {
          initExtModel(newModel);
        });

        var doInit = function doInit() {

          if (model && model.items) {
            model.items.on("insert", function (o, i) {
              // try with this...
              var forced = _data(model.items.at(i)._docData.__id, null, model._client);
              var newItem = displayItem(model.items.at(i));
              setTimeout(function () {
                var forced = _data(model.items.at(i)._docData.__id, null, model._client);
                // console.log("Insert", newItem);
                newItem.render();
              }, 100);
            });
          }

          // The iterators for model
          me.items = {
            push: function push(objData) {
              var m = model;
              if (me._ext) {
                m = me._extModel;
              }
              if (objData._callRender) {
                // a displayItem object
                var objModel = objData._model;
                var oldP = objModel.parent();
                if (oldP) {
                  objModel.remove(); // detach from the old parent object
                }
                m.items.push(objModel);
                return;
              }
              m.items.push(objData);
            },
            forEach: function forEach(fn) {

              if (me._ext) {
                me._extModel.items.forEach(function (item) {
                  if (item.isFulfilled && !item.isFulfilled()) {
                    console.log("Unfulfilled item");
                    return;
                  }
                  var di = displayItem(item);
                  di._extParent = me;
                  if (di) {
                    fn(di);
                  }
                });
                return;
              }

              model.items.forEach(function (item) {
                if (item.isFulfilled && !item.isFulfilled()) {
                  console.log("Unfulfilled item");
                  return;
                }
                var di = displayItem(item);
                if (di) {
                  fn(di);
                }
              });
            },
            length: function length() {
              if (me._ext) return me._extModel.items.length();
              return model.items.length();
            },
            at: function at(i) {
              var m = model;
              if (me._ext) m = me._extModel;
              var mo = m.items.at(i);
              if (mo.isFulfilled && !mo.isFulfilled()) return;
              if (mo) return displayItem(mo);
            },
            indexOf: function indexOf(i) {
              var m = model;
              if (me._ext) m = me._extModel;
              if (typeof i == "undefined") return -1;
              if (i._callRender) {
                return m.items.indexOf(i.model());
              }
              return m.items.indexOf(i);
            },
            item: function item(i) {
              var m = model;
              if (me._ext) m = me._extModel;
              var mo = m.items.at(i);
              if (mo.isFulfilled && !mo.isFulfilled()) return;
              if (mo) return displayItem(mo);
            }
          };

          // add this object to the cache
          if (!_objectCache) _objectCache = {};
          _objectCache[model.getID()] = me;

          me._getTransfromFromModel(me, model);

          // TODO: add the rendering
          me.render();
        };

        if (model.isFulfilled()) {
          doInit();
        } else {
          model.then(doInit);
        }
        if (!_initDone) {

          var ieversion = function ieversion() {
            var rv = -1; // Return value assumes failure.
            if (navigator.appName == "Microsoft Internet Explorer") {
              var ua = navigator.userAgent;
              var re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
              if (re.exec(ua) != null) rv = parseFloat(RegExp.$1);
            }
            return rv;
          };

          _keyboard = {
            shiftDown: false
          };
          if (typeof $ != "undefined") {
            $(document).on("keyup keydown", function (e) {
              _keyboard.shiftDown = e.shiftKey;
            });
          }

          _renderables = {
            list: [],
            renderIndex: 1
          };
          _cameraList = [];
          _displayList = [];
          _cameraFunctions = {};
          _renderFunctions = {};
          _activeChangeListeners = [];

          var me = this;

          var lastOnMs,
              minDeltaMs = 1;

          var iVal = 1 / 60;
          if (ieversion() > 0) {
            iVal = 1 / 10;
            minDeltaMs = 1;
            // This is the rendering loop...
            later().every(iVal, function () {
              me._onFrame();
            });
          } else {
            later().onFrame(function () {
              me._onFrame();
            });
          }
          _initDone = true;
        }
      });

      /**
       * @param float dispId
       * @param float eventType
       */
      _myTrait_.isDelegatingEvents = function (dispId, eventType) {

        if (this._eventDelegates) {
          if (this._eventDelegates[dispId]) {
            var obj = this._eventDelegates[dispId][eventType];
            if (obj) {
              return obj;
            }
          }
        }
      };

      /**
       * @param float box
       * @param float startFn
       * @param float dragFn
       * @param float endFn
       * @param float display
       * @param float eventType
       * @param float options
       */
      _myTrait_.listenDragEventsFor = function (box, startFn, dragFn, endFn, display, eventType, options) {

        if (!display) return;
        if (!eventType) return;

        var sx,
            sy,
            sz,
            rsx,
            rsy,
            rsz,
            me = this,
            rendInv;
        this._beforeRot;

        var firstInters;

        var dragInfo = {
          start: {},
          delta: {},
          startIn: {},
          currIn: {},
          deltaIn: {},
          deltaCenter: {},
          displayPos: {
            x: 0,
            y: 0
          }
        };

        var docWidth = document.body.clientWidth / 2,
            docHeight = document.body.clientHeight / 2,
            perspective = 1000,
            dispId = display.id(),
            options = options || {};

        if (display) {

          var off = this.getDOMOffset(display.getSurface().getDom());
          dragInfo.displayPos.x = off.x;
          dragInfo.displayPos.y = off.y;

          var surface = display.getSurface();
          docWidth = surface.getWidth() / 2;
          docHeight = surface.getHeight() / 2;
        }

        if (!this._dragListeners) this._dragListeners = {};
        if (!this._dragListeners[dispId]) this._dragListeners[dispId] = {};
        if (!this._dragListeners[dispId][eventType]) this._dragListeners[dispId][eventType] = {};

        this._dragListeners[dispId][eventType] = {};

        // Register new set of listeners of the drag events for this object...
        this._dragListeners[dispId][eventType] = {
          start: function start(o, dv) {

            var off = me.getDOMOffset(display.getSurface().getDom());
            dragInfo.displayPos.x = off.x;
            dragInfo.displayPos.y = off.y;

            perspective = 1000;
            //console.log("Document size");
            //console.log(docWidth, docHeight, perspective);

            dv.relx = dv.sx - dragInfo.displayPos.x;
            dv.rely = dv.sy - dragInfo.displayPos.y;

            // Transforming coordinates...
            sx = me._transMatrix.m30();
            sy = me._transMatrix.m31();
            sz = me._transMatrix.m32();

            var rendM = me.getViewMatrix(display.getCamera());

            rsx = rendM.m30();
            rsy = rendM.m31();
            rsz = rendM.m32();

            rendInv = me.getViewMatrix(display.getCamera()).createCopy().inverse();

            if (!options.noActiveReset) {
              _activeItems.forEach(function (item) {
                item.hideHandles();
              });
              if (!_keyboard.shiftDown) me.clearActiveItems();
              me.addActiveItem(me); // _activeItems.push( me );
            }

            _activeItems.forEach(function (item) {
              item.showHandles();
            });

            firstInters = me.getViewMatrix(display.getCamera()).intersectPlane({
              x: docWidth,
              y: docHeight,
              z: perspective
            }, {
              x: dv.relx + dv.dx,
              y: dv.rely + dv.dy,
              z: 0
            });

            if (!firstInters) return;

            dragInfo.dv = dv;
            dragInfo.o = o;
            dragInfo.startIntersection = firstInters;
            dragInfo.startIn.x = firstInters.x;
            dragInfo.startIn.y = firstInters.y;
            dragInfo.startIn.z = firstInters.z;

            startFn(dragInfo);
          },
          drag: function drag(o, dv) {

            if (!firstInters) {
              return;
            }
            dv.relx = dv.sx - dragInfo.displayPos.x;
            dv.rely = dv.sy - dragInfo.displayPos.y;
            dragInfo.dv = dv;
            dragInfo.o = o;
            /*
            me.screenToItemCoords({
            x : dv.relx,
            y : dv.rely,
            dx : dv.dx,
            dy : dv.dy
            });
            */

            var m = me._beforeRot.createCopy();

            var cam = display.getCamera();
            var cMat = cam.getRenderMatrix().createCopy().inverse();
            cMat.matMul(m);
            m = cMat;

            m.inverse();

            var interS = me.getViewMatrix(display.getCamera()).intersectPlane({
              x: docWidth,
              y: docHeight,
              z: perspective
            }, {
              x: dv.relx + dv.dx,
              y: dv.rely + dv.dy,
              z: 0
            });

            if (!interS) return;

            var delta = {
              x: interS.x - firstInters.x,
              y: interS.y - firstInters.y,
              z: interS.z - firstInters.z
            };

            // console.log("The plane intersection at point ", interS);
            /*
            var res = m.projectVector({ x : dv.dx, 
                          y : dv.dy, 
                          z:  0, 
                          w:  0});
            me._transMatrix.translate({x:sx + res.x, y:sy + res.y, z: me._transMatrix.m32()});
            */

            var res = m.projectVector({
              x: delta.x,
              y: delta.y,
              z: delta.z,
              w: 0
            });

            var rendRes = rendInv.projectVector({
              x: delta.x,
              y: delta.y,
              z: delta.z,
              w: 0
            });

            var currCenter = {
              x: me.w() * me.ri(),
              y: me.h() * me.rj(),
              z: 0,
              w: 0
            };

            dragInfo.start.x = sx;
            dragInfo.start.y = sy;
            dragInfo.start.z = sz;

            dragInfo.delta.x = res.x;
            dragInfo.delta.y = res.y;
            dragInfo.delta.z = res.z;

            dragInfo.currIn.x = interS.x;
            dragInfo.currIn.y = interS.y;
            dragInfo.currIn.z = interS.z;

            dragInfo.deltaIn.x = rendRes.x;
            dragInfo.deltaIn.y = rendRes.y;
            dragInfo.deltaIn.z = rendRes.z;

            dragFn(dragInfo);
          },
          end: function end(o, dv) {
            endFn();
          }
        };

        // And finally call the registered functions...
        box.draggable(function (o, dv) {
          var delegate;
          if (delegate = me.delegateEvent(dispId, eventType)) {
            delegate.start(o, dv);
            return;
          }
          me._dragListeners[dispId][eventType].start(o, dv);
        }, function (o, dv) {
          var delegate;
          if (delegate = me.delegateEvent(dispId, eventType)) {
            delegate.drag(o, dv);
            return;
          }
          me._dragListeners[dispId][eventType].drag(o, dv);
        }, function (o, dv) {
          var delegate;
          if (delegate = me.delegateEvent(dispId, eventType)) {
            delegate.end(o, dv);
            return;
          }
          me._dragListeners[dispId][eventType].end(o, dv);
        });
      };

      /**
       * @param float t
       */
      _myTrait_.localId = function (t) {
        if (!this.__id) {
          this.__id = this.guid();
        }
        return this.__id;
      };

      /**
       * @param float options
       */
      _myTrait_.lockMovement = function (options) {

        options = options || {};

        if (!this._movementLock) this._movementLock = {};

        if (typeof options.x != "undefined") {
          this._movementLock.x = options.x;
        }
        if (typeof (options.y != "undefined")) {
          this._movementLock.y = options.y;
        }
      };

      /**
       * @param Object parentElem
       * @param float myNode
       * @param float obj
       */
      _myTrait_.matchDomPosition = function (parentElem, myNode, obj) {
        var from = myNode._index,
            to = obj.indexOf();

        var old = parentElem.child(from),
            after = parentElem.child(to);

        if (!after) return;

        if (from != to) {
          if (to < from) {
            after.insertBefore(old);
          } else {
            after.insertAfter(old);
          }
        }
      };

      /**
       * @param float i
       * @param float j
       * @param float display
       */
      _myTrait_.moveRotationCenterTo = function (i, j, display) {
        var me = this;
        var origLocalM = me.applyLocalTransform().createCopy();
        var startI = me.ri();
        var startJ = me.rj();

        var newRi = i,
            newRj = j;

        var origLocalM2 = me.applyLocalTransform({
          i: newRi,
          j: newRj
        });

        var cam = display.getCamera(),
            camR = cam.getRenderMatrix();

        //origLocalM = camR.createCopy().matMul( origLocalM );
        //origLocalM2 = camR.createCopy().matMul( origLocalM2 );

        var proj1 = origLocalM.projectVector({
          x: 0,
          y: 0,
          z: 0,
          w: 1
        });

        var proj2 = origLocalM2.projectVector({
          x: 0,
          y: 0,
          z: 0,
          w: 1
        });

        var diff_x = proj2.x - proj1.x,
            diff_y = proj2.y - proj1.y,
            diff_z = proj2.z - proj1.z;

        me.ri(i);
        me.rj(j);

        var rr = origLocalM.projectVector({
          x: diff_x,
          y: diff_y,
          z: diff_z,
          w: 0
        });

        me._transMatrix.m30(me._transMatrix.m30() - diff_x);
        me._transMatrix.m31(me._transMatrix.m31() - diff_y);
        me._transMatrix.m32(me._transMatrix.m32() - diff_z);

        // this.saveTransformUpdates();
        this.x(me._transMatrix.m30());
        this.y(me._transMatrix.m31());

        me.callRender();
      };

      /**
       * @param float x
       * @param float y
       * @param float display
       */
      _myTrait_.moveRotationCenterToSCoords = function (x, y, display) {

        var cam = display.getCamera();

        this.projectToCamera(cam);
        var view = this.getViewMatrix(cam);

        view = view.inverse();
        var pv = view.projectVector({
          x: x,
          y: y,
          z: 0,
          w: 1
        });

        var i = pv.x / this.w(),
            j = pv.y / this.h();

        // console.log("The projected coords position ", i,j);

        this.moveRotationCenterTo(i, j, display);
      };

      /**
       * @param float fn
       */
      _myTrait_.onActiveChange = function (fn) {
        _activeChangeListeners.push(fn);
      };

      /**
       * @param float camera
       */
      _myTrait_.projectDimensionPoints = function (camera) {

        this.projectToCamera(camera);

        var view = this.getViewMatrix(camera);

        var list = [];

        list.push(view.projectVector({
          x: 0,
          y: 0,
          z: 0,
          w: 1
        }));

        list.push(view.projectVector({
          x: this.w(),
          y: 0,
          z: 0,
          w: 1
        }));

        list.push(view.projectVector({
          x: 0,
          y: this.h(),
          z: 0,
          w: 1
        }));

        list.push(view.projectVector({
          x: this.w(),
          y: this.h(),
          z: 0,
          w: 1
        }));

        return list;
      };

      /**
       * @param float camera
       */
      _myTrait_.projectToCamera = function (camera) {

        var camM = camera.getRenderMatrix().createCopy().inverse(); // the final matrix of the camera
        var thisM = this.getRenderMatrix();

        // The resulting matrix?
        camM.matMul(thisM);

        if (!this._viewMatrix) {
          this._viewMatrix = {};
        }

        this._viewMatrix[camera.localId()] = camM;
      };

      /**
       * @param float name
       * @param float fn
       */
      _myTrait_.registerCameraFn = function (name, fn) {

        _cameraFunctions[name] = fn;
      };

      /**
       * @param float display
       */
      _myTrait_.registerDisplay = function (display) {

        if (!_displayList) _displayList = [];

        if (_displayList.indexOf(display) < 0) _displayList.push(display);
      };

      /**
       * @param float name
       * @param float fn
       */
      _myTrait_.registerRenderFn = function (name, fn) {

        if (!_renderFunctions) _renderFunctions = {};

        _renderFunctions[name] = fn;
      };

      /**
       * @param float obj
       */
      _myTrait_.removeActiveItem = function (obj) {
        var i;
        if ((i = _activeItems.indexOf(obj)) >= 0) {
          _activeItems.splice(i, 1);
          obj.hideHandles();
        }
      };

      /**
       * @param float displayId
       */
      _myTrait_.removeFromDisplay = function (displayId) {

        if (!this._displayList) return;

        this._displayList[displayId] = null;
      };

      /**
       * @param float t
       */
      _myTrait_.render = function (t) {

        this.addToRenderList(this);
      };

      /**
       * @param Object obj
       */
      _myTrait_.renderDisplayList = function (obj) {

        if (obj) {
          _displayList.forEach(function (d) {
            d.render(obj);
          });
        }
      };

      /**
       * @param float t
       */
      _myTrait_.renderHandles = function (t) {};

      /**
       * @param float box
       * @param float display
       * @param float options
       */
      _myTrait_.resizeableFor = function (box, display, options) {
        var sx,
            sy,
            me = this;

        options = options || {};
        var startM, startW, m, rendMCopy;

        if (!options.i) options.i = 0;
        if (!options.j) options.j = 0;

        this.listenDragEventsFor(box, function () {
          if (options.i || options.j) {
            me.moveRotationCenterTo(options.i || 0, options.j || 0, display);
          } else {
            me.moveRotationCenterTo(0, 0, display);
          }
          startM = me._scaleMatrix.createCopy();
          startW = Math.sqrt(me.w() * me.w() + me.h() * me.h());
        }, function (dragInfo) {

          var scalei = 1,
              scalej = 1;
          if (me.ri() < 1) {
            scalei = 1 / (1 - me.ri());
          }
          if (me.rj() < 1) {
            scalej = 1 / (1 - me.rj());
          }

          if (options.j) scalej = scalej * -1;
          if (options.i) scalei = scalei * -1;

          var ww = dragInfo.deltaIn.x * scalei + me.w(),
              hh = dragInfo.deltaIn.y * scalej + me.h();
          var dragW = Math.sqrt(ww * ww + hh * hh);
          var scaleFactor = dragW / startW;

          var mat = Matrix3D();
          mat.scale(scaleFactor);
          mat.matMul(startM);
          me._scaleMatrix.copyFrom(mat);
          me.callRender();
        }, function () {}, display, "resize" + options.j + options.i);
      };

      /**
       * @param float box
       * @param float display
       */
      _myTrait_.resizeableHeightFor = function (box, display) {

        var sx,
            sy,
            me = this;

        var startM, startW, m, rendMCopy;

        this.listenDragEventsFor(box, function () {
          me.moveRotationCenterTo(0, 0, display);
          startW = me.h();
        }, function (dragInfo) {

          var scale = 1;
          if (me.rj() < 1) {
            scale = 1 / (1 - me.rj());
          }
          var ww = dragInfo.deltaIn.y * scale + startW;
          me.h(ww);
          me.callRender();
        }, function () {}, display, "resizeheight");
      };

      /**
       * @param float box
       * @param float display
       * @param float options
       */
      _myTrait_.resizeableWidthFor = function (box, display, options) {

        var sx,
            sy,
            me = this;

        var startM, startW, m, rendMCopy;
        options = options || {};
        if (!options.inverse) options.inverse = 0;

        this.listenDragEventsFor(box, function () {
          if (options && options.inverse) {
            me.moveRotationCenterTo(1, 0, display);
          } else {
            me.moveRotationCenterTo(0, 0, display);
          }
          startW = me.w();
        }, function (dragInfo) {

          var scale = 1;
          if (me.ri() < 1) {
            scale = 1 / (1 - me.ri());
          }
          if (options && options.inverse) scale = scale * -1;

          var ww = dragInfo.deltaIn.x * scale + startW;
          me.w(ww);
          me.callRender();
        }, function () {}, display, "resizewidth" + options.inverse);
      };

      /**
       * @param float box
       * @param float display
       */
      _myTrait_.rotatableFor = function (box, display) {

        var sx,
            sy,
            me = this;

        var startM, startRot, startW, m, rendMCopy, cp_x, cp_y, startCenter;

        var vect = jsVectors();
        this.listenDragEventsFor(box, function (dragInfo) {
          me.moveRotationCenterTo(0.5, 0.5, display);
          startM = me.getRotationMatrix().createCopy();
          sx = dragInfo.dv.relx;
          sy = dragInfo.dv.rely;

          cp_x = me.w() * me.ri();
          cp_y = me.h() * me.rj();

          startCenter = me.getViewMatrix(display.getCamera()).projectVector({
            x: cp_x,
            y: cp_y,
            z: 0,
            w: 1
          });
        }, function (dragInfo) {

          try {
            var angle = vect.angleBetween({
              x: dragInfo.dv.relx - startCenter.x,
              y: dragInfo.dv.rely - startCenter.y
            }, {
              x: dragInfo.dv.relx + dragInfo.dv.dx - startCenter.x,
              y: dragInfo.dv.rely + dragInfo.dv.dy - startCenter.y
            });
            // console.log("Angle is ", angle);

            var sCopy = startM.createCopy(),
                rotM = Matrix3D();
            rotM.rotate({
              x: 0,
              y: 0,
              z: 1
            }, angle);

            sCopy.matMul(rotM);
            if (sCopy.isValidMatrix()) {
              me._rotMatrix.copyFrom(sCopy);
              me.callRender();
            }
          } catch (e) {}
        }, function () {}, display, "rotate");
      };

      /**
       * @param float v
       * @param float rad
       */
      _myTrait_.rotate = function (v, rad) {

        this._rotMatrix.rotate(v, rad);
      };

      /**
       * @param float angleDeg
       */
      _myTrait_.rotate2D = function (angleDeg) {

        var rad = Math.PI * angleDeg / 180;

        this._rotMatrix.rotate({
          x: 0,
          y: 0,
          z: 1
        }, rad);
      };

      /**
       * @param float t
       */
      _myTrait_.saveTransformUpdates = function (t) {
        var o = this;

        if (o.isFulfilled && !o.isFulfilled()) return;

        if (this.x) {

          var tm = o.getTransformMatrix(),
              x = o.x(),
              y = o.y();
          if (tm.m30() != x || tm.m31() != y) {
            console.log("Saving transformation matrix ");
            o.x(tm.m30());
            o.y(tm.m31());
          }
        }

        if (this.scaleFactor) {

          var sm = o.getScaleMatrix(),
              sf = sm.m00();
          if (o.scaleFactor() != sf) {
            o.scaleFactor(sf);
          }
        }

        var rm = o.getRotationMatrix();
        var angle = rm.getRotation2D();

        var bChangeAngle = false;

        if (o.rad) {
          if (o.rad() != angle) bChangeAngle = true;
        } else {
          var oldA = o.get("rad");
          if (oldA && oldA == angle) {
            bChangeAngle = false;
          } else {
            bChangeAngle = true;
          }
        }

        if (bChangeAngle && !isNaN(angle)) o.set("rad", angle);

        /*
        if(this.rmatrix) {
        var bRDirty = false,
        r;
        if(o.rmatrix) {
        r = o.rmatrix;
        if(r.m00() != rm.m00()) bRDirty = true;
        if(r.m01() != rm.m01()) bRDirty = true;
        if(r.m10() != rm.m10()) bRDirty = true;
        if(r.m11() != rm.m11()) bRDirty = true;
        } else {
        rRDirty = true;
        }
         if(bRDirty) {
        console.log("Transform update, had dirty matrix");
        console.log(rm.m00(), "vs", r.m00());
        if(o.rmatrix) {
            
            var angle = rm.getRotation2D();
            o.set("rad", angle);
            
            r.m00( rm.m00() );
            r.m01( rm.m01() );
            r.m10( rm.m10() );
            r.m11( rm.m11() );          
            
        }    
        }
        }*/

        if (o.items) {
          o.items.forEach(function (i) {
            if (i.saveTransformUpdates) i.saveTransformUpdates();
          });
        }
      };

      /**
       * @param float t
       */
      _myTrait_.scale = function (t) {
        this._scaleMatrix.scale(t);
      };

      /**
       * @param float v
       * @param float usingMatrix
       */
      _myTrait_.screenToItemCoords = function (v, usingMatrix) {

        // v.x, v.y

        if (usingMatrix) {
          var invRendM = usingMatrix;
        } else {
          var invRendM = this.getRenderMatrix().createCopy().inverse();
        }
        var res = invRendM.projectVector({
          x: v.x,
          y: v.y,
          z: 0,
          w: 1
        });

        // console.log("PROJECT", res.x, res.y);
        if (typeof v.dx != "undefined") {
          var resDx = invRendM.projectVector({
            x: v.dx,
            y: v.dy,
            z: 0,
            w: 0
          });
          // console.log("PROJECT DX", resDx.x, resDx.y);
          res.dx = resDx.x;
          res.dy = resDx.y;
        }
        return res;
      };

      /**
       * @param float t
       */
      _myTrait_.serialize = function (t) {

        this.forChildren(function (o) {

          if (o.x && o.y) {
            var tm = o.getTransformMatrix();
            o.x(tm.m30());
            o.y(tm.m31());
          }

          if (o.scaleFactor) {
            var sm = o.getScaleMatrix();
            o.scaleFactor(sm.m00());
          }
        });

        return this._model.toData();
      };

      /**
       * @param float name
       * @param float startFn
       * @param float endFn
       */
      _myTrait_.setClassHandleRenderers = function (name, startFn, endFn) {

        if (!_handleRenderFn) _handleRenderFn = {};

        if (this.isArray(name)) {
          var me = this;
          name.forEach(function (n) {
            me.setClassHandleRenderers(n, startFn, endFn);
          });
          return;
        }

        _handleRenderFn[name] = {
          _showHandlesFn: startFn,
          _hideHandlesFn: endFn
        };
      };

      /**
       * @param float t
       */
      _myTrait_.setDebugView = function (t) {
        _debugView = t;
      };

      /**
       * @param Object obj
       */
      _myTrait_.setGroupDelegate = function (obj) {

        this._groupDelegate = obj;
      };

      /**
       * @param float showHandlesFn
       * @param float hideHandlesFn
       */
      _myTrait_.setHandleRenderFns = function (showHandlesFn, hideHandlesFn) {

        this._showHandlesFn = showHandlesFn;
        this._hideHandlesFn = hideHandlesFn;
      };

      /**
       * @param float x
       * @param float y
       * @param float z
       */
      _myTrait_.setPosition = function (x, y, z) {

        var tm = this.getTransformMatrix();

        if (this.isObject(x)) {
          this.setPosition(x.x, x.y, x.z);
          return this;
        }

        if (typeof x != "undefined") tm.m30(x);
        if (typeof y != "undefined") tm.m31(y);
        if (typeof z != "undefined") tm.m32(z);

        return this;
      };

      /**
       * @param float data
       */
      _myTrait_.setRenderData = function (data) {

        this._renderData = data;
      };

      /**
       * @param float fn
       */
      _myTrait_.setRenderFn = function (fn) {

        this._renderFn = fn;
      };

      /**
       * @param float scope
       */
      _myTrait_.setRenderScope = function (scope) {

        _renderScope = scope;
      };

      /**
       * @param Object obj
       */
      _myTrait_.setRootNode = function (obj) {

        this._rootNode = obj;
      };

      /**
       * @param float t
       */
      _myTrait_.showHandles = function (t) {

        var rt = this.renderClass();
        this._handlesVisible = true;
        if (!_handleRenderFn) {
          return;
        }

        if (_handleRenderFn[rt]) {
          this._handlesVisible = true;
          _handleRenderFn[rt]._showHandlesFn(this, this._handleData, this.getActiveCamera());
          return;
        }

        if (this._showHandlesFn) {
          this._handlesVisible = true;
          this._showHandlesFn(this, this._handleData, this.getActiveCamera());
        }
      };

      /**
       * @param float t
       */
      _myTrait_.startRootTransform = function (t) {

        var data = this.getRenderData(),
            index = _renderables.renderIndex || 1;

        if (!data.lastTransIndex || data.lastTransIndex < index) {
          data.lastTransIndex = index;
          this.applyTransforms();
        }
      };

      /**
       * @param float x
       * @param float y
       * @param float z
       */
      _myTrait_.translate = function (x, y, z) {

        this._transMatrix.translate({
          x: x,
          y: y,
          z: z
        });
      };

      /**
       * @param float t
       */
      _myTrait_.ungroupItem = function (t) {

        var p = this._model.parent();
        var oneUp;

        if (p) oneUp = p.parent(); // now p = the display parent

        if (oneUp && oneUp.parent()) {

          if (!oneUp.parent()) return;

          var twoParentsUp = oneUp.parent().parent(); // the second display parent...
          if (!twoParentsUp) return;

          // this is the displayItem object to be used.
          newP = displayItem(twoParentsUp);

          var newPInv = newP.getRenderMatrix().createCopy().inverse();
          var myRendTrans = this.getRenderMatrix().createTransformCopy();

          var transV = this.getRenderMatrix().projectVector({
            x: this.w() * this.ri(),
            y: this.h() * this.rj(),
            z: 0,
            w: 1
          });

          var invV = newPInv.projectVector(transV);

          var newR = p._rotMatrix.createCopy().matMul(this._rotMatrix);
          var newS = p._scaleMatrix.createCopy().matMul(this._scaleMatrix);

          this._transMatrix.m30(invV.x);
          this._transMatrix.m31(invV.y);
          this._transMatrix.m32(invV.z);
          /*
          this._transMatrix.m30( newPInv.m30() );
          this._transMatrix.m31( newPInv.m31() );
          this._transMatrix.m32( newPInv.m32() );
          */

          this._rotMatrix.copyFrom(newR);
          this._scaleMatrix.copyFrom(newS);

          // remove from model and add to new parent object
          this._model.remove();
          newP.items.push(this);

          this.callRender();
        }
      };
    })(this);
  };

  var displayItem = function displayItem(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof displayItem) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != displayItem._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new displayItem(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  displayItem._classInfo = {
    name: "displayItem"
  };
  displayItem.prototype = new displayItem_prototype();

  (function () {
    if (typeof define !== "undefined" && define !== null && define.amd != null) {
      __amdDefs__["displayItem"] = displayItem;
      this.displayItem = displayItem;
    } else if (typeof module !== "undefined" && module !== null && module.exports != null) {
      module.exports["displayItem"] = displayItem;
    } else {
      this.displayItem = displayItem;
    }
  }).call(new Function("return this")());

  // the subclass definition comes around here then

  // The class definition is here...
  // let the private classes out

  var surfacePdfKit_prototype = function surfacePdfKit_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {
      var _renderFns;
      var _sfaceCnt;

      // Initialize static variables here...

      /**
       * To enable the rendering for the PDF kit - new PDFDocument() is given as parameter
       * @param float renderToDoc  - new PDFDocument()
       * @param float outputIframe  - _e(&quot;iframe&quot;) which has been added
       */
      _myTrait_.allowRender = function (renderToDoc, outputIframe) {

        if (!this._renderIndex) this._renderIndex = 1;

        if (typeof renderToDoc != "undefined") {
          this._doc = renderToDoc;
          this._stream = renderToDoc.pipe(blobStream());
          this._renderIndex++;
          this._waiting = true;

          var stream = this._stream;
          var me = this;

          if (outputIframe) {
            stream.on("finish", function () {
              me._waiting = false;
              outputIframe.attr({
                src: stream.toBlobURL("application/pdf")
              });
              outputIframe.trigger("stream", stream);
            });
          }
        }

        return this._renderIndex;
      };

      /**
       * @param float t
       */
      _myTrait_.frameFinish = function (t) {

        if (this._waiting && this._doc) {
          this._doc.end();
          this._waiting = false;
        }
      };

      /**
       * @param float t
       */
      _myTrait_.getDoc = function (t) {
        return this._doc;
      };

      /**
       * @param float t
       */
      _myTrait_.getElem = function (t) {
        return this._elem;
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (elem, width, height, doc) {

        this._elem = elem;
        this._width = width;
        this._height = height;
        this._doc = doc;

        if (!this._renderFns) {
          this._renderFns = {};
        }
      });

      /**
       * @param float t
       */
      _myTrait_.isRendering = function (t) {
        return this._waiting;
      };
    })(this);
  };

  var surfacePdfKit = function surfacePdfKit(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof surfacePdfKit) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != surfacePdfKit._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new surfacePdfKit(a, b, c, d, e, f, g, h);
  };
  // inheritance is here surface

  surfacePdfKit_prototype.prototype = surface.prototype;

  surfacePdfKit._classInfo = {
    name: "surfacePdfKit"
  };
  surfacePdfKit.prototype = new surfacePdfKit_prototype();

  (function () {
    if (typeof define !== "undefined" && define !== null && define.amd != null) {
      __amdDefs__["surfacePdfKit"] = surfacePdfKit;
      this.surfacePdfKit = surfacePdfKit;
    } else if (typeof module !== "undefined" && module !== null && module.exports != null) {
      module.exports["surfacePdfKit"] = surfacePdfKit;
    } else {
      this.surfacePdfKit = surfacePdfKit;
    }
  }).call(new Function("return this")());

  var displayView_prototype = function displayView_prototype() {
    // Then create the traits and subclasses for this class here...

    (function (_myTrait_) {

      // Initialize static variables here...

      /**
       * @param float options
       */
      _myTrait_._initCode = function (options) {

        var contDiv = options.container;
        contDiv.addClass("displayView");

        var cameraModel = _data({
          "data": {
            "type": "displayItem",
            "isCamera": 1,
            "renderClass": "camera",
            "displayWidth": options.width,
            "displayHeight": options.height,
            "x": 0,
            "y": 0,
            "w": 77,
            "h": 77,
            "scaleFactor": 1,
            "ri": 0,
            "rj": 0,
            "items": {
              "data": [],
              "__id": this.guid()
            }
          },
          "__id": this.guid()
        });

        var rootPage;
        if (options.model) {
          rootPage = options.model;
        } else {
          rootPage = _data({
            "type": "displayItem",
            "renderClass": "page",
            "x": 0,
            "y": 0,
            "scaleFactor": 1,
            "w": options.width,
            "h": options.height,
            "ri": 0,
            "rj": 0,
            "items": [],
            "rad": 0
          });
        }
        rootPage.then(function () {
          return cameraModel;
        }).then(function () {

          var camera = displayItem(cameraModel);
          var page = displayItem(rootPage);

          var scaleFactorForCamera = page.w() / options.width;
          // => refresh the size
          camera.scaleFactor(scaleFactorForCamera);

          camera.setRootNode(page);
          camera.applyTransforms();
          var c = contDiv.div();
          c.attr({
            style: "position:relative;"
          });
          var intoDom = c.div();
          intoDom.attr({
            style: "position:absolute;left:0px;top:0px;"
          });
          var mySurface = surfaceDomSVG(intoDom._dom, options.width || 300, options.height || 300);
          var rPacket = rendererPackageSVG();
          rPacket.initSvg(mySurface);
          var svgDisplay = display(camera, mySurface);

          var hoverSurface = surfaceDomSVGLayer(mySurface.getHoverLayer(), options.width || 300, options.height || 300);
          hoverSurface.svgHandles("box");
          hoverSurface.svgHandles("circle");
          hoverSurface.svgHandles("text");
          hoverSurface.svgHandles("svgpath");
          hoverSurface.svgHandles("path");

          if (options.handles) {
            if (options.handles) options.handles.forEach(function (h) {
              hoverSurface.svgHandles(h);
            });
          }

          display(camera, hoverSurface);

          contDiv.on("width", function (o, v) {
            var scaleFactorForCamera = page.w() / contDiv.width();
            camera.scaleFactor(scaleFactorForCamera);
            camera.applyTransforms();
            if (mySurface._svgElem) {
              mySurface._svgElem.attr({
                width: contDiv.width()
              });
            }
            c.width(contDiv.width());
            intoDom.width(contDiv.width());
          });
          contDiv.on("height", function (o, v) {
            if (mySurface._svgElem) {
              mySurface._svgElem.attr({
                height: contDiv.height()
              });
            }
            c.height(contDiv.height());
            intoDom.height(contDiv.height());
          });
          contDiv.svgSurface = function () {
            return mySurface;
          };
          contDiv.rootPage = function () {
            return page;
          };
          contDiv.camera = function () {
            return camera;
          };
          contDiv.createObject = function (className, options) {
            return page.createObject(className, options);
          };

          contDiv.trigger("load");
        });
      };

      /**
       * @param Object surface
       */
      _myTrait_._pdfkitRenderers = function (surface) {

        var rgb2cmyk = function rgb2cmyk(color) {

          var color = _e().toRGB(color);
          var r = color.r,
              g = color.g,
              b = color.b;

          var computedC = 0;
          var computedM = 0;
          var computedY = 0;
          var computedK = 0;

          //remove spaces from input RGB values, convert to int
          var r = parseInt(("" + r).replace(/\s/g, ""), 10);
          var g = parseInt(("" + g).replace(/\s/g, ""), 10);
          var b = parseInt(("" + b).replace(/\s/g, ""), 10);

          if (r == null || g == null || b == null || isNaN(r) || isNaN(g) || isNaN(b)) {
            return;
          }
          if (r < 0 || g < 0 || b < 0 || r > 255 || g > 255 || b > 255) {
            return;
          }

          // BLACK
          if (r == 0 && g == 0 && b == 0) {
            computedK = 1;
            return [0, 0, 0, 1];
          }

          computedC = 1 - r / 255;
          computedM = 1 - g / 255;
          computedY = 1 - b / 255;

          var minCMY = Math.min(computedC, Math.min(computedM, computedY));
          computedC = (computedC - minCMY) / (1 - minCMY);
          computedM = (computedM - minCMY) / (1 - minCMY);
          computedY = (computedY - minCMY) / (1 - minCMY);
          computedK = minCMY;

          var cmyk = [computedC, computedM, computedY, computedK];
          for (var i = 0; i < 4; i++) cmyk[i] = parseInt(cmyk[i] * 100);

          return cmyk;
        };

        surface.registerRenderer("circle", {
          start: function start(obj, display, data) {},
          refresh: function refresh(obj, display, data) {

            var surface = display.getSurface();

            if (!surface.isRendering()) return;

            var doc = surface.getDoc();

            doc.save();

            var mat = obj.getViewMatrix(display.getCamera());
            doc.transform(mat.m00(), mat.m01(), mat.m10(), mat.m11(), mat.m30(), mat.m31());

            var r = Math.min(obj.w() / 2, obj.h() / 2);
            doc.circle(r, r, r);
            doc.fillColor(rgb2cmyk(obj.get("bgcolor")), obj.get("alpha"));
            doc.fill();
            doc.restore();
          },
          end: function end() {}
        });
        surface.registerRenderer("box", {
          start: function start(obj, display, data) {},
          refresh: function refresh(obj, display, data) {

            var surface = display.getSurface();
            if (!surface.isRendering()) return;

            var doc = surface.getDoc();
            doc.save();

            var mat = obj.getViewMatrix(display.getCamera());
            doc.transform(mat.m00(), mat.m01(), mat.m10(), mat.m11(), mat.m30(), mat.m31());

            doc.rect(0, 0, obj.w(), obj.h());
            doc.fillColor(rgb2cmyk(obj.get("bgcolor")), obj.get("alpha"));
            doc.fill();
            doc.restore();
          },
          end: function end() {}
        });
        surface.registerRenderer("svgpath", {
          start: function start(obj, display, data) {},
          refresh: function refresh(obj, display, data) {

            var surface = display.getSurface();
            if (!surface.isRendering()) return;

            var doc = surface.getDoc();

            doc.save();

            var mat = obj.getViewMatrix(display.getCamera());
            doc.transform(mat.m00(), mat.m01(), mat.m10(), mat.m11(), mat.m30(), mat.m31());

            var svgPath = obj.svgPath(),
                w = obj.w(),
                h = obj.h();

            var parser = svgPathParser();
            parser.parse(svgPath);
            parser.makePathAbsolute();
            parser.fitPathInto(w, h);

            doc.path(parser.svgString());
            doc.fillColor(rgb2cmyk(obj.get("bgcolor")), obj.get("alpha"));
            doc.fill();
            doc.restore();
          },
          end: function end() {}
        });
      };

      /**
       * @param float t
       */
      _myTrait_.basicCamera = function (t) {
        var camera1 = _data({
          "data": {
            "type": "displayItem",
            "isCamera": 1,
            "renderClass": "camera",
            "displayWidth": 800,
            "displayHeight": 1000,
            "x": 0,
            "y": 0,
            "w": 77,
            "h": 77,
            "scaleFactor": 1,
            "ri": 0,
            "rj": 0,
            "items": {
              "data": [],
              "__id": this.guid()
            }
          },
          "__id": this.guid()
        });

        console.log("initializing the data -part here now...");

        return camera1;
      };

      /**
       * @param float t
       */
      _myTrait_.basicData = function (t) {
        return {
          "data": {
            "type": "displayItem",
            "renderClass": "book",
            "w": 1000,
            "h": 1000,
            "ri": 0,
            "rj": 0,
            "items": {
              "data": [{
                "data": {
                  "type": "displayItem",
                  "renderClass": "page",
                  "w": 1000,
                  "h": 1000,
                  "ri": 0,
                  "rj": 0,
                  "items": {
                    "data": [],
                    "__id": this.guid()
                  },
                  "rmatrix": {
                    "data": {
                      "m00": 1,
                      "m01": 0,
                      "m02": 0,
                      "m10": 0,
                      "m11": 1,
                      "m12": 0,
                      "m20": 0,
                      "m21": 0,
                      "m22": 1
                    },
                    "__id": this.guid()
                  }
                },
                "__id": this.guid()
              }],
              "__id": this.guid()
            },
            "rmatrix": {
              "data": {
                "m00": 1,
                "m01": 0,
                "m02": 0,
                "m10": 0,
                "m11": 1,
                "m12": 0,
                "m20": 0,
                "m21": 0,
                "m22": 1
              },
              "__id": this.guid()
            }
          },
          "__id": this.guid()
        };
      };

      /**
       * @param float t
       */
      _myTrait_.ePlugin = function (t) {
        var myDiv = _e();
        var me = this;
        myDiv.extendAll({
          displayView: function displayView(width, height, options) {

            var view = _e("div");

            options = options || {};

            view.width(width);
            view.height(height);

            me._initCode({
              container: view,
              width: width,
              height: height,
              handles: options.handles,
              model: options.model
            });
            this.add(view);
            return view;
          }
        });
      };

      /**
       * @param float t
       */
      _myTrait_.guid = function (t) {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      };

      if (_myTrait_.__traitInit && !_myTrait_.hasOwnProperty("__traitInit")) _myTrait_.__traitInit = _myTrait_.__traitInit.slice();
      if (!_myTrait_.__traitInit) _myTrait_.__traitInit = [];
      _myTrait_.__traitInit.push(function (main) {});

      /**
       * @param float container
       * @param float options
       */
      _myTrait_.initSvgScene = function (container, options) {

        console.log("initSvgScene called ");
        options = options || {};

        var c = container.div();
        c.attr({
          style: "position:relative;"
        });
        var intoDom = c.div();
        intoDom.attr({
          style: "position:absolute;left:0px;top:0px;"
        });

        if (options.width) {
          container.width(options.width);
        }
        if (options.height) {
          container.height(options.height);
        }

        // var myClass = _data().createSubClass( "type", "displayItem",  displayItem_prototype );
        var mySurface = surfaceDomSVG(intoDom._dom, options.width || 300, options.height || 300);

        var sceneData;

        if (options.data) {
          sceneData = options.data;
        } else {
          sceneData = _data(this.basicData());
          if (!options.noDemo) sceneData.items.item(0).createObject("circle").bgcolor("#ff77ee").alpha(0.8);
        }

        var camera1 = this.basicCamera(),
            initPromise = _promise(),
            myDisplay,
            uiDisplay,
            result = {
          display: myDisplay,
          uiDisplay: uiDisplay,
          surface: mySurface,
          camera: camera1,
          data: sceneData,
          initDone: initPromise
        };

        camera1.then(function () {

          if (!options.noRenderers) {
            var rPacket = rendererPackageSVG();
            rPacket.initSvg(mySurface);
          }

          if (options.cameraRoot) {
            camera1.setRootNode(options.cameraRoot);
          } else {
            camera1.setRootNode(sceneData.items.item(0));
          }
          if (options.cameraPos) {
            camera1.setPosition(options.cameraPos);
          }

          if (options.cameraScale) {
            camera1.scale(options.cameraScale);
          }

          camera1.applyTransforms();
          result.display = display(camera1, mySurface);
          myDisplay = result.display;

          if (options.handles) {

            // surface for the hover handles..
            var hoverSurface = surfaceDomSVGLayer(mySurface.getHoverLayer(), options.width || 300, options.height || 300);
            hoverSurface.svgHandles("box");
            hoverSurface.svgHandles("circle");
            hoverSurface.svgHandles("text");
            hoverSurface.svgHandles("svgpath");

            if (options.handleClasses) {
              options.handleClasses.forEach(function (hcName) {
                hoverSurface.svgHandles(hcName);
              });
            }

            result.uiDisplay = uiDisplay = display(camera1, hoverSurface);
          }
          initPromise.resolve(true);
        });

        return result;
      };
    })(this);
  };

  var displayView = function displayView(a, b, c, d, e, f, g, h) {
    var m = this,
        res;
    if (m instanceof displayView) {
      var args = [a, b, c, d, e, f, g, h];
      if (m.__factoryClass) {
        m.__factoryClass.forEach(function (initF) {
          res = initF.apply(m, args);
        });
        if (typeof res == "function") {
          if (res._classInfo.name != displayView._classInfo.name) return new res(a, b, c, d, e, f, g, h);
        } else {
          if (res) return res;
        }
      }
      if (m.__traitInit) {
        m.__traitInit.forEach(function (initF) {
          initF.apply(m, args);
        });
      } else {
        if (typeof m.init == "function") m.init.apply(m, args);
      }
    } else return new displayView(a, b, c, d, e, f, g, h);
  };
  // inheritance is here

  displayView._classInfo = {
    name: "displayView"
  };
  displayView.prototype = new displayView_prototype();

  (function () {
    if (typeof define !== "undefined" && define !== null && define.amd != null) {
      __amdDefs__["displayView"] = displayView;
      this.displayView = displayView;
    } else if (typeof module !== "undefined" && module !== null && module.exports != null) {
      module.exports["displayView"] = displayView;
    } else {
      this.displayView = displayView;
    }
  }).call(new Function("return this")());

  if (typeof define !== "undefined" && define !== null && define.amd != null) {
    define(__amdDefs__);
  }
}).call(new Function("return this")());

// --- let's not ---

// console.log("Could not add to display ", obj);

/*
this.initBezier();
var ntCnt = this.getSegmentCount();
var t1 = ntCnt * t;
var t_index = Math.floor( t1 );
var seg = this.getSegmentNro(t_index);
var sub_t = t1 - t_index;

// for example ntCnt = 10
// t = 9,5
var stepLen = 1 / ntCnt,        // 0,1
    nowStep = t_index / ntCnt,  // 0,9
    totStep = t,                // 0,95
    remStep = totStep - nowStep, // 0,05
    relStep = remStep / stepLen; // 0,05 / 0,1 = 0,5

var bez = seg.bezier();
// console.log("Rel step "+relStep);
pathFnData.x = bez.x(relStep);
pathFnData.y = bez.y(relStep);
var nn = bez.tangent(relStep, true);

pathFnData.normal.x = nn.x;
pathFnData.normal.y = nn.y;

fn(pathFnData);
*/

/*
this.initBezier();
var ntCnt = this.getSegmentCount();
var t1 = ntCnt * t;
var t_index = Math.floor( t1 );
var seg = this.getSegmentNro(t_index);
var sub_t = t1 - t_index;
// for example ntCnt = 10
// t = 9,5
var stepLen = 1 / ntCnt,        // 0,1
nowStep = t_index / ntCnt,  // 0,9
totStep = t,                // 0,95
remStep = totStep - nowStep, // 0,05
relStep = remStep / stepLen; // 0,05 / 0,1 = 0,5
var bez = seg.bezier();
// console.log("Rel step "+relStep);
pathFnData.x = bez.x(relStep);
pathFnData.y = bez.y(relStep);
var nn = bez.tangent(relStep, true);
pathFnData.normal.x = nn.x;
pathFnData.normal.y = nn.y;
fn(pathFnData);
*/

// this._renderFn();
/*
var localF = extM.localFork();
localF.then( function() {
me._extModel = localF;
me._ext = true;
})
*/