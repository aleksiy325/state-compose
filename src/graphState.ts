// Ideas:
// 1. use weakref to remove subscribers?
// 2. seperate deep and shallow composite nodes.
// 3. use builder syntax to flatten.
// 4. detect cycles for deep node?

import { BehaviorSubject, distinctUntilChanged, skip } from "rxjs";

// 5. A reusable emit once filter? essentially set.
// 6. A reusable init and deinit filter?

export type Notify<T> = (value: T) => void;
export type NotifyKey<K, V> = (key: K, value: V) => void;
export type Get<T> = () => [T, boolean];

export interface ReadableNode<T> {
  get: Get<T>;
  subscribe: (notify: Notify<T>, skipInitialNotify?: boolean) => void;
  // TODO: builder syntax
  // edge<IV, OV>(
  //   transformFunc: (input: IV) => OV,
  // ): ReadableAnyNode<OV>;
}

export interface WritableNode<T> {
  set: (value: T) => boolean;
  setDefer: (value: T) => Get<T>;
}

export type ReadableAnyNode<T> =
  [T] extends ReadonlyMap<infer K, infer V>
    ? ReadableMapNode<K, V>
    : [T] extends [object]
      ? ReadableCompositeNode<T>
      : ReadableNode<T>;

export type WritableAnyNode<T> =
  [T] extends ReadonlyMap<infer K, infer V>
    ? WritableMapNode<K, V>
    : [T] extends [object]
      ? WritableCompositeNode<T>
      : WritableNode<T>;

export type AnyNode<T> =
  [T] extends ReadonlyMap<infer K, infer V>
    ? MapNode<K, V>
    : [T] extends [object]
      ? CompositeNode<T>
      : Node<T>;

export interface Node<T> extends ReadableNode<T>, WritableNode<T> {}

type ReadableCompositeNodeValues<T> = {
  readonly [P in keyof T]: ReadableAnyNode<T[P]>;
};

type WritableCompositeNodeValues<T> = {
  [P in keyof T]: WritableAnyNode<T[P]>;
};

type CompositeNodeValues<T> = {
  [P in keyof T]: AnyNode<T[P]>;
};

export interface ReadableCompositeNode<T> extends ReadableNode<T> {
  nodes: ReadableCompositeNodeValues<T>;
}

export interface WritableCompositeNode<T> extends WritableNode<T> {
  nodes: WritableCompositeNodeValues<T>;
}

export interface CompositeNode<T>
  extends ReadableCompositeNode<T>,
    WritableCompositeNode<T>,
    Node<T> {
  nodes: CompositeNodeValues<T>;
}

export interface WritableMapNode<K, V> extends WritableNode<ReadonlyMap<K, V>> {
  setKey: (key: K, value: V | undefined) => boolean;
  setKeyDefer: (key: K, value: V | undefined) => Get<V | undefined>;
}

export interface ReadableMapNode<K, V> extends ReadableNode<ReadonlyMap<K, V>> {
  getKey: (key: K) => [V | undefined, boolean];
  getKeyNode: (key: K) => AnyNode<V | undefined>;
  subscribeKey: (
    key: K,
    notify: Notify<V | undefined>,
    skipInitialNotify?: boolean
  ) => void;
  subscribeKeys: (
    notify: NotifyKey<K, V | undefined>,
    skipInitialNotify?: boolean
  ) => void;
}

export interface MapNode<K, V>
  extends WritableMapNode<K, V>,
    ReadableMapNode<K, V>,
    Node<ReadonlyMap<K, V>> {}

const simpleEquals = <T>(a: T, b: T) => a === b;

function arraysEqual<T extends []>(a: T, b: T): boolean {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

function isShallow<T>(value: unknown): value is Shallow<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "value" in value &&
    "isEqual" in value &&
    typeof value.isEqual === "function" &&
    "type" in value &&
    value.type === "shallow"
  );
}

