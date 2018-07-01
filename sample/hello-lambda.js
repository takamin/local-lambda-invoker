#!/usr/bin/env node
"use strict";

const LambdaTester = require("../index.js");
const helloLambda = LambdaTester.fetch(
    require("../lambda/helloLambda/index.js"));

(async ()=>{
    console.log(await helloLambda({}));
})();
