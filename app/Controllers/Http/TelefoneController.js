const Telefone = use('App/Models/Telefone');

class TelefoneController {
    async store({ request, response }) {
        try {
            const { cliente_id, numero } = request.only(['cliente_id', 'numero']);

            if (!cliente_id || !numero) {
                return response.status(400).json({ message: 'Número de telefone são obrigatórios.' });
            }

            const novoTelefone = await Telefone.create({ cliente_id, numero });
            return response.status(201).json({ telefone: novoTelefone });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: 'Erro ao criar telefone', error: error.message });
        }
    }

    async update({ params, request, response }) {
        try {
            const telefone = await Telefone.findOrFail(params.id);
            const { numero } = request.only(['numero']);

            if (!numero) {
                return response.status(400).json({ message: 'Número de telefone é obrigatório.' });
            }

            telefone.merge({ numero });
            await telefone.save();

            return response.status(200).json({ message: 'Telefone atualizado com sucesso', telefone });
        } catch (error) {
            const message = error.name === 'ModelNotFoundException' ? 'Telefone não encontrado' : 'Erro ao atualizar telefone';
            return response.status(error.name === 'ModelNotFoundException' ? 404 : 500).json({ message, error: error.message });
        }
    }

    async destroy({ params, response }) {
        try {
            const telefone = await Telefone.findOrFail(params.id);
            await telefone.delete();

            return response.status(200).json({ message: 'Telefone excluído com sucesso' });
        } catch (error) {
            const message = error.name === 'ModelNotFoundException' ? 'Telefone não encontrado' : 'Erro ao excluir telefone';
            return response.status(error.name === 'ModelNotFoundException' ? 404 : 500).json({ message, error: error.message });
        }
    }

    async syncTelefones(cliente_id, telefones) {
        await Telefone.query().where('cliente_id', cliente_id).delete();
        for (const telefone of telefones || []) {
            await Telefone.create({ cliente_id, numero: telefone.numero });
        }
    }
}

module.exports = TelefoneController;
