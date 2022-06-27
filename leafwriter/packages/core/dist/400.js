"use strict";
(self["webpackChunkleaf_writer"] = self["webpackChunkleaf_writer"] || []).push([[400],{

/***/ 12400:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Nssi)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67620);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

class Nssi {
  constructor(config) {
    this.baseURL = "https://api.nssi.dev.lincsproject.ca/api/";
    this.timeout = 3e3;
    if (!config.token || config.token === "") {
      throw new Error("You must have a NSSI token to make requests to Geonames");
    }
    this.token = config.token;
    this.axiosInstance = axios__WEBPACK_IMPORTED_MODULE_0___default().create({ baseURL: this.baseURL, timeout: this.timeout });
  }
  async find({ query, type }) {
    return [];
  }
}


/***/ })

}]);
//# sourceMappingURL=400.js.map