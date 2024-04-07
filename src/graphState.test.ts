import { expect, test } from "vitest";
import {
  node,
  compositeNode,
  mapNode,
  compose,
  edge,
  mapToMapEdge,
  action,
  makeDeepNode,
  mapEdge,
  dependentAction,
  selfEdge,
  undefnode,
} from "./graphState";
import { arrayRange } from "./utils";

test("node counter", () => {
  let subscribeValues1: number[] = [];
  let subscribeValues2: number[] = [];
  let $counter = node(0);

  $counter.subscribe(val => {
    subscribeValues1.push(val);
  });

  $counter.subscribe(val => {
    subscribeValues2.push(val);
  });

  expect($counter.get()).toStrictEqual([0, false]);

  expect($counter.set(1)).toStrictEqual(true);
  expect($counter.get()).toStrictEqual([1, false]);

  expect($counter.set(1)).toStrictEqual(false); // no change
  expect($counter.get()).toStrictEqual([1, false]);

  expect($counter.set(2)).toStrictEqual(true);
  expect($counter.get()).toStrictEqual([2, false]);

  // sub should instantly notify.
  expect(subscribeValues1).toEqual([0, 1, 2]);
  expect(subscribeValues2).toEqual([0, 1, 2]);
});

test("node undefined", () => {
  let subscribeValues1: (number | undefined)[] = [];
  let $counter = node<number | undefined>(undefined);

  $counter.subscribe(val => {
    subscribeValues1.push(val);
  });

  expect($counter.get()).toStrictEqual([undefined, false]);

  expect($counter.set(1)).toStrictEqual(true);
  expect($counter.get()).toStrictEqual([1, false]);

  expect($counter.set(1)).toStrictEqual(false); // no change
  expect($counter.get()).toStrictEqual([1, false]);

  expect($counter.set(2)).toStrictEqual(true);
  expect($counter.get()).toStrictEqual([2, false]);

  // sub should instantly notify.
  expect(subscribeValues1).toEqual([undefined, 1, 2]);
});

test("simple node composite", () => {
  interface Composite {
    a: number;
    b: number;
  }

  const isEqual = (a: Composite, b: Composite) => a.a == b.a && a.b == b.b;

  let $composite = node<Composite>({ a: 1, b: 2 }, isEqual);

  let subscribeValues: Composite[] = [];
  $composite.subscribe(val => {
    subscribeValues.push(val);
  });

  expect($composite.get()).toMatchObject([{ a: 1, b: 2 }, false]);

  expect($composite.set({ a: 2, b: 2 })).toStrictEqual(true);
  expect($composite.get()).toMatchObject([{ a: 2, b: 2 }, false]);

  expect($composite.set({ a: 2, b: 2 })).toStrictEqual(false); // no change
  expect($composite.get()).toMatchObject([{ a: 2, b: 2 }, false]);

  expect($composite.set({ a: 3, b: 2 })).toStrictEqual(true);
  expect($composite.get()).toMatchObject([{ a: 3, b: 2 }, false]);

  // sub should instantly notify.
  expect(subscribeValues).toEqual([
    { a: 1, b: 2 },
    { a: 2, b: 2 },
    { a: 3, b: 2 },
  ]);
});

test("node counter defer", () => {
  let subscribeValues1: number[] = [];
  let $counter = node(0);

  $counter.subscribe(val => {
    subscribeValues1.push(val);
  });

  expect($counter.get()).toStrictEqual([0, false]);

  $counter.setDefer(1);
  $counter.setDefer(1); // no change
  $counter.setDefer(2);

  expect(subscribeValues1).toEqual([0]); // sub should instantly notify.
  expect($counter.get()).toStrictEqual([2, true]); // staged change applied
  expect(subscribeValues1).toEqual([0, 2]); // only last change is applied
  expect($counter.get()).toStrictEqual([2, false]); // staged change applied

  $counter.setDefer(2);
  expect($counter.get()).toStrictEqual([2, false]); // no change
});

// test("simpleNode fuzz test", () => {
//   // TODO: implement.
//   // Random updates and deletes deferred and undeffered should stream the same value for the subscriptions.
// });

