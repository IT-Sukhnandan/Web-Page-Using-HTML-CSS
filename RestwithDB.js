const express=require('express');
const mysql=require('mysql2');  
const app=express();
const port= 8080;
const path=require('path');
const methodOverride=require('method-override');
// const { faker } = require("@faker-js/faker");
// const { v4: uuidv4 } = require("uuid");


const connection=mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'BACKEND_APP',
    password: 'My&mern@9596'
})
// let getRandom=()=>{
//     return [
//         faker.datatype.uuid(),
//         faker.internet.userName(),
//         faker.internet.email(),
//         faker.internet.password(),
//     ];
// }

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));

//Home Routes
app.get("/",(req,res)=>{
    let q= `SELECT COUNT(*) FROM bulk`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let count = result[0]["COUNT(*)"];
            res.render("Home.ejs",{count});
        })
    }catch(err){
        console.log(err);
        res.send("some err in DB");
    }
})

//show Routes
app.get("/user",(req,res)=>{
    let q=`SELECT * FROM bulk`;
    try{
        connection.query(q,(err,users)=>{
            if(err) throw err;
            // console.log(user);
            // res.send(user);
            res.render("show.ejs",{users});
        })
    }catch(err){
        console.log(err);
        res.send("some err in DB");
    }
})
//edit routes
app.get("/user/:id/edit",(req,res)=>{
    let {id}=req.params;
    let q=`SELECT * FROM bulk WHERE id ='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            // console.log(result);
            let user=result[0];
            res.render("edit.ejs",{user});
        })
    }catch(err){
        console.log(err);
        res.send("some err in DB");
    }
})
//updates (DB) routes

app.patch("/user/:id",(req,res)=>{
    let {id}=req.params;
    let {password: formpassword, username: newUsername}=req.body;
    let q=`SELECT * FROM bulk WHERE id='${id}'`;

    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user=result[0];
            if(formpassword != user.password){
                res.send("wrong password");
            }else{
                let q2=`UPDATE bulk SET usename='${newUsername}'WHERE id='${id}'`;
                connection.query(q2,(err,result)=>{
                    if(err) throw err;
                    // res.send(result);
                    res.redirect("/user");
                })
            }
        })
    }catch(err){
        console.log(err);
        res.send("some err in DB");
    }

})
app.get("/user/new", (req, res) => {
    res.render("adduser.ejs");
  });

// insert new user
app.post("/user/new",(req,res)=>{
    let {id,username, password,email}=req.body;
    // let id=uuidv4();
    let q=`INSERT INTO bulk(id,usename,email,password)VALUES('${id}','${username}', '${email}','${password}')`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            // res.send(result);
            // res.render("adduser.ejs");
            res.redirect("/user");
        })
    }catch(err){
        res.send("some err in this routes");
    }
     
})

app.get("/user/:id/delete",(req,res)=>{
    let {id} =req.params;
    let q=`SELECT * FROM bulk WHERE id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user=result[0];
            res.render("delete.ejs", {user});
        })
    }catch(err){
        res.send("some err in DB");
    }
})
app.delete("/user/:id",(req,res)=>{
    let {id}=req.params;
    let {password}= req.body;
    let q=`SELECT * FROM bulk WHERE id='${id}'`;
    
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user= result[0];

            if(user.password != password){
                res.send("wrong password");
            }else{
                let q2=`DELETE FROM bulk WHERE id='${id}'`;
                try{
                    connection.query(q2,(err,result)=>{
                        if(err) throw err;
                        else{
                            console.log(result);
                            console.log("Deleted");
                            res.redirect("/user");
                        }
                    });
                }catch(err){
                    res.send("some err for in DB");
                }
            }
        })  
    }catch (err) {
        res.send("some password not match with DB");
    }
})

app.listen(port,()=>{
    console.log(`the app is listen on the port ${port}`);
})