"use strict";
const assert = require("assert");

/**
 * LambdaTester.
 * This class contains a reference of AWS Lambda function
 * that is imported in local environment.
 * @constructor
 *
 * @param {object} lambda
 * The Imported AWS Lambda.
 *
 * @param {object} context
 * The global context in running.
 */
function LambdaTester(lambda, context) {
    assert( lambda != null, "lambda requierd" );
    assert( "handler" in lambda, "lambda should contain a handler" );
    this._lambda = lambda.handler;
    this._context = context || LambdaTester.context;
}

LambdaTester.context = (Function("return this;"))();

/**
 * Run the lambda and return a promise object
 *
 * @param {object} event
 * The event parameter for the lambda.
 *
 * @returns {Promise} 
 * this will be resolved by response or rejected by an error.
 */
LambdaTester.prototype.invoke = function(event) {
    if(this._lambda.constructor.name === "AsyncFunction") {
        return this._lambda(event);
    }
    return new Promise( (resolve, reject) => {
        this._lambda(event, this._context, (err, output) => {
            if(err) {
                reject(err);
            } else {
                resolve(output);
            }
        });
    });
};

module.exports = LambdaTester
