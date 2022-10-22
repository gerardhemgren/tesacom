//data and schema both are corrupted
//data
const exampleOne = {
    "PTemp": 200,
    "UValue": 31,
    "Error": 0,
    "Error": 0,
    "Error": 0,
    "PTemp_C_2_Avg": 8813.5005,
};

const exampleTwo = {
    "XTemp": 1203355555,
    "ATemp": 33,
    "XTemp_H_3_Avg": 4267.0004002,
    "ATemp_G_11_Avg": 55.03
};

//Schema
const schemaOne = [
    {
        tag: "ErrorTag",
        type: "ErrorType",
        len: 0,
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
        len: 2,
    },
];

const schemaTwo = [
    {
        tag: "XTemp",
        type: "int",
        len: 16,
    }, {
        tag: "ATemp",
        type: "uint",
        len: 8,
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

function data(example, schema) {
    const mergedSchema = [];
    dataKeys = Object.keys(example);
    for (key in dataKeys) {
        const typeFromSchema = schema.find(t => t.tag === dataKeys[key])?.type;
        const tagFromSchema = schema.find(t => t.tag === dataKeys[key])?.tag;
        const lenFromSchema = schema.find(t => t.tag === dataKeys[key])?.len;
        const valueFromExample = example[tagFromSchema];
        const sizeFromSchema = (len) => {
            if (len <= 7) {
                return 1;
            } else if (len >= 8 & len <= 15) {
                return 2;
            } else {
                return 4
            }
        };
        tempObject = {
            tag: tagFromSchema,
            value: valueFromExample,
            type: typeFromSchema,
            len: lenFromSchema,
            size: sizeFromSchema(lenFromSchema),
        };
        if (tagFromSchema) {
            mergedSchema.push(tempObject);
        }
    }
    totalSize = mergedSchema.reduce((p, c) => p + c.size, 0)
    return { mergedSchema, totalSize };
}

//encode
function encode(data) {
    try {
        const buffer = new ArrayBuffer(data.totalSize);
        const dataView = new DataView(buffer);

        let i = 0;
        for (d in data.mergedSchema) {

            switch (data.mergedSchema[d].type) {
                case 'int':
                    if (data.mergedSchema[d].size === 1) {
                        dataView.setInt8(i, data.mergedSchema[d].value);
                        i = i + 1;
                        break;

                    }
                    else if (data.mergedSchema[d].size === 2) {
                        dataView.setInt16(i, data.mergedSchema[d].value);
                        i = i + 2;
                        break;

                    }
                    else if (data.mergedSchema[d].size === 4) {
                        dataView.setInt32(i, data.mergedSchema[d].value);
                        i = i + 4;
                        break;

                    }

                case 'uint':
                    if (data.mergedSchema[d].size === 1) {
                        dataView.setUint8(i, data.mergedSchema[d].value);
                        i = i + 1;
                        break;

                    }
                    else if (data.mergedSchema[d].size === 2) {
                        dataView.setUint16(i, data.mergedSchema[d].value);
                        i = i + 2;
                        break;

                    }
                    else if (data.mergedSchema[d].size === 4) {
                        dataView.setUInt32(i, data.mergedSchema[d].value);
                        i = i + 4;
                        break;

                    }


                case 'float':
                    dataView.setFloat32(i, data.mergedSchema[d].value);
                    i = i + 4;
                    break;

                default:
                    break;
            }
        }

        const size = dataView.byteLength;
        let hex = Buffer.from(dataView.buffer).toString('hex');
        const buff = Buffer.from(dataView.buffer);

        return { dataView, size, hex, buff, data };
    } catch (error) {
        console.log(error);
    }
}

//decode
const decode = (encode) => {
    let _object = {};

    try {
        let dataView = encode?.dataView;
        let data = encode?.data;

        let i = 0;
        for (d in data.mergedSchema) {

            switch (data.mergedSchema[d].type) {
                case 'int':
                    if (data.mergedSchema[d].size === 1) {
                        _object[data.mergedSchema[d].tag] = dataView.getInt8(i);
                        i = i;
                        break;

                    }
                    else if (data.mergedSchema[d].size === 2) {
                        _object[data.mergedSchema[d].tag] = dataView.getInt16(i);
                        i = i + 1;
                        break;

                    }
                    else if (data.mergedSchema[d].size === 4) {
                        _object[data.mergedSchema[d].tag] = dataView.getInt32(i);
                        i = i + 3;
                        break;

                    }

                case 'uint':
                    if (data.mergedSchema[d].size === 1) {
                        _object[data.mergedSchema[d].tag] = dataView.getUint8(i);
                        i = i;
                        break;

                    }
                    else if (data.mergedSchema[d].size === 2) {
                        _object[data.mergedSchema[d].tag] = dataView.getUint16(i);
                        i = i + 1;
                        break;

                    }
                    else if (data.mergedSchema[d].size === 4) {
                        _object[data.mergedSchema[d].tag] = dataView.getUint32(i);
                        i = i + 3;
                        break;

                    }

                case 'float':
                    _object[data.mergedSchema[d].tag] = dataView.getFloat32(i);
                    i = i + 3;
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
console.log(decode(encode(data(exampleOne, schemaOne))));
console.log('HEX:', encode(data(exampleOne, schemaOne))?.hex);
console.log(encode(data(exampleOne, schemaOne))?.buff);
console.log('Size:', encode(data(exampleOne, schemaOne))?.size);

console.log(`
ExampleTwo
`)
console.log(decode(encode(data(exampleTwo, schemaTwo))));
console.log('HEX:', encode(data(exampleTwo, schemaTwo))?.hex);
console.log(encode(data(exampleTwo, schemaTwo))?.buff);
console.log('Size:', encode(data(exampleTwo, schemaTwo))?.size);