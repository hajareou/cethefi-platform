(self["webpackChunkLeafwriter"] = self["webpackChunkLeafwriter"] || []).push([[977],{

/***/ 75977:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Wikidata)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67620);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var wikidata_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(30423);
/* harmony import */ var wikidata_sdk__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(wikidata_sdk__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(53768);



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
      _utilities__WEBPACK_IMPORTED_MODULE_2__/* .log.warn */ .cM.warn(errorMsg);
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


/***/ }),

/***/ 5437:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const toDateObject = __webpack_require__(74320);
const helpers = {};
helpers.isNumericId = (id) => /^[1-9][0-9]*$/.test(id);
helpers.isEntityId = (id) => /^((Q|P|L)[1-9][0-9]*|L[1-9][0-9]*-(F|S)[1-9][0-9]*)$/.test(id);
helpers.isEntitySchemaId = (id) => /^E[1-9][0-9]*$/.test(id);
helpers.isItemId = (id) => /^Q[1-9][0-9]*$/.test(id);
helpers.isPropertyId = (id) => /^P[1-9][0-9]*$/.test(id);
helpers.isLexemeId = (id) => /^L[1-9][0-9]*$/.test(id);
helpers.isFormId = (id) => /^L[1-9][0-9]*-F[1-9][0-9]*$/.test(id);
helpers.isSenseId = (id) => /^L[1-9][0-9]*-S[1-9][0-9]*$/.test(id);
helpers.isGuid = (guid) => /^((Q|P|L)[1-9][0-9]*|L[1-9][0-9]*-(F|S)[1-9][0-9]*)\$[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(guid);
helpers.isHash = (hash) => /^[0-9a-f]{40}$/.test(hash);
helpers.isPropertyClaimsId = (id) => {
  const [entityId, propertyId] = id.split("#");
  return helpers.isEntityId(entityId) && helpers.isPropertyId(propertyId);
};
helpers.isRevisionId = (id) => /^\d+$/.test(id);
helpers.isEntityPageTitle = (title) => {
  if (typeof title !== "string")
    return false;
  let [namespace, id] = title.split(":");
  if (namespace && id) {
    return isEntityNamespace(namespace) && helpers[`is${namespace}Id`](id);
  } else {
    id = namespace;
    return helpers.isItemId(id);
  }
};
const entityNamespaces = ["Item", "Property", "Lexeme"];
const isEntityNamespace = (str) => entityNamespaces.includes(str);
const isNonNestedEntityId = (id) => /^(Q|P|L)[1-9][0-9]*$/.test(id);
helpers.getNumericId = (id) => {
  if (!isNonNestedEntityId(id))
    throw new Error(`invalid entity id: ${id}`);
  return id.replace(/^(Q|P|L)/, "");
};
helpers.wikibaseTimeToDateObject = toDateObject;
const bestEffort = (fn) => (value) => {
  try {
    return fn(value);
  } catch (err) {
    value = value.time || value;
    const sign = value[0];
    let [yearMonthDay, withinDay] = value.slice(1).split("T");
    yearMonthDay = yearMonthDay.replace(/-00/g, "-01");
    return `${sign}${yearMonthDay}T${withinDay}`;
  }
};
const toEpochTime = (wikibaseTime) => toDateObject(wikibaseTime).getTime();
const toISOString = (wikibaseTime) => toDateObject(wikibaseTime).toISOString();
const toSimpleDay = (wikibaseTime) => {
  if (typeof wikibaseTime === "object") {
    const { time, precision } = wikibaseTime;
    if (precision === 9)
      wikibaseTime = time.replace("-01-01T", "-00-00T");
    else if (precision === 10)
      wikibaseTime = time.replace("-01T", "-00T");
    else
      wikibaseTime = time;
  }
  return wikibaseTime.split("T")[0].replace(/^\+/, "").replace(/^(-?)0+/, "$1").replace(/-00$/, "").replace(/-00$/, "");
};
helpers.wikibaseTimeToEpochTime = bestEffort(toEpochTime);
helpers.wikibaseTimeToISOString = bestEffort(toISOString);
helpers.wikibaseTimeToSimpleDay = bestEffort(toSimpleDay);
helpers.getImageUrl = (filename, width) => {
  let url = `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}`;
  if (typeof width === "number")
    url += `?width=${width}`;
  return url;
};
helpers.getEntityIdFromGuid = (guid) => {
  const parts = guid.split(/[$-]/);
  if (parts.length === 6) {
    return parts[0].toUpperCase();
  } else if (parts.length === 7) {
    return parts.slice(0, 2).join("-").toUpperCase();
  } else {
    throw new Error(`invalid guid: ${guid}`);
  }
};
module.exports = helpers;


/***/ }),

/***/ 61091:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { wikibaseTimeToISOString, wikibaseTimeToEpochTime, wikibaseTimeToSimpleDay } = __webpack_require__(5437);
const simple = (datavalue) => datavalue.value;
const monolingualtext = (datavalue, options) => {
  return options.keepRichValues ? datavalue.value : datavalue.value.text;
};
const entity = (datavalue, options) => prefixedId(datavalue, options.entityPrefix);
const entityLetter = {
  item: "Q",
  lexeme: "L",
  property: "P"
};
const prefixedId = (datavalue, prefix) => {
  const { value } = datavalue;
  const id = value.id || entityLetter[value["entity-type"]] + value["numeric-id"];
  return typeof prefix === "string" ? `${prefix}:${id}` : id;
};
const quantity = (datavalue, options) => {
  const { value } = datavalue;
  const amount = parseFloat(value.amount);
  if (options.keepRichValues) {
    const richValue = {
      amount: parseFloat(value.amount),
      unit: value.unit.replace(/^https?:\/\/.*\/entity\//, "")
    };
    if (value.upperBound != null)
      richValue.upperBound = parseFloat(value.upperBound);
    if (value.lowerBound != null)
      richValue.lowerBound = parseFloat(value.lowerBound);
    return richValue;
  } else {
    return amount;
  }
};
const coordinate = (datavalue, options) => {
  if (options.keepRichValues) {
    return datavalue.value;
  } else {
    return [datavalue.value.latitude, datavalue.value.longitude];
  }
};
const time = (datavalue, options) => {
  let timeValue;
  if (typeof options.timeConverter === "function") {
    timeValue = options.timeConverter(datavalue.value);
  } else {
    timeValue = getTimeConverter(options.timeConverter)(datavalue.value);
  }
  if (options.keepRichValues) {
    const { timezone, before, after, precision, calendarmodel } = datavalue.value;
    return { time: timeValue, timezone, before, after, precision, calendarmodel };
  } else {
    return timeValue;
  }
};
const getTimeConverter = (key = "iso") => {
  const converter = timeConverters[key];
  if (!converter)
    throw new Error(`invalid converter key: ${JSON.stringify(key).substring(0, 100)}`);
  return converter;
};
const timeConverters = {
  iso: wikibaseTimeToISOString,
  epoch: wikibaseTimeToEpochTime,
  "simple-day": wikibaseTimeToSimpleDay,
  none: (wikibaseTime) => wikibaseTime.time || wikibaseTime
};
const parsers = {
  commonsMedia: simple,
  "external-id": simple,
  "geo-shape": simple,
  "globe-coordinate": coordinate,
  math: simple,
  monolingualtext,
  "musical-notation": simple,
  quantity,
  string: simple,
  "tabular-data": simple,
  time,
  url: simple,
  "wikibase-entityid": entity,
  "wikibase-form": entity,
  "wikibase-item": entity,
  "wikibase-lexeme": entity,
  "wikibase-property": entity,
  "wikibase-sense": entity
};
module.exports = {
  parsers,
  parse: (datatype, datavalue, options, claimId) => {
    datatype = datatype || datavalue.type;
    datatype = datatype.replace(" ", "-");
    try {
      return parsers[datatype](datavalue, options);
    } catch (err) {
      if (err.message === "parsers[datatype] is not a function") {
        err.message = `${datatype} claim parser isn't implemented
        Claim id: ${claimId}
        Please report to https://github.com/maxlath/wikibase-sdk/issues`;
      }
      throw err;
    }
  }
};


/***/ }),

