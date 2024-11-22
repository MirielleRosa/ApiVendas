const Endereco = use('App/Models/Endereco');

class EnderecoController {
    async validarCamposObrigatorios(endereco) {
        const camposObrigatorios = ['logradouro', 'numero', 'bairro', 'cidade', 'estado', 'cep'];
        for (const campo of camposObrigatorios) {
            if (!endereco[campo]) {
                return { status: 400, message: `O campo ${campo} é obrigatório.` };
            }
        }
        return null;
    }

    async store({ request, response }) {
        try {
            const endereco = request.only(['cliente_id', 'logradouro', 'numero', 'bairro', 'cidade', 'estado', 'cep']);

            const validationError = await this.validarCamposObrigatorios(endereco);
            if (validationError) return response.status(validationError.status).json({ message: validationError.message });

            const novoEndereco = await Endereco.create(endereco);
            return response.status(201).json({ endereco: novoEndereco });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: 'Erro ao criar endereço', error: error.message });
        }
    }

    async update({ params, request, response }) {
        try {
            const endereco = await Endereco.findOrFail(params.id);
            const dadosAtualizados = request.only(['logradouro', 'numero', 'bairro', 'cidade', 'estado', 'cep']);

            const validationError = await this.validarCamposObrigatorios(dadosAtualizados);
            if (validationError) return response.status(validationError.status).json({ message: validationError.message });

            endereco.merge(dadosAtualizados);
            await endereco.save();

            return response.status(200).json({ message: 'Endereço atualizado com sucesso', endereco });
        } catch (error) {
            const message = error.name === 'ModelNotFoundException' ? 'Endereço não encontrado' : 'Erro ao atualizar endereço';
            return response.status(error.name === 'ModelNotFoundException' ? 404 : 500).json({ message, error: error.message });
        }
    }

    async destroy({ params, response }) {
        try {
            const endereco = await Endereco.findOrFail(params.id);
            await endereco.delete();

            return response.status(200).json({ message: 'Endereço excluído com sucesso' });
        } catch (error) {
            const message = error.name === 'ModelNotFoundException' ? 'Endereço não encontrado' : 'Erro ao excluir endereço';
            return response.status(error.name === 'ModelNotFoundException' ? 404 : 500).json({ message, error: error.message });
        }
    }
}

module.exports = EnderecoController;
