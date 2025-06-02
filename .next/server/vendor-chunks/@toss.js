"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@toss";
exports.ids = ["vendor-chunks/@toss"];
exports.modules = {

/***/ "(ssr)/./node_modules/@toss/react/esm/hooks/useCallbackOnce.mjs":
/*!****************************************************************!*\
  !*** ./node_modules/@toss/react/esm/hooks/useCallbackOnce.mjs ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   useCallbackOnce: () => (/* binding */ useCallbackOnce)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"(ssr)/./node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js\");\n\n\n/** @tossdocs-ignore */\n\nfunction useCallbackOnce(callback, deps) {\n  var hasFired = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);\n  var memoizedCallback = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {\n    if (hasFired.current) {\n      return;\n    }\n\n    callback.apply(void 0, arguments);\n    hasFired.current = true; // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, deps);\n  return memoizedCallback;\n}\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvQHRvc3MvcmVhY3QvZXNtL2hvb2tzL3VzZUNhbGxiYWNrT25jZS5tanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBNEM7O0FBRTVDOztBQUVBO0FBQ0EsaUJBQWlCLDZDQUFNO0FBQ3ZCLHlCQUF5QixrREFBVztBQUNwQztBQUNBO0FBQ0E7O0FBRUE7QUFDQSw2QkFBNkI7QUFDN0IsR0FBRztBQUNIO0FBQ0E7O0FBRTJCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXJ0c2NvcGUtZmUvLi9ub2RlX21vZHVsZXMvQHRvc3MvcmVhY3QvZXNtL2hvb2tzL3VzZUNhbGxiYWNrT25jZS5tanM/NTNlOCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VSZWYsIHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnO1xuXG4vKiogQHRvc3Nkb2NzLWlnbm9yZSAqL1xuXG5mdW5jdGlvbiB1c2VDYWxsYmFja09uY2UoY2FsbGJhY2ssIGRlcHMpIHtcbiAgdmFyIGhhc0ZpcmVkID0gdXNlUmVmKGZhbHNlKTtcbiAgdmFyIG1lbW9pemVkQ2FsbGJhY2sgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGhhc0ZpcmVkLmN1cnJlbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjYWxsYmFjay5hcHBseSh2b2lkIDAsIGFyZ3VtZW50cyk7XG4gICAgaGFzRmlyZWQuY3VycmVudCA9IHRydWU7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgfSwgZGVwcyk7XG4gIHJldHVybiBtZW1vaXplZENhbGxiYWNrO1xufVxuXG5leHBvcnQgeyB1c2VDYWxsYmFja09uY2UgfTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/@toss/react/esm/hooks/useCallbackOnce.mjs\n");

/***/ })

};
;