/***/ 47622:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { simplifyEntity } = __webpack_require__(60059);
const wb = {
  entities: (res) => {
    res = res.body || res;
    const { entities } = res;
    Object.keys(entities).forEach((entityId) => {
      entities[entityId] = simplifyEntity(entities[entityId]);
    });
    return entities;
  },
  pagesTitles: (res) => {
    res = res.body || res;
    return res.query.search.map((result) => result.title);
  }
};
module.exports = {
  wb,
  wd: wb
};


/***/ }),

/***/ 21145:
/***/ ((module) => {

const truthyPropertyClaims = (propClaims) => {
  const aggregate = propClaims.reduce(aggregatePerRank, {});
  return aggregate.preferred || aggregate.normal || [];
};
const nonDeprecatedPropertyClaims = (propClaims) => {
  return propClaims.filter((claim) => claim.rank !== "deprecated");
};
const aggregatePerRank = (aggregate, claim) => {
  const { rank } = claim;
  aggregate[rank] || (aggregate[rank] = []);
  aggregate[rank].push(claim);
  return aggregate;
};
const truthyClaims = (claims) => {
  const truthClaimsOnly = {};
  Object.keys(claims).forEach((property) => {
    truthClaimsOnly[property] = truthyPropertyClaims(claims[property]);
  });
  return truthClaimsOnly;
};
module.exports = { truthyClaims, truthyPropertyClaims, nonDeprecatedPropertyClaims };


/***/ }),

/***/ 65298:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { labels, descriptions, aliases, lemmas, glosses } = __webpack_require__(24354);
const {
  simplifyClaim: claim,
  simplifyPropertyClaims: propertyClaims,
  simplifyClaims: claims,
  simplifyQualifier: qualifier,
  simplifyPropertyQualifiers: propertyQualifiers,
  simplifyQualifiers: qualifiers,
  simplifyReferences: references
} = __webpack_require__(72103);
const { simplifyForm: form, simplifyForms: forms } = __webpack_require__(11852);
const { simplifySense: sense, simplifySenses: senses } = __webpack_require__(78939);
const sitelinks = __webpack_require__(18436);
const sparqlResults = __webpack_require__(50825);
module.exports = {
  labels,
  descriptions,
  aliases,
  claim,
  propertyClaims,
  claims,
  qualifier,
  propertyQualifiers,
  qualifiers,
  references,
  sitelinks,
  snak: claim,
  propertySnaks: propertyClaims,
  snaks: claims,
  lemmas,
  glosses,
  form,
  forms,
  sense,
  senses,
  sparqlResults
};


/***/ }),

