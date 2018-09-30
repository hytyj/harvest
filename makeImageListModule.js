"use strict";

var path = require("path"),
  fs = require("fs"),
  os = require('os'),
  through = require("through2"), 
  exec = require('child_process').exec,
 iconv = require('iconv-lite'),
  uglifyjs = require("uglify-js");


  // 获取相对目录
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

let outLoadingFilePath = resolve('develop/src/imgs/loading.txt');

function getExt(file){
  var arr = file.split('.');
  var len = arr.length;
  return arr[len-1];
}

let imgsDir = resolve('develop/src/imgs');
var retArray = [];
function readDirSync (path) {
    var pa = fs.readdirSync(path);
    pa.forEach(function (ele, index) {
      var info = fs.statSync(path + "/" + ele)
      if (info.isDirectory()) {
        console.log("dir: " + ele)
        readDirSync(path + "/" + ele);
      } else {
        var orgFilePath = path + "/" + ele;
        var filePath = orgFilePath.replace(imgsDir, '');
        let ext = getExt(filePath);
        if (ext != 'txt') { 
          retArray.push(filePath.substring(1));
        }
      }
  })
  
  return retArray;
}

function writeFile(data){
  var data = data.join("\n");
  fs.writeFileSync(outLoadingFilePath, data);
}

function run (cb) { 
  let fileList = readDirSync(imgsDir)
  writeFile(fileList);
  cb();
}

module.exports = function (options) {
  return through.obj(function (file, enc, cb) {
      run(cb);
  });
};