test("compositeNode composite", () => {
  interface Composite {
    a: number;
    b: number;
  }

  let $composite = compositeNode<Composite>({ a: 1, b: 2 });

  let subscribeValues: Composite[] = [];
  $composite.subscribe(val => {
    subscribeValues.push(val);
  });

  let subscribeValuesA1: number[] = [];
  $composite.nodes.a.subscribe(val => {
    subscribeValuesA1.push(val);
  });

  let subscribeValuesA2: number[] = [];
  $composite.nodes.a.subscribe(val => {
    subscribeValuesA2.push(val);
  });

  let subscribeValuesB1: number[] = [];
  $composite.nodes.b.subscribe(val => {
    subscribeValuesB1.push(val);
  });

  let subscribeValuesB2: number[] = [];
  $composite.nodes.b.subscribe(val => {
    subscribeValuesB2.push(val);
  });

  expect($composite.get()).toMatchObject([{ a: 1, b: 2 }, false]);
  expect($composite.nodes.a.get()).toStrictEqual([1, false]);
  expect($composite.nodes.b.get()).toStrictEqual([2, false]);

  expect($composite.set({ a: 2, b: 2 })).toStrictEqual(true);
  expect($composite.get()).toMatchObject([{ a: 2, b: 2 }, false]);
  expect($composite.nodes.a.get()).toStrictEqual([2, false]);
  expect($composite.nodes.b.get()).toStrictEqual([2, false]);

  expect($composite.set({ a: 2, b: 2 })).toStrictEqual(false); // no change
  expect($composite.get()).toMatchObject([{ a: 2, b: 2 }, false]);
  expect($composite.nodes.a.get()).toStrictEqual([2, false]);
  expect($composite.nodes.b.get()).toStrictEqual([2, false]);

  expect($composite.set({ a: 3, b: 2 })).toStrictEqual(true);
  expect($composite.get()).toMatchObject([{ a: 3, b: 2 }, false]);
  expect($composite.nodes.a.get()).toStrictEqual([3, false]);
  expect($composite.nodes.b.get()).toStrictEqual([2, false]);

  expect(subscribeValues).toEqual([
    { a: 1, b: 2 },
    { a: 2, b: 2 },
    { a: 3, b: 2 },
  ]);

  expect(subscribeValuesA1).toEqual([1, 2, 3]);
  expect(subscribeValuesA2).toEqual([1, 2, 3]);

  // only initial value was notified. No more changes
  expect(subscribeValuesB1).toEqual([2]);
  expect(subscribeValuesB2).toEqual([2]);
});

test("compositeNode deferred", () => {
  interface Composite {
    a: number;
    b: number;
  }

  let $composite = compositeNode<Composite>({ a: 1, b: 1 });

  let subscribeValues: Composite[] = [];
  $composite.subscribe(val => {
    subscribeValues.push(val);
  });

  let subscribeValuesA: number[] = [];
  $composite.nodes.a.subscribe(val => {
    subscribeValuesA.push(val);
  });

  let subscribeValuesB: number[] = [];
  $composite.nodes.b.subscribe(val => {
    subscribeValuesB.push(val);
  });

  // Deferred changes are not applied until get is called.
  expect($composite.get()).toStrictEqual([{ a: 1, b: 1 }, false]);
  $composite.setDefer({ a: 2, b: 2 });
  $composite.setDefer({ a: 3, b: 3 });
  $composite.setDefer({ a: 4, b: 4 });

  // No changes should be notified.
  expect(subscribeValues).toEqual([{ a: 1, b: 1 }]);
  expect(subscribeValuesA).toEqual([1]);
  expect(subscribeValuesB).toEqual([1]);

  // Deferred changes are applied when get is called.
  expect($composite.get()).toStrictEqual([{ a: 4, b: 4 }, true]);
  expect(subscribeValues).toEqual([
    { a: 1, b: 1 },
    { a: 4, b: 4 },
  ]);
  expect(subscribeValuesA).toEqual([1, 4]);
  expect(subscribeValuesB).toEqual([1, 4]);
});

