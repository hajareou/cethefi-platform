"use strict";
(self["webpackChunk_cwrc_leafwriter_commons"] = self["webpackChunk_cwrc_leafwriter_commons"] || []).push([["storageService_src_providers_Github_ts"],{

/***/ "../storageService/src/providers/Github.ts":
/*!*************************************************!*\
  !*** ../storageService/src/providers/Github.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Github)
/* harmony export */ });
/* harmony import */ var _octokit_rest__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @octokit/rest */ "../../node_modules/@octokit/rest/dist-web/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "../../node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var buffer___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! buffer/ */ "../../node_modules/buffer/index.js");



class Github {
  constructor({ access_token }) {
    this.name = "github";
    this.userId = "";
    this.username = "";
    if (!access_token)
      throw new Error("No access token provided");
    this.axios = axios__WEBPACK_IMPORTED_MODULE_1___default().create({
      headers: { Authorization: `Bearer ${access_token}` }
    });
    this.octokit = new _octokit_rest__WEBPACK_IMPORTED_MODULE_0__.Octokit({
      auth: access_token,
      userAgent: "leaf-writer-storage-service"
    });
  }
  encodeContent(content) {
    return buffer___WEBPACK_IMPORTED_MODULE_2__.Buffer.from(content).toString("base64");
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
    const response = await this.octokit.users.getAuthenticated();
    if (!response)
      return null;
    const user = response.data;
    user.username = user.login;
    this.userId = user.id.toString();
    this.username = user.login;
    return user;
  }
  async getDetailsForUser({ user: username }) {
    const response = await this.octokit.users.getByUsername({ username }).catch(() => null);
    if (!response)
      return null;
    const user = response.data;
    user.username = user.login;
    return user;
  }
  async getReposForAuthenticatedUser({
    collectionSource,
    nextPage,
    per_page = 20
  }) {
    const response = nextPage ? await this.axios.get(nextPage) : await this.octokit.rest.repos.listForAuthenticatedUser({
      affiliation: collectionSource,
      per_page
    });
    let collection = response.data;
    if (collectionSource !== "owner")
      collection = await this.expandReposWIthUserDetails(collection);
    collection = collection.map((repo) => {
      repo.owner.username = repo.owner?.login;
      return repo;
    });
    const headerLinks = response.headers.link ? this.parseHeaderLink(response.headers.link) : null;
    const nextPageLink = headerLinks ? headerLinks.next : null;
    return { collection, nextPage: nextPageLink };
  }
  async expandReposWIthUserDetails(collection) {
    const users = [];
    for (const repo of collection) {
      let user = users.find((usr) => usr.id === repo.owner.id);
      if (!user)
        user = await this.getDetailsForUser({ user: repo.owner.login });
      if (!user)
        continue;
      users.push(user);
      repo.owner = user;
    }
    return collection;
  }
  async getReposForUser({ username, nextPage, per_page = 60 }) {
    const response = nextPage ? await this.axios.get(nextPage) : await this.octokit.repos.listForUser({ username, per_page });
    let collection = response.data;
    collection = collection.map((repo) => {
      repo.owner.username = repo.owner?.login;
      return repo;
    });
    const headerLinks = response.headers.link ? this.parseHeaderLink(response.headers.link) : null;
    const nextPageLink = headerLinks ? headerLinks.next : null;
    return { collection, nextPage: nextPageLink };
  }
  async getRepo({ username, repoName }) {
    const response = await this.octokit.rest.repos.get({ owner: username, repo: repoName }).catch((error) => {
      throw new Error(`Repository not found: ${error}`);
    });
    const repo = response.data;
    repo.owner.username = repo.owner?.login;
    repo.owner.path = repo.name;
    return repo;
  }
  async getRepoContent({
    ownerUsername,
    repoName,
    path = "",
    branch: ref
  }) {
    if (!ownerUsername || !repoName)
      return null;
    const response = await this.octokit.rest.repos.getContent({ owner: ownerUsername, repo: repoName, path, ref }).catch(() => null);
    if (!response)
      return null;
    let content = response.data ?? [];
    if (Array.isArray(content)) {
      content = content.map((item) => {
        item.type = item.type === "dir" ? "folder" : item.type;
        return item;
      });
    } else {
      content.type = content.type === "dir" ? "folder" : content.type;
    }
    return content;
  }
  async getRepoBranches({ owner, repoName }) {
    if (!owner)
      return;
    const response = await this.octokit.request(`GET /repos/${owner}/${repoName}/branches`);
    return response.data;
  }
  async getOrganizationsForAuthenticatedUser({ nextPage, per_page = 60 }) {
    const response = nextPage ? await this.axios.get(nextPage) : await this.octokit.orgs.listForAuthenticatedUser({ per_page });
    const collection = response.data ?? [];
    const organizaions = [];
    for (const org of collection) {
      const orgDetails = await this.getDetailsForUser({ user: org.login });
      if (!orgDetails)
        continue;
      organizaions.push({ username: org.login, description: orgDetails.bio, ...orgDetails });
    }
    const headerLinks = response.headers.link ? this.parseHeaderLink(response.headers.link) : null;
    const nextPageLink = headerLinks ? headerLinks.next : null;
    return { collection: organizaions, nextPage: nextPageLink };
  }
  async getOrganization({ orgName: org }) {
    if (!org)
      return null;
    const response = this.octokit.rest.orgs.get({ org }).catch(() => null);
    if (!response)
      return null;
    const organization = response;
    organization.username = organization.login;
    return organization;
  }
  async getReposForOrganization({
    orgUsername: org,
    nextPage,
    per_page = 60
  }) {
    if (!org)
      return null;
    const response = nextPage ? await this.axios.get(nextPage) : await this.octokit.repos.listForOrg({ org, per_page });
    const collection = response.data ?? [];
    const repositories = collection.map((repo) => {
      repo.owner.username = repo.owner?.login;
      return repo;
    });
    const headerLinks = response.headers.link ? this.parseHeaderLink(response.headers.link) : null;
    const nextPageLink = headerLinks ? headerLinks.next : null;
    return { collection: repositories, nextPage: nextPageLink };
  }
  async searchUsers(query) {
    const response = await this.octokit.rest.search.users({ q: query, per_page: 10 });
    const collection = response.data.items ?? [];
    const userCollection = [];
    for (const item of collection) {
      const detail = await this.getDetailsForUser({ user: item.login });
      const user = {
        avatar_url: item.avatar_url,
        id: item.id,
        name: detail?.name ?? "",
        type: item.type === "organization" ? "organization" : "user",
        username: item.login
      };
      userCollection.push(user);
    }
    return userCollection;
  }
  async searchBlobs({ extension, owner, query }) {
    let q = `${query} user:${owner}`;
    if (extension)
      q += ` language:${extension}`;
    const response = await this.octokit.search.code({
      mediaType: { format: "text-match" },
      per_page: 10,
      q
    });
    const results = response.data.items ?? [];
    const searchResults = results.map((item) => {
      const pathToFile = item.path.split("/");
      pathToFile.pop();
      item.repository.owner.username = item.repository.owner?.login;
      const simplifiedItem = {
        name: item.name,
        type: "file",
        owner: item.repository.owner,
        path: pathToFile.join("/"),
        repository: item.repository,
        score: item.score,
        text_matches: item.text_matches
      };
      return simplifiedItem;
    });
    return searchResults;
  }
  async getRepoContentRecursively({ ownerUsername, repoName, branch }) {
    if (!ownerUsername || !repoName)
      return null;
    const originBranch = await this.getBranch({ branch, ownerUsername, repoName });
    if (!originBranch)
      return null;
    const response = await this.octokit.rest.git.getTree({
      owner: ownerUsername,
      repo: repoName,
      tree_sha: originBranch.commit.commit.tree.sha,
      recursive: "true"
    });
    if (response.data.truncated)
      return null;
    const repoTree = response.data.tree ?? [];
    const tree = repoTree.map((item) => {
      const pathArray = item.path?.split("/");
      const name = pathArray?.pop() ?? "";
      const path = pathArray?.join("/") ?? "";
      const type = item.type === "tree" ? "folder" : "file";
      return { name, path, type };
    });
    return tree;
  }
  async getLatestCommit({ ownerUsername, repoName, path }) {
    if (!ownerUsername || !repoName)
      return null;
    const response = await this.octokit.rest.repos.listCommits({
      owner: ownerUsername,
      path,
      per_page: 1,
      repo: repoName
    });
    if (!response)
      return null;
    const latest = response.data[0];
    const commit = latest.commit;
    const latestCommit = {
      authorEmail: commit.author?.email,
      authorName: commit.author?.name,
      date: commit.author?.date,
      html_url: latest.html_url,
      message: commit.message
    };
    return latestCommit;
  }
  async getDocument({
    ownerUsername,
    path = "",
    branch: ref,
    repoName: repo
  }) {
    if (!ownerUsername || !repo)
      return null;
    const result = await this.octokit.repos.getContent({ owner: ownerUsername, path, ref, repo }).catch(() => null);
    if (!result)
      return null;
    if (Array.isArray(result.data))
      return null;
    if (result.data.type === "dir")
      return null;
    const { content, download_url, sha } = result.data;
    return {
      content: this.decodeContent(content),
      hash: sha,
      url: download_url ?? `https://raw.githubusercontent.com/${ownerUsername}/${repo}/${ref}/${encodeURIComponent(path)}`
    };
  }
  async createRepo({ description, isPrivate = false, name }) {
    const response = await this.octokit.rest.repos.createForAuthenticatedUser({
      name,
      description,
      auto_init: true,
      private: isPrivate
    }).catch(() => null);
    if (!response)
      return null;
    const repo = response.data;
    if (repo)
      repo.owner.username = repo.owner?.login;
    return repo;
  }
  async createRepoInOrg({ description, isPrivate, name, orgName }) {
    if (!orgName)
      return null;
    const response = await this.octokit.rest.repos.createInOrg({
      org: orgName,
      name,
      description,
      auto_init: true,
      private: isPrivate
    }).catch(() => null);
    if (!response)
      return null;
    const repo = response.data;
    if (repo)
      repo.owner.username = repo.owner?.login;
    return repo;
  }
  async checkOrgMemberWritenPermission({
    orgName: org,
    username
  }) {
    if (!org || !username)
      return false;
    const response = await this.octokit.rest.orgs.checkMembershipForUser({ org, username }).catch(() => null);
    if (!response)
      return false;
    if (response.status === 302)
      return false;
    return true;
  }
  async checkRepoUserWritenPermission({
    repoName: repo,
    ownerUsername: owner,
    username
  }) {
    if (!repo || !owner || !username)
      return false;
    const response = await this.octokit.rest.repos.getCollaboratorPermissionLevel({ owner, repo, username }).catch(() => null);
    if (!response)
      return false;
    const permission = response.data.permission;
    if (permission === "admin" || permission === "write")
      return true;
    return false;
  }
  async createFolder({
    branch,
    message,
    ownerUsername: owner,
    path,
    repoName: repo
  }) {
    if (!repo || !owner)
      return null;
    const filename = ".gitkeep";
    path = `${path}/${filename}`;
    const response = await this.octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: this.encodeContent(""),
      branch
    });
    return response;
  }
  async saveDocument(params) {
    const { branch, content, message, ownerUsername: owner, path, repoName: repo, hash } = params;
    if (!repo || !owner)
      return null;
    const response = await this.octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: this.encodeContent(content),
      branch,
      sha: hash
    }).catch(() => null);
    if (!response)
      return null;
    const updatedResource = { ...params, hash: response.data.content?.sha };
    return updatedResource;
  }
  async createFork({ ownerUsername, repoName, orgName }) {
    if (!ownerUsername || !repoName)
      throw new Error("owner and repository are missing");
    const response = await this.octokit.repos.createFork({ owner: ownerUsername, repo: repoName, organization: orgName }).catch((error) => {
      throw new Error(error);
    });
    const fork = response.data;
    return fork;
  }
  async getBranch({ branch, ownerUsername, repoName }) {
    if (!ownerUsername || !repoName)
      return null;
    const response = await this.octokit.rest.repos.getBranch({ owner: ownerUsername, repo: repoName, branch }).catch(() => null);
    if (!response)
      return null;
    return response.data;
  }
  async checkForBranch({ branch, ownerUsername, repoName }) {
    const response = await this.getBranch({ branch, ownerUsername, repoName });
    if (!response)
      return false;
    return true;
  }
  async createBranch({ ownerUsername, repoName, branchOrigin, branchTarget }) {
    if (!repoName || !ownerUsername)
      return null;
    const originBranch = await this.getBranch({
      ownerUsername,
      repoName,
      branch: branchOrigin
    });
    if (!originBranch)
      return null;
    const response = await this.octokit.rest.git.createRef({
      owner: ownerUsername,
      repo: repoName,
      ref: `refs/heads/${branchTarget}`,
      sha: originBranch.commit.sha
    }).catch(() => null);
    if (!response)
      return null;
    return response.data;
  }
  async checkForPullRequest({ ownerUsername, repoName, title }) {
    const query = `state:open type:pr repo:${ownerUsername}/${repoName} ${title} in:title`;
    const result = await this.octokit.rest.search.issuesAndPullRequests({ q: query });
    return result.data.total_count > 0;
  }
  async createPullRequest({
    branchOrigin,
    branchHead,
    ownerUsername,
    origin,
    title
  }) {
    const doesPullRequestExist = await this.checkForPullRequest({
      branch: branchHead,
      ownerUsername,
      repoName: origin.name,
      title
    });
    if (doesPullRequestExist)
      return "exists";
    const pullRequest = await this.octokit.rest.pulls.create({
      base: branchOrigin,
      head: branchHead,
      owner: ownerUsername,
      repo: origin.name,
      title
    }).catch(() => null);
    if (!pullRequest)
      return null;
    return "created";
  }
  async createPullRequestFromFork({ fork, origin, title }) {
    const base = origin.default_branch;
    const head = `${fork.owner.username}:${fork.default_branch}`;
    const doesPullRequestExist = await this.checkForPullRequest({
      branch: head,
      ownerUsername: origin.owner.username,
      repoName: origin.name,
      title
    });
    if (doesPullRequestExist)
      return "exists";
    const pullRequest = await this.octokit.rest.pulls.create({ owner: origin.owner.username, repo: origin.name, title, head, base }).catch(() => null);
    if (!pullRequest)
      return null;
    return "created";
  }
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvc3RvcmFnZVNlcnZpY2Vfc3JjX3Byb3ZpZGVyc19HaXRodWJfdHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUF1QmUsTUFBTSxPQUEyQjtBQUFBLEVBYzlDLFlBQVksRUFBRSxnQkFBb0M7QUFibEQsU0FBUyxPQUFPO0FBS2hCLGtCQUFTO0FBQ1Qsb0JBQVc7QUFRVCxRQUFJLENBQUM7QUFBYyxZQUFNLElBQUksTUFBTSwwQkFBMEI7QUFFN0QsU0FBSyxRQUFRLG1EQUFZLENBQUM7QUFBQSxNQUN4QixTQUFTLEVBQUUsZUFBZSxVQUFVLGVBQWU7QUFBQSxJQUNyRCxDQUFDO0FBRUQsU0FBSyxVQUFVLElBQUksa0RBQU8sQ0FBQztBQUFBLE1BQ3pCLE1BQU07QUFBQSxNQUNOLFdBQVc7QUFBQSxJQUNiLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFFQSxjQUFzQixTQUFpQjtBQUNyQyxXQUFPLGdEQUFXLENBQUMsT0FBTyxFQUFFLFNBQVMsUUFBUTtBQUFBLEVBQy9DO0FBQUEsRUFFQSxjQUFzQixTQUFpQjtBQUNyQyxXQUFPLGdEQUFXLENBQUMsU0FBUyxRQUFRLEVBQUUsU0FBUyxNQUFNO0FBQUEsRUFDdkQ7QUFBQSxFQUVBLGdCQUF3QixHQUFXO0FBQ2pDLFVBQU0sU0FBa0MsQ0FBQztBQUN6QyxVQUFNLFFBQVE7QUFFZCxRQUFJO0FBQ0osV0FBUSxJQUFJLE1BQU0sS0FBSyxDQUFDLEdBQUk7QUFDMUIsWUFBTSxDQUFDLEVBQUUsR0FBRyxLQUFLO0FBQ2pCLGFBQU8sS0FBSztBQUFBLElBQ2Q7QUFFQSxXQUFPO0FBQUEsRUFDVDtBQUFBLEVBT0EsTUFBTSx1QkFBdUI7QUFDM0IsVUFBTSxXQUFXLE1BQU0sS0FBSyxRQUFRLE1BQU0saUJBQWlCO0FBQzNELFFBQUksQ0FBQztBQUFVLGFBQU87QUFFdEIsVUFBTSxPQUFPLFNBQVM7QUFDdEIsU0FBSyxXQUFXLEtBQUs7QUFFckIsU0FBSyxTQUFTLEtBQUssR0FBRyxT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QUNSLGVBQWUsT0FBTyxNQUFNO0FBQUEsTUFDNUIsVUFBVSxPQUFPO0FBQUEsTUFDakI7QUFBQSxJQUNGLENBQUM7QUFFRCxRQUFJO0FBQXNCLGFBQU87QUFFakMsVUFBTSxjQUFjLE1BQU0sS0FBSyxRQUFRLEtBQUssTUFDekMsT0FBTyxFQUFFLE9BQU8sT0FBTyxNQUFNLFVBQVUsTUFBTSxPQUFPLE1BQU0sT0FBTyxNQUFNLEtBQUssQ0FBQyxFQUM3RSxNQUFNLE1BQU0sSUFBSTtBQUVuQixRQUFJLENBQUM7QUFBYSxhQUFPO0FBRXpCLFdBQU87QUFBQSxFQUNUO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AY3dyYy9sZWFmd3JpdGVyLWNvbW1vbnMvLi4vc3RvcmFnZVNlcnZpY2Uvc3JjL3Byb3ZpZGVycy9HaXRodWIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNb2R1bGUgcHJvdmlkaW5nIEdpdEh1YiBBUEkgY2FsbHMuXG4gKiBAbW9kdWxlIGdpdGh1YlxuICovXG5cbmltcG9ydCB7IE9jdG9raXQgfSBmcm9tICdAb2N0b2tpdC9yZXN0JztcbmltcG9ydCBheGlvcywgeyBBeGlvc0luc3RhbmNlIH0gZnJvbSAnYXhpb3MnO1xuaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSAnYnVmZmVyLyc7XG5pbXBvcnQgdHlwZSAqIGFzIFR5cGVzIGZyb20gJy4uL3R5cGVzL1Byb3ZpZGVyJztcbmltcG9ydCB0eXBlIFByb3ZpZGVyIGZyb20gJy4uL3R5cGVzL1Byb3ZpZGVyJztcbmltcG9ydCB0eXBlICogYXMgVCBmcm9tICcuLi90eXBlcyc7XG5cbi8vIC0tLS0tLS0tLS0tLS0gSW50ZXJuYWwgdHlwZXMgLS0tLS0tLS0tLS0tLS1cblxuLy8gaW50ZXJmYWNlIElHZXRMYXRlc3RGaWxlU0hBIHtcbi8vICAgb3duZXI6IHN0cmluZztcbi8vICAgcmVwbzogc3RyaW5nO1xuLy8gICBicmFuY2g6IHN0cmluZztcbi8vICAgcGF0aDogc3RyaW5nO1xuLy8gfVxuXG5pbnRlcmZhY2UgSUNoZWNrRm9yUHVsbFJlcXVlc3Qge1xuICBicmFuY2g6IHN0cmluZztcbiAgb3duZXJVc2VybmFtZTogc3RyaW5nO1xuICByZXBvTmFtZTogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHaXRodWIgaW1wbGVtZW50cyBQcm92aWRlciB7XG4gIHJlYWRvbmx5IG5hbWUgPSAnZ2l0aHViJztcblxuICBwcml2YXRlIHJlYWRvbmx5IG9jdG9raXQ6IE9jdG9raXQ7XG4gIHByaXZhdGUgcmVhZG9ubHkgYXhpb3M6IEF4aW9zSW5zdGFuY2U7XG5cbiAgdXNlcklkID0gJyc7XG4gIHVzZXJuYW1lID0gJyc7XG5cbiAgLyoqXG4gICAqIEF1dGhlbnRpY2F0ZSB0aGUgdXNlciBmb3IgbWFraW5nIGNhbGxzIHRvIEdpdEh1YiwgdXNpbmcgdGhlaXIgT0F1dGggdG9rZW4uXG4gICAqIFNlZSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My8jYXV0aGVudGljYXRpb259XG4gICAqIEBwYXJhbSB7YWNjZXNzX3Rva2VufSB0b2tlbiBUaGUgT0F1dGggYWNjZXNzX3Rva2VuIGZyb20gR2l0SHViXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih7IGFjY2Vzc190b2tlbiB9OiBUeXBlcy5Qcm92aWRlckF1dGgpIHtcbiAgICBpZiAoIWFjY2Vzc190b2tlbikgdGhyb3cgbmV3IEVycm9yKCdObyBhY2Nlc3MgdG9rZW4gcHJvdmlkZWQnKTtcblxuICAgIHRoaXMuYXhpb3MgPSBheGlvcy5jcmVhdGUoe1xuICAgICAgaGVhZGVyczogeyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7YWNjZXNzX3Rva2VufWAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMub2N0b2tpdCA9IG5ldyBPY3Rva2l0KHtcbiAgICAgIGF1dGg6IGFjY2Vzc190b2tlbixcbiAgICAgIHVzZXJBZ2VudDogJ2xlYWYtd3JpdGVyLXN0b3JhZ2Utc2VydmljZScsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGVuY29kZUNvbnRlbnQoY29udGVudDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKGNvbnRlbnQpLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgfVxuXG4gIHByaXZhdGUgZGVjb2RlQ29udGVudChjb250ZW50OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gQnVmZmVyLmZyb20oY29udGVudCwgJ2Jhc2U2NCcpLnRvU3RyaW5nKCd1dGY4Jyk7XG4gIH1cblxuICBwcml2YXRlIHBhcnNlSGVhZGVyTGluayhzOiBzdHJpbmcpIHtcbiAgICBjb25zdCBvdXRwdXQ6IHsgW3g6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG4gICAgY29uc3QgcmVnZXggPSAvPChbXj5dKyk+OyByZWw9XCIoW15cIl0rKVwiL2c7XG5cbiAgICBsZXQgbTtcbiAgICB3aGlsZSAoKG0gPSByZWdleC5leGVjKHMpKSkge1xuICAgICAgY29uc3QgWywgdiwga10gPSBtO1xuICAgICAgb3V0cHV0W2tdID0gdjtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgZGV0YWlscyBhc3NvY2lhdGVkIHdpdGggdGhlIGN1cnJlbnRseSBhdXRoZW50aWNhdGVkIHVzZXIuXG4gICAqIFNlZSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My91c2Vycy8jZ2V0LXRoZS1hdXRoZW50aWNhdGVkLXVzZXJ9XG4gICAqIEByZXR1cm5zXG4gICAqL1xuICBhc3luYyBnZXRBdXRoZW50aWNhdGVkVXNlcigpIHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMub2N0b2tpdC51c2Vycy5nZXRBdXRoZW50aWNhdGVkKCk7XG4gICAgaWYgKCFyZXNwb25zZSkgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCB1c2VyID0gcmVzcG9uc2UuZGF0YSBhcyBhbnk7XG4gICAgdXNlci51c2VybmFtZSA9IHVzZXIubG9naW47XG5cbiAgICB0aGlzLnVzZXJJZCA9IHVzZXIuaWQudG9TdHJpbmcoKTtcbiAgICB0aGlzLnVzZXJuYW1lID0gdXNlci5sb2dpbjtcblxuICAgIHJldHVybiB1c2VyO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgZGV0YWlscyBmb3IgYSBzcGVjaWZpYyB1c2VyLlxuICAgKiBTZWUge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvdXNlcnMvI2dldC1hLXNpbmdsZS11c2VyfVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlciB0aGUgdXNlcm5hbWVcbiAgICogQHJldHVybnMge1Byb21pc2U8R2V0RGV0YWlsc0ZvclVzZXI+fVxuICAgKi9cbiAgYXN5bmMgZ2V0RGV0YWlsc0ZvclVzZXIoeyB1c2VyOiB1c2VybmFtZSB9OiBUeXBlcy5Vc2VyRGV0YWlsUGFyYW1zKSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLm9jdG9raXQudXNlcnMuZ2V0QnlVc2VybmFtZSh7IHVzZXJuYW1lIH0pLmNhdGNoKCgpID0+IG51bGwpO1xuICAgIGlmICghcmVzcG9uc2UpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHVzZXIgPSByZXNwb25zZS5kYXRhIGFzIGFueTtcbiAgICB1c2VyLnVzZXJuYW1lID0gdXNlci5sb2dpbjtcbiAgICByZXR1cm4gdXNlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHJlcG9zIHRoZSB1c2VyIGhhcyBleHBsaWNpdCBwZXJtaXNzaW9uIHRvIGFjY2Vzcy5cbiAgICogU2VlIHtAbGluayBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zLyNsaXN0LXlvdXItcmVwb3NpdG9yaWVzfVxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29sbGVjdGlvblNvdXJjZSBVc2VyJ3MgcmVsYXRpb24gdG8gdGhlIHJlcG9cbiAgICogQHBhcmFtIHtudW1iZXJ9IHBhZ2UgVGhlIHBhZ2UgbnVtYmVyID0gMVxuICAgKiBAcGFyYW0ge251bWJlcn0gcGVyX3BhZ2UgUmVwb3MgcGVyIHBhZ2UgPSA2MFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICovXG4gIGFzeW5jIGdldFJlcG9zRm9yQXV0aGVudGljYXRlZFVzZXIoe1xuICAgIGNvbGxlY3Rpb25Tb3VyY2UsXG4gICAgbmV4dFBhZ2UsXG4gICAgcGVyX3BhZ2UgPSAyMCxcbiAgfTogVHlwZXMuUmVwb3NQYXJhbXMpIHtcbiAgICBjb25zdCByZXNwb25zZTogYW55ID0gbmV4dFBhZ2VcbiAgICAgID8gYXdhaXQgdGhpcy5heGlvcy5nZXQobmV4dFBhZ2UpXG4gICAgICA6IGF3YWl0IHRoaXMub2N0b2tpdC5yZXN0LnJlcG9zLmxpc3RGb3JBdXRoZW50aWNhdGVkVXNlcih7XG4gICAgICAgICAgYWZmaWxpYXRpb246IGNvbGxlY3Rpb25Tb3VyY2UsXG4gICAgICAgICAgcGVyX3BhZ2UsXG4gICAgICAgIH0pO1xuXG4gICAgbGV0IGNvbGxlY3Rpb24gPSByZXNwb25zZS5kYXRhIGFzIGFueVtdO1xuICAgIGlmIChjb2xsZWN0aW9uU291cmNlICE9PSAnb3duZXInKVxuICAgICAgY29sbGVjdGlvbiA9IGF3YWl0IHRoaXMuZXhwYW5kUmVwb3NXSXRoVXNlckRldGFpbHMoY29sbGVjdGlvbik7XG5cbiAgICAvL2FkZCB1c2VybmFtZSBhdHRyXG4gICAgY29sbGVjdGlvbiA9IGNvbGxlY3Rpb24ubWFwKChyZXBvOiBhbnkpID0+IHtcbiAgICAgIHJlcG8ub3duZXIudXNlcm5hbWUgPSByZXBvLm93bmVyPy5sb2dpbjtcbiAgICAgIHJldHVybiByZXBvO1xuICAgIH0pO1xuXG4gICAgY29uc3QgaGVhZGVyTGlua3MgPSByZXNwb25zZS5oZWFkZXJzLmxpbmsgPyB0aGlzLnBhcnNlSGVhZGVyTGluayhyZXNwb25zZS5oZWFkZXJzLmxpbmspIDogbnVsbDtcbiAgICBjb25zdCBuZXh0UGFnZUxpbmsgPSBoZWFkZXJMaW5rcyA/IGhlYWRlckxpbmtzLm5leHQgOiBudWxsO1xuXG4gICAgcmV0dXJuIHsgY29sbGVjdGlvbiwgbmV4dFBhZ2U6IG5leHRQYWdlTGluayB9O1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBleHBhbmRSZXBvc1dJdGhVc2VyRGV0YWlscyhjb2xsZWN0aW9uOiBhbnkpIHtcbiAgICBjb25zdCB1c2VyczogYW55W10gPSBbXTtcblxuICAgIGZvciAoY29uc3QgcmVwbyBvZiBjb2xsZWN0aW9uKSB7XG4gICAgICBsZXQgdXNlciA9IHVzZXJzLmZpbmQoKHVzcikgPT4gdXNyLmlkID09PSByZXBvLm93bmVyLmlkKTtcbiAgICAgIGlmICghdXNlcikgdXNlciA9IGF3YWl0IHRoaXMuZ2V0RGV0YWlsc0ZvclVzZXIoeyB1c2VyOiByZXBvLm93bmVyLmxvZ2luIH0pO1xuICAgICAgaWYgKCF1c2VyKSBjb250aW51ZTtcbiAgICAgIHVzZXJzLnB1c2godXNlcik7XG4gICAgICByZXBvLm93bmVyID0gdXNlcjtcbiAgICB9XG5cbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHJlcG9zIGZvciBhIHNwZWNpZmljIHVzZXIuXG4gICAqIFNlZSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy8jbGlzdC11c2VyLXJlcG9zaXRvcmllc31cbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJuYW1lIFRoZSB1c2VybmFtZVxuICAgKiBAcGFyYW0ge251bWJlcn0gcGFnZSBUaGUgcGFnZSBudW1iZXIgPSAxXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBwZXJfcGFnZSBSZXBvcyBwZXIgcGFnZSA9IDYwXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKi9cbiAgYXN5bmMgZ2V0UmVwb3NGb3JVc2VyKHsgdXNlcm5hbWUsIG5leHRQYWdlLCBwZXJfcGFnZSA9IDYwIH06IFR5cGVzLlJlcG9zRm9yVXNlclBhcmFtcykge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gbmV4dFBhZ2VcbiAgICAgID8gYXdhaXQgdGhpcy5heGlvcy5nZXQobmV4dFBhZ2UpXG4gICAgICA6IGF3YWl0IHRoaXMub2N0b2tpdC5yZXBvcy5saXN0Rm9yVXNlcih7IHVzZXJuYW1lLCBwZXJfcGFnZSB9KTtcblxuICAgIGxldCBjb2xsZWN0aW9uID0gcmVzcG9uc2UuZGF0YSBhcyBhbnlbXTtcblxuICAgIC8vYWRkIHVzZXJuYW1lIGF0dHJcbiAgICBjb2xsZWN0aW9uID0gY29sbGVjdGlvbi5tYXAoKHJlcG86IGFueSkgPT4ge1xuICAgICAgcmVwby5vd25lci51c2VybmFtZSA9IHJlcG8ub3duZXI/LmxvZ2luO1xuICAgICAgcmV0dXJuIHJlcG87XG4gICAgfSk7XG5cbiAgICBjb25zdCBoZWFkZXJMaW5rcyA9IHJlc3BvbnNlLmhlYWRlcnMubGluayA/IHRoaXMucGFyc2VIZWFkZXJMaW5rKHJlc3BvbnNlLmhlYWRlcnMubGluaykgOiBudWxsO1xuICAgIGNvbnN0IG5leHRQYWdlTGluayA9IGhlYWRlckxpbmtzID8gaGVhZGVyTGlua3MubmV4dCA6IG51bGw7XG5cbiAgICByZXR1cm4geyBjb2xsZWN0aW9uLCBuZXh0UGFnZTogbmV4dFBhZ2VMaW5rIH07XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSByZXBvIGZvciBhIHNwZWNpZmljIHVzZXIuXG4gICAqIFNlZSB7QGxpbmsgaHR0cHM6Ly9kb2NzLmdpdGh1Yi5jb20vZW4vcmVzdC9yZWZlcmVuY2UvcmVwb3MjZ2V0LWEtcmVwb3NpdG9yeX1cbiAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJuYW1lIFRoZSBvd25lciBuYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZXBvTmFtZSBUaGUgcmVwbyBuYW1lXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKi9cbiAgYXN5bmMgZ2V0UmVwbyh7IHVzZXJuYW1lLCByZXBvTmFtZSB9OiBUeXBlcy5SZXBvUGFyYW1zKSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLm9jdG9raXQucmVzdC5yZXBvc1xuICAgICAgLmdldCh7IG93bmVyOiB1c2VybmFtZSwgcmVwbzogcmVwb05hbWUgfSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBSZXBvc2l0b3J5IG5vdCBmb3VuZDogJHtlcnJvcn1gKTtcbiAgICAgIH0pO1xuXG4gICAgY29uc3QgcmVwbyA9IHJlc3BvbnNlLmRhdGEgYXMgdW5rbm93biBhcyBULlJlcG9zaXRvcnk7XG4gICAgcmVwby5vd25lci51c2VybmFtZSA9IHJlcG8ub3duZXI/LmxvZ2luO1xuICAgIHJlcG8ub3duZXIucGF0aCA9IHJlcG8ubmFtZTtcblxuICAgIHJldHVybiByZXBvO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGNvbnRlbnRzIG9mIGEgZmlsZSBvciBkaXJlY3RvcnkgaW4gYSByZXBvc2l0b3J5LlxuICAgKiBTZWUge0BsaW5rIGh0dHBzOi8vdGhpcy5vY3Rva2l0LmdpdGh1Yi5pby9yZXN0LmpzL3YxOCNyZXBvcy1nZXQtY29udGVudHN9XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvd25lclVzZXJuYW1lIFRoZSBvd25lclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCBUaGUgcGF0aCBwYXJpbiB0aGUgcmVwb1xuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVmIFRoZSBuYW1lIG9mIHRoZSBjb21taXQvYnJhbmNoL3RhZy4gRGVmYXVsdDogdGhlIHJlcG9zaXRvcnnigJlzIGRlZmF1bHQgYnJhbmNoICh1c3VhbGx5IG1hc3RlcilcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlcG8gUmVwbyBuYW1lXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKi9cbiAgYXN5bmMgZ2V0UmVwb0NvbnRlbnQoe1xuICAgIG93bmVyVXNlcm5hbWUsXG4gICAgcmVwb05hbWUsXG4gICAgcGF0aCA9ICcnLFxuICAgIGJyYW5jaDogcmVmLFxuICB9OiBUeXBlcy5SZXBvQ29udGVudFBhcmFtcykge1xuICAgIGlmICghb3duZXJVc2VybmFtZSB8fCAhcmVwb05hbWUpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5vY3Rva2l0LnJlc3QucmVwb3NcbiAgICAgIC5nZXRDb250ZW50KHsgb3duZXI6IG93bmVyVXNlcm5hbWUsIHJlcG86IHJlcG9OYW1lLCBwYXRoLCByZWYgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiBudWxsKTtcblxuICAgIGlmICghcmVzcG9uc2UpIHJldHVybiBudWxsO1xuXG4gICAgbGV0IGNvbnRlbnQgPSByZXNwb25zZS5kYXRhID8/IFtdO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY29udGVudCkpIHtcbiAgICAgIGNvbnRlbnQgPSBjb250ZW50Lm1hcCgoaXRlbTogYW55KSA9PiB7XG4gICAgICAgIGl0ZW0udHlwZSA9IGl0ZW0udHlwZSA9PT0gJ2RpcicgPyAnZm9sZGVyJyA6IGl0ZW0udHlwZTtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGVudC50eXBlID0gY29udGVudC50eXBlID09PSAnZGlyJyA/ICdmb2xkZXInIDogY29udGVudC50eXBlO1xuICAgIH1cblxuICAgIHJldHVybiBjb250ZW50O1xuICB9XG5cbiAgYXN5bmMgZ2V0UmVwb0JyYW5jaGVzKHsgb3duZXIsIHJlcG9OYW1lIH06IFR5cGVzLlJlcG9CcmFuY2hlc1BhcmFtcykge1xuICAgIGlmICghb3duZXIpIHJldHVybjtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMub2N0b2tpdC5yZXF1ZXN0KGBHRVQgL3JlcG9zLyR7b3duZXJ9LyR7cmVwb05hbWV9L2JyYW5jaGVzYCk7XG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gIH1cblxuICBhc3luYyBnZXRPcmdhbml6YXRpb25zRm9yQXV0aGVudGljYXRlZFVzZXIoeyBuZXh0UGFnZSwgcGVyX3BhZ2UgPSA2MCB9OiBUeXBlcy5QYWdpbmF0b3JQYXJhbXMpIHtcbiAgICBjb25zdCByZXNwb25zZSA9IG5leHRQYWdlXG4gICAgICA/IGF3YWl0IHRoaXMuYXhpb3MuZ2V0KG5leHRQYWdlKVxuICAgICAgOiBhd2FpdCB0aGlzLm9jdG9raXQub3Jncy5saXN0Rm9yQXV0aGVudGljYXRlZFVzZXIoeyBwZXJfcGFnZSB9KTtcblxuICAgIGNvbnN0IGNvbGxlY3Rpb246IGFueSA9IHJlc3BvbnNlLmRhdGEgPz8gW107XG4gICAgY29uc3Qgb3JnYW5pemFpb25zID0gW107XG5cbiAgICBmb3IgKGNvbnN0IG9yZyBvZiBjb2xsZWN0aW9uKSB7XG4gICAgICBjb25zdCBvcmdEZXRhaWxzID0gYXdhaXQgdGhpcy5nZXREZXRhaWxzRm9yVXNlcih7IHVzZXI6IG9yZy5sb2dpbiB9KTtcbiAgICAgIGlmICghb3JnRGV0YWlscykgY29udGludWU7XG4gICAgICBvcmdhbml6YWlvbnMucHVzaCh7IHVzZXJuYW1lOiBvcmcubG9naW4sIGRlc2NyaXB0aW9uOiBvcmdEZXRhaWxzLmJpbywgLi4ub3JnRGV0YWlscyB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBoZWFkZXJMaW5rcyA9IHJlc3BvbnNlLmhlYWRlcnMubGluayA/IHRoaXMucGFyc2VIZWFkZXJMaW5rKHJlc3BvbnNlLmhlYWRlcnMubGluaykgOiBudWxsO1xuICAgIGNvbnN0IG5leHRQYWdlTGluayA9IGhlYWRlckxpbmtzID8gaGVhZGVyTGlua3MubmV4dCA6IG51bGw7XG5cbiAgICByZXR1cm4geyBjb2xsZWN0aW9uOiBvcmdhbml6YWlvbnMsIG5leHRQYWdlOiBuZXh0UGFnZUxpbmsgfTtcbiAgfVxuXG4gIGFzeW5jIGdldE9yZ2FuaXphdGlvbih7IG9yZ05hbWU6IG9yZyB9OiBUeXBlcy5HZXRPcmdhbml6YXRpb24pIHtcbiAgICBpZiAoIW9yZykgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IHRoaXMub2N0b2tpdC5yZXN0Lm9yZ3MuZ2V0KHsgb3JnIH0pLmNhdGNoKCgpID0+IG51bGwpO1xuICAgIGlmICghcmVzcG9uc2UpIHJldHVybiBudWxsO1xuXG4gICAgY29uc3Qgb3JnYW5pemF0aW9uID0gcmVzcG9uc2UgYXMgYW55O1xuICAgIG9yZ2FuaXphdGlvbi51c2VybmFtZSA9IG9yZ2FuaXphdGlvbi5sb2dpbjtcblxuICAgIHJldHVybiBvcmdhbml6YXRpb247XG4gIH1cblxuICBhc3luYyBnZXRSZXBvc0Zvck9yZ2FuaXphdGlvbih7XG4gICAgb3JnVXNlcm5hbWU6IG9yZyxcbiAgICBuZXh0UGFnZSxcbiAgICBwZXJfcGFnZSA9IDYwLFxuICB9OiBUeXBlcy5SZXBvc0Zvck9yZ3NQYXJhbXMpIHtcbiAgICBpZiAoIW9yZykgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IG5leHRQYWdlXG4gICAgICA/IGF3YWl0IHRoaXMuYXhpb3MuZ2V0KG5leHRQYWdlKVxuICAgICAgOiBhd2FpdCB0aGlzLm9jdG9raXQucmVwb3MubGlzdEZvck9yZyh7IG9yZywgcGVyX3BhZ2UgfSk7XG5cbiAgICBjb25zdCBjb2xsZWN0aW9uOiBhbnkgPSByZXNwb25zZS5kYXRhID8/IFtdO1xuXG4gICAgLy9hZGQgdXNlcm5hbWUgYXR0clxuICAgIGNvbnN0IHJlcG9zaXRvcmllcyA9IGNvbGxlY3Rpb24ubWFwKChyZXBvOiBhbnkpID0+IHtcbiAgICAgIHJlcG8ub3duZXIudXNlcm5hbWUgPSByZXBvLm93bmVyPy5sb2dpbjtcbiAgICAgIHJldHVybiByZXBvO1xuICAgIH0pO1xuXG4gICAgY29uc3QgaGVhZGVyTGlua3MgPSByZXNwb25zZS5oZWFkZXJzLmxpbmsgPyB0aGlzLnBhcnNlSGVhZGVyTGluayhyZXNwb25zZS5oZWFkZXJzLmxpbmspIDogbnVsbDtcbiAgICBjb25zdCBuZXh0UGFnZUxpbmsgPSBoZWFkZXJMaW5rcyA/IGhlYWRlckxpbmtzLm5leHQgOiBudWxsO1xuXG4gICAgcmV0dXJuIHsgY29sbGVjdGlvbjogcmVwb3NpdG9yaWVzLCBuZXh0UGFnZTogbmV4dFBhZ2VMaW5rIH07XG4gIH1cblxuICBhc3luYyBzZWFyY2hVc2VycyhxdWVyeTogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLm9jdG9raXQucmVzdC5zZWFyY2gudXNlcnMoeyBxOiBxdWVyeSwgcGVyX3BhZ2U6IDEwIH0pO1xuXG4gICAgY29uc3QgY29sbGVjdGlvbiA9IHJlc3BvbnNlLmRhdGEuaXRlbXMgPz8gW107XG5cbiAgICBjb25zdCB1c2VyQ29sbGVjdGlvbjogYW55W10gPSBbXTtcblxuICAgIGZvciAoY29uc3QgaXRlbSBvZiBjb2xsZWN0aW9uKSB7XG4gICAgICBjb25zdCBkZXRhaWwgPSBhd2FpdCB0aGlzLmdldERldGFpbHNGb3JVc2VyKHsgdXNlcjogaXRlbS5sb2dpbiB9KTtcbiAgICAgIGNvbnN0IHVzZXI6IGFueSA9IHtcbiAgICAgICAgYXZhdGFyX3VybDogaXRlbS5hdmF0YXJfdXJsLFxuICAgICAgICBpZDogaXRlbS5pZCxcbiAgICAgICAgbmFtZTogKGRldGFpbD8ubmFtZSBhcyBzdHJpbmcpID8/ICcnLFxuICAgICAgICB0eXBlOiBpdGVtLnR5cGUgPT09ICdvcmdhbml6YXRpb24nID8gJ29yZ2FuaXphdGlvbicgOiAndXNlcicsXG4gICAgICAgIHVzZXJuYW1lOiBpdGVtLmxvZ2luLFxuICAgICAgfTtcbiAgICAgIHVzZXJDb2xsZWN0aW9uLnB1c2godXNlcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVzZXJDb2xsZWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlYXJjaCBmb3IgZmlsZXMgYmFzZWQgb24gYSBzcGVjaWZpYyBxdWVyeS5cbiAgICogU2VlIHtAbGluayBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3NlYXJjaC8jc2VhcmNoLWNvZGV9XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvd25lciBMaW1pdCB0byBmaWxlcyBvd25lciBieSB0aGlzIHVzZXJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHF1ZXJ5IFRoZSBxdWVyeVxuICAgKiBAcGFyYW0ge1N0cmluZ30gZXh0ZW5zaW9uIExpbWl0IHRvIGZpbGVzIHdpdGggdGhpcyBleHRlbnNpb25cbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuICBhc3luYyBzZWFyY2hCbG9icyh7IGV4dGVuc2lvbiwgb3duZXIsIHF1ZXJ5IH06IFR5cGVzLlNlYXJjaEJsb2JzUGFyYW1zKTogUHJvbWlzZTxhbnk+IHtcbiAgICBsZXQgcSA9IGAke3F1ZXJ5fSB1c2VyOiR7b3duZXJ9YDtcbiAgICBpZiAoZXh0ZW5zaW9uKSBxICs9IGAgbGFuZ3VhZ2U6JHtleHRlbnNpb259YDtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5vY3Rva2l0LnNlYXJjaC5jb2RlKHtcbiAgICAgIG1lZGlhVHlwZTogeyBmb3JtYXQ6ICd0ZXh0LW1hdGNoJyB9LFxuICAgICAgcGVyX3BhZ2U6IDEwLFxuICAgICAgcSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlc3VsdHMgPSByZXNwb25zZS5kYXRhLml0ZW1zID8/IFtdO1xuXG4gICAgY29uc3Qgc2VhcmNoUmVzdWx0cyA9IHJlc3VsdHMubWFwKChpdGVtOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHBhdGhUb0ZpbGUgPSBpdGVtLnBhdGguc3BsaXQoJy8nKTtcbiAgICAgIHBhdGhUb0ZpbGUucG9wKCk7IC8vcmVtb3ZlIGZpbGVuYW1lIGZyb20gcGF0aFxuXG4gICAgICBpdGVtLnJlcG9zaXRvcnkub3duZXIudXNlcm5hbWUgPSBpdGVtLnJlcG9zaXRvcnkub3duZXI/LmxvZ2luO1xuXG4gICAgICBjb25zdCBzaW1wbGlmaWVkSXRlbSA9IHtcbiAgICAgICAgbmFtZTogaXRlbS5uYW1lLFxuICAgICAgICB0eXBlOiAnZmlsZScsXG4gICAgICAgIG93bmVyOiBpdGVtLnJlcG9zaXRvcnkub3duZXIsXG4gICAgICAgIHBhdGg6IHBhdGhUb0ZpbGUuam9pbignLycpLFxuICAgICAgICByZXBvc2l0b3J5OiBpdGVtLnJlcG9zaXRvcnksXG4gICAgICAgIHNjb3JlOiBpdGVtLnNjb3JlLFxuICAgICAgICB0ZXh0X21hdGNoZXM6IGl0ZW0udGV4dF9tYXRjaGVzLFxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHNpbXBsaWZpZWRJdGVtO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHNlYXJjaFJlc3VsdHM7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHJlcG9zaXRvcnkgY29udGVudCByZWN1cnNldmVsbHlcbiAgICogU2VlIHtAbGluayBodHRwczovL2RvY3MuZ2l0aHViLmNvbS9lbi9yZXN0L3JlZmVyZW5jZS9naXQjdHJlZXN9XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBicmFuY2ggVGhlIGJyYW5jaFxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3duZXJVc2VybmFtZSB1c2VyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSByZXBvTmFtZSBUaGUgcmVwb3NpdG9yeVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICovXG4gIGFzeW5jIGdldFJlcG9Db250ZW50UmVjdXJzaXZlbHkoeyBvd25lclVzZXJuYW1lLCByZXBvTmFtZSwgYnJhbmNoIH06IFR5cGVzLlJlcG9Db250ZW50UGFyYW1zKSB7XG4gICAgaWYgKCFvd25lclVzZXJuYW1lIHx8ICFyZXBvTmFtZSkgcmV0dXJuIG51bGw7XG4gICAgY29uc3Qgb3JpZ2luQnJhbmNoID0gYXdhaXQgdGhpcy5nZXRCcmFuY2goeyBicmFuY2gsIG93bmVyVXNlcm5hbWUsIHJlcG9OYW1lIH0pO1xuICAgIGlmICghb3JpZ2luQnJhbmNoKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5vY3Rva2l0LnJlc3QuZ2l0LmdldFRyZWUoe1xuICAgICAgb3duZXI6IG93bmVyVXNlcm5hbWUsXG4gICAgICByZXBvOiByZXBvTmFtZSxcbiAgICAgIHRyZWVfc2hhOiBvcmlnaW5CcmFuY2guY29tbWl0LmNvbW1pdC50cmVlLnNoYSxcbiAgICAgIHJlY3Vyc2l2ZTogJ3RydWUnLFxuICAgIH0pO1xuXG4gICAgaWYgKHJlc3BvbnNlLmRhdGEudHJ1bmNhdGVkKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IHJlcG9UcmVlID0gcmVzcG9uc2UuZGF0YS50cmVlID8/IFtdO1xuXG4gICAgY29uc3QgdHJlZSA9IHJlcG9UcmVlLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgcGF0aEFycmF5ID0gaXRlbS5wYXRoPy5zcGxpdCgnLycpO1xuICAgICAgY29uc3QgbmFtZSA9IHBhdGhBcnJheT8ucG9wKCkgPz8gJyc7XG4gICAgICBjb25zdCBwYXRoID0gcGF0aEFycmF5Py5qb2luKCcvJykgPz8gJyc7XG4gICAgICBjb25zdCB0eXBlID0gaXRlbS50eXBlID09PSAndHJlZScgPyAnZm9sZGVyJyA6ICdmaWxlJztcblxuICAgICAgcmV0dXJuIHsgbmFtZSwgcGF0aCwgdHlwZSB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRyZWU7XG4gIH1cblxuICAvKipcbiAgICogTGF0ZXN0IGNvbW1pdFxuICAgKiBCYXNlZCBvbiB7QGxpbmsgaHR0cHM6Ly9kb2NzLmdpdGh1Yi5jb20vZW4vcmVzdC9yZWZlcmVuY2UvY29tbWl0cyNsaXN0LWNvbW1pdHN9XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvd25lclVzZXJuYW1lIHVzZXJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHJlcG9OYW1lIFRoZSByZXBvc2l0b3J5XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIFRoZSBwYXRoIChPcHRpb25hbClcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuICBhc3luYyBnZXRMYXRlc3RDb21taXQoeyBvd25lclVzZXJuYW1lLCByZXBvTmFtZSwgcGF0aCB9OiBUeXBlcy5HZXRMYXRlc3RDb21taXRQYXJhbXMpIHtcbiAgICBpZiAoIW93bmVyVXNlcm5hbWUgfHwgIXJlcG9OYW1lKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5vY3Rva2l0LnJlc3QucmVwb3MubGlzdENvbW1pdHMoe1xuICAgICAgb3duZXI6IG93bmVyVXNlcm5hbWUsXG4gICAgICBwYXRoLFxuICAgICAgcGVyX3BhZ2U6IDEsXG4gICAgICByZXBvOiByZXBvTmFtZSxcbiAgICB9KTtcblxuICAgIGlmICghcmVzcG9uc2UpIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgbGF0ZXN0ID0gcmVzcG9uc2UuZGF0YVswXTtcbiAgICBjb25zdCBjb21taXQgPSBsYXRlc3QuY29tbWl0O1xuXG4gICAgY29uc3QgbGF0ZXN0Q29tbWl0OiBUeXBlcy5JTGF0ZXN0Q29tbWl0ID0ge1xuICAgICAgYXV0aG9yRW1haWw6IGNvbW1pdC5hdXRob3I/LmVtYWlsLFxuICAgICAgYXV0aG9yTmFtZTogY29tbWl0LmF1dGhvcj8ubmFtZSxcbiAgICAgIGRhdGU6IGNvbW1pdC5hdXRob3I/LmRhdGUsXG4gICAgICBodG1sX3VybDogbGF0ZXN0Lmh0bWxfdXJsLFxuICAgICAgbWVzc2FnZTogY29tbWl0Lm1lc3NhZ2UsXG4gICAgfTtcbiAgICByZXR1cm4gbGF0ZXN0Q29tbWl0O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIGRvY3VtZW50IGZyb20gR2l0SHViLlxuICAgKiBTZWUge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvY29udGVudHMvI2dldC1jb250ZW50c31cbiAgICogU2VlIHtAbGluayBodHRwczovL3RoaXMub2N0b2tpdC5naXRodWIuaW8vcmVzdC5qcy8jdGhpcy5vY3Rva2l0LXJvdXRlcy1yZXBvcy1nZXQtY29udGVudHN9XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvd25lclVzZXJuYW1lIFRoZSBvd25lclxuICAgKiBAcGFyYW0ge1N0cmluZ30gcmVwb05hbWUgVGhlIHJlcG9zaXRvcnkgbmFtZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gYnJhbmNoIFRoZSBicmFuY2gvdGFnXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIFRoZSBwYXRoXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKi9cbiAgYXN5bmMgZ2V0RG9jdW1lbnQoe1xuICAgIG93bmVyVXNlcm5hbWUsXG4gICAgcGF0aCA9ICcnLFxuICAgIGJyYW5jaDogcmVmLFxuICAgIHJlcG9OYW1lOiByZXBvLFxuICB9OiBUeXBlcy5SZXBvQ29udGVudFBhcmFtcykge1xuICAgIGlmICghb3duZXJVc2VybmFtZSB8fCAhcmVwbykgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5vY3Rva2l0LnJlcG9zXG4gICAgICAuZ2V0Q29udGVudCh7IG93bmVyOiBvd25lclVzZXJuYW1lLCBwYXRoLCByZWYsIHJlcG8gfSlcbiAgICAgIC5jYXRjaCgoKSA9PiBudWxsKTtcblxuICAgIGlmICghcmVzdWx0KSByZXR1cm4gbnVsbDtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdC5kYXRhKSkgcmV0dXJuIG51bGw7XG4gICAgaWYgKHJlc3VsdC5kYXRhLnR5cGUgPT09ICdkaXInKSByZXR1cm4gbnVsbDtcblxuICAgIC8vQHRzLWlnbm9yZVxuICAgIGNvbnN0IHsgY29udGVudCwgZG93bmxvYWRfdXJsLCBzaGEgfSA9IHJlc3VsdC5kYXRhO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnQ6IHRoaXMuZGVjb2RlQ29udGVudChjb250ZW50KSxcbiAgICAgIGhhc2g6IHNoYSxcbiAgICAgIHVybDpcbiAgICAgICAgZG93bmxvYWRfdXJsID8/XG4gICAgICAgIGBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vJHtvd25lclVzZXJuYW1lfS8ke3JlcG99LyR7cmVmfS8ke2VuY29kZVVSSUNvbXBvbmVudChcbiAgICAgICAgICBwYXRoXG4gICAgICAgICl9YCxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyByZXBvIGZvciB0aGUgYXV0aGVudGljYXRlZCB1c2VyLlxuICAgKiBTZWUge0BsaW5rIGh0dHBzOi8vb2N0b2tpdC5naXRodWIuaW8vcmVzdC5qcy92MTgjcmVwb3N9XG4gICAqIEBwYXJhbSB7U3RyaW5nP30gZGVzY3JpcHRpb24gVGhlIHJlcG8gZGVzY3JpcHRpb25cbiAgICogQHBhcmFtIHtCb29sZWFuP30gaXNQcml2YXRlIElzIHRoZSByZXBvIHByaXZhdGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgVGhlIHJlcG8gbmFtZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgYXN5bmMgY3JlYXRlUmVwbyh7IGRlc2NyaXB0aW9uLCBpc1ByaXZhdGUgPSBmYWxzZSwgbmFtZSB9OiBUeXBlcy5DcmVhdGVSZXBvUGFyYW1zKSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLm9jdG9raXQucmVzdC5yZXBvc1xuICAgICAgLmNyZWF0ZUZvckF1dGhlbnRpY2F0ZWRVc2VyKHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgIGF1dG9faW5pdDogdHJ1ZSxcbiAgICAgICAgcHJpdmF0ZTogaXNQcml2YXRlLFxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiBudWxsKTtcblxuICAgIGlmICghcmVzcG9uc2UpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHJlcG8gPSByZXNwb25zZS5kYXRhIGFzIGFueTtcbiAgICBpZiAocmVwbykgcmVwby5vd25lci51c2VybmFtZSA9IHJlcG8ub3duZXI/LmxvZ2luO1xuXG4gICAgcmV0dXJuIHJlcG87XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IHJlcG8gZm9yIGEgc3BlY2lmaWMgb3JnLlxuICAgKiBTZWUge0BsaW5rIGh0dHBzOi8vb2N0b2tpdC5naXRodWIuaW8vcmVzdC5qcy92MTgjcmVwb3MtY3JlYXRlLWluLW9yZ31cbiAgICogQHBhcmFtIHtTdHJpbmc/fSBkZXNjcmlwdGlvbiBUaGUgcmVwbyBkZXNjcmlwdGlvblxuICAgKiBAcGFyYW0ge0Jvb2xlYW4/fSBpc1ByaXZhdGUgSXMgdGhlIHJlcG8gcHJpdmF0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgcmVwbyBuYW1lXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvcmdOYW1lIFRoZSBvcmcgbmFtZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgYXN5bmMgY3JlYXRlUmVwb0luT3JnKHsgZGVzY3JpcHRpb24sIGlzUHJpdmF0ZSwgbmFtZSwgb3JnTmFtZSB9OiBUeXBlcy5DcmVhdGVSZXBvUGFyYW1zKSB7XG4gICAgaWYgKCFvcmdOYW1lKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5vY3Rva2l0LnJlc3QucmVwb3NcbiAgICAgIC5jcmVhdGVJbk9yZyh7XG4gICAgICAgIG9yZzogb3JnTmFtZSxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgIGF1dG9faW5pdDogdHJ1ZSxcbiAgICAgICAgcHJpdmF0ZTogaXNQcml2YXRlLFxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiBudWxsKTtcblxuICAgIGlmICghcmVzcG9uc2UpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHJlcG8gPSByZXNwb25zZS5kYXRhIGFzIGFueTtcbiAgICBpZiAocmVwbykgcmVwby5vd25lci51c2VybmFtZSA9IHJlcG8ub3duZXI/LmxvZ2luO1xuXG4gICAgcmV0dXJuIHJlcG87XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgb3JnYW5pemF0aW9uIG1lbWJlcidzIHdyaXR0ZW4gcGVybWlzc2lvblxuICAgKiBTZWUge0BsaW5rIGh0dHBzOi8vb2N0b2tpdC5naXRodWIuaW8vcmVzdC5qcy92MTgjb3Jncy1jaGVjay1tZW1iZXJzaGlwLWZvci11c2VyfVxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3JnTmFtZSBUaGUgcmVwbyBkZXNjcmlwdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gdXNlcm5hbWUgVGhlIHVzZXJuYW1lIG5hbWVcbiAgICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59XG4gICAqL1xuICBhc3luYyBjaGVja09yZ01lbWJlcldyaXRlblBlcm1pc3Npb24oe1xuICAgIG9yZ05hbWU6IG9yZyxcbiAgICB1c2VybmFtZSxcbiAgfTogVHlwZXMuQ2hlY2tPcmdNZW1iZXJXcml0dGVuUGVybWlzc2lvbikge1xuICAgIGlmICghb3JnIHx8ICF1c2VybmFtZSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLm9jdG9raXQucmVzdC5vcmdzXG4gICAgICAuY2hlY2tNZW1iZXJzaGlwRm9yVXNlcih7IG9yZywgdXNlcm5hbWUgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiBudWxsKTtcblxuICAgIGlmICghcmVzcG9uc2UpIHJldHVybiBmYWxzZTtcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAzMDIpIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHJlcG8ncyB1c2VyIHdyaXR0ZW4gcGVybWlzc2lvblxuICAgKiBTZWUge0BsaW5rIGh0dHBzOi8vb2N0b2tpdC5naXRodWIuaW8vcmVzdC5qcy92MTgjcmVwb3MtZ2V0LWNvbGxhYm9yYXRvci1wZXJtaXNzaW9uLWxldmVsfVxuICAgKiBAcGFyYW0ge1N0cmluZ30gcmVwb05hbWUgVGhlIHJlcG8gbmFtZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3duZXJVc2VybmFtZSBUaGUgcmVwbyBvd25lclxuICAgKiBAcGFyYW0ge1N0cmluZ30gdXNlcm5hbWUgVGhlIHVzZXJuYW1lIG5hbWVcbiAgICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59XG4gICAqL1xuICBhc3luYyBjaGVja1JlcG9Vc2VyV3JpdGVuUGVybWlzc2lvbih7XG4gICAgcmVwb05hbWU6IHJlcG8sXG4gICAgb3duZXJVc2VybmFtZTogb3duZXIsXG4gICAgdXNlcm5hbWUsXG4gIH06IFR5cGVzLkNoZWNrUmVwb1VzZXJXcml0dGVuUGVybWlzc2lvbikge1xuICAgIGlmICghcmVwbyB8fCAhb3duZXIgfHwgIXVzZXJuYW1lKSByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMub2N0b2tpdC5yZXN0LnJlcG9zXG4gICAgICAuZ2V0Q29sbGFib3JhdG9yUGVybWlzc2lvbkxldmVsKHsgb3duZXIsIHJlcG8sIHVzZXJuYW1lIH0pXG4gICAgICAuY2F0Y2goKCkgPT4gbnVsbCk7XG5cbiAgICBpZiAoIXJlc3BvbnNlKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgcGVybWlzc2lvbiA9IHJlc3BvbnNlLmRhdGEucGVybWlzc2lvbjtcbiAgICBpZiAocGVybWlzc2lvbiA9PT0gJ2FkbWluJyB8fCBwZXJtaXNzaW9uID09PSAnd3JpdGUnKSByZXR1cm4gdHJ1ZTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlIChpLmUuIGNyZWF0ZSBvciB1cGRhdGUpIGEgZG9jdW1lbnQuXG4gICAqIFNlZSB7QGxpbmsgaHR0cHM6Ly9vY3Rva2l0LmdpdGh1Yi5pby9yZXN0LmpzL3YxOCNyZXBvcy1jcmVhdGUtb3ItdXBkYXRlLWZpbGUtY29udGVudHN9XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvd25lclVzZXJuYW1lIFRoZSBvd25lclxuICAgKiBAcGFyYW0ge1N0cmluZ30gcmVwb05hbWUgVGhlIHJlcG9cbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGggVGhlIHBhdGhcbiAgICogQHBhcmFtIHtTdHJpbmd9IGJyYW5jaCBUaGUgYnJhbmNoXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlIFRoZSBjb21taXQgbWVzc2FnZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICovXG4gIGFzeW5jIGNyZWF0ZUZvbGRlcih7XG4gICAgYnJhbmNoLFxuICAgIG1lc3NhZ2UsXG4gICAgb3duZXJVc2VybmFtZTogb3duZXIsXG4gICAgcGF0aCxcbiAgICByZXBvTmFtZTogcmVwbyxcbiAgfTogVHlwZXMuSVNhdmVEb2N1bWVudCkge1xuICAgIGlmICghcmVwbyB8fCAhb3duZXIpIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgZmlsZW5hbWUgPSAnLmdpdGtlZXAnO1xuICAgIHBhdGggPSBgJHtwYXRofS8ke2ZpbGVuYW1lfWA7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMub2N0b2tpdC5yZXN0LnJlcG9zLmNyZWF0ZU9yVXBkYXRlRmlsZUNvbnRlbnRzKHtcbiAgICAgIG93bmVyLFxuICAgICAgcmVwbyxcbiAgICAgIHBhdGgsXG4gICAgICBtZXNzYWdlLFxuICAgICAgY29udGVudDogdGhpcy5lbmNvZGVDb250ZW50KCcnKSxcbiAgICAgIGJyYW5jaCxcbiAgICB9KTtcblxuICAgIHJldHVybiByZXNwb25zZSBhcyBhbnk7XG4gIH1cblxuICAvKipcbiAgICogU2F2ZSAoaS5lLiBjcmVhdGUgb3IgdXBkYXRlKSBhIGRvY3VtZW50LlxuICAgKiBTZWUge0BsaW5rIGh0dHBzOi8vb2N0b2tpdC5naXRodWIuaW8vcmVzdC5qcy92MTgjcmVwb3MtY3JlYXRlLW9yLXVwZGF0ZS1maWxlLWNvbnRlbnRzfVxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3duZXJVc2VybmFtZSBUaGUgb3duZXJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHJlcG9OYW1lIFRoZSByZXBvXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIFRoZSBwYXRoXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjb250ZW50IFRoZSBjb250ZW50XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBicmFuY2ggVGhlIGJyYW5jaFxuICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSBUaGUgY29tbWl0IG1lc3NhZ2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IFtzaGFdIFRoZSBTSEFcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuICBhc3luYyBzYXZlRG9jdW1lbnQocGFyYW1zOiBUeXBlcy5JU2F2ZURvY3VtZW50KSB7XG4gICAgY29uc3QgeyBicmFuY2gsIGNvbnRlbnQsIG1lc3NhZ2UsIG93bmVyVXNlcm5hbWU6IG93bmVyLCBwYXRoLCByZXBvTmFtZTogcmVwbywgaGFzaCB9ID0gcGFyYW1zO1xuXG4gICAgaWYgKCFyZXBvIHx8ICFvd25lcikgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMub2N0b2tpdC5yZXN0LnJlcG9zXG4gICAgICAuY3JlYXRlT3JVcGRhdGVGaWxlQ29udGVudHMoe1xuICAgICAgICBvd25lcixcbiAgICAgICAgcmVwbyxcbiAgICAgICAgcGF0aCxcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgY29udGVudDogdGhpcy5lbmNvZGVDb250ZW50KGNvbnRlbnQpLFxuICAgICAgICBicmFuY2gsXG4gICAgICAgIHNoYTogaGFzaCxcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4gbnVsbCk7XG5cbiAgICBpZiAoIXJlc3BvbnNlKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IHVwZGF0ZWRSZXNvdXJjZSA9IHsgLi4ucGFyYW1zLCBoYXNoOiByZXNwb25zZS5kYXRhLmNvbnRlbnQ/LnNoYSB9O1xuICAgIHJldHVybiB1cGRhdGVkUmVzb3VyY2U7XG4gIH1cblxuICAvLyBwcml2YXRlIGFzeW5jIGdldExhdGVzdEZpbGVTSEEoeyBvd25lciwgcmVwbywgcGF0aCwgYnJhbmNoIH06IElHZXRMYXRlc3RGaWxlU0hBKSB7XG4gIC8vICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLm9jdG9raXRcbiAgLy8gICAgIC5yZXF1ZXN0KHtcbiAgLy8gICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gIC8vICAgICAgIHVybDogJy9ncmFwaHFsJyxcbiAgLy8gICAgICAgcXVlcnk6IGB7XG4gIC8vICAgICAgICAgcmVwb3NpdG9yeShvd25lcjogXCIke293bmVyfVwiLCBuYW1lOiBcIiR7cmVwb31cIikge1xuICAvLyAgICAgICAgICAgb2JqZWN0KGV4cHJlc3Npb246IFwiJHticmFuY2h9OiR7cGF0aH1cIikge1xuICAvLyAgICAgICAgICAgICAuLi4gb24gQmxvYiB7XG4gIC8vICAgICAgICAgICAgICAgb2lkXG4gIC8vICAgICAgICAgICAgIH1cbiAgLy8gICAgICAgICAgIH1cbiAgLy8gICAgICAgICB9XG4gIC8vICAgICAgIH1gLFxuICAvLyAgICAgfSlcbiAgLy8gICAgIC5jYXRjaCgoKSA9PiBudWxsKTtcblxuICAvLyAgIGlmICghcmVzcG9uc2UpIHJldHVybiBudWxsO1xuXG4gIC8vICAgY29uc3Qge1xuICAvLyAgICAgZGF0YToge1xuICAvLyAgICAgICBkYXRhOiB7XG4gIC8vICAgICAgICAgcmVwb3NpdG9yeTogeyBvYmplY3Q6IHJlc3VsdCB9LFxuICAvLyAgICAgICB9LFxuICAvLyAgICAgfSxcbiAgLy8gICB9ID0gcmVzcG9uc2U7XG5cbiAgLy8gICBjb25zdCBoYXNoID0gcmVzdWx0ID8gcmVzdWx0Lm9pZCA6IG51bGw7XG4gIC8vICAgcmV0dXJuIGhhc2g7XG4gIC8vIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgZm9yayBmb3IgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlci5cbiAgICogU2VlIHtAbGluayBodHRwczovL29jdG9raXQuZ2l0aHViLmlvL3Jlc3QuanMvdjE4I3JlcG9zLWNyZWF0ZS1mb3JrfVxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3duZXJVc2VybmFtZSBUaGUgb3duZXIgdXNlcm5hbWVcbiAgICogQHBhcmFtIHtTdHJpbmd9IHJlcG9OYW1lIFRoZSByZXBvIG5hbWVcbiAgICogQHBhcmFtIHtTdHJpbmd9IG9yZ05hbWUgVGhlIG9yZ2FuaXphdGlvbiBuYW1lXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKi9cbiAgYXN5bmMgY3JlYXRlRm9yayh7IG93bmVyVXNlcm5hbWUsIHJlcG9OYW1lLCBvcmdOYW1lIH06IFR5cGVzLklDcmVhdGVGb3JrKSB7XG4gICAgaWYgKCFvd25lclVzZXJuYW1lIHx8ICFyZXBvTmFtZSkgdGhyb3cgbmV3IEVycm9yKCdvd25lciBhbmQgcmVwb3NpdG9yeSBhcmUgbWlzc2luZycpOyAvL3JldHVybiBudWxsO1xuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLm9jdG9raXQucmVwb3NcbiAgICAgIC5jcmVhdGVGb3JrKHsgb3duZXI6IG93bmVyVXNlcm5hbWUsIHJlcG86IHJlcG9OYW1lLCBvcmdhbml6YXRpb246IG9yZ05hbWUgfSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcbiAgICAgIH0pO1xuXG4gICAgY29uc3QgZm9yayA9IHJlc3BvbnNlLmRhdGEgYXMgdW5rbm93biBhcyBULlJlcG9zaXRvcnk7XG4gICAgcmV0dXJuIGZvcms7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHNpbmdsZSByZXBvc2l0b3J5IGJyYW5jaFxuICAgKiBTZWUge0BsaW5rIGh0dHBzOi8vb2N0b2tpdC5naXRodWIuaW8vcmVzdC5qcy92MTgjcmVwb3MtZ2V0LWJyYW5jaH1cbiAgICogQHBhcmFtIHtTdHJpbmd9IGJyYW5jaCBUaGUgYnJhbmNoXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvd25lclVzZXJuYW1lIFRoZSBvd25lclxuICAgKiBAcGFyYW0ge1N0cmluZ30gcmVwb05hbWUgVGhlIHJlcG9zaXRvcnlcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuICBhc3luYyBnZXRCcmFuY2goeyBicmFuY2gsIG93bmVyVXNlcm5hbWUsIHJlcG9OYW1lIH06IFR5cGVzLklHZXRCcmFuY2gpIHtcbiAgICBpZiAoIW93bmVyVXNlcm5hbWUgfHwgIXJlcG9OYW1lKSByZXR1cm4gbnVsbDtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMub2N0b2tpdC5yZXN0LnJlcG9zXG4gICAgICAuZ2V0QnJhbmNoKHsgb3duZXI6IG93bmVyVXNlcm5hbWUsIHJlcG86IHJlcG9OYW1lLCBicmFuY2ggfSlcbiAgICAgIC5jYXRjaCgoKSA9PiBudWxsKTtcblxuICAgIGlmICghcmVzcG9uc2UpIHJldHVybiBudWxsO1xuICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGJyYW5jaCBleGlzdHNcbiAgICogQHBhcmFtIHtTdHJpbmd9IGJyYW5jaCBUaGUgYnJhbmNoXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvd25lclVzZXJuYW1lIFRoZSBvd25lclxuICAgKiBAcGFyYW0ge1N0cmluZ30gcmVwb05hbWUgVGhlIHJlcG9zaXRvcnlcbiAgICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59XG4gICAqL1xuICBhc3luYyBjaGVja0ZvckJyYW5jaCh7IGJyYW5jaCwgb3duZXJVc2VybmFtZSwgcmVwb05hbWUgfTogVHlwZXMuSUdldEJyYW5jaCkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5nZXRCcmFuY2goeyBicmFuY2gsIG93bmVyVXNlcm5hbWUsIHJlcG9OYW1lIH0pO1xuICAgIGlmICghcmVzcG9uc2UpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgbmV3IGJyYW5jaCBpbiB0aGUgcmVwb3NpdG9yeS5cbiAgICogU2VlIHtAbGluayBodHRwczovL29jdG9raXQuZ2l0aHViLmlvL3Jlc3QuanMvdjE4I3JlcG9zLWNyZWF0ZS1mb3JrfVxuICAgKiBAcGFyYW0ge1N0cmluZ30gYnJhbmNoT3JpZ2luIFRoZSBicmFuY2ggb3JpZ2luXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBicmFuY2hUYXJnZXQgVGhlIG5ldyBicmFuY2hcbiAgICogQHBhcmFtIHtTdHJpbmd9IHJlcG9OYW1lIFRoZSByZXBvXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvd25lclVzZXJuYW1lIFRoZSBvd25lciB1c2VybmFtZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICovXG4gIGFzeW5jIGNyZWF0ZUJyYW5jaCh7IG93bmVyVXNlcm5hbWUsIHJlcG9OYW1lLCBicmFuY2hPcmlnaW4sIGJyYW5jaFRhcmdldCB9OiBUeXBlcy5JQ3JlYXRlQnJhbmNoKSB7XG4gICAgaWYgKCFyZXBvTmFtZSB8fCAhb3duZXJVc2VybmFtZSkgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCBvcmlnaW5CcmFuY2ggPSBhd2FpdCB0aGlzLmdldEJyYW5jaCh7XG4gICAgICBvd25lclVzZXJuYW1lLFxuICAgICAgcmVwb05hbWUsXG4gICAgICBicmFuY2g6IGJyYW5jaE9yaWdpbixcbiAgICB9KTtcblxuICAgIGlmICghb3JpZ2luQnJhbmNoKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5vY3Rva2l0LnJlc3QuZ2l0XG4gICAgICAuY3JlYXRlUmVmKHtcbiAgICAgICAgb3duZXI6IG93bmVyVXNlcm5hbWUsXG4gICAgICAgIHJlcG86IHJlcG9OYW1lLFxuICAgICAgICByZWY6IGByZWZzL2hlYWRzLyR7YnJhbmNoVGFyZ2V0fWAsXG4gICAgICAgIHNoYTogb3JpZ2luQnJhbmNoLmNvbW1pdC5zaGEsXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IG51bGwpO1xuXG4gICAgaWYgKCFyZXNwb25zZSkgcmV0dXJuIG51bGw7XG5cbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBmb3Igb3BlbiBwdWxsIHJlcXVlc3RzXG4gICAqIFNlZSB7QGxpbmsgaHR0cHM6Ly9vY3Rva2l0LmdpdGh1Yi5pby9yZXN0LmpzL3YxOCNzZWFyY2gtaXNzdWVzLWFuZC1wdWxsLXJlcXVlc3RzfVxuICAgKiBAcGFyYW0ge1N0cmluZ30gYnJhbmNoIFRoZSBicmFuY2ggb3JpZ2luXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvd25lclVzZXJuYW1lIFRoZSBvbndlciB1c2VybmFtZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gcmVwb05hbWUgVGhlIHJlcG9cbiAgICogQHBhcmFtIHtTdHJpbmd9IHRpdGxlIFRoZSB0aXRsZSBvZiB0aGUgcHVsbCByZXF1ZXN0XG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyBjaGVja0ZvclB1bGxSZXF1ZXN0KHsgb3duZXJVc2VybmFtZSwgcmVwb05hbWUsIHRpdGxlIH06IElDaGVja0ZvclB1bGxSZXF1ZXN0KSB7XG4gICAgY29uc3QgcXVlcnkgPSBgc3RhdGU6b3BlbiB0eXBlOnByIHJlcG86JHtvd25lclVzZXJuYW1lfS8ke3JlcG9OYW1lfSAke3RpdGxlfSBpbjp0aXRsZWA7XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLm9jdG9raXQucmVzdC5zZWFyY2guaXNzdWVzQW5kUHVsbFJlcXVlc3RzKHsgcTogcXVlcnkgfSk7XG4gICAgcmV0dXJuIHJlc3VsdC5kYXRhLnRvdGFsX2NvdW50ID4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlIChpLmUuIGNyZWF0ZSkgYSBkb2N1bWVudCBhcyBhIHB1bGwgcmVxdWVzdC5cbiAgICogU2VlIHtAbGluayBodHRwczovL29jdG9raXQuZ2l0aHViLmlvL3Jlc3QuanMvdjE4I3B1bGxzLWNyZWF0ZX1cbiAgICogQHBhcmFtIHtTdHJpbmd9IGJyYW5jaE9yaWdpbiBUaGUgYnJhbmNoIG9yaWdpblxuICAgKiBAcGFyYW0ge1N0cmluZ30gYnJhbmNoVGFyZ2V0IGhlIGJyYW5jaCBIZWFkXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvd25lclVzZXJuYW1lIFRoZSBvbndlciB1c2VybmFtZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gcmVwb3NpdG9yeSBUaGUgcmVwb3NpdG9yeVxuICAgKiBAcGFyYW0ge1N0cmluZ30gdGl0bGUgVGhlIHRpdGxlIG9mIHRoZSBwdWxsIHJlcXVlc3RcbiAgICogQHJldHVybnMge1Byb21pc2U8VHlwZXMuQ3JlYXRlUHJSZXNwb25zZT59XG4gICAqL1xuICBhc3luYyBjcmVhdGVQdWxsUmVxdWVzdCh7XG4gICAgYnJhbmNoT3JpZ2luLFxuICAgIGJyYW5jaEhlYWQsXG4gICAgb3duZXJVc2VybmFtZSxcbiAgICBvcmlnaW4sXG4gICAgdGl0bGUsXG4gIH06IFR5cGVzLklDcmVhdGVQclBhcmFtcykge1xuICAgIC8vIHRoZXJlIGNhbiBiZSBvbmx5IG9uZSBQUiBwZXIgYnJhbmNoICovXG4gICAgY29uc3QgZG9lc1B1bGxSZXF1ZXN0RXhpc3QgPSBhd2FpdCB0aGlzLmNoZWNrRm9yUHVsbFJlcXVlc3Qoe1xuICAgICAgYnJhbmNoOiBicmFuY2hIZWFkLFxuICAgICAgb3duZXJVc2VybmFtZSxcbiAgICAgIHJlcG9OYW1lOiBvcmlnaW4ubmFtZSxcbiAgICAgIHRpdGxlLFxuICAgIH0pO1xuXG4gICAgaWYgKGRvZXNQdWxsUmVxdWVzdEV4aXN0KSByZXR1cm4gJ2V4aXN0cyc7XG5cbiAgICBjb25zdCBwdWxsUmVxdWVzdCA9IGF3YWl0IHRoaXMub2N0b2tpdC5yZXN0LnB1bGxzXG4gICAgICAuY3JlYXRlKHtcbiAgICAgICAgYmFzZTogYnJhbmNoT3JpZ2luLFxuICAgICAgICBoZWFkOiBicmFuY2hIZWFkLFxuICAgICAgICBvd25lcjogb3duZXJVc2VybmFtZSxcbiAgICAgICAgcmVwbzogb3JpZ2luLm5hbWUsXG4gICAgICAgIHRpdGxlLFxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiBudWxsKTtcblxuICAgIGlmICghcHVsbFJlcXVlc3QpIHJldHVybiBudWxsO1xuXG4gICAgcmV0dXJuICdjcmVhdGVkJztcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBwdWxsIHJlcXVlc3QgZnJvbSBhIGZvcmsuXG4gICAqIFNlZSB7QGxpbmsgaHR0cHM6Ly9vY3Rva2l0LmdpdGh1Yi5pby9yZXN0LmpzL3YxOCNwdWxscy1jcmVhdGV9XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBmb3JrIFRoZSBmb3JrZWQgcmVwb3NpdG9yeVxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3JpZ2luIHRoZSBvcmlnaW4gcmVwb3NpdG9yeVxuICAgKiBAcGFyYW0ge1N0cmluZ30gdGl0bGUgVGhlIHRpdGxlIG9mIHRoZSBwdWxsIHJlcXVlc3RcbiAgICogQHJldHVybnMge1Byb21pc2U8VHlwZXMuQ3JlYXRlUHJSZXNwb25zZT59XG4gICAqL1xuICBhc3luYyBjcmVhdGVQdWxsUmVxdWVzdEZyb21Gb3JrKHsgZm9yaywgb3JpZ2luLCB0aXRsZSB9OiBUeXBlcy5JQ3JlYXRlUHJGcm9tRm9ya1BhcmFtcykge1xuICAgIGNvbnN0IGJhc2UgPSBvcmlnaW4uZGVmYXVsdF9icmFuY2g7XG4gICAgY29uc3QgaGVhZCA9IGAke2Zvcmsub3duZXIudXNlcm5hbWV9OiR7Zm9yay5kZWZhdWx0X2JyYW5jaH1gO1xuXG4gICAgLy8gdGhlcmUgY2FuIGJlIG9ubHkgb25lIFBSIHBlciBicmFuY2ggKi9cbiAgICBjb25zdCBkb2VzUHVsbFJlcXVlc3RFeGlzdCA9IGF3YWl0IHRoaXMuY2hlY2tGb3JQdWxsUmVxdWVzdCh7XG4gICAgICBicmFuY2g6IGhlYWQsXG4gICAgICBvd25lclVzZXJuYW1lOiBvcmlnaW4ub3duZXIudXNlcm5hbWUsXG4gICAgICByZXBvTmFtZTogb3JpZ2luLm5hbWUsXG4gICAgICB0aXRsZSxcbiAgICB9KTtcblxuICAgIGlmIChkb2VzUHVsbFJlcXVlc3RFeGlzdCkgcmV0dXJuICdleGlzdHMnO1xuXG4gICAgY29uc3QgcHVsbFJlcXVlc3QgPSBhd2FpdCB0aGlzLm9jdG9raXQucmVzdC5wdWxsc1xuICAgICAgLmNyZWF0ZSh7IG93bmVyOiBvcmlnaW4ub3duZXIudXNlcm5hbWUsIHJlcG86IG9yaWdpbi5uYW1lLCB0aXRsZSwgaGVhZCwgYmFzZSB9KVxuICAgICAgLmNhdGNoKCgpID0+IG51bGwpO1xuXG4gICAgaWYgKCFwdWxsUmVxdWVzdCkgcmV0dXJuIG51bGw7XG5cbiAgICByZXR1cm4gJ2NyZWF0ZWQnO1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=