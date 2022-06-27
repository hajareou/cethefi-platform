"use strict";
(self["webpackChunk_cwrc_leafwriter_commons"] = self["webpackChunk_cwrc_leafwriter_commons"] || []).push([["core_src_overmind_lookups_services_viaf_ts"],{

/***/ "../core/src/overmind/lookups/services/viaf.ts":
/*!*****************************************************!*\
  !*** ../core/src/overmind/lookups/services/viaf.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Viaf)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "../../node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../../../utilities */ "../core/src/utilities/index.ts");


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
      _utilities__WEBPACK_IMPORTED_MODULE_1__.log.warn(errorMsg);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvY29yZV9zcmNfb3Zlcm1pbmRfbG9va3Vwc19zZXJ2aWNlc192aWFmX3RzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUVBO0FBNkNlLE1BQU0sS0FBa0M7QUFBQSxFQU9yRCxjQUFjO0FBTGQsU0FBaUIsVUFBVTtBQUMzQixTQUFpQixTQUFTO0FBRTFCLFNBQWlCLFVBQVU7QUFHekIsU0FBSyxnQkFBZ0IsbURBQVksQ0FBQyxFQUFFLFNBQVMsS0FBSyxTQUFTLFNBQVMsS0FBSyxRQUFRLENBQUM7QUFBQSxFQUNwRjtBQUFBLEVBRUEsTUFBTSxLQUFLLEVBQUUsT0FBTyxRQUFxQjtBQUN2QyxRQUFJLFNBQVM7QUFBVSxhQUFPLE1BQU0sS0FBSyxTQUFTLE9BQU8sZUFBZTtBQUN4RSxRQUFJLFNBQVM7QUFBUyxhQUFPLE1BQU0sS0FBSyxTQUFTLE9BQU8saUJBQWlCO0FBQ3pFLFFBQUksU0FBUztBQUFnQixhQUFPLE1BQU0sS0FBSyxTQUFTLE9BQU8sZ0JBQWdCO0FBQy9FLFFBQUksU0FBUztBQUFTLGFBQU8sTUFBTSxLQUFLLFNBQVMsT0FBTyxtQkFBbUI7QUFDM0UsUUFBSSxTQUFTO0FBQU0sYUFBTyxNQUFNLEtBQUssU0FBUyxPQUFPLE9BQU87QUFFNUQsVUFBTSxJQUFJLE1BQU0scUJBQXFCO0FBQUEsRUFDdkM7QUFBQSxFQUVBLE1BQWMsU0FBUyxPQUFlLFlBQTZCO0FBQ2pFLFVBQU0sYUFBYSxtQkFBbUIsS0FBSztBQUUzQyxRQUFJLFdBQVc7QUFDZixnQkFBWSxlQUFlLHFCQUFxQjtBQUNoRCxnQkFBWSxlQUFlLEtBQUs7QUFHaEMsVUFBTSxXQUFXLE1BQU0sS0FBSyxjQUFjLElBQUksUUFBUSxFQUFFLE1BQU0sQ0FBQyxVQUFVO0FBQ3ZFLGFBQU87QUFBQSxRQUNMLFFBQVE7QUFBQSxRQUNSLFlBQVksb0NBQW9DLEtBQUs7QUFBQSxRQUNyRCxNQUFNO0FBQUEsTUFDUjtBQUFBLElBQ0YsQ0FBQztBQUVELFFBQUksU0FBUyxVQUFVLEtBQUs7QUFDMUIsWUFBTSxXQUFXO0FBQUE7QUFBQSxzQkFFRCxTQUFTO0FBQUE7QUFFekIsc0RBQVEsQ0FBQyxRQUFRO0FBQ2pCLGFBQU8sQ0FBQztBQUFBLElBQ1Y7QUFDQSxVQUFNLE9BQXFCLFNBQVM7QUFDcEMsUUFBSSxDQUFDLEtBQUssdUJBQXVCO0FBQVMsYUFBTyxDQUFDO0FBRWxELFVBQU0sVUFBcUIsS0FBSyx1QkFBdUIsUUFBUSxJQUFJLENBQUMsVUFBVTtBQUM1RSxZQUFNLEVBQUUsVUFBVSxVQUFVLGlCQUFpQixNQUFNLE9BQU87QUFDMUQsWUFBTSxNQUFNLFNBQVM7QUFHckIsWUFBTSxPQUFPLE1BQU0sUUFBUSxhQUFhLElBQUksSUFDeEMsYUFBYSxLQUFLLEdBQUcsT0FDckIsYUFBYSxLQUFLO0FBRXRCLGFBQU8sRUFBRSxJQUFJLEtBQUssTUFBTSxZQUFZLFFBQVEsT0FBTyxNQUFNLFVBQVUsSUFBSTtBQUFBLElBQ3pFLENBQUM7QUFFRCxXQUFPO0FBQUEsRUFDVDtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGN3cmMvbGVhZndyaXRlci1jb21tb25zLy4uL2NvcmUvc3JjL292ZXJtaW5kL2xvb2t1cHMvc2VydmljZXMvdmlhZi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MsIHsgdHlwZSBBeGlvc0luc3RhbmNlIH0gZnJvbSAnYXhpb3MnO1xuaW1wb3J0IHR5cGUgeyBJUmVzdWx0IH0gZnJvbSAnLi4vLi4vLi4vY29tcG9uZW50cy9lbnRpdHlMb29rdXBzL3R5cGVzJztcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4vLi4vLi4vLi4vdXRpbGl0aWVzJztcbmltcG9ydCBJTG9va3VwU2VydmljZUFwaSwgeyB0eXBlIElGaW5kUGFyYW1zIH0gZnJvbSAnLi90eXBlJztcblxudHlwZSBOYW1lZEVudGl0eVR5cGUgPVxuICB8ICdwZXJzb25hbE5hbWVzJ1xuICB8ICdnZW9ncmFwaGljTmFtZXMnXG4gIHwgJ2NvcnBvcmF0ZU5hbWVzJ1xuICB8ICd1bmlmb3JtVGl0bGVXb3JrcydcbiAgfCAnbmFtZXMnO1xuXG5pbnRlcmZhY2UgSVJlY29yZERhdGFNYWluSGVhZGluZ3NEYXRhIHtcbiAgW3g6IHN0cmluZ106IGFueTtcbiAgdGV4dDogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgSVJlY29yZERhdGEge1xuICBbeDogc3RyaW5nXTogYW55O1xuICBuYW1lVHlwZTogc3RyaW5nO1xuICBEb2N1bWVudDoge1xuICAgIFt4OiBzdHJpbmddOiBhbnk7XG4gICAgJ0BhYm91dCc6IHN0cmluZztcbiAgfTtcbiAgbWFpbkhlYWRpbmdzOiB7XG4gICAgW3g6IHN0cmluZ106IGFueTtcbiAgICBkYXRhOiBJUmVjb3JkRGF0YU1haW5IZWFkaW5nc0RhdGEgfCBJUmVjb3JkRGF0YU1haW5IZWFkaW5nc0RhdGFbXTtcbiAgfTtcbn1cblxuaW50ZXJmYWNlIElSZWNvcmQge1xuICByZWNvcmQ6IHtcbiAgICByZWNvcmREYXRhOiBJUmVjb3JkRGF0YTtcbiAgICByZWNvcmRQYWNraW5nOiBzdHJpbmc7XG4gICAgcmVjb3JkU2NoZW1hOiBzdHJpbmc7XG4gIH07XG59XG5cbmludGVyZmFjZSBJVklBRlJlc3VsdHMge1xuICBzZWFyY2hSZXRyaWV2ZVJlc3BvbnNlOiB7XG4gICAgbnVtYmVyT2ZSZWNvcmRzOiBzdHJpbmc7XG4gICAgcmVjb3JkczogSVJlY29yZFtdO1xuICAgIHJlc3VsdFNldElkbGVUaW1lOiBzdHJpbmc7XG4gICAgdmVyc2lvbjogc3RyaW5nO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWFmIGltcGxlbWVudHMgSUxvb2t1cFNlcnZpY2VBcGkge1xuICBwcml2YXRlIHJlYWRvbmx5IGF4aW9zSW5zdGFuY2U6IEF4aW9zSW5zdGFuY2U7XG4gIHByaXZhdGUgcmVhZG9ubHkgYmFzZVVSTCA9ICdodHRwczovL3ZpYWYub3JnL3ZpYWYnO1xuICBwcml2YXRlIHJlYWRvbmx5IEZPUk1BVCA9ICdhcHBsaWNhdGlvbi9qc29uJztcbiAgLy8gcHJpdmF0ZSByZWFkb25seSBNQVhfSElUUyA9IDEwOyAvL2RlZmF1bHQ6IDEwXG4gIHByaXZhdGUgcmVhZG9ubHkgdGltZW91dCA9IDNfMDAwO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYXhpb3NJbnN0YW5jZSA9IGF4aW9zLmNyZWF0ZSh7IGJhc2VVUkw6IHRoaXMuYmFzZVVSTCwgdGltZW91dDogdGhpcy50aW1lb3V0IH0pO1xuICB9XG5cbiAgYXN5bmMgZmluZCh7IHF1ZXJ5LCB0eXBlIH06IElGaW5kUGFyYW1zKSB7XG4gICAgaWYgKHR5cGUgPT09ICdwZXJzb24nKSByZXR1cm4gYXdhaXQgdGhpcy5jYWxsVklBRihxdWVyeSwgJ3BlcnNvbmFsTmFtZXMnKTtcbiAgICBpZiAodHlwZSA9PT0gJ3BsYWNlJykgcmV0dXJuIGF3YWl0IHRoaXMuY2FsbFZJQUYocXVlcnksICdnZW9ncmFwaGljTmFtZXMnKTtcbiAgICBpZiAodHlwZSA9PT0gJ29yZ2FuaXphdGlvbicpIHJldHVybiBhd2FpdCB0aGlzLmNhbGxWSUFGKHF1ZXJ5LCAnY29ycG9yYXRlTmFtZXMnKTtcbiAgICBpZiAodHlwZSA9PT0gJ3RpdGxlJykgcmV0dXJuIGF3YWl0IHRoaXMuY2FsbFZJQUYocXVlcnksICd1bmlmb3JtVGl0bGVXb3JrcycpO1xuICAgIGlmICh0eXBlID09PSAncnMnKSByZXR1cm4gYXdhaXQgdGhpcy5jYWxsVklBRihxdWVyeSwgJ25hbWVzJyk7XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0VudGl0eSB0eXBlIGludmFsaWQnKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgY2FsbFZJQUYocXVlcnk6IHN0cmluZywgbWV0aG9kTmFtZTogTmFtZWRFbnRpdHlUeXBlKSB7XG4gICAgY29uc3QgZW5jb2RlZFVyaSA9IGVuY29kZVVSSUNvbXBvbmVudChxdWVyeSk7XG5cbiAgICBsZXQgdXJsUXVlcnkgPSAnc2VhcmNoPyc7XG4gICAgdXJsUXVlcnkgKz0gYHF1ZXJ5PWxvY2FsLiR7bWV0aG9kTmFtZX0rYWxsKyUyMiR7ZW5jb2RlZFVyaX0lMjJgO1xuICAgIHVybFF1ZXJ5ICs9IGAmaHR0cEFjY2VwdD0ke3RoaXMuRk9STUFUfWA7XG4gICAgLy8gdXJsUXVlcnkgKz0gYCZtYXhpbXVtUmVjb3Jkcz0ke01BWF9ISVRTfWA7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuYXhpb3NJbnN0YW5jZS5nZXQodXJsUXVlcnkpLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgIHN0YXR1c1RleHQ6IGBUaGUgcmVxdWVzdCBleGVlZGVkIHRoZSB0aW1lb3V0ICgke3RoaXMudGltZW91dH0pYCxcbiAgICAgICAgZGF0YTogdW5kZWZpbmVkLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XG4gICAgICBjb25zdCBlcnJvck1zZyA9IGBcbiAgICAgICAgU29tZXRoaW5nIHdyb25nIHdpdGggdGhlIGNhbGwgdG8gREJQZWRpYSwgcG9zc2libHkgYSBwcm9ibGVtIHdpdGggdGhlIG5ldHdvcmsgb3IgdGhlIHNlcnZlci5cbiAgICAgICAgSFRUUCBlcnJvcjogJHtyZXNwb25zZS5zdGF0dXNUZXh0fVxuICAgICAgYDtcbiAgICAgIGxvZy53YXJuKGVycm9yTXNnKTtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgY29uc3QgZGF0YTogSVZJQUZSZXN1bHRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICBpZiAoIWRhdGEuc2VhcmNoUmV0cmlldmVSZXNwb25zZS5yZWNvcmRzKSByZXR1cm4gW107XG5cbiAgICBjb25zdCByZXN1bHRzOiBJUmVzdWx0W10gPSBkYXRhLnNlYXJjaFJldHJpZXZlUmVzcG9uc2UucmVjb3Jkcy5tYXAoKGVudHJ5KSA9PiB7XG4gICAgICBjb25zdCB7IG5hbWVUeXBlLCBEb2N1bWVudCwgbWFpbkhlYWRpbmdzIH0gPSBlbnRyeS5yZWNvcmQucmVjb3JkRGF0YTtcbiAgICAgIGNvbnN0IHVyaSA9IERvY3VtZW50WydAYWJvdXQnXTtcblxuICAgICAgLy8/IEFzc3VtZXMgdGhlIGZpcnN0IGluc3RhbmNlIG9mIG1haW5IZWFkaW5nXG4gICAgICBjb25zdCBuYW1lID0gQXJyYXkuaXNBcnJheShtYWluSGVhZGluZ3MuZGF0YSlcbiAgICAgICAgPyBtYWluSGVhZGluZ3MuZGF0YVswXS50ZXh0XG4gICAgICAgIDogbWFpbkhlYWRpbmdzLmRhdGEudGV4dDtcblxuICAgICAgcmV0dXJuIHsgaWQ6IHVyaSwgbmFtZSwgcmVwb3NpdG9yeTogJ3ZpYWYnLCBxdWVyeSwgdHlwZTogbmFtZVR5cGUsIHVyaSB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==