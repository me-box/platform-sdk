/**
 * This script copies src/client/assets/index.html into build/client/index.html
 * This is useful for our built production code.
 */

/*eslint-disable no-console */

const fs = require('fs');
const colors = require('colors');
const cheerio = require('cheerio');
const path = require('path');

fs.readFile('client/assets/index.html', 'utf8', (err, markup) => {
  if (err) {
    console.log("i--errr --current path is");
    console.log(path.resolve(__dirname));
    return console.error(err);
  }

  const $ = cheerio.load(markup);

  $('head').append('<link rel="stylesheet" href="/css/app.css">');

  console.log("path is");
  console.log(path.resolve(__dirname));

  fs.writeFile('server/views/index.html', $.html(), 'utf8', (err) => {
    if (err) {
      return console.error(err);
    }
  });

  console.log('index.html written to /build/client'.green);
});
