const fs = require('fs');
const data = fs.readFileSync(String.raw`C:\Users\darka\.gemini\antigravity\brain\7fa5fd2f-8cdc-4d7c-9346-e37d343934f1\.system_generated\steps\56\output.txt`, 'utf8');
const json = JSON.parse(data);
fs.writeFileSync(String.raw`c:\Users\darka\Downloads\Ninja Skills\s2f-dashboard\src\lib\database.types.ts`, json.types);
console.log("Types written successfully.");
