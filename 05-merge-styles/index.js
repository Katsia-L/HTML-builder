const fs = require('node:fs/promises');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const outputPath = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputPath, 'bundle.css');

async function margeStyles() {
  const files = await fs.opendir(stylesPath);
  let newCss = '';

  for await (const file of files) {
    if (path.extname(file.name) === '.css') {
      const filePath = path.join(stylesPath, file.name);
      const fileContent = await fs.readFile(filePath);

      newCss += fileContent + '\n';
    }
    await fs.mkdir(outputPath, { recursive: true });
    await fs.writeFile(outputFile, newCss);
  }
  console.log('compiled');
}
margeStyles();