test("compositeNode deferred inner single", () => {
  interface Composite {
    a: number;
    b: number;
  }

  let $composite = compositeNode<Composite>({ a: 1, b: 1 });

  let subscribeValues: Composite[] = [];
  $composite.subscribe(val => {
    subscribeValues.push(val);
  });

  let subscribeValuesA: number[] = [];
  $composite.nodes.a.subscribe(val => {
    subscribeValuesA.push(val);
  });

  let subscribeValuesB: number[] = [];
  $composite.nodes.b.subscribe(val => {
    subscribeValuesB.push(val);
  });

  // Verify susbcriptions are notified of initial values.
  expect(subscribeValues).toEqual([{ a: 1, b: 1 }]);
  expect(subscribeValuesA).toEqual([1]);
  expect(subscribeValuesB).toEqual([1]);

  expect($composite.get()).toStrictEqual([{ a: 1, b: 1 }, false]);

  // Set inner nodes deferred.
  $composite.nodes.a.setDefer(2);

  $composite.nodes.a.setDefer(3);

  $composite.nodes.a.setDefer(4);

  // Verify no subscriptions are notified of deferred changes.
  expect(subscribeValues).toEqual([{ a: 1, b: 1 }]);
  expect(subscribeValuesA).toEqual([1]);
  expect(subscribeValuesB).toEqual([1]);

  // Deferred changes are applied when get is called on an dependent node.
  // The inner node in this case.
  expect($composite.nodes.a.get()).toStrictEqual([4, true]);

  expect(subscribeValues).toEqual([
    { a: 1, b: 1 },
    { a: 4, b: 1 },
  ]);

  expect(subscribeValuesA).toEqual([1, 4]);
  expect(subscribeValuesB).toEqual([1]);
});

test("compositeNode deferred inner nodes multiple", () => {
  interface Composite {
    a: number;
    b: number;
  }

  let $composite = compositeNode<Composite>({ a: 1, b: 1 });

  let subscribeValues: Composite[] = [];
  $composite.subscribe(val => {
    subscribeValues.push(val);
  });

  let subscribeValuesA: number[] = [];
  $composite.nodes.a.subscribe(val => {
    subscribeValuesA.push(val);
  });

  let subscribeValuesB: number[] = [];
  $composite.nodes.b.subscribe(val => {
    subscribeValuesB.push(val);
  });

  // Verify susbcriptions are notified of initial values.
  expect(subscribeValues).toEqual([{ a: 1, b: 1 }]);
  expect(subscribeValuesA).toEqual([1]);
  expect(subscribeValuesB).toEqual([1]);

  expect($composite.get()).toStrictEqual([{ a: 1, b: 1 }, false]);

  // Set inner nodes deferred.
  $composite.nodes.a.setDefer(2);
  $composite.nodes.b.setDefer(2);

  $composite.nodes.a.setDefer(3);
  $composite.nodes.b.setDefer(3);

  $composite.nodes.a.setDefer(4);
  $composite.nodes.b.setDefer(4);

  // Verify no subscriptions are notified of deferred changes.
  expect(subscribeValues).toEqual([{ a: 1, b: 1 }]);
  expect(subscribeValuesA).toEqual([1]);
  expect(subscribeValuesB).toEqual([1]);

  // Deferred changes are applied when get is called on an dependent node.
  // The inner node in this case.
  expect($composite.nodes.a.get()).toStrictEqual([4, true]);

  expect(subscribeValues).toEqual([
    { a: 1, b: 1 },
    { a: 4, b: 4 },
  ]);

  expect(subscribeValuesA).toEqual([1, 4]);
  expect(subscribeValuesB).toEqual([1, 4]);
});

test("compositeNode fuzz test", () => {
  // TODO: implement.
  // Random updates and deletes deferred and undeffered should stream the same value for the subscriptions.
});

test("mapNode empty single", () => {
  let $map = mapNode<number, string>();
  let subscribeValues: ReadonlyMap<number, string | undefined>[] = [];
  $map.subscribe(val => {
    subscribeValues.push(val);
  });

  expect($map.setKey(1, "one")).toBe(true);
  expect($map.get()).toEqual([new Map([[1, "one"]]), false]);

  expect(subscribeValues).toEqual([new Map(), new Map([[1, "one"]])]);
});

