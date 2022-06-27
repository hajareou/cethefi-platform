"use strict";
(self["webpackChunkleaf_writer"] = self["webpackChunkleaf_writer"] || []).push([[698],{

/***/ 60698:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(49246);
/* harmony import */ var monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(37332);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(43265);



const Editor = ({ content, updateContent }) => {
  const { palette } = (0,_mui_material__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)();
  const divEl = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
  let editor;
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (divEl.current) {
      editor = monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_0__.editor.create(divEl.current, {
        lineNumbers: "on",
        language: "xml",
        theme: palette.mode === "dark" ? "vs-dark" : "vs-light",
        value: content,
        wordWrap: "wordWrapColumn",
        wordWrapColumn: 100,
        wrappingIndent: "indent"
      });
      editor.getModel()?.onDidChangeContent(() => {
        const content2 = editor.getValue();
        updateContent(content2);
      });
    }
    return () => {
      editor.dispose();
    };
  }, []);
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
    className: "Editor",
    style: { minHeight: 600 },
    ref: divEl
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Editor);


/***/ })

}]);
//# sourceMappingURL=698.js.map