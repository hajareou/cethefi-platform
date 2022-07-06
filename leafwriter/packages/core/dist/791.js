"use strict";
(self["webpackChunkLeafwriter"] = self["webpackChunkLeafwriter"] || []).push([[791],{

/***/ 60791:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Cwrc)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67620);
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
//# sourceMappingURL=791.js.map