const xlsxj = require("xlsx-to-json");
const fs = require('fs');
const readline = require('readline');

const today = new Date();
const todayString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}_${today.getHours()}:${today.getSeconds()}`;
const prePath = `./${todayString}/pre.json`;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let inputFileName = '';
let sheetName = '';
let modelName = '';

const questionInputFile = () => {
    return new Promise((resolve, reject) => {
        rl.question('Input File name: [example: ./location]', insertedInputFileName => {
            inputFileName = `${insertedInputFileName}.xlsx`;
            resolve();
        });
    });
};
const questionSheetName = () => {
    return new Promise((resolve, reject) => {
        rl.question('Sheet name: ', insertedSheetName => {
            sheetName = insertedSheetName;
            resolve();
        });
    });
};
const questionModelName = () => {
    return new Promise((resolve, reject) => {
        rl.question('Your Django Model: ', insertedModelName => {
            modelName = insertedModelName;
            resolve();
        });
    });
};

const main = () => {
    questionInputFile()
    .then(res => {
        return questionSheetName();
    }).then(res => {
        return questionModelName();
    }).then(res => {
        rl.close();

        const opt = {
            input: inputFileName,
            output: prePath,
        };
        if (sheetName) {
            opt.sheet = sheetName;
        }
        
        const outputArr = [];
        fs.mkdirSync(`./${todayString}`);
        
        xlsxj(opt, function(err, result) {
            if(err) {
                console.error(err);
            }
            else {
                result.forEach((row, index) => {
                    console.log(`[${index + 1}] => ${JSON.stringify(row)}`);
                    const obj = {
                        model: modelName,
                        pk: index + 1,
                        fields: row,
                    };
                
                    outputArr.push(obj);
                });
                fs.writeFile(`./${todayString}/${todayString}-${modelName.replace(/\./, '-')}-fixture.json`, JSON.stringify(outputArr));
            }
        });
    });
}

main();






