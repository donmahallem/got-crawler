import * as https from "https";
export enum Scope {
    IDENTITY = 1,
    EDIT = 2,
    FLAIR = 3,
    HISTORY = 4,
    MODCONFIG = 5,
    MODFLAIR = 6,
    MODLOG = 7,
    MODPOSTS = 8,
    MODWIKI = 9,
    MYSUBREDDITS = 10,
    PRIVATEMESSAGES = 11,
    READ = 12,
    REPORT = 13,
    SAVE = 14,
    SUBMIT = 15,
    SUBSCRIBE = 16,
    VOTE = 17,
    WIKIEDIT = 18,
    WIKIREAD = 19
}

type Scopes = Scope[];

export interface RedditThing {
    id: string;
}

export interface RedditSelftext extends RedditThing {
    selftext: string;
    selftext_html: string;
}

export interface RedditSubmission extends RedditThing {

}
export enum Duration {
    PERMANENT = 1,
    TEMPORARY = 2
}
export type RedditResponse<T> = {
    type: string;
    data: T;
}

export interface RedditListing<T extends RedditThing> {
    before?: string | null;
    after?: string | null;
    children: T[];
}

export interface RedditSubmissionListing extends RedditListing<RedditSubmission> {

}
export class RedditHelper {
    public static getNewSubmissions(subreddit: string, limit: number = 10): Promise<RedditSubmissionListing> {
        return new Promise((resolve, reject) => {
            let options: https.RequestOptions = {
                host: "api.reddit.com",
                port: 443,
                path: "/r/" + subreddit + "/new?limit=" + limit,
                headers: {
                    "User-Agent": "github.com/DonMahallem/got-api"
                }
            };
            let request = https.get(options, (res) => {
                if (res.statusCode != 200) {
                    reject(new Error("Status Code (" + res.statusCode + ") was returned"));
                    return;
                }
                let body = '';
                res.on('data', function (chunk) {
                    body += chunk;
                });
                res.on('end', function () {
                    const parsed = JSON.parse(body);
                    resolve(parsed);
                });
            });
            request.on('error', function (e) {
                reject(e);
            });
        });
    }
}