const fetchFunction = (...args) => fetch(...args);
module.exports = exports = fetchFunction;
exports.default = fetchFunction;
exports.Headers = typeof Headers !== 'undefined' ? Headers : null;
exports.Request = typeof Request !== 'undefined' ? Request : null;
exports.Response = typeof Response !== 'undefined' ? Response : null;
