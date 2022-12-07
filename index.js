const express = require('express');
const cors = require('cors');
const rotas = require('./rotas');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(rotas);

const ola = (request, response, next) => {
    response.status(200).json("Rota sem autenticação.")
}

app
    .route("/ola")
    .get(ola)

app.listen(process.env.PORT || 3002, () => {
    console.log('Servidor funcionando');
});