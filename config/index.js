const path = require('path');
const fs = require('fs');

fs.writeFile(
  path.join(__dirname, '../build/Dockerfile'),
  [
    'FROM 172.19.93.160/node:22.17.1-slim',
    'WORKDIR /src',
    'COPY . .',
    'ENV TZ="Europe/Moscow"',
    'RUN yarn install --registry http://172.19.91.38:8081/repository/npm-central/',
    'ENV HOST 0.0.0.0',
    'EXPOSE 4000',
    'CMD [ "npm", "run", "demo" ]'
  ].join('\n\n'),
  err => {
    if (err) {
      console.log(err);
    }
  }
);

const d = new Date();

fs.writeFile(
  path.join(__dirname, '../build/LICENSE.txt'),
  [
    'MIT License',
    `Copyright (C) ${d.getFullYear()} by ldmjs`,
    'Permission is hereby granted, free of charge, to any person obtaining a copy',
    'of this software and associated documentation files (the "Software"), to deal',
    'in the Software without restriction, including without limitation the rights',
    'to use, copy, modify, merge, publish, distribute, sublicense, and/or sell',
    'copies of the Software, and to permit persons to whom the Software is',
    'furnished to do so, subject to the following conditions:',
    '\n',
    'The above copyright notice and this permission notice shall be included in',
    'all copies or substantial portions of the Software.',
    '\n',
    'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR',
    'IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,',
    'FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE',
    'AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER',
    'LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,',
    'OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN',
    'THE SOFTWARE.',
  ].join('\n'),
  err => {
    if (err) {
      console.log(err);
    }
  }
);

let pkg = fs.readFileSync(path.join(__dirname, '../build/package.json'), { encoding: 'utf-8' });
pkg = JSON.parse(pkg);
pkg.scripts = {
  demo: "cross-env NODE_ENV=production webpack serve --config webpack.config.js --progress --profile",
  pub: "node publish.js && npm publish --access=public --tag=latest && node updateVersion.js"
}
delete pkg.repository;
delete pkg.packageManager;
fs.writeFile(
  path.join(__dirname, '../build/package.json'),
  JSON.stringify(pkg, null, 2),
  err => {
    if (err) {
      console.log(err);
    }
  }
);

let webpackConfig = fs.readFileSync(path.join(__dirname, '../build/webpack.config.js'), { encoding: 'utf-8' });
webpackConfig = webpackConfig.replace('../package.json', './package.json');
webpackConfig = webpackConfig.replace('../build/release/icons.json', './release/icons.json');
fs.writeFile(
  path.join(__dirname, '../build/webpack.config.js'),
  webpackConfig,
  err => {
    if (err) {
      console.log(err);
    }
  }
);


