
declare namespace Instagram {
    interface Credentials {
        clientId: string,
        secret: string,
        callbackUrl: string,
        callbackAfterAccess: string
    }
    interface IAuthOptions {
        scope: string[]
    }

    interface AuthUserResult {
        access_token: string
        user: {
            id: string
            username: string
            profile_picture: string
        }
    }

    interface AuthUserCb  {
        (err: Error, result: AuthUserResult)
    }

    interface PaginationCallback<T>  {
        next(cb: GlobalApiCallback<T>)
    }

    interface CallbackError {
        code: number
        error_type: string,
        error_message: string
    }


    interface GlobalApiCallback<T> {
        (
            err: CallbackError,
            medias: T[],
            pagination: PaginationCallback<T>,
            remaining: number,
            limit: number,
        )
    }

    interface IFollower {
        id: string,
        username: string,
        full_name: string,
        profile_picture: string
    }

    interface Instance {
        get_authorization_url(
            callbackUrl: string,
            options: IAuthOptions
        ): string
        use(data: object)
        authorize_user(code: string, callbackUrl: string, cb: AuthUserCb)
        user_followers(userId: string, cb: GlobalApiCallback<IFollower>)
        user_followers(userId: string, options: object, cb: GlobalApiCallback<IFollower>)
    }

    interface IFolowerWriter {
        job(err: Instagram.CallbackError, medias: Instagram.IFollower[], pagination: Instagram.PaginationCallback<Instagram.IFollower>, cb: Function)
    }

}
