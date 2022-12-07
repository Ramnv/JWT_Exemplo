const { pool } = require('../config');

const getPets = (request, response) => {
    pool.query(`select s.codigo as codigo, s.numero as numero, 
        s.descricao as descricao, s.capacidade as capacidade, 
        s.dono as dono, p.nome as nomedono
        from pets s
        join donos p on s.dono = p.codigo
        order by s.codigo`, 
    (error, results) => {
        if (error){
            return response.status(400).json({
                status : 'error',
                message: 'Erro ao consultar as pets: ' + error
            });
        }
        response.status(200).json(results.rows);
    })
}

const addPet = (request, response) => {
    const {numero, descricao, capacidade, dono} = request.body;
    pool.query(`insert into pets (numero, descricao, capacidade, dono) 
    values ($1, $2, $3, $4)
    returning codigo, numero, descricao, capacidade, dono`, 
    [numero, descricao, capacidade, dono] , 
    (error, results) => {
        if (error){
            return response.status(400).json({
                status : 'error',
                message: 'Erro ao inserir a pet!'
            });
        }
        response.status(200).json({
            status : 'success' , message : "Pet criada!",
            objeto : results.rows[0]
        });
    })
}

const updatePet = (request, response) => {
    const {codigo, numero, descricao, capacidade, dono} = request.body;
    pool.query(`UPDATE pets
	SET numero=$1, descricao=$2, capacidade=$3, dono=$4
	WHERE codigo=$5
returning codigo, numero, descricao, capacidade, dono`, 
    [numero, descricao, capacidade, dono, codigo] , 
    (error, results) => {
        if (error){
            return response.status(400).json({
                status : 'error',
                message: 'Erro ao atualizar a pet!'
            });
        }
        response.status(200).json({
            status : 'success' , message : "Pet criada!",
            objeto : results.rows[0]
        });
    })
}


const deletePet = (request, response) => {
    const codigo = parseInt(request.params.codigo);
    pool.query(`DELETE FROM pets WHERE codigo=$1`, 
                [codigo] , 
    (error, results) => {
        if (error || results.rowCount == 0){
            return response.status(400).json({
                status : 'error',
                message: 'Erro ao remover a pet! ' + (error ? error : '')
            });
        }
        response.status(200).json({
            status : 'success' , message : "Pet removida!"
        });
    })
}

const getPetPorCodigo = (request, response) => {
    const codigo = parseInt(request.params.codigo);
    pool.query(`SELECT * FROM pets WHERE codigo=$1`, 
                [codigo] , 
    (error, results) => {
        if (error || results.rowCount == 0){
            return response.status(400).json({
                status : 'error',
                message: 'Erro ao recuperar a pet!'
            });
        }
        response.status(200).json(results.rows[0]);
    })
}

module.exports = {
    getPets, addPet, updatePet, deletePet, getPetPorCodigo
}