test("mapNode setKey", () => {
  let $map = mapNode<number, string>(
    new Map([
      [1, "one"],
      [2, "two"],
    ])
  );

  let subscribeValues: ReadonlyMap<number, string | undefined>[] = [];
  $map.subscribe(val => {
    subscribeValues.push(val);
  });

  let subscribeKeyValues: [number, string | undefined][] = [];
  $map.subscribeKeys((key, val) => {
    subscribeKeyValues.push([key, val]);
  });

  let unitializedSubscriptionThree: (string | undefined)[] = [];
  $map.subscribeKey(3, val => {
    unitializedSubscriptionThree.push(val);
  });

  expect($map.get()).toEqual([
    new Map([
      [1, "one"],
      [2, "two"],
    ]),
    false,
  ]);
  expect($map.getKey(1)).toStrictEqual(["one", false]);

  expect($map.setKey(1, "one")).toStrictEqual(false); // no change
  expect($map.get()).toEqual([
    new Map([
      [1, "one"],
      [2, "two"],
    ]),
    false,
  ]);

  expect($map.setKey(2, "twoChanged")).toStrictEqual(true);
  expect($map.get()).toEqual([
    new Map([
      [1, "one"],
      [2, "twoChanged"],
    ]),
    false,
  ]);
  expect($map.setKey(2, "twoChanged")).toStrictEqual(false);
  expect($map.getKey(2)).toStrictEqual(["twoChanged", false]);

  expect($map.setKey(3, "three")).toStrictEqual(true);
  expect($map.get()).toEqual([
    new Map([
      [1, "one"],
      [2, "twoChanged"],
      [3, "three"],
    ]),
    false,
  ]);
  expect($map.setKey(3, "three")).toStrictEqual(false);
  expect($map.getKey(3)).toStrictEqual(["three", false]);

  expect(subscribeKeyValues).toEqual([
    [1, "one"], // initial
    [2, "two"], // initial
    [2, "twoChanged"],
    [3, "three"],
  ]);
  expect(unitializedSubscriptionThree).toEqual([undefined, "three"]);
  expect(subscribeValues).toEqual([
    new Map([
      [1, "one"],
      [2, "two"],
    ]),
    new Map([
      [1, "one"],
      [2, "twoChanged"],
    ]),
    new Map([
      [1, "one"],
      [2, "twoChanged"],
      [3, "three"],
    ]),
  ]);
});

test("mapNode setKeyDefer undefined node", () => {
  let $map = mapNode<number, string>();

  let subscribeValues: ReadonlyMap<number, string | undefined>[] = [];
  $map.subscribe(val => {
    subscribeValues.push(val);
  });

  let subscribeKeyValues: [number, string | undefined][] = [];
  $map.subscribeKeys((key, val) => {
    subscribeKeyValues.push([key, val]);
  });

  let unitializedSubscriptionThree: (string | undefined)[] = [];
  $map.subscribeKey(3, val => {
    unitializedSubscriptionThree.push(val);
  });

  $map.setKeyDefer(3, "three");
  expect($map.get()).toEqual([new Map([[3, "three"]]), true]);

  expect(unitializedSubscriptionThree).toEqual([undefined, "three"]);
  expect(subscribeKeyValues).toEqual([[3, "three"]]);
  expect(subscribeValues).toEqual([new Map(), new Map([[3, "three"]])]);
});

test("mapNode setKeyDefer undefined and defined node", () => {
  let $map = mapNode<number, string>(new Map([[1, "one"]]));

  let subscribeValues: ReadonlyMap<number, string | undefined>[] = [];
  $map.subscribe(val => {
    subscribeValues.push(val);
  });

  let subscribeKeyValues: [number, string | undefined][] = [];
  $map.subscribeKeys((key, val) => {
    subscribeKeyValues.push([key, val]);
  });

  let subscriptionOne: (string | undefined)[] = [];
  $map.subscribeKey(1, val => {
    subscriptionOne.push(val);
  });

  let unitializedSubscriptionThree: (string | undefined)[] = [];
  $map.subscribeKey(3, val => {
    unitializedSubscriptionThree.push(val);
  });

  $map.setKeyDefer(3, "three");
  $map.setKeyDefer(1, "oneChanged");
  expect($map.get()).toEqual([
    new Map([
      [1, "oneChanged"],
      [3, "three"],
    ]),
    true,
  ]);

  expect(unitializedSubscriptionThree).toEqual([undefined, "three"]);
  expect(subscriptionOne).toEqual(["one", "oneChanged"]);
  expect(subscribeKeyValues).toEqual([
    [1, "one"],
    [1, "oneChanged"],
    [3, "three"],
  ]);
  expect(subscribeValues).toEqual([
    new Map([[1, "one"]]),
    new Map([
      [1, "oneChanged"],
      [3, "three"],
    ]),
  ]);
});

