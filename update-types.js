const fs = require('fs');
const path = require('path');
const p = "C:\\Users\\darka\\.gemini\\antigravity\\brain\\7fa5fd2f-8cdc-4d7c-9346-e37d343934f1\\.system_generated\\steps\\179\\output.txt";
const data = JSON.parse(fs.readFileSync(p, 'utf8'));
fs.writeFileSync("src/lib/database.types.ts", data.types, "utf8");
console.log("Types written.");