function isPrimitive(
  value: any
): value is string | number | boolean | bigint | symbol | undefined | null {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint" ||
    typeof value === "symbol" ||
    typeof value === "undefined"
  );
}

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function isObjectWithKeysAndValues(obj: any): obj is Record<any, any> {
  return typeof obj === "object" && obj !== null && !isArray(obj);
}

function isMap(value: unknown): value is Map<unknown, unknown> {
  return value instanceof Map;
}

export interface Shallow<T> {
  value: T;
  isEqual: (previous: T, current: T) => boolean;
  type: "shallow";
}

export function makeShallow<T>(
  value: T,
  isEqual: (previous: T, current: T) => boolean = simpleEquals
): Shallow<T> {
  return {
    value,
    isEqual: isEqual,
    type: "shallow",
  };
}

export function node<T>(
  initValue: T,
  isEqual: (a: T, b: T) => boolean = simpleEquals // Non primitives require a custom isEqual func.
): Node<T> {
  // If isEqual is undefined verify that this
  // is a primitive value otherwise a custom
  // equality function needs to be used.
  if (isEqual == simpleEquals && !isPrimitive(initValue)) {
    throw Error(
      "Node requires a primitive value or a custom isEqual to be supplied. " +
        "Use makeShallow to provide a custom equals func for deep objects. Got: " +
        initValue
    );
  }

  let deferredValue = initValue;
  let hasDeferredValue = false;
  let currentValue = initValue;
  const subject = new BehaviorSubject<T>(initValue);
  const observable = subject.asObservable();
  // .pipe(
  //   distinctUntilChanged(isEqual)
  // );

  const notifySubscribers = (val: T) => {
    subject.next(val);
  };

  const get: Get<T> = () => {
    let changed = false;
    if (hasDeferredValue && !isEqual(currentValue, deferredValue)) {
      currentValue = deferredValue;
      hasDeferredValue = false;
      changed = true;
      notifySubscribers(currentValue);
    }
    return [currentValue, changed];
  };

  const setDefer = (value: T): Get<T> => {
    deferredValue = value;
    hasDeferredValue = true; // use a current transaction id instead?
    return get;
  };

  const set = (value: T): boolean => {
    let [_, changed] = setDefer(value)();
    return changed;
  };

  const subscribe = (notify: Notify<T>, skipInitialNotify = false) => {
    get(); // get to compute current so it can be skipped
    if (skipInitialNotify) {
      return observable.pipe(skip(1)).subscribe(notify);
    }
    return observable.subscribe(notify);
  };
  return {
    get,
    set,
    setDefer,
    subscribe,
  };
}

export const undefnode = node(undefined);

export function composeRead<T extends object>(
  inputNodes: ReadableCompositeNodeValues<T>
): ReadableCompositeNode<T> {
  let computing = false;
  const nodes = inputNodes;

  const getNoNotify: Get<T> = () => {
    const result: Partial<T> = {};
    let anyChanged = false;
    for (const key in nodes) {
      let [val, changed] = nodes[key].get();
      result[key] = val;
      anyChanged = anyChanged || changed;
    }
    return [result as T, anyChanged];
  };

  const subject = new BehaviorSubject<T>(getNoNotify()[0]);
  const observable = subject.asObservable();

  const notifySubscribers = (val: T) => {
    subject.next(val);
  };

  const get: Get<T> = () => {
    computing = true;
    const [result, changed] = getNoNotify();
    if (changed) {
      notifySubscribers(result as T);
    }
    computing = false;
    return [result as T, changed];
  };

  // get and notify on any change to inner nodes.
  for (const key in nodes) {
    // notify subscribers on any change to inner nodes.
    // as well as update self.
    nodes[key].subscribe(_ => {
      // If we receive a notification and we are already
      // computing our value we can ignore to prevent extra
      // notifications.
      // get and notify on any change to inner nodes.
      // notify subscribers on any change to inner nodes.
      // as well as update self.
      // If we receive a notification and we are already
      // computing our value we can ignore to prevent extra
      // notifications.
      if (!computing) {
        // Something has changed.
        // In the case of multiple values changing get will notify
        let [val, changed] = get();
        // But if get did not change we should notify.
        if (!changed) {
          notifySubscribers(val);
        }
      }
    });
  }

  const subscribe = (notify: Notify<T>, skipInitialNotify = false) => {
    get(); // get to compute current so it can be skipped
    if (skipInitialNotify) {
      return observable.pipe(skip(1)).subscribe(notify);
    }
    return observable.subscribe(notify);
  };

  return {
    nodes: nodes,
    get,
    subscribe,
  };
}

