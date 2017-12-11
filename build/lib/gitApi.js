"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rp = require("request-promise");
const API_ROOT = 'https://api.github.com/';
function parseRequest(req) {
    let { page = "1", repo } = req.query;
    if (!repo) {
        throw new Error(`Param 'repo' is not required.`);
    }
    if (!page) {
        return function () {
            return callApi(`${API_ROOT}repos/${repo}/forks`)
                .then(({ link, rawBody }) => {
                return buildResponse(link, rawBody);
            });
        };
    }
    if (page.indexOf(API_ROOT) !== -1) {
        return function () {
            return callApi(page)
                .then(({ link, rawBody }) => {
                return buildResponse(link, rawBody);
            });
        };
    }
    if (!isNaN(parseInt(page)) && parseInt(page) === 1) {
        return function () {
            return callApi(`${API_ROOT}repos/${repo}/forks`)
                .then(({ link, rawBody }) => {
                return buildResponse(link, rawBody);
            });
        };
    }
    if (!isNaN(parseInt(page)) && parseInt(page) > 0) {
        return function () {
            return callApi(`${API_ROOT}repos/${repo}/forks`)
                .then(({ link, rawBody }) => {
                const lastPage = getPageUrl(link, 'last');
                if (!lastPage || parseInt(page) > lastPage.page) {
                    return buildResponse(link, rawBody);
                }
                else {
                    const newPage = lastPage.url.replace(/(^.*\?)page=\d*/, `$1page=${page}`);
                    return callApi(newPage).then(({ link, rawBody }) => buildResponse(link, rawBody));
                }
            });
        };
    }
    return function () {
        return Promise.resolve(buildResponse());
    };
}
exports.parseRequest = parseRequest;
function callApi(endpoint) {
    return rp({ url: endpoint, headers: { 'User-Agent': 'Request-Promise' }, resolveWithFullResponse: true })
        .then(response => {
        return {
            link: response.headers['link'],
            rawBody: response.body
        };
    }, response => {
        throw new Error(JSON.parse(response.error).message);
    })
        .catch(err => {
        throw err;
    });
}
exports.callApi = callApi;
const parseLink = link => ({
    firstUrl: getPageUrl(link, 'first'),
    prevUrl: getPageUrl(link, 'prev'),
    nextUrl: getPageUrl(link, 'next'),
    lastUrl: getPageUrl(link, 'last'),
});
const getPageUrl = (link, rel) => {
    if (!link) {
        return null;
    }
    const _link = link.split(',').find(s => s.indexOf(`rel="${rel}"`) > -1);
    if (!_link) {
        return null;
    }
    return {
        url: _link.trim().split(';')[0].slice(1, -1),
        page: _link.trim().split(';')[0].slice(1, -1).match(/^.*\?page=(\d*)/)[1] || '1'
    };
};
const buildResponse = (link = null, rawBody = null) => (Object.assign({}, parseLink(link), { data: rawBody ? JSON.parse(rawBody) : [] }));
//# sourceMappingURL=gitApi.js.map