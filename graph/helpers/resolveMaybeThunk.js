function resolveMaybeThunk(obj) {
  return obj instanceof Function ? obj() : obj;
}

export default resolveMaybeThunk;