test("mapNode setKeyDefer  delete key", () => {
  let $map = mapNode<number, string>(new Map([[1, "one"]]));

  let subscribeValues: ReadonlyMap<number, string | undefined>[] = [];
  $map.subscribe(val => {
    subscribeValues.push(val);
  });

  let subscribeKeyValues: [number, string | undefined][] = [];
  $map.subscribeKeys((key, val) => {
    subscribeKeyValues.push([key, val]);
  });

  let subscriptionOne: (string | undefined)[] = [];
  $map.subscribeKey(1, val => {
    subscriptionOne.push(val);
  });

  $map.setKeyDefer(1, undefined);
  expect($map.get()).toEqual([new Map([]), true]);

  expect(subscriptionOne).toEqual(["one", undefined]);
  expect(subscribeKeyValues).toEqual([
    [1, "one"],
    [1, undefined],
  ]);
  expect(subscribeValues).toEqual([new Map([[1, "one"]]), new Map([])]);
});

// test("mapNode fuzz test", () => {
//   // TODO: implement.
//   // Random updates and deletes deferred and undeffered should stream the same value for the subscriptions.
// });

test("compose test", () => {
  const $node1 = node(1);
  const $composite2 = compositeNode({ b: 2, c: 3, d: 4 });
  const $composite3 = compositeNode({ e: "five", f: "six" });

  const $composed = compose({
    a: $node1,
    b: $composite2.nodes.b,
    c: $composite2.nodes.d,
    e: $composite3.nodes.e,
  });

  const composedValues: {
    a: number;
    b: number;
    c: number;
    e: string;
  }[] = [];
  const valuesA: number[] = [];
  const valuesB: number[] = [];
  const valuesC: number[] = [];
  const valuesE: string[] = [];

  $composed.subscribe(val => {
    composedValues.push(val);
  });
  $composed.nodes.a.subscribe(val => {
    valuesA.push(val);
  });
  $composed.nodes.b.subscribe(val => {
    valuesB.push(val);
  });
  $composed.nodes.c.subscribe(val => {
    valuesC.push(val);
  });
  $composed.nodes.e.subscribe(val => {
    valuesE.push(val);
  });

  expect($composed.get()).toEqual([{ a: 1, b: 2, c: 4, e: "five" }, false]);
  expect(composedValues).toEqual([{ a: 1, b: 2, c: 4, e: "five" }]);

  // Set outer input node.
  expect($node1.set(2)).toBe(true);

  expect($composed.get()).toEqual([{ a: 2, b: 2, c: 4, e: "five" }, false]);
  expect(composedValues).toEqual([
    { a: 1, b: 2, c: 4, e: "five" },
    { a: 2, b: 2, c: 4, e: "five" },
  ]);

  // set outer composite node.
  expect($composite2.set({ b: 3, c: 4, d: 5 })).toBe(true);
  expect($composed.get()).toEqual([{ a: 2, b: 3, c: 5, e: "five" }, false]);
  expect(composedValues).toEqual([
    { a: 1, b: 2, c: 4, e: "five" },
    { a: 2, b: 2, c: 4, e: "five" },
    { a: 2, b: 3, c: 5, e: "five" },
  ]);

  // set inner composite node.
  expect($composite3.nodes.e.set("fiveChanged")).toBe(true);
  expect($composed.get()).toEqual([
    { a: 2, b: 3, c: 5, e: "fiveChanged" },
    false,
  ]);
  expect(composedValues).toEqual([
    { a: 1, b: 2, c: 4, e: "five" },
    { a: 2, b: 2, c: 4, e: "five" },
    { a: 2, b: 3, c: 5, e: "five" },
    { a: 2, b: 3, c: 5, e: "fiveChanged" },
  ]);
});

test("edge test", () => {
  const $in = node(1);
  const $out = edge($in, val => val + 1);

  const values: number[] = [];
  $out.subscribe(val => {
    values.push(val);
  });

  expect($out.get()).toEqual([2, false]);
  expect(values).toEqual([2]);

  $in.set(2);
  expect($out.get()).toEqual([3, false]);
  expect(values).toEqual([2, 3]);

  $in.set(3);
  expect($out.get()).toEqual([4, false]);
  expect(values).toEqual([2, 3, 4]);

  $in.set(3);
  expect($out.get()).toEqual([4, false]);
  expect(values).toEqual([2, 3, 4]);
});

