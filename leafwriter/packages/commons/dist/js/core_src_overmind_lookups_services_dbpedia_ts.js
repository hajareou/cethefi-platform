"use strict";
(self["webpackChunk_cwrc_leafwriter_commons"] = self["webpackChunk_cwrc_leafwriter_commons"] || []).push([["core_src_overmind_lookups_services_dbpedia_ts"],{

/***/ "../core/src/overmind/lookups/services/dbpedia.ts":
/*!********************************************************!*\
  !*** ../core/src/overmind/lookups/services/dbpedia.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Dbpedia)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "../../node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../../../utilities */ "../core/src/utilities/index.ts");


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
      _utilities__WEBPACK_IMPORTED_MODULE_1__.log.warn(errorMsg);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvY29yZV9zcmNfb3Zlcm1pbmRfbG9va3Vwc19zZXJ2aWNlc19kYnBlZGlhX3RzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUVBO0FBZ0JlLE1BQU0sUUFBcUM7QUFBQSxFQU94RCxjQUFjO0FBTGQsU0FBaUIsVUFBVTtBQUMzQixTQUFpQixTQUFTO0FBQzFCLFNBQWlCLFdBQVc7QUFDNUIsU0FBaUIsVUFBVTtBQUd6QixTQUFLLGdCQUFnQixtREFBWSxDQUFDLEVBQUUsU0FBUyxLQUFLLFNBQVMsU0FBUyxLQUFLLFFBQVEsQ0FBQztBQUFBLEVBQ3BGO0FBQUEsRUFFQSxNQUFNLEtBQUssRUFBRSxPQUFPLFFBQXFCO0FBQ3ZDLFFBQUksU0FBUztBQUFVLGFBQU8sTUFBTSxLQUFLLFlBQVksT0FBTyxRQUFRO0FBQ3BFLFFBQUksU0FBUztBQUFTLGFBQU8sTUFBTSxLQUFLLFlBQVksT0FBTyxPQUFPO0FBQ2xFLFFBQUksU0FBUztBQUFnQixhQUFPLE1BQU0sS0FBSyxZQUFZLE9BQU8sY0FBYztBQUNoRixRQUFJLFNBQVM7QUFBUyxhQUFPLE1BQU0sS0FBSyxZQUFZLE9BQU8sTUFBTTtBQUNqRSxRQUFJLFNBQVM7QUFBTSxhQUFPLE1BQU0sS0FBSyxZQUFZLE9BQU8sT0FBTztBQUUvRCxVQUFNLElBQUksTUFBTSxxQkFBcUI7QUFBQSxFQUN2QztBQUFBLEVBRUEsTUFBYyxZQUFZLE9BQWUsTUFBdUI7QUFDOUQsVUFBTSxvQkFBb0IsbUJBQW1CLEtBQUs7QUFFbEQsVUFBTSxTQUFTLElBQUksZ0JBQWdCO0FBQUEsTUFDakMsWUFBWTtBQUFBLE1BQ1osYUFBYTtBQUFBLE1BQ2IsUUFBUSxLQUFLO0FBQUEsTUFDYixTQUFTLEtBQUssU0FBUyxTQUFTO0FBQUEsSUFDbEMsQ0FBQztBQUVELFVBQU0sV0FBVyxrQkFBa0I7QUFFbkMsVUFBTSxXQUFXLE1BQU0sS0FBSyxjQUFjLElBQUksUUFBUSxFQUFFLE1BQU0sQ0FBQyxVQUFVO0FBQ3ZFLGFBQU87QUFBQSxRQUNMLFFBQVE7QUFBQSxRQUNSLFlBQVksb0NBQW9DLEtBQUs7QUFBQSxRQUNyRCxNQUFNO0FBQUEsTUFDUjtBQUFBLElBQ0YsQ0FBQztBQUVELFFBQUksU0FBUyxVQUFVLEtBQUs7QUFDMUIsWUFBTSxXQUFXO0FBQUE7QUFBQSxzQkFFRCxTQUFTO0FBQUE7QUFFekIsc0RBQVEsQ0FBQyxRQUFRO0FBQ2pCLGFBQU8sQ0FBQztBQUFBLElBQ1Y7QUFFQSxVQUFNLE9BQXlCLFNBQVM7QUFDeEMsUUFBSSxDQUFDO0FBQU0sYUFBTyxDQUFDO0FBR25CLFVBQU0sVUFBcUIsS0FBSyxLQUFLLElBQUksQ0FBQyxFQUFFLFNBQVMsT0FBTyxlQUFlO0FBRXpFLFlBQU0sY0FBYyxVQUFVLE1BQU07QUFDcEMsWUFBTSxPQUFPLE1BQU0sR0FBRyxRQUFRLGlCQUFpQixFQUFFO0FBQ2pELFlBQU0sTUFBTSxTQUFTO0FBRXJCLGFBQU8sRUFBRSxhQUFhLElBQUksS0FBSyxNQUFNLFlBQVksV0FBVyxPQUFPLE1BQU0sSUFBSTtBQUFBLElBQy9FLENBQUM7QUFFRCxXQUFPO0FBQUEsRUFDVDtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGN3cmMvbGVhZndyaXRlci1jb21tb25zLy4uL2NvcmUvc3JjL292ZXJtaW5kL2xvb2t1cHMvc2VydmljZXMvZGJwZWRpYS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MsIHsgdHlwZSBBeGlvc0luc3RhbmNlIH0gZnJvbSAnYXhpb3MnO1xuaW1wb3J0IHR5cGUgeyBJUmVzdWx0IH0gZnJvbSAnLi4vLi4vLi4vY29tcG9uZW50cy9lbnRpdHlMb29rdXBzL3R5cGVzJztcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4vLi4vLi4vLi4vdXRpbGl0aWVzJztcbmltcG9ydCBJTG9va3VwU2VydmljZUFwaSwgeyB0eXBlIElGaW5kUGFyYW1zIH0gZnJvbSAnLi90eXBlJztcblxudHlwZSBOYW1lZEVudGl0eVR5cGUgPSAncGVyc29uJyB8ICdwbGFjZScgfCAnb3JnYW5pc2F0aW9uJyB8ICd3b3JrJyB8ICd0aGluZyc7XG5cbmludGVyZmFjZSBEb2Mge1xuICBbeDogc3RyaW5nXTogYW55O1xuICBjb21tZW50OiBzdHJpbmdbXTtcbiAgbGFiZWw6IHN0cmluZ1tdO1xuICByZXNvdXJjZTogc3RyaW5nW107XG59XG5cbmludGVyZmFjZSBJREJQZWRpZGFSZXN1bHRzIHtcbiAgZG9jczogRG9jW107XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERicGVkaWEgaW1wbGVtZW50cyBJTG9va3VwU2VydmljZUFwaSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgYXhpb3NJbnN0YW5jZTogQXhpb3NJbnN0YW5jZTtcbiAgcHJpdmF0ZSByZWFkb25seSBiYXNlVVJMID0gJ2h0dHBzOi8vbG9va3VwLmRicGVkaWEub3JnL2FwaS9zZWFyY2gnO1xuICBwcml2YXRlIHJlYWRvbmx5IEZPUk1BVCA9ICdqc29uJztcbiAgcHJpdmF0ZSByZWFkb25seSBNQVhfSElUUyA9IDI1OyAvLyBkZWZhdWx0OiAxMDA7IGJ1dCBpdCBicmVha3MgYXQgNDUrXG4gIHByaXZhdGUgcmVhZG9ubHkgdGltZW91dCA9IDNfMDAwO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYXhpb3NJbnN0YW5jZSA9IGF4aW9zLmNyZWF0ZSh7IGJhc2VVUkw6IHRoaXMuYmFzZVVSTCwgdGltZW91dDogdGhpcy50aW1lb3V0IH0pO1xuICB9XG5cbiAgYXN5bmMgZmluZCh7IHF1ZXJ5LCB0eXBlIH06IElGaW5kUGFyYW1zKSB7XG4gICAgaWYgKHR5cGUgPT09ICdwZXJzb24nKSByZXR1cm4gYXdhaXQgdGhpcy5jYWxsREJQZWRpYShxdWVyeSwgJ3BlcnNvbicpO1xuICAgIGlmICh0eXBlID09PSAncGxhY2UnKSByZXR1cm4gYXdhaXQgdGhpcy5jYWxsREJQZWRpYShxdWVyeSwgJ3BsYWNlJyk7XG4gICAgaWYgKHR5cGUgPT09ICdvcmdhbml6YXRpb24nKSByZXR1cm4gYXdhaXQgdGhpcy5jYWxsREJQZWRpYShxdWVyeSwgJ29yZ2FuaXNhdGlvbicpO1xuICAgIGlmICh0eXBlID09PSAndGl0bGUnKSByZXR1cm4gYXdhaXQgdGhpcy5jYWxsREJQZWRpYShxdWVyeSwgJ3dvcmsnKTtcbiAgICBpZiAodHlwZSA9PT0gJ3JzJykgcmV0dXJuIGF3YWl0IHRoaXMuY2FsbERCUGVkaWEocXVlcnksICd0aGluZycpO1xuXG4gICAgdGhyb3cgbmV3IEVycm9yKCdFbnRpdHkgdHlwZSBpbnZhbGlkJyk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGNhbGxEQlBlZGlhKHF1ZXJ5OiBzdHJpbmcsIHR5cGU6IE5hbWVkRW50aXR5VHlwZSkge1xuICAgIGNvbnN0IGVuY29kZVF1ZXJ5U3RyaW5nID0gZW5jb2RlVVJJQ29tcG9uZW50KHF1ZXJ5KTtcblxuICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoe1xuICAgICAgUXVlcnlDbGFzczogdHlwZSxcbiAgICAgIFF1ZXJ5U3RyaW5nOiBlbmNvZGVRdWVyeVN0cmluZyxcbiAgICAgIGZvcm1hdDogdGhpcy5GT1JNQVQsXG4gICAgICBNYXhIaXRzOiB0aGlzLk1BWF9ISVRTLnRvU3RyaW5nKCksXG4gICAgfSk7XG5cbiAgICBjb25zdCB1cmxRdWVyeSA9IGBLZXl3b3JkU2VhcmNoPyQke3BhcmFtc31gO1xuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmF4aW9zSW5zdGFuY2UuZ2V0KHVybFF1ZXJ5KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0YXR1czogNTAwLFxuICAgICAgICBzdGF0dXNUZXh0OiBgVGhlIHJlcXVlc3QgZXhlZWRlZCB0aGUgdGltZW91dCAoJHt0aGlzLnRpbWVvdXR9KWAsXG4gICAgICAgIGRhdGE6IHVuZGVmaW5lZCxcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xuICAgICAgY29uc3QgZXJyb3JNc2cgPSBgXG4gICAgICAgIFNvbWV0aGluZyB3cm9uZyB3aXRoIHRoZSBjYWxsIHRvIERCUGVkaWEsIHBvc3NpYmx5IGEgcHJvYmxlbSB3aXRoIHRoZSBuZXR3b3JrIG9yIHRoZSBzZXJ2ZXIuXG4gICAgICAgIEhUVFAgZXJyb3I6ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1cbiAgICAgIGA7XG4gICAgICBsb2cud2FybihlcnJvck1zZyk7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YTogSURCUGVkaWRhUmVzdWx0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgaWYgKCFkYXRhKSByZXR1cm4gW107XG5cbiAgICAvLyBjb25zdCBtYXBSZXNwb25zZSA9IHJlc3BvbnNlSnNvbi5kb2NzLm1hcChcbiAgICBjb25zdCByZXN1bHRzOiBJUmVzdWx0W10gPSBkYXRhLmRvY3MubWFwKCh7IGNvbW1lbnQsIGxhYmVsLCByZXNvdXJjZSB9KSA9PiB7XG4gICAgICAvLz8gYXNzdW1pbmcgZmlyc3QgaW5zdGFuY2Ugb2YgZGVzY3JpcHRpb24sIG5hbWUgYW5kIHVyaTtcbiAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gY29tbWVudD8uWzBdID8/ICdObyBkZXNjcmlwdGlvbiBhdmFpbGFibGUnO1xuICAgICAgY29uc3QgbmFtZSA9IGxhYmVsWzBdLnJlcGxhY2UoLyg8KFtePl0rKT4pL2dpLCAnJyk7XG4gICAgICBjb25zdCB1cmkgPSByZXNvdXJjZVswXTtcblxuICAgICAgcmV0dXJuIHsgZGVzY3JpcHRpb24sIGlkOiB1cmksIG5hbWUsIHJlcG9zaXRvcnk6ICdkYnBlZGlhJywgcXVlcnksIHR5cGUsIHVyaSB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==