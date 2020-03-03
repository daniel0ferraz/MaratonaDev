// Configurando o servidor
const express = require("express")
const server = express()


// Configurar o servidor para aprensentar arquivos estáticos
server.use(express.static('public'))


// Habilitar body do formulário
server.use(express.urlencoded({ extended: true }))


// Configurar a conexão com o banco dedados
const pool = require('pg').Pool
const db = new pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})


// Configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true
})


// Configurar a apresentação da página
server.get("/", function(req, res) {

    db.query("SELECT * FROM donors", function(err, result) {
        if (err) return res.send("Erro de banco de dados.")


        const donors = result.rows
        return res.render("index.html", { donors })
    })

})


server.post("/", function(req, res) {
    // Pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood


    //Se o nome = vazio, ou email = vazio, ou sangue = vazio

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.")
    }

    // Colocar valores dentro do banco de dados
    const query = `
    INSERT INTO donors ("name", "email", "blood")
    VALUES ($1,  $2, $3)`

    const values = [name, email, blood]


    db.query(query, values, function(err) {
        // Fluxo de erro
        if (err) return res.send("erro no banco de dados.")

        // Fluxo ideal
        return res.redirect("/")
    })

})


// Ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function() {
    console.log("iniciei o servidor.")
})