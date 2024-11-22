const Model = use('Model')

class Produto extends Model {
    static get primaryKey() {
        return 'id'
    }

    static get rules() {
        return {
            nome: 'required',
            descricao: 'required',
            preco: 'required|number',
        }
    }

    vendas() {
        return this.hasMany('App/Models/Venda');
    }

    static get messages() {
        return {
            'nome.required': 'O nome do produto é obrigatório',
            'descricao.required': 'A descrição do produto é obrigatória',
            'estoque.required': 'O estoque do produto é obrigatório',
            'preco.required': 'O preço do produto é obrigatório',
            'produto.erro': 'O produto não foi encontrado',
            'estoque.insuficiente': 'Produto não disponível no estoque'
        }
    }

    static get ocultar() {
        return ['1']
    }
}

module.exports = Produto