/***/ 72103:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { parse: parseClaim } = __webpack_require__(61091);
const { uniq } = __webpack_require__(81948);
const { truthyPropertyClaims, nonDeprecatedPropertyClaims } = __webpack_require__(21145);
const simplifyClaims = (claims, ...options) => {
  const { propertyPrefix } = parseOptions(options);
  const simpleClaims = {};
  for (let id in claims) {
    const propClaims = claims[id];
    if (propertyPrefix) {
      id = propertyPrefix + ":" + id;
    }
    simpleClaims[id] = simplifyPropertyClaims(propClaims, ...options);
  }
  return simpleClaims;
};
const simplifyPropertyClaims = (propClaims, ...options) => {
  if (propClaims == null || propClaims.length === 0)
    return [];
  const { keepNonTruthy, keepNonDeprecated, areSubSnaks } = parseOptions(options);
  if (keepNonDeprecated) {
    propClaims = nonDeprecatedPropertyClaims(propClaims);
  } else if (!(keepNonTruthy || areSubSnaks)) {
    propClaims = truthyPropertyClaims(propClaims);
  }
  propClaims = propClaims.map((claim) => simplifyClaim(claim, ...options)).filter(defined);
  if (propClaims[0] && typeof propClaims[0] !== "object") {
    return uniq(propClaims);
  } else {
    return propClaims;
  }
};
const defined = (obj) => obj !== void 0;
const simplifyClaim = (claim, ...options) => {
  options = parseOptions(options);
  const { keepQualifiers, keepReferences, keepIds, keepHashes, keepTypes, keepSnaktypes, keepRanks } = parseKeepOptions(options);
  const { mainsnak, rank } = claim;
  let value, datatype, datavalue, snaktype, isQualifierSnak, isReferenceSnak;
  if (mainsnak) {
    datatype = mainsnak.datatype;
    datavalue = mainsnak.datavalue;
    snaktype = mainsnak.snaktype;
  } else {
    datavalue = claim.datavalue;
    datatype = claim.datatype;
    snaktype = claim.snaktype;
    if (claim.hash)
      isQualifierSnak = true;
    else
      isReferenceSnak = true;
  }
  if (datavalue) {
    value = parseClaim(datatype, datavalue, options, claim.id);
  } else {
    if (snaktype === "somevalue")
      value = options.somevalueValue;
    else if (snaktype === "novalue")
      value = options.novalueValue;
    else
      throw new Error("no datavalue or special snaktype found");
  }
  if (isQualifierSnak) {
    if (!(keepHashes || keepTypes || keepSnaktypes))
      return value;
    const valueObj2 = { value };
    if (keepHashes)
      valueObj2.hash = claim.hash;
    if (keepTypes)
      valueObj2.type = datatype;
    if (keepSnaktypes)
      valueObj2.snaktype = snaktype;
    return valueObj2;
  }
  if (isReferenceSnak) {
    if (!keepTypes)
      return value;
    return { type: datatype, value };
  }
  if (!(keepQualifiers || keepReferences || keepIds || keepTypes || keepSnaktypes || keepRanks)) {
    return value;
  }
  const valueObj = { value };
  if (keepTypes)
    valueObj.type = datatype;
  if (keepSnaktypes)
    valueObj.snaktype = snaktype;
  if (keepRanks)
    valueObj.rank = rank;
  const subSnaksOptions = getSubSnakOptions(options);
  subSnaksOptions.keepHashes = keepHashes;
  if (keepQualifiers) {
    valueObj.qualifiers = simplifyQualifiers(claim.qualifiers, subSnaksOptions);
  }
  if (keepReferences) {
    claim.references = claim.references || [];
    valueObj.references = simplifyReferences(claim.references, subSnaksOptions);
  }
  if (keepIds)
    valueObj.id = claim.id;
  return valueObj;
};
const parseOptions = (options) => {
  if (options == null)
    return {};
  if (options[0] && typeof options[0] === "object")
    return options[0];
  const [entityPrefix, propertyPrefix, keepQualifiers] = options;
  return { entityPrefix, propertyPrefix, keepQualifiers };
};
const simplifyQualifiers = (qualifiers, options) => {
  return simplifyClaims(qualifiers, getSubSnakOptions(options));
};
const simplifyPropertyQualifiers = (propertyQualifiers, options) => {
  return simplifyPropertyClaims(propertyQualifiers, getSubSnakOptions(options));
};
const simplifyReferences = (references, options) => {
  return references.map((refRecord) => {
    return simplifyReferenceRecord(refRecord, options);
  });
};
const simplifyReferenceRecord = (refRecord, options) => {
  const subSnaksOptions = getSubSnakOptions(options);
  const snaks = simplifyClaims(refRecord.snaks, subSnaksOptions);
  if (subSnaksOptions.keepHashes)
    return { snaks, hash: refRecord.hash };
  else
    return snaks;
};
const getSubSnakOptions = (options = {}) => {
  if (options.areSubSnaks)
    return options;
  else
    return Object.assign({}, options, { areSubSnaks: true });
};
const keepOptions = ["keepQualifiers", "keepReferences", "keepIds", "keepHashes", "keepTypes", "keepSnaktypes", "keepRanks", "keepRichValues"];
const parseKeepOptions = (options) => {
  if (options.keepAll) {
    keepOptions.forEach((optionName) => {
      if (options[optionName] == null)
        options[optionName] = true;
    });
  }
  return options;
};
module.exports = {
  simplifyClaims,
  simplifyPropertyClaims,
  simplifyClaim,
  simplifyQualifiers,
  simplifyPropertyQualifiers,
  simplifyQualifier: simplifyClaim,
  simplifyReferences
};


/***/ }),

/***/ 60059:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const simplify = __webpack_require__(65298);
const simplifyEntity = (entity, options) => {
  const { type } = entity;
  const simplified = {
    id: entity.id,
    type,
    modified: entity.modified
  };
  if (entity.datatype)
    simplified.datatype = entity.datatype;
  if (type === "item") {
    simplifyIfDefined(entity, simplified, "labels");
    simplifyIfDefined(entity, simplified, "descriptions");
    simplifyIfDefined(entity, simplified, "aliases");
    simplifyIfDefined(entity, simplified, "claims", options);
    simplifyIfDefined(entity, simplified, "sitelinks", options);
  } else if (type === "property") {
    simplified.datatype = entity.datatype;
    simplifyIfDefined(entity, simplified, "labels");
    simplifyIfDefined(entity, simplified, "descriptions");
    simplifyIfDefined(entity, simplified, "aliases");
    simplifyIfDefined(entity, simplified, "claims", options);
  } else if (type === "lexeme") {
    simplifyIfDefined(entity, simplified, "lemmas");
    simplified.lexicalCategory = entity.lexicalCategory;
    simplified.language = entity.language;
    simplifyIfDefined(entity, simplified, "claims", options);
    simplifyIfDefined(entity, simplified, "forms", options);
    simplifyIfDefined(entity, simplified, "senses", options);
  }
  return simplified;
};
const simplifyIfDefined = (entity, simplified, attribute, options) => {
  if (entity[attribute] != null) {
    simplified[attribute] = simplify[attribute](entity[attribute], options);
  }
};
const simplifyEntities = (entities, options = {}) => {
  if (entities.entities)
    entities = entities.entities;
  const { entityPrefix } = options;
  return Object.keys(entities).reduce((obj, key) => {
    const entity = entities[key];
    if (entityPrefix)
      key = `${entityPrefix}:${key}`;
    obj[key] = simplifyEntity(entity, options);
    return obj;
  }, {});
};
simplify.entity = simplifyEntity;
simplify.entities = simplifyEntities;
module.exports = { simplifyEntity, simplifyEntities };


/***/ }),

/***/ 11852:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { isFormId } = __webpack_require__(5437);
const { representations: simplifyRepresentations } = __webpack_require__(24354);
const { simplifyClaims } = __webpack_require__(72103);
const simplifyForm = (form, options) => {
  const { id, representations, grammaticalFeatures, claims } = form;
  if (!isFormId(id))
    throw new Error("invalid form object");
  return {
    id,
    representations: simplifyRepresentations(representations),
    grammaticalFeatures,
    claims: simplifyClaims(claims, options)
  };
};
const simplifyForms = (forms, options) => forms.map((form) => simplifyForm(form, options));
module.exports = { simplifyForm, simplifyForms };


/***/ }),

