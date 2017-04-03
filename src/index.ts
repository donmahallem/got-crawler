import * as redis from "redis";
import { RedditHelper } from "./util/reddit-helper";


let redisClient = redis.createClient();
let cachedIds: string[] = [];
const refresh: Function = () => {
    RedditHelper.getNewSubmissions("GlobalOffensiveTrade")
        .then((data: any) => {
            return data.data.children;
        })
        .then((submissions: any) => {
            let latestId = null;
            for (let sub of submissions) {
                let submission: { id: string } = sub.data;
                if (cachedIds.indexOf(submission.id) >= 0) {
                    continue;
                }
                console.log("new id", submission.id);
                cachedIds.push(submission.id);
                redisClient.publish("reddit:submission", JSON.stringify(submission));
            }
            if (cachedIds.length > 100) {
                cachedIds = cachedIds.slice(-100);
            }
        })
        .then(() => {
            setTimeout(refresh, 10000);
        }).catch((err: Error) => {
            console.error(err);
            setTimeout(refresh, 20000);
        });
}

refresh();
/*
redisClient.multi()
    .lpush("testlist", 2, 43, 45, 5, 6, 6)
    .ltrim("testlist", 0, 9)
    .exec(function (err, replies) {
        console.log("MULTI got " + replies.length + " replies");
        replies.forEach(function (reply, index) {
            console.log("Reply " + index + ": " + reply.toString());
        });
    });*/