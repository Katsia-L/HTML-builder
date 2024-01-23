const fs = require('node:fs/promises');
const path = require('path');

const filePath = path.join(__dirname, 'files');
const fileCopyPath = path.join(__dirname, 'files-copy');

async function copyDir() {
  const files = await fs.opendir(filePath);
  const filesCopy = await fs.opendir(fileCopyPath);

  for await (const file of filesCopy) {
    await fs.unlink(path.join(fileCopyPath, file.name));

    console.log(`${file.name} - deleted from "files-copy"`);
  }

  for await (const file of files) {
    const exampleFile = path.join(filePath, file.name);
    const copiedFile = path.join(fileCopyPath, file.name);

    await fs.mkdir(fileCopyPath, { recursive: true });
    await fs.copyFile(exampleFile, copiedFile);

    console.log(`${file.name} - copied to "files-copy"`);
  }
}
copyDir();
