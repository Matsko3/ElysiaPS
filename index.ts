import Dispatch from "./dispatch";
import * as readline from "readline";
import DBService from "./dbservice";
import account from "./models/account";

export var std = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});


export var dispatch:Dispatch; 
export var db :DBService;


const start= async()=>{
    dispatch = new Dispatch(80, 443);
    db =  new DBService("mongodb://0.0.0.0:27017", "Crepe")
    await db.connectToDatabase();
    //dispatch can use some db functions so better wait for db to initalize
    dispatch.start();

    checkContinue();



    // db.test()
}
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

async function handleCommand(answer:string){
    let command = answer.split(" ")[0]
    let args = answer.split(" ").slice(1)

    switch(command.toLowerCase()){
        case "add":
            if(args[0] == "-h" || args[0] == "--help"){
                return "add [username] [uid] [?country] [?email]"
            }
            let username:string = args[0]
            let uid:string = parseInt(args[1]).toString()
            let country:string =args[2] || "US"
            let email:string = args[3] || "no@mail.net"

            //todo: find if theres a duplicate
            if(!username) return ":/"
            let a = new account()

            a.email = email

            a.username = username;
            a.country = country
            a.acc_id = uid;

            db.addAccount(a)

            return "account added"



            break;
        case "remove":
            break;
        case "reset":

            break;
        default:
            break;
    }
    if(command.length>0){
        return;
    }else{
        return;
    }
}
