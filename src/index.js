const path = require('path');
const fs = require('fs');

(function () {
  const config = require('./index.config.json');
  const map = config.map;
  const fromPath = path.resolve(__dirname, '../__barahlo');
  const toPath = path.resolve(__dirname, './');

  const replaceByMap = (file) => {
    let data = fs.readFileSync(file, { encoding: 'utf-8' });
    for (const m of map) {
      const regexp = new RegExp(m[0], 'gm');
      data = data.replace(regexp, m[1]);
    }
    return data;
  }

  const copyScss = () => {
    const files = fs.readdirSync(path.resolve(fromPath, './scss'));
    const dir = path.resolve(toPath, './scss');
    for (const f of files) {
      const data = replaceByMap(path.resolve(fromPath, './scss' + '/' + f));
      const exist = fs.existsSync(dir);
      if (!exist) {
        fs.mkdirSync(dir);
      }
      fs.writeFile(path.resolve(toPath, './scss' + '/' + f), data, err => {
        if (err) {
          console.log(err);
        }
      });
    }
  }

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
        const data = replaceByMap(from.file);
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
        return;
      }
      if (!/^ld-/.test(f)) {
        return;
      }
      // copy ld-
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
