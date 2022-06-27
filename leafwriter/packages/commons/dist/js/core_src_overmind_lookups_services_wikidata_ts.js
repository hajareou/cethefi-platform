"use strict";
(self["webpackChunk_cwrc_leafwriter_commons"] = self["webpackChunk_cwrc_leafwriter_commons"] || []).push([["core_src_overmind_lookups_services_wikidata_ts"],{

/***/ "../core/src/overmind/lookups/services/wikidata.ts":
/*!*********************************************************!*\
  !*** ../core/src/overmind/lookups/services/wikidata.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Wikidata)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "../../node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var wikidata_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! wikidata-sdk */ "../../node_modules/wikidata-sdk/wikidata-sdk.js");
/* harmony import */ var wikidata_sdk__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(wikidata_sdk__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../../utilities */ "../core/src/utilities/index.ts");



class Wikidata {
  constructor() {
    this.baseURL = "";
    this.FORMAT = "json";
    this.LANGUAGE = "en";
    this.timeout = 3e3;
    this.axiosInstance = axios__WEBPACK_IMPORTED_MODULE_0___default().create({ baseURL: this.baseURL, timeout: this.timeout });
  }
  async find({ query, type }) {
    if (type === "person")
      return await this.callWikidata(query, "person");
    if (type === "place")
      return await this.callWikidata(query, "place");
    if (type === "organization")
      return await this.callWikidata(query, "org");
    if (type === "title")
      return await this.callWikidata(query, "title");
    if (type === "rs")
      return await this.callWikidata(query, "rs");
    throw new Error("Entity type invalid");
  }
  async callWikidata(query, type) {
    const url = wikidata_sdk__WEBPACK_IMPORTED_MODULE_1___default().searchEntities({
      search: query,
      format: this.FORMAT,
      language: this.LANGUAGE
    });
    const response = await this.axiosInstance.get(url).catch((error) => {
      return {
        status: 500,
        statusText: `The request exeeded the timeout (${this.timeout})`,
        data: void 0
      };
    });
    if (response.status >= 400) {
      const errorMsg = `
        Something wrong with the call to Wikidata, possibly a problem with the network or the server.
        HTTP error: ${response.statusText}
      `;
      _utilities__WEBPACK_IMPORTED_MODULE_2__.log.warn(errorMsg);
      return [];
    }
    const data = response.data;
    if (!data)
      return [];
    const results = data.search.map(({ concepturi, label, description }) => {
      return {
        description,
        id: concepturi,
        name: label,
        repository: "wikidata",
        query,
        type,
        uri: concepturi
      };
    });
    return results;
  }
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvY29yZV9zcmNfb3Zlcm1pbmRfbG9va3Vwc19zZXJ2aWNlc193aWtpZGF0YV90cy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBRUE7QUE4QmUsTUFBTSxTQUFzQztBQUFBLEVBUXpELGNBQWM7QUFOZCxTQUFpQixVQUFVO0FBQzNCLFNBQWlCLFNBQVM7QUFFMUIsU0FBaUIsV0FBVztBQUM1QixTQUFpQixVQUFVO0FBR3pCLFNBQUssZ0JBQWdCLG1EQUFZLENBQUMsRUFBRSxTQUFTLEtBQUssU0FBUyxTQUFTLEtBQUssUUFBUSxDQUFDO0FBQUEsRUFDcEY7QUFBQSxFQUVBLE1BQU0sS0FBSyxFQUFFLE9BQU8sUUFBcUI7QUFDdkMsUUFBSSxTQUFTO0FBQVUsYUFBTyxNQUFNLEtBQUssYUFBYSxPQUFPLFFBQVE7QUFDckUsUUFBSSxTQUFTO0FBQVMsYUFBTyxNQUFNLEtBQUssYUFBYSxPQUFPLE9BQU87QUFDbkUsUUFBSSxTQUFTO0FBQWdCLGFBQU8sTUFBTSxLQUFLLGFBQWEsT0FBTyxLQUFLO0FBQ3hFLFFBQUksU0FBUztBQUFTLGFBQU8sTUFBTSxLQUFLLGFBQWEsT0FBTyxPQUFPO0FBQ25FLFFBQUksU0FBUztBQUFNLGFBQU8sTUFBTSxLQUFLLGFBQWEsT0FBTyxJQUFJO0FBRTdELFVBQU0sSUFBSSxNQUFNLHFCQUFxQjtBQUFBLEVBQ3ZDO0FBQUEsRUFFQSxNQUFjLGFBQWEsT0FBZSxNQUF1QjtBQUMvRCxVQUFNLE1BQU0sa0VBQWtCLENBQUM7QUFBQSxNQUM3QixRQUFRO0FBQUEsTUFDUixRQUFRLEtBQUs7QUFBQSxNQUNiLFVBQVUsS0FBSztBQUFBLElBRWpCLENBQUM7QUFFRCxVQUFNLFdBQVcsTUFBTSxLQUFLLGNBQWMsSUFBSSxHQUFHLEVBQUUsTUFBTSxDQUFDLFVBQVU7QUFDbEUsYUFBTztBQUFBLFFBQ0wsUUFBUTtBQUFBLFFBQ1IsWUFBWSxvQ0FBb0MsS0FBSztBQUFBLFFBQ3JELE1BQU07QUFBQSxNQUNSO0FBQUEsSUFDRixDQUFDO0FBRUQsUUFBSSxTQUFTLFVBQVUsS0FBSztBQUMxQixZQUFNLFdBQVc7QUFBQTtBQUFBLHNCQUVELFNBQVM7QUFBQTtBQUV6QixzREFBUSxDQUFDLFFBQVE7QUFDakIsYUFBTyxDQUFDO0FBQUEsSUFDVjtBQUVBLFVBQU0sT0FBeUIsU0FBUztBQUN4QyxRQUFJLENBQUM7QUFBTSxhQUFPLENBQUM7QUFFbkIsVUFBTSxVQUFxQixLQUFLLE9BQU8sSUFBSSxDQUFDLEVBQUUsWUFBWSxPQUFPLGtCQUFrQjtBQUNqRixhQUFPO0FBQUEsUUFDTDtBQUFBLFFBQ0EsSUFBSTtBQUFBLFFBQ0osTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLFFBQ1o7QUFBQSxRQUNBO0FBQUEsUUFDQSxLQUFLO0FBQUEsTUFDUDtBQUFBLElBQ0YsQ0FBQztBQUVELFdBQU87QUFBQSxFQUNUO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AY3dyYy9sZWFmd3JpdGVyLWNvbW1vbnMvLi4vY29yZS9zcmMvb3Zlcm1pbmQvbG9va3Vwcy9zZXJ2aWNlcy93aWtpZGF0YS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MsIHsgdHlwZSBBeGlvc0luc3RhbmNlIH0gZnJvbSAnYXhpb3MnO1xuaW1wb3J0IHdkayBmcm9tICd3aWtpZGF0YS1zZGsnO1xuaW1wb3J0IHR5cGUgeyBJUmVzdWx0IH0gZnJvbSAnLi4vLi4vLi4vY29tcG9uZW50cy9lbnRpdHlMb29rdXBzL3R5cGVzJztcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4vLi4vLi4vLi4vdXRpbGl0aWVzJztcbmltcG9ydCBJTG9va3VwU2VydmljZUFwaSwgeyB0eXBlIElGaW5kUGFyYW1zIH0gZnJvbSAnLi90eXBlJztcblxudHlwZSBOYW1lZEVudGl0eVR5cGUgPSAncGVyc29uJyB8ICdwbGFjZScgfCAnb3JnJyB8ICd0aXRsZScgfCAncnMnO1xuXG5pbnRlcmZhY2UgSVJlY29yZCB7XG4gIGlkOiBzdHJpbmc7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIHBhZ2VpZDogbnVtYmVyO1xuICByZXBvc2l0b3J5OiBzdHJpbmc7XG4gIHVybDogc3RyaW5nO1xuICBjb25jZXB0dXJpOiBzdHJpbmc7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gIG1hdGNoOiB7XG4gICAgdHlwZTogc3RyaW5nO1xuICAgIGxhbmd1YWdlOiBzdHJpbmc7XG4gICAgdGV4dDogc3RyaW5nO1xuICB9O1xufVxuXG5pbnRlcmZhY2UgSVdpa2lkYXRhUmVzdWx0cyB7XG4gIHNlYXJjaGluZm86IHtcbiAgICBzZWFyY2g6IHN0cmluZztcbiAgfTtcbiAgc2VhcmNoOiBJUmVjb3JkW107XG4gICdzZWFyY2gtY29udGludWUnOiBzdHJpbmc7XG4gIHN1Y2Nlc3M6IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2lraWRhdGEgaW1wbGVtZW50cyBJTG9va3VwU2VydmljZUFwaSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgYXhpb3NJbnN0YW5jZTogQXhpb3NJbnN0YW5jZTtcbiAgcHJpdmF0ZSByZWFkb25seSBiYXNlVVJMID0gJyc7XG4gIHByaXZhdGUgcmVhZG9ubHkgRk9STUFUID0gJ2pzb24nO1xuICAvLyBwcml2YXRlIHJlYWRvbmx5IE1BWF9ISVRTID0gMjA7IC8vZGVmYXV0OiAyMFxuICBwcml2YXRlIHJlYWRvbmx5IExBTkdVQUdFID0gJ2VuJztcbiAgcHJpdmF0ZSByZWFkb25seSB0aW1lb3V0ID0gM18wMDA7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5heGlvc0luc3RhbmNlID0gYXhpb3MuY3JlYXRlKHsgYmFzZVVSTDogdGhpcy5iYXNlVVJMLCB0aW1lb3V0OiB0aGlzLnRpbWVvdXQgfSk7XG4gIH1cblxuICBhc3luYyBmaW5kKHsgcXVlcnksIHR5cGUgfTogSUZpbmRQYXJhbXMpIHtcbiAgICBpZiAodHlwZSA9PT0gJ3BlcnNvbicpIHJldHVybiBhd2FpdCB0aGlzLmNhbGxXaWtpZGF0YShxdWVyeSwgJ3BlcnNvbicpO1xuICAgIGlmICh0eXBlID09PSAncGxhY2UnKSByZXR1cm4gYXdhaXQgdGhpcy5jYWxsV2lraWRhdGEocXVlcnksICdwbGFjZScpO1xuICAgIGlmICh0eXBlID09PSAnb3JnYW5pemF0aW9uJykgcmV0dXJuIGF3YWl0IHRoaXMuY2FsbFdpa2lkYXRhKHF1ZXJ5LCAnb3JnJyk7XG4gICAgaWYgKHR5cGUgPT09ICd0aXRsZScpIHJldHVybiBhd2FpdCB0aGlzLmNhbGxXaWtpZGF0YShxdWVyeSwgJ3RpdGxlJyk7XG4gICAgaWYgKHR5cGUgPT09ICdycycpIHJldHVybiBhd2FpdCB0aGlzLmNhbGxXaWtpZGF0YShxdWVyeSwgJ3JzJyk7XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0VudGl0eSB0eXBlIGludmFsaWQnKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgY2FsbFdpa2lkYXRhKHF1ZXJ5OiBzdHJpbmcsIHR5cGU6IE5hbWVkRW50aXR5VHlwZSkge1xuICAgIGNvbnN0IHVybCA9IHdkay5zZWFyY2hFbnRpdGllcyh7XG4gICAgICBzZWFyY2g6IHF1ZXJ5LFxuICAgICAgZm9ybWF0OiB0aGlzLkZPUk1BVCxcbiAgICAgIGxhbmd1YWdlOiB0aGlzLkxBTkdVQUdFLFxuICAgICAgLy8gbGltaXQ6IE1BWF9ISVRTLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmF4aW9zSW5zdGFuY2UuZ2V0KHVybCkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgc3RhdHVzVGV4dDogYFRoZSByZXF1ZXN0IGV4ZWVkZWQgdGhlIHRpbWVvdXQgKCR7dGhpcy50aW1lb3V0fSlgLFxuICAgICAgICBkYXRhOiB1bmRlZmluZWQsXG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcbiAgICAgIGNvbnN0IGVycm9yTXNnID0gYFxuICAgICAgICBTb21ldGhpbmcgd3Jvbmcgd2l0aCB0aGUgY2FsbCB0byBXaWtpZGF0YSwgcG9zc2libHkgYSBwcm9ibGVtIHdpdGggdGhlIG5ldHdvcmsgb3IgdGhlIHNlcnZlci5cbiAgICAgICAgSFRUUCBlcnJvcjogJHtyZXNwb25zZS5zdGF0dXNUZXh0fVxuICAgICAgYDtcbiAgICAgIGxvZy53YXJuKGVycm9yTXNnKTtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhOiBJV2lraWRhdGFSZXN1bHRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICBpZiAoIWRhdGEpIHJldHVybiBbXTtcblxuICAgIGNvbnN0IHJlc3VsdHM6IElSZXN1bHRbXSA9IGRhdGEuc2VhcmNoLm1hcCgoeyBjb25jZXB0dXJpLCBsYWJlbCwgZGVzY3JpcHRpb24gfSkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgIGlkOiBjb25jZXB0dXJpLFxuICAgICAgICBuYW1lOiBsYWJlbCxcbiAgICAgICAgcmVwb3NpdG9yeTogJ3dpa2lkYXRhJyxcbiAgICAgICAgcXVlcnksXG4gICAgICAgIHR5cGUsXG4gICAgICAgIHVyaTogY29uY2VwdHVyaSxcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9