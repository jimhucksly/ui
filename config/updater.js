const path = require('path');
const fs = require('fs');

const config = require('./index.config.json');
const map = config.map;
const exclude = config.exclude;

class Utils {
  getExtension = (filename) => {
    if (!filename) {
      return '';
    }
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
  }

  getFileName = (filename) => {
    if (!filename) {
      return '';
    }
    const extension = this.getExtension(filename);
    return filename.slice(0, -extension.length - 1);
  }
  replaceDataByMap = (filePath) => {
    let data = fs.readFileSync(filePath, { encoding: 'utf-8' });
    for (const m of map) {
      const regexp = new RegExp(m[0], 'gm');
      data = data.replace(regexp, m[1]);
    }
    return data;
  }
  replaceFileByMap = (filename) => {
    const m = map.find(i => filename.indexOf(i[0]) > -1);
    if (!m) {
      return filename;
    }
    const regexp = new RegExp(m[0], 'gm');
    return filename.replace(regexp, m[1]);
  }
}

const $utils = new Utils();

const copyDir = (src, dest) => {
  let entries = fs.readdirSync(src, { recursive: true, withFileTypes: true });
  for (let entry of entries) {
    let srcPath = path.join(entry.path, entry.name);
    let destPath = srcPath.replace(src, dest);
    let destDir = path.dirname(destPath);

    if (entry.isFile()) {
      fs.mkdirSync(destDir, { recursive: true })
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const copyFiles = (src, dest) => {
  let entries = fs.readdirSync(src, { recursive: true, withFileTypes: true });
  for (let entry of entries) {
    let srcPath = path.join(entry.path, entry.name);
    let destPath = path.join(dest, entry.name);
    let destDir = path.dirname(destPath);
    if (entry.isFile()) {
      fs.mkdirSync(destDir, { recursive: true })
      const data = $utils.replaceDataByMap(srcPath);
      fs.writeFile(destPath, data, err => {
        if (err) {
          console.log(err);
        }
      });
    }
  }
}

(function () {
  const fromPath = path.resolve(__dirname, '../__barahlo');
  const toPath = path.resolve(__dirname, './');

  const copyDemo = () => {
    const files = fs.readdirSync(path.resolve(fromPath, './demo'));
    const dir = path.resolve(toPath, './demo');
    const exist = fs.existsSync(dir);
    if (!exist) {
      fs.mkdirSync(dir);
    }
    for (const f of files) {
      const stat = fs.lstatSync(path.resolve(fromPath, './demo' + '/' + f));
      if (stat.isDirectory()) {
        const srcPath = path.resolve(fromPath, './demo' + '/' + f);
        const destPath = path.resolve(toPath, './demo' + '/' + f)
        if (['fonts', 'img', 'scss', 'mixins'].includes(f)) {
          copyDir(srcPath, destPath);
        } else {
          copyFiles(srcPath, destPath);
        }
      } else {
        const fname = $utils.getFileName(f);
        if (exclude.some(e => fname.indexOf(e) > -1)) {
          continue;
        }
        const data = $utils.replaceDataByMap(path.resolve(fromPath, './demo' + '/' + f));
        fs.writeFile(path.resolve(toPath, './demo' + '/' + f), data, err => {
          if (err) {
            console.log(err);
          }
        });
      }
    }
  }

  const copyScss = () => {
    const files = fs.readdirSync(path.resolve(fromPath, './scss'));
    const dir = path.resolve(toPath, './scss');
    const exist = fs.existsSync(dir);
    if (!exist) {
      fs.mkdirSync(dir);
    }
    for (const f of files) {
      const data = $utils.replaceDataByMap(path.resolve(fromPath, './scss' + '/' + f));
      fs.writeFile(path.resolve(toPath, './scss' + '/' + f), data, err => {
        if (err) {
          console.log(err);
        }
      });
    }
  }

  copyTests = () => {
    const files = fs.readdirSync(path.resolve(fromPath, './__tests__'));
    const dir = path.resolve(toPath, './__tests__');
    const exist = fs.existsSync(dir);
    if (!exist) {
      fs.mkdirSync(dir);
    }
    for (const f of files) {
      const data = $utils.replaceDataByMap(path.resolve(fromPath, './__tests__' + '/' + f));
      const newFile = $utils.replaceFileByMap(f);
      fs.writeFile(path.resolve(toPath, './__tests__' + '/' + newFile), data, err => {
        if (err) {
          console.log(err);
        }
      });
    }
  }

  const copy = (f) => {
    const files = fs.readdirSync(path.resolve(fromPath, './' + f));
    for (const itemToCopy of files) {
      const from = {
        path: f,
        file: itemToCopy,
      }
      const to = {
        path: map.find(i => i[0] === f)[1],
        file: itemToCopy,
      }

      if (itemToCopy.indexOf(f) > -1) {
        to.file = itemToCopy.replace(f, to.path);
      }

      from.file = path.resolve(fromPath, './' + from.path + '/' + from.file);
      to.file = path.resolve(toPath, './' + to.path + '/' + to.file);

      const stat = fs.lstatSync(from.file);
      if (stat.isDirectory()) {
        copyDir(from.file, to.file);
      } else {
        const dir = path.resolve(toPath, './' + to.path);
        const data = $utils.replaceDataByMap(from.file);
        const exist = fs.existsSync(dir);
        if (!exist) {
          fs.mkdirSync(dir);
        }
        fs.writeFile(to.file, data, err => {
          if (err) {
            console.log(err);
          }
        });
      }
    }
  }

  fs.readdir(fromPath, async (err, files) => {
    for (f of files) {
      // copy scss
      if (f === 'scss') {
        const dir = path.resolve(toPath, './' + f);
        const exist = fs.existsSync(dir);
        if (exist) {
          fs.rm(dir, { recursive: true, force: true }, err => {
            if (err) {
              throw err;
            }
            copyScss();
          });
        } else {
          copyScss();
        }
        continue;
      }
      // copy demo
      if (f === 'demo') {
        const dir = path.resolve(toPath, './' + f);
        const exist = fs.existsSync(dir);
        if (exist) {
          fs.rm(dir, { recursive: true, force: true }, err => {
            if (err) {
              throw err;
            }
            copyDemo();
          });
        } else {
          copyDemo();
        }
        continue;
      }
      // copy tests
      if (f === '__tests__') {
        const dir = path.resolve(toPath, './' + f);
        const exist = fs.existsSync(dir);
        if (exist) {
          fs.rm(dir, { recursive: true, force: true }, err => {
            if (err) {
              throw err;
            }
            copyTests();
          });
        } else {
          copyTests();
        }
        continue;
      }
      if (!/^ld-/.test(f)) {
        continue;
      }
      // copy ld-
      const exclude = !map.some(i => i[0] === f);
      if (exclude) {
        continue;
      }
      const dir = path.resolve(toPath, './' + f);
      const exist = fs.existsSync(dir);
      if (exist) {
        fs.rm(dir, { recursive: true, force: true }, err => {
          if (err) {
            throw err;
          }
          copy(f);
        });
      } else {
        copy(f);
      }
    }
  });
})();
