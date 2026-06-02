const path = require('path');
const fs = require('fs');

(function () {
  const src = path.resolve(__dirname, './icons');
  const target = path.join(src, './parsed');

  const list = [];

  fs.readdir(src, async (err, files) => {
    for (const file of files) {
      if (/.svg$/.test(file)) {
        list.push(file);
      }
    }
    if (Array.isArray(list) && list.length > 0) {
      for (const item of list) {
        const fileSrc = path.join(src, item);
        fs.readFile(fileSrc, 'binary', (err, data) => {
          if (!err && data && typeof data === 'string') {
            const name = item.replace(/ /g, '-').toLowerCase();
            let match = '';
            match = data.match(/fill="[^"]+"/gm);
            if (match && match.length) {
              for (const i of match.filter(m => m.indexOf('none') === -1)) {
                data = data.replace(i, 'fill="currentColor"');
              }
            }
            match = data.match(/stroke="[^"]+"/gm);
            if (match && match.length) {
              for (const i of match.filter(m => m.indexOf('none') === -1)) {
                  data = data.replace(i, 'stroke="currentColor"');
              }
            }
            const fileDest = path.join(target, name);
            fs.writeFileSync(fileDest, data);
          }
        });
      }
    }
  });
})();