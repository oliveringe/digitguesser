import fs from "fs";

export function objectToJsonFile(object, filename) {
    fs.writeFileSync(filename, JSON.stringify(object, null, 4));
    console.log("File saved as " + filename);
}
