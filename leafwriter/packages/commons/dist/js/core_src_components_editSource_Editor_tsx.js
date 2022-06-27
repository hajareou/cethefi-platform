"use strict";
(self["webpackChunk_cwrc_leafwriter_commons"] = self["webpackChunk_cwrc_leafwriter_commons"] || []).push([["core_src_components_editSource_Editor_tsx"],{

/***/ "../core/src/components/editSource/Editor.tsx":
/*!****************************************************!*\
  !*** ../core/src/components/editSource/Editor.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _mui_material__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @mui/material */ "../../node_modules/@mui/material/index.js");
/* harmony import */ var monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! monaco-editor/esm/vs/editor/editor.api */ "include-loader!../../node_modules/monaco-editor/esm/vs/editor/editor.api.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);



const Editor = ({ content, updateContent }) => {
  const { palette } = (0,_mui_material__WEBPACK_IMPORTED_MODULE_0__.useTheme)();
  const divEl = (0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);
  let editor;
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (divEl.current) {
      editor = monaco_editor_esm_vs_editor_editor_api__WEBPACK_IMPORTED_MODULE_1__.editor.create(divEl.current, {
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
  return /* @__PURE__ */ react__WEBPACK_IMPORTED_MODULE_2___default().createElement("div", {
    className: "Editor",
    style: { minHeight: 600 },
    ref: divEl
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Editor);


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvY29yZV9zcmNfY29tcG9uZW50c19lZGl0U291cmNlX0VkaXRvcl90c3guanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUVBO0FBQ0E7QUFnQkEsTUFBTSxTQUFzQixDQUFDLEVBQUUsU0FBUyxvQkFBb0I7QUFDMUQsUUFBTSxFQUFFLFlBQVksdURBQVEsQ0FBQztBQUM3QixRQUFNLFFBQVEsNkNBQU0sQ0FBaUIsSUFBSTtBQUN6QyxNQUFJO0FBRUosa0RBQVMsQ0FBQyxNQUFNO0FBQ2QsUUFBSSxNQUFNLFNBQVM7QUFDakIsZUFBUyxpRkFBb0IsQ0FBQyxNQUFNLFNBQVM7QUFBQSxRQUMzQyxhQUFhO0FBQUEsUUFDYixVQUFVO0FBQUEsUUFFVixPQUFPLFFBQVEsU0FBUyxTQUFTLFlBQVk7QUFBQSxRQUM3QyxPQUFPO0FBQUEsUUFDUCxVQUFVO0FBQUEsUUFDVixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxNQUNsQixDQUFDO0FBRUQsYUFBTyxTQUFTLEdBQUcsbUJBQW1CLE1BQU07QUFDMUMsY0FBTSxXQUFVLE9BQU8sU0FBUztBQUNoQyxzQkFBYyxRQUFPO0FBQUEsTUFDdkIsQ0FBQztBQUFBLElBQ0g7QUFFQSxXQUFPLE1BQU07QUFDWCxhQUFPLFFBQVE7QUFBQSxJQUNqQjtBQUFBLEVBQ0YsR0FBRyxDQUFDLENBQUM7QUFFTCxTQUFPLDJFQUFDO0FBQUEsSUFBSSxXQUFVO0FBQUEsSUFBUyxPQUFPLEVBQUUsV0FBVyxJQUFJO0FBQUEsSUFBRyxLQUFLO0FBQUEsR0FBTztBQUN4RTtBQUVBLGlFQUFlLE1BQU0sRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL0Bjd3JjL2xlYWZ3cml0ZXItY29tbW9ucy8uLi9jb3JlL3NyYy9jb21wb25lbnRzL2VkaXRTb3VyY2UvRWRpdG9yLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VUaGVtZSB9IGZyb20gJ0BtdWkvbWF0ZXJpYWwnO1xuLy8gaW1wb3J0ICogYXMgbW9uYWNvIGZyb20gJ21vbmFjby1lZGl0b3InO1xuaW1wb3J0ICogYXMgbW9uYWNvIGZyb20gJ21vbmFjby1lZGl0b3IvZXNtL3ZzL2VkaXRvci9lZGl0b3IuYXBpJztcbmltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVJlZiwgdHlwZSBGQyB9IGZyb20gJ3JlYWN0JztcblxuLy8gKiBJbnRlbGxpc2Vuc2UgZm9yIFhNTDogaHR0cHM6Ly9tb25vLnNvZnR3YXJlLzIwMTcvMDQvMTEvY3VzdG9tLWludGVsbGlzZW5zZS13aXRoLW1vbmFjby1lZGl0b3IvXG5cbi8vIEB0cy1pZ25vcmVcbi8vIHNlbGYuTW9uYWNvRW52aXJvbm1lbnQgPSB7XG4vLyAgIGdldFdvcmtlclVybDogZnVuY3Rpb24gKF9tb2R1bGVJZDogYW55LCBsYWJlbDogc3RyaW5nKSB7XG4vLyAgICAgcmV0dXJuICcuL2VkaXRvci53b3JrZXIuYnVuZGxlLmpzJztcbi8vICAgfSxcbi8vIH07XG5cbmludGVyZmFjZSBJRWRpdG9yIHtcbiAgY29udGVudDogc3RyaW5nO1xuICB1cGRhdGVDb250ZW50OiAodmFsdWU6IHN0cmluZykgPT4gdm9pZDtcbn1cblxuY29uc3QgRWRpdG9yOiBGQzxJRWRpdG9yPiA9ICh7IGNvbnRlbnQsIHVwZGF0ZUNvbnRlbnQgfSkgPT4ge1xuICBjb25zdCB7IHBhbGV0dGUgfSA9IHVzZVRoZW1lKCk7XG4gIGNvbnN0IGRpdkVsID0gdXNlUmVmPEhUTUxEaXZFbGVtZW50PihudWxsKTtcbiAgbGV0IGVkaXRvcjogbW9uYWNvLmVkaXRvci5JU3RhbmRhbG9uZUNvZGVFZGl0b3I7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoZGl2RWwuY3VycmVudCkge1xuICAgICAgZWRpdG9yID0gbW9uYWNvLmVkaXRvci5jcmVhdGUoZGl2RWwuY3VycmVudCwge1xuICAgICAgICBsaW5lTnVtYmVyczogJ29uJyxcbiAgICAgICAgbGFuZ3VhZ2U6ICd4bWwnLFxuICAgICAgICAvLyBtaW5pbWFwOiB7IGVuYWJsZWQ6IGZhbHNlIH0sXG4gICAgICAgIHRoZW1lOiBwYWxldHRlLm1vZGUgPT09ICdkYXJrJyA/ICd2cy1kYXJrJyA6ICd2cy1saWdodCcsXG4gICAgICAgIHZhbHVlOiBjb250ZW50LFxuICAgICAgICB3b3JkV3JhcDogJ3dvcmRXcmFwQ29sdW1uJyxcbiAgICAgICAgd29yZFdyYXBDb2x1bW46IDEwMCxcbiAgICAgICAgd3JhcHBpbmdJbmRlbnQ6ICdpbmRlbnQnLFxuICAgICAgfSk7XG5cbiAgICAgIGVkaXRvci5nZXRNb2RlbCgpPy5vbkRpZENoYW5nZUNvbnRlbnQoKCkgPT4ge1xuICAgICAgICBjb25zdCBjb250ZW50ID0gZWRpdG9yLmdldFZhbHVlKCk7XG4gICAgICAgIHVwZGF0ZUNvbnRlbnQoY29udGVudCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgZWRpdG9yLmRpc3Bvc2UoKTtcbiAgICB9O1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiRWRpdG9yXCIgc3R5bGU9e3sgbWluSGVpZ2h0OiA2MDAgfX0gcmVmPXtkaXZFbH0gLz47XG59O1xuXG5leHBvcnQgZGVmYXVsdCBFZGl0b3I7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=