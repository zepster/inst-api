"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const instagramNode = require("instagram-node");
const instagram_1 = require("../config/instagram");
const CSVWrite_1 = require("../lib/CSVWrite");
class AuthRoute {
    constructor() {
        this.block = false;
        this.isToken = false;
        this.router = express.Router();
        this.ig = instagramNode['instagram']();
        this.setIgData({
            client_id: instagram_1.credentials.clientId,
            client_secret: instagram_1.credentials.secret,
        });
        this.init();
    }
    getHandlers() {
        return this.router;
    }
    setIgData(data) {
        this.ig.use(data);
    }
    init() {
        this.router.get('/', this.index.bind(this));
        this.router.get('/auth', this.auth.bind(this));
        this.router.get('/callback', this.callback.bind(this));
        this.router.get('/home', this.callbackAfterAccess.bind(this));
    }
    index(req, res, next) {
        res.redirect(this.ig.get_authorization_url(instagram_1.credentials.callbackUrl, { scope: ['basic', 'follower_list', 'public_content', 'relationships'] }));
    }
    auth(req, res, next) {
        res.redirect(this.ig.get_authorization_url(instagram_1.credentials.callbackUrl, { scope: ['basic', 'follower_list', 'public_content', 'relationships'] }));
    }
    callback(req, res, next) {
        this.ig.authorize_user(req.query.code, instagram_1.credentials.callbackUrl, (err, result) => {
            if (err) {
                return res.render('status', { message: err.message });
            }
            else {
                this.setIgData({
                    access_token: result.access_token
                });
                this.isToken = true;
                res.redirect(instagram_1.credentials.callbackAfterAccess);
            }
        });
    }
    callbackAfterAccess(req, res, next) {
        if (this.block)
            return res.render('status', { message: 'In progress.' });
        if (!this.isToken)
            return res.redirect('/ig');
        const me = instagram_1.tagretId;
        this.ig.user_followers(me, (err, medias = [], pagination, remaining, limit) => {
            if (!err) {
                res.render('status', { message: 'We are writing.' });
            }
            else {
                return res.render('status', { message: err.error_message });
            }
            this.block = true;
            this.cswWriter = new CSVWrite_1.FolowerWriter(`logs/${me}.csv`);
            this.cswWriter.job(err, medias, pagination, () => {
                this.block = false;
                this.cswWriter = null;
            });
        });
    }
}
exports.AuthRoute = AuthRoute;
//# sourceMappingURL=instagramAuth.js.map