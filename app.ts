import * as Express from 'express'
import * as fs from "fs";

const CONFIG = {
    port:process.env.PORT||3000
}


const app = Express()

app.use(Express.static('./public'))
app.set('view engine', 'pug')

app.get('/offline',(req,res) => {
    res.render('offline')
})
app.get('/file',(req,res) => {
    const files = fs.readdirSync('./public/markdowns')
    res.json({files})
})
app.get('/math',(req,res) => {
    res.render('math')
})
app.get('/info',(req,res) => {
    res.render('info')
}) 
app.get('/',(req,res) => {
    res.render('main')
})
app.get('/*',(req,res) =>{
    res.status(404).send("not found")
})
app.listen(CONFIG.port,() => {
    console.log(`Server start on ${CONFIG.port}`) 
})