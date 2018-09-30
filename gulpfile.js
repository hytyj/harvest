"use strict";

/**
 *  调试直接执行命令gulp
 *  正式直接执行命令gulp --env build
 *
 *  注：正式打包将先执行调试打包，从调试文件夹dev获取资源，进行正式打包
 *
 *  开发文件夹根目录 src
 *  调试文件夹根目录 dev
 *  正式文件夹根目录 dist
 */

let gulp = require("gulp"),
  path = require("path"),
  through = require("through2"), //文件修改
  minimist = require("minimist"), //获取命令行参数
  del = require("del"), //删除文件
  browserSync = require("browser-sync").create(), //同步服务
  cleanCSS = require("gulp-clean-css"), //压缩css插件
  concatCss = require("gulp-concat-css"), //合并css
  autoprefixer = require("autoprefixer"), //补全css样式
  postcss = require("gulp-postcss"), //pxtorem
  changed = require("gulp-changed"),
  px2rem = require("postcss-px2rem"), //pxtorem
  uglify = require("gulp-uglify"), //压缩js插件
  babel = require("gulp-babel"), //es6语法处理
  plumber = require("gulp-plumber"), // 错误处理
  requirejsOptimize = require("gulp-requirejs-optimize"), //requirejs合并js
  gulpSequence = require("gulp-sequence"), //顺序执行插件
  watch = require("gulp-watch"); //监视器

// 获取相对目录
function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

let makeImageList = require(resolve("./appDeveloperDemo/makeImageListModule"));

let postcss_rem_unit = 75; //pxtorem 设置

//开发目录
let src_path = "./src",
  src_css_path = src_path + "/css",
  src_imgs_path = src_path + "/imgs",
  src_js_path = src_path + "/js",
  src_lib_path = src_path + "/lib",
  src_data_path = src_path + "/data";

//开发调试目录
let dev_path = "./dev",
  dev_css_path = dev_path + "/css",
  dev_imgs_path = dev_path + "/imgs",
  dev_js_path = dev_path + "/js",
  dev_lib_path = dev_path + "/lib",
  dev_data_path = dev_path + "/data";

//正式打包目录
let dist_path = "./dist",
  dist_css_path = dist_path + "/css",
  dist_imgs_path = dist_path + "/imgs",
  dist_js_path = dist_path + "/js",
  dist_lib_path = dist_path + "/lib",
  dist_data_path = dist_path + "/data";

//命令行获取参数
let envOption = {
  string: "env",
  default: {
    env: process.env.NODE_ENV || "production"
  }
};
let options = minimist(process.argv.slice(2), envOption);

gulp.task("default", function(cb) {
  console.log("start gulp!");

  if (options.env == "build") {
    /**
     * 正式打包
     * gulp --env build
     */
    gulpSequence(
      "clean-dev",
      [
        "clean-dev-js",
        "copy-dev-index",
        "copy-dev-lib",
        "copy-dev-img",
        "copy-dev-iconfont",
        "copy-dev-html",
        "copy-dev-data"
      ],
      "flexiblecss",
      "build-es6",
      "build-constant",
      "clean-dist",
      ["copy-lib", "copy-img", "copy-iconfont", "copy-index", "copy-data"],
      "minifycss",
      "rjs",
      cb
    );
  } else {
    /**
     * 开发环境
     */
    gulpSequence(
      "clean-dev",
      [
        "clean-dev-js",
        "copy-dev-lib",
        "copy-dev-img",
        "copy-dev-iconfont",
        "copy-dev-index",
        "copy-dev-html",
        "copy-dev-data"
      ],
      "flexiblecss",
      "build-es6",
      "server",
      "watch",
      cb
    );
  }
});

/**
 * 调试环境
 */
