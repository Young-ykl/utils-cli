const program  = require('commander');

const chalk    = require("chalk");

const package  = require("./package.json");

const initProject = require('./libs/init.js');

program.version(package.version, '-v, --version');


program
  .option('init <filename>')
  .description('init project')
  .action((source, destination) => {
    let argvs = process.argv.splice(3);
    if(argvs.length > 1){
      console.log(chalk.red('检测到您输入多个项目名称，我们将默认选取第一个作为您的项目名\n'))
    }
    let name = argvs[0];
    initProject(name)
  })

program.parse(process.argv);
