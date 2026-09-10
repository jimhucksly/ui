const fs = require('fs');
const path = require('path');

(function clear() {
  // const nodePath = process.argv[0];
  // const appPath = process.argv[1];
  const dir = process.argv[2];

  for (const p of [dir]) {
    const dir = path.join(__dirname, p);
    fs.rm(dir, { recursive: true, force: true }, err => {
      if (err) {
        throw err;
      }
      console.log(`${dir} is deleted!`);
    });
  }
})();
