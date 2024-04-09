var K = function(t, r) {
  return K = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, n) {
    e.__proto__ = n;
  } || function(e, n) {
    for (var o in n)
      Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
  }, K(t, r);
};
function w(t, r) {
  if (typeof r != "function" && r !== null)
    throw new TypeError("Class extends value " + String(r) + " is not a constructor or null");
  K(t, r);
  function e() {
    this.constructor = t;
  }
  t.prototype = r === null ? Object.create(r) : (e.prototype = r.prototype, new e());
}
function D(t) {
  var r = typeof Symbol == "function" && Symbol.iterator, e = r && t[r], n = 0;
  if (e)
    return e.call(t);
  if (t && typeof t.length == "number")
    return {
      next: function() {
        return t && n >= t.length && (t = void 0), { value: t && t[n++], done: !t };
      }
    };
  throw new TypeError(r ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function M(t, r) {
  var e = typeof Symbol == "function" && t[Symbol.iterator];
  if (!e)
    return t;
  var n = e.call(t), o, s = [], i;
  try {
    for (; (r === void 0 || r-- > 0) && !(o = n.next()).done; )
      s.push(o.value);
  } catch (u) {
    i = { error: u };
  } finally {
    try {
      o && !o.done && (e = n.return) && e.call(n);
    } finally {
      if (i)
        throw i.error;
    }
  }
  return s;
}
function C(t, r, e) {
  if (e || arguments.length === 2)
    for (var n = 0, o = r.length, s; n < o; n++)
      (s || !(n in r)) && (s || (s = Array.prototype.slice.call(r, 0, n)), s[n] = r[n]);
  return t.concat(s || Array.prototype.slice.call(r));
}
function m(t) {
  return typeof t == "function";
}
function G(t) {
  var r = function(n) {
    Error.call(n), n.stack = new Error().stack;
  }, e = t(r);
  return e.prototype = Object.create(Error.prototype), e.prototype.constructor = e, e;
}
var T = G(function(t) {
  return function(e) {
    t(this), this.message = e ? e.length + ` errors occurred during unsubscription:
` + e.map(function(n, o) {
      return o + 1 + ") " + n.toString();
    }).join(`
  `) : "", this.name = "UnsubscriptionError", this.errors = e;
  };
});
function I(t, r) {
  if (t) {
    var e = t.indexOf(r);
    0 <= e && t.splice(e, 1);
  }
}
var P = function() {
  function t(r) {
    this.initialTeardown = r, this.closed = !1, this._parentage = null, this._finalizers = null;
  }
  return t.prototype.unsubscribe = function() {
    var r, e, n, o, s;
    if (!this.closed) {
      this.closed = !0;
      var i = this._parentage;
      if (i)
        if (this._parentage = null, Array.isArray(i))
          try {
            for (var u = D(i), a = u.next(); !a.done; a = u.next()) {
              var l = a.value;
              l.remove(this);
            }
          } catch (y) {
            r = { error: y };
          } finally {
            try {
              a && !a.done && (e = u.return) && e.call(u);
            } finally {
              if (r)
                throw r.error;
            }
          }
        else
          i.remove(this);
      var b = this.initialTeardown;
      if (m(b))
        try {
          b();
        } catch (y) {
          s = y instanceof T ? y.errors : [y];
        }
      var g = this._finalizers;
      if (g) {
        this._finalizers = null;
        try {
          for (var p = D(g), v = p.next(); !v.done; v = p.next()) {
            var O = v.value;
            try {
              Y(O);
            } catch (y) {
              s = s ?? [], y instanceof T ? s = C(C([], M(s)), M(y.errors)) : s.push(y);
            }
          }
        } catch (y) {
          n = { error: y };
        } finally {
          try {
            v && !v.done && (o = p.return) && o.call(p);
          } finally {
            if (n)
              throw n.error;
          }
        }
      }
      if (s)
        throw new T(s);
    }
  }, t.prototype.add = function(r) {
    var e;
    if (r && r !== this)
      if (this.closed)
        Y(r);
      else {
        if (r instanceof t) {
          if (r.closed || r._hasParent(this))
            return;
          r._addParent(this);
        }
        (this._finalizers = (e = this._finalizers) !== null && e !== void 0 ? e : []).push(r);
      }
  }, t.prototype._hasParent = function(r) {
    var e = this._parentage;
    return e === r || Array.isArray(e) && e.includes(r);
  }, t.prototype._addParent = function(r) {
    var e = this._parentage;
    this._parentage = Array.isArray(e) ? (e.push(r), e) : e ? [e, r] : r;
  }, t.prototype._removeParent = function(r) {
    var e = this._parentage;
    e === r ? this._parentage = null : Array.isArray(e) && I(e, r);
  }, t.prototype.remove = function(r) {
    var e = this._finalizers;
    e && I(e, r), r instanceof t && r._removeParent(this);
  }, t.EMPTY = function() {
    var r = new t();
    return r.closed = !0, r;
  }(), t;
}(), W = P.EMPTY;
function J(t) {
  return t instanceof P || t && "closed" in t && m(t.remove) && m(t.add) && m(t.unsubscribe);
}
function Y(t) {
  m(t) ? t() : t.unsubscribe();
}
var Q = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1
}, X = {
  setTimeout: function(t, r) {
    for (var e = [], n = 2; n < arguments.length; n++)
      e[n - 2] = arguments[n];
    return setTimeout.apply(void 0, C([t, r], M(e)));
  },
  clearTimeout: function(t) {
    var r = X.delegate;
    return ((r == null ? void 0 : r.clearTimeout) || clearTimeout)(t);
  },
  delegate: void 0
};
function se(t) {
  X.setTimeout(function() {
    throw t;
  });
}
function L() {
}
function j(t) {
  t();
}
var F = function(t) {
  w(r, t);
  function r(e) {
    var n = t.call(this) || this;
    return n.isStopped = !1, e ? (n.destination = e, J(e) && e.add(n)) : n.destination = ae, n;
  }
  return r.create = function(e, n, o) {
    return new R(e, n, o);
  }, r.prototype.next = function(e) {
    this.isStopped || this._next(e);
  }, r.prototype.error = function(e) {
    this.isStopped || (this.isStopped = !0, this._error(e));
  }, r.prototype.complete = function() {
    this.isStopped || (this.isStopped = !0, this._complete());
  }, r.prototype.unsubscribe = function() {
    this.closed || (this.isStopped = !0, t.prototype.unsubscribe.call(this), this.destination = null);
  }, r.prototype._next = function(e) {
    this.destination.next(e);
  }, r.prototype._error = function(e) {
    try {
      this.destination.error(e);
    } finally {
      this.unsubscribe();
    }
  }, r.prototype._complete = function() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  }, r;
}(P), ie = Function.prototype.bind;
function U(t, r) {
  return ie.call(t, r);
}
var ue = function() {
  function t(r) {
    this.partialObserver = r;
  }
  return t.prototype.next = function(r) {
    var e = this.partialObserver;
    if (e.next)
      try {
        e.next(r);
      } catch (n) {
        x(n);
      }
  }, t.prototype.error = function(r) {
    var e = this.partialObserver;
    if (e.error)
      try {
        e.error(r);
      } catch (n) {
        x(n);
      }
    else
      x(r);
  }, t.prototype.complete = function() {
    var r = this.partialObserver;
    if (r.complete)
      try {
        r.complete();
      } catch (e) {
        x(e);
      }
  }, t;
}(), R = function(t) {
  w(r, t);
  function r(e, n, o) {
    var s = t.call(this) || this, i;
    if (m(e) || !e)
      i = {
        next: e ?? void 0,
        error: n ?? void 0,
        complete: o ?? void 0
      };
    else {
      var u;
      s && Q.useDeprecatedNextContext ? (u = Object.create(e), u.unsubscribe = function() {
        return s.unsubscribe();
      }, i = {
        next: e.next && U(e.next, u),
        error: e.error && U(e.error, u),
        complete: e.complete && U(e.complete, u)
      }) : i = e;
    }
    return s.destination = new ue(i), s;
  }
  return r;
}(F);
function x(t) {
  se(t);
}
function ce(t) {
  throw t;
}
var ae = {
  closed: !0,
  next: L,
  error: ce,
  complete: L
}, le = function() {
  return typeof Symbol == "function" && Symbol.observable || "@@observable";
}();
function fe(t) {
  return t;
}
function pe(t) {
  return t.length === 0 ? fe : t.length === 1 ? t[0] : function(e) {
    return t.reduce(function(n, o) {
      return o(n);
    }, e);
  };
}
var N = function() {
  function t(r) {
    r && (this._subscribe = r);
  }
  return t.prototype.lift = function(r) {
    var e = new t();
    return e.source = this, e.operator = r, e;
  }, t.prototype.subscribe = function(r, e, n) {
    var o = this, s = he(r) ? r : new R(r, e, n);
    return j(function() {
      var i = o, u = i.operator, a = i.source;
      s.add(u ? u.call(s, a) : a ? o._subscribe(s) : o._trySubscribe(s));
    }), s;
  }, t.prototype._trySubscribe = function(r) {
    try {
      return this._subscribe(r);
    } catch (e) {
      r.error(e);
    }
  }, t.prototype.forEach = function(r, e) {
    var n = this;
    return e = $(e), new e(function(o, s) {
      var i = new R({
        next: function(u) {
          try {
            r(u);
          } catch (a) {
            s(a), i.unsubscribe();
          }
        },
        error: s,
        complete: o
      });
      n.subscribe(i);
    });
  }, t.prototype._subscribe = function(r) {
    var e;
    return (e = this.source) === null || e === void 0 ? void 0 : e.subscribe(r);
  }, t.prototype[le] = function() {
    return this;
  }, t.prototype.pipe = function() {
    for (var r = [], e = 0; e < arguments.length; e++)
      r[e] = arguments[e];
    return pe(r)(this);
  }, t.prototype.toPromise = function(r) {
    var e = this;
    return r = $(r), new r(function(n, o) {
      var s;
      e.subscribe(function(i) {
        return s = i;
      }, function(i) {
        return o(i);
      }, function() {
        return n(s);
      });
    });
  }, t.create = function(r) {
    return new t(r);
  }, t;
}();
function $(t) {
  var r;
  return (r = t ?? Q.Promise) !== null && r !== void 0 ? r : Promise;
}
function be(t) {
  return t && m(t.next) && m(t.error) && m(t.complete);
}
function he(t) {
  return t && t instanceof F || be(t) && J(t);
}
function de(t) {
  return m(t == null ? void 0 : t.lift);
}
function ye(t) {
  return function(r) {
    if (de(r))
      return r.lift(function(e) {
        try {
          return t(e, this);
        } catch (n) {
          this.error(n);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function ve(t, r, e, n, o) {
  return new ge(t, r, e, n, o);
}
var ge = function(t) {
  w(r, t);
  function r(e, n, o, s, i, u) {
    var a = t.call(this, e) || this;
    return a.onFinalize = i, a.shouldUnsubscribe = u, a._next = n ? function(l) {
      try {
        n(l);
      } catch (b) {
        e.error(b);
      }
    } : t.prototype._next, a._error = s ? function(l) {
      try {
        s(l);
      } catch (b) {
        e.error(b);
      } finally {
        this.unsubscribe();
      }
    } : t.prototype._error, a._complete = o ? function() {
      try {
        o();
      } catch (l) {
        e.error(l);
      } finally {
        this.unsubscribe();
      }
    } : t.prototype._complete, a;
  }
  return r.prototype.unsubscribe = function() {
    var e;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      var n = this.closed;
      t.prototype.unsubscribe.call(this), !n && ((e = this.onFinalize) === null || e === void 0 || e.call(this));
    }
  }, r;
}(F), me = G(function(t) {
  return function() {
    t(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed";
  };
}), Z = function(t) {
  w(r, t);
  function r() {
    var e = t.call(this) || this;
    return e.closed = !1, e.currentObservers = null, e.observers = [], e.isStopped = !1, e.hasError = !1, e.thrownError = null, e;
  }
  return r.prototype.lift = function(e) {
    var n = new H(this, this);
    return n.operator = e, n;
  }, r.prototype._throwIfClosed = function() {
    if (this.closed)
      throw new me();
  }, r.prototype.next = function(e) {
    var n = this;
    j(function() {
      var o, s;
      if (n._throwIfClosed(), !n.isStopped) {
        n.currentObservers || (n.currentObservers = Array.from(n.observers));
        try {
          for (var i = D(n.currentObservers), u = i.next(); !u.done; u = i.next()) {
            var a = u.value;
            a.next(e);
          }
        } catch (l) {
          o = { error: l };
        } finally {
          try {
            u && !u.done && (s = i.return) && s.call(i);
          } finally {
            if (o)
              throw o.error;
          }
        }
      }
    });
  }, r.prototype.error = function(e) {
    var n = this;
    j(function() {
      if (n._throwIfClosed(), !n.isStopped) {
        n.hasError = n.isStopped = !0, n.thrownError = e;
        for (var o = n.observers; o.length; )
          o.shift().error(e);
      }
    });
  }, r.prototype.complete = function() {
    var e = this;
    j(function() {
      if (e._throwIfClosed(), !e.isStopped) {
        e.isStopped = !0;
        for (var n = e.observers; n.length; )
          n.shift().complete();
      }
    });
  }, r.prototype.unsubscribe = function() {
    this.isStopped = this.closed = !0, this.observers = this.currentObservers = null;
  }, Object.defineProperty(r.prototype, "observed", {
    get: function() {
      var e;
      return ((e = this.observers) === null || e === void 0 ? void 0 : e.length) > 0;
    },
    enumerable: !1,
    configurable: !0
  }), r.prototype._trySubscribe = function(e) {
    return this._throwIfClosed(), t.prototype._trySubscribe.call(this, e);
  }, r.prototype._subscribe = function(e) {
    return this._throwIfClosed(), this._checkFinalizedStatuses(e), this._innerSubscribe(e);
  }, r.prototype._innerSubscribe = function(e) {
    var n = this, o = this, s = o.hasError, i = o.isStopped, u = o.observers;
    return s || i ? W : (this.currentObservers = null, u.push(e), new P(function() {
      n.currentObservers = null, I(u, e);
    }));
  }, r.prototype._checkFinalizedStatuses = function(e) {
    var n = this, o = n.hasError, s = n.thrownError, i = n.isStopped;
    o ? e.error(s) : i && e.complete();
  }, r.prototype.asObservable = function() {
    var e = new N();
    return e.source = this, e;
  }, r.create = function(e, n) {
    return new H(e, n);
  }, r;
}(N), H = function(t) {
  w(r, t);
  function r(e, n) {
    var o = t.call(this) || this;
    return o.destination = e, o.source = n, o;
  }
  return r.prototype.next = function(e) {
    var n, o;
    (o = (n = this.destination) === null || n === void 0 ? void 0 : n.next) === null || o === void 0 || o.call(n, e);
  }, r.prototype.error = function(e) {
    var n, o;
    (o = (n = this.destination) === null || n === void 0 ? void 0 : n.error) === null || o === void 0 || o.call(n, e);
  }, r.prototype.complete = function() {
    var e, n;
    (n = (e = this.destination) === null || e === void 0 ? void 0 : e.complete) === null || n === void 0 || n.call(e);
  }, r.prototype._subscribe = function(e) {
    var n, o;
    return (o = (n = this.source) === null || n === void 0 ? void 0 : n.subscribe(e)) !== null && o !== void 0 ? o : W;
  }, r;
}(Z), V = function(t) {
  w(r, t);
  function r(e) {
    var n = t.call(this) || this;
    return n._value = e, n;
  }
  return Object.defineProperty(r.prototype, "value", {
    get: function() {
      return this.getValue();
    },
    enumerable: !1,
    configurable: !0
  }), r.prototype._subscribe = function(e) {
    var n = t.prototype._subscribe.call(this, e);
    return !n.closed && e.next(this._value), n;
  }, r.prototype.getValue = function() {
    var e = this, n = e.hasError, o = e.thrownError, s = e._value;
    if (n)
      throw o;
    return this._throwIfClosed(), s;
  }, r.prototype.next = function(e) {
    t.prototype.next.call(this, this._value = e);
  }, r;
}(Z);
function _e(t, r) {
  return ye(function(e, n) {
    var o = 0;
    e.subscribe(ve(n, function(s) {
      return t.call(r, s, o++) && n.next(s);
    }));
  });
}
function z(t) {
  return _e(function(r, e) {
    return t <= e;
  });
}
const q = (t, r) => t === r;
function Se(t, r) {
  if (t.length !== r.length)
    return !1;
  for (let e = 0; e < t.length; e++)
    if (t[e] !== r[e])
      return !1;
  return !0;
}
function we(t) {
  return typeof t == "object" && t !== null && "value" in t && "isEqual" in t && typeof t.isEqual == "function" && "type" in t && t.type === "shallow";
}
function Ee(t) {
  return t === null || typeof t == "string" || typeof t == "number" || typeof t == "boolean" || typeof t == "bigint" || typeof t == "symbol" || typeof t > "u";
}
function ee(t) {
  return Array.isArray(t);
}
function Oe(t) {
  return typeof t == "object" && t !== null && !ee(t);
}
function xe(t) {
  return t instanceof Map;
}
function te(t, r = q) {
  return {
    value: t,
    isEqual: r,
    type: "shallow"
  };
}
function S(t, r = q) {
  if (r == q && !Ee(t))
    throw Error(
      "Node requires a primitive value or a custom isEqual to be supplied. Use makeShallow to provide a custom equals func for deep objects. Got: " + t
    );
  let e = t, n = !1, o = t;
  const s = new V(t), i = s.asObservable(), u = (p) => {
    s.next(p);
  }, a = () => {
    let p = !1;
    return n && !r(o, e) && (o = e, n = !1, p = !0, u(o)), [o, p];
  }, l = (p) => (e = p, n = !0, a);
  return {
    get: a,
    set: (p) => {
      let [v, O] = l(p)();
      return O;
    },
    setDefer: l,
    subscribe: (p, v = !1) => (a(), v ? i.pipe(z(1)).subscribe(p) : i.subscribe(p))
  };
}
const je = S(void 0);
function re(t) {
  let r = !1;
  const e = t, n = () => {
    const l = {};
    let b = !1;
    for (const g in e) {
      let [p, v] = e[g].get();
      l[g] = p, b = b || v;
    }
    return [l, b];
  }, o = new V(n()[0]), s = o.asObservable(), i = (l) => {
    o.next(l);
  }, u = () => {
    r = !0;
    const [l, b] = n();
    return b && i(l), r = !1, [l, b];
  };
  for (const l in e)
    e[l].subscribe((b) => {
      if (!r) {
        let [g, p] = u();
        p || i(g);
      }
    });
  return {
    nodes: e,
    get: u,
    subscribe: (l, b = !1) => (u(), b ? s.pipe(z(1)).subscribe(l) : s.subscribe(l))
  };
}
function B(t) {
  const r = re(t), e = t, n = (s) => {
    for (const i in s)
      e[i] === void 0 && (e[i] = E(s[i])), e[i].setDefer(s[i]);
    for (const i in e)
      (s === void 0 || s[i] === void 0) && delete e[i];
    return r.get;
  }, o = (s) => {
    let [i, u] = n(s)();
    return u;
  };
  return {
    nodes: e,
    get: r.get,
    subscribe: r.subscribe,
    setDefer: n,
    set: o
  };
}
function Pe(t) {
  const r = {};
  for (const e in t)
    r[e] = E(t[e]);
  return B(r);
}
function A(t) {
  const r = /* @__PURE__ */ new Map();
  let e = !1;
  const n = () => {
    const c = /* @__PURE__ */ new Map();
    let f = !1;
    for (const [h, d] of r) {
      let [_, k] = d.get();
      _ !== void 0 && c.set(h, _), f = f || k;
    }
    return [c, f];
  }, o = new V(n()[0]), s = o.asObservable(), i = (c) => {
    o.next(c);
  };
  let u = [
    () => {
      if (!e) {
        let [c, f] = a();
        f || i(c);
      }
    }
  ];
  const a = () => {
    e = !0;
    const [c, f] = n();
    return f && i(c), e = !1, [c, f];
  }, l = (c) => {
    var f;
    return r.has(c) ? (f = r.get(c)) == null ? void 0 : f.get() : [void 0, !1];
  }, b = (c, f) => {
    var h;
    if (!r.has(c)) {
      const d = S(void 0);
      u.forEach((_) => {
        d.subscribe(
          (k) => _(c, k),
          /*skipInitialNotify=*/
          !0
        );
      }), r.set(c, d);
    }
    return (h = r.get(c)) == null ? void 0 : h.setDefer(f);
  }, g = (c) => {
    var f;
    for (const [h, d] of r)
      c.has(h) || (f = r.get(h)) == null || f.setDefer(void 0), r.delete(h);
    for (const [h, d] of c.entries())
      b(h, d);
    return a;
  }, p = (c, f) => {
    let [h, d] = b(c, f)();
    return d;
  }, v = (c) => {
    let [f, h] = g(c)();
    return h;
  }, O = (c, f = !1) => (a(), f && s.pipe(z(1)).subscribe(c), s.subscribe(c)), y = (c) => {
    const f = r.get(c);
    if (f !== void 0)
      return f;
    {
      const h = S(void 0);
      return r.set(c, h), u.forEach((d) => {
        h.subscribe(
          (_) => d(c, _),
          /*skipInitialNotify*/
          !0
        );
      }), h;
    }
  }, ne = (c, f, h = !1) => {
    var d;
    (d = y(c)) == null || d.subscribe(f, h);
  }, oe = (c, f = !1) => {
    u.push(c);
    for (const [h, d] of r)
      d.subscribe((_) => c(h, _), f);
  };
  return t == null || t.forEach((c, f) => {
    p(f, c);
  }), {
    get: a,
    setKeyDefer: b,
    setKey: p,
    getKey: l,
    setDefer: g,
    set: v,
    getKeyNode: y,
    subscribeKey: ne,
    subscribeKeys: oe,
    subscribe: O
  };
}
function E(t) {
  if (we(t))
    return S(
      t.value,
      t.isEqual
    );
  if (xe(t))
    return A(t);
  if (ee(t))
    return S(
      t,
      (r, e) => Se(r, e)
    );
  if (Oe(t)) {
    let r = {};
    const e = t;
    for (const n in e)
      r[n] = E(e[n]);
    return B(r);
  }
  return S(t);
}
function Ae(t, r, e) {
  const [n, o] = t.get(), s = r(n), i = e == null ? s : te(s, e), u = E(i);
  return t.subscribe((a) => u.set(r(a)), !0), u;
}
function ke(t, r) {
  return (...e) => r(t.get()[0], ...e);
}
function Te(t, r, e) {
  const n = E(t);
  return r.subscribe((o) => {
    let s = !0;
    do {
      const [i, u] = n.get(), a = e({ self: i, read: o });
      s = n.set(a);
    } while (s);
  }), n;
}
function Ue(t, r, e) {
  const n = A();
  return t.subscribeKeys((o, s) => {
    const [i, u] = r.get(), [a, l] = e(o, s, i);
    n.setKey(a, l);
  }), r.subscribe((o) => {
    const s = t.get()[0];
    for (const [i, u] of s) {
      const [a, l] = e(i, u, o);
      n.setKeyDefer(a, l);
    }
    n.get();
  }), n;
}
function Ke(t, r) {
  const e = A();
  return t.subscribe((n) => {
    const o = r(n);
    for (const [s, i] of o)
      e.setKeyDefer(s, i);
    e.get();
  }), e;
}
function De(t, r) {
  const e = S(void 0);
  return t.subscribeKey(r, (n) => e.set(n)), e;
}
function Me(t, r, e) {
  return (...n) => {
    let o = e(...n);
    return r.set(o);
  };
}
function Ce(t, r, e, n) {
  return (...o) => {
    const [s, i] = (e == null ? void 0 : e.get()) ?? [void 0, !1], u = n(s, ...o);
    return r.set(u);
  };
}
const Ve = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: Me,
  compose: B,
  composeRead: re,
  compositeNode: Pe,
  dependentAction: Ce,
  edge: Ae,
  makeDeepNode: E,
  makeSelector: ke,
  makeShallow: te,
  mapEdge: Ke,
  mapKeyEdge: De,
  mapNode: A,
  mapToMapEdge: Ue,
  node: S,
  selfEdge: Te,
  undefnode: je
}, Symbol.toStringTag, { value: "Module" })), Ie = (t, r) => {
  for (const e in r)
    r[e].subscribe((n) => {
      n ? t.classList.add(e) : t.classList.remove(e);
    });
}, Re = (t, r) => {
  for (const e in r)
    r[e].subscribe((n) => {
      n ? t.style.setProperty(e, n) : t.style.removeProperty(e);
    });
}, qe = (t, r) => {
  r.subscribe((e) => {
    t.textContent = e ?? "";
  });
}, ze = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  classMap: Ie,
  style: Re,
  text: qe
}, Symbol.toStringTag, { value: "Module" })), Fe = (t, r, e = 1) => Array.from(
  { length: (r - t) / e + 1 },
  (n, o) => t + o * e
), Be = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  arrayRange: Fe
}, Symbol.toStringTag, { value: "Module" }));
export {
  ze as graphRender,
  Ve as graphState,
  Be as graphUtil
};
