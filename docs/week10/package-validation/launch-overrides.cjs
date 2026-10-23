const fs = require('node:fs');
const actual = require(process.env.WF007_REAL_PLAYWRIGHT);
const launch = actual.chromium.launch.bind(actual.chromium);
const downloads = process.env.WF007_DOWNLOAD_DIR;
if (!downloads) throw new Error('Set WF007_DOWNLOAD_DIR to an external writable directory');
fs.mkdirSync(downloads, { recursive: true });
actual.chromium.launch = (options = {}) => launch({ ...options, downloadsPath: downloads });
module.exports = actual;
