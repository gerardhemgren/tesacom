//data
const exampleOne = {
    "PTemp": 268,
    "UValue": 4294967295,
    "PTemp_C_2_Avg": 0.55
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
        tag: "PTemp",
        type: "int",
    },
    {
        tag: "UValue",
        type: "uint",
    },
    {
        tag: "PTemp_C_2_Avg",
        type: "float",
    }
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
            const typeFromSchemaTag = schema.find(t => t.tag === dataKeys[key])?.type;

            switch (typeFromSchemaTag) {
                case 'int':
                    dataView.setInt32(i * 4, data[dataKeys[key]]);
                    break;

                case 'uint':
                    dataView.setUint32(i * 4, data[dataKeys[key]]);
                    break;

                case 'float':
                    dataView.setFloat32(i * 4, data[dataKeys[key]]);
                    break;

                default:
                    break;
            }
            i++;
        }

        const hex = Buffer.from(dataView.buffer).toString('hex');

        return { dataView, size, hex };
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
            const typeFromSchemaTag = schema.find(t => t.tag === dataKeys[key])?.type;

            switch (typeFromSchemaTag) {
                case 'int':
                    _object[dataKeys[key]] = dataView.getInt32(i * 4);
                    break;

                case 'uint':
                    _object[dataKeys[key]] = dataView.getUint32(i * 4);
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

console.log(decode(encode(exampleOne, schemaOne), schemaOne));
console.log(encode(exampleOne, schemaOne)?.size);

console.log(decode(encode(exampleTwo, schemaTwo), schemaTwo));
console.log(encode(exampleTwo, schemaTwo)?.size);

console.log('HEX from exampleTwo:', encode(exampleTwo, schemaTwo)?.hex);