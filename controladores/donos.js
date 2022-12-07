const {pool} = require('../config');

const getDonos = (request, response) => {
    pool.query('SELECT * FROM donos order by codigo',
        (error, results) => {
            if (error){
                return response.status(400).json(
                    {
                        status : 'error', 
                        message : 'Erro ao consultar o dono: ' + error
                    }
                );
            }
            response.status(200).json(results.rows);
        }       
    )
}


const addDono = (request, response) => {
    const {nome, endereco, telefone} = request.body;
    pool.query(`INSERT INTO donos (nome, endereco, telefone) 
    values ($1, $2, $3) returning codigo, nome, endereco, telefone`,
    [nome, endereco, telefone],
    (error, results) => {
        if (error){
            return response.status(400).json({
                status : 'error', 
                message : 'Erro ao inserir o dono: ' + error
            })
        }
        response.status(200).json({
            status : "success" , message : "Dono criado",
            objeto: results.rows[0]
        })
    })
}

const updateDono = (request, response) => {
    const {codigo, nome, endereco, telefone} = request.body;
    pool.query(`UPDATE donos SET nome=$1, endereco=$2, telefone=$3
    where codigo=$4 returning codigo, nome, endereco, telefone`,
    [nome, endereco, telefone, codigo],
    (error, results) => {
        if (error){
            return response.status(400).json({
                status : 'error', 
                message : 'Erro ao alterar o dono: ' + error
            })
        }
        response.status(200).json({
            status : "success" , message : "Dono alterado",
            objeto: results.rows[0]
        })
    })
}

const deleteDono = (request, response) => {
    const codigo = parseInt(request.params.codigo);
    pool.query(`DELETE FROM donos WHERE codigo = $1`,
    [codigo],
    (error, results) => {
        if (error || results.rowCount == 0){
            return response.status(400).json({
                status : 'error', 
                message : 'Erro ao remover o dono: ' + 
                (error ? error :'Não removeu nenhuma linha')
            })
        }
        response.status(200).json({
            status : "success" , message : "Dono removido"
        })
    })
}

const getDonoPorCodigo = (request, response) => {
    const codigo = parseInt(request.params.codigo);
    pool.query(`SELECT * FROM donos WHERE codigo = $1`,
    [codigo],
    (error, results) => {
        if (error || results.rowCount == 0){
            return response.status(400).json({
                status : 'error', 
                message : 'Erro ao recuperar o dono: ' + 
                (error ? error :'Não encontrou nenhuma linha')
            })
        }
        response.status(200).json(results.rows[0])
    })
}

module.exports = {
    getDonos, addDono, updateDono, deleteDono, getDonoPorCodigo
}

