const express= require('express');
const ejs= require('ejs');
const mongoose= require('mongoose');
const path= require(`path`);

const app= express();



app.use(express.static('static'));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.set(`views`,path.join(__dirname,`views`));
 
app.get('/',(req,res)=>{
    res.render(`home`);
})


app.listen(3000,()=>{
    console.log("Server running on 3000");
})