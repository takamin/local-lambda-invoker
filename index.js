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
    this._context = {
        getRemainingTimeInMillis = function() { return 1000; },
        callbackWaitsForEmptyEventLoop: 0,
        functionName: "",
        functionVersion: "",
        invokedFunctionArn: "",
        memoryLimitInMB: 0,
        awsRequestId: "",
        logGroupName: "",
        logStreamName: "",
        identity: null,
        clientContext: null
    };
    if(context != null) {
        Object.keys(this._context).forEach( key => {
            if(key in context) {
                this._context[key] = context[key];
            }
        });
    }
}

/**
 * Get the AWS Lambda function.
 *
 * @param {object} lambda
 * AWS Lambda module.
 *
 * @param {object} context (optional)
 * A global context for the lambda to run.
 *
 * @returns {AsyncFunction}
 */
LambdaTester.fetch = function(lambda, context) {
    let tester = new LambdaTester(lambda, context);
    let f = (event => tester.invoke(event));
    f.setContext = (key, value) => {
        assert(key in this._context,
            `${key} is an invalid for the Lambda Context.`)
    };
    return f;
};

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
        let done = false;
        return new Promise( (resolve, reject) => {
            this._lambda(event, this._context, (err, output) => {
                if(!done) {
                    done = true;
                    if(err) {
                        reject(err);
                    } else {
                        resolve(output);
                    }
                }
            }).then(result => {
                if(!done) {
                    done = true;
                    resolve(result);
                }
            }).catch(err => {
                if(!done) {
                    done = true;
                    reject(err);
                }
            });
        });
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
