const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');

const filePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath);

stdout.write('WRITE SOMETHING:\n');

stdin.on('data', (chunk) => {
  if (chunk.toString().includes('exit')) process.exit();
  writeStream.write(chunk);
});

process.on('exit', () => {
  stdout.write('EXIT');
});

process.on('SIGINT', () => process.exit());
