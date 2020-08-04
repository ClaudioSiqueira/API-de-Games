const express = require('express')
const app = express()
const sequelize = require('sequelize')
const Table = require('./database/table')
const Users = require('./database/Users')
const bodyparser = require('body-parser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cors = require('cors')

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

app.use(cors())

function auth(req, res, next){
    const authToken = req.headers['authorization']
    if(authToken != undefined){
        const bearer = authToken.split(' ')
        let token = bearer[1]
        jwt.verify(token, JWTsecret, (err, data) =>{ // Verifica se o token está certo
            if(err){
                res.status(401)
                res.json({err:'Token inválido'})
            }else{
                req.token = token
                req.LoggedUser = {id: data.id, email: data.email}
                next()
            }
        })
    }else{  // Se nao passar o token
        res.status(401)
        res.json({err:'Token inválido'})
    }
    
}


const JWTsecret = 'asdkbjkxcbzpcbwpbzXCbuiABÇIDBDKBSJSABKsabkçddk'



app.post('/signup', (req, res) =>{
    let {name, email,password} = req.body
    if(name != undefined && email != undefined && password != undefined){
        let salt = bcrypt.genSaltSync(10)
        let hash = bcrypt.hashSync(password, salt)
        Users.create({
            name: name,
            email: email,
            password: hash
        }).then(() =>{
            res.sendStatus(200)
        }).catch((err) =>{
            res.sendStatus(401)
            res.json({err: err})
        })
    }else{
        res.status(400)
        res.json({err: 'Dados inválidos para cadastro'})
    }

})


app.post('/auth',(req, res) =>{
    let {email, password} = req.body
    if (email != undefined && password != undefined){
        Users.findOne({where:{email:email}}).then((user) =>{
            let correct = bcrypt.compareSync(password, user.password)
            if(correct){
            
                jwt.sign({id: user.id, email: user.email}, JWTsecret, {expiresIn: '48h'},(err, token) =>{
                    if(err){
                        res.status(400)
                        res.json({err: 'Falha interna'})
                    }else{
                        res.json({token: token})  // Sucesso
                    }
                })
                
            }else{
                res.status(400)
                res.json({err: 'Senha errada'})
            }
        }).catch((err) =>{
            res.sendStatus(404)
        })
    }else{
        res.status(400)
        res.json({err: 'Dados inválidos para cadastro'})
    }
})


app.get('/games',auth,(req, res) =>{
    Table.findAll().then(games =>{
        res.statusCode = 200
        res.json({user: req.LoggedUser, games: games})
    })
})


app.post('/game', auth,(req, res) =>{
    let {title, price, year} = req.body

    if(isNaN(price) || isNaN(year) || title == undefined){
        res.sendStatus(400)
    }else{
        Table.create({
            title:title,
            price:price,
            year:year
        }).then(() =>{
            res.sendStatus(200)
        })
    }
})

app.delete('/game/:id', auth,(req, res) =>{
    let id = req.params.id
    if(isNaN(id)){
        res.sendStatus(400)
    }else{
        Table.findByPk(id).then(game =>{
            if(game != undefined){
                Table.destroy({
                    where:{id:id}
                }).then(res.sendStatus(200))
            }else{
                res.sendStatus(404)
            }
        })

    }
})


app.put('/game/:id', auth,(req, res) =>{
    let id = req.params.id
    if(!isNaN(id)){

        Table.findByPk(id).then((game) =>{
            if(game != undefined){
                let {title, price, year} = req.body
                if(title != undefined){
                    Table.update({title: title}, {where:{id:id}})
                    res.sendStatus(200)
                }

                if(price != undefined){
                    Table.update({price:price}, {where:{id:id}})
                    res.sendStatus(200)
                }
                
                if(year != undefined){
                    Table.update({price: price}, {where:{id:id}})
                    res.sendStatus(200)
                }
            }else{
                res.sendStatus(404)
            }
        })





    }else{
        res.sendStatus(400)
    }
})

app.listen(9000, () =>{
    console.log('Servidor abriu')
})
