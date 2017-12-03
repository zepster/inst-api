import * as express from "express";
import * as instagramNode from 'instagram-node'
import { credentials, tagretId } from '../config/instagram'

import { FolowerWriter } from '../lib/CSVWrite';

export class AuthRoute {

    router: express.Router;
    private ig: Instagram.Instance;
    private block: boolean = false;
    private isToken = false;

    private cswWriter: Instagram.IFolowerWriter;

    constructor() {
        this.router = express.Router();
        this.ig = instagramNode.instagram()
        this.setIgData({
            client_id: credentials.clientId,
            client_secret: credentials.secret,
        })
        this.init()
    }

    getHandlers() {
        return this.router
    }

    private setIgData(data) {
        this.ig.use(data)
    }

    init() {
        this.router.get('/', this.index.bind(this))
        this.router.get('/auth', this.auth.bind(this))
        this.router.get('/callback', this.callback.bind(this))
        this.router.get('/home', this.callbackAfterAccess.bind(this))
    }

    index(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.redirect(this.ig.get_authorization_url(credentials.callbackUrl, { scope: ['basic', 'follower_list', 'public_content', 'relationships']}))
    }

    auth(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.redirect(this.ig.get_authorization_url(credentials.callbackUrl, { scope: ['basic', 'follower_list', 'public_content', 'relationships']}))
    }

    callback(req: express.Request, res: express.Response, next: express.NextFunction) {
        this.ig.authorize_user(req.query.code, credentials.callbackUrl, (err, result) => {
            if (err) {
                return res.render('status', {message: err.message})
            } else {
                this.setIgData({
                    access_token: result.access_token
                })
                this.isToken = true;
                res.redirect(credentials.callbackAfterAccess)
            }
        });
    }

    callbackAfterAccess(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (this.block)
            return res.render('status', {message: 'In progress.'})
        if (!this.isToken)
            return res.redirect('/ig')

        const me = tagretId

        this.ig.user_followers(me, (err, medias = [], pagination, remaining, limit) => {

            if (!err) {
                res.render('status', {message: 'We are writing.'})
            } else {
                return res.render('status', {message: err.error_message})
            }

            this.block = true;
            this.cswWriter = new FolowerWriter(`logs/${me}.csv`);
            this.cswWriter.job(err, medias, pagination, ()=> {
                this.block = false;
                this.cswWriter = null;
            })
        })
    }


}