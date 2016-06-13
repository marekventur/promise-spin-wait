#!/usr/bin/env node
"use strict";

import test from "ava";
import spinner from "./index";

test("works with a syncronous return values", async t => {
    t.is(await spinner(() => "abc" ), "abc");
});

test("works with Promises", async t => {
    t.is(await spinner(() => Promise.resolve("abc")), "abc");
});

test("Rejected promises are handled correctly", async t => {
    let err = new Error("something");
    try {
        await spinner(() => Promise.reject(err));
        t.fail("should fail");
    } catch (e) {
        t.is(err, e);
    }
});

test("continues to call fn until truish result is returned", async t => {
    let result = false;
    let callCount = 0;
    let fn = () => {
        callCount++;
        return result;
    };
    let promise = spinner(fn);

    return Promise.all([
        promise,
        new Promise(resolve => setTimeout(resolve, 300)).then(() => result = "abcd")
    ])
    .then(([r]) => {
        t.is(r, "abcd");
        t.true(callCount > 1)
    })
});

test("any error will stop the spinner", async t => {
    let throwError = false;
    let err = new Error("foobar");
    let fn = () => {
        if (throwError) {
            throw err;
        }
        return false;
    };
    let promise = spinner(fn);

    return Promise.all([
        promise,
        new Promise(resolve => setTimeout(resolve, 300)).then(() => throwError = true)
    ])
    .then(t.fail, e => {
        t.is(err, e);
    })
});

test("will eventually time out", async t => {
    return spinner(() => false, {timeout: 300})
    .then(t.fail, err => {
        t.is(err.message, "Timeout");
    })
});

test("timeout message can be set", async t => {
    return spinner(() => false, {timeout: 100, message: "Hello World"})
    .then(t.fail, err => {
        t.is(err.message, "Hello World");
    })
});

test("fn will not be called multiple times if it takes longer to execute", async t => {
    let callCount = 0;
    await spinner(() => {
        callCount++;
        return new Promise(resolve => setTimeout(resolve, 300)).then(() => "abcd")
    });
    t.is(callCount, 1);
});