/***/ 78939:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { isSenseId } = __webpack_require__(5437);
const { glosses: simplifyGlosses } = __webpack_require__(24354);
const { simplifyClaims } = __webpack_require__(72103);
const simplifySense = (sense, options) => {
  const { id, glosses, claims } = sense;
  if (!isSenseId(id))
    throw new Error("invalid sense object");
  return {
    id,
    glosses: simplifyGlosses(glosses),
    claims: simplifyClaims(claims, options)
  };
};
const simplifySenses = (senses, options) => senses.map((sense) => simplifySense(sense, options));
module.exports = { simplifySense, simplifySenses };


/***/ }),

/***/ 18436:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { getSitelinkUrl } = __webpack_require__(2156);
module.exports = (sitelinks, options = {}) => {
  const { addUrl } = options;
  return Object.keys(sitelinks).reduce(aggregateValues(sitelinks, addUrl), {});
};
const aggregateValues = (sitelinks, addUrl) => (index, key) => {
  if (sitelinks[key] == null) {
    index[key] = sitelinks[key];
    return index;
  }
  const { title } = sitelinks[key];
  if (addUrl) {
    index[key] = { title, url: getSitelinkUrl(key, title) };
  } else {
    index[key] = title;
  }
  return index;
};


/***/ }),

