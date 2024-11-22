const Produto = use('App/Models/Produto');

class ProdutosController {
    async validarCamposObrigatorios(campos, response) {
        const camposObrigatorios = [
            { campo: 'nome', mensagem: Produto.messages['nome.required'] },
            { campo: 'descricao', mensagem: Produto.messages['descricao.required'] },
            { campo: 'estoque', mensagem: Produto.messages['estoque.required'] },
            { campo: 'preco', mensagem: Produto.messages['preco.required'] },
        ];

        for (let { campo, mensagem } of camposObrigatorios) {
            if (!campos[campo]) {
                return response.status(400).json({ message: mensagem });
            }
        }

        return null;
    }

    async index({ response }) {
        try {
            const produtos = await Produto.query()
                .where('ativo', true)
                .select('id', 'nome', 'descricao', 'preco', 'estoque')
                .orderBy('nome', 'asc')
                .fetch();

            return response.json({ produtos });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: 'Erro ao buscar produtos', error: error.message });
        }
    }

    async show({ params, response }) {
        try {
            const produto = await Produto.findOrFail(params.id);
            return response.json({ produto });
        } catch (error) {
            console.error(error);
            return response.status(404).json({ message: 'Produto não encontrado' });
        }
    }

    async store({ request, response }) {
        try {
            const dados = request.only(['nome', 'descricao', 'preco', 'estoque', 'ativo']);

            const validationError = await this.validarCamposObrigatorios(dados, response);
            if (validationError) return validationError;

            const produto = await Produto.create(dados);

            return response.status(201).json({ produto });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: 'Erro ao criar produto', error: error.message });
        }
    }

    async update({ params, request, response }) {
        try {
            const produto = await Produto.findOrFail(params.id);
            const dados = request.only(['nome', 'descricao', 'preco', 'estoque', 'ativo']);

            const validationError = await this.validarCamposObrigatorios(dados, response);
            if (validationError) return validationError;

            produto.merge(dados);
            await produto.save();

            return response.status(200).json({ produto: produto.toJSON() });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: 'Erro ao atualizar produto', error: error.message });
        }
    }

    async delete({ params, response }) {
        try {
            const produto = await Produto.findOrFail(params.id);

            if (!produto.ativo) {
                return response.status(200).json({ message: 'O produto já foi excluído!' });
            }

            produto.ativo = false;
            await produto.save();

            return response.status(200).json({ message: 'Produto excluído com sucesso' });
        } catch (error) {
            if (error.name === 'ModelNotFoundException') {
                return response.status(404).json({ message: 'Produto não existe' })
            }
            return response.status(500).json({ message: 'Erro ao excluir produto', error: error.message });
        }
    }
}

module.exports = ProdutosController;
