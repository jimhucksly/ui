const path = require('path');
const fs = require('fs');

function getComponentsList() {
  return new Promise((resolve, reject) => {
    const p = path.resolve(__dirname, '../src');

    const regExp = new RegExp(/^ld-/);

    const list = [];

    return fs.readdir(p, (err, arr) => {
      if (err) {
        return reject(err);
      }
      for (const el of Array.from(arr)) {
        const item = path.resolve(p, './' + el);
        const stat = fs.statSync(item);
        if (stat.isDirectory() && regExp.test(el)) {
          const metadata = path.resolve(item, './metadata.js');
          if (fs.existsSync(metadata)) {
            const name = require(metadata);
            list.push(name);
          }
        }
      }
      return resolve(list);
    });
  });
}

function getExternalsList(components) {
  const externals = {};

  for (const cmp of components) {
    if (skip.includes(cmp)) {
      continue;
    }
    externals[`@/${cmp}/${cmp}.vue`] = `./components/${cmp}.js`;
  };
  return externals;
}

function getEntryList(components) {
  const entry = {};

  for (const cmp of components) {
    if (skip.includes(cmp)) {
      continue;
    }
    entry[cmp] = path.join(__dirname, '../src/' + cmp + `/${cmp}.vue`);
  };

  return entry;
}

function getIconsList() {
  const p = path.resolve(__dirname, '../src/ld-icon/icons');

  const list = [];

  return new Promise((resolve, reject) => {
    return fs.readdir(p, (err, files) => {
      if (err) {
        return reject(err);
      }
      for (const file of Array.from(files)) {
        if (/.svg$/.test(file)) {
          list.push(file);
        }
      }
      return resolve(list);
    });
  });
}

module.exports = {
  getIconsList,
  getComponentsList,
  getExternalsList,
  getEntryList
}
