"use strict";
(self["webpackChunk_cwrc_leafwriter_commons"] = self["webpackChunk_cwrc_leafwriter_commons"] || []).push([["core_src_overmind_lookups_services_lgpn_ts"],{

/***/ "../core/src/overmind/lookups/services/lgpn.ts":
/*!*****************************************************!*\
  !*** ../core/src/overmind/lookups/services/lgpn.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Lgpn)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "../../node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../../../utilities */ "../core/src/utilities/index.ts");


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
      _utilities__WEBPACK_IMPORTED_MODULE_1__.log.warn(errorMsg);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvY29yZV9zcmNfb3Zlcm1pbmRfbG9va3Vwc19zZXJ2aWNlc19sZ3BuX3RzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUVBO0FBaUJlLE1BQU0sS0FBa0M7QUFBQSxFQU1yRCxjQUFjO0FBSmQsU0FBaUIsVUFBVTtBQUMzQixTQUFpQixTQUFTO0FBQzFCLFNBQWlCLFVBQVU7QUFHekIsU0FBSyxnQkFBZ0IsbURBQVksQ0FBQyxFQUFFLFNBQVMsS0FBSyxTQUFTLFNBQVMsS0FBSyxRQUFRLENBQUM7QUFBQSxFQUNwRjtBQUFBLEVBRUEsTUFBTSxLQUFLLEVBQUUsT0FBTyxRQUFxQjtBQUN2QyxRQUFJLFNBQVM7QUFBVSxhQUFPLE1BQU0sS0FBSyxTQUFTLE9BQU8sUUFBUTtBQUNqRSxRQUFJLFNBQVM7QUFBUyxhQUFPLE1BQU0sS0FBSyxTQUFTLE9BQU8sT0FBTztBQUUvRCxVQUFNLElBQUksTUFBTSxxQkFBcUI7QUFBQSxFQUN2QztBQUFBLEVBRUEsTUFBYyxTQUFTLE9BQWUsTUFBdUI7QUFDM0QsVUFBTSxlQUFlLG1CQUFtQixLQUFLO0FBRzdDLFFBQUksV0FBVztBQUNmLGdCQUFZLFFBQVE7QUFDcEIsZ0JBQVksVUFBVSxLQUFLO0FBRTNCLFVBQU0sV0FBVyxNQUFNLEtBQUssY0FBYyxJQUFJLFFBQVEsRUFBRSxNQUFNLENBQUMsVUFBVTtBQUN2RSxhQUFPO0FBQUEsUUFDTCxRQUFRO0FBQUEsUUFDUixZQUFZLG9DQUFvQyxLQUFLO0FBQUEsUUFDckQsTUFBTTtBQUFBLE1BQ1I7QUFBQSxJQUNGLENBQUM7QUFFRCxRQUFJLFNBQVMsVUFBVSxLQUFLO0FBQzFCLFlBQU0sV0FBVztBQUFBO0FBQUEsc0JBRUQsU0FBUztBQUFBO0FBRXpCLHNEQUFRLENBQUMsUUFBUTtBQUNqQixhQUFPLENBQUM7QUFBQSxJQUNWO0FBRUEsVUFBTSxPQUFPLFNBQVM7QUFDdEIsUUFBSSxDQUFDO0FBQU0sYUFBTyxDQUFDO0FBR25CLFVBQU0sUUFBUSxLQUFLLFFBQVEsR0FBRztBQUM5QixVQUFNLE1BQU0sS0FBSyxZQUFZLElBQUk7QUFDakMsVUFBTSxTQUFTLEtBQUssVUFBVSxPQUFPLEdBQUc7QUFDeEMsVUFBTSxVQUF3QixLQUFLLE1BQU0sTUFBTTtBQUUvQyxRQUFJLFFBQVEsUUFBUSxXQUFXO0FBQUcsYUFBTyxDQUFDO0FBRTFDLFVBQU0sVUFBcUIsUUFBUSxRQUFRLElBQUksQ0FBQyxFQUFFLElBQUksTUFBTSxPQUFPLFdBQVcsZUFBZTtBQUMzRixZQUFNLGNBQWMsVUFBVSxzQkFBc0IsZ0JBQWdCO0FBQ3BFLGFBQU87QUFBQSxRQUNMO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBLFlBQVk7QUFBQSxRQUNaLEtBQUssZ0NBQWdDO0FBQUEsUUFDckM7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUVELFdBQU87QUFBQSxFQUNUO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AY3dyYy9sZWFmd3JpdGVyLWNvbW1vbnMvLi4vY29yZS9zcmMvb3Zlcm1pbmQvbG9va3Vwcy9zZXJ2aWNlcy9sZ3BuLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBheGlvcywgeyB0eXBlIEF4aW9zSW5zdGFuY2UgfSBmcm9tICdheGlvcyc7XG5pbXBvcnQgdHlwZSB7IElSZXN1bHQgfSBmcm9tICcuLi8uLi8uLi9jb21wb25lbnRzL2VudGl0eUxvb2t1cHMvdHlwZXMnO1xuaW1wb3J0IHsgbG9nIH0gZnJvbSAnLi8uLi8uLi8uLi91dGlsaXRpZXMnO1xuaW1wb3J0IElMb29rdXBTZXJ2aWNlQXBpLCB7IHR5cGUgSUZpbmRQYXJhbXMgfSBmcm9tICcuL3R5cGUnO1xuXG50eXBlIE5hbWVkRW50aXR5VHlwZSA9ICdwZXJzb24nIHwgJ3BsYWNlJztcblxuaW50ZXJmYWNlIFBlcnNvbiB7XG4gIGlkOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgcGxhY2U6IHN0cmluZztcbiAgbm90QmVmb3JlOiBzdHJpbmc7XG4gIG5vdEFmdGVyOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBJTEdQTlJlc3VsdHMge1xuICBwZXJzb25zOiBQZXJzb25bXTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGdwbiBpbXBsZW1lbnRzIElMb29rdXBTZXJ2aWNlQXBpIHtcbiAgcHJpdmF0ZSByZWFkb25seSBheGlvc0luc3RhbmNlOiBBeGlvc0luc3RhbmNlO1xuICBwcml2YXRlIHJlYWRvbmx5IGJhc2VVUkwgPSAnaHR0cHM6Ly9sb29rdXAuc2VydmljZXMuY3dyYy5jYS9sZ3BuMi9jZ2ktYmluJztcbiAgcHJpdmF0ZSByZWFkb25seSBGT1JNQVQgPSAnanNvbic7XG4gIHByaXZhdGUgcmVhZG9ubHkgdGltZW91dCA9IDNfMDAwO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYXhpb3NJbnN0YW5jZSA9IGF4aW9zLmNyZWF0ZSh7IGJhc2VVUkw6IHRoaXMuYmFzZVVSTCwgdGltZW91dDogdGhpcy50aW1lb3V0IH0pO1xuICB9XG5cbiAgYXN5bmMgZmluZCh7IHF1ZXJ5LCB0eXBlIH06IElGaW5kUGFyYW1zKSB7XG4gICAgaWYgKHR5cGUgPT09ICdwZXJzb24nKSByZXR1cm4gYXdhaXQgdGhpcy5jYWxsTEdQTihxdWVyeSwgJ3BlcnNvbicpO1xuICAgIGlmICh0eXBlID09PSAncGxhY2UnKSByZXR1cm4gYXdhaXQgdGhpcy5jYWxsTEdQTihxdWVyeSwgJ3BsYWNlJyk7XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0VudGl0eSB0eXBlIGludmFsaWQnKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgY2FsbExHUE4ocXVlcnk6IHN0cmluZywgdHlwZTogTmFtZWRFbnRpdHlUeXBlKSB7XG4gICAgY29uc3QgZW5jb2RlZFF1ZXJ5ID0gZW5jb2RlVVJJQ29tcG9uZW50KHF1ZXJ5KTtcbiAgICAvLyBjb25zdCB1cmxRdWVyeSA9IGBsZ3BuX3NlYXJjaC5jZ2k/bmFtZT0ke2VuY29kZWRRdWVyeX07c3R5bGU9JHtGT1JNQVR9YDtcblxuICAgIGxldCB1cmxRdWVyeSA9IGBsZ3BuX3NlYXJjaC5jZ2k/YDtcbiAgICB1cmxRdWVyeSArPSBgbmFtZT0ke2VuY29kZWRRdWVyeX1gO1xuICAgIHVybFF1ZXJ5ICs9IGA7c3R5bGU9JHt0aGlzLkZPUk1BVH1gO1xuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmF4aW9zSW5zdGFuY2UuZ2V0KHVybFF1ZXJ5KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICBzdGF0dXNUZXh0OiBgVGhlIHJlcXVlc3QgZXhlZWRlZCB0aGUgdGltZW91dCAoJHt0aGlzLnRpbWVvdXR9KWAsXG4gICAgICAgIGRhdGE6IHVuZGVmaW5lZCxcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xuICAgICAgY29uc3QgZXJyb3JNc2cgPSBgXG4gICAgICAgIFNvbWV0aGluZyB3cm9uZyB3aXRoIHRoZSBjYWxsIHRvIExHUE4sIHBvc3NpYmx5IGEgcHJvYmxlbSB3aXRoIHRoZSBuZXR3b3JrIG9yIHRoZSBzZXJ2ZXIuXG4gICAgICAgIEhUVFAgZXJyb3I6ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1cbiAgICAgIGA7XG4gICAgICBsb2cud2FybihlcnJvck1zZyk7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgaWYgKCFkYXRhKSByZXR1cm4gW107XG5cbiAgICAvL2ZpbmQgdGhlIHJlc3VsdCBvYmplY3RcbiAgICBjb25zdCBzdGFydCA9IGRhdGEuaW5kZXhPZigneycpO1xuICAgIGNvbnN0IGVuZCA9IGRhdGEubGFzdEluZGV4T2YoJyk7Jyk7XG4gICAgY29uc3Qgc3Vic3RyID0gZGF0YS5zdWJzdHJpbmcoc3RhcnQsIGVuZCk7XG4gICAgY29uc3QgZGF0YU9iajogSUxHUE5SZXN1bHRzID0gSlNPTi5wYXJzZShzdWJzdHIpO1xuXG4gICAgaWYgKGRhdGFPYmoucGVyc29ucy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcblxuICAgIGNvbnN0IHJlc3VsdHM6IElSZXN1bHRbXSA9IGRhdGFPYmoucGVyc29ucy5tYXAoKHsgaWQsIG5hbWUsIHBsYWNlLCBub3RCZWZvcmUsIG5vdEFmdGVyIH0pID0+IHtcbiAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gYFBsYWNlOiAke3BsYWNlfTxici8+RmxvcnVpdDogJHtub3RCZWZvcmV9IHRvICR7bm90QWZ0ZXJ9YDtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgICBpZCxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgcmVwb3NpdG9yeTogJ2xncG4nLFxuICAgICAgICB1cmk6IGBodHRwczovL3d3dy5sZ3BuLm94LmFjLnVrL2lkLyR7aWR9YCxcbiAgICAgICAgcXVlcnksXG4gICAgICAgIHR5cGUsXG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==