"use strict";
(self["webpackChunk_cwrc_leafwriter_commons"] = self["webpackChunk_cwrc_leafwriter_commons"] || []).push([["core_src_overmind_lookups_services_cwrc_ts"],{

/***/ "../core/src/overmind/lookups/services/cwrc.ts":
/*!*****************************************************!*\
  !*** ../core/src/overmind/lookups/services/cwrc.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Cwrc)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "../../node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

class Cwrc {
  constructor() {
    this.baseURL = "";
    this.LIMIT = 100;
    this.timeout = 3e3;
    this.cwrcProjectId = "";
    this.entityRoot = "";
    this.page = 0;
    this.projects = {};
    this.projectLogoRoot = "";
    this.searchRoot = "";
    this.doProjectLookup = async (url) => {
      const response = await this.axiosInstance.get(url, {
        headers: { credentials: "same-origin" }
      }).catch((error) => {
        return {
          status: 500,
          statusText: `The request exeeded the timeout (${this.timeout})`,
          data: void 0
        };
      });
      if (response.status >= 400) {
        const errorMsg = `
      Something wrong with the call to CWRC, possibly a problem with the network or the server.
      HTTP error: ${response.statusText}
    `;
        throw new Error(errorMsg);
      }
      this.projects = this.parseProjectsData(response);
      return this.projects;
    };
    this.axiosInstance = axios__WEBPACK_IMPORTED_MODULE_0___default().create({ baseURL: this.baseURL, timeout: this.timeout });
  }
  setEntityRoot(url) {
    this.entityRoot = url;
  }
  getEntityRoot() {
    return this.entityRoot;
  }
  setSearchRoot(url) {
    this.searchRoot = url;
  }
  getSearchRoot() {
    return this.searchRoot;
  }
  async find({ query, type }) {
    if (type === "person")
      return await this.callCWRC(query, "person");
    if (type === "place")
      return await this.callCWRC(query, "place");
    if (type === "organization")
      return await this.callCWRC(query, "organization");
    if (type === "title")
      return await this.callCWRC(query, "title");
    throw new Error("Entity type invalid");
  }
  async callCWRC(query, type) {
    const encodeURI = encodeURIComponent(query);
    const params = new URLSearchParams({
      query: encodeURI,
      limit: this.LIMIT.toString(),
      page: this.page.toString()
    });
    const urlQuery = `${this.searchRoot}/search/${type}?${params}`;
    const response = await this.axiosInstance.get(urlQuery);
    if (response.status >= 400) {
      const errorMsg = `
        Something wrong with the call to CWRC, possibly a problem with the network or the server.
        HTTP error: ${response.statusText}
      `;
      throw new Error(errorMsg);
    }
    if (!response.data.response.objects)
      return [];
    const result = response.data.response.objects.map(({ PID, object_label }) => {
      const id = PID;
      const name = object_label;
      const uri = `${this.entityRoot}/${id}`;
      const namespace = id.substring(0, id.indexOf(":"));
      const logo = this.projects[namespace];
      const data = {
        id,
        name,
        logo: logo ? `${this.projectLogoRoot}/${logo}` : void 0,
        repository: "CWRC",
        query,
        type,
        uri
      };
      return data;
    });
    return result;
  }
  async setProjectLookupConfig(config) {
    this.projectLogoRoot = config.projectLogoRoot;
    this.cwrcProjectId = config.cwrcProjectId;
    return await this.doProjectLookup(config.projectLookupUrl);
  }
  parseProjectsData(data) {
    const parsedProjects = {};
    for (let projectKey in data) {
      const project = data[projectKey];
      let logoFilename;
      const fieldLogo = project.field_logo;
      if (fieldLogo !== void 0) {
        for (let key in fieldLogo) {
          const entry = fieldLogo[key];
          if (entry.length > 0)
            logoFilename = entry[0].filename;
        }
      }
      let projectId;
      const fieldTopLevel = project.field_top_level_collection;
      if (fieldTopLevel !== void 0 && fieldTopLevel.und !== void 0) {
        const und = fieldTopLevel.und;
        if (und.length > 0 && und[0].pid) {
          const pid = und[0].pid;
          const namespace = pid === this.cwrcProjectId ? "cwrc" : pid.substring(0, pid.indexOf(":"));
          if (namespace !== "")
            projectId = namespace;
        }
      }
      if (logoFilename && projectId) {
        if (!parsedProjects[projectId]) {
          parsedProjects[projectId] = logoFilename;
        }
      }
    }
    return parsedProjects;
  }
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvY29yZV9zcmNfb3Zlcm1pbmRfbG9va3Vwc19zZXJ2aWNlc19jd3JjX3RzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBTWUsTUFBTSxLQUFrQztBQUFBLEVBYXJELGNBQWM7QUFYZCxTQUFpQixVQUFVO0FBQzNCLFNBQWlCLFFBQVE7QUFDekIsU0FBaUIsVUFBVTtBQUUzQix5QkFBZ0I7QUFDaEIsc0JBQWE7QUFDYixnQkFBTztBQUNQLG9CQUFpQyxDQUFDO0FBQ2xDLDJCQUFrQjtBQUNsQixzQkFBYTtBQWdHYiwyQkFBa0IsT0FBTyxRQUFnQjtBQUN2QyxZQUFNLFdBQVcsTUFBTSxLQUFLLGNBQ3pCLElBQUksS0FBSztBQUFBLFFBQ1IsU0FBUyxFQUFFLGFBQWEsY0FBYztBQUFBLE1BQ3hDLENBQUMsRUFDQSxNQUFNLENBQUMsVUFBVTtBQUNoQixlQUFPO0FBQUEsVUFDTCxRQUFRO0FBQUEsVUFDUixZQUFZLG9DQUFvQyxLQUFLO0FBQUEsVUFDckQsTUFBTTtBQUFBLFFBQ1I7QUFBQSxNQUNGLENBQUM7QUFFSCxVQUFJLFNBQVMsVUFBVSxLQUFLO0FBQzFCLGNBQU0sV0FBVztBQUFBO0FBQUEsb0JBRUgsU0FBUztBQUFBO0FBRXZCLGNBQU0sSUFBSSxNQUFNLFFBQVE7QUFBQSxNQUMxQjtBQUVBLFdBQUssV0FBVyxLQUFLLGtCQUFrQixRQUFRO0FBQy9DLGFBQU8sS0FBSztBQUFBLElBQ2Q7QUFwSEUsU0FBSyxnQkFBZ0IsbURBQVksQ0FBQyxFQUFFLFNBQVMsS0FBSyxTQUFTLFNBQVMsS0FBSyxRQUFRLENBQUM7QUFBQSxFQUNwRjtBQUFBLEVBRUEsY0FBYyxLQUFhO0FBQ3pCLFNBQUssYUFBYTtBQUFBLEVBQ3BCO0FBQUEsRUFDQSxnQkFBZ0I7QUFDZCxXQUFPLEtBQUs7QUFBQSxFQUNkO0FBQUEsRUFDQSxjQUFjLEtBQWE7QUFDekIsU0FBSyxhQUFhO0FBQUEsRUFDcEI7QUFBQSxFQUNBLGdCQUFnQjtBQUNkLFdBQU8sS0FBSztB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QSxRQUM5QjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL0Bjd3JjL2xlYWZ3cml0ZXItY29tbW9ucy8uLi9jb3JlL3NyYy9vdmVybWluZC9sb29rdXBzL3NlcnZpY2VzL2N3cmMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4aW9zLCB7IHR5cGUgQXhpb3NJbnN0YW5jZSB9IGZyb20gJ2F4aW9zJztcbmltcG9ydCB7IHR5cGUgSVJlc3VsdCB9IGZyb20gJy4uLy4uLy4uL2NvbXBvbmVudHMvZW50aXR5TG9va3Vwcy90eXBlcyc7XG5pbXBvcnQgSUxvb2t1cFNlcnZpY2VBcGksIHsgdHlwZSBJRmluZFBhcmFtcyB9IGZyb20gJy4vdHlwZSc7XG5cbnR5cGUgTmFtZWRFbnRpdHlUeXBlID0gJ3BlcnNvbicgfCAncGxhY2UnIHwgJ29yZ2FuaXphdGlvbicgfCAndGl0bGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDd3JjIGltcGxlbWVudHMgSUxvb2t1cFNlcnZpY2VBcGkge1xuICBwcml2YXRlIHJlYWRvbmx5IGF4aW9zSW5zdGFuY2U6IEF4aW9zSW5zdGFuY2U7XG4gIHByaXZhdGUgcmVhZG9ubHkgYmFzZVVSTCA9ICcnO1xuICBwcml2YXRlIHJlYWRvbmx5IExJTUlUID0gMTAwO1xuICBwcml2YXRlIHJlYWRvbmx5IHRpbWVvdXQgPSAzXzAwMDtcblxuICBjd3JjUHJvamVjdElkID0gJyc7XG4gIGVudGl0eVJvb3QgPSAnJztcbiAgcGFnZSA9IDA7XG4gIHByb2plY3RzOiB7IFt4OiBzdHJpbmddOiBhbnkgfSA9IHt9O1xuICBwcm9qZWN0TG9nb1Jvb3QgPSAnJztcbiAgc2VhcmNoUm9vdCA9ICcnO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYXhpb3NJbnN0YW5jZSA9IGF4aW9zLmNyZWF0ZSh7IGJhc2VVUkw6IHRoaXMuYmFzZVVSTCwgdGltZW91dDogdGhpcy50aW1lb3V0IH0pO1xuICB9XG5cbiAgc2V0RW50aXR5Um9vdCh1cmw6IHN0cmluZykge1xuICAgIHRoaXMuZW50aXR5Um9vdCA9IHVybDtcbiAgfVxuICBnZXRFbnRpdHlSb290KCkge1xuICAgIHJldHVybiB0aGlzLmVudGl0eVJvb3Q7XG4gIH1cbiAgc2V0U2VhcmNoUm9vdCh1cmw6IHN0cmluZykge1xuICAgIHRoaXMuc2VhcmNoUm9vdCA9IHVybDtcbiAgfVxuICBnZXRTZWFyY2hSb290KCkge1xuICAgIHJldHVybiB0aGlzLnNlYXJjaFJvb3Q7XG4gIH1cblxuICBhc3luYyBmaW5kKHsgcXVlcnksIHR5cGUgfTogSUZpbmRQYXJhbXMpIHtcbiAgICBpZiAodHlwZSA9PT0gJ3BlcnNvbicpIHJldHVybiBhd2FpdCB0aGlzLmNhbGxDV1JDKHF1ZXJ5LCAncGVyc29uJyk7XG4gICAgaWYgKHR5cGUgPT09ICdwbGFjZScpIHJldHVybiBhd2FpdCB0aGlzLmNhbGxDV1JDKHF1ZXJ5LCAncGxhY2UnKTtcbiAgICBpZiAodHlwZSA9PT0gJ29yZ2FuaXphdGlvbicpIHJldHVybiBhd2FpdCB0aGlzLmNhbGxDV1JDKHF1ZXJ5LCAnb3JnYW5pemF0aW9uJyk7XG4gICAgaWYgKHR5cGUgPT09ICd0aXRsZScpIHJldHVybiBhd2FpdCB0aGlzLmNhbGxDV1JDKHF1ZXJ5LCAndGl0bGUnKTtcblxuICAgIHRocm93IG5ldyBFcnJvcignRW50aXR5IHR5cGUgaW52YWxpZCcpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBjYWxsQ1dSQyhxdWVyeTogc3RyaW5nLCB0eXBlOiBOYW1lZEVudGl0eVR5cGUpIHtcbiAgICBjb25zdCBlbmNvZGVVUkkgPSBlbmNvZGVVUklDb21wb25lbnQocXVlcnkpO1xuICAgIC8vIGNvbnN0IHVybFF1ZXJ5ID0gYCR7c2VhcmNoUm9vdH0vc2VhcmNoLyR7dHlwZX0/cXVlcnk9JHtlbmNvZGVVUkl9JmxpbWl0PSR7TElNSVR9JnBhZ2U9JHtwYWdlfWA7XG5cbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHtcbiAgICAgIHF1ZXJ5OiBlbmNvZGVVUkksXG4gICAgICBsaW1pdDogdGhpcy5MSU1JVC50b1N0cmluZygpLFxuICAgICAgcGFnZTogdGhpcy5wYWdlLnRvU3RyaW5nKCksXG4gICAgfSk7XG5cbiAgICBjb25zdCB1cmxRdWVyeSA9IGAke3RoaXMuc2VhcmNoUm9vdH0vc2VhcmNoLyR7dHlwZX0/JHtwYXJhbXN9YDtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5heGlvc0luc3RhbmNlLmdldCh1cmxRdWVyeSk7XG5cbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xuICAgICAgY29uc3QgZXJyb3JNc2cgPSBgXG4gICAgICAgIFNvbWV0aGluZyB3cm9uZyB3aXRoIHRoZSBjYWxsIHRvIENXUkMsIHBvc3NpYmx5IGEgcHJvYmxlbSB3aXRoIHRoZSBuZXR3b3JrIG9yIHRoZSBzZXJ2ZXIuXG4gICAgICAgIEhUVFAgZXJyb3I6ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1cbiAgICAgIGA7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JNc2cpO1xuICAgIH1cblxuICAgIGlmICghcmVzcG9uc2UuZGF0YS5yZXNwb25zZS5vYmplY3RzKSByZXR1cm4gW107XG5cbiAgICBjb25zdCByZXN1bHQ6IElSZXN1bHRbXSA9IHJlc3BvbnNlLmRhdGEucmVzcG9uc2Uub2JqZWN0cy5tYXAoXG4gICAgICAoeyBQSUQsIG9iamVjdF9sYWJlbCB9OiB7IFBJRDogc3RyaW5nOyBvYmplY3RfbGFiZWw6IHN0cmluZyB9KSA9PiB7XG4gICAgICAgIGNvbnN0IGlkID0gUElEO1xuICAgICAgICBjb25zdCBuYW1lID0gb2JqZWN0X2xhYmVsO1xuICAgICAgICBjb25zdCB1cmkgPSBgJHt0aGlzLmVudGl0eVJvb3R9LyR7aWR9YDtcblxuICAgICAgICBjb25zdCBuYW1lc3BhY2UgPSBpZC5zdWJzdHJpbmcoMCwgaWQuaW5kZXhPZignOicpKTtcbiAgICAgICAgY29uc3QgbG9nbyA9IHRoaXMucHJvamVjdHNbbmFtZXNwYWNlXTtcblxuICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgbG9nbzogbG9nbyA/IGAke3RoaXMucHJvamVjdExvZ29Sb290fS8ke2xvZ299YCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICByZXBvc2l0b3J5OiAnQ1dSQycsXG4gICAgICAgICAgcXVlcnksXG4gICAgICAgICAgdHlwZSxcbiAgICAgICAgICB1cmksXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICB9XG4gICAgKTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0IGFsbCB0aGUgcHJvcGVydGllcyBuZWNlc3NhcnkgZm9yIHRoZSBwcm9qZWN0IGxvb2t1cCwgdGhlbiBwZXJmb3JtIHRoZSBsb29rdXBcbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xuICAgKiBAcGFyYW0ge1N0cmluZ30gcHJvamVjdExvZ29Sb290IFRoZSByb290IGRpcmVjdG9yeSB0aGF0IHByb2plY3QgbG9nb3MgYXJlIGxvY2F0ZWQgaW5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHByb2plY3RMb29rdXBVcmwgVGhlIGFjdHVhbCB1cmwgZm9yIHRoZSBsb29rdXBcbiAgICogQHBhcmFtIHtTdHJpbmd9IGN3cmNQcm9qZWN0SWQgVGhlIElEIGFzc2lnbmVkIHRvIHRoZSBDV1JDIENvbW1vbnMgcHJvamVjdFxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgcHJvamVjdHMgKG5hbWVzcGFjZSBhbmQgbG9nbylcbiAgICovXG4gIGFzeW5jIHNldFByb2plY3RMb29rdXBDb25maWcoY29uZmlnOiB7XG4gICAgY3dyY1Byb2plY3RJZDogc3RyaW5nO1xuICAgIHByb2plY3RMb2dvUm9vdDogc3RyaW5nO1xuICAgIHByb2plY3RMb29rdXBVcmw6IHN0cmluZztcbiAgfSkge1xuICAgIHRoaXMucHJvamVjdExvZ29Sb290ID0gY29uZmlnLnByb2plY3RMb2dvUm9vdDtcbiAgICB0aGlzLmN3cmNQcm9qZWN0SWQgPSBjb25maWcuY3dyY1Byb2plY3RJZDtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5kb1Byb2plY3RMb29rdXAoY29uZmlnLnByb2plY3RMb29rdXBVcmwpO1xuICB9XG5cbiAgZG9Qcm9qZWN0TG9va3VwID0gYXN5bmMgKHVybDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmF4aW9zSW5zdGFuY2VcbiAgICAgIC5nZXQodXJsLCB7XG4gICAgICAgIGhlYWRlcnM6IHsgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicgfSxcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICAgICAgc3RhdHVzVGV4dDogYFRoZSByZXF1ZXN0IGV4ZWVkZWQgdGhlIHRpbWVvdXQgKCR7dGhpcy50aW1lb3V0fSlgLFxuICAgICAgICAgIGRhdGE6IHVuZGVmaW5lZCxcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcbiAgICAgIGNvbnN0IGVycm9yTXNnID0gYFxuICAgICAgU29tZXRoaW5nIHdyb25nIHdpdGggdGhlIGNhbGwgdG8gQ1dSQywgcG9zc2libHkgYSBwcm9ibGVtIHdpdGggdGhlIG5ldHdvcmsgb3IgdGhlIHNlcnZlci5cbiAgICAgIEhUVFAgZXJyb3I6ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1cbiAgICBgO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yTXNnKTtcbiAgICB9XG5cbiAgICB0aGlzLnByb2plY3RzID0gdGhpcy5wYXJzZVByb2plY3RzRGF0YShyZXNwb25zZSk7XG4gICAgcmV0dXJuIHRoaXMucHJvamVjdHM7XG4gIH07XG5cbiAgcHJpdmF0ZSBwYXJzZVByb2plY3RzRGF0YShkYXRhOiB7IFt4OiBzdHJpbmddOiBhbnkgfSkge1xuICAgIGNvbnN0IHBhcnNlZFByb2plY3RzOiB7IFt4OiBzdHJpbmddOiBhbnkgfSA9IHt9O1xuXG4gICAgZm9yIChsZXQgcHJvamVjdEtleSBpbiBkYXRhKSB7XG4gICAgICBjb25zdCBwcm9qZWN0ID0gZGF0YVtwcm9qZWN0S2V5XTtcblxuICAgICAgbGV0IGxvZ29GaWxlbmFtZTtcbiAgICAgIGNvbnN0IGZpZWxkTG9nbyA9IHByb2plY3QuZmllbGRfbG9nbztcbiAgICAgIGlmIChmaWVsZExvZ28gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gZmllbGRMb2dvKSB7XG4gICAgICAgICAgY29uc3QgZW50cnkgPSBmaWVsZExvZ29ba2V5XTtcbiAgICAgICAgICBpZiAoZW50cnkubGVuZ3RoID4gMCkgbG9nb0ZpbGVuYW1lID0gZW50cnlbMF0uZmlsZW5hbWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGV0IHByb2plY3RJZDtcbiAgICAgIGNvbnN0IGZpZWxkVG9wTGV2ZWwgPSBwcm9qZWN0LmZpZWxkX3RvcF9sZXZlbF9jb2xsZWN0aW9uO1xuICAgICAgaWYgKGZpZWxkVG9wTGV2ZWwgIT09IHVuZGVmaW5lZCAmJiBmaWVsZFRvcExldmVsLnVuZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IHVuZCA9IGZpZWxkVG9wTGV2ZWwudW5kO1xuICAgICAgICBpZiAodW5kLmxlbmd0aCA+IDAgJiYgdW5kWzBdLnBpZCkge1xuICAgICAgICAgIGNvbnN0IHBpZCA9IHVuZFswXS5waWQ7XG4gICAgICAgICAgY29uc3QgbmFtZXNwYWNlID1cbiAgICAgICAgICAgIHBpZCA9PT0gdGhpcy5jd3JjUHJvamVjdElkID8gJ2N3cmMnIDogcGlkLnN1YnN0cmluZygwLCBwaWQuaW5kZXhPZignOicpKTtcbiAgICAgICAgICBpZiAobmFtZXNwYWNlICE9PSAnJykgcHJvamVjdElkID0gbmFtZXNwYWNlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChsb2dvRmlsZW5hbWUgJiYgcHJvamVjdElkKSB7XG4gICAgICAgIGlmICghcGFyc2VkUHJvamVjdHNbcHJvamVjdElkXSkge1xuICAgICAgICAgIHBhcnNlZFByb2plY3RzW3Byb2plY3RJZF0gPSBsb2dvRmlsZW5hbWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlZFByb2plY3RzO1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=