// 清除文件/文件夹
gulp.task("clean-dev", function() {
  console.log("==========准备调试环境打包==========");
  return del.sync(dev_path);
});
gulp.task("clean-dev-lib", function() {
  return del.sync(dev_lib_path);
});
gulp.task("clean-dev-img", function() {
  return del.sync(dev_imgs_path);
});
gulp.task("clean-dev-js", function() {
  return del.sync(dev_js_path + "/**/*.js");
});
gulp.task("clean-dev-html", function() {
  return del.sync(dev_js_path + "/**/*.html");
});
gulp.task("clean-dev-css", function() {
  return del.sync(dev_css_path + "/**/*.css");
});
gulp.task("clean-dev-iconfont", function() {
  return del.sync(dev_css_path + "/**/iconfont.*");
});
gulp.task("clean-dev-data", function() {
  return del.sync(dev_data_path + "/**/*");
});

//复制index文件
gulp.task("copy-dev-index", function() {
  console.log("(copy 1/6) 复制index.html");
  return gulp.src(src_path + "/index.html").pipe(gulp.dest(dev_path));
});
//复制lib库
gulp.task("copy-dev-lib", ["clean-dev-lib"], function() {
  console.log("(copy 2/6) 复制lib库");
  return gulp.src(src_lib_path + "/**/*").pipe(gulp.dest(dev_lib_path));
});
//复制图片
gulp.task("copy-dev-img", ["clean-dev-img", "build-imageList"], function() {
  console.log("(copy 3/6) 复制所有图片");
  return gulp.src(src_imgs_path + "/**/*").pipe(gulp.dest(dev_imgs_path));
});
//复制iconfont字体文件
gulp.task("copy-dev-iconfont", ["clean-dev-iconfont"], function() {
  console.log("(copy 4/6) 复制字体文件");
  return gulp
    .src(src_css_path + "/**/iconfont.*")
    .pipe(gulp.dest(dev_css_path));
});
//复制html
gulp.task("copy-dev-html", ["clean-dev-html"], function() {
  console.log("(copy 5/6) 复制html模板文件");
  return gulp.src(src_js_path + "/**/*.html").pipe(gulp.dest(dev_js_path));
});
//复制mock data
gulp.task("copy-dev-data", ["clean-dev-data"], function() {
  console.log("(copy 6/6) 复制mock data文件");
  return gulp.src(src_data_path + "/**/*").pipe(gulp.dest(dev_data_path));
});

gulp.task("flexiblecss", function() {
  console.log("(handle css 1/1) 处理css");
  let autoprefixer_processors = [
    autoprefixer({
      browsers: ["Android > 4.1", "iOS >= 7"],
      cascade: false
    })
  ];
  let processors = [
    px2rem({
      remUnit: postcss_rem_unit
    })
  ];

  return gulp
    .src(src_css_path + "/**/*.css")
    .pipe(
      plumber({
        errorHandler: function(error) {
          console.log("错误信息:" + error);
          this.emit("end");
        }
      })
    )
    .pipe(postcss(autoprefixer_processors))
    .pipe(postcss(processors))
    .pipe(changed(dev_css_path))
    .pipe(gulp.dest(dev_css_path));
});

gulp.task("build-es6", function() {
  console.log("(handle js 1/1) 处理js es6 语法");
  return gulp
    .src(src_js_path + "/**/*.js")
    .pipe(
      plumber({
        errorHandler: function(error) {
          console.log("错误信息:" + error);
          this.emit("end");
        }
      })
    )
    .pipe(
      babel({
        presets: [
          [
            "env",
            {
              targets: {
                browsers: ["> 1%", "last 2 versions", "not ie <= 8"]
              }
            }
          ]
        ]
      })
    )
    .pipe(changed(dev_js_path))
    .pipe(gulp.dest(dev_js_path));
});

gulp.task("build-imageList", [], function() {
  console.log("(handle js 1/1) 处理imagesList 语法");
  return gulp.src(src_imgs_path + "/loading.txt").pipe(makeImageList());
});

// 配置服务器
gulp.task("server", function() {
  console.log("(start server 1/1) 开启服务器");

  return browserSync.init({
    // files: ["**"],
    // notify: false, //禁用浏览器的通知元素
    server: {
      baseDir: dev_path
    },
    port: 8000
  });
});

