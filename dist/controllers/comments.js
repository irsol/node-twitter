"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-check
const utils_1 = __importDefault(require("../../../lib/utils"));
const mongoose_1 = __importDefault(require("mongoose"));
const Activity = mongoose_1.default.model("Activity");
const logger_1 = __importDefault(require("../middlewares/logger"));
exports.load = (req, res, next, id) => {
    const tweet = req.tweet;
    utils_1.default.findByParam(tweet.comments, { id: id }, (err, comment) => {
        if (err) {
            return next(err);
        }
        req.comment = comment;
        next();
    });
};
// ### Create Comment
exports.create = (req, res) => {
    const tweet = req.tweet;
    const user = req.user;
    if (!req.body.body) {
        return res.redirect("/");
    }
    tweet.addComment(user, req.body, err => {
        if (err) {
            logger_1.default.error(err);
            return res.render("pages/500");
        }
        const activity = new Activity({
            activityStream: "added a comment",
            activityKey: tweet.id,
            sender: user,
            receiver: req.tweet.user
        });
        logger_1.default.info(activity);
        activity.save(err => {
            if (err) {
                logger_1.default.error(err);
                return res.render("pages/500");
            }
        });
        res.redirect("/");
    });
};
// ### Delete Comment
exports.destroy = (req, res) => {
    // delete a comment here.
    const comment = req.comment;
    comment.remove(err => {
        if (err) {
            res.send(400);
        }
        res.send(200);
    });
};
//# sourceMappingURL=comments.js.map