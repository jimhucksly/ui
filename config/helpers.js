const path = require('path');
const fs = require('node:fs');

function getComponents() {
  return new Promise((resolve, reject) => {
    const p = path.resolve(__dirname, '../src/components');

    const components = [];

    fs.readdir(p, (err, list) => {
      if (err) {
        return reject(err);
      }
      for (const f of list) {
        const item = path.join(p, f);
        const stat = fs.statSync(item);
        if (stat.isDirectory()) {
          const file = path.join(item, 'metadata.js');
          const name = require(file);
          components.push(name);
        }
      }

      return resolve(components);
    });
  });
}

module.exports = {
  getComponents
}
