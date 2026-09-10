const path = require('path');
const fs = require('fs');

const dir = process.argv[2];

fs.mkdirSync(path.join(__dirname, dir));

fs.writeFile(
  path.join(__dirname, dir, 'index.html'),
  [
    '<!DOCTYPE html>',
    '<html lang="ru">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta http-equiv="x-ua-compatible" content="ie=edge">',
    '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">',
    '<meta http-equiv="Cache-control" content="no-cache, no-store, must-revalidate">',
    '<meta http-equiv="Pragma" content="no-cache">',
    '<link rel="icon" href="favicon.ico">',
    '<title>DN-WEB UI STARTING...</title>',
    '<style>',
    'html, body {background: rgb(22, 22, 22); width: 100%;height: 100%;overflow: hidden}',
    '</style>',
    '<script>',
    'setTimeout(() => {window.location.reload()}, 1000);',
    '</script>',
    '</head>',
    '<body>',
    '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">',
    '<span style="font-family: Montserrat; letter-spacing: 0.5px; font-weight: bold; color: rgba(255, 255, 255, 0.6);">DN-WEB UI STARTING...</span>',
    '</div>',
    '</body>',
    '</html>',
  ].join('\n'),
  err => {
    if (err) {
      console.log(err);
    }
  }
);
