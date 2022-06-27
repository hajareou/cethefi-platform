"use strict";
(self["webpackChunkleaf_writer"] = self["webpackChunkleaf_writer"] || []).push([[69],{

/***/ 35069:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Viaf)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67620);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(53768);


class Viaf {
  constructor() {
    this.baseURL = "https://viaf.org/viaf";
    this.FORMAT = "application/json";
    this.timeout = 3e3;
    this.axiosInstance = axios__WEBPACK_IMPORTED_MODULE_0___default().create({ baseURL: this.baseURL, timeout: this.timeout });
  }
  async find({ query, type }) {
    if (type === "person")
      return await this.callVIAF(query, "personalNames");
    if (type === "place")
      return await this.callVIAF(query, "geographicNames");
    if (type === "organization")
      return await this.callVIAF(query, "corporateNames");
    if (type === "title")
      return await this.callVIAF(query, "uniformTitleWorks");
    if (type === "rs")
      return await this.callVIAF(query, "names");
    throw new Error("Entity type invalid");
  }
  async callVIAF(query, methodName) {
    const encodedUri = encodeURIComponent(query);
    let urlQuery = "search?";
    urlQuery += `query=local.${methodName}+all+%22${encodedUri}%22`;
    urlQuery += `&httpAccept=${this.FORMAT}`;
    const response = await this.axiosInstance.get(urlQuery).catch((error) => {
      return {
        status: 500,
        statusText: `The request exeeded the timeout (${this.timeout})`,
        data: void 0
      };
    });
    if (response.status >= 400) {
      const errorMsg = `
        Something wrong with the call to DBPedia, possibly a problem with the network or the server.
        HTTP error: ${response.statusText}
      `;
      _utilities__WEBPACK_IMPORTED_MODULE_1__/* .log.warn */ .cM.warn(errorMsg);
      return [];
    }
    const data = response.data;
    if (!data.searchRetrieveResponse.records)
      return [];
    const results = data.searchRetrieveResponse.records.map((entry) => {
      const { nameType, Document, mainHeadings } = entry.record.recordData;
      const uri = Document["@about"];
      const name = Array.isArray(mainHeadings.data) ? mainHeadings.data[0].text : mainHeadings.data.text;
      return { id: uri, name, repository: "viaf", query, type: nameType, uri };
    });
    return results;
  }
}


/***/ })

}]);
//# sourceMappingURL=69.js.map