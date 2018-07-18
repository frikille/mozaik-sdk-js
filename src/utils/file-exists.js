const fs = require('fs');

module.exports = function fileExists(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.isFile();
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }

    throw err;
  }
};