gulp.task("watch", function() {
  console.log("(watch change 1/1) 监视文件变化");

  gulp.watch([src_css_path + "/**/*.css"], function(event) {
    gulpSequence("flexiblecss", browserSync.reload)(function(err) {
      if (err) console.log(err);
    });
  });
  gulp.watch(src_js_path + "/**/*.html", function(event) {
    gulpSequence("copy-dev-html", browserSync.reload)(function(err) {
      if (err) console.log(err);
    });
  });
  gulp.watch(src_imgs_path + "/*.*", function(event) {
    gulpSequence("copy-dev-img", browserSync.reload)(function(err) {
      if (err) console.log(err);
    });
  });
  gulp.watch(src_data_path + "/*.*", function(event) {
    gulpSequence("copy-dev-data", browserSync.reload)(function(err) {
      if (err) console.log(err);
    });
  });
  gulp.watch(src_js_path + "/**/*.js", function(event) {
    console.log(event);
    gulpSequence("build-es6", browserSync.reload)(function(err) {
      if (err) console.log(err);
    });
  });
});

/**
 * 正式打包
 */
// 清除文件/文件夹
gulp.task("clean-dist", function() {
  console.log("==========正在从调试环境获取资源==========");
  console.log("==========准备正式打包==========");
  return del.sync(dist_path);
});
gulp.task("clean-lib", function() {
  return del.sync(dist_lib_path);
});
gulp.task("clean-img", function() {
  return del.sync(dist_imgs_path);
});
gulp.task("clean-data", function() {
  return del.sync(dist_data_path);
});
gulp.task("clean-js", function() {
  return del.sync(dist_js_path);
});
gulp.task("clean-css", function() {
  return del.sync(dist_css_path + "/**/*.css");
});
gulp.task("clean-iconfont", function() {
  return del.sync(dist_css_path + "/**/iconfont.*");
});

//复制index文件
gulp.task("copy-index", function() {
  console.log("==========正在复制index.html==========");
  return gulp
    .src(dev_path + "/index.html")
    .pipe(
      through.obj(function(file, encode, cb) {
        var content = file.contents.toString();
        // console.log(content);
        var str = '<script type="text/javascript" src="js/config.js"></script>';
        var new_content = content.replace(str, "");
        // console.log(new_content);

        file.contents = new Buffer(new_content);
        this.push(file);
        cb();
      })
    )
    .pipe(gulp.dest(dist_path));
});

//复制lib库
gulp.task("copy-lib", ["clean-lib"], function() {
  console.log("==========正在复制lib库 只复制require.js==========");
  return gulp.src(dev_lib_path + "/require.js").pipe(gulp.dest(dist_lib_path));
});

//复制图片
gulp.task("copy-img", ["clean-img"], function() {
  console.log("==========正在复制图片==========");
  return gulp.src(dev_imgs_path + "/**/*").pipe(gulp.dest(dist_imgs_path));
});

//复制iconfont字体文件
gulp.task("copy-iconfont", ["clean-iconfont"], function() {
  console.log("==========正在复制iconfont字体文件==========");
  return gulp
    .src(dev_css_path + "/**/iconfont.*")
    .pipe(gulp.dest(dist_css_path));
});

//复制data mock
gulp.task("copy-data", ["clean-data"], function() {
  console.log("==========正在复制图片==========");
  return gulp.src(dev_data_path + "/**/*").pipe(gulp.dest(dist_data_path));
});

gulp.task("minifycss", ["clean-css"], function() {
  console.log("==========正在整理css==========");

  return gulp
    .src(dev_css_path + "/main.css")
    .pipe(concatCss("main.css"))
    .pipe(cleanCSS({ keepSpecialComments: "*" }))
    .pipe(gulp.dest(dist_css_path));
});

gulp.task("rjs", ["clean-js"], function() {
  console.log("==========正在整理js==========");
  return gulp
    .src(dev_js_path + "/main.js")
    .pipe(
      requirejsOptimize({
        optimize: "none",
        optimizeCss: "none", //跳过css优化
        mainConfigFile: "dev/js/config.js"
      })
    )
    .pipe(
      uglify({
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      })
    )
    .pipe(gulp.dest(dist_js_path));
});
