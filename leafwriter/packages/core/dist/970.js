"use strict";
(self["webpackChunkLeafwriter"] = self["webpackChunkLeafwriter"] || []).push([[970],{

/***/ 48970:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Geonames)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67620);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(53768);


class Geonames {
  constructor(config) {
    this.baseURL = "https://secure.geonames.org";
    this.MAX_HITS = 25;
    this.timeout = 3e3;
    if (!config?.username || config?.username === "") {
      _utilities__WEBPACK_IMPORTED_MODULE_1__/* .log.warn */ .cM.warn("GEONAME: You must define a username to be able to make requests to Geonames");
      return;
    }
    this.username = config.username;
    this.axiosInstance = axios__WEBPACK_IMPORTED_MODULE_0___default().create({ baseURL: this.baseURL, timeout: this.timeout });
  }
  async find({ query }) {
    return await this.callGeonames(query);
  }
  async callGeonames(query) {
    const encodedURI = encodeURIComponent(query);
    const params = new URLSearchParams({
      q: encodedURI,
      username: this.username,
      maxRows: this.MAX_HITS.toString()
    });
    const urlQuery = `searchJSON?$${params}`;
    const response = await this.axiosInstance.get(urlQuery).catch((error) => {
      return {
        status: 500,
        statusText: `The request exeeded the timeout (${this.timeout})`,
        data: void 0
      };
    });
    if (response.status >= 400) {
      const errorMsg = `
        Something wrong with the call to geonames, possibly a problem with the network or the server.
        HTTP error: ${response.statusText}
      `;
      _utilities__WEBPACK_IMPORTED_MODULE_1__/* .log.warn */ .cM.warn(errorMsg);
      return [];
    }
    const data = response.data;
    if (!data)
      return [];
    const results = data.geonames.map(({ toponymName, adminName1, countryName, geonameId, fcodeName }) => {
      const state = adminName1 ?? "";
      const description = fcodeName ?? "";
      const name = `${toponymName} ${state} ${countryName ?? ""}`;
      const uri = `https://geonames.org/${geonameId}`;
      return { description, id: uri, name, repository: "geonames", type: "place", query, uri };
    });
    return results;
  }
}


/***/ })

}]);
//# sourceMappingURL=970.js.map