const NodeRSA = require("node-rsa");
const key = new NodeRSA({ b: 512 });

console.log(key.exportKey());

console.log(key.exportKey("public"));
