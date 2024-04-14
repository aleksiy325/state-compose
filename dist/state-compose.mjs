var q = function(t, r) {
  return q = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, n) {
    e.__proto__ = n;
  } || function(e, n) {
    for (var o in n)
      Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
  }, q(t, r);
};
function j(t, r) {
  if (typeof r != "function" && r !== null)
    throw new TypeError("Class extends value " + String(r) + " is not a constructor or null");
  q(t, r);
  function e() {
    this.constructor = t;
  }
  t.prototype = r === null ? Object.create(r) : (e.prototype = r.prototype, new e());
}
function L(t) {
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
function V(t, r) {
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
function z(t, r, e) {
  if (e || arguments.length === 2)
    for (var n = 0, o = r.length, s; n < o; n++)
      (s || !(n in r)) && (s || (s = Array.prototype.slice.call(r, 0, n)), s[n] = r[n]);
  return t.concat(s || Array.prototype.slice.call(r));
}
function w(t) {
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
function B(t, r) {
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
            for (var c = L(i), a = c.next(); !a.done; a = c.next()) {
              var d = a.value;
              d.remove(this);
            }
          } catch (v) {
            r = { error: v };
          } finally {
            try {
              a && !a.done && (e = c.return) && e.call(c);
            } finally {
              if (r)
                throw r.error;
            }
          }
        else
          i.remove(this);
      var p = this.initialTeardown;
      if (w(p))
        try {
          p();
        } catch (v) {
          s = v instanceof I ? v.errors : [v];
        }
      var l = this._finalizers;
      if (l) {
        this._finalizers = null;
        try {
          for (var h = L(l), m = h.next(); !m.done; m = h.next()) {
            var S = m.value;
            try {
              W(S);
            } catch (v) {
              s = s ?? [], v instanceof I ? s = z(z([], V(s)), V(v.errors)) : s.push(v);
            }
          }
        } catch (v) {
          n = { error: v };
        } finally {
          try {
            m && !m.done && (o = h.return) && o.call(h);
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
    e === r ? this._parentage = null : Array.isArray(e) && B(e, r);
  }, t.prototype.remove = function(r) {
    var e = this._finalizers;
    e && B(e, r), r instanceof t && r._removeParent(this);
  }, t.EMPTY = function() {
    var r = new t();
    return r.closed = !0, r;
  }(), t;
}(), te = K.EMPTY;
function re(t) {
  return t instanceof K || t && "closed" in t && w(t.remove) && w(t.add) && w(t.unsubscribe);
}
function W(t) {
  w(t) ? t() : t.unsubscribe();
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
    return setTimeout.apply(void 0, z([t, r], V(e)));
  },
  clearTimeout: function(t) {
    var r = oe.delegate;
    return ((r == null ? void 0 : r.clearTimeout) || clearTimeout)(t);
  },
  delegate: void 0
};
function ae(t) {
  oe.setTimeout(function() {
    throw t;
  });
}
function J() {
}
function k(t) {
  t();
}
var N = function(t) {
  j(r, t);
  function r(e) {
    var n = t.call(this) || this;
    return n.isStopped = !1, e ? (n.destination = e, re(e) && e.add(n)) : n.destination = he, n;
  }
  return r.create = function(e, n, o) {
    return new Y(e, n, o);
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
        U(n);
      }
  }, t.prototype.error = function(r) {
    var e = this.partialObserver;
    if (e.error)
      try {
        e.error(r);
      } catch (n) {
        U(n);
      }
    else
      U(r);
  }, t.prototype.complete = function() {
    var r = this.partialObserver;
    if (r.complete)
      try {
        r.complete();
      } catch (e) {
        U(e);
      }
  }, t;
}(), Y = function(t) {
  j(r, t);
  function r(e, n, o) {
    var s = t.call(this) || this, i;
    if (w(e) || !e)
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
function U(t) {
  ae(t);
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
    var o = this, s = me(r) ? r : new Y(r, e, n);
    return k(function() {
      var i = o, c = i.operator, a = i.source;
      s.add(c ? c.call(s, a) : a ? o._subscribe(s) : o._trySubscribe(s));
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
      var i = new Y({
        next: function(c) {
          try {
            r(c);
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
  return t && w(t.next) && w(t.error) && w(t.complete);
}
function me(t) {
  return t && t instanceof N || ge(t) && re(t);
}
function _e(t) {
  return w(t == null ? void 0 : t.lift);
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
  j(r, t);
  function r(e, n, o, s, i, c) {
    var a = t.call(this, e) || this;
    return a.onFinalize = i, a.shouldUnsubscribe = c, a._next = n ? function(d) {
      try {
        n(d);
      } catch (p) {
        e.error(p);
      }
    } : t.prototype._next, a._error = s ? function(d) {
      try {
        s(d);
      } catch (p) {
        e.error(p);
      } finally {
        this.unsubscribe();
      }
    } : t.prototype._error, a._complete = o ? function() {
      try {
        o();
      } catch (d) {
        e.error(d);
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
}(N), Ae = ee(function(t) {
  return function() {
    t(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed";
  };
}), se = function(t) {
  j(r, t);
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
    k(function() {
      var o, s;
      if (n._throwIfClosed(), !n.isStopped) {
        n.currentObservers || (n.currentObservers = Array.from(n.observers));
        try {
          for (var i = L(n.currentObservers), c = i.next(); !c.done; c = i.next()) {
            var a = c.value;
            a.next(e);
          }
        } catch (d) {
          o = { error: d };
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
    k(function() {
      if (n._throwIfClosed(), !n.isStopped) {
        n.hasError = n.isStopped = !0, n.thrownError = e;
        for (var o = n.observers; o.length; )
          o.shift().error(e);
      }
    });
  }, r.prototype.complete = function() {
    var e = this;
    k(function() {
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
      n.currentObservers = null, B(c, e);
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
  j(r, t);
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
  j(r, t);
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
const F = (t, r) => t === r;
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
function Te(t) {
  return typeof t == "object" && t !== null && !ie(t);
}
function Ue(t) {
  return t instanceof Map;
}
function ce(t, r = F) {
  return {
    value: t,
    isEqual: r,
    type: "shallow"
  };
}
function x(t, r = F) {
  if (r == F && !Pe(t))
    throw Error(
      "Node requires a primitive value or a custom isEqual to be supplied. Use makeShallow to provide a custom equals func for deep objects. Got: " + t
    );
  let e = t, n = !1, o = t;
  const s = new $(t), i = s.asObservable(), c = (y) => {
    s.next(y);
  }, a = () => {
    let y = !1;
    return n && !r(o, e) && (o = e, n = !1, y = !0, c(o)), [o, y];
  }, d = (y) => (e = y, n = !0, a), p = (y) => {
    let [_, P] = d(y)();
    return P;
  }, l = (y, _ = !1) => (a(), _ ? i.pipe(H(1)).subscribe(y) : i.subscribe(y));
  return {
    get: a,
    set: p,
    setDefer: d,
    subscribe: l,
    edge: (y, _) => T(a, l, y, _),
    action: (y, _) => C(y, p, _),
    dependentAction: (y, _, P) => O(y, p, _.get, P),
    selfAction: (y, _) => O(y, p, a, _)
  };
}
const ke = x(void 0);
function ue(t) {
  let r = !1;
  const e = t, n = () => {
    const l = {};
    let h = !1;
    for (const m in e) {
      let [S, v] = e[m].get();
      l[m] = S, h = h || v;
    }
    return [l, h];
  }, o = new $(n()[0]), s = o.asObservable(), i = (l) => {
    o.next(l);
  }, c = () => {
    r = !0;
    const [l, h] = n();
    return h && i(l), r = !1, [l, h];
  };
  for (const l in e)
    e[l].subscribe((h) => {
      if (!r) {
        let [m, S] = c();
        S || i(m);
      }
    });
  const a = (l, h = !1) => (c(), h ? s.pipe(H(1)).subscribe(l) : s.subscribe(l));
  return {
    decompose: () => e,
    get: c,
    subscribe: a,
    edge: (l, h) => T(c, a, l, h)
  };
}
function G(t) {
  const r = ue(t), e = t, n = (p) => {
    for (const l in p)
      e[l] === void 0 && (e[l] = A(p[l])), e[l].setDefer(p[l]);
    for (const l in e)
      (p === void 0 || p[l] === void 0) && delete e[l];
    return r.get;
  }, o = (p) => {
    let [l, h] = n(p)();
    return h;
  }, s = () => e, i = (p, l) => T(r.get, r.subscribe, p, l), c = (p, l) => C(p, o, l), a = (p, l, h) => O(p, o, l.get, h), d = (p, l) => O(p, o, r.get, l);
  return {
    decompose: s,
    get: r.get,
    subscribe: r.subscribe,
    setDefer: n,
    set: o,
    edge: i,
    action: c,
    dependentAction: a,
    selfAction: d
  };
}
function Ke(t) {
  const r = {};
  for (const e in t)
    r[e] = A(t[e]);
  return G(r);
}
function D(t, r) {
  const e = /* @__PURE__ */ new Map();
  let n = !1;
  const o = () => {
    const u = /* @__PURE__ */ new Map();
    let f = !1;
    for (const [b, g] of e) {
      let [E, M] = g.get();
      E !== void 0 && u.set(b, E), f = f || M;
    }
    return [u, f];
  }, s = new $(o()[0]), i = s.asObservable(), c = (u) => {
    s.next(u);
  };
  let a = [
    () => {
      if (!n) {
        let [u, f] = d();
        f || c(u);
      }
    }
  ];
  const d = () => {
    n = !0;
    const [u, f] = o();
    return f && c(u), n = !1, [u, f];
  }, p = (u) => {
    var f;
    return e.has(u) || l(u, t(u))(), (f = e.get(u)) == null ? void 0 : f.get();
  }, l = (u, f) => {
    var b;
    if (!e.has(u)) {
      console.log(t);
      const g = A(t(u));
      a.forEach((E) => {
        g.subscribe(
          (M) => E(u, M),
          /*skipInitialNotify=*/
          !0
        );
      }), e.set(u, g);
    }
    return (b = e.get(u)) == null ? void 0 : b.setDefer(f);
  }, h = (u) => {
    var f;
    for (const [b, g] of e)
      u.has(b) || (f = e.get(b)) == null || f.setDefer(t(b)), e.delete(b);
    for (const [b, g] of u.entries())
      l(b, g);
    return d;
  }, m = (u, f) => {
    let [b, g] = l(u, f)();
    return g;
  }, S = (u) => {
    let [f, b] = h(u)();
    return b;
  }, v = (u, f = !1) => (d(), f && i.pipe(H(1)).subscribe(u), i.subscribe(u)), y = (u) => {
    const f = e.get(u);
    if (f !== void 0)
      return f;
    {
      const b = A(t(u));
      return e.set(u, b), a.forEach((g) => {
        b.subscribe(
          (E) => g(u, E),
          /*skipInitialNotify*/
          !0
        );
      }), b;
    }
  }, _ = (u, f, b = !1) => {
    var g;
    (g = y(u)) == null || g.subscribe(f, b);
  }, P = (u, f = !1) => {
    a.push(u);
    for (const [b, g] of e)
      g.subscribe((E) => u(b, E), f);
  };
  return r == null || r.forEach((u, f) => {
    m(f, u);
  }), {
    get: d,
    setKeyDefer: l,
    setKey: m,
    getKey: p,
    setDefer: h,
    set: S,
    getKeyNode: y,
    subscribeKey: _,
    subscribeKeys: P,
    subscribe: v,
    decompose: () => e,
    edge: (u, f) => T(d, v, u, f),
    action: (u, f) => C(u, S, f),
    dependentAction: (u, f, b) => O(u, S, f.get, b),
    selfAction: (u, f) => O(u, S, d, f),
    defaultFactory: t
  };
}
function A(t) {
  if (je(t))
    return x(
      t.value,
      t.isEqual
    );
  if (Ue(t))
    return D(() => {
    }, t);
  if (ie(t))
    return x(
      t,
      (r, e) => xe(r, e)
    );
  if (Te(t)) {
    let r = {};
    const e = t;
    for (const n in e)
      r[n] = A(e[n]);
    return G(r);
  }
  return x(t);
}
function T(t, r, e, n) {
  const [o, s] = t(), i = e(o), c = n == null ? i : ce(i, n), a = A(c);
  return r((d) => a.set(e(d)), !0), a;
}
function De(t, r, e) {
  return T(t.get, t.subscribe, r, e);
}
function Ce(t, r) {
  return (...e) => r(t.get()[0], ...e);
}
function Me(t, r, e) {
  const n = A(t);
  return r.subscribe((o) => {
    let s = !0;
    do {
      const [i, c] = n.get(), a = e({ self: i, read: o });
      s = n.set(a);
    } while (s);
  }), n;
}
function Ie(t, r, e) {
  const o = D((s) => {
    const [i, c] = r.get();
    return e(s, t.defaultFactory(s), i)[1];
  });
  return t.subscribeKeys((s, i) => {
    const [c, a] = r.get(), [d, p] = e(s, i, c);
    o.setKey(d, p);
  }), r.subscribe((s) => {
    const i = t.get()[0];
    for (const [c, a] of i) {
      const [d, p] = e(c, a, s);
      o.setKeyDefer(d, p);
    }
    o.get();
  }), o;
}
function Re(t, r, e) {
  const n = D(e);
  return t.subscribe((o) => {
    const s = r(o);
    for (const [i, c] of s)
      n.setKeyDefer(i, c);
    n.get();
  }), n;
}
function qe(t, r) {
  const e = x(void 0);
  return t.subscribeKey(r, (n) => e.set(n)), e;
}
function C(t, r, e) {
  return (...n) => {
    let o = e(...n);
    return r(o);
  };
}
function Le(t, r, e) {
  return C(t, r.set, e);
}
function O(t, r, e, n) {
  return (...o) => {
    const [s, i] = e();
    let c = n(s, ...o);
    return r(c);
  };
}
function le(t, r, e, n) {
  return O(t, r.set, e.get, n);
}
function Ve(t, r, e) {
  return le(t, r, r, e);
}
const Qe = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: Le,
  compose: G,
  composeRead: ue,
  compositeNode: Ke,
  dependentAction: le,
  edge: De,
  makeDeepNode: A,
  makeSelector: Ce,
  makeShallow: ce,
  mapEdge: Re,
  mapKeyEdge: qe,
  mapNode: D,
  mapToMapEdge: Ie,
  node: x,
  selfAction: Ve,
  selfEdge: Me,
  undefnode: ke
}, Symbol.toStringTag, { value: "Module" })), ze = (t, r) => {
  for (const e in r)
    r[e].subscribe((n) => {
      n ? t.classList.add(e) : t.classList.remove(e);
    });
}, Be = (t, r) => {
  for (const e in r)
    r[e].subscribe((n) => {
      n !== void 0 && (n ? t.style.setProperty(e, n) : t.style.removeProperty(e));
    });
}, Ye = (t, r) => {
  r.subscribe((e) => {
    e !== void 0 && (t.textContent = e);
  });
}, Fe = (t, r) => {
  r.subscribe((e) => {
    console.log(t, t.classList), e !== void 0 && (t.style.display = e ? "" : "none", t.classList.contains("hidden") && e && t.classList.remove("hidden"));
  });
}, Xe = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  classMap: ze,
  show: Fe,
  style: Be,
  text: Ye
}, Symbol.toStringTag, { value: "Module" })), Ne = (t, r, e = 1) => Array.from(
  { length: (r - t) / e + 1 },
  (n, o) => t + o * e
), Ze = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  arrayRange: Ne
}, Symbol.toStringTag, { value: "Module" }));
export {
  Xe as graphRender,
  Qe as graphState,
  Ze as graphUtil
};