/***/ 50825:
/***/ ((module) => {

module.exports = (input, options = {}) => {
  if (typeof input === "string")
    input = JSON.parse(input);
  const { vars } = input.head;
  const results = input.results.bindings;
  if (vars.length === 1 && options.minimize === true) {
    const varName = vars[0];
    return results.map((result) => parseValue(result[varName])).filter((result) => result != null);
  }
  const { richVars, associatedVars, standaloneVars } = identifyVars(vars);
  return results.map(getSimplifiedResult(richVars, associatedVars, standaloneVars));
};
const parseValue = (valueObj) => {
  if (!valueObj)
    return;
  let { datatype } = valueObj;
  datatype = datatype && datatype.replace("http://www.w3.org/2001/XMLSchema#", "");
  const parser = parsers[valueObj.type] || getDatatypesParsers(datatype);
  return parser(valueObj);
};
const parsers = {
  uri: (valueObj) => parseUri(valueObj.value),
  bnode: () => null
};
const numberParser = (valueObj) => parseFloat(valueObj.value);
const getDatatypesParsers = (datatype) => {
  datatype = datatype && datatype.replace("http://www.w3.org/2001/XMLSchema#", "");
  return datatypesParsers[datatype] || passValue;
};
const datatypesParsers = {
  decimal: numberParser,
  integer: numberParser,
  float: numberParser,
  double: numberParser,
  boolean: (valueObj) => valueObj.value === "true"
};
const passValue = (valueObj) => valueObj.value;
const parseUri = (uri) => {
  if (uri.match(/http.*\/entity\/statement\//)) {
    return convertStatementUriToGuid(uri);
  }
  return uri.replace(/^https?:\/\/.*\/entity\//, "").replace(/^https?:\/\/.*\/prop\/direct\//, "");
};
const convertStatementUriToGuid = (uri) => {
  uri = uri.replace(/^https?:\/\/.*\/entity\/statement\//, "");
  const parts = uri.split("-");
  return parts[0] + "$" + parts.slice(1).join("-");
};
const identifyVars = (vars) => {
  let richVars = vars.filter((varName) => vars.some(isAssociatedVar(varName)));
  richVars = richVars.filter((richVar) => {
    return !richVars.some((otherRichVar) => {
      return richVar !== otherRichVar && richVar.startsWith(otherRichVar);
    });
  });
  const associatedVarPattern = new RegExp(`^(${richVars.join("|")})[A-Z]`);
  const associatedVars = vars.filter((varName) => associatedVarPattern.test(varName));
  const standaloneVars = vars.filter((varName) => {
    return !richVars.includes(varName) && !associatedVarPattern.test(varName);
  });
  return { richVars, associatedVars, standaloneVars };
};
const isAssociatedVar = (varNameA) => {
  const pattern = new RegExp(`^${varNameA}[A-Z]\\w+`);
  return pattern.test.bind(pattern);
};
const getSimplifiedResult = (richVars, associatedVars, standaloneVars) => (result) => {
  const simplifiedResult = {};
  for (const varName of richVars) {
    const richVarData = {};
    const value = parseValue(result[varName]);
    if (value != null)
      richVarData.value = value;
    for (const associatedVarName of associatedVars) {
      if (associatedVarName.startsWith(varName))
        addAssociatedValue(result, varName, associatedVarName, richVarData);
    }
    if (Object.keys(richVarData).length > 0)
      simplifiedResult[varName] = richVarData;
  }
  for (const varName of standaloneVars) {
    simplifiedResult[varName] = parseValue(result[varName]);
  }
  return simplifiedResult;
};
const addAssociatedValue = (result, varName, associatedVarName, richVarData) => {
  let shortAssociatedVarName = associatedVarName.split(varName)[1];
  shortAssociatedVarName = shortAssociatedVarName[0].toLowerCase() + shortAssociatedVarName.slice(1);
  shortAssociatedVarName = specialNames[shortAssociatedVarName] || shortAssociatedVarName;
  const associatedVarData = result[associatedVarName];
  if (associatedVarData != null)
    richVarData[shortAssociatedVarName] = associatedVarData.value;
};
const specialNames = {
  altLabel: "aliases"
};


/***/ }),

/***/ 24354:
/***/ ((module) => {

const simplifyTextAttributes = (multivalue) => (data) => {
  const simplified = {};
  Object.keys(data).forEach((lang) => {
    const obj = data[lang];
    if (obj != null) {
      simplified[lang] = multivalue ? obj.map(getValue) : obj.value;
    } else {
      simplified[lang] = multivalue ? [] : null;
    }
  });
  return simplified;
};
const getValue = (obj) => obj.value;
const singleValue = simplifyTextAttributes(false);
module.exports = {
  labels: singleValue,
  descriptions: singleValue,
  aliases: simplifyTextAttributes(true),
  lemmas: singleValue,
  representations: singleValue,
  glosses: singleValue
};


/***/ }),

/***/ 2156:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { fixedEncodeURIComponent, replaceSpaceByUnderscores, isPlainObject } = __webpack_require__(81948);
const { isPropertyId } = __webpack_require__(5437);
const wikidataBase = "https://www.wikidata.org/wiki/";
const languages = __webpack_require__(91617);
const getSitelinkUrl = (site, title) => {
  if (isPlainObject(site)) {
    title = site.title;
    site = site.site;
  }
  if (!site)
    throw new Error("missing a site");
  if (!title)
    throw new Error("missing a title");
  const shortSiteKey = site.replace(/wiki$/, "");
  const specialUrlBuilder = siteUrlBuilders[shortSiteKey] || siteUrlBuilders[site];
  if (specialUrlBuilder)
    return specialUrlBuilder(title);
  const { lang, project } = getSitelinkData(site);
  title = fixedEncodeURIComponent(replaceSpaceByUnderscores(title));
  return `https://${lang}.${project}.org/wiki/${title}`;
};
const wikimediaSite = (subdomain) => (title) => `https://${subdomain}.wikimedia.org/wiki/${title}`;
const siteUrlBuilders = {
  commons: wikimediaSite("commons"),
  mediawiki: (title) => `https://www.mediawiki.org/wiki/${title}`,
  meta: wikimediaSite("meta"),
  species: wikimediaSite("species"),
  wikidata: (title) => {
    if (isPropertyId(title))
      return `${wikidataBase}Property:${title}`;
    return `${wikidataBase}${title}`;
  },
  wikimania: wikimediaSite("wikimania")
};
const sitelinkUrlPattern = /^https?:\/\/([\w-]{2,10})\.(\w+)\.org\/\w+\/(.*)/;
const getSitelinkData = (site) => {
  if (site.startsWith("http")) {
    const url = site;
    const matchData = url.match(sitelinkUrlPattern);
    if (!matchData)
      throw new Error(`invalid sitelink url: ${url}`);
    let [lang, project, title] = matchData.slice(1);
    title = decodeURIComponent(title);
    let key;
    if (lang === "www") {
      lang = "en";
      key = project;
    } else if (lang === "commons") {
      lang = "en";
      project = key = "commons";
    } else {
      key = `${lang}${project}`.replace("wikipedia", "wiki");
    }
    return { lang, project, key, title, url };
  } else {
    const key = site;
    const specialProjectName = specialSites[key];
    if (specialProjectName)
      return { lang: "en", project: specialProjectName, key };
    const [lang, projectSuffix, rest] = key.split("wik");
    if (rest != null)
      throw new Error(`invalid sitelink key: ${key}`);
    if (languages.indexOf(lang) === -1) {
      throw new Error(`sitelink lang not found: ${lang}`);
    }
    const project = projectsBySuffix[projectSuffix];
    if (!project)
      throw new Error(`sitelink project not found: ${project}`);
    return { lang, project, key };
  }
};
const specialSites = {
  commonswiki: "commons",
  mediawikiwiki: "mediawiki",
  metawiki: "meta",
  specieswiki: "specieswiki",
  wikidatawiki: "wikidata",
  wikimaniawiki: "wikimania"
};
const isSitelinkKey = (site) => {
  try {
    getSitelinkData(site);
    return true;
  } catch (err) {
    return false;
  }
};
const projectsBySuffix = {
  i: "wikipedia",
  isource: "wikisource",
  iquote: "wikiquote",
  tionary: "wiktionary",
  ibooks: "wikibooks",
  iversity: "wikiversity",
  ivoyage: "wikivoyage",
  inews: "wikinews"
};
module.exports = { getSitelinkUrl, getSitelinkData, isSitelinkKey };


/***/ }),

/***/ 91617:
/***/ ((module) => {

module.exports = [
  "aa",
  "ab",
  "ace",
  "ady",
  "af",
  "ak",
  "als",
  "alt",
  "ami",
  "am",
  "ang",
  "an",
  "arc",
  "ar",
  "ary",
  "arz",
  "ast",
  "as",
  "atj",
  "avk",
  "av",
  "awa",
  "ay",
  "azb",
  "az",
  "ban",
  "bar",
  "bat_smg",
  "ba",
  "bcl",
  "be_x_old",
  "be",
  "bg",
  "bh",
  "bi",
  "bjn",
  "bm",
  "bn",
  "bo",
  "bpy",
  "br",
  "bs",
  "bug",
  "bxr",
  "ca",
  "cbk_zam",
  "cdo",
  "ceb",
  "ce",
  "cho",
  "chr",
  "ch",
  "chy",
  "ckb",
  "co",
  "crh",
  "cr",
  "csb",
  "cs",
  "cu",
  "cv",
  "cy",
  "dag",
  "da",
  "de",
  "din",
  "diq",
  "dsb",
  "dty",
  "dv",
  "dz",
  "ee",
  "el",
  "eml",
  "en",
  "eo",
  "es",
  "et",
  "eu",
  "ext",
  "fa",
  "ff",
  "fiu_vro",
  "fi",
  "fj",
  "fo",
  "frp",
  "frr",
  "fr",
  "fur",
  "fy",
  "gag",
  "gan",
  "ga",
  "gcr",
  "gd",
  "glk",
  "gl",
  "gn",
  "gom",
  "gor",
  "got",
  "gu",
  "guw",
  "gv",
  "hak",
  "ha",
  "haw",
  "he",
  "hif",
  "hi",
  "ho",
  "hr",
  "hsb",
  "ht",
  "hu",
  "hy",
  "hyw",
  "hz",
  "ia",
  "id",
  "ie",
  "ig",
  "ii",
  "ik",
  "ilo",
  "inh",
  "io",
  "is",
  "it",
  "iu",
  "jam",
  "ja",
  "jbo",
  "jv",
  "kaa",
  "kab",
  "ka",
  "kbd",
  "kbp",
  "kg",
  "ki",
  "kj",
  "kk",
  "kl",
  "km",
  "kn",
  "koi",
  "ko",
  "krc",
  "kr",
  "ksh",
  "ks",
  "ku",
  "kv",
  "kw",
  "ky",
  "lad",
  "la",
  "lbe",
  "lb",
  "lez",
  "lfn",
  "lg",
  "lij",
  "li",
  "lld",
  "lmo",
  "ln",
  "lo",
  "lrc",
  "ltg",
  "lt",
  "lv",
  "mad",
  "mai",
  "map_bms",
  "mdf",
  "mg",
  "mhr",
  "mh",
  "min",
  "mi",
  "mk",
  "ml",
  "mni",
  "mn",
  "mnw",
  "mo",
  "mrj",
  "mr",
  "ms",
  "mt",
  "mus",
  "mwl",
  "myv",
  "my",
  "mzn",
  "nah",
  "nap",
  "na",
  "nds_nl",
  "nds",
  "ne",
  "new",
  "ng",
  "nia",
  "nl",
  "nn",
  "nov",
  "no",
  "nqo",
  "nrm",
  "nso",
  "nv",
  "ny",
  "oc",
  "olo",
  "om",
  "or",
  "os",
  "pag",
  "pam",
  "pap",
  "pa",
  "pcd",
  "pdc",
  "pfl",
  "pih",
  "pi",
  "pl",
  "pms",
  "pnb",
  "pnt",
  "ps",
  "pt",
  "pwn",
  "qu",
  "rm",
  "rmy",
  "rn",
  "roa_rup",
  "roa_tara",
  "ro",
  "rue",
  "ru",
  "rw",
  "sah",
  "sat",
  "sa",
  "scn",
  "sco",
  "sc",
  "sd",
  "se",
  "sg",
  "shi",
  "shn",
  "sh",
  "shy",
  "simple",
  "si",
  "skr",
  "sk",
  "sl",
  "smn",
  "sm",
  "sn",
  "sources",
  "so",
  "sq",
  "srn",
  "sr",
  "ss",
  "stq",
  "st",
  "su",
  "sv",
  "sw",
  "szl",
  "szy",
  "ta",
  "tay",
  "tcy",
  "tet",
  "te",
  "tg",
  "th",
  "ti",
  "tk",
  "tl",
  "tn",
  "to",
  "tpi",
  "trv",
  "tr",
  "ts",
  "tt",
  "tum",
  "tw",
  "tyv",
  "ty",
  "udm",
  "ug",
  "uk",
  "ur",
  "uz",
  "vec",
  "vep",
  "ve",
  "vi",
  "vls",
  "vo",
  "war",
  "wa",
  "wo",
  "wuu",
  "xal",
  "xh",
  "xmf",
  "yi",
  "yo",
  "yue",
  "za",
  "zea",
  "zh_classical",
  "zh_min_nan",
  "zh_yue",
  "zh",
  "zu"
];


/***/ }),

/***/ 39240:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const helpers = __webpack_require__(5437);
const validate = (name, testName) => (value) => {
  if (!helpers[testName](value))
    throw new Error(`invalid ${name}: ${value}`);
};
module.exports = {
  entityId: validate("entity id", "isEntityId"),
  propertyId: validate("property id", "isPropertyId"),
  entityPageTitle: validate("entity page title", "isEntityPageTitle"),
  revisionId: validate("revision id", "isRevisionId")
};


/***/ }),

