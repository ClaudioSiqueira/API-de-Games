const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())

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

app.post('/game', (req, res) =>{
    let {title, year, price} = req.body

    if(isNaN(price) || isNaN(year) || title == undefined){
        res.sendStatus(400)
    }else{
        DB.games.push({
            id: 100,
            title,
            year,
            price
        })
        res.sendStatus(200)
    }
})


app.delete('/game/:id', (req, res) =>{

    if(isNaN(req.params.id)){
        res.sendStatus(400)  
    }else{
        let id = parseInt(req.params.id)
        let index = DB.games.findIndex(g => g.id == id)

        if(index == -1){
            res.sendStatus(404)
        }else{
            DB.games.splice(index, 1)
            res.sendStatus(200)
        }
    }

})

app.put('/game/:id', (req, res) =>{
    if(isNaN(req.params.id)){
        res.sendStatus(400)
    }else{
        let id = parseInt(req.params.id)
        let game = DB.games.find(g => g.id == id)

        if(game != undefined){
            let {title, price, year} = req.body // N precisa fazer a verificacao de cada um, pois nem sempre todos sao enviados
        
            if(title != undefined){
                game.title = title
            }

            if(price != undefined){
                game.price = price
            }

            if(year != undefined){
                game.year = year
            }

            res.sendStatus(200)


        }else{
            res.sendStatus(404)
        }
    }
})



app.listen(45678, ()=>{
    console.log('API Rodando')
})