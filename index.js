"use strict";

module.exports = function spinner(fn, opts) {
    opts = opts || {};
    var timeout = opts.timeout || 5000;
    var message = opts.message || "Timeout";
    var interval = opts.interval || 100;

    var startTime = Date.now();

    return Promise.resolve()
    .then(fn)
    .then(result => {
        if (result) {
            return result;
        }

        return new Promise(resolve => setTimeout(resolve, interval))
        .then(() => {
            timeout -= Date.now() - startTime;
            if (timeout <= 0) {
                throw new Error(message);
            }

            return spinner(fn, {timeout, interval, message});
        })
    });
}