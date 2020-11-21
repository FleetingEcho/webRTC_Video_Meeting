const shell = require("shelljs");
const chalk = require('chalk');
const name = process.argv[2] || 'add screenshot function';

const defaultLog = log => console.log(chalk.blue(`---- ${log}----`));
const errorLog = log => console.log(chalk.red(`---- ${log}----`));
const successLog = log => console.log(chalk.green(`---- ${log}----`));


const shellCommand=(command)=>{
  return new Promise((resolve,reject)=>{
    let res= shell.exec(command).code;
    if(res!==0){ reject(new Error('git command execute error'))}
    resolve(res)//此时res==0;
  })
}

const autoPush = async () => {
    try{
    //  await shell.exec(' git remote add origin git@github.com:JakeZT/webRTC_Video_Meeting.git')
     defaultLog('push start')
     await shellCommand('git add .')
     await shellCommand(`git commit -m "${name}"`)
     let res= shellCommand('git push origin master'); 
     return res
    }catch(err){
      errorLog('link error')
      process.exit()
    }
}

autoPush().then((res)=>{
  successLog('success!'); 
  process.exit();
}).catch((err)=>{
  shell.echo(`error occurs in pushing `) 
  errorLog('push error')
  process.exit()
})