export function compose<T extends object>(
  inputNodes: CompositeNodeValues<T>
): CompositeNode<T> {
  const read = composeRead(inputNodes);
  const nodes = inputNodes;

  const setDefer = (value: T): Get<T> => {
    for (const key in value) {
      // TODO: should be able to add new keys?
      if (nodes[key] === undefined) {
        nodes[key] = makeDeepNode(value[key]);
      }
      nodes[key].setDefer(value[key]);
    }
    // TODO: should subscribers receive undefined value?
    // TODO: add test.
    for (const key in nodes) {
      if (value === undefined || value[key] === undefined) {
        delete nodes[key];
      }
    }
    return read.get;
  };

  const set = (value: T): boolean => {
    let [_, changed] = setDefer(value)();
    return changed;
  };

  return {
    nodes: nodes,
    get: read.get,
    subscribe: read.subscribe,
    setDefer,
    set,
  };
}

export function compositeNode<T extends object>(
  initialValue: T
): CompositeNode<T> {
  const buildNodes: Partial<CompositeNodeValues<T>> = {};
  for (const key in initialValue) {
    buildNodes[key] = makeDeepNode(initialValue[key]);
  }
  return compose(buildNodes as CompositeNodeValues<T>);
}

export function mapNode<K, V>(
  initialValue?: ReadonlyMap<K, V> | undefined
): MapNode<K, V> {
  // TODO: use a weak ref map? To clean up any nodes with no subscribers.
  const mapValue = new Map<K, Node<V | undefined>>();
  let computing = false;

  const getNoNotify: Get<ReadonlyMap<K, V>> = () => {
    const result = new Map<K, V>();
    let anyChanged = false;
    for (const [key, node] of mapValue) {
      let [val, changed] = node.get();
      if (val !== undefined) {
        result.set(key, val);
      }
      anyChanged = anyChanged || changed;
    }
    return [result as ReadonlyMap<K, V>, anyChanged];
  };

  const subject = new BehaviorSubject<ReadonlyMap<K, V>>(getNoNotify()[0]);
  const observable = subject.asObservable();
  const notifySubscribers = (val: ReadonlyMap<K, V>) => {
    subject.next(val);
  };

  let allKeySubscriptions: NotifyKey<K, V | undefined>[] = [
    (key, value) => {
      // get and notify on any change to inner nodes.
      // notify subscribers on any change to inner nodes.
      // as well as update self.
      // If we receive a notification and we are already
      // computing our value we can ignore to prevent extra
      // notifications.
      if (!computing) {
        // Something has changed.
        // In the case of multiple values changing get will notify
        let [val, changed] = get();
        // But if get did not change we should notify.
        if (!changed) {
          notifySubscribers(val);
        }
      }
    },
  ];

  const get: Get<ReadonlyMap<K, V>> = () => {
    computing = true;
    const [result, changed] = getNoNotify();
    if (changed) {
      notifySubscribers(result);
    }
    computing = false;
    return [result as ReadonlyMap<K, V>, changed];
  };

  const getKey = (key: K): [V | undefined, boolean] => {
    if (mapValue.has(key)) {
      return mapValue.get(key)?.get() as [V | undefined, boolean];
    }
    return [undefined, false];
  };

  const setKeyDefer = (key: K, value: V | undefined): Get<V | undefined> => {
    if (!mapValue.has(key)) {
      // Initialize new nodes subs
      const newNode = node<V | undefined>(undefined);
      allKeySubscriptions.forEach(notify => {
        newNode.subscribe(
          value => notify(key, value),
          /*skipInitialNotify=*/ true
        );
      });
      mapValue.set(key, newNode);
    }
    return mapValue.get(key)?.setDefer(value) as Get<V | undefined>;
  };

  const setDefer = (value: ReadonlyMap<K, V | undefined>) => {
    for (const [key, _] of mapValue) {
      if (!value.has(key)) {
        mapValue.get(key)?.setDefer(undefined);
      }
      mapValue.delete(key);
    }
    for (const [key, innerVal] of value.entries()) {
      setKeyDefer(key, innerVal);
    }
    return get;
  };

  const setKey = (key: K, value: V | undefined): boolean => {
    let [_, changed] = setKeyDefer(key, value)();
    return changed;
  };

  const set = (value: ReadonlyMap<K, V>): boolean => {
    let [_, changed] = setDefer(value)();
    return changed;
  };

  const subscribe = (
    notify: Notify<ReadonlyMap<K, V>>,
    skipInitialNotify = false
  ) => {
    get(); // get to compute current so it can be skipped
    if (skipInitialNotify) {
      observable.pipe(skip(1)).subscribe(notify);
    }
    return observable.subscribe(notify);
  };

  const getKeyNode = (key: K): AnyNode<V | undefined> => {
    // TODO: make deep nodes?
    const curNode = mapValue.get(key);
    if (curNode !== undefined) {
      return curNode as AnyNode<V | undefined>;
    } else {
      const newNode = node<V | undefined>(undefined);
      mapValue.set(key, newNode);
      allKeySubscriptions.forEach(notify => {
        newNode.subscribe(
          value => notify(key, value),
          /*skipInitialNotify*/ true
        );
      });
      return newNode as AnyNode<V | undefined>;
    }
  };

  const subscribeKey = (
    key: K,
    notify: Notify<V | undefined>,
    skipInitialNotify = false
  ) => {
    getKeyNode(key)?.subscribe(notify, skipInitialNotify);
  };

  const subscribeKeys = (
    notifyKey: NotifyKey<K, V | undefined>,
    skipInitialNotify = false
  ) => {
    allKeySubscriptions.push(notifyKey);
    for (const [key, node] of mapValue) {
      node.subscribe(value => notifyKey(key, value), skipInitialNotify);
    }
  };

  // initialize
  initialValue?.forEach((value, key) => {
    setKey(key, value);
  });

  return {
    get,
    setKeyDefer,
    setKey,
    getKey,
    setDefer,
    set,
    getKeyNode,
    subscribeKey,
    subscribeKeys,
    subscribe,
  };
}