/***/ 74320:
/***/ ((module) => {

module.exports = (wikibaseTime) => {
  if (typeof wikibaseTime === "object") {
    wikibaseTime = wikibaseTime.time;
  }
  const sign = wikibaseTime[0];
  let [yearMonthDay, withinDay] = wikibaseTime.slice(1).split("T");
  yearMonthDay = yearMonthDay.replace(/-00/g, "-01");
  const rest = `${yearMonthDay}T${withinDay}`;
  return fullDateData(sign, rest);
};
const fullDateData = (sign, rest) => {
  const year = rest.split("-")[0];
  const needsExpandedYear = sign === "-" || year.length > 4;
  return needsExpandedYear ? expandedYearDate(sign, rest, year) : new Date(rest);
};
const expandedYearDate = (sign, rest, year) => {
  let date;
  if (year.length === 4) {
    date = `${sign}00${rest}`;
  } else if (year.length === 5) {
    date = `${sign}0${rest}`;
  } else {
    date = sign + rest;
  }
  return new Date(date);
};


/***/ }),

/***/ 56701:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { isPlainObject } = __webpack_require__(81948);
const namespacePattern = /^\d+[|\d]*$/;
module.exports = (buildUrl) => (params) => {
  if (!isPlainObject(params)) {
    throw new Error(`expected parameters to be passed as an object, got ${params} (${typeof params})`);
  }
  for (const key in params) {
    if (key.startsWith("sr")) {
      const shortKey = key.replace(/^sr/, "");
      if (params[shortKey] != null)
        throw new Error(`${shortKey} and ${key} are the same`);
      params[shortKey] = params[key];
    }
  }
  const { search, haswbstatement, format = "json", limit, offset, profile, sort } = params;
  let { namespace, prop } = params;
  if (!(search || haswbstatement))
    throw new Error('missing "search" or "haswbstatement" parameter');
  let srsearch = "";
  if (search)
    srsearch += search;
  if (haswbstatement) {
    const statements = haswbstatement instanceof Array ? haswbstatement : [haswbstatement];
    for (const statement of statements) {
      if (statement[0] === "-")
        srsearch += ` -haswbstatement:${statement.slice(1)}`;
      else
        srsearch += ` haswbstatement:${statement}`;
    }
  }
  if (limit != null && (typeof limit !== "number" || limit < 1)) {
    throw new Error(`invalid limit: ${limit}`);
  }
  if (offset != null && (typeof offset !== "number" || offset < 0)) {
    throw new Error(`invalid offset: ${offset}`);
  }
  if (namespace instanceof Array)
    namespace = namespace.join("|");
  else if (typeof namespace === "number")
    namespace = namespace.toString();
  if (namespace && !namespacePattern.test(namespace)) {
    throw new Error(`invalid namespace: ${namespace}`);
  }
  if (profile != null && typeof profile !== "string") {
    throw new Error(`invalid profile: ${profile} (${typeof profile}, expected string)`);
  }
  if (sort != null && typeof sort !== "string") {
    throw new Error(`invalid sort: ${sort} (${typeof sort}, expected string)`);
  }
  if (prop != null) {
    if (namespace instanceof Array)
      prop = prop.join("|");
    if (typeof prop !== "string") {
      throw new Error(`invalid prop: ${prop} (${typeof prop}, expected string)`);
    }
  }
  return buildUrl({
    action: "query",
    list: "search",
    srsearch: srsearch.trim(),
    format,
    srnamespace: namespace,
    srlimit: limit,
    sroffset: offset,
    srqiprofile: profile,
    srsort: sort,
    srprop: prop
  });
};


/***/ }),

/***/ 98607:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { isPlainObject, forceArray, shortLang } = __webpack_require__(81948);
const validate = __webpack_require__(39240);
module.exports = (buildUrl) => (ids, languages, props, format, redirects) => {
  if (isPlainObject(ids)) {
    ({ ids, languages, props, format, redirects } = ids);
  }
  format = format || "json";
  if (!(ids && ids.length > 0))
    throw new Error("no id provided");
  ids = forceArray(ids);
  ids.forEach(validate.entityId);
  if (ids.length > 50) {
    console.warn(`getEntities accepts 50 ids max to match Wikidata API limitations:
      this request won't get all the desired entities.
      You can use getManyEntities instead to generate several request urls
      to work around this limitation`);
  }
  const query = {
    action: "wbgetentities",
    ids: ids.join("|"),
    format
  };
  if (redirects === false)
    query.redirects = "no";
  if (languages) {
    languages = forceArray(languages).map(shortLang);
    query.languages = languages.join("|");
  }
  if (props && props.length > 0)
    query.props = forceArray(props).join("|");
  return buildUrl(query);
};


