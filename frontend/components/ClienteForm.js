import { useState, useEffect } from "react";
import api from "../services/api";

export default function ClienteForm({ onClose, onClienteAdded }) {
  const [nome, setNome] = useState("");
  const [documento, setDocumento] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [contato, setContato] = useState("");
  const [prazo, setPrazo] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [servicoId, setServicoId] = useState("");
  const [statusId, setStatusId] = useState("");
  const [servicos, setServicos] = useState([]);
  const [statusObras, setStatusObras] = useState([]);

  useEffect(() => {
    api.get("/servicos_obra").then(response => setServicos(response.data));
    api.get("/status_obra").then(response => setStatusObras(response.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/clientes", {
        nome, documento, responsavel, contato, prazo, 
        data_inicio: dataInicio, data_fim: dataFim, 
        servico_id: servicoId, status_id: statusId
      });
      onClienteAdded();
      onClose();
    } catch (error) {
      console.error("❌ Erro ao adicionar cliente:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Adicionar Cliente</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <input type="text" placeholder="Documento" value={documento} onChange={(e) => setDocumento(e.target.value)} required />
          <input type="text" placeholder="Responsável" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} required />
          <input type="text" placeholder="Contato" value={contato} onChange={(e) => setContato(e.target.value)} required />
          <input type="number" placeholder="Prazo (dias)" value={prazo} onChange={(e) => setPrazo(e.target.value)} />
          <input type="date" placeholder="Data Início" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
          <input type="date" placeholder="Data Fim" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
          
          <select value={servicoId} onChange={(e) => setServicoId(e.target.value)} required>
            <option value="">Selecione um Serviço</option>
            {servicos.map(servico => (
              <option key={servico.id} value={servico.id}>{servico.servico}</option>
            ))}
          </select>

          <select value={statusId} onChange={(e) => setStatusId(e.target.value)} required>
            <option value="">Selecione um Status</option>
            {statusObras.map(status => (
              <option key={status.id} value={status.id}>{status.status}</option>
            ))}
          </select>

          <button type="submit">Salvar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
}
