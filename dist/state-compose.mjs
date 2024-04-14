var q = function(t, r) {
  return q = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, n) {
    e.__proto__ = n;
  } || function(e, n) {
    for (var o in n)
      Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
  }, q(t, r);
};
function x(t, r) {
  if (typeof r != "function" && r !== null)
    throw new TypeError("Class extends value " + String(r) + " is not a constructor or null");
  q(t, r);
  function e() {
    this.constructor = t;
  }
  t.prototype = r === null ? Object.create(r) : (e.prototype = r.prototype, new e());
}
function F(t) {
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
function L(t, r) {
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
function V(t, r, e) {
  if (e || arguments.length === 2)
    for (var n = 0, o = r.length, s; n < o; n++)
      (s || !(n in r)) && (s || (s = Array.prototype.slice.call(r, 0, n)), s[n] = r[n]);
  return t.concat(s || Array.prototype.slice.call(r));
}
function S(t) {
  return typeof t == "function";
}
function ee(t) {
  var r = function(n) {
    Error.call(n), n.stack = new Error().stack;
  }, e = t(r);
  return e.prototype = Object.create(Error.prototype), e.prototype.constructor = e, e;
}
var I = ee(function(t) {
  return function(e) {
    t(this), this.message = e ? e.length + ` errors occurred during unsubscription:
` + e.map(function(n, o) {
      return o + 1 + ") " + n.toString();
    }).join(`
  `) : "", this.name = "UnsubscriptionError", this.errors = e;
  };
});
function z(t, r) {
  if (t) {
    var e = t.indexOf(r);
    0 <= e && t.splice(e, 1);
  }
}
var K = function() {
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
            for (var c = F(i), u = c.next(); !u.done; u = c.next()) {
              var h = u.value;
              h.remove(this);
            }
          } catch (v) {
            r = { error: v };
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
      var p = this.initialTeardown;
      if (S(p))
        try {
          p();
        } catch (v) {
          s = v instanceof I ? v.errors : [v];
        }
      var l = this._finalizers;
      if (l) {
        this._finalizers = null;
        try {
          for (var d = F(l), g = d.next(); !g.done; g = d.next()) {
            var w = g.value;
            try {
              W(w);
            } catch (v) {
              s = s ?? [], v instanceof I ? s = V(V([], L(s)), L(v.errors)) : s.push(v);
            }
          }
        } catch (v) {
          n = { error: v };
        } finally {
          try {
            g && !g.done && (o = d.return) && o.call(d);
          } finally {
            if (n)
              throw n.error;
          }
        }
      }
      if (s)
        throw new I(s);
    }
  }, t.prototype.add = function(r) {
    var e;
    if (r && r !== this)
      if (this.closed)
        W(r);
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
    e === r ? this._parentage = null : Array.isArray(e) && z(e, r);
  }, t.prototype.remove = function(r) {
    var e = this._finalizers;
    e && z(e, r), r instanceof t && r._removeParent(this);
  }, t.EMPTY = function() {
    var r = new t();
    return r.closed = !0, r;
  }(), t;
}(), te = K.EMPTY;
function re(t) {
  return t instanceof K || t && "closed" in t && S(t.remove) && S(t.add) && S(t.unsubscribe);
}
function W(t) {
  S(t) ? t() : t.unsubscribe();
}
var ne = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1
}, oe = {
  setTimeout: function(t, r) {
    for (var e = [], n = 2; n < arguments.length; n++)
      e[n - 2] = arguments[n];
    return setTimeout.apply(void 0, V([t, r], L(e)));
  },
  clearTimeout: function(t) {
    var r = oe.delegate;
    return ((r == null ? void 0 : r.clearTimeout) || clearTimeout)(t);
  },
  delegate: void 0
};
function le(t) {
  oe.setTimeout(function() {
    throw t;
  });
}
function J() {
}
function U(t) {
  t();
}
var N = function(t) {
  x(r, t);
  function r(e) {
    var n = t.call(this) || this;
    return n.isStopped = !1, e ? (n.destination = e, re(e) && e.add(n)) : n.destination = he, n;
  }
  return r.create = function(e, n, o) {
    return new B(e, n, o);
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
}(K), fe = Function.prototype.bind;
function R(t, r) {
  return fe.call(t, r);
}
var pe = function() {
  function t(r) {
    this.partialObserver = r;
  }
  return t.prototype.next = function(r) {
    var e = this.partialObserver;
    if (e.next)
      try {
        e.next(r);
      } catch (n) {
        T(n);
      }
  }, t.prototype.error = function(r) {
    var e = this.partialObserver;
    if (e.error)
      try {
        e.error(r);
      } catch (n) {
        T(n);
      }
    else
      T(r);
  }, t.prototype.complete = function() {
    var r = this.partialObserver;
    if (r.complete)
      try {
        r.complete();
      } catch (e) {
        T(e);
      }
  }, t;
}(), B = function(t) {
  x(r, t);
  function r(e, n, o) {
    var s = t.call(this) || this, i;
    if (S(e) || !e)
      i = {
        next: e ?? void 0,
        error: n ?? void 0,
        complete: o ?? void 0
      };
    else {
      var c;
      s && ne.useDeprecatedNextContext ? (c = Object.create(e), c.unsubscribe = function() {
        return s.unsubscribe();
      }, i = {
        next: e.next && R(e.next, c),
        error: e.error && R(e.error, c),
        complete: e.complete && R(e.complete, c)
      }) : i = e;
    }
    return s.destination = new pe(i), s;
  }
  return r;
}(N);
function T(t) {
  le(t);
}
function de(t) {
  throw t;
}
var he = {
  closed: !0,
  next: J,
  error: de,
  complete: J
}, be = function() {
  return typeof Symbol == "function" && Symbol.observable || "@@observable";
}();
function ye(t) {
  return t;
}
function ve(t) {
  return t.length === 0 ? ye : t.length === 1 ? t[0] : function(e) {
    return t.reduce(function(n, o) {
      return o(n);
    }, e);
  };
}
var Q = function() {
  function t(r) {
    r && (this._subscribe = r);
  }
  return t.prototype.lift = function(r) {
    var e = new t();
    return e.source = this, e.operator = r, e;
  }, t.prototype.subscribe = function(r, e, n) {
    var o = this, s = me(r) ? r : new B(r, e, n);
    return U(function() {
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
    return e = X(e), new e(function(o, s) {
      var i = new B({
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
  }, t.prototype[be] = function() {
    return this;
  }, t.prototype.pipe = function() {
    for (var r = [], e = 0; e < arguments.length; e++)
      r[e] = arguments[e];
    return ve(r)(this);
  }, t.prototype.toPromise = function(r) {
    var e = this;
    return r = X(r), new r(function(n, o) {
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
function X(t) {
  var r;
  return (r = t ?? ne.Promise) !== null && r !== void 0 ? r : Promise;
}
function ge(t) {
  return t && S(t.next) && S(t.error) && S(t.complete);
}
function me(t) {
  return t && t instanceof N || ge(t) && re(t);
}
function _e(t) {
  return S(t == null ? void 0 : t.lift);
}
function Se(t) {
  return function(r) {
    if (_e(r))
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
function we(t, r, e, n, o) {
  return new Ee(t, r, e, n, o);
}
var Ee = function(t) {
  x(r, t);
  function r(e, n, o, s, i, c) {
    var u = t.call(this, e) || this;
    return u.onFinalize = i, u.shouldUnsubscribe = c, u._next = n ? function(h) {
      try {
        n(h);
      } catch (p) {
        e.error(p);
      }
    } : t.prototype._next, u._error = s ? function(h) {
      try {
        s(h);
      } catch (p) {
        e.error(p);
      } finally {
        this.unsubscribe();
      }
    } : t.prototype._error, u._complete = o ? function() {
      try {
        o();
      } catch (h) {
        e.error(h);
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
}(N), Ae = ee(function(t) {
  return function() {
    t(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed";
  };
}), se = function(t) {
  x(r, t);
  function r() {
    var e = t.call(this) || this;
    return e.closed = !1, e.currentObservers = null, e.observers = [], e.isStopped = !1, e.hasError = !1, e.thrownError = null, e;
  }
  return r.prototype.lift = function(e) {
    var n = new Z(this, this);
    return n.operator = e, n;
  }, r.prototype._throwIfClosed = function() {
    if (this.closed)
      throw new Ae();
  }, r.prototype.next = function(e) {
    var n = this;
    U(function() {
      var o, s;
      if (n._throwIfClosed(), !n.isStopped) {
        n.currentObservers || (n.currentObservers = Array.from(n.observers));
        try {
          for (var i = F(n.currentObservers), c = i.next(); !c.done; c = i.next()) {
            var u = c.value;
            u.next(e);
          }
        } catch (h) {
          o = { error: h };
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
    U(function() {
      if (n._throwIfClosed(), !n.isStopped) {
        n.hasError = n.isStopped = !0, n.thrownError = e;
        for (var o = n.observers; o.length; )
          o.shift().error(e);
      }
    });
  }, r.prototype.complete = function() {
    var e = this;
    U(function() {
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
    return s || i ? te : (this.currentObservers = null, c.push(e), new K(function() {
      n.currentObservers = null, z(c, e);
    }));
  }, r.prototype._checkFinalizedStatuses = function(e) {
    var n = this, o = n.hasError, s = n.thrownError, i = n.isStopped;
    o ? e.error(s) : i && e.complete();
  }, r.prototype.asObservable = function() {
    var e = new Q();
    return e.source = this, e;
  }, r.create = function(e, n) {
    return new Z(e, n);
  }, r;
}(Q), Z = function(t) {
  x(r, t);
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
    return (o = (n = this.source) === null || n === void 0 ? void 0 : n.subscribe(e)) !== null && o !== void 0 ? o : te;
  }, r;
}(se), $ = function(t) {
  x(r, t);
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
}(se);
function Oe(t, r) {
  return Se(function(e, n) {
    var o = 0;
    e.subscribe(we(n, function(s) {
      return t.call(r, s, o++) && n.next(s);
    }));
  });
}
function H(t) {
  return Oe(function(r, e) {
    return t <= e;
  });
}
const Y = (t, r) => t === r;
function xe(t, r) {
  if (t.length !== r.length)
    return !1;
  for (let e = 0; e < t.length; e++)
    if (t[e] !== r[e])
      return !1;
  return !0;
}
function je(t) {
  return typeof t == "object" && t !== null && "value" in t && "isEqual" in t && typeof t.isEqual == "function" && "type" in t && t.type === "shallow";
}
function Pe(t) {
  return t === null || typeof t == "string" || typeof t == "number" || typeof t == "boolean" || typeof t == "bigint" || typeof t == "symbol" || typeof t > "u";
}
function ie(t) {
  return Array.isArray(t);
}
function ke(t) {
  return typeof t == "object" && t !== null && !ie(t);
}
function Te(t) {
  return t instanceof Map;
}
function ce(t, r = Y) {
  return {
    value: t,
    isEqual: r,
    type: "shallow"
  };
}
function A(t, r = Y) {
  if (r == Y && !Pe(t))
    throw Error(
      "Node requires a primitive value or a custom isEqual to be supplied. Use makeShallow to provide a custom equals func for deep objects. Got: " + t
    );
  let e = t, n = !1, o = t;
  const s = new $(t), i = s.asObservable(), c = (y) => {
    s.next(y);
  }, u = () => {
    let y = !1;
    return n && !r(o, e) && (o = e, n = !1, y = !0, c(o)), [o, y];
  }, h = (y) => (e = y, n = !0, u), p = (y) => {
    let [_, k] = h(y)();
    return k;
  }, l = (y, _ = !1) => (u(), _ ? i.pipe(H(1)).subscribe(y) : i.subscribe(y));
  return {
    get: u,
    set: p,
    setDefer: h,
    subscribe: l,
    edge: (y, _) => P(u, l, y, _),
    action: (y, _) => M(y, p, _),
    dependentAction: (y, _, k) => O(y, p, _.get, k),
    selfAction: (y, _) => O(y, p, u, _)
  };
}
const Ue = A(void 0);
function ue(t) {
  let r = !1;
  const e = t, n = () => {
    const l = {};
    let d = !1;
    for (const g in e) {
      let [w, v] = e[g].get();
      l[g] = w, d = d || v;
    }
    return [l, d];
  }, o = new $(n()[0]), s = o.asObservable(), i = (l) => {
    o.next(l);
  }, c = () => {
    r = !0;
    const [l, d] = n();
    return d && i(l), r = !1, [l, d];
  };
  for (const l in e)
    e[l].subscribe((d) => {
      if (!r) {
        let [g, w] = c();
        w || i(g);
      }
    });
  const u = (l, d = !1) => (c(), d ? s.pipe(H(1)).subscribe(l) : s.subscribe(l));
  return {
    decompose: () => e,
    get: c,
    subscribe: u,
    edge: (l, d) => P(c, u, l, d)
  };
}
function G(t) {
  const r = ue(t), e = t, n = (p) => {
    for (const l in p)
      e[l] === void 0 && (e[l] = j(p[l])), e[l].setDefer(p[l]);
    for (const l in e)
      (p === void 0 || p[l] === void 0) && delete e[l];
    return r.get;
  }, o = (p) => {
    let [l, d] = n(p)();
    return d;
  }, s = () => e, i = (p, l) => P(r.get, r.subscribe, p, l), c = (p, l) => M(p, o, l), u = (p, l, d) => O(p, o, l.get, d), h = (p, l) => O(p, o, r.get, l);
  return {
    decompose: s,
    get: r.get,
    subscribe: r.subscribe,
    setDefer: n,
    set: o,
    edge: i,
    action: c,
    dependentAction: u,
    selfAction: h
  };
}
function Ke(t) {
  const r = {};
  for (const e in t)
    r[e] = j(t[e]);
  return G(r);
}
function D(t) {
  const r = /* @__PURE__ */ new Map();
  let e = !1;
  const n = () => {
    const a = /* @__PURE__ */ new Map();
    let f = !1;
    for (const [b, m] of r) {
      let [E, C] = m.get();
      E !== void 0 && a.set(b, E), f = f || C;
    }
    return [a, f];
  }, o = new $(n()[0]), s = o.asObservable(), i = (a) => {
    o.next(a);
  };
  let c = [
    () => {
      if (!e) {
        let [a, f] = u();
        f || i(a);
      }
    }
  ];
  const u = () => {
    e = !0;
    const [a, f] = n();
    return f && i(a), e = !1, [a, f];
  }, h = (a) => {
    var f;
    return r.has(a) ? (f = r.get(a)) == null ? void 0 : f.get() : [void 0, !1];
  }, p = (a, f) => {
    var b;
    if (!r.has(a)) {
      const m = A(void 0);
      c.forEach((E) => {
        m.subscribe(
          (C) => E(a, C),
          /*skipInitialNotify=*/
          !0
        );
      }), r.set(a, m);
    }
    return (b = r.get(a)) == null ? void 0 : b.setDefer(f);
  }, l = (a) => {
    var f;
    for (const [b, m] of r)
      a.has(b) || (f = r.get(b)) == null || f.setDefer(void 0), r.delete(b);
    for (const [b, m] of a.entries())
      p(b, m);
    return u;
  }, d = (a, f) => {
    let [b, m] = p(a, f)();
    return m;
  }, g = (a) => {
    let [f, b] = l(a)();
    return b;
  }, w = (a, f = !1) => (u(), f && s.pipe(H(1)).subscribe(a), s.subscribe(a)), v = (a) => {
    const f = r.get(a);
    if (f !== void 0)
      return f;
    {
      const b = A(void 0);
      return r.set(a, b), c.forEach((m) => {
        b.subscribe(
          (E) => m(a, E),
          /*skipInitialNotify*/
          !0
        );
      }), b;
    }
  }, y = (a, f, b = !1) => {
    var m;
    (m = v(a)) == null || m.subscribe(f, b);
  }, _ = (a, f = !1) => {
    c.push(a);
    for (const [b, m] of r)
      m.subscribe((E) => a(b, E), f);
  };
  return t == null || t.forEach((a, f) => {
    d(f, a);
  }), {
    get: u,
    setKeyDefer: p,
    setKey: d,
    getKey: h,
    setDefer: l,
    set: g,
    getKeyNode: v,
    subscribeKey: y,
    subscribeKeys: _,
    subscribe: w,
    decompose: () => r,
    edge: (a, f) => P(u, w, a, f),
    action: (a, f) => M(a, g, f),
    dependentAction: (a, f, b) => O(a, g, f.get, b),
    selfAction: (a, f) => O(a, g, u, f)
  };
}
function j(t) {
  if (je(t))
    return A(
      t.value,
      t.isEqual
    );
  if (Te(t))
    return D(t);
  if (ie(t))
    return A(
      t,
      (r, e) => xe(r, e)
    );
  if (ke(t)) {
    let r = {};
    const e = t;
    for (const n in e)
      r[n] = j(e[n]);
    return G(r);
  }
  return A(t);
}
function P(t, r, e, n) {
  const [o, s] = t(), i = e(o), c = n == null ? i : ce(i, n), u = j(c);
  return r((h) => u.set(e(h)), !0), u;
}
function De(t, r, e) {
  return P(t.get, t.subscribe, r, e);
}
function Me(t, r) {
  return (...e) => r(t.get()[0], ...e);
}
function Ce(t, r, e) {
  const n = j(t);
  return r.subscribe((o) => {
    let s = !0;
    do {
      const [i, c] = n.get(), u = e({ self: i, read: o });
      s = n.set(u);
    } while (s);
  }), n;
}
function Ie(t, r, e) {
  const n = D();
  return t.subscribeKeys((o, s) => {
    const [i, c] = r.get(), [u, h] = e(o, s, i);
    n.setKey(u, h);
  }), r.subscribe((o) => {
    const s = t.get()[0];
    for (const [i, c] of s) {
      const [u, h] = e(i, c, o);
      n.setKeyDefer(u, h);
    }
    n.get();
  }), n;
}
function Re(t, r) {
  const e = D();
  return t.subscribe((n) => {
    const o = r(n);
    for (const [s, i] of o)
      e.setKeyDefer(s, i);
    e.get();
  }), e;
}
function qe(t, r) {
  const e = A(void 0);
  return t.subscribeKey(r, (n) => e.set(n)), e;
}
function M(t, r, e) {
  return (...n) => {
    let o = e(...n);
    return r(o);
  };
}
function Fe(t, r, e) {
  return M(t, r.set, e);
}
function O(t, r, e, n) {
  return (...o) => {
    const [s, i] = e();
    let c = n(s, ...o);
    return r(c);
  };
}
function ae(t, r, e, n) {
  return O(t, r.set, e.get, n);
}
function Le(t, r, e) {
  return ae(t, r, r, e);
}
const Je = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: Fe,
  compose: G,
  composeRead: ue,
  compositeNode: Ke,
  dependentAction: ae,
  edge: De,
  makeDeepNode: j,
  makeSelector: Me,
  makeShallow: ce,
  mapEdge: Re,
  mapKeyEdge: qe,
  mapNode: D,
  mapToMapEdge: Ie,
  node: A,
  selfAction: Le,
  selfEdge: Ce,
  undefnode: Ue
}, Symbol.toStringTag, { value: "Module" })), Ve = (t, r) => {
  for (const e in r)
    r[e].subscribe((n) => {
      n ? t.classList.add(e) : t.classList.remove(e);
    });
}, ze = (t, r) => {
  for (const e in r)
    r[e].subscribe((n) => {
      n !== void 0 && (n ? t.style.setProperty(e, n) : t.style.removeProperty(e));
    });
}, Be = (t, r) => {
  r.subscribe((e) => {
    e !== void 0 && (t.textContent = e);
  });
}, Ye = (t, r) => {
  r.subscribe((e) => {
    console.log(t, t.classList), e !== void 0 && (t.style.display = e ? "" : "none", t.classList.contains("hidden") && e && t.classList.remove("hidden"));
  });
}, Qe = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  classMap: Ve,
  show: Ye,
  style: ze,
  text: Be
}, Symbol.toStringTag, { value: "Module" })), Ne = (t, r, e = 1) => Array.from(
  { length: (r - t) / e + 1 },
  (n, o) => t + o * e
), Xe = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  arrayRange: Ne
}, Symbol.toStringTag, { value: "Module" }));
export {
  Qe as graphRender,
  Je as graphState,
  Xe as graphUtil
};
