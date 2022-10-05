const fs = require('fs');
const path = require('path');
const avro = require('avsc');
const pkg = require('./input/data.json')

// Ejemplo 1

function exampleOne() {
    try {
        const schema = fs.readFileSync(path.join(__dirname, 'schema', 'Package.avsc'), 'utf-8');
        const type = avro.parse(schema);
        const encoded = type.toBuffer(pkg);
        const decoded = type.fromBuffer(encoded);
        const re = () => {
            console.log(encoded.toString('hex'));
            console.log(decoded);
            console.log('JSON size', Buffer.byteLength(JSON.stringify(pkg)));
            console.log('Avro size', Buffer.byteLength(encoded));
            console.log('________')
        };
        return re();
    } catch (e) {
        console.log(e);
        return false;
    }
}

// Otro Ejemplo de deserialización

function exampleTwo() {
    try {
        const schema = fs.readFileSync(path.join(__dirname, 'schema', 'PackageTwo.avsc'), 'utf-8');
        const type = avro.parse(schema);
        const trama = Buffer.from([1, 2, 3]); 
        const decoded = type.fromBuffer(trama);
        return console.log(decoded);
    } catch (e) {
        console.log('can not decode', e);
        return false;
    }
}

exampleOne();
exampleTwo();