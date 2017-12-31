import * as Express from 'express'

const CONFIG = {
    port:process.env.PORT||3000
}


const app = Express()

app.use(Express.static('./public'))
app.set('view engine', 'pug')


app.get('/math',(req,res) => {
    res.render('math')
})
app.get('/info',(req,res) => {
    res.render('info')
})
app.get('/*',(req,res) => {
    res.render('info')
})

app.listen(CONFIG.port,() => {
    console.log(`Server start on ${CONFIG.port}`) 
})