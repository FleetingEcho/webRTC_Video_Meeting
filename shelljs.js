const shell = require("shelljs");
const chalk = require('chalk');
const name = process.argv[2] || 'first commit';

const defaultLog = log => console.log(chalk.blue(`---- ${log}----`));
const errorLog = log => console.log(chalk.red(`---- ${log}----`));
const successLog = log => console.log(chalk.green(`---- ${log}----`));

const autoPush = async () => {
    try{
     await shell.exec(' git remote add origin git@github.com:JakeZT/webRTC_Video_Meeting.git')
     defaultLog('push start')
     await shell.exec('git add .')
     await shell.exec(`git commit -m "${name}"`)
    }catch(err){
      errorLog('link error')
      process.exit()
    }
    let res= shell.exec('git push origin master'); 
    return res
}

autoPush().then((res)=>{
  if(res.code!==0){
    shell.echo(`error occurs in pushing `) 
    errorLog(`error occurs`)
    return
  }
  successLog('success!'); 
  process.exit();
}).catch((err)=>{
  errorLog('push error')
})