/***/ }),

/***/ 69908:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { isPlainObject, forceArray, shortLang } = __webpack_require__(81948);
module.exports = (buildUrl) => (titles, sites, languages, props, format, redirects) => {
  if (isPlainObject(titles)) {
    const params = titles;
    titles = params.titles;
    sites = params.sites;
    languages = params.languages;
    props = params.props;
    format = params.format;
    redirects = params.redirects;
  }
  format = format || "json";
  if (!(titles && titles.length > 0))
    throw new Error("no titles provided");
  if (!(sites && sites.length > 0))
    sites = ["enwiki"];
  titles = forceArray(titles);
  sites = forceArray(sites).map(parseSite);
  props = forceArray(props);
  const query = {
    action: "wbgetentities",
    titles: titles.join("|"),
    sites: sites.join("|"),
    format
  };
  if (sites.length === 1 && titles.length === 1) {
    query.normalize = true;
  }
  if (languages) {
    languages = forceArray(languages).map(shortLang);
    query.languages = languages.join("|");
  }
  if (props && props.length > 0)
    query.props = props.join("|");
  if (redirects === false)
    query.redirects = "no";
  return buildUrl(query);
};
const parseSite = (site) => site.length === 2 ? `${site}wiki` : site;


/***/ }),

/***/ 49524:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const validate = __webpack_require__(39240);
const { isPlainObject } = __webpack_require__(81948);
module.exports = (instance, wgScriptPath) => (id, revision) => {
  if (isPlainObject(id)) {
    revision = id.revision;
    id = id.id;
  }
  validate.entityId(id);
  validate.revisionId(revision);
  return `${instance}/${wgScriptPath}/index.php?title=Special:EntityData/${id}.json&revision=${revision}`;
};


/***/ }),

/***/ 7073:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { isPlainObject } = __webpack_require__(81948);
module.exports = (buildUrl) => {
  const getEntities = __webpack_require__(98607)(buildUrl);
  return (ids, languages, props, format, redirects) => {
    if (isPlainObject(ids)) {
      ({ ids, languages, props, format, redirects } = ids);
    }
    if (!(ids instanceof Array))
      throw new Error("getManyEntities expects an array of ids");
    return getIdsGroups(ids).map((idsGroup) => getEntities(idsGroup, languages, props, format, redirects));
  };
};
const getIdsGroups = (ids) => {
  const groups = [];
  while (ids.length > 0) {
    const group = ids.slice(0, 50);
    ids = ids.slice(50);
    groups.push(group);
  }
  return groups;
};


/***/ }),

/***/ 16785:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { forceArray } = __webpack_require__(81948);
const { isItemId } = __webpack_require__(5437);
const validate = __webpack_require__(39240);
const itemsOnly = "FILTER NOT EXISTS { ?subject rdf:type wikibase:Property . } ";
module.exports = (sparqlEndpoint) => {
  const sparqlQuery = __webpack_require__(60744)(sparqlEndpoint);
  return (property, value, options = {}) => {
    const { limit, caseInsensitive, keepProperties } = options;
    const valueFn = caseInsensitive ? caseInsensitiveValueQuery : directValueQuery;
    const filter = keepProperties ? "" : itemsOnly;
    let properties = forceArray(property);
    properties.forEach(validate.propertyId);
    properties = properties.map(prefixifyProperty).join("|");
    const valueBlock = getValueBlock(value, valueFn, properties, filter);
    let sparql = `SELECT DISTINCT ?subject WHERE { ${valueBlock} }`;
    if (limit)
      sparql += ` LIMIT ${limit}`;
    return sparqlQuery(sparql);
  };
};
const getValueBlock = (value, valueFn, properties, filter) => {
  if (!(value instanceof Array)) {
    return valueFn(properties, getValueString(value), filter);
  }
  const valuesBlocks = value.map(getValueString).map((valStr) => valueFn(properties, valStr, filter));
  return "{ " + valuesBlocks.join("} UNION {") + " }";
};
const getValueString = (value) => {
  if (isItemId(value)) {
    value = `wd:${value}`;
  } else if (typeof value === "string") {
    value = `'${value}'`;
  }
  return value;
};
const directValueQuery = (properties, value, filter, limit) => {
  return `?subject ${properties} ${value} .
    ${filter}`;
};
const caseInsensitiveValueQuery = (properties, value, filter, limit) => {
  return `?subject ${properties} ?value .
    FILTER (lcase(?value) = ${value.toLowerCase()})
    ${filter}`;
};
const prefixifyProperty = (property) => "wdt:" + property;


/***/ }),

/***/ 98542:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { forceArray } = __webpack_require__(81948);
const validate = __webpack_require__(39240);
module.exports = (buildUrl) => (ids, options = {}) => {
  ids = forceArray(ids);
  ids.forEach(validate.entityPageTitle);
  const uniqueId = ids.length === 1;
  const query = {
    action: "query",
    prop: "revisions"
  };
  query.titles = ids.join("|");
  query.format = options.format || "json";
  if (uniqueId)
    query.rvlimit = options.limit || "max";
  if (uniqueId && options.start)
    query.rvstart = getEpochSeconds(options.start);
  if (uniqueId && options.end)
    query.rvend = getEpochSeconds(options.end);
  const { prop, user, excludeuser, tag } = options;
  if (prop) {
    query.rvprop = forceArray(prop).join("|");
  } else {
    query.rvprop = "ids|flags|timestamp|user|userid|size|slotsize|sha1|slotsha1|contentmodel|comment|parsedcomment|content|tags|roles|oresscores";
  }
  query.rvslots = "*";
  if (user)
    query.rvuser = user;
  if (excludeuser)
    query.rvexcludeuser = excludeuser;
  if (tag)
    query.rvtag = tag;
  return buildUrl(query);
};
const getEpochSeconds = (date) => {
  if (typeof date === "number" && date < earliestPointInMs)
    return date;
  return Math.trunc(new Date(date).getTime() / 1e3);
};
const earliestPointInMs = new Date("2000-01-01").getTime();


/***/ }),

