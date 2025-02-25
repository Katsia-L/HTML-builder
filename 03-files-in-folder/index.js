const fs = require('node:fs/promises');
const path = require('path');

const filePath = path.join(__dirname, 'secret-folder');

async function secretFolder() {
  const files = await fs.opendir(filePath);

  for await (const file of files) {
    if (file.isFile()) {
      const fileFolder = path.join(filePath, file.name);
      const fileSize = await fs.stat(fileFolder);

      const nameParts = file.name.split('.');

      const name = nameParts.slice(0, -1).join('.');
      const type = nameParts[nameParts.length - 1];
      const size = Math.floor((fileSize.size / 1024) * 1000) / 1000;

      console.log(`${name} - ${type} - ${size}kb`);
    }
  }
}
secretFolder();
