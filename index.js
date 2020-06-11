const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


let DB = {   // Banco de dados falso
    games: [
        {
            id: 20,
            title: 'League of Legends',
            year: 2009,
            price: 0
        },

        {
            id: 30,
            title: 'Breath of the Wild',
            year: 2017,
            price: 200
        },

        {
            id: 10,
            title: 'Pokemon Y',
            year: 2013,
            price: 50
        }
    ]
}


app.get('/games',  (req, res) =>{
    res.statusCode = 200  // Feito com sucesso, em um api rest sempre tem que passar o statuscode
    res.json(DB.games)
})

app.get('/game/:id', (req, res) =>{
    if(isNaN(req.params.id)){
        res.sendStatus(400)  // Statuscode que fala que a req nao foi feita corretamente
    }else{
        let id = parseInt(req.params.id)
        let game = DB.games.find(g => g.id == id) // Encontre o game em que o game.id == id
        if(game != undefined){
            res.statusCode = 200
            res.json(game)
        }else{
            res.sendStatus(404)   // Não encontrado
        }
    }
})


app.listen(45678, ()=>{
    console.log('API Rodando')
})