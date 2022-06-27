"use strict";
(self["webpackChunkleaf_writer"] = self["webpackChunkleaf_writer"] || []).push([[86],{

/***/ 2086:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Dbpedia)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67620);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(53768);


class Dbpedia {
  constructor() {
    this.baseURL = "https://lookup.dbpedia.org/api/search";
    this.FORMAT = "json";
    this.MAX_HITS = 25;
    this.timeout = 3e3;
    this.axiosInstance = axios__WEBPACK_IMPORTED_MODULE_0___default().create({ baseURL: this.baseURL, timeout: this.timeout });
  }
  async find({ query, type }) {
    if (type === "person")
      return await this.callDBPedia(query, "person");
    if (type === "place")
      return await this.callDBPedia(query, "place");
    if (type === "organization")
      return await this.callDBPedia(query, "organisation");
    if (type === "title")
      return await this.callDBPedia(query, "work");
    if (type === "rs")
      return await this.callDBPedia(query, "thing");
    throw new Error("Entity type invalid");
  }
  async callDBPedia(query, type) {
    const encodeQueryString = encodeURIComponent(query);
    const params = new URLSearchParams({
      QueryClass: type,
      QueryString: encodeQueryString,
      format: this.FORMAT,
      MaxHits: this.MAX_HITS.toString()
    });
    const urlQuery = `KeywordSearch?$${params}`;
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
    if (!data)
      return [];
    const results = data.docs.map(({ comment, label, resource }) => {
      const description = comment?.[0] ?? "No description available";
      const name = label[0].replace(/(<([^>]+)>)/gi, "");
      const uri = resource[0];
      return { description, id: uri, name, repository: "dbpedia", query, type, uri };
    });
    return results;
  }
}


/***/ })

}]);
//# sourceMappingURL=86.js.map