/***/ 52907:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { isPlainObject } = __webpack_require__(81948);
const types = ["item", "property", "lexeme", "form", "sense"];
module.exports = (buildUrl) => (search, language, limit, format, uselang) => {
  let type, offset;
  if (isPlainObject(search)) {
    const params = search;
    search = params.search;
    language = params.language;
    limit = params.limit;
    offset = params.continue;
    format = params.format;
    uselang = params.uselang;
    type = params.type;
  }
  if (!(search && search.length > 0))
    throw new Error("search can't be empty");
  language = language || "en";
  uselang = uselang || language;
  limit = limit || "20";
  format = format || "json";
  type = type || "item";
  offset = offset || "0";
  if (!types.includes(type))
    throw new Error(`invalid type: ${type}`);
  return buildUrl({
    action: "wbsearchentities",
    search,
    language,
    limit,
    continue: offset,
    format,
    uselang,
    type
  });
};


/***/ }),

/***/ 60744:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { fixedEncodeURIComponent } = __webpack_require__(81948);
module.exports = (sparqlEndpoint) => (sparql) => {
  const query = fixedEncodeURIComponent(sparql);
  return `${sparqlEndpoint}?format=json&query=${query}`;
};


/***/ }),

/***/ 70227:
/***/ ((module) => {

const isBrowser = typeof location !== "undefined" && typeof document !== "undefined";
const stringifyQuery = (queryObj) => new URLSearchParams(queryObj).toString();
module.exports = (instanceApiEndpoint) => (queryObj) => {
  if (isBrowser)
    queryObj.origin = "*";
  Object.keys(queryObj).forEach((key) => {
    if (queryObj[key] == null)
      delete queryObj[key];
  });
  return instanceApiEndpoint + "?" + stringifyQuery(queryObj);
};


/***/ }),

/***/ 81948:
/***/ ((module) => {

module.exports = {
  shortLang: (language) => language.toLowerCase().split("_")[0],
  forceArray: (array) => {
    if (typeof array === "string")
      array = [array];
    return array || [];
  },
  isPlainObject: (obj) => {
    if (!obj || typeof obj !== "object" || obj instanceof Array)
      return false;
    return true;
  },
  fixedEncodeURIComponent: (str) => {
    return encodeURIComponent(str).replace(/[!'()*]/g, encodeCharacter);
  },
  replaceSpaceByUnderscores: (str) => str.replace(/\s/g, "_"),
  uniq: (array) => Array.from(new Set(array))
};
const encodeCharacter = (char) => "%" + char.charCodeAt(0).toString(16);


/***/ }),

/***/ 4330:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { isPlainObject } = __webpack_require__(81948);
const simplify = __webpack_require__(65298);
const parse = __webpack_require__(47622);
const helpers = __webpack_require__(5437);
const sitelinksHelpers = __webpack_require__(2156);
const rankHelpers = __webpack_require__(21145);
const tip = `Tip: if you just want to access functions that don't need an instance or a sparqlEndpoint,
those are also exposed directly on the module object. Exemple:
const { isItemId, simplify } = require('wikibase-sdk')`;
const common = Object.assign({ simplify, parse }, helpers, sitelinksHelpers, rankHelpers);
const WBK = (config) => {
  if (!isPlainObject(config))
    throw new Error("invalid config");
  const { instance, sparqlEndpoint } = config;
  let { wgScriptPath = "w" } = config;
  wgScriptPath = wgScriptPath.replace(/^\//, "");
  if (!(instance || sparqlEndpoint)) {
    throw new Error(`one of instance or sparqlEndpoint should be set at initialization.
${tip}`);
  }
  let wikibaseApiFunctions, instanceRoot, instanceApiEndpoint;
  if (instance) {
    validateEndpoint("instance", instance);
    instanceRoot = instance.replace(/\/$/, "").replace(`/${wgScriptPath}/api.php`, "");
    instanceApiEndpoint = `${instanceRoot}/${wgScriptPath}/api.php`;
    const buildUrl = __webpack_require__(70227)(instanceApiEndpoint);
    wikibaseApiFunctions = {
      searchEntities: __webpack_require__(52907)(buildUrl),
      cirrusSearchPages: __webpack_require__(56701)(buildUrl),
      getEntities: __webpack_require__(98607)(buildUrl),
      getManyEntities: __webpack_require__(7073)(buildUrl),
      getRevisions: __webpack_require__(98542)(buildUrl),
      getEntityRevision: __webpack_require__(49524)(instance, wgScriptPath),
      getEntitiesFromSitelinks: __webpack_require__(69908)(buildUrl)
    };
  } else {
    wikibaseApiFunctions = {
      searchEntities: missingInstance("searchEntities"),
      cirrusSearchPages: missingInstance("cirrusSearchPages"),
      getEntities: missingInstance("getEntities"),
      getManyEntities: missingInstance("getManyEntities"),
      getRevisions: missingInstance("getRevisions"),
      getEntityRevision: missingInstance("getEntityRevision"),
      getEntitiesFromSitelinks: missingInstance("getEntitiesFromSitelinks")
    };
  }
  let wikibaseQueryServiceFunctions;
  if (sparqlEndpoint) {
    validateEndpoint("sparqlEndpoint", sparqlEndpoint);
    wikibaseQueryServiceFunctions = {
      sparqlQuery: __webpack_require__(60744)(sparqlEndpoint),
      getReverseClaims: __webpack_require__(16785)(sparqlEndpoint)
    };
  } else {
    wikibaseQueryServiceFunctions = {
      sparqlQuery: missingSparqlEndpoint("sparqlQuery"),
      getReverseClaims: missingSparqlEndpoint("getReverseClaims")
    };
  }
  const parsedData = {
    instance: {
      root: instanceRoot,
      apiEndpoint: instanceApiEndpoint
    }
  };
  return Object.assign(parsedData, common, wikibaseApiFunctions, wikibaseQueryServiceFunctions);
};
Object.assign(WBK, common);
const validateEndpoint = (name, url) => {
  if (!(typeof url === "string" && url.startsWith("http"))) {
    throw new Error(`invalid ${name}: ${url}`);
  }
};
const missingConfig = (missingParameter) => (name) => () => {
  throw new Error(`${name} requires ${missingParameter} to be set at initialization`);
};
const missingSparqlEndpoint = missingConfig("a sparqlEndpoint");
const missingInstance = missingConfig("an instance");
module.exports = WBK;


/***/ }),

/***/ 30423:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(4330)({
  instance: "https://www.wikidata.org",
  sparqlEndpoint: "https://query.wikidata.org/sparql"
});


/***/ })

}]);
//# sourceMappingURL=977.js.map