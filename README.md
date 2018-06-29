local-lambda-invoker
====================

The LambdaTester class which this module exports can invoke a
lambda function downloaded to the local environment even if it
was an async lambda.

sample:

```javascript
"use strict";
const LambdaTester = require("local-lambda-invoker");
const MyLambda = require("my-lambda/index.js");
const lambda = new LambdaTester(MyLambda);
(async function() {
    let event = { .... };
    let response = await lambda.invoke(event);
    console.log(JSON.stringify(response));
}());
```

LICENSE
-------

This software is released under the MIT License, see [LICENSE](LICENSE)
