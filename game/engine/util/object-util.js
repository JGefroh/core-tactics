export function _deepMerge(target, source) {
    const output = {...target};
    if (_isObject(target) && _isObject(source)) {
      Object.keys(source).forEach(key => {
        if (_isObject(source[key])) {
          if (!(key in target)) {
            output[key] = source[key];
          } else {
            output[key] = _deepMerge(target[key], source[key]);
          }
        } else {
          output[key] = source[key];
        }
      });
    }
    return output;
  }
  
  export function _isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }
  