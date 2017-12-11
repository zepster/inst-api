"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const gitApi_1 = require("../lib/gitApi");
class GitRepo {
    constructor() {
        this.router = express.Router();
        this.init();
    }
    getHandlers() {
        return this.router;
    }
    init() {
        this.router.get('/', this.repo.bind(this));
    }
    repo(req, res, next) {
        let loadData = gitApi_1.parseRequest(req);
        loadData()
            .then(repos => {
            repos.data = repos.data.map(r => ({
                id: r.id,
                owner: r.owner,
                full_name: r.full_name,
                stargazers_count: r.stargazers_count
            }));
            res.send(repos);
        })
            .catch(err => {
            res.status(500).send({ message: err.message });
        });
    }
}
exports.GitRepo = GitRepo;
//# sourceMappingURL=gitRepo.js.map