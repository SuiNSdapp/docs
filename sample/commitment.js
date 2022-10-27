const { utils } = require("ethers");

DOMAIN_NAME=process.argv[2]
OWNER_ADDR=process.argv[3]
SECRET=process.argv[4]

const fromHexString = (hexString) =>
  Array.from(hexString.match(/.{1,2}/g).filter((byte) => byte != '0x').map((byte) => parseInt(byte, 16)));
let encoder = new TextEncoder();
let concatArray =
  new Uint8Array([ ...encoder.encode(DOMAIN_NAME), ...fromHexString(OWNER_ADDR), ...encoder.encode(SECRET) ]);

console.log('[' + fromHexString(utils.keccak256(concatArray).slice(2)).join() + ']')