// https://github.com/yields/store
var storage = window.localStorage;

window.store = function(key, val) {
  switch(arguments.length) {
    case 2: return set(key, val);
    case 0: return all();
    case 1: return typeof key === "object"
            ? each(key, set)
            : get(key);
  }
};

function each(o, f) {
  var keys = Object.keys(o);
  keys.forEach(function(k) {
    f(k, o[k]);
  });
}

function set(key, val) {
  return null == val
    ? storage.removeItem(key)
    : storage.setItem(key, JSON.stringify(val));
}

function get(key) {
  return null == key
    ? storage.clear()
    : JSON.parse(storage.getItem(key));
}

function all() {
  var len = storage.length
    , ret = {}
    , key
    , val;

  for (var i = 0; i < len; ++i) {
    key = storage.key(i);
    ret[key] = get(key);
  }

  return ret;
}
