const fs = require('fs');
const env = require('node-env-file');

// Try to read values from .env. If that fails
// simply use the environment vars on the machine.
env(__dirname + '/.env', {
   raise: false,
   overwrite: true
});

var logging = process.env.LOG || `off`;

function isVSTS(instance) {
   return instance.toLowerCase().match(/http/) === null;
}

var logMessage = function (msg) {
   if (logging === `on`) {
      console.log(msg);
   }
};

var logJSON = function (msg) {
   if (logging === `on`) {
      console.log(JSON.stringify(JSON.parse(msg), null, 2));
   }
};

var deleteFolderRecursive = function (path) {
   if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function (file, index) {
         var curPath = path + "/" + file;

         if (fs.lstatSync(curPath).isDirectory()) { // recursive
            deleteFolderRecursive(curPath);
         } else { // delete file
            fs.unlinkSync(curPath);
         }
      });

      fs.rmdirSync(path);
   }
};

module.exports = {

   // Exports the portions of the file we want to share with files that require
   // it.

   rmdir: deleteFolderRecursive,
   log: logMessage,
   logJSON: logJSON,
   isVSTS: isVSTS
};