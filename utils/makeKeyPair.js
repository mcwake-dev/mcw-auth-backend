const NodeRSA = require("node-rsa");
const key = new NodeRSA({ b: 512 });

let keypair = {
  private: `\n${key.exportKey()}\n`,
  public: `\n${key.exportKey("public")}\n`,
};

console.log(keypair);