test("multiEdge test", () => {
  const $in = compositeNode({ a: 1, b: 2 });
  const $out = edge($in, val => ({
    a: val.a + 1,
    b: val.b + 1,
    c: val.a + val.b,
  }));

  const values: { a: number; b: number; c: number }[] = [];
  $out.subscribe(val => {
    values.push(val);
  });

  const valuesA: number[] = [];
  $out.nodes.a.subscribe(val => {
    valuesA.push(val);
  });
  const valuesB: number[] = [];
  $out.nodes.b.subscribe(val => {
    valuesB.push(val);
  });
  const valuesC: number[] = [];
  $out.nodes.c.subscribe(val => {
    valuesC.push(val);
  });

  expect($out.get()).toEqual([{ a: 2, b: 3, c: 3 }, false]);
  expect(values).toEqual([{ a: 2, b: 3, c: 3 }]);

  expect($in.set({ a: 2, b: 3 })).toBe(true);
  expect($out.get()).toEqual([{ a: 3, b: 4, c: 5 }, false]);
  expect(values).toEqual([
    { a: 2, b: 3, c: 3 },
    { a: 3, b: 4, c: 5 },
  ]);
  expect(valuesA).toEqual([2, 3]);
  expect(valuesB).toEqual([3, 4]);
  expect(valuesC).toEqual([3, 5]);

  expect($in.nodes.a.set(3)).toBe(true);
  expect($out.get()).toEqual([{ a: 4, b: 4, c: 6 }, false]);
  expect(values).toEqual([
    { a: 2, b: 3, c: 3 },
    { a: 3, b: 4, c: 5 },
    { a: 4, b: 4, c: 6 },
  ]);
  expect(valuesA).toEqual([2, 3, 4]);
  expect(valuesB).toEqual([3, 4]);
  expect(valuesC).toEqual([3, 5, 6]);

  $in.nodes.a.setDefer(4);
  $in.nodes.b.setDefer(5);

  expect($in.get()).toEqual([{ a: 4, b: 5 }, true]);
  expect(values).toEqual([
    { a: 2, b: 3, c: 3 },
    { a: 3, b: 4, c: 5 },
    { a: 4, b: 4, c: 6 },
    { a: 5, b: 6, c: 9 },
  ]);
  expect(valuesA).toEqual([2, 3, 4, 5]);
  expect(valuesB).toEqual([3, 4, 6]);
  expect(valuesC).toEqual([3, 5, 6, 9]);
});

test.only("Selfedge test", () => {
  const $input = node(1);
  const $out = selfEdge(1, $input, ({ self, read }) =>
    self < read ? self + 1 : self
  );
  const values: number[] = [];

  $out.subscribe(val => {
    values.push(val);
  });

  expect($out.get()).toEqual([1, false]);
  expect(values).toEqual([1]);

  $input.set(2);
  expect($out.get()).toEqual([2, false]);
  expect(values).toEqual([1, 2]);

  $input.set(100);
  expect($out.get()).toEqual([100, false]);
  expect(values).toEqual([1, 2, ...arrayRange(3, 100)]);
});

test("mapToMapEdge ", () => {
  const $input = mapNode<number, number>(
    new Map([
      [1, 1],
      [2, 2],
    ])
  );
  const $output = mapToMapEdge($input, undefnode, (k, v, r) => [
    k,
    v === undefined ? v : v + 1,
  ]);

  let values: ReadonlyMap<number, number>[] = [];
  $output.subscribe(val => {
    values.push(val);
  });

  let values1: (number | undefined)[] = [];
  $output.subscribeKey(1, val => {
    values1.push(val);
  });

  // let values2: (number | undefined)[] = [];
  // $output.nodes.get(2)?.subscribe((val) => {
  //   values2.push(val);
  // });

  let values3: (number | undefined)[] = [];
  $output.subscribeKey(3, val => {
    values3.push(val);
  });

  expect($output.get()).toEqual([
    new Map([
      [1, 2],
      [2, 3],
    ]),
    false,
  ]);
  expect(values).toEqual([
    new Map([
      [1, 2],
      [2, 3],
    ]),
  ]);
  expect(values1).toEqual([2]);
  // expect(values2).toEqual([3]);
  expect(values3).toEqual([undefined]);

  $input.setKey(1, undefined);
  expect($output.get()).toEqual([new Map([[2, 3]]), false]);
  expect(values).toEqual([
    new Map([
      [1, 2],
      [2, 3],
    ]),
    new Map([[2, 3]]),
  ]);
  expect(values1).toEqual([2, undefined]);

  $input.setKey(3, 3);
  expect($output.get()).toEqual([
    new Map([
      [2, 3],
      [3, 4],
    ]),
    false,
  ]);
  expect(values).toEqual([
    new Map([
      [1, 2],
      [2, 3],
    ]),
    new Map([[2, 3]]),
    new Map([
      [2, 3],
      [3, 4],
    ]),
  ]);
  expect(values1).toEqual([2, undefined]);
  // expect(values2).toEqual([3]);
  expect(values3).toEqual([undefined, 4]);
});