export function makeDeepNode<T>(initVal: T | Shallow<T>): AnyNode<T> {
  if (isShallow(initVal)) {
    return node<T>(
      initVal.value as T,
      initVal.isEqual
    ) as unknown as AnyNode<T>;
  } else if (isMap(initVal)) {
    return mapNode(initVal) as unknown as AnyNode<T>;
  } else if (isArray(initVal)) {
    // TODO: make arrayNode. use shallow for now.
    return node<T>(initVal, (a, b) =>
      arraysEqual(a as [], b as [])
    ) as unknown as AnyNode<T>;
  } else if (isObjectWithKeysAndValues(initVal)) {
    // TODO: fix
    let nodes: any = {};
    const knownVal = initVal as Record<any, any>;
    for (const key in knownVal) {
      nodes[key] = makeDeepNode(knownVal[key]);
    }
    return compose(nodes as CompositeNodeValues<T>) as unknown as AnyNode<T>;
  }
  // Explicit cast might be necessary
  return node<T>(initVal as T) as unknown as AnyNode<T>; // TODO: not sure if this is correct?
}

export function edge<IV, OV>(
  read: ReadableNode<IV>,
  transformFunc: (input: IV) => OV,
  isEqual?: (a: OV, b: OV) => boolean // if set makes shallow node.
): ReadableAnyNode<OV> {
  const [val, _] = read.get();
  const initVal = transformFunc(val);
  const inputVal =
    isEqual == undefined ? initVal : makeShallow(initVal, isEqual);
  const outputNode = makeDeepNode(inputVal);
  read.subscribe(value => outputNode.set(transformFunc(value)), true); // Need to skip initial notify.
  return outputNode;
}

