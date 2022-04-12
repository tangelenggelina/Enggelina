"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelizeObject = void 0;
const lodash_1 = require("lodash");
function camelizeObject(target) {
  if (lodash_1.isArray(target)) {
    return target.map((item) => camelizeObject(item));
  }
  if (lodash_1.isObject(target)) {
    return Object.keys(target).reduce((buffer, key) => {
      buffer[lodash_1.camelCase(key)] = camelizeObject(target[key]);
      return buffer;
    }, {});
  }
  return target;
}
exports.camelizeObject = camelizeObject;
//# sourceMappingURL=camelizeObject.js.map
