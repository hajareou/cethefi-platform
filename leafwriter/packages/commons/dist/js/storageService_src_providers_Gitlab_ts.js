"use strict";
(self["webpackChunk_cwrc_leafwriter_commons"] = self["webpackChunk_cwrc_leafwriter_commons"] || []).push([["storageService_src_providers_Gitlab_ts"],{

/***/ "../storageService/src/providers/Gitlab.ts":
/*!*************************************************!*\
  !*** ../storageService/src/providers/Gitlab.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Gitlab)
/* harmony export */ });
/* harmony import */ var autosuggest_highlight_match__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! autosuggest-highlight/match */ "../../node_modules/autosuggest-highlight/match/index.js");
/* harmony import */ var autosuggest_highlight_match__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(autosuggest_highlight_match__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "../../node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var buffer___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! buffer/ */ "../../node_modules/buffer/index.js");
/* harmony import */ var _utilities_log__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utilities/log */ "../storageService/src/utilities/log.ts");




const BASE_URL = "https://gitlab.com/api/v4";
class Gitlab {
  constructor({ access_token }) {
    this.name = "gitlab";
    this.userId = "";
    this.username = "";
    if (!access_token)
      throw new Error("No access token provided");
    this.axios = axios__WEBPACK_IMPORTED_MODULE_1___default().create({
      baseURL: BASE_URL,
      headers: { Authorization: `Bearer ${access_token}` }
    });
  }
  decodeContent(content) {
    return buffer___WEBPACK_IMPORTED_MODULE_2__.Buffer.from(content, "base64").toString("utf8");
  }
  parseHeaderLink(s) {
    const output = {};
    const regex = /<([^>]+)>; rel="([^"]+)"/g;
    let m;
    while (m = regex.exec(s)) {
      const [, v, k] = m;
      output[k] = v;
    }
    return output;
  }
  async getAuthenticatedUser() {
    const response = await this.axios.get("/user");
    if (!response)
      return null;
    const user = response.data;
    this.userId = user.id.toString();
    this.username = user.username;
    return user;
  }
  async getDetailsForUser({ user: id, type }) {
    const response = type === "organization" ? await this.axios.get(`/groups/${id}`).catch(() => null) : await this.axios.get(`/users/${id}`).catch(() => null);
    if (!response)
      return null;
    const user = response.data;
    if (type === "organization")
      user.username = user.path;
    return user;
  }
  async getOrganizationsForAuthenticatedUser({ nextPage, per_page = 30 }) {
    const response = nextPage ? await this.axios.get(nextPage) : await this.axios.get(`/groups`, { params: { pagination: "keyset", per_page } });
    if (!response)
      return null;
    const collection = response.data ?? [];
    const organization = collection.map((org) => {
      org.username = org.path;
      return org;
    });
    const headerLinks = response.headers.link ? this.parseHeaderLink(response.headers.link) : null;
    const nextPageLink = headerLinks ? headerLinks.next : null;
    return { collection: organization, nextPage: nextPageLink };
  }
  async getReposForOrganization({ orgId: id, nextPage, per_page = 60 }) {
    if (!id)
      return null;
    const response = nextPage ? await this.axios.get(nextPage) : await this.axios.get(`/groups/${id}/projects`, {
      params: { pagination: "keyset", per_page }
    });
    if (!response)
      return null;
    let collection = response.data ?? [];
    if (collection.length > 0) {
      collection = collection.map((repo) => {
        repo.owner = repo.namespace;
        repo.owner.username = repo.owner.path;
        return repo;
      });
    }
    const headerLinks = response.headers.link ? this.parseHeaderLink(response.headers.link) : null;
    const nextPageLink = headerLinks ? headerLinks.next : null;
    return { collection, nextPage: nextPageLink };
  }
  async getReposForAuthenticatedUser({
    collectionSource,
    nextPage,
    per_page = 60
  }) {
    let response;
    if (nextPage) {
      response = await this.axios.get(nextPage);
    } else {
      const access = collectionSource === "collaborator" ? { membership: true } : { owned: true };
      response = await this.axios.get("/projects", { params: { per_page, ...access } });
    }
    let collection = response.data ?? [];
    if (collection.length > 0) {
      if (collectionSource === "collaborator") {
        collection = collection.filter((repo) => repo.namespace.path !== this.username);
      }
      collection = collection.map((repo) => {
        repo.owner = repo.namespace;
        repo.owner.username = repo.owner.path;
        return repo;
      });
    }
    const headerLinks = response.headers.link ? this.parseHeaderLink(response.headers.link) : null;
    const nextPageLink = headerLinks ? headerLinks.next : null;
    return { collection, nextPage: nextPageLink };
  }
  async getReposForUser({ username, nextPage, per_page = 60 }) {
    let response;
    if (nextPage) {
      response = await this.axios.get(nextPage);
    } else {
      response = await this.axios.get(`/users/${username}/projects`, {
        params: {
          per_page
        }
      });
    }
    let collection = response.data;
    if (response.data.length > 0) {
      collection = collection.map((repo) => {
        repo.owner = repo.namespace;
        repo.owner.username = repo.owner.path;
        return repo;
      });
    }
    const headerLinks = response.headers.link ? this.parseHeaderLink(response.headers.link) : null;
    const nextPageLink = headerLinks ? headerLinks.next : null;
    return { collection, nextPage: nextPageLink };
  }
  async getRepo({ checkForkStatus, repoId }) {
    const encodedPath = encodeURIComponent(repoId);
    const response = await this.axios.get(`/projects/${encodedPath}`).catch((error) => {
      throw new Error(`Repository not found: ${error}`);
    });
    if (checkForkStatus) {
      const validateForkCreation = (status) => status === "finished";
      await this.pool({
        fn: this.getImportStatus,
        params: response.data.id,
        validate: validateForkCreation
      }).catch(() => {
        throw new Error("Fork is taking too long. Try again later.");
      });
    }
    const repo = response.data;
    repo.owner = repo.namespace;
    repo.owner.username = repo.owner.path;
    return repo;
  }
  async getRepoContent({ path, branch, repoId }) {
    const response = await this.axios.get(`/projects/${repoId}/repository/tree`, {
      params: { path, ref: branch }
    }).catch(() => null);
    if (!response)
      return null;
    let content = response.data;
    if (Array.isArray(content)) {
      content = content.map((item) => {
        item.type = item.type === "tree" ? "folder" : item.type === "bloob" ? "file" : item.type;
        return item;
      });
    } else {
      content.type = content.type === "tree" ? "folder" : content.type === "blob" ? "file" : content.type;
    }
    return content;
  }
  async getRepoContentRecursively({ path, branch, repoId }) {
    const response = await this.axios.get(`/projects/${repoId}/repository/tree`, {
      params: { path, ref: branch, recursive: true }
    });
    if (!response)
      return null;
    const repoTree = response.data ?? [];
    const tree = repoTree.map((item) => {
      const pathArray = item.path?.split("/");
      const name = pathArray?.pop() ?? "";
      const path2 = pathArray?.join("/") ?? "";
      const type = item.type === "tree" ? "folder" : "file";
      return { name, path: path2, type };
    });
    return tree;
  }
  async getRepoBranches({ repoId }) {
    const response = await this.axios.get(`${BASE_URL}/projects/${repoId}/repository/branches`);
    if (!response)
      return null;
    return response.data;
  }
  async searchUsers(query) {
    const usersResponse = await this.axios.get("/search", {
      params: { per_page: 5, scope: "users", search: query }
    });
    if (!usersResponse)
      return [];
    const usersData = usersResponse.data ?? [];
    const userCollection = usersData.map(({ avatar_url, id, name, username }) => ({
      avatar_url,
      id,
      name,
      type: "user",
      username
    }));
    let collection = userCollection ?? [];
    const groupCollection = await this.searchGroups(query);
    if (groupCollection)
      collection = [...userCollection, ...groupCollection];
    return collection;
  }
  async searchGroups(query) {
    const groupsResponse = await this.axios.get("/groups", {
      params: { per_page: 5, search: query }
    });
    if (!groupsResponse)
      return null;
    const groupData = groupsResponse.data ?? [];
    const groupCollection = groupData.map((item) => ({
      avatar_url: item.avatar_url,
      id: item.id,
      name: item.full_name,
      type: "organization",
      username: item.full_path
    }));
    return groupCollection;
  }
  async searchBlobs({
    extension,
    repoId,
    query
  }) {
    let search = query;
    if (extension)
      search += ` extension:${extension}`;
    const response = await this.axios.get(`/projects/${repoId}/search`, {
      params: { per_page: 30, scope: "blobs", search }
    });
    if (!response)
      return [];
    const results = response.data ?? [];
    const searchResults = [];
    results.forEach((item) => {
      const duplicated = searchResults.find((sr) => sr.name === item.filename);
      if (duplicated) {
        if (duplicated.text_matches.length > 2)
          return;
        duplicated.text_matches.push({
          fragment: item.data,
          matches: [{ indices: autosuggest_highlight_match__WEBPACK_IMPORTED_MODULE_0___default()(item.data, query)[0], text: query }]
        });
        return;
      }
      const pathToFile = item.path.split("/");
      pathToFile.pop();
      const text_matches = [
        {
          fragment: item.data,
          matches: [{ indices: autosuggest_highlight_match__WEBPACK_IMPORTED_MODULE_0___default()(item.data, query)[0], text: query }]
        }
      ];
      const simplifiedItem = {
        name: item.filename,
        type: "file",
        path: pathToFile.join("/"),
        text_matches
      };
      searchResults.push(simplifiedItem);
    });
    _utilities_log__WEBPACK_IMPORTED_MODULE_3__.log.info(searchResults);
    return searchResults;
  }
  async getLatestCommit({ repoId, path = "" }) {
    if (!repoId)
      return null;
    const encodedPath = encodeURIComponent(path);
    const response = await this.axios.get(`/projects/${repoId}/repository/commits`, {
      params: { path: encodedPath }
    }).catch(() => null);
    if (!response)
      return null;
    const latest = response.data[0];
    const latestCommit = {
      authorEmail: latest.author_email,
      authorName: latest.author_name,
      date: latest.authored_date,
      html_url: latest.web_url,
      message: latest.message
    };
    return latestCommit;
  }
  async getDocument({ path = "", branch: ref, repoId }) {
    if (!repoId)
      return null;
    const encodedPath = encodeURIComponent(path);
    const response = await this.axios.get(`/projects/${repoId}/repository/files/${encodedPath}`, {
      params: { ref }
    }).catch(() => null);
    if (!response)
      return null;
    const { content, last_commit_id } = response.data;
    const document = {
      content: this.decodeContent(content),
      hash: last_commit_id,
      url: `https://gitlab.com/api/v4/projects/${repoId}/repository/files/${encodedPath}/raw`
    };
    return document;
  }
  async createRepo({ description, isPrivate = false, name }) {
    const response = await this.axios.post("/projects", {
      description,
      initialize_with_readme: true,
      name,
      visibility: isPrivate ? "private" : "public"
    }).catch(() => null);
    if (!response)
      return null;
    const repo = response.data;
    repo.owner = repo.namespace;
    repo.owner.username = repo.owner.path;
    return repo;
  }
  async checkOrgMemberWritenPermission({
    orgId: groupId,
    userId
  }) {
    if (!groupId || !userId)
      return false;
    const response = await this.axios.get(`/groups/${groupId}/members/${userId}`).catch(() => null);
    if (!response)
      return false;
    if (response.data.access_level >= 30)
      return true;
    return false;
  }
  async createRepoInOrg({ description, isPrivate, name, orgId }) {
    if (!orgId)
      return null;
    const response = await this.axios.post("/projects", {
      description,
      initialize_with_readme: true,
      name,
      namespace_id: orgId,
      visibility: isPrivate ? "private" : "public"
    }).catch(() => null);
    if (!response)
      return null;
    const repo = response.data;
    repo.owner = repo.namespace;
    repo.owner.username = repo.owner.path;
    return repo;
  }
  async checkRepoUserWritenPermission({ repoId, userId }) {
    if (!repoId || !userId)
      return false;
    const response = await this.axios.get(`/projects/${repoId}/members/all/${userId}`).catch(() => null);
    if (!response)
      return false;
    if (response.data.access_level >= 30)
      return true;
    return false;
  }
  async createFolder({ branch, message, path, repoId }) {
    if (!repoId)
      return null;
    const filename = ".gitkeep";
    path = `${path}/${filename}`;
    const encodedPath = encodeURIComponent(path);
    const response = await this.axios.post(`/projects/${repoId}/repository/files/${encodedPath}`, {
      branch,
      content: "",
      commit_message: message
    }).catch(() => null);
    return response;
  }
  async saveDocument(params) {
    const { branch, path, repoId, hash } = params;
    if (!params.repoId)
      return null;
    const response = hash ? await this.updateFile(params) : await this.createFile(params);
    if (!response)
      return null;
    const documentResponse = await this.getDocument({ branch, path, repoId });
    if (!documentResponse)
      return null;
    const updatedResource = { ...params, hash: documentResponse.hash };
    return updatedResource;
  }
  async createFile(params) {
    const { branch, content, message, path, repoId } = params;
    const encodedPath = encodeURIComponent(path);
    const response = await this.axios.post(`/projects/${repoId}/repository/files/${encodedPath}`, {
      branch,
      content,
      commit_message: message
    }).catch(() => null);
    if (!response)
      return;
    return params;
  }
  async updateFile(params) {
    const { branch, content, message, path, repoId, hash } = params;
    if (!hash)
      return null;
    const encodedPath = encodeURIComponent(path);
    const response = await this.axios.put(`/projects/${repoId}/repository/files/${encodedPath}`, {
      branch,
      content,
      commit_message: message,
      last_commit_id: hash
    }).catch(() => null);
    if (!response)
      return;
    return params;
  }
  async createFork({ repoId }) {
    const response = await this.axios.post(`/projects/${repoId}/fork`).catch((error) => {
      throw new Error(error);
    });
    const fork = response.data;
    const validateForkCreation = (status) => status === "finished";
    await this.pool({
      fn: this.getImportStatus,
      params: response.data.id,
      validate: validateForkCreation
    }).catch(() => {
      throw new Error("Fork is taking too long. Try again later.");
    });
    return fork;
  }
  async pool({ fn, params, validate, interval = 1e4, maxAttempts = 12 }) {
    let attempts = 0;
    const fnToPoll = fn.bind(this);
    const executePoll = async (resolve, reject) => {
      const result = await fnToPoll(params);
      attempts++;
      if (validate && validate(result)) {
        return resolve(result);
      } else if (attempts === maxAttempts) {
        return reject(new Error("Exceeded max attempts"));
      } else {
        setTimeout(executePoll, interval, resolve, reject);
      }
    };
    return new Promise(executePoll);
  }
  async getImportStatus(repoId) {
    const response = await this.axios.get(`/projects/${repoId}/import`).catch(() => null);
    if (!response)
      return "none";
    return response.data.import_status;
  }
  async getBranch({ branch, repoId }) {
    if (!repoId)
      return null;
    const response = await this.axios.get(`/projects/${repoId}/repository/branches/${branch}`).catch(() => null);
    if (!response)
      return null;
    return response.data;
  }
  async checkForBranch({ branch, repoId }) {
    const response = await this.getBranch({ branch, repoId });
    if (!response)
      return false;
    return true;
  }
  async createBranch({ repoId, branchOrigin, branchTarget }) {
    if (!repoId)
      return null;
    const response = await this.axios.post(`/projects/${repoId}/repository/branches`, {
      branch: branchTarget,
      ref: branchOrigin
    }).catch(() => null);
    if (!response)
      return;
    return response.data;
  }
  async checkForMergeRequest({ branchHead, branchOrigin, repoId }) {
    const mergeRequests = await this.axios.get(`/projects/${repoId}/merge_requests`, {
      params: {
        state: "opened",
        source_branch: branchHead,
        target_branch: branchOrigin
      }
    }).catch(() => null);
    if (!mergeRequests)
      return false;
    return mergeRequests.data.length > 0;
  }
  async createPullRequest({ branchOrigin, branchHead, origin, title }) {
    const doesMergeRequestExist = await this.checkForMergeRequest({
      branchOrigin,
      branchHead,
      repoId: origin.id
    });
    if (doesMergeRequestExist)
      return "exists";
    const pullRequest = await this.axios.post(`/projects/${origin.id}/merge_requests`, {
      source_branch: branchHead,
      target_branch: branchOrigin,
      title
    }).catch(() => null);
    if (!pullRequest)
      return null;
    return "created";
  }
  async createPullRequestFromFork({ fork, origin, title }) {
    const doesMergeRequestExist = await this.checkForMergeRequest({
      branchOrigin: origin.default_branch,
      branchHead: fork.default_branch,
      repoId: origin.id
    });
    if (doesMergeRequestExist)
      return "exists";
    const pullRequest = await this.axios.post(`/projects/${fork.id}/merge_requests`, {
      source_branch: fork.default_branch,
      target_branch: origin.default_branch,
      target_project_id: origin.id,
      title
    }).catch(() => null);
    if (!pullRequest)
      return null;
    return "created";
  }
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvc3RvcmFnZVNlcnZpY2Vfc3JjX3Byb3ZpZGVyc19HaXRsYWJfdHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUlBO0FBRUEsTUFBTSxXQUFXO0FBd0NGLE1BQU0sT0FBMkI7QUFBQSxFQVk5QyxZQUFZLEVBQUUsZ0JBQW9DO0FBWGxELFNBQVMsT0FBTztBQUloQixrQkFBUztBQUNULG9CQUFXO0FBT1QsUUFBSSxDQUFDO0FBQWMsWUFBTSxJQUFJLE1BQU0sMEJBQTBCO0FBRTdELFNBQUssUUFBUSxtREFBWSxDQUFDO0FBQUEsTUFDeEIsU0FBUztBQUFBLE1BQ1QsU0FBUyxFQUFFLGVBQWUsVUFBVSxlQUFlO0FBQUEsSUFDckQsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUVBLGNBQXNCLFNBQWlCO0FBQ3JDLFdBQU8sZ0RBQVcsQ0FBQyxTQUFTLFFBQVEsRUFBRSxTQUFTLE1BQU07QUFBQSxFQUN2RDtBQUFBLEVBRUEsZ0JBQXdCLEdBQVc7QUFDakMsVUFBTSxTQUFrQyxDQUFDO0FBQ3pDLFVBQU0sUUFBUTtBQUVkLFFBQUk7QUFDSixXQUFRLElBQUksTUFBTSxLQUFLLENBQUMsR0FBSTtBQUMxQixZQUFNLENBQUMsRUFBRSxHQUFHLEtBQUs7QUFDakIsYUFBTyxLQUFLO0FBQUEsSUFDZDtBQUVBLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFFQSxNQUFNLHVCQUF1QjtBQUMzQixVQUFNLFdBQXNDLE1BQU0sS0FBSyxNQUFNLElBQUksT0FBTztBQUN4RSxRQUFJLENBQUM7QUFBVSxhQUFPO0FBRXRCLFVBQU0sT0FBTyxTQUFTO0FBRXRCLFNBQUssU0FBUyxLQUFLLEdBQUcsU0FBUztBQUMvQixTQUFLLFdBQVcsS0FBSztBQUVyQixXQUFPO0FBQUEsRUFDVDtBQUFBLEVBRUEsTUFBTSxrQkFBa0IsRUFBRSxNQUFNLElBQUksUUFBZ0M7QUFDbEUsVUFBTSxXQUNKLFNBQVMsaUJBQ0wsTUFBTSxLQUFLLE1BQU0sSUFBSSxX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T0FBTztBQUFBLElBQ2pCLENBQUM7QUFFRCxRQUFJO0FBQXVCLGFBQU87QUFJbEMsVUFBTSxjQUF5QyxNQUFNLEtBQUssTUFDdkQsS0FBSyxhQUFhLE9BQU8scUJBQXFCO0FBQUEsTUFDN0MsZUFBZTtBQUFBLE1BQ2YsZUFBZTtBQUFBLE1BQ2Y7QUFBQSxJQUNGLENBQUMsRUFDQSxNQUFNLE1BQU0sSUFBSTtBQUVuQixRQUFJLENBQUM7QUFBYSxhQUFPO0FBRXpCLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFXQSxNQUFNLDBCQUEwQixFQUFFLE1BQU0sUUFBUSxTQUF3QztBQUV0RixVQUFNLHdCQUF3QixNQUFNLEtBQUsscUJBQXFCO0FBQUEsTUFDNUQsY0FBYyxPQUFPO0FBQUEsTUFDckIsWUFBWSxLQUFLO0FBQUEsTUFDakIsUUFBUSxPQUFPO0FBQUEsSUFDakIsQ0FBQztBQUVELFFBQUk7QUFBdUIsYUFBTztBQUVsQyxVQUFNLGNBQXlDLE1BQU0sS0FBSyxNQUN2RCxLQUFLLGFBQWEsS0FBSyxxQkFBcUI7QUFBQSxNQUMzQyxlQUFlLEtBQUs7QUFBQSxNQUNwQixlQUFlLE9BQU87QUFBQSxNQUN0QixtQkFBbUIsT0FBTztBQUFBLE1BQzFCO0FBQUEsSUFDRixDQUFDLEVBQ0EsTUFBTSxNQUFNLElBQUk7QUFFbkIsUUFBSSxDQUFDO0FBQWEsYUFBTztBQUV6QixXQUFPO0FBQUEsRUFDVDtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGN3cmMvbGVhZndyaXRlci1jb21tb25zLy4uL3N0b3JhZ2VTZXJ2aWNlL3NyYy9wcm92aWRlcnMvR2l0bGFiLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtYXRjaCBmcm9tICdhdXRvc3VnZ2VzdC1oaWdobGlnaHQvbWF0Y2gnO1xuaW1wb3J0IGF4aW9zLCB7IEF4aW9zSW5zdGFuY2UsIEF4aW9zUmVzcG9uc2UgfSBmcm9tICdheGlvcyc7XG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tICdidWZmZXIvJztcbmltcG9ydCB0eXBlICogYXMgVHlwZXMgZnJvbSAnLi4vdHlwZXMvUHJvdmlkZXInO1xuaW1wb3J0IHR5cGUgUHJvdmlkZXIgZnJvbSAnLi4vdHlwZXMvUHJvdmlkZXInO1xuaW1wb3J0IHR5cGUgKiBhcyBUIGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4uL3V0aWxpdGllcy9sb2cnO1xuXG5jb25zdCBCQVNFX1VSTCA9ICdodHRwczovL2dpdGxhYi5jb20vYXBpL3Y0JztcblxuLy8gIC0tLS0tLS0tLS0gQVBJXG4vL2h0dHBzOi8vZG9jcy5naXRsYWIuY29tL2VlL2FwaS9hcGlfcmVzb3VyY2VzLmh0bWxcblxuLy8gLS0tLS0tLS0tLS0tLSBJbnRlcm5hbCB0eXBlcyAtLS0tLS0tLS0tLS0tLVxuXG5pbnRlcmZhY2UgVGV4dE1hdGNoIHtcbiAgZnJhZ21lbnQ6IHN0cmluZztcbiAgbWF0Y2hlczoge1xuICAgIGluZGljZXM6IFtudW1iZXIsIG51bWJlcl07XG4gICAgdGV4dDogc3RyaW5nO1xuICB9W107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2VhcmNoQmxvYnNJdGVtIHtcbiAgbmFtZTogc3RyaW5nO1xuICB0eXBlOiAnZmlsZSc7XG4gIHBhdGg6IHN0cmluZztcbiAgdGV4dF9tYXRjaGVzOiBUZXh0TWF0Y2hbXTtcbn1cblxuaW50ZXJmYWNlIElDaGVja0Zvck1lcmdlUmVxdWVzdCB7XG4gIGJyYW5jaEhlYWQ6IHN0cmluZztcbiAgYnJhbmNoT3JpZ2luOiBzdHJpbmc7XG4gIHJlcG9JZDogc3RyaW5nO1xufVxuXG50eXBlIElJbXBvcnRTdGF0dXMgPSAnbm9uZScgfCAnc2NoZWR1bGVkJyB8ICdmYWlsZWQnIHwgJ3N0YXJ0ZWQnIHwgJ2ZpbmlzaGVkJztcblxuaW50ZXJmYWNlIElQb29sIHtcbiAgZm46IChwYXJhbXM6IGFueSkgPT4gUHJvbWlzZTxhbnk+O1xuICBwYXJhbXM/OiBhbnk7XG4gIHZhbGlkYXRlPzogKHZhbHVlOiBhbnkpID0+IGJvb2xlYW47XG4gIGludGVydmFsPzogbnVtYmVyO1xuICBtYXhBdHRlbXB0cz86IG51bWJlcjtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2l0bGFiIGltcGxlbWVudHMgUHJvdmlkZXIge1xuICByZWFkb25seSBuYW1lID0gJ2dpdGxhYic7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBheGlvczogQXhpb3NJbnN0YW5jZTtcblxuICB1c2VySWQgPSAnJztcbiAgdXNlcm5hbWUgPSAnJztcblxuICAvKipcbiAgICogQXV0aGVudGljYXRlIHRoZSB1c2VyIGZvciBtYWtpbmcgY2FsbHMgdG8gR2l0SHViLCB1c2luZyB0aGVpciBPQXV0aCB0b2tlbi5cbiAgICogQHBhcmFtIHthY2Nlc3NfdG9rZW59IHRva2VuIFRoZSBPQXV0aCBhY2Nlc3NfdG9rZW4gZnJvbSBHaXRsYWJcbiAgICovXG4gIGNvbnN0cnVjdG9yKHsgYWNjZXNzX3Rva2VuIH06IFR5cGVzLlByb3ZpZGVyQXV0aCkge1xuICAgIGlmICghYWNjZXNzX3Rva2VuKSB0aHJvdyBuZXcgRXJyb3IoJ05vIGFjY2VzcyB0b2tlbiBwcm92aWRlZCcpO1xuXG4gICAgdGhpcy5heGlvcyA9IGF4aW9zLmNyZWF0ZSh7XG4gICAgICBiYXNlVVJMOiBCQVNFX1VSTCxcbiAgICAgIGhlYWRlcnM6IHsgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke2FjY2Vzc190b2tlbn1gIH0sXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGRlY29kZUNvbnRlbnQoY29udGVudDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKGNvbnRlbnQsICdiYXNlNjQnKS50b1N0cmluZygndXRmOCcpO1xuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZUhlYWRlckxpbmsoczogc3RyaW5nKSB7XG4gICAgY29uc3Qgb3V0cHV0OiB7IFt4OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuICAgIGNvbnN0IHJlZ2V4ID0gLzwoW14+XSspPjsgcmVsPVwiKFteXCJdKylcIi9nO1xuXG4gICAgbGV0IG07XG4gICAgd2hpbGUgKChtID0gcmVnZXguZXhlYyhzKSkpIHtcbiAgICAgIGNvbnN0IFssIHYsIGtdID0gbTtcbiAgICAgIG91dHB1dFtrXSA9IHY7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxuXG4gIGFzeW5jIGdldEF1dGhlbnRpY2F0ZWRVc2VyKCkge1xuICAgIGNvbnN0IHJlc3BvbnNlOiBBeGlvc1Jlc3BvbnNlPGFueT4gfCBudWxsID0gYXdhaXQgdGhpcy5heGlvcy5nZXQoJy91c2VyJyk7XG4gICAgaWYgKCFyZXNwb25zZSkgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCB1c2VyID0gcmVzcG9uc2UuZGF0YTtcblxuICAgIHRoaXMudXNlcklkID0gdXNlci5pZC50b1N0cmluZygpO1xuICAgIHRoaXMudXNlcm5hbWUgPSB1c2VyLnVzZXJuYW1lO1xuXG4gICAgcmV0dXJuIHVzZXI7XG4gIH1cblxuICBhc3luYyBnZXREZXRhaWxzRm9yVXNlcih7IHVzZXI6IGlkLCB0eXBlIH06IFR5cGVzLlVzZXJEZXRhaWxQYXJhbXMpIHtcbiAgICBjb25zdCByZXNwb25zZTogQXhpb3NSZXNwb25zZTxhbnk+IHwgbnVsbCA9XG4gICAgICB0eXBlID09PSAnb3JnYW5pemF0aW9uJ1xuICAgICAgICA/IGF3YWl0IHRoaXMuYXhpb3MuZ2V0KGAvZ3JvdXBzLyR7aWR9YCkuY2F0Y2goKCkgPT4gbnVsbClcbiAgICAgICAgOiBhd2FpdCB0aGlzLmF4aW9zLmdldChgL3VzZXJzLyR7aWR9YCkuY2F0Y2goKCkgPT4gbnVsbCk7XG5cbiAgICBpZiAoIXJlc3BvbnNlKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IHVzZXIgPSByZXNwb25zZS5kYXRhO1xuICAgIGlmICh0eXBlID09PSAnb3JnYW5pemF0aW9uJykgdXNlci51c2VybmFtZSA9IHVzZXIucGF0aDtcblxuICAgIHJldHVybiB1c2VyO1xuICB9XG5cbiAgYXN5bmMgZ2V0T3JnYW5pemF0aW9uc0ZvckF1dGhlbnRpY2F0ZWRVc2VyKHsgbmV4dFBhZ2UsIHBlcl9wYWdlID0gMzAgfTogVHlwZXMuUGFnaW5hdG9yUGFyYW1zKSB7XG4gICAgY29uc3QgcmVzcG9uc2U6IEF4aW9zUmVzcG9uc2U8YW55PiB8IG51bGwgPSBuZXh0UGFnZVxuICAgICAgPyBhd2FpdCB0aGlzLmF4aW9zLmdldChuZXh0UGFnZSlcbiAgICAgIDogYXdhaXQgdGhpcy5heGlvcy5nZXQoYC9ncm91cHNgLCB7IHBhcmFtczogeyBwYWdpbmF0aW9uOiAna2V5c2V0JywgcGVyX3BhZ2UgfSB9KTtcblxuICAgIGlmICghcmVzcG9uc2UpIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgY29sbGVjdGlvbiA9IHJlc3BvbnNlLmRhdGEgPz8gW107XG4gICAgY29uc3Qgb3JnYW5pemF0aW9uID0gY29sbGVjdGlvbi5tYXAoKG9yZzogYW55KSA9PiB7XG4gICAgICBvcmcudXNlcm5hbWUgPSBvcmcucGF0aDtcbiAgICAgIHJldHVybiBvcmc7XG4gICAgfSk7XG5cbiAgICBjb25zdCBoZWFkZXJMaW5rcyA9IHJlc3BvbnNlLmhlYWRlcnMubGluayA/IHRoaXMucGFyc2VIZWFkZXJMaW5rKHJlc3BvbnNlLmhlYWRlcnMubGluaykgOiBudWxsO1xuICAgIGNvbnN0IG5leHRQYWdlTGluayA9IGhlYWRlckxpbmtzID8gaGVhZGVyTGlua3MubmV4dCA6IG51bGw7XG5cbiAgICByZXR1cm4geyBjb2xsZWN0aW9uOiBvcmdhbml6YXRpb24sIG5leHRQYWdlOiBuZXh0UGFnZUxpbmsgfTtcbiAgfVxuXG4gIGFzeW5jIGdldFJlcG9zRm9yT3JnYW5pemF0aW9uKHsgb3JnSWQ6IGlkLCBuZXh0UGFnZSwgcGVyX3BhZ2UgPSA2MCB9OiBUeXBlcy5SZXBvc0Zvck9yZ3NQYXJhbXMpIHtcbiAgICBpZiAoIWlkKSByZXR1cm4gbnVsbDtcbiAgICBjb25zdCByZXNwb25zZTogQXhpb3NSZXNwb25zZTxhbnk+IHwgbnVsbCA9IG5leHRQYWdlXG4gICAgICA/IGF3YWl0IHRoaXMuYXhpb3MuZ2V0KG5leHRQYWdlKVxuICAgICAgOiBhd2FpdCB0aGlzLmF4aW9zLmdldChgL2dyb3Vwcy8ke2lkfS9wcm9qZWN0c2AsIHtcbiAgICAgICAgICBwYXJhbXM6IHsgcGFnaW5hdGlvbjogJ2tleXNldCcsIHBlcl9wYWdlIH0sXG4gICAgICAgIH0pO1xuXG4gICAgaWYgKCFyZXNwb25zZSkgcmV0dXJuIG51bGw7XG5cbiAgICBsZXQgY29sbGVjdGlvbiA9IHJlc3BvbnNlLmRhdGEgPz8gW107XG5cbiAgICAvL2FkZCB1c2VybmFtZSBhdHRyYlxuICAgIGlmIChjb2xsZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uLm1hcCgocmVwbzogYW55KSA9PiB7XG4gICAgICAgIHJlcG8ub3duZXIgPSByZXBvLm5hbWVzcGFjZTtcbiAgICAgICAgcmVwby5vd25lci51c2VybmFtZSA9IHJlcG8ub3duZXIucGF0aDtcbiAgICAgICAgcmV0dXJuIHJlcG87XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBoZWFkZXJMaW5rcyA9IHJlc3BvbnNlLmhlYWRlcnMubGluayA/IHRoaXMucGFyc2VIZWFkZXJMaW5rKHJlc3BvbnNlLmhlYWRlcnMubGluaykgOiBudWxsO1xuICAgIGNvbnN0IG5leHRQYWdlTGluayA9IGhlYWRlckxpbmtzID8gaGVhZGVyTGlua3MubmV4dCA6IG51bGw7XG5cbiAgICByZXR1cm4geyBjb2xsZWN0aW9uLCBuZXh0UGFnZTogbmV4dFBhZ2VMaW5rIH07XG4gIH1cblxuICBhc3luYyBnZXRSZXBvc0ZvckF1dGhlbnRpY2F0ZWRVc2VyKHtcbiAgICBjb2xsZWN0aW9uU291cmNlLFxuICAgIG5leHRQYWdlLFxuICAgIHBlcl9wYWdlID0gNjAsXG4gIH06IFR5cGVzLlJlcG9zUGFyYW1zKSB7XG4gICAgbGV0IHJlc3BvbnNlOiBhbnk7XG5cbiAgICBpZiAobmV4dFBhZ2UpIHtcbiAgICAgIHJlc3BvbnNlID0gYXdhaXQgdGhpcy5heGlvcy5nZXQobmV4dFBhZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBhY2Nlc3MgPSBjb2xsZWN0aW9uU291cmNlID09PSAnY29sbGFib3JhdG9yJyA/IHsgbWVtYmVyc2hpcDogdHJ1ZSB9IDogeyBvd25lZDogdHJ1ZSB9O1xuICAgICAgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmF4aW9zLmdldCgnL3Byb2plY3RzJywgeyBwYXJhbXM6IHsgcGVyX3BhZ2UsIC4uLmFjY2VzcyB9IH0pO1xuICAgIH1cblxuICAgIGxldCBjb2xsZWN0aW9uID0gcmVzcG9uc2UuZGF0YSA/PyBbXTtcblxuICAgIGlmIChjb2xsZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmIChjb2xsZWN0aW9uU291cmNlID09PSAnY29sbGFib3JhdG9yJykge1xuICAgICAgICBjb2xsZWN0aW9uID0gY29sbGVjdGlvbi5maWx0ZXIoKHJlcG86IGFueSkgPT4gcmVwby5uYW1lc3BhY2UucGF0aCAhPT0gdGhpcy51c2VybmFtZSk7XG4gICAgICB9XG5cbiAgICAgIC8vYWRkIHVzZXJuYW1lIGF0dHJiXG4gICAgICBjb2xsZWN0aW9uID0gY29sbGVjdGlvbi5tYXAoKHJlcG86IGFueSkgPT4ge1xuICAgICAgICByZXBvLm93bmVyID0gcmVwby5uYW1lc3BhY2U7XG4gICAgICAgIHJlcG8ub3duZXIudXNlcm5hbWUgPSByZXBvLm93bmVyLnBhdGg7XG4gICAgICAgIHJldHVybiByZXBvO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgaGVhZGVyTGlua3MgPSByZXNwb25zZS5oZWFkZXJzLmxpbmsgPyB0aGlzLnBhcnNlSGVhZGVyTGluayhyZXNwb25zZS5oZWFkZXJzLmxpbmspIDogbnVsbDtcbiAgICBjb25zdCBuZXh0UGFnZUxpbmsgPSBoZWFkZXJMaW5rcyA/IGhlYWRlckxpbmtzLm5leHQgOiBudWxsO1xuXG4gICAgcmV0dXJuIHsgY29sbGVjdGlvbiwgbmV4dFBhZ2U6IG5leHRQYWdlTGluayB9O1xuICB9XG5cbiAgYXN5bmMgZ2V0UmVwb3NGb3JVc2VyKHsgdXNlcm5hbWUsIG5leHRQYWdlLCBwZXJfcGFnZSA9IDYwIH06IFR5cGVzLlJlcG9zRm9yVXNlclBhcmFtcykge1xuICAgIGxldCByZXNwb25zZTogYW55O1xuXG4gICAgaWYgKG5leHRQYWdlKSB7XG4gICAgICByZXNwb25zZSA9IGF3YWl0IHRoaXMuYXhpb3MuZ2V0KG5leHRQYWdlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmF4aW9zLmdldChgL3VzZXJzLyR7dXNlcm5hbWV9L3Byb2plY3RzYCwge1xuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICBwZXJfcGFnZSxcbiAgICAgICAgICAvLyBtaW5fYWNjZXNzX2xldmVsOiAzMFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgbGV0IGNvbGxlY3Rpb24gPSByZXNwb25zZS5kYXRhO1xuXG4gICAgaWYgKHJlc3BvbnNlLmRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgLy9hZGQgdXNlcm5hbWUgYXR0cmJcbiAgICAgIGNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uLm1hcCgocmVwbzogYW55KSA9PiB7XG4gICAgICAgIHJlcG8ub3duZXIgPSByZXBvLm5hbWVzcGFjZTtcbiAgICAgICAgcmVwby5vd25lci51c2VybmFtZSA9IHJlcG8ub3duZXIucGF0aDtcbiAgICAgICAgcmV0dXJuIHJlcG87XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBoZWFkZXJMaW5rcyA9IHJlc3BvbnNlLmhlYWRlcnMubGluayA/IHRoaXMucGFyc2VIZWFkZXJMaW5rKHJlc3BvbnNlLmhlYWRlcnMubGluaykgOiBudWxsO1xuICAgIGNvbnN0IG5leHRQYWdlTGluayA9IGhlYWRlckxpbmtzID8gaGVhZGVyTGlua3MubmV4dCA6IG51bGw7XG5cbiAgICByZXR1cm4geyBjb2xsZWN0aW9uLCBuZXh0UGFnZTogbmV4dFBhZ2VMaW5rIH07XG4gIH1cblxuICBhc3luYyBnZXRSZXBvKHsgY2hlY2tGb3JrU3RhdHVzLCByZXBvSWQgfTogVHlwZXMuUmVwb1BhcmFtcykge1xuICAgIGNvbnN0IGVuY29kZWRQYXRoID0gZW5jb2RlVVJJQ29tcG9uZW50KHJlcG9JZCk7XG4gICAgY29uc3QgcmVzcG9uc2U6IEF4aW9zUmVzcG9uc2U8YW55PiB8IG51bGwgPSBhd2FpdCB0aGlzLmF4aW9zXG4gICAgICAuZ2V0KGAvcHJvamVjdHMvJHtlbmNvZGVkUGF0aH1gKVxuICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFJlcG9zaXRvcnkgbm90IGZvdW5kOiAke2Vycm9yfWApO1xuICAgICAgfSk7XG5cbiAgICBpZiAoY2hlY2tGb3JrU3RhdHVzKSB7XG4gICAgICAvL2NoZWNrIHN0YXR1c1xuICAgICAgY29uc3QgdmFsaWRhdGVGb3JrQ3JlYXRpb24gPSAoc3RhdHVzOiBJSW1wb3J0U3RhdHVzKSA9PiBzdGF0dXMgPT09ICdmaW5pc2hlZCc7XG4gICAgICBhd2FpdCAoPFByb21pc2U8SUltcG9ydFN0YXR1cz4+dGhpcy5wb29sKHtcbiAgICAgICAgZm46IHRoaXMuZ2V0SW1wb3J0U3RhdHVzLFxuICAgICAgICBwYXJhbXM6IHJlc3BvbnNlLmRhdGEuaWQsXG4gICAgICAgIHZhbGlkYXRlOiB2YWxpZGF0ZUZvcmtDcmVhdGlvbixcbiAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGb3JrIGlzIHRha2luZyB0b28gbG9uZy4gVHJ5IGFnYWluIGxhdGVyLicpO1xuICAgICAgfSkpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlcG86IFQuUmVwb3NpdG9yeSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgcmVwby5vd25lciA9IHJlcG8ubmFtZXNwYWNlO1xuICAgIHJlcG8ub3duZXIudXNlcm5hbWUgPSByZXBvLm93bmVyLnBhdGg7XG5cbiAgICByZXR1cm4gcmVwbztcbiAgfVxuXG4gIGFzeW5jIGdldFJlcG9Db250ZW50KHsgcGF0aCwgYnJhbmNoLCByZXBvSWQgfTogVHlwZXMuUmVwb0NvbnRlbnRQYXJhbXMpIHtcbiAgICBjb25zdCByZXNwb25zZTogQXhpb3NSZXNwb25zZTxhbnk+IHwgbnVsbCA9IGF3YWl0IHRoaXMuYXhpb3NcbiAgICAgIC5nZXQoYC9wcm9qZWN0cy8ke3JlcG9JZH0vcmVwb3NpdG9yeS90cmVlYCwge1xuICAgICAgICBwYXJhbXM6IHsgcGF0aCwgcmVmOiBicmFuY2ggfSxcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4gbnVsbCk7XG5cbiAgICBpZiAoIXJlc3BvbnNlKSByZXR1cm4gbnVsbDtcblxuICAgIGxldCBjb250ZW50ID0gcmVzcG9uc2UuZGF0YTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KGNvbnRlbnQpKSB7XG4gICAgICBjb250ZW50ID0gY29udGVudC5tYXAoKGl0ZW06IGFueSkgPT4ge1xuICAgICAgICBpdGVtLnR5cGUgPSBpdGVtLnR5cGUgPT09ICd0cmVlJyA/ICdmb2xkZXInIDogaXRlbS50eXBlID09PSAnYmxvb2InID8gJ2ZpbGUnIDogaXRlbS50eXBlO1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250ZW50LnR5cGUgPVxuICAgICAgICBjb250ZW50LnR5cGUgPT09ICd0cmVlJyA/ICdmb2xkZXInIDogY29udGVudC50eXBlID09PSAnYmxvYicgPyAnZmlsZScgOiBjb250ZW50LnR5cGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cblxuICBhc3luYyBnZXRSZXBvQ29udGVudFJlY3Vyc2l2ZWx5KHsgcGF0aCwgYnJhbmNoLCByZXBvSWQgfTogVHlwZXMuUmVwb0NvbnRlbnRQYXJhbXMpIHtcbiAgICBjb25zdCByZXNwb25zZTogQXhpb3NSZXNwb25zZTxhbnk+IHwgbnVsbCA9IGF3YWl0IHRoaXMuYXhpb3MuZ2V0KFxuICAgICAgYC9wcm9qZWN0cy8ke3JlcG9JZH0vcmVwb3NpdG9yeS90cmVlYCxcbiAgICAgIHtcbiAgICAgICAgcGFyYW1zOiB7IHBhdGgsIHJlZjogYnJhbmNoLCByZWN1cnNpdmU6IHRydWUgfSxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgaWYgKCFyZXNwb25zZSkgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCByZXBvVHJlZSA9IHJlc3BvbnNlLmRhdGEgPz8gW107XG5cbiAgICBjb25zdCB0cmVlID0gcmVwb1RyZWUubWFwKChpdGVtOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHBhdGhBcnJheSA9IGl0ZW0ucGF0aD8uc3BsaXQoJy8nKTtcbiAgICAgIGNvbnN0IG5hbWUgPSBwYXRoQXJyYXk/LnBvcCgpID8/ICcnO1xuICAgICAgY29uc3QgcGF0aCA9IHBhdGhBcnJheT8uam9pbignLycpID8/ICcnO1xuICAgICAgY29uc3QgdHlwZSA9IGl0ZW0udHlwZSA9PT0gJ3RyZWUnID8gJ2ZvbGRlcicgOiAnZmlsZSc7XG5cbiAgICAgIHJldHVybiB7IG5hbWUsIHBhdGgsIHR5cGUgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0cmVlO1xuICB9XG5cbiAgYXN5bmMgZ2V0UmVwb0JyYW5jaGVzKHsgcmVwb0lkIH06IFR5cGVzLlJlcG9CcmFuY2hlc1BhcmFtcykge1xuICAgIGNvbnN0IHJlc3BvbnNlOiBBeGlvc1Jlc3BvbnNlPGFueT4gfCBudWxsID0gYXdhaXQgdGhpcy5heGlvcy5nZXQoXG4gICAgICBgJHtCQVNFX1VSTH0vcHJvamVjdHMvJHtyZXBvSWR9L3JlcG9zaXRvcnkvYnJhbmNoZXNgXG4gICAgKTtcbiAgICBpZiAoIXJlc3BvbnNlKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgfVxuXG4gIGFzeW5jIHNlYXJjaFVzZXJzKHF1ZXJ5OiBzdHJpbmcpIHtcbiAgICBjb25zdCB1c2Vyc1Jlc3BvbnNlOiBBeGlvc1Jlc3BvbnNlPGFueT4gfCBudWxsID0gYXdhaXQgdGhpcy5heGlvcy5nZXQoJy9zZWFyY2gnLCB7XG4gICAgICBwYXJhbXM6IHsgcGVyX3BhZ2U6IDUsIHNjb3BlOiAndXNlcnMnLCBzZWFyY2g6IHF1ZXJ5IH0sXG4gICAgfSk7XG4gICAgaWYgKCF1c2Vyc1Jlc3BvbnNlKSByZXR1cm4gW107XG5cbiAgICBjb25zdCB1c2Vyc0RhdGEgPSB1c2Vyc1Jlc3BvbnNlLmRhdGEgPz8gW107XG5cbiAgICBjb25zdCB1c2VyQ29sbGVjdGlvbjogYW55W10gPSB1c2Vyc0RhdGEubWFwKCh7IGF2YXRhcl91cmwsIGlkLCBuYW1lLCB1c2VybmFtZSB9OiBhbnkpID0+ICh7XG4gICAgICBhdmF0YXJfdXJsLFxuICAgICAgaWQsXG4gICAgICBuYW1lLFxuICAgICAgdHlwZTogJ3VzZXInLFxuICAgICAgdXNlcm5hbWUsXG4gICAgfSkpO1xuXG4gICAgbGV0IGNvbGxlY3Rpb24gPSB1c2VyQ29sbGVjdGlvbiA/PyBbXTtcblxuICAgIGNvbnN0IGdyb3VwQ29sbGVjdGlvbiA9IGF3YWl0IHRoaXMuc2VhcmNoR3JvdXBzKHF1ZXJ5KTtcbiAgICBpZiAoZ3JvdXBDb2xsZWN0aW9uKSBjb2xsZWN0aW9uID0gWy4uLnVzZXJDb2xsZWN0aW9uLCAuLi5ncm91cENvbGxlY3Rpb25dO1xuXG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH1cblxuICBhc3luYyBzZWFyY2hHcm91cHMocXVlcnk6IHN0cmluZykge1xuICAgIGNvbnN0IGdyb3Vwc1Jlc3BvbnNlOiBBeGlvc1Jlc3BvbnNlPGFueT4gfCBudWxsID0gYXdhaXQgdGhpcy5heGlvcy5nZXQoJy9ncm91cHMnLCB7XG4gICAgICBwYXJhbXM6IHsgcGVyX3BhZ2U6IDUsIHNlYXJjaDogcXVlcnkgfSxcbiAgICB9KTtcblxuICAgIGlmICghZ3JvdXBzUmVzcG9uc2UpIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgZ3JvdXBEYXRhID0gZ3JvdXBzUmVzcG9uc2UuZGF0YSA/PyBbXTtcblxuICAgIGNvbnN0IGdyb3VwQ29sbGVjdGlvbjogYW55W10gPSBncm91cERhdGEubWFwKChpdGVtOiBhbnkpID0+ICh7XG4gICAgICBhdmF0YXJfdXJsOiBpdGVtLmF2YXRhcl91cmwsXG4gICAgICBpZDogaXRlbS5pZCxcbiAgICAgIG5hbWU6IGl0ZW0uZnVsbF9uYW1lLFxuICAgICAgdHlwZTogJ29yZ2FuaXphdGlvbicsXG4gICAgICB1c2VybmFtZTogaXRlbS5mdWxsX3BhdGgsXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIGdyb3VwQ29sbGVjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWFyY2ggZm9yIGZpbGVzIGJhc2VkIG9uIGEgc3BlY2lmaWMgcXVlcnkuXG4gICAqIFNlZSB7QGxpbmsgaHR0cHM6Ly9kb2NzLmdpdGxhYi5jb20vZWUvYXBpL3NlYXJjaC5odG1sI3Njb3BlLWJsb2JzfVxuICAgKiBAcGFyYW0ge1N0cmluZ30gcXVlcnkgV2hlcmUgdG8gc2VhcmNoXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBxdWVyeSBUaGUgcXVlcnlcbiAgICogQHBhcmFtIHtTdHJpbmd9IGV4dGVuc2lvbiBMaW1pdCB0byBmaWxlcyB3aXRoIHRoaXMgZXh0ZW5zaW9uXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKi9cbiAgYXN5bmMgc2VhcmNoQmxvYnMoe1xuICAgIGV4dGVuc2lvbixcbiAgICByZXBvSWQsXG4gICAgcXVlcnksXG4gIH06IFR5cGVzLlNlYXJjaEJsb2JzUGFyYW1zKTogUHJvbWlzZTxTZWFyY2hCbG9ic0l0ZW1bXT4ge1xuICAgIGxldCBzZWFyY2ggPSBxdWVyeTtcbiAgICBpZiAoZXh0ZW5zaW9uKSBzZWFyY2ggKz0gYCBleHRlbnNpb246JHtleHRlbnNpb259YDtcblxuICAgIGNvbnN0IHJlc3BvbnNlOiBBeGlvc1Jlc3BvbnNlPGFueT4gfCBudWxsID0gYXdhaXQgdGhpcy5heGlvcy5nZXQoYC9wcm9qZWN0cy8ke3JlcG9JZH0vc2VhcmNoYCwge1xuICAgICAgcGFyYW1zOiB7IHBlcl9wYWdlOiAzMCwgc2NvcGU6ICdibG9icycsIHNlYXJjaCB9LFxuICAgIH0pO1xuXG4gICAgaWYgKCFyZXNwb25zZSkgcmV0dXJuIFtdO1xuXG4gICAgY29uc3QgcmVzdWx0cyA9IHJlc3BvbnNlLmRhdGEgPz8gW107XG4gICAgY29uc3Qgc2VhcmNoUmVzdWx0czogU2VhcmNoQmxvYnNJdGVtW10gPSBbXTtcblxuICAgIHJlc3VsdHMuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XG4gICAgICBjb25zdCBkdXBsaWNhdGVkID0gc2VhcmNoUmVzdWx0cy5maW5kKChzcikgPT4gc3IubmFtZSA9PT0gaXRlbS5maWxlbmFtZSk7XG4gICAgICBpZiAoZHVwbGljYXRlZCkge1xuICAgICAgICBpZiAoZHVwbGljYXRlZC50ZXh0X21hdGNoZXMubGVuZ3RoID4gMikgcmV0dXJuO1xuICAgICAgICBkdXBsaWNhdGVkLnRleHRfbWF0Y2hlcy5wdXNoKHtcbiAgICAgICAgICBmcmFnbWVudDogaXRlbS5kYXRhLFxuICAgICAgICAgIG1hdGNoZXM6IFt7IGluZGljZXM6IG1hdGNoKGl0ZW0uZGF0YSwgcXVlcnkpWzBdLCB0ZXh0OiBxdWVyeSB9XSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcGF0aFRvRmlsZSA9IGl0ZW0ucGF0aC5zcGxpdCgnLycpO1xuICAgICAgcGF0aFRvRmlsZS5wb3AoKTsgLy9yZW1vdmUgZmlsZW5hbWUgZnJvbSBwYXRoXG5cbiAgICAgIGNvbnN0IHRleHRfbWF0Y2hlcyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIGZyYWdtZW50OiBpdGVtLmRhdGEsXG4gICAgICAgICAgbWF0Y2hlczogW3sgaW5kaWNlczogbWF0Y2goaXRlbS5kYXRhLCBxdWVyeSlbMF0sIHRleHQ6IHF1ZXJ5IH1dLFxuICAgICAgICB9LFxuICAgICAgXTtcblxuICAgICAgY29uc3Qgc2ltcGxpZmllZEl0ZW06IFNlYXJjaEJsb2JzSXRlbSA9IHtcbiAgICAgICAgbmFtZTogaXRlbS5maWxlbmFtZSxcbiAgICAgICAgdHlwZTogJ2ZpbGUnLFxuICAgICAgICBwYXRoOiBwYXRoVG9GaWxlLmpvaW4oJy8nKSxcbiAgICAgICAgdGV4dF9tYXRjaGVzLFxuICAgICAgfTtcblxuICAgICAgc2VhcmNoUmVzdWx0cy5wdXNoKHNpbXBsaWZpZWRJdGVtKTtcbiAgICB9KTtcblxuICAgIGxvZy5pbmZvKHNlYXJjaFJlc3VsdHMpO1xuXG4gICAgcmV0dXJuIHNlYXJjaFJlc3VsdHM7XG4gIH1cblxuICBhc3luYyBnZXRMYXRlc3RDb21taXQoeyByZXBvSWQsIHBhdGggPSAnJyB9OiBUeXBlcy5HZXRMYXRlc3RDb21taXRQYXJhbXMpIHtcbiAgICBpZiAoIXJlcG9JZCkgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCBlbmNvZGVkUGF0aCA9IGVuY29kZVVSSUNvbXBvbmVudChwYXRoKTtcbiAgICBjb25zdCByZXNwb25zZTogQXhpb3NSZXNwb25zZTxhbnk+IHwgbnVsbCA9IGF3YWl0IHRoaXMuYXhpb3NcbiAgICAgIC5nZXQoYC9wcm9qZWN0cy8ke3JlcG9JZH0vcmVwb3NpdG9yeS9jb21taXRzYCwge1xuICAgICAgICBwYXJhbXM6IHsgcGF0aDogZW5jb2RlZFBhdGggfSxcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4gbnVsbCk7XG5cbiAgICBpZiAoIXJlc3BvbnNlKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IGxhdGVzdCA9IHJlc3BvbnNlLmRhdGFbMF07XG5cbiAgICBjb25zdCBsYXRlc3RDb21taXQ6IFR5cGVzLklMYXRlc3RDb21taXQgPSB7XG4gICAgICBhdXRob3JFbWFpbDogbGF0ZXN0LmF1dGhvcl9lbWFpbCxcbiAgICAgIGF1dGhvck5hbWU6IGxhdGVzdC5hdXRob3JfbmFtZSxcbiAgICAgIGRhdGU6IGxhdGVzdC5hdXRob3JlZF9kYXRlLFxuICAgICAgaHRtbF91cmw6IGxhdGVzdC53ZWJfdXJsLFxuICAgICAgbWVzc2FnZTogbGF0ZXN0Lm1lc3NhZ2UsXG4gICAgfTtcbiAgICByZXR1cm4gbGF0ZXN0Q29tbWl0O1xuICB9XG5cbiAgYXN5bmMgZ2V0RG9jdW1lbnQoeyBwYXRoID0gJycsIGJyYW5jaDogcmVmLCByZXBvSWQgfTogVHlwZXMuUmVwb0NvbnRlbnRQYXJhbXMpIHtcbiAgICBpZiAoIXJlcG9JZCkgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgZW5jb2RlZFBhdGggPSBlbmNvZGVVUklDb21wb25lbnQocGF0aCk7XG4gICAgY29uc3QgcmVzcG9uc2U6IEF4aW9zUmVzcG9uc2U8YW55PiB8IG51bGwgPSBhd2FpdCB0aGlzLmF4aW9zXG4gICAgICAuZ2V0KGAvcHJvamVjdHMvJHtyZXBvSWR9L3JlcG9zaXRvcnkvZmlsZXMvJHtlbmNvZGVkUGF0aH1gLCB7XG4gICAgICAgIHBhcmFtczogeyByZWYgfSxcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4gbnVsbCk7XG5cbiAgICBpZiAoIXJlc3BvbnNlKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IHsgY29udGVudCwgbGFzdF9jb21taXRfaWQgfSA9IHJlc3BvbnNlLmRhdGE7XG5cbiAgICBjb25zdCBkb2N1bWVudCA9IHtcbiAgICAgIGNvbnRlbnQ6IHRoaXMuZGVjb2RlQ29udGVudChjb250ZW50KSxcbiAgICAgIGhhc2g6IGxhc3RfY29tbWl0X2lkLFxuICAgICAgdXJsOiBgaHR0cHM6Ly9naXRsYWIuY29tL2FwaS92NC9wcm9qZWN0cy8ke3JlcG9JZH0vcmVwb3NpdG9yeS9maWxlcy8ke2VuY29kZWRQYXRofS9yYXdgLFxuICAgIH07XG5cbiAgICByZXR1cm4gZG9jdW1lbnQ7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IHJlcG8gZm9yIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIuXG4gICAqIFNlZSB7QGxpbmsgaHR0cHM6Ly9kb2NzLmdpdGxhYi5jb20vZWUvYXBpL3Byb2plY3RzLmh0bWwjY3JlYXRlLXByb2plY3R9XG4gICAqIEBwYXJhbSB7U3RyaW5nP30gZGVzY3JpcHRpb24gVGhlIHJlcG8gZGVzY3JpcHRpb25cbiAgICogQHBhcmFtIHtCb29sZWFuP30gaXNQcml2YXRlIElzIHRoZSByZXBvIHByaXZhdGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIHJlcG8gbmFtZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgYXN5bmMgY3JlYXRlUmVwbyh7IGRlc2NyaXB0aW9uLCBpc1ByaXZhdGUgPSBmYWxzZSwgbmFtZSB9OiBUeXBlcy5DcmVhdGVSZXBvUGFyYW1zKSB7XG4gICAgY29uc3QgcmVzcG9uc2U6IEF4aW9zUmVzcG9uc2U8YW55PiB8IG51bGwgPSBhd2FpdCB0aGlzLmF4aW9zXG4gICAgICAucG9zdCgnL3Byb2plY3RzJywge1xuICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgaW5pdGlhbGl6ZV93aXRoX3JlYWRtZTogdHJ1ZSxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgdmlzaWJpbGl0eTogaXNQcml2YXRlID8gJ3ByaXZhdGUnIDogJ3B1YmxpYycsXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IG51bGwpO1xuXG4gICAgaWYgKCFyZXNwb25zZSkgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCByZXBvID0gcmVzcG9uc2UuZGF0YTtcbiAgICByZXBvLm93bmVyID0gcmVwby5uYW1lc3BhY2U7XG4gICAgcmVwby5vd25lci51c2VybmFtZSA9IHJlcG8ub3duZXIucGF0aDtcblxuICAgIHJldHVybiByZXBvO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGdyb3VwIG1lbWJlcidzIHdyaXR0ZW4gcGVybWlzc2lvblxuICAgKiBTZWUge0BsaW5rIGh0dHBzOi8vZG9jcy5naXRsYWIuY29tL2VlL2FwaS9tZW1iZXJzLmh0bWwjZ2V0LWEtbWVtYmVyLW9mLWEtZ3JvdXAtb3ItcHJvamVjdH1cbiAgICogQHBhcmFtIHtTdHJpbmd9IG9yZ05hbWUgVGhlIHJlcG8gZGVzY3JpcHRpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHVzZXJuYW1lIFRoZSB1c2VybmFtZSBuYW1lXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPGJvb2xlYW4+fVxuICAgKi9cbiAgYXN5bmMgY2hlY2tPcmdNZW1iZXJXcml0ZW5QZXJtaXNzaW9uKHtcbiAgICBvcmdJZDogZ3JvdXBJZCxcbiAgICB1c2VySWQsXG4gIH06IFR5cGVzLkNoZWNrT3JnTWVtYmVyV3JpdHRlblBlcm1pc3Npb24pIHtcbiAgICBpZiAoIWdyb3VwSWQgfHwgIXVzZXJJZCkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IHJlc3BvbnNlOiBBeGlvc1Jlc3BvbnNlPGFueT4gfCBudWxsID0gYXdhaXQgdGhpcy5heGlvc1xuICAgICAgLmdldChgL2dyb3Vwcy8ke2dyb3VwSWR9L21lbWJlcnMvJHt1c2VySWR9YClcbiAgICAgIC5jYXRjaCgoKSA9PiBudWxsKTtcblxuICAgIGlmICghcmVzcG9uc2UpIHJldHVybiBmYWxzZTtcblxuICAgIGlmIChyZXNwb25zZS5kYXRhLmFjY2Vzc19sZXZlbCA+PSAzMCkgcmV0dXJuIHRydWU7IC8vTXVzdCBiZSBhdCBsZWFzdCBhIGBkZXZlbG9wZXJgICgzMClcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgcmVwbyBmb3IgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlci5cbiAgICogU2VlIHtAbGluayBodHRwczovL2RvY3MuZ2l0bGFiLmNvbS9lZS9hcGkvcHJvamVjdHMuaHRtbCNjcmVhdGUtcHJvamVjdH1cbiAgICogQHBhcmFtIHtTdHJpbmc/fSBkZXNjcmlwdGlvbiBUaGUgcmVwbyBkZXNjcmlwdGlvblxuICAgKiBAcGFyYW0ge0Jvb2xlYW4/fSBpc1ByaXZhdGUgSXMgdGhlIHJlcG8gcHJpdmF0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgcmVwbyBuYW1lXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBhc3luYyBjcmVhdGVSZXBvSW5PcmcoeyBkZXNjcmlwdGlvbiwgaXNQcml2YXRlLCBuYW1lLCBvcmdJZCB9OiBUeXBlcy5DcmVhdGVSZXBvUGFyYW1zKSB7XG4gICAgaWYgKCFvcmdJZCkgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCByZXNwb25zZTogQXhpb3NSZXNwb25zZTxhbnk+IHwgbnVsbCA9IGF3YWl0IHRoaXMuYXhpb3NcbiAgICAgIC5wb3N0KCcvcHJvamVjdHMnLCB7XG4gICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgICBpbml0aWFsaXplX3dpdGhfcmVhZG1lOiB0cnVlLFxuICAgICAgICBuYW1lLFxuICAgICAgICBuYW1lc3BhY2VfaWQ6IG9yZ0lkLFxuICAgICAgICB2aXNpYmlsaXR5OiBpc1ByaXZhdGUgPyAncHJpdmF0ZScgOiAncHVibGljJyxcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4gbnVsbCk7XG5cbiAgICBpZiAoIXJlc3BvbnNlKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IHJlcG8gPSByZXNwb25zZS5kYXRhO1xuICAgIHJlcG8ub3duZXIgPSByZXBvLm5hbWVzcGFjZTtcbiAgICByZXBvLm93bmVyLnVzZXJuYW1lID0gcmVwby5vd25lci5wYXRoO1xuXG4gICAgcmV0dXJuIHJlcG87XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgcmVwbydzIHVzZXIgd3JpdHRlbiBwZXJtaXNzaW9uXG4gICAqIFNlZSB7QGxpbmsgaHR0cHM6Ly9kb2NzLmdpdGxhYi5jb20vZWUvYXBpL21lbWJlcnMuaHRtbCNnZXQtYS1tZW1iZXItb2YtYS1ncm91cC1vci1wcm9qZWN0fVxuICAgKiBAcGFyYW0ge1N0cmluZ30gcmVwb0lkIFRoZSByZXBvIGlkXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB1c2VySWQgVGhlIHVzZXIgaWRcbiAgICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59XG4gICAqL1xuICBhc3luYyBjaGVja1JlcG9Vc2VyV3JpdGVuUGVybWlzc2lvbih7IHJlcG9JZCwgdXNlcklkIH06IFR5cGVzLkNoZWNrUmVwb1VzZXJXcml0dGVuUGVybWlzc2lvbikge1xuICAgIGlmICghcmVwb0lkIHx8ICF1c2VySWQpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCByZXNwb25zZTogQXhpb3NSZXNwb25zZTxhbnk+IHwgbnVsbCA9IGF3YWl0IHRoaXMuYXhpb3NcbiAgICAgIC5nZXQoYC9wcm9qZWN0cy8ke3JlcG9JZH0vbWVtYmVycy9hbGwvJHt1c2VySWR9YClcbiAgICAgIC5jYXRjaCgoKSA9PiBudWxsKTtcblxuICAgIGlmICghcmVzcG9uc2UpIHJldHVybiBmYWxzZTtcbiAgICBpZiAocmVzcG9uc2UuZGF0YS5hY2Nlc3NfbGV2ZWwgPj0gMzApIHJldHVybiB0cnVlOyAvL011c3QgYmUgYXQgbGVhc3QgYSBgZGV2ZWxvcGVyYCAoMzApXG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogU2F2ZSAoaS5lLiBjcmVhdGUgb3IgdXBkYXRlKSBhIGRvY3VtZW50LlxuICAgKiBTZWUge0BsaW5rIGh0dHBzOi8vZG9jcy5naXRsYWIuY29tL2VlL2FwaS9yZXBvc2l0b3J5X2ZpbGVzLmh0bWwjY3JlYXRlLW5ldy1maWxlLWluLXJlcG9zaXRvcnl9XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBicmFuY2ggVGhlIGJyYW5jaFxuICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSBUaGUgY29tbWl0X21lc3NhZ2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGggVGhlIHBhdGhcbiAgICogQHBhcmFtIHtTdHJpbmd9IHJlcG9JZCBUaGUgcmVwb1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICovXG4gIGFzeW5jIGNyZWF0ZUZvbGRlcih7IGJyYW5jaCwgbWVzc2FnZSwgcGF0aCwgcmVwb0lkIH06IFR5cGVzLklTYXZlRG9jdW1lbnQpIHtcbiAgICBpZiAoIXJlcG9JZCkgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCBmaWxlbmFtZSA9ICcuZ2l0a2VlcCc7XG4gICAgcGF0aCA9IGAke3BhdGh9LyR7ZmlsZW5hbWV9YDtcbiAgICBjb25zdCBlbmNvZGVkUGF0aCA9IGVuY29kZVVSSUNvbXBvbmVudChwYXRoKTtcblxuICAgIGNvbnN0IHJlc3BvbnNlOiBBeGlvc1Jlc3BvbnNlPGFueT4gfCBudWxsID0gYXdhaXQgdGhpcy5heGlvc1xuICAgICAgLnBvc3QoYC9wcm9qZWN0cy8ke3JlcG9JZH0vcmVwb3NpdG9yeS9maWxlcy8ke2VuY29kZWRQYXRofWAsIHtcbiAgICAgICAgYnJhbmNoLFxuICAgICAgICBjb250ZW50OiAnJyxcbiAgICAgICAgY29tbWl0X21lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IG51bGwpO1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlIGFzIGFueTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlIChpLmUuIGNyZWF0ZSBvciB1cGRhdGUpIGEgZG9jdW1lbnQuXG4gICAqIFNlZSB7QGxpbmsgaHR0cHM6Ly9kb2NzLmdpdGxhYi5jb20vZWUvYXBpL3JlcG9zaXRvcnlfZmlsZXMuaHRtbCNjcmVhdGUtbmV3LWZpbGUtaW4tcmVwb3NpdG9yeX1cbiAgICogQHBhcmFtIHtTdHJpbmd9IGJyYW5jaCBUaGUgYnJhbmNoXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjb250ZW50IFRoZSBjb250ZW50XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlIFRoZSBjb21taXQgbWVzc2FnZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aCBUaGUgcGF0aFxuICAgKiBAcGFyYW0ge1N0cmluZ30gcmVwb0lkIFRoZSByZXBvXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBoYXNoIFRoZSBsYXN0X2NvbW1pdF9pZFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICovXG4gIGFzeW5jIHNhdmVEb2N1bWVudChwYXJhbXM6IFR5cGVzLklTYXZlRG9jdW1lbnQpIHtcbiAgICBjb25zdCB7IGJyYW5jaCwgcGF0aCwgcmVwb0lkLCBoYXNoIH0gPSBwYXJhbXM7XG4gICAgaWYgKCFwYXJhbXMucmVwb0lkKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gaGFzaCA/IGF3YWl0IHRoaXMudXBkYXRlRmlsZShwYXJhbXMpIDogYXdhaXQgdGhpcy5jcmVhdGVGaWxlKHBhcmFtcyk7XG4gICAgaWYgKCFyZXNwb25zZSkgcmV0dXJuIG51bGw7XG5cbiAgICAvL2dldCBsYXRlc3QgdmVyc2lvblxuICAgIGNvbnN0IGRvY3VtZW50UmVzcG9uc2UgPSBhd2FpdCB0aGlzLmdldERvY3VtZW50KHsgYnJhbmNoLCBwYXRoLCByZXBvSWQgfSk7XG4gICAgaWYgKCFkb2N1bWVudFJlc3BvbnNlKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IHVwZGF0ZWRSZXNvdXJjZSA9IHsgLi4ucGFyYW1zLCBoYXNoOiBkb2N1bWVudFJlc3BvbnNlLmhhc2ggfTtcbiAgICByZXR1cm4gdXBkYXRlZFJlc291cmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhdmUgKGkuZS4gY3JlYXRlIG9yIHVwZGF0ZSkgYSBkb2N1bWVudC5cbiAgICogU2VlIHtAbGluayBodHRwczovL2RvY3MuZ2l0bGFiLmNvbS9lZS9hcGkvcmVwb3NpdG9yeV9maWxlcy5odG1sI2NyZWF0ZS1uZXctZmlsZS1pbi1yZXBvc2l0b3J5fVxuICAgKiBAcGFyYW0ge1N0cmluZ30gYnJhbmNoIFRoZSBicmFuY2hcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNvbnRlbnQgVGhlIGNvbnRlbnRcbiAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2UgVGhlIGNvbW1pdF9tZXNzYWdlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIFRoZSBwYXRoXG4gICAqIEBwYXJhbSB7U3RyaW5nfSByZXBvSWQgVGhlIHJlcG9cbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuICBhc3luYyBjcmVhdGVGaWxlKHBhcmFtczogVHlwZXMuSVNhdmVEb2N1bWVudCkge1xuICAgIGNvbnN0IHsgYnJhbmNoLCBjb250ZW50LCBtZXNzYWdlLCBwYXRoLCByZXBvSWQgfSA9IHBhcmFtcztcbiAgICBjb25zdCBlbmNvZGVkUGF0aCA9IGVuY29kZVVSSUNvbXBvbmVudChwYXRoKTtcbiAgICBjb25zdCByZXNwb25zZTogQXhpb3NSZXNwb25zZTxhbnk+IHwgbnVsbCA9IGF3YWl0IHRoaXMuYXhpb3NcbiAgICAgIC5wb3N0KGAvcHJvamVjdHMvJHtyZXBvSWR9L3JlcG9zaXRvcnkvZmlsZXMvJHtlbmNvZGVkUGF0aH1gLCB7XG4gICAgICAgIGJyYW5jaCxcbiAgICAgICAgY29udGVudCxcbiAgICAgICAgY29tbWl0X21lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IG51bGwpO1xuXG4gICAgaWYgKCFyZXNwb25zZSkgcmV0dXJuO1xuXG4gICAgcmV0dXJuIHBhcmFtcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlIChpLmUuIGNyZWF0ZSBvciB1cGRhdGUpIGEgZG9jdW1lbnQuXG4gICAqIFNlZSB7QGxpbmsgaHR0cHM6Ly9kb2NzLmdpdGxhYi5jb20vZWUvYXBpL3JlcG9zaXRvcnlfZmlsZXMuaHRtbCN1cGRhdGUtZXhpc3RpbmctZmlsZS1pbi1yZXBvc2l0b3J5fVxuICAgKiBAcGFyYW0ge1N0cmluZ30gYnJhbmNoIFRoZSBicmFuY2hcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNvbnRlbnQgVGhlIGNvbnRlbnRcbiAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2UgVGhlIGNvbW1pdF9tZXNzYWdlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIFRoZSBwYXRoXG4gICAqIEBwYXJhbSB7U3RyaW5nfSByZXBvSWQgVGhlIHJlcG8gaWRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGhhc2ggVGhlIGxhc3RfY29tbWl0X2lkXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKi9cbiAgYXN5bmMgdXBkYXRlRmlsZShwYXJhbXM6IFR5cGVzLklTYXZlRG9jdW1lbnQpIHtcbiAgICBjb25zdCB7IGJyYW5jaCwgY29udGVudCwgbWVzc2FnZSwgcGF0aCwgcmVwb0lkLCBoYXNoIH0gPSBwYXJhbXM7XG4gICAgaWYgKCFoYXNoKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IGVuY29kZWRQYXRoID0gZW5jb2RlVVJJQ29tcG9uZW50KHBhdGgpO1xuICAgIGNvbnN0IHJlc3BvbnNlOiBBeGlvc1Jlc3BvbnNlPGFueT4gfCBudWxsID0gYXdhaXQgdGhpcy5heGlvc1xuICAgICAgLnB1dChgL3Byb2plY3RzLyR7cmVwb0lkfS9yZXBvc2l0b3J5L2ZpbGVzLyR7ZW5jb2RlZFBhdGh9YCwge1xuICAgICAgICBicmFuY2gsXG4gICAgICAgIGNvbnRlbnQsXG4gICAgICAgIGNvbW1pdF9tZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgICBsYXN0X2NvbW1pdF9pZDogaGFzaCxcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4gbnVsbCk7XG5cbiAgICBpZiAoIXJlc3BvbnNlKSByZXR1cm47XG5cbiAgICByZXR1cm4gcGFyYW1zO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGZvcmsgZm9yIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIuXG4gICAqIFNlZSB7QGxpbmsgaHR0cHM6Ly9kb2NzLmdpdGxhYi5jb20vZWUvYXBpL3Byb2plY3RzLmh0bWwjZm9yay1wcm9qZWN0fVxuICAgKiBAcGFyYW0ge1N0cmluZ30gcmVwb0lkIFRoZSByZXBvIGlkXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKi9cbiAgYXN5bmMgY3JlYXRlRm9yayh7IHJlcG9JZCB9OiBUeXBlcy5JQ3JlYXRlRm9yaykge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5heGlvc1xuICAgICAgLnBvc3Q8VC5SZXBvc2l0b3J5PihgL3Byb2plY3RzLyR7cmVwb0lkfS9mb3JrYClcbiAgICAgIC8vIC5jYXRjaCgoKSA9PiBudWxsZ2V0UmVwbyk7XG4gICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvcik7XG4gICAgICB9KTtcblxuICAgIGNvbnN0IGZvcmsgPSByZXNwb25zZS5kYXRhO1xuXG4gICAgLy9jaGVjayBzdGF0dXNcbiAgICBjb25zdCB2YWxpZGF0ZUZvcmtDcmVhdGlvbiA9IChzdGF0dXM6IElJbXBvcnRTdGF0dXMpID0+IHN0YXR1cyA9PT0gJ2ZpbmlzaGVkJztcbiAgICBhd2FpdCB0aGlzLnBvb2woe1xuICAgICAgZm46IHRoaXMuZ2V0SW1wb3J0U3RhdHVzLFxuICAgICAgcGFyYW1zOiByZXNwb25zZS5kYXRhLmlkLFxuICAgICAgdmFsaWRhdGU6IHZhbGlkYXRlRm9ya0NyZWF0aW9uLFxuICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRm9yayBpcyB0YWtpbmcgdG9vIGxvbmcuIFRyeSBhZ2FpbiBsYXRlci4nKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBmb3JrO1xuICB9XG5cbiAgLyoqXG4gICAqIFBvb2wgYW4gZW5kcG9pbnQgaW4gcmVndWxhciBpbnRlcnZhbHMuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSB0aGUgZnVuY2lvbiB0byBjYWxsXG4gICAqIEBwYXJhbSB7YW55P30gcGFyYW1zIHRoZSBmbidzIHBhcmFtc1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9uP30gdmFsaWRhdGUgQSB2YWxpZGF0ZSBmdW5jdGlvbnNcbiAgICogQHBhcmFtIHtOdW1iZXI/fSBpbnRlcnZhbCBUaGUgaW50ZXJ2YWxcbiAgICogQHBhcmFtIHtOdW1iZXI/fSBtYXhBdHRlbXB0cyBUaGUgbWF4IGF0dGVtcHRzXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyBwb29sKHsgZm4sIHBhcmFtcywgdmFsaWRhdGUsIGludGVydmFsID0gMTBfMDAwLCBtYXhBdHRlbXB0cyA9IDEyIH06IElQb29sKSB7XG4gICAgbGV0IGF0dGVtcHRzID0gMDtcbiAgICBjb25zdCBmblRvUG9sbCA9IGZuLmJpbmQodGhpcyk7XG5cbiAgICBjb25zdCBleGVjdXRlUG9sbCA9IGFzeW5jIChyZXNvbHZlOiBhbnksIHJlamVjdDogYW55KSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBmblRvUG9sbChwYXJhbXMpO1xuICAgICAgYXR0ZW1wdHMrKztcblxuICAgICAgaWYgKHZhbGlkYXRlICYmIHZhbGlkYXRlKHJlc3VsdCkpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUocmVzdWx0KTtcbiAgICAgIH0gZWxzZSBpZiAoYXR0ZW1wdHMgPT09IG1heEF0dGVtcHRzKSB7XG4gICAgICAgIHJldHVybiByZWplY3QobmV3IEVycm9yKCdFeGNlZWRlZCBtYXggYXR0ZW1wdHMnKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXRUaW1lb3V0KGV4ZWN1dGVQb2xsLCBpbnRlcnZhbCwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGV4ZWN1dGVQb2xsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHN0YXR1cyBvZiBhbiBpbXBvcnQuXG4gICAqIFNlZSB7QGxpbmsgaHR0cHM6Ly9kb2NzLmdpdGxhYi5jb20vZWUvYXBpL3Byb2plY3RfaW1wb3J0X2V4cG9ydC5odG1sI2ltcG9ydC1zdGF0dXN9XG4gICAqIEBwYXJhbSB7SUltcG9ydFN0YXR1c30gcmVwb0lkIFRoZSByZXBvIGlkXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKi9cbiAgYXN5bmMgZ2V0SW1wb3J0U3RhdHVzKHJlcG9JZDogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVzcG9uc2U6IEF4aW9zUmVzcG9uc2U8YW55PiB8IG51bGwgPSBhd2FpdCB0aGlzLmF4aW9zXG4gICAgICAuZ2V0KGAvcHJvamVjdHMvJHtyZXBvSWR9L2ltcG9ydGApXG4gICAgICAuY2F0Y2goKCkgPT4gbnVsbCk7XG5cbiAgICBpZiAoIXJlc3BvbnNlKSByZXR1cm4gJ25vbmUnO1xuICAgIHJldHVybiByZXNwb25zZS5kYXRhLmltcG9ydF9zdGF0dXMgYXMgSUltcG9ydFN0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBzaW5nbGUgcmVwb3NpdG9yeSBicmFuY2hcbiAgICogU2VlIHtAbGluayBodHRwczovL2RvY3MuZ2l0bGFiLmNvbS9lZS9hcGkvYnJhbmNoZXMuaHRtbCNnZXQtc2luZ2xlLXJlcG9zaXRvcnktYnJhbmNofVxuICAgKiBAcGFyYW0ge1N0cmluZ30gYnJhbmNoIFRoZSBicmFuY2hcbiAgICogQHBhcmFtIHtTdHJpbmd9IHJlcG9JZCBUaGUgcmVwb3NpdG9yeVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICovXG4gIGFzeW5jIGdldEJyYW5jaCh7IGJyYW5jaCwgcmVwb0lkIH06IFR5cGVzLklHZXRCcmFuY2gpIHtcbiAgICBpZiAoIXJlcG9JZCkgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgcmVzcG9uc2U6IEF4aW9zUmVzcG9uc2U8YW55PiB8IG51bGwgPSBhd2FpdCB0aGlzLmF4aW9zXG4gICAgICAuZ2V0KGAvcHJvamVjdHMvJHtyZXBvSWR9L3JlcG9zaXRvcnkvYnJhbmNoZXMvJHticmFuY2h9YClcbiAgICAgIC5jYXRjaCgoKSA9PiBudWxsKTtcblxuICAgIGlmICghcmVzcG9uc2UpIHJldHVybiBudWxsO1xuICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGJyYW5jaCBleGlzdHNcbiAgICogQHBhcmFtIHtTdHJpbmd9IGJyYW5jaCBUaGUgYnJhbmNoXG4gICAqIEBwYXJhbSB7U3RyaW5nfSByZXBvSWQgVGhlIHJlcG9zaXRvcnlcbiAgICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59XG4gICAqL1xuICBhc3luYyBjaGVja0ZvckJyYW5jaCh7IGJyYW5jaCwgcmVwb0lkIH06IFR5cGVzLklHZXRCcmFuY2gpIHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuZ2V0QnJhbmNoKHsgYnJhbmNoLCByZXBvSWQgfSk7XG4gICAgaWYgKCFyZXNwb25zZSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBuZXcgYnJhbmNoIGluIHRoZSByZXBvc2l0b3J5LlxuICAgKiBTZWUge0BsaW5rIGh0dHBzOi8vZG9jcy5naXRsYWIuY29tL2VlL2FwaS9icmFuY2hlcy5odG1sI2NyZWF0ZS1yZXBvc2l0b3J5LWJyYW5jaH1cbiAgICogQHBhcmFtIHtTdHJpbmd9IGJyYW5jaE9yaWdpbiBUaGUgYnJhbmNoIG9yaWdpblxuICAgKiBAcGFyYW0ge1N0cmluZ30gYnJhbmNoVGFyZ2V0IFRoZSBuZXcgYnJhbmNoXG4gICAqIEBwYXJhbSB7U3RyaW5nfSByZXBvSWQgVGhlIHJlcG9cbiAgICogQHBhcmFtIHtTdHJpbmd9IG93bmVyVXNlcm5hbWUgVGhlIG93bmVyIHVzZXJuYW1lXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKi9cbiAgYXN5bmMgY3JlYXRlQnJhbmNoKHsgcmVwb0lkLCBicmFuY2hPcmlnaW4sIGJyYW5jaFRhcmdldCB9OiBUeXBlcy5JQ3JlYXRlQnJhbmNoKSB7XG4gICAgaWYgKCFyZXBvSWQpIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgcmVzcG9uc2U6IEF4aW9zUmVzcG9uc2U8YW55PiB8IG51bGwgPSBhd2FpdCB0aGlzLmF4aW9zXG4gICAgICAucG9zdChgL3Byb2plY3RzLyR7cmVwb0lkfS9yZXBvc2l0b3J5L2JyYW5jaGVzYCwge1xuICAgICAgICBicmFuY2g6IGJyYW5jaFRhcmdldCxcbiAgICAgICAgcmVmOiBicmFuY2hPcmlnaW4sXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IG51bGwpO1xuXG4gICAgaWYgKCFyZXNwb25zZSkgcmV0dXJuO1xuICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGZvciBtZXJmZSByZXF1ZXN0XG4gICAqIFNlZSB7QGxpbmsgaHR0cHM6Ly9kb2NzLmdpdGxhYi5jb20vZWUvYXBpL21lcmdlX3JlcXVlc3RzLmh0bWwjbGlzdC1wcm9qZWN0LW1lcmdlLXJlcXVlc3RzfVxuICAgKiBAcGFyYW0ge1N0cmluZ30gYnJhbmNoSGVhZCBoZSBicmFuY2ggaGVhZFxuICAgKiBAcGFyYW0ge1N0cmluZ30gYnJhbmNoT3JpZ2luIFRoZSBicmFuY2ggb3JpZ2luXG4gICAqIEBwYXJhbSB7U3RyaW5nfSByZXBvSWQgVGhlIHJlcG9zaXRvcnkgSURcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuICBwcml2YXRlIGFzeW5jIGNoZWNrRm9yTWVyZ2VSZXF1ZXN0KHsgYnJhbmNoSGVhZCwgYnJhbmNoT3JpZ2luLCByZXBvSWQgfTogSUNoZWNrRm9yTWVyZ2VSZXF1ZXN0KSB7XG4gICAgY29uc3QgbWVyZ2VSZXF1ZXN0czogQXhpb3NSZXNwb25zZTxhbnk+IHwgbnVsbCA9IGF3YWl0IHRoaXMuYXhpb3NcbiAgICAgIC5nZXQoYC9wcm9qZWN0cy8ke3JlcG9JZH0vbWVyZ2VfcmVxdWVzdHNgLCB7XG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgIHN0YXRlOiAnb3BlbmVkJyxcbiAgICAgICAgICBzb3VyY2VfYnJhbmNoOiBicmFuY2hIZWFkLFxuICAgICAgICAgIHRhcmdldF9icmFuY2g6IGJyYW5jaE9yaWdpbixcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4gbnVsbCk7XG5cbiAgICBpZiAoIW1lcmdlUmVxdWVzdHMpIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiBtZXJnZVJlcXVlc3RzLmRhdGEubGVuZ3RoID4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlIChpLmUuIGNyZWF0ZSkgYSBkb2N1bWVudCBhcyBhIHB1bGwgcmVxdWVzdC5cbiAgICogU2VlIHtAbGluayBodHRwczovL2RvY3MuZ2l0bGFiLmNvbS9lZS9hcGkvbWVyZ2VfcmVxdWVzdHMuaHRtbCNjcmVhdGUtbXJ9XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBicmFuY2hPcmlnaW4gVGhlIGJyYW5jaCBvcmlnaW5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGJyYW5jaEhlYWQgaGUgYnJhbmNoIGhlYWRcbiAgICogQHBhcmFtIHtTdHJpbmd9IHJlcG9JZCBUaGUgcmVwb1xuICAgKiBAcGFyYW0ge1N0cmluZ30gdGl0bGUgVGhlIHRpdGxlIG9mIHRoZSBwdWxsIHJlcXVlc3RcbiAgICogQHJldHVybnMge1Byb21pc2U8VHlwZXMuQ3JlYXRlUHJSZXNwb25zZT59XG4gICAqL1xuICBhc3luYyBjcmVhdGVQdWxsUmVxdWVzdCh7IGJyYW5jaE9yaWdpbiwgYnJhbmNoSGVhZCwgb3JpZ2luLCB0aXRsZSB9OiBUeXBlcy5JQ3JlYXRlUHJQYXJhbXMpIHtcbiAgICAvLyB0aGVyZSBjYW4gYmUgb25seSBvbmUgUFIgcGVyIGJyYW5jaCAqL1xuICAgIGNvbnN0IGRvZXNNZXJnZVJlcXVlc3RFeGlzdCA9IGF3YWl0IHRoaXMuY2hlY2tGb3JNZXJnZVJlcXVlc3Qoe1xuICAgICAgYnJhbmNoT3JpZ2luLFxuICAgICAgYnJhbmNoSGVhZCxcbiAgICAgIHJlcG9JZDogb3JpZ2luLmlkLFxuICAgIH0pO1xuXG4gICAgaWYgKGRvZXNNZXJnZVJlcXVlc3RFeGlzdCkgcmV0dXJuICdleGlzdHMnO1xuXG4gICAgLy8/IHVzZSBcInRhcmdldF9wcm9qZWN0X2lkXCIgZm9yIGNyb3NzIG9yaWdpbj9cblxuICAgIGNvbnN0IHB1bGxSZXF1ZXN0OiBBeGlvc1Jlc3BvbnNlPGFueT4gfCBudWxsID0gYXdhaXQgdGhpcy5heGlvc1xuICAgICAgLnBvc3QoYC9wcm9qZWN0cy8ke29yaWdpbi5pZH0vbWVyZ2VfcmVxdWVzdHNgLCB7XG4gICAgICAgIHNvdXJjZV9icmFuY2g6IGJyYW5jaEhlYWQsXG4gICAgICAgIHRhcmdldF9icmFuY2g6IGJyYW5jaE9yaWdpbixcbiAgICAgICAgdGl0bGUsXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IG51bGwpO1xuXG4gICAgaWYgKCFwdWxsUmVxdWVzdCkgcmV0dXJuIG51bGw7XG5cbiAgICByZXR1cm4gJ2NyZWF0ZWQnO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIHB1bGwgcmVxdWVzdCBmcm9tIGEgZm9yay5cbiAgICogU2VlIHtAbGluayBodHRwczovL2RvY3MuZ2l0bGFiLmNvbS9lZS9hcGkvbWVyZ2VfcmVxdWVzdHMuaHRtbCNjcmVhdGUtbXJ9XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBicmFuY2hCYXNlIFRoZSBicmFuY2ggb3JpZ2luXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBicmFuY2hIZWFkIGhlIGJyYW5jaCBoZWFkXG4gICAqIEBwYXJhbSB7U3RyaW5nfSByZXBvSWQgVGhlIHJlcG9cbiAgICogQHBhcmFtIHtTdHJpbmd9IHRpdGxlIFRoZSB0aXRsZSBvZiB0aGUgcHVsbCByZXF1ZXN0XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFR5cGVzLkNyZWF0ZVByUmVzcG9uc2U+fVxuICAgKi9cbiAgYXN5bmMgY3JlYXRlUHVsbFJlcXVlc3RGcm9tRm9yayh7IGZvcmssIG9yaWdpbiwgdGl0bGUgfTogVHlwZXMuSUNyZWF0ZVByRnJvbUZvcmtQYXJhbXMpIHtcbiAgICAvLyB0aGVyZSBjYW4gYmUgb25seSBvbmUgUFIgcGVyIGJyYW5jaCAqL1xuICAgIGNvbnN0IGRvZXNNZXJnZVJlcXVlc3RFeGlzdCA9IGF3YWl0IHRoaXMuY2hlY2tGb3JNZXJnZVJlcXVlc3Qoe1xuICAgICAgYnJhbmNoT3JpZ2luOiBvcmlnaW4uZGVmYXVsdF9icmFuY2gsXG4gICAgICBicmFuY2hIZWFkOiBmb3JrLmRlZmF1bHRfYnJhbmNoLFxuICAgICAgcmVwb0lkOiBvcmlnaW4uaWQsXG4gICAgfSk7XG5cbiAgICBpZiAoZG9lc01lcmdlUmVxdWVzdEV4aXN0KSByZXR1cm4gJ2V4aXN0cyc7XG5cbiAgICBjb25zdCBwdWxsUmVxdWVzdDogQXhpb3NSZXNwb25zZTxhbnk+IHwgbnVsbCA9IGF3YWl0IHRoaXMuYXhpb3NcbiAgICAgIC5wb3N0KGAvcHJvamVjdHMvJHtmb3JrLmlkfS9tZXJnZV9yZXF1ZXN0c2AsIHtcbiAgICAgICAgc291cmNlX2JyYW5jaDogZm9yay5kZWZhdWx0X2JyYW5jaCxcbiAgICAgICAgdGFyZ2V0X2JyYW5jaDogb3JpZ2luLmRlZmF1bHRfYnJhbmNoLFxuICAgICAgICB0YXJnZXRfcHJvamVjdF9pZDogb3JpZ2luLmlkLFxuICAgICAgICB0aXRsZSxcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4gbnVsbCk7XG5cbiAgICBpZiAoIXB1bGxSZXF1ZXN0KSByZXR1cm4gbnVsbDtcblxuICAgIHJldHVybiAnY3JlYXRlZCc7XG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==