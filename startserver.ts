import ps
then send me ps on Matsuko#3527
my dms opened always
leak protos and cmdids
start();
async function checkContinue(){
    std.question("", (answer) => {
        if(answer === "exit"){
            dispatch.stop();
            std.write("exiting...\n");
            process.exit();
        }else{
            handleCommand(answer).then((resp)=>{
                if(resp)console.log(resp)
            })
            checkContinue()
        }
    });
}
