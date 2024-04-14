var K = function(t, r) {
  return K = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, n) {
    e.__proto__ = n;
  } || function(e, n) {
    for (var o in n)
      Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
  }, K(t, r);
};
function E(t, r) {
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
  } catch (c) {
    i = { error: c };
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
            for (var c = D(i), u = c.next(); !u.done; u = c.next()) {
              var b = u.value;
              b.remove(this);
            }
          } catch (g) {
            r = { error: g };
          } finally {
            try {
              u && !u.done && (e = c.return) && e.call(c);
            } finally {
              if (r)
                throw r.error;
            }
          }
        else
          i.remove(this);
      var f = this.initialTeardown;
      if (m(f))
        try {
          f();
        } catch (g) {
          s = g instanceof T ? g.errors : [g];
        }
      var d = this._finalizers;
      if (d) {
        this._finalizers = null;
        try {
          for (var p = D(d), v = p.next(); !v.done; v = p.next()) {
            var w = v.value;
            try {
              B(w);
            } catch (g) {
              s = s ?? [], g instanceof T ? s = C(C([], M(s)), M(g.errors)) : s.push(g);
            }
          }
        } catch (g) {
          n = { error: g };
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
        B(r);
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
function B(t) {
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
function ie(t) {
  X.setTimeout(function() {
    throw t;
  });
}
function Y() {
}
function j(t) {
  t();
}
var F = function(t) {
  E(r, t);
  function r(e) {
    var n = t.call(this) || this;
    return n.isStopped = !1, e ? (n.destination = e, J(e) && e.add(n)) : n.destination = le, n;
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
}(P), ce = Function.prototype.bind;
function U(t, r) {
  return ce.call(t, r);
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
  E(r, t);
  function r(e, n, o) {
    var s = t.call(this) || this, i;
    if (m(e) || !e)
      i = {
        next: e ?? void 0,
        error: n ?? void 0,
        complete: o ?? void 0
      };
    else {
      var c;
      s && Q.useDeprecatedNextContext ? (c = Object.create(e), c.unsubscribe = function() {
        return s.unsubscribe();
      }, i = {
        next: e.next && U(e.next, c),
        error: e.error && U(e.error, c),
        complete: e.complete && U(e.complete, c)
      }) : i = e;
    }
    return s.destination = new ue(i), s;
  }
  return r;
}(F);
function x(t) {
  ie(t);
}
function ae(t) {
  throw t;
}
var le = {
  closed: !0,
  next: Y,
  error: ae,
  complete: Y
}, fe = function() {
  return typeof Symbol == "function" && Symbol.observable || "@@observable";
}();
function pe(t) {
  return t;
}
function he(t) {
  return t.length === 0 ? pe : t.length === 1 ? t[0] : function(e) {
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
    var o = this, s = de(r) ? r : new R(r, e, n);
    return j(function() {
      var i = o, c = i.operator, u = i.source;
      s.add(c ? c.call(s, u) : u ? o._subscribe(s) : o._trySubscribe(s));
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
        next: function(c) {
          try {
            r(c);
          } catch (u) {
            s(u), i.unsubscribe();
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
  }, t.prototype[fe] = function() {
    return this;
  }, t.prototype.pipe = function() {
    for (var r = [], e = 0; e < arguments.length; e++)
      r[e] = arguments[e];
    return he(r)(this);
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
function de(t) {
  return t && t instanceof F || be(t) && J(t);
}
function ye(t) {
  return m(t == null ? void 0 : t.lift);
}
function ve(t) {
  return function(r) {
    if (ye(r))
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
function ge(t, r, e, n, o) {
  return new me(t, r, e, n, o);
}
var me = function(t) {
  E(r, t);
  function r(e, n, o, s, i, c) {
    var u = t.call(this, e) || this;
    return u.onFinalize = i, u.shouldUnsubscribe = c, u._next = n ? function(b) {
      try {
        n(b);
      } catch (f) {
        e.error(f);
      }
    } : t.prototype._next, u._error = s ? function(b) {
      try {
        s(b);
      } catch (f) {
        e.error(f);
      } finally {
        this.unsubscribe();
      }
    } : t.prototype._error, u._complete = o ? function() {
      try {
        o();
      } catch (b) {
        e.error(b);
      } finally {
        this.unsubscribe();
      }
    } : t.prototype._complete, u;
  }
  return r.prototype.unsubscribe = function() {
    var e;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      var n = this.closed;
      t.prototype.unsubscribe.call(this), !n && ((e = this.onFinalize) === null || e === void 0 || e.call(this));
    }
  }, r;
}(F), _e = G(function(t) {
  return function() {
    t(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed";
  };
}), Z = function(t) {
  E(r, t);
  function r() {
    var e = t.call(this) || this;
    return e.closed = !1, e.currentObservers = null, e.observers = [], e.isStopped = !1, e.hasError = !1, e.thrownError = null, e;
  }
  return r.prototype.lift = function(e) {
    var n = new H(this, this);
    return n.operator = e, n;
  }, r.prototype._throwIfClosed = function() {
    if (this.closed)
      throw new _e();
  }, r.prototype.next = function(e) {
    var n = this;
    j(function() {
      var o, s;
      if (n._throwIfClosed(), !n.isStopped) {
        n.currentObservers || (n.currentObservers = Array.from(n.observers));
        try {
          for (var i = D(n.currentObservers), c = i.next(); !c.done; c = i.next()) {
            var u = c.value;
            u.next(e);
          }
        } catch (b) {
          o = { error: b };
        } finally {
          try {
            c && !c.done && (s = i.return) && s.call(i);
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
    var n = this, o = this, s = o.hasError, i = o.isStopped, c = o.observers;
    return s || i ? W : (this.currentObservers = null, c.push(e), new P(function() {
      n.currentObservers = null, I(c, e);
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
  E(r, t);
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
}(Z), L = function(t) {
  E(r, t);
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
function Se(t, r) {
  return ve(function(e, n) {
    var o = 0;
    e.subscribe(ge(n, function(s) {
      return t.call(r, s, o++) && n.next(s);
    }));
  });
}
function V(t) {
  return Se(function(r, e) {
    return t <= e;
  });
}
const q = (t, r) => t === r;
function we(t, r) {
  if (t.length !== r.length)
    return !1;
  for (let e = 0; e < t.length; e++)
    if (t[e] !== r[e])
      return !1;
  return !0;
}
function Ee(t) {
  return typeof t == "object" && t !== null && "value" in t && "isEqual" in t && typeof t.isEqual == "function" && "type" in t && t.type === "shallow";
}
function Oe(t) {
  return t === null || typeof t == "string" || typeof t == "number" || typeof t == "boolean" || typeof t == "bigint" || typeof t == "symbol" || typeof t > "u";
}
function ee(t) {
  return Array.isArray(t);
}
function xe(t) {
  return typeof t == "object" && t !== null && !ee(t);
}
function je(t) {
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
  if (r == q && !Oe(t))
    throw Error(
      "Node requires a primitive value or a custom isEqual to be supplied. Use makeShallow to provide a custom equals func for deep objects. Got: " + t
    );
  let e = t, n = !1, o = t;
  const s = new L(t), i = s.asObservable(), c = (p) => {
    s.next(p);
  }, u = () => {
    let p = !1;
    return n && !r(o, e) && (o = e, n = !1, p = !0, c(o)), [o, p];
  }, b = (p) => (e = p, n = !0, u);
  return {
    get: u,
    set: (p) => {
      let [v, w] = b(p)();
      return w;
    },
    setDefer: b,
    subscribe: (p, v = !1) => (u(), v ? i.pipe(V(1)).subscribe(p) : i.subscribe(p))
  };
}
const Pe = S(void 0);
function re(t) {
  let r = !1;
  const e = t, n = () => {
    const f = {};
    let d = !1;
    for (const p in e) {
      let [v, w] = e[p].get();
      f[p] = v, d = d || w;
    }
    return [f, d];
  }, o = new L(n()[0]), s = o.asObservable(), i = (f) => {
    o.next(f);
  }, c = () => {
    r = !0;
    const [f, d] = n();
    return d && i(f), r = !1, [f, d];
  };
  for (const f in e)
    e[f].subscribe((d) => {
      if (!r) {
        let [p, v] = c();
        v || i(p);
      }
    });
  return {
    decompose: () => e,
    get: c,
    subscribe: (f, d = !1) => (c(), d ? s.pipe(V(1)).subscribe(f) : s.subscribe(f))
  };
}
function z(t) {
  const r = re(t), e = t, n = (i) => {
    for (const c in i)
      e[c] === void 0 && (e[c] = O(i[c])), e[c].setDefer(i[c]);
    for (const c in e)
      (i === void 0 || i[c] === void 0) && delete e[c];
    return r.get;
  }, o = (i) => {
    let [c, u] = n(i)();
    return u;
  };
  return {
    decompose: () => e,
    get: r.get,
    subscribe: r.subscribe,
    setDefer: n,
    set: o
  };
}
function Ae(t) {
  const r = {};
  for (const e in t)
    r[e] = O(t[e]);
  return z(r);
}
function A(t) {
  const r = /* @__PURE__ */ new Map();
  let e = !1;
  const n = () => {
    const a = /* @__PURE__ */ new Map();
    let l = !1;
    for (const [h, y] of r) {
      let [_, k] = y.get();
      _ !== void 0 && a.set(h, _), l = l || k;
    }
    return [a, l];
  }, o = new L(n()[0]), s = o.asObservable(), i = (a) => {
    o.next(a);
  };
  let c = [
    () => {
      if (!e) {
        let [a, l] = u();
        l || i(a);
      }
    }
  ];
  const u = () => {
    e = !0;
    const [a, l] = n();
    return l && i(a), e = !1, [a, l];
  }, b = (a) => {
    var l;
    return r.has(a) ? (l = r.get(a)) == null ? void 0 : l.get() : [void 0, !1];
  }, f = (a, l) => {
    var h;
    if (!r.has(a)) {
      const y = S(void 0);
      c.forEach((_) => {
        y.subscribe(
          (k) => _(a, k),
          /*skipInitialNotify=*/
          !0
        );
      }), r.set(a, y);
    }
    return (h = r.get(a)) == null ? void 0 : h.setDefer(l);
  }, d = (a) => {
    var l;
    for (const [h, y] of r)
      a.has(h) || (l = r.get(h)) == null || l.setDefer(void 0), r.delete(h);
    for (const [h, y] of a.entries())
      f(h, y);
    return u;
  }, p = (a, l) => {
    let [h, y] = f(a, l)();
    return y;
  }, v = (a) => {
    let [l, h] = d(a)();
    return h;
  }, w = (a, l = !1) => (u(), l && s.pipe(V(1)).subscribe(a), s.subscribe(a)), g = (a) => {
    const l = r.get(a);
    if (l !== void 0)
      return l;
    {
      const h = S(void 0);
      return r.set(a, h), c.forEach((y) => {
        h.subscribe(
          (_) => y(a, _),
          /*skipInitialNotify*/
          !0
        );
      }), h;
    }
  }, oe = (a, l, h = !1) => {
    var y;
    (y = g(a)) == null || y.subscribe(l, h);
  }, se = (a, l = !1) => {
    c.push(a);
    for (const [h, y] of r)
      y.subscribe((_) => a(h, _), l);
  };
  return t == null || t.forEach((a, l) => {
    p(l, a);
  }), {
    get: u,
    setKeyDefer: f,
    setKey: p,
    getKey: b,
    setDefer: d,
    set: v,
    getKeyNode: g,
    subscribeKey: oe,
    subscribeKeys: se,
    subscribe: w,
    decompose: () => r
  };
}
function O(t) {
  if (Ee(t))
    return S(
      t.value,
      t.isEqual
    );
  if (je(t))
    return A(t);
  if (ee(t))
    return S(
      t,
      (r, e) => we(r, e)
    );
  if (xe(t)) {
    let r = {};
    const e = t;
    for (const n in e)
      r[n] = O(e[n]);
    return z(r);
  }
  return S(t);
}
function ke(t, r, e) {
  const [n, o] = t.get(), s = r(n), i = e == null ? s : te(s, e), c = O(i);
  return t.subscribe((u) => c.set(r(u)), !0), c;
}
function Te(t, r) {
  return (...e) => r(t.get()[0], ...e);
}
function Ue(t, r, e) {
  const n = O(t);
  return r.subscribe((o) => {
    let s = !0;
    do {
      const [i, c] = n.get(), u = e({ self: i, read: o });
      s = n.set(u);
    } while (s);
  }), n;
}
function Ke(t, r, e) {
  const n = A();
  return t.subscribeKeys((o, s) => {
    const [i, c] = r.get(), [u, b] = e(o, s, i);
    n.setKey(u, b);
  }), r.subscribe((o) => {
    const s = t.get()[0];
    for (const [i, c] of s) {
      const [u, b] = e(i, c, o);
      n.setKeyDefer(u, b);
    }
    n.get();
  }), n;
}
function De(t, r) {
  const e = A();
  return t.subscribe((n) => {
    const o = r(n);
    for (const [s, i] of o)
      e.setKeyDefer(s, i);
    e.get();
  }), e;
}
function Me(t, r) {
  const e = S(void 0);
  return t.subscribeKey(r, (n) => e.set(n)), e;
}
function Ce(t, r, e) {
  return (...n) => {
    let o = e(...n);
    return r.set(o);
  };
}
function ne(t, r, e, n) {
  return (...o) => {
    const [s, i] = (e == null ? void 0 : e.get()) ?? [void 0, !1], c = n(s, ...o);
    return r.set(c);
  };
}
function Ie(t, r, e) {
  return ne(t, r, r, e);
}
const Be = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: Ce,
  compose: z,
  composeRead: re,
  compositeNode: Ae,
  dependentAction: ne,
  edge: ke,
  makeDeepNode: O,
  makeSelector: Te,
  makeShallow: te,
  mapEdge: De,
  mapKeyEdge: Me,
  mapNode: A,
  mapToMapEdge: Ke,
  node: S,
  selfAction: Ie,
  selfEdge: Ue,
  undefnode: Pe
}, Symbol.toStringTag, { value: "Module" })), Re = (t, r) => {
  for (const e in r)
    r[e].subscribe((n) => {
      n ? t.classList.add(e) : t.classList.remove(e);
    });
}, qe = (t, r) => {
  for (const e in r)
    r[e].subscribe((n) => {
      n !== void 0 && (n ? t.style.setProperty(e, n) : t.style.removeProperty(e));
    });
}, Fe = (t, r) => {
  r.subscribe((e) => {
    e !== void 0 && (t.textContent = e);
  });
}, Le = (t, r) => {
  r.subscribe((e) => {
    console.log(t, t.classList), e !== void 0 && (t.style.display = e ? "" : "none", t.classList.contains("hidden") && e && t.classList.remove("hidden"));
  });
}, Ye = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  classMap: Re,
  show: Le,
  style: qe,
  text: Fe
}, Symbol.toStringTag, { value: "Module" })), Ve = (t, r, e = 1) => Array.from(
  { length: (r - t) / e + 1 },
  (n, o) => t + o * e
), Ne = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  arrayRange: Ve
}, Symbol.toStringTag, { value: "Module" }));
export {
  Ye as graphRender,
  Be as graphState,
  Ne as graphUtil
};
