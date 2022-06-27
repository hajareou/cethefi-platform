"use strict";
(self["webpackChunk_cwrc_leafwriter_commons"] = self["webpackChunk_cwrc_leafwriter_commons"] || []).push([["core_src_overmind_lookups_services_geonames_ts"],{

/***/ "../core/src/overmind/lookups/services/geonames.ts":
/*!*********************************************************!*\
  !*** ../core/src/overmind/lookups/services/geonames.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Geonames)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "../../node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../../../utilities */ "../core/src/utilities/index.ts");


class Geonames {
  constructor(config) {
    this.baseURL = "https://secure.geonames.org";
    this.MAX_HITS = 25;
    this.timeout = 3e3;
    if (!config?.username || config?.username === "") {
      _utilities__WEBPACK_IMPORTED_MODULE_1__.log.warn("GEONAME: You must define a username to be able to make requests to Geonames");
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
      _utilities__WEBPACK_IMPORTED_MODULE_1__.log.warn(errorMsg);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvY29yZV9zcmNfb3Zlcm1pbmRfbG9va3Vwc19zZXJ2aWNlc19nZW9uYW1lc190cy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFFQTtBQWlCZSxNQUFNLFNBQXNDO0FBQUEsRUFPekQsWUFBWSxRQUFhO0FBTHpCLFNBQWlCLFVBQVU7QUFDM0IsU0FBaUIsV0FBVztBQUM1QixTQUFpQixVQUFVO0FBSXpCLFFBQUksQ0FBQyxRQUFRLFlBQVksUUFBUSxhQUFhLElBQUk7QUFFaEQsc0RBQVEsQ0FBQyw2RUFBNkU7QUFDdEY7QUFBQSxJQUNGO0FBQ0EsU0FBSyxXQUFXLE9BQU87QUFDdkIsU0FBSyxnQkFBZ0IsbURBQVksQ0FBQyxFQUFFLFNBQVMsS0FBSyxTQUFTLFNBQVMsS0FBSyxRQUFRLENBQUM7QUFBQSxFQUNwRjtBQUFBLEVBRUEsTUFBTSxLQUFLLEVBQUUsU0FBc0I7QUFDakMsV0FBTyxNQUFNLEtBQUssYUFBYSxLQUFLO0FBQUEsRUFDdEM7QUFBQSxFQUVBLE1BQWMsYUFBYSxPQUFlO0FBQ3hDLFVBQU0sYUFBYSxtQkFBbUIsS0FBSztBQUUzQyxVQUFNLFNBQVMsSUFBSSxnQkFBZ0I7QUFBQSxNQUNqQyxHQUFHO0FBQUEsTUFDSCxVQUFVLEtBQUs7QUFBQSxNQUNmLFNBQVMsS0FBSyxTQUFTLFNBQVM7QUFBQSxJQUNsQyxDQUFDO0FBRUQsVUFBTSxXQUFXLGVBQWU7QUFFaEMsVUFBTSxXQUFXLE1BQU0sS0FBSyxjQUFjLElBQUksUUFBUSxFQUFFLE1BQU0sQ0FBQyxVQUFVO0FBQ3ZFLGFBQU87QUFBQSxRQUNMLFFBQVE7QUFBQSxRQUNSLFlBQVksb0NBQW9DLEtBQUs7QUFBQSxRQUNyRCxNQUFNO0FBQUEsTUFDUjtBQUFBLElBQ0YsQ0FBQztBQUVELFFBQUksU0FBUyxVQUFVLEtBQUs7QUFDMUIsWUFBTSxXQUFXO0FBQUE7QUFBQSxzQkFFRCxTQUFTO0FBQUE7QUFFekIsc0RBQVEsQ0FBQyxRQUFRO0FBQ2pCLGFBQU8sQ0FBQztBQUFBLElBQ1Y7QUFFQSxVQUFNLE9BQXlCLFNBQVM7QUFDeEMsUUFBSSxDQUFDO0FBQU0sYUFBTyxDQUFDO0FBRW5CLFVBQU0sVUFBcUIsS0FBSyxTQUFTLElBQ3ZDLENBQUMsRUFBRSxhQUFhLFlBQVksYUFBYSxXQUFXLGdCQUFnQjtBQUNsRSxZQUFNLFFBQVEsY0FBYztBQUM1QixZQUFNLGNBQWMsYUFBYTtBQUNqQyxZQUFNLE9BQU8sR0FBRyxlQUFlLFNBQVMsZUFBZTtBQUN2RCxZQUFNLE1BQU0sd0JBQXdCO0FBRXBDLGFBQU8sRUFBRSxhQUFhLElBQUksS0FBSyxNQUFNLFlBQVksWUFBWSxNQUFNLFNBQVMsT0FBTyxJQUFJO0FBQUEsSUFDekYsQ0FDRjtBQUVBLFdBQU87QUFBQSxFQUNUO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AY3dyYy9sZWFmd3JpdGVyLWNvbW1vbnMvLi4vY29yZS9zcmMvb3Zlcm1pbmQvbG9va3Vwcy9zZXJ2aWNlcy9nZW9uYW1lcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MsIHsgdHlwZSBBeGlvc0luc3RhbmNlIH0gZnJvbSAnYXhpb3MnO1xuaW1wb3J0IHR5cGUgeyBJUmVzdWx0IH0gZnJvbSAnLi4vLi4vLi4vY29tcG9uZW50cy9lbnRpdHlMb29rdXBzL3R5cGVzJztcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4vLi4vLi4vLi4vdXRpbGl0aWVzJztcbmltcG9ydCBJTG9va3VwU2VydmljZUFwaSwgeyB0eXBlIElGaW5kUGFyYW1zIH0gZnJvbSAnLi90eXBlJztcblxuaW50ZXJmYWNlIEdlb25hbWUge1xuICBbeDogc3RyaW5nXTogYW55O1xuICBhZG1pbk5hbWUxOiBzdHJpbmc7XG4gIGNvdW50cnlOYW1lOiBzdHJpbmc7XG4gIGZjb2RlTmFtZT86IHN0cmluZztcbiAgZ2VvbmFtZUlkOiBudW1iZXI7XG4gIHRvcG9ueW1OYW1lOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBJR2VvbmFtZXNSZXN1bHRzIHtcbiAgZ2VvbmFtZXM6IEdlb25hbWVbXTtcbiAgdG90YWxSZXN1bHRzQ291bnQ6IG51bWJlcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2VvbmFtZXMgaW1wbGVtZW50cyBJTG9va3VwU2VydmljZUFwaSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgYXhpb3NJbnN0YW5jZTogQXhpb3NJbnN0YW5jZTtcbiAgcHJpdmF0ZSByZWFkb25seSBiYXNlVVJMID0gJ2h0dHBzOi8vc2VjdXJlLmdlb25hbWVzLm9yZyc7XG4gIHByaXZhdGUgcmVhZG9ubHkgTUFYX0hJVFMgPSAyNTsgLy8gZGVmYXVsdDogMTAwO1xuICBwcml2YXRlIHJlYWRvbmx5IHRpbWVvdXQgPSAzXzAwMDtcbiAgcHJpdmF0ZSByZWFkb25seSB1c2VybmFtZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogYW55KSB7XG4gICAgaWYgKCFjb25maWc/LnVzZXJuYW1lIHx8IGNvbmZpZz8udXNlcm5hbWUgPT09ICcnKSB7XG4gICAgICAvLyB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBtdXN0IGRlZmluZSBhIHVzZXJuYW1lIHRvIGJlIGFibGUgdG8gbWFrZSByZXF1ZXN0cyB0byBHZW9uYW1lcycpO1xuICAgICAgbG9nLndhcm4oJ0dFT05BTUU6IFlvdSBtdXN0IGRlZmluZSBhIHVzZXJuYW1lIHRvIGJlIGFibGUgdG8gbWFrZSByZXF1ZXN0cyB0byBHZW9uYW1lcycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnVzZXJuYW1lID0gY29uZmlnLnVzZXJuYW1lO1xuICAgIHRoaXMuYXhpb3NJbnN0YW5jZSA9IGF4aW9zLmNyZWF0ZSh7IGJhc2VVUkw6IHRoaXMuYmFzZVVSTCwgdGltZW91dDogdGhpcy50aW1lb3V0IH0pO1xuICB9XG5cbiAgYXN5bmMgZmluZCh7IHF1ZXJ5IH06IElGaW5kUGFyYW1zKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuY2FsbEdlb25hbWVzKHF1ZXJ5KTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgY2FsbEdlb25hbWVzKHF1ZXJ5OiBzdHJpbmcpIHtcbiAgICBjb25zdCBlbmNvZGVkVVJJID0gZW5jb2RlVVJJQ29tcG9uZW50KHF1ZXJ5KTtcblxuICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoe1xuICAgICAgcTogZW5jb2RlZFVSSSxcbiAgICAgIHVzZXJuYW1lOiB0aGlzLnVzZXJuYW1lLFxuICAgICAgbWF4Um93czogdGhpcy5NQVhfSElUUy50b1N0cmluZygpLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdXJsUXVlcnkgPSBgc2VhcmNoSlNPTj8kJHtwYXJhbXN9YDtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5heGlvc0luc3RhbmNlLmdldCh1cmxRdWVyeSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGF0dXM6IDUwMCxcbiAgICAgICAgc3RhdHVzVGV4dDogYFRoZSByZXF1ZXN0IGV4ZWVkZWQgdGhlIHRpbWVvdXQgKCR7dGhpcy50aW1lb3V0fSlgLFxuICAgICAgICBkYXRhOiB1bmRlZmluZWQsXG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcbiAgICAgIGNvbnN0IGVycm9yTXNnID0gYFxuICAgICAgICBTb21ldGhpbmcgd3Jvbmcgd2l0aCB0aGUgY2FsbCB0byBnZW9uYW1lcywgcG9zc2libHkgYSBwcm9ibGVtIHdpdGggdGhlIG5ldHdvcmsgb3IgdGhlIHNlcnZlci5cbiAgICAgICAgSFRUUCBlcnJvcjogJHtyZXNwb25zZS5zdGF0dXNUZXh0fVxuICAgICAgYDtcbiAgICAgIGxvZy53YXJuKGVycm9yTXNnKTtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhOiBJR2VvbmFtZXNSZXN1bHRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICBpZiAoIWRhdGEpIHJldHVybiBbXTtcblxuICAgIGNvbnN0IHJlc3VsdHM6IElSZXN1bHRbXSA9IGRhdGEuZ2VvbmFtZXMubWFwKFxuICAgICAgKHsgdG9wb255bU5hbWUsIGFkbWluTmFtZTEsIGNvdW50cnlOYW1lLCBnZW9uYW1lSWQsIGZjb2RlTmFtZSB9KSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YXRlID0gYWRtaW5OYW1lMSA/PyAnJztcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSBmY29kZU5hbWUgPz8gJyc7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBgJHt0b3BvbnltTmFtZX0gJHtzdGF0ZX0gJHtjb3VudHJ5TmFtZSA/PyAnJ31gO1xuICAgICAgICBjb25zdCB1cmkgPSBgaHR0cHM6Ly9nZW9uYW1lcy5vcmcvJHtnZW9uYW1lSWR9YDtcblxuICAgICAgICByZXR1cm4geyBkZXNjcmlwdGlvbiwgaWQ6IHVyaSwgbmFtZSwgcmVwb3NpdG9yeTogJ2dlb25hbWVzJywgdHlwZTogJ3BsYWNlJywgcXVlcnksIHVyaSB9O1xuICAgICAgfVxuICAgICk7XG5cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9