export function makeSelector<IV, OV, Args extends any[]>(
  read: ReadableNode<IV>,
  transformFunc: (input: IV, ...args: Args) => OV
): (...args: Args) => OV {
  return (...args: Args) => transformFunc(read.get()[0], ...args);
}

export function selfEdge<T, IV>(
  init: T,
  read: ReadableNode<IV>, // TODO: make readable only once compose is fixed.
  transformFunc: (v: { self: T; read: IV }) => T
): AnyNode<T> {
  // Recursive notifies makes this a bit tricky.
  // But lets flatten out the loop.
  // We also want to notify on all changes.
  const selfNode = makeDeepNode(init);
  read.subscribe(value => {
    let changed = true;
    do {
      const [selfVal, _] = selfNode.get();
      const nextVal = transformFunc({ self: selfVal, read: value });
      changed = selfNode.set(nextVal);
    } while (changed);
  });
  return selfNode;
}

export function mapToMapEdge<IK, IV, OK, OV, RV>(
  readMap: ReadableMapNode<IK, IV>,
  read: ReadableNode<RV>,
  transformFunc: (
    key: IK,
    value: IV | undefined,
    read: RV
  ) => [OK, OV | undefined]
): ReadableMapNode<OK, OV> {
  const $outMap = mapNode<OK, OV>();
  readMap.subscribeKeys((key, value) => {
    const [readVal, _] = read.get();
    const [newKey, newVal] = transformFunc(key, value, readVal);
    $outMap.setKey(newKey, newVal);
  });

  read.subscribe(readVal => {
    const keyValues = readMap.get()[0];
    for (const [key, oldVal] of keyValues) {
      const [newKey, newVal] = transformFunc(key, oldVal, readVal);
      $outMap.setKeyDefer(newKey, newVal);
    }
    $outMap.get();
  });
  return $outMap;
}

export function mapEdge<IV, OK, OV>(
  read: ReadableNode<IV>,
  keyUpdateFunc: (read: IV) => [OK, OV][]
): ReadableMapNode<OK, OV> {
  const $outMap = mapNode<OK, OV>();
  read.subscribe(value => {
    const keyValues = keyUpdateFunc(value);
    for (const [key, val] of keyValues) {
      $outMap.setKeyDefer(key, val);
    }
    $outMap.get();
  });
  return $outMap;
}

export function mapKeyEdge<K, V>(read: ReadableMapNode<K, V>, key: K) {
  const $out = node<V | undefined>(undefined);
  read.subscribeKey(key, value => $out.set(value));
  return $out;
}

export function action<T, Args extends any[]>(
  name: string,
  mutate: WritableNode<T>,
  transitionFunc: (...args: Args) => T
) {
  return (...args: Args): boolean => {
    let nextValue = transitionFunc(...args);
    return mutate.set(nextValue);
  };
}

export function dependentAction<T, U, Args extends any[]>(
  name: string,
  mutate: WritableNode<T>,
  read: ReadableNode<U>,
  transitionFunc: (read: U, ...args: Args) => T
) {
  return (...args: Args): boolean => {
    const [readValue, _] = read?.get() ?? [undefined, false];
    const nextValue = transitionFunc(readValue, ...args);
    return mutate.set(nextValue);
  };
}
