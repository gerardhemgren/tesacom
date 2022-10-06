const fs = require('fs');
const path = require('path');
const avro = require('avsc');
const pkg = require('./input/data.json')

// Ejemplo 1

function exampleOne() {
    try {
        const schema = fs.readFileSync(path.join(__dirname, 'schema', 'Package.avsc'), 'ascii');
        const type = avro.parse(schema);
        const encoded = type.toBuffer(pkg);
        const decoded = type.fromBuffer(encoded);
        const size = {
            json: Buffer.byteLength(JSON.stringify(pkg)),
            avro: Buffer.byteLength(encoded)
        };
        return { encoded, decoded, size };
    } catch (e) {
        console.log(e);
        return false;
    }
}

// Otro Ejemplo de deserialización

function exampleTwo() {
    try {
        const schema = fs.readFileSync(path.join(__dirname, 'schema', 'PackageTwo.avsc'), 'ascii');
        const type = avro.parse(schema);
        const trama = '0x010203';
        const transformedTrama = Buffer.from(trama.slice(2), 'hex');
        const decoded = type.fromBuffer(transformedTrama);
        return { decoded, trama, transformedTrama };
    } catch (e) {
        console.log('can not decode', e);
        return false;
    }
}

console.log('hex encoded: ', exampleOne().encoded.toString('hex'));
console.log('JSON size', exampleOne().size.json);
console.log('Avro size', exampleOne().size.avro);
console.log(exampleOne().decoded);

console.log(``)

console.log(exampleTwo().transformedTrama);
console.log(exampleTwo().decoded);