test("compositeToMapEdge ", () => {
  const $input = compositeNode({ a: 1, b: 2 });
  const $output = mapEdge($input, val => [
    ["a", val.a + 1],
    ["b", val.b + 1],
  ]);

  let values: ReadonlyMap<string, number>[] = [];
  $output.subscribe(val => {
    values.push(val);
  });

  let valuesA: (number | undefined)[] = [];
  $output.subscribeKey("a", val => {
    valuesA.push(val);
  });

  let valuesB: (number | undefined)[] = [];
  $output.subscribeKey("b", val => {
    valuesB.push(val);
  });

  expect($output.get()).toEqual([
    new Map([
      ["a", 2],
      ["b", 3],
    ]),
    false,
  ]);

  $input.set({ a: 2, b: 3 });
  expect($output.get()).toEqual([
    new Map([
      ["a", 3],
      ["b", 4],
    ]),
    false,
  ]);

  $input.nodes.a.set(3);
  expect($output.get()).toEqual([
    new Map([
      ["a", 4],
      ["b", 4],
    ]),
    false,
  ]);
});

test("dependentAction simple node no args ", () => {
  const $counter = node(0);
  const incCounter = dependentAction(
    "incCounter",
    $counter,
    $counter,
    currentValue => currentValue + 1
  );
  expect(incCounter()).toBe(true);
  expect($counter.get()).toEqual([1, false]);

  expect(incCounter()).toBe(true);
  expect($counter.get()).toEqual([2, false]);

  expect(incCounter()).toBe(true);
  expect($counter.get()).toEqual([3, false]);
});

test("action simple node arg ", () => {
  const $counter = node(0);
  const setCounter = action("setCounter", $counter, (value: number) => value);

  expect($counter.get()).toEqual([0, false]);
  expect(setCounter(1)).toBe(true);
  expect($counter.get()).toEqual([1, false]);

  expect(setCounter(200)).toBe(true);
  expect($counter.get()).toEqual([200, false]);

  expect(setCounter(40)).toBe(true);
  expect($counter.get()).toEqual([40, false]);
});

test("action test", () => {
  const $counter = node(0);
  const $composite = compositeNode({ a: 1, b: 2 });
  // const $map = mapNode<number, string>(new Map([[1, "one"]]));
  const setAll = action(
    "setAll",
    compose({ $counter, $composite }), // , $map
    (a: number) => {
      console.log(a);
      const next = {
        $counter: a,
        $composite: { a: a, b: a + 1 },
        // $map: new Map([[a, a.toString()]]),
      };
      return next;
    }
  );

  expect(setAll(1)).toEqual(true);
  // expect($counter.get()).toEqual([1, false]);
  expect($composite.get()).toEqual([{ a: 1, b: 2 }, false]);
  // expect($map.get()).toEqual([new Map([[1, "1"]]), false]);

  expect(setAll(2)).toEqual(true);
  expect($counter.get()).toEqual([2, false]);
  expect($composite.get()).toEqual([{ a: 2, b: 3 }, false]);
  // expect($map.get()).toEqual([new Map([[2, "2"]]), false]);
});

// TODO: need more test cases for deepNode
test("deepNode action test", () => {
  const $node = makeDeepNode({
    a: 1,
    b: { c: 1, d: 2 },
  });

  const setAll = action("setAll", $node, (next: number) => {
    return {
      a: next,
      b: { c: next, d: next + 1 },
    };
  });

  expect($node.get()).toEqual([{ a: 1, b: { c: 1, d: 2 } }, false]);

  expect(setAll(2)).toEqual(true);
  expect($node.get()).toEqual([{ a: 2, b: { c: 2, d: 3 } }, false]);
});
