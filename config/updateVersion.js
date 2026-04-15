const path = require('path');
const fs = require('fs');
const { version } = require('./package.json');

function updateVersion() {
  try {
    const paths = ['../package.json', '../src/demo/version.json', './release/version.json'];
    for (const p of paths) {
      const text = fs.readFileSync(path.resolve(__dirname, p), { encoding: 'utf-8' });
      const json = JSON.parse(text);
      json.version = version;
      const data = JSON.stringify(json, null, 2) + '\n';
      fs.writeFileSync(path.resolve(__dirname, p), data);
    }
  } catch (e) {
    /* eslint-disable no-console */
    console.log(e);
  }
};

updateVersion();