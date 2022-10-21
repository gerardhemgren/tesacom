//data and schema both are corrupted
//data
const exampleOne = {
    "PTemp": 32767,
    "UValue": 31,
    "Error": 0,
    "Error": 0,
    "Error": 0,
    "PTemp_C_2_Avg": 8813.5005,
};

const exampleTwo = {
    "XTemp": 120,
    "ATemp": 33,
    "XTemp_H_3_Avg": 4267.0004002,
    "ATemp_G_11_Avg": 55.03
};

//Schema
const schemaOne = [
    {
        tag: "ErrorTag",
        type: "ErrorType",
        len: 1,
    },
    {
        tag: "PTemp_C_2_Avg",
        type: "float",
    },
    {
        tag: "UValue",
        type: "int",
        len: 2,
    },
    {
        tag: "PTemp",
        type: "uint",
        len: 10,
    },
];

const schemaTwo = [
    {
        tag: "XTemp",
        type: "int",
    }, {
        tag: "ATemp",
        type: "uint",
    },
    {
        tag: "XTemp_H_3_Avg",
        type: "float",
    },
    {
        tag: "ATemp_G_11_Avg",
        type: "float",
    }
];

let dataKeys;

//encode
function encode(data, schema) {
    dataKeys = Object.keys(data);
    if (dataKeys.length !== schema.length) {
        return null;
    }
    try {
        const buffer = new ArrayBuffer((schema.length * 4));
        const dataView = new DataView(buffer);
        const size = dataView.byteLength;

        let i = 0;
        for (key in dataKeys) {
            const typeFromSchema = schema.find(t => t.tag === dataKeys[key])?.type;
            switch (typeFromSchema) {
                case 'int':
                    dataView.setInt8(i * 4, data[dataKeys[key]]);
                    break;

                case 'uint':
                    dataView.setUint16(i * 4, data[dataKeys[key]]);
                    break;

                case 'float':
                    dataView.setFloat32(i * 4, data[dataKeys[key]]);
                    break;

                default:
                    i--;
                    break;
            }
            i++;
        }

        let hex = Buffer.from(dataView.buffer).toString('hex');
        const buff = Buffer.from(dataView.buffer);

        return { dataView, size, hex, buff };
    } catch (error) {
        console.log(error);
    }
}

//decode
const decode = (view, schema) => {
    let _object = {};

    try {
        let dataView = view?.dataView;
        let i = 0;
        for (let key in dataKeys) {
            const typeFromSchema = schema.find(t => t.tag === dataKeys[key])?.type;

            switch (typeFromSchema) {
                case 'int':
                    _object[dataKeys[key]] = dataView.getInt8(i * 4);
                    break;

                case 'uint':
                    _object[dataKeys[key]] = dataView.getUint16(i * 4);
                    break;

                case 'float':
                    _object[dataKeys[key]] = dataView.getFloat32(i * 4);
                    break;

                default:
                    break;
            }
            i++;
        }
        return _object;
    } catch (error) {
        console.log(error)
    }
};

console.log(`
ExampleOne
`)
console.log(decode(encode(exampleOne, schemaOne), schemaOne));
console.log('HEX:', encode(exampleOne, schemaOne)?.hex);
console.log('Buffer:', encode(exampleOne, schemaOne)?.buff);
console.log('Size:', encode(exampleOne, schemaOne)?.size);

console.log(`
ExampleTwo
`)
console.log(decode(encode(exampleTwo, schemaTwo), schemaTwo));
console.log('HEX:', encode(exampleTwo, schemaTwo)?.hex);
console.log('Buffer:', encode(exampleTwo, schemaTwo)?.buff);
console.log('Size:', encode(exampleTwo, schemaTwo)?.size);