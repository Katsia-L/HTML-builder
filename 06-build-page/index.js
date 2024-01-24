const fs = require('node:fs/promises');
const path = require('path');

const assetsPath = path.join(__dirname, 'assets');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const templatePath = path.join(__dirname, 'template.html');
const projectDistPath = path.join(__dirname, 'project-dist');

const outputPath = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputPath, 'style.css');

async function buildPage() {
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
  }


  async function copyAssets(filePath, fileCopyPath) {
    const files = await fs.opendir(filePath);

    for await (const file of files) {
      const exampleFile = path.join(filePath, file.name);
      const copiedFile = path.join(fileCopyPath, file.name);

      if (file.isDirectory()) {
        await copyAssets(exampleFile, copiedFile);
      } else {
        await fs.mkdir(fileCopyPath, { recursive: true });
        await fs.copyFile(exampleFile, copiedFile);
      }
    }
  }


  async function components(template, componentsPath) {
    const components = await fs.opendir(componentsPath);

    for await (const component of components) {
      const componentName = component.name.split('.').slice(0, -1).join('.');
      const componentPath = path.join(componentsPath, component.name);
      const componentContent = await fs.readFile(componentPath, 'utf-8');
      const componentTag = `{{${componentName}}}`;

      template = template.replace(componentTag, componentContent);
    }
    return template;
  }

  let templateContent = await fs.readFile(templatePath, 'utf-8');
  templateContent = await components(templateContent, componentsPath);


  await fs.mkdir(projectDistPath, { recursive: true });
  await fs.writeFile(path.join(projectDistPath, 'index.html'), templateContent, 'utf-8');
  await margeStyles(stylesPath);
  await copyAssets(assetsPath, path.join(projectDistPath, 'assets'));

  console.log('Build complete');
}
buildPage();
