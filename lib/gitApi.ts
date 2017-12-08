import * as rp from 'request-promise'
const API_ROOT = 'https://api.github.com/';

export function parseRequest(req) {
    let { page = null, repo } = req.query;

    // update logic
    if (page.indexOf(API_ROOT) !== -1) {
        return function () {
            return callApi(page)
        }
    } else {
        return function () {
            return callApi(`${API_ROOT}repos/${repo}/forks`)
        }
    }

}
 // parse headers
export function callApi(endpoint) {
    console.log(callApi, endpoint)
    return rp({
        url: endpoint,
        headers: {
            'User-Agent': 'Request-Promise'
        }
    })
}