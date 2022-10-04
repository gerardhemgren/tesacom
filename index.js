const fs = require('fs');
const path = require('path');
const avro = require('avsc');
const pkg = require('./input/data.json')

const schema = fs.readFileSync(path.join(__dirname, 'schema', 'Package.avsc'), 'utf-8');
const type = avro.parse(schema);

const encoded = type.toBuffer(pkg);
const decoded = type.fromBuffer(encoded);

console.log(encoded.toString('hex'));
console.log(decoded);

console.log('JSON size', Buffer.byteLength(JSON.stringify(pkg)));
console.log('Avro size', Buffer.byteLength(encoded));