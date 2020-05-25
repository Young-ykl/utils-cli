const path          = require('path');
const fs            = require('fs');
const validName     = require('valid-filename');
const chalk         = require('chalk');
const download      = require('download-git-repo');
const ora           = require("ora");
const spawn         = require("cross-spawn");
let baseProjectURL  = process.cwd();
let packageName     = "";
let packageURL      = "";
let spinner         = null;


// 对外暴露的方法
async function initProject (name) {
  packageName = name;
  packageURL  = path.resolve(baseProjectURL,packageName);
  await detectionProject();
  await mkdirProject();
  await downloadTemplete();
  spinner.succeed('模板下载完成 \n');
  await installPackage();
}

// 检测文件
function detectionProject () {
  if(!validName(packageName)){
    console.log(chalk.yellow('文件名称不合法，重新输入\n'));
    process.exit(1);
  }
  if(existsProject()){
    console.log(chalk.yellow('检测到您的项目名已存在， 请重新输入\n'))
    process.exit(1)
  }
}


// 检测文件名称是否重复
function existsProject () {
  return fs.existsSync(packageURL)
}



// 创建文件夹
function mkdirProject(){
  return new Promise((resolve) => {
    fs.mkdir(packageURL , (err) => {
      if(err){
        console.log(chalk.red(err))
        process.exit(1);
      }
      resolve();
    })
  })
}


// 删除文件
function deldirProject(){
  return new Promise((resolve) => {
      var list = fs.readdirSync(packageURL)
      list.forEach((v, i) => {
        var url = packageURL + '/' + v
        var stats = fs.statSync(url)
        if (stats.isFile()) {
          fs.unlinkSync(url)
        } else {
          arguments.callee(url)
        }
      })
      fs.rmdirSync(packageURL);
      process.exit(1);
      resolve();
  })
}

// 下载模板
function downloadTemplete () {
  return new Promise( resolve => {
    spinner = ora('Downloading template \n').start();
    download('lizixin519/js-utils-template', packageURL, function (err) {
      if(err){
        console.log(chalk.red('模板下载失败，请重试 \n'));
        deldirProject();
      }
      resolve();
    })
  })
}


// 安装依赖
function installPackage  () {
  spinner = ora('正在安装依赖包，请稍等... \n');
  spawn.sync('npm', ['install'],
    {
      stdio: 'inherit',
      cwd: packageURL
    }
  );
  spinner.succeed('依赖包安装完成');
  console.log(chalk.green('项目初始化完成\n'))
}


module.exports = initProject;
