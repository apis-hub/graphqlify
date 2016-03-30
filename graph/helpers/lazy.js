export function lazyPick(object, keys) {
  return lazyPickBy(object, key => {
    return Boolean(keys.find(k => k === key));
  });
}

export function lazyPickBy(object, pickFn) {
  return Object.keys(object).filter(pickFn).reduce((newObject, key) => {
    Object.defineProperty(
      newObject, key, { get: () => object[key], enumerable: true }
    );
    return newObject;
  }, {});
}

export function lazyMerge(...objects) {
  return objects.reduce((newObject, object) => {
    Object.keys(object).forEach(key => {
      Object.defineProperty(
        newObject, key, { get: () => object[key], enumerable: true }
      );
    });
    return newObject;
  }, {});
}
