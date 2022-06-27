"use strict";
(self["webpackChunkleaf_writer"] = self["webpackChunkleaf_writer"] || []).push([[522],{

/***/ 21522:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Getty)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67620);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(53768);


class Getty {
  constructor() {
    this.baseURL = "https://lookup.services.cwrc.ca/getty";
    this.FORMAT = "json";
    this.MAX_HITS = 25;
    this.timeout = 3e3;
    this.axiosInstance = axios__WEBPACK_IMPORTED_MODULE_0___default().create({ baseURL: this.baseURL, timeout: this.timeout });
  }
  async find({ query, type }) {
    if (type === "person")
      return await this.callGetty(query, "ulan");
    if (type === "place")
      return await this.callGetty(query, "tgn");
    throw new Error("Entity type invalid");
  }
  getEntitySourceURI(query, gettyVocab) {
    const encodedQuery = encodeURIComponent(`select ?Subject ?Term ?Parents ?Descr ?ScopeNote ?Type (coalesce(?Type1,?Type2) as ?ExtraType) {
      ?Subject luc:term "${query}"; a ?typ; skos:inScheme ${gettyVocab}:.
      ?typ rdfs:subClassOf gvp:Subject; rdfs:label ?Type.
      filter (?typ != gvp:Subject)
      optional {?Subject gvp:placeTypePreferred [gvp:prefLabelGVP [xl:literalForm ?Type1]]}
      optional {?Subject gvp:agentTypePreferred [gvp:prefLabelGVP [xl:literalForm ?Type2]]}
      optional {?Subject gvp:prefLabelGVP [xl:literalForm ?Term]}
      optional {?Subject gvp:parentStringAbbrev ?Parents}
      optional {?Subject foaf:focus/gvp:biographyPreferred/schema:description ?Descr}
      optional {?Subject skos:scopeNote [dct:language gvp_lang:en; rdf:value ?ScopeNote]}}
      LIMIT ${this.MAX_HITS}`);
    return `sparql.${this.FORMAT}?query=${encodedQuery}`;
  }
  async callGetty(query, type) {
    const urlQuery = this.getEntitySourceURI(query, type);
    const response = await this.axiosInstance.get(urlQuery).catch((error) => {
      return {
        status: 500,
        statusText: `The request exeeded the timeout (${this.timeout})`,
        data: void 0
      };
    });
    if (response.status >= 400) {
      const errorMsg = `
        Something wrong with the call to Getty, possibly a problem with the network or the server.
        HTTP error: ${response.statusText}
      `;
      _utilities__WEBPACK_IMPORTED_MODULE_1__/* .log.warn */ .cM.warn(errorMsg);
      return [];
    }
    const data = response.data;
    if (!data)
      return [];
    const results = data.results.bindings.map(({ Subject, Term, Descr }) => {
      return {
        description: Descr?.value,
        id: Subject.value,
        name: Term.value,
        repository: "getty",
        type,
        query,
        uri: Subject.value
      };
    });
    return results;
  }
}


/***/ })

}]);
//# sourceMappingURL=522.js.map