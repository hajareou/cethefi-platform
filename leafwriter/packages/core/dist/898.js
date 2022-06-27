"use strict";
(self["webpackChunkleaf_writer"] = self["webpackChunkleaf_writer"] || []).push([[898],{

/***/ 78898:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Lgpn)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67620);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(53768);


class Lgpn {
  constructor() {
    this.baseURL = "https://lookup.services.cwrc.ca/lgpn2/cgi-bin";
    this.FORMAT = "json";
    this.timeout = 3e3;
    this.axiosInstance = axios__WEBPACK_IMPORTED_MODULE_0___default().create({ baseURL: this.baseURL, timeout: this.timeout });
  }
  async find({ query, type }) {
    if (type === "person")
      return await this.callLGPN(query, "person");
    if (type === "place")
      return await this.callLGPN(query, "place");
    throw new Error("Entity type invalid");
  }
  async callLGPN(query, type) {
    const encodedQuery = encodeURIComponent(query);
    let urlQuery = `lgpn_search.cgi?`;
    urlQuery += `name=${encodedQuery}`;
    urlQuery += `;style=${this.FORMAT}`;
    const response = await this.axiosInstance.get(urlQuery).catch((error) => {
      return {
        status: 500,
        statusText: `The request exeeded the timeout (${this.timeout})`,
        data: void 0
      };
    });
    if (response.status >= 400) {
      const errorMsg = `
        Something wrong with the call to LGPN, possibly a problem with the network or the server.
        HTTP error: ${response.statusText}
      `;
      _utilities__WEBPACK_IMPORTED_MODULE_1__/* .log.warn */ .cM.warn(errorMsg);
      return [];
    }
    const data = response.data;
    if (!data)
      return [];
    const start = data.indexOf("{");
    const end = data.lastIndexOf(");");
    const substr = data.substring(start, end);
    const dataObj = JSON.parse(substr);
    if (dataObj.persons.length === 0)
      return [];
    const results = dataObj.persons.map(({ id, name, place, notBefore, notAfter }) => {
      const description = `Place: ${place}<br/>Floruit: ${notBefore} to ${notAfter}`;
      return {
        description,
        id,
        name,
        repository: "lgpn",
        uri: `https://www.lgpn.ox.ac.uk/id/${id}`,
        query,
        type
      };
    });
    return results;
  }
}


/***/ })

}]);
//# sourceMappingURL=898.js.map