const { pool } = require('../config')

require("dotenv-safe").config();
const jwt = require('jsonwebtoken');


// Login
const login = (request, response, next) => {
    const { email, senha } = request.body
    pool.query('SELECT * FROM usuarios where email = $1 and senha = $2', [email, senha], (error, results) => {
        if (error || results.rowCount == 0) {
            return response.status(401).json({ auth: false, message: 'dados inválidos' });
        }
        const email_usuario = results.rows[0].email;
        const nome_usuario = results.rows[0].nome;
        const token = jwt.sign({ email_usuario,nome_usuario }, process.env.SECRET, {
            expiresIn: 150
        })
        return response.json({ auth: true, token: token })
    },
    )
}


// Aqui é verificada a autenticação do token gerado
function verificaJWT(request, response, next) {
    const token = request.headers['x-access-token'];
    if (!token) return response.status(401).json({ auth: false, message: 'Token nao encontrado.' });

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) return response.status(500).json({ auth: false, message: 'Erro no token! .' });

        request.userId = decoded.id;
        next();
    });
}

module.exports = {
    login, verificaJWT
}