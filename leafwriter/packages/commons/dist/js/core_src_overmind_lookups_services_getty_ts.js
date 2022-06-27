"use strict";
(self["webpackChunk_cwrc_leafwriter_commons"] = self["webpackChunk_cwrc_leafwriter_commons"] || []).push([["core_src_overmind_lookups_services_getty_ts"],{

/***/ "../core/src/overmind/lookups/services/getty.ts":
/*!******************************************************!*\
  !*** ../core/src/overmind/lookups/services/getty.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Getty)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "../../node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../../../utilities */ "../core/src/utilities/index.ts");


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
      _utilities__WEBPACK_IMPORTED_MODULE_1__.log.warn(errorMsg);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvY29yZV9zcmNfb3Zlcm1pbmRfbG9va3Vwc19zZXJ2aWNlc19nZXR0eV90cy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFFQTtBQThCZSxNQUFNLE1BQW1DO0FBQUEsRUFXdEQsY0FBYztBQUxkLFNBQWlCLFVBQVU7QUFDM0IsU0FBaUIsU0FBUztBQUMxQixTQUFpQixXQUFXO0FBQzVCLFNBQWlCLFVBQVU7QUFHekIsU0FBSyxnQkFBZ0IsbURBQVksQ0FBQyxFQUFFLFNBQVMsS0FBSyxTQUFTLFNBQVMsS0FBSyxRQUFRLENBQUM7QUFBQSxFQUNwRjtBQUFBLEVBRUEsTUFBTSxLQUFLLEVBQUUsT0FBTyxRQUFxQjtBQUN2QyxRQUFJLFNBQVM7QUFBVSxhQUFPLE1BQU0sS0FBSyxVQUFVLE9BQU8sTUFBTTtBQUNoRSxRQUFJLFNBQVM7QUFBUyxhQUFPLE1BQU0sS0FBSyxVQUFVLE9BQU8sS0FBSztBQUU5RCxVQUFNLElBQUksTUFBTSxxQkFBcUI7QUFBQSxFQUN2QztBQUFBLEVBRUEsbUJBQTJCLE9BQWUsWUFBNkI7QUFDckUsVUFBTSxlQUNKLG1CQUFtQjtBQUFBLDJCQUNFLGlDQUFpQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxjQVM5QyxLQUFLLFVBQVU7QUFFekIsV0FBTyxVQUFVLEtBQUssZ0JBQWdCO0FBQUEsRUFDeEM7QUFBQSxFQUVBLE1BQWMsVUFBVSxPQUFlLE1BQXVCO0FBQzVELFVBQU0sV0FBVyxLQUFLLG1CQUFtQixPQUFPLElBQUk7QUFFcEQsVUFBTSxXQUFXLE1BQU0sS0FBSyxjQUFjLElBQUksUUFBUSxFQUFFLE1BQU0sQ0FBQyxVQUFVO0FBQ3ZFLGFBQU87QUFBQSxRQUNMLFFBQVE7QUFBQSxRQUNSLFlBQVksb0NBQW9DLEtBQUs7QUFBQSxRQUNyRCxNQUFNO0FBQUEsTUFDUjtBQUFBLElBQ0YsQ0FBQztBQUVELFFBQUksU0FBUyxVQUFVLEtBQUs7QUFDMUIsWUFBTSxXQUFXO0FBQUE7QUFBQSxzQkFFRCxTQUFTO0FBQUE7QUFFekIsc0RBQVEsQ0FBQyxRQUFRO0FBQ2pCLGFBQU8sQ0FBQztBQUFBLElBQ1Y7QUFFQSxVQUFNLE9BQXFCLFNBQVM7QUFDcEMsUUFBSSxDQUFDO0FBQU0sYUFBTyxDQUFDO0FBRW5CLFVBQU0sVUFBcUIsS0FBSyxRQUFRLFNBQVMsSUFBSSxDQUFDLEVBQUUsU0FBUyxNQUFNLFlBQVk7QUFDakYsYUFBTztBQUFBLFFBQ0wsYUFBYSxPQUFPO0FBQUEsUUFDcEIsSUFBSSxRQUFRO0FBQUEsUUFDWixNQUFNLEtBQUs7QUFBQSxRQUNYLFlBQVk7QUFBQSxRQUNaO0FBQUEsUUFDQTtBQUFBLFFBQ0EsS0FBSyxRQUFRO0FBQUEsTUFDZjtBQUFBLElBQ0YsQ0FBQztBQUVELFdBQU87QUFBQSxFQUNUO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AY3dyYy9sZWFmd3JpdGVyLWNvbW1vbnMvLi4vY29yZS9zcmMvb3Zlcm1pbmQvbG9va3Vwcy9zZXJ2aWNlcy9nZXR0eS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MsIHsgdHlwZSBBeGlvc0luc3RhbmNlIH0gZnJvbSAnYXhpb3MnO1xuaW1wb3J0IHsgdHlwZSBJUmVzdWx0IH0gZnJvbSAnLi4vLi4vLi4vY29tcG9uZW50cy9lbnRpdHlMb29rdXBzL3R5cGVzJztcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4vLi4vLi4vLi4vdXRpbGl0aWVzJztcbmltcG9ydCBJTG9va3VwU2VydmljZUFwaSwgeyB0eXBlIElGaW5kUGFyYW1zIH0gZnJvbSAnLi90eXBlJztcblxudHlwZSBOYW1lZEVudGl0eVR5cGUgPSAndWxhbicgfCAndGduJztcblxuaW50ZXJmYWNlIElCaW5kaW5nIHtcbiAgW3g6IHN0cmluZ106IGFueTtcbiAgRGVzY3I6IHtcbiAgICB0eXBlOiBzdHJpbmc7XG4gICAgdmFsdWU6IHN0cmluZztcbiAgfTtcbiAgU3ViamVjdDoge1xuICAgIHR5cGU6IHN0cmluZztcbiAgICB2YWx1ZTogc3RyaW5nO1xuICB9O1xuICBUZXJtOiB7XG4gICAgdHlwZTogc3RyaW5nO1xuICAgIHZhbHVlOiBzdHJpbmc7XG4gIH07XG59XG5cbmludGVyZmFjZSBJTEdQTlJlc3VsdHMge1xuICBoZWFkZXI6IHtcbiAgICB2YXJzOiBzdHJpbmdbXTtcbiAgfTtcbiAgcmVzdWx0czoge1xuICAgIGJpbmRpbmdzOiBJQmluZGluZ1tdO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHZXR0eSBpbXBsZW1lbnRzIElMb29rdXBTZXJ2aWNlQXBpIHtcbiAgcHJpdmF0ZSByZWFkb25seSBheGlvc0luc3RhbmNlOiBBeGlvc0luc3RhbmNlO1xuXG4gIC8vIENhbGxzIGEgY3dyYyBwcm94eSAoaHR0cHM6Ly9sb29rdXAuc2VydmljZXMuY3dyYy5jYS9nZXR0eSksIHNvIHRoYXQgd2UgY2FuIG1ha2UgaHR0cHMgY2FsbHMgZnJvbSB0aGUgYnJvd3Nlci5cbiAgLy8gVGhlIHByb3h5IGluIHR1cm4gdGhlbiBjYWxscyBodHRwOi8vdm9jYWIuZ2V0dHkuZWR1XG4gIC8vIFRoZSBnZXR0eSBsb29rdXAgZG9lc24ndCBzZWVtIHRvIGhhdmUgYW4gaHR0cHMgZW5kcG9pbnRcbiAgcHJpdmF0ZSByZWFkb25seSBiYXNlVVJMID0gJ2h0dHBzOi8vbG9va3VwLnNlcnZpY2VzLmN3cmMuY2EvZ2V0dHknO1xuICBwcml2YXRlIHJlYWRvbmx5IEZPUk1BVCA9ICdqc29uJztcbiAgcHJpdmF0ZSByZWFkb25seSBNQVhfSElUUyA9IDI1OyAvLyBkZWZhdWx0OiB1bmxpbWl0ZWQ/IChvdmVyIDEwMClcbiAgcHJpdmF0ZSByZWFkb25seSB0aW1lb3V0ID0gM18wMDA7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5heGlvc0luc3RhbmNlID0gYXhpb3MuY3JlYXRlKHsgYmFzZVVSTDogdGhpcy5iYXNlVVJMLCB0aW1lb3V0OiB0aGlzLnRpbWVvdXQgfSk7XG4gIH1cblxuICBhc3luYyBmaW5kKHsgcXVlcnksIHR5cGUgfTogSUZpbmRQYXJhbXMpIHtcbiAgICBpZiAodHlwZSA9PT0gJ3BlcnNvbicpIHJldHVybiBhd2FpdCB0aGlzLmNhbGxHZXR0eShxdWVyeSwgJ3VsYW4nKTtcbiAgICBpZiAodHlwZSA9PT0gJ3BsYWNlJykgcmV0dXJuIGF3YWl0IHRoaXMuY2FsbEdldHR5KHF1ZXJ5LCAndGduJyk7XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0VudGl0eSB0eXBlIGludmFsaWQnKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RW50aXR5U291cmNlVVJJKHF1ZXJ5OiBzdHJpbmcsIGdldHR5Vm9jYWI6IE5hbWVkRW50aXR5VHlwZSkge1xuICAgIGNvbnN0IGVuY29kZWRRdWVyeSA9XG4gICAgICBlbmNvZGVVUklDb21wb25lbnQoYHNlbGVjdCA/U3ViamVjdCA/VGVybSA/UGFyZW50cyA/RGVzY3IgP1Njb3BlTm90ZSA/VHlwZSAoY29hbGVzY2UoP1R5cGUxLD9UeXBlMikgYXMgP0V4dHJhVHlwZSkge1xuICAgICAgP1N1YmplY3QgbHVjOnRlcm0gXCIke3F1ZXJ5fVwiOyBhID90eXA7IHNrb3M6aW5TY2hlbWUgJHtnZXR0eVZvY2FifTouXG4gICAgICA/dHlwIHJkZnM6c3ViQ2xhc3NPZiBndnA6U3ViamVjdDsgcmRmczpsYWJlbCA/VHlwZS5cbiAgICAgIGZpbHRlciAoP3R5cCAhPSBndnA6U3ViamVjdClcbiAgICAgIG9wdGlvbmFsIHs/U3ViamVjdCBndnA6cGxhY2VUeXBlUHJlZmVycmVkIFtndnA6cHJlZkxhYmVsR1ZQIFt4bDpsaXRlcmFsRm9ybSA/VHlwZTFdXX1cbiAgICAgIG9wdGlvbmFsIHs/U3ViamVjdCBndnA6YWdlbnRUeXBlUHJlZmVycmVkIFtndnA6cHJlZkxhYmVsR1ZQIFt4bDpsaXRlcmFsRm9ybSA/VHlwZTJdXX1cbiAgICAgIG9wdGlvbmFsIHs/U3ViamVjdCBndnA6cHJlZkxhYmVsR1ZQIFt4bDpsaXRlcmFsRm9ybSA/VGVybV19XG4gICAgICBvcHRpb25hbCB7P1N1YmplY3QgZ3ZwOnBhcmVudFN0cmluZ0FiYnJldiA/UGFyZW50c31cbiAgICAgIG9wdGlvbmFsIHs/U3ViamVjdCBmb2FmOmZvY3VzL2d2cDpiaW9ncmFwaHlQcmVmZXJyZWQvc2NoZW1hOmRlc2NyaXB0aW9uID9EZXNjcn1cbiAgICAgIG9wdGlvbmFsIHs/U3ViamVjdCBza29zOnNjb3BlTm90ZSBbZGN0Omxhbmd1YWdlIGd2cF9sYW5nOmVuOyByZGY6dmFsdWUgP1Njb3BlTm90ZV19fVxuICAgICAgTElNSVQgJHt0aGlzLk1BWF9ISVRTfWApO1xuXG4gICAgcmV0dXJuIGBzcGFycWwuJHt0aGlzLkZPUk1BVH0/cXVlcnk9JHtlbmNvZGVkUXVlcnl9YDtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgY2FsbEdldHR5KHF1ZXJ5OiBzdHJpbmcsIHR5cGU6IE5hbWVkRW50aXR5VHlwZSkge1xuICAgIGNvbnN0IHVybFF1ZXJ5ID0gdGhpcy5nZXRFbnRpdHlTb3VyY2VVUkkocXVlcnksIHR5cGUpO1xuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmF4aW9zSW5zdGFuY2UuZ2V0KHVybFF1ZXJ5KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICBzdGF0dXNUZXh0OiBgVGhlIHJlcXVlc3QgZXhlZWRlZCB0aGUgdGltZW91dCAoJHt0aGlzLnRpbWVvdXR9KWAsXG4gICAgICAgIGRhdGE6IHVuZGVmaW5lZCxcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xuICAgICAgY29uc3QgZXJyb3JNc2cgPSBgXG4gICAgICAgIFNvbWV0aGluZyB3cm9uZyB3aXRoIHRoZSBjYWxsIHRvIEdldHR5LCBwb3NzaWJseSBhIHByb2JsZW0gd2l0aCB0aGUgbmV0d29yayBvciB0aGUgc2VydmVyLlxuICAgICAgICBIVFRQIGVycm9yOiAke3Jlc3BvbnNlLnN0YXR1c1RleHR9XG4gICAgICBgO1xuICAgICAgbG9nLndhcm4oZXJyb3JNc2cpO1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnN0IGRhdGE6IElMR1BOUmVzdWx0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgaWYgKCFkYXRhKSByZXR1cm4gW107XG5cbiAgICBjb25zdCByZXN1bHRzOiBJUmVzdWx0W10gPSBkYXRhLnJlc3VsdHMuYmluZGluZ3MubWFwKCh7IFN1YmplY3QsIFRlcm0sIERlc2NyIH0pID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGRlc2NyaXB0aW9uOiBEZXNjcj8udmFsdWUsXG4gICAgICAgIGlkOiBTdWJqZWN0LnZhbHVlLFxuICAgICAgICBuYW1lOiBUZXJtLnZhbHVlLFxuICAgICAgICByZXBvc2l0b3J5OiAnZ2V0dHknLFxuICAgICAgICB0eXBlLFxuICAgICAgICBxdWVyeSxcbiAgICAgICAgdXJpOiBTdWJqZWN0LnZhbHVlLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=