import fs from 'fs';
import path from 'path';

const DEFAULT = {js: 'app.js', css: 'app.css'};

const APP_JS_PATTERN = /^app\-\w+\.js$/;
const APP_CSS_PATTERN = /^app\-\w+\.css$/;

export default function getAppAssetFilenamesAsync() {

  try {
    const buildDir = path.resolve(__dirname, '..', '..', '..', 'build');
    const buildDirFiles = fs.readdirSync(buildDir);

    return {
      js: buildDirFiles.find(filename => APP_JS_PATTERN.test(filename)),
      css: buildDirFiles.find(filename => APP_CSS_PATTERN.test(filename))
    };
  } catch (e) {
    return DEFAULT;
  }
}
