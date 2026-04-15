const fs = require('fs');
const path = require('path');

(function clear() {
  for (const p of ['build']) {
    const dir = path.resolve(__dirname, `../${p}`);
    fs.rm(dir, { recursive: true, force: true }, err => {
      if (err) {
        throw err;
      }
      console.log(`${dir} is deleted!`);
    });
  }
})();
