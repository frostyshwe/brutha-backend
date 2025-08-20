import { useEffect, useState } from "react";
import styles from "../../styles/comercial.module.css";
import { FaUserPlus, FaDownload, FaEdit, FaTimes, FaTrash, FaEllipsisV, FaFilter, FaUsers, FaStore, FaBoxOpen, FaBriefcase, FaChartBar, FaFileDownload, FaCog } from "react-icons/fa"
import Select from "react-select";
import { useOutsideClick } from "../../hooks/useOutsideClick"; // ou o caminho correto se estiver em outro lugar
import { useRouter } from "next/router";
import { useRef } from "react";

export default function ComercialPage() {
const [comerciais, setComerciais] = useState<LeadComercial[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [novoComercial, setNovoComercial] = useState({
    contato: "",
    empresa: "",
    cargo: "",
    data_cadastro: "",
    email: "",
    telefone_comercial: "",
    telefone_whatsapp: "",
    origem_lead: "",
    indicado_por: "",
    interesse: "",
    status: "",
    anexos: ""
  });
type LeadComercial = {
  id: number;
  contato: string;
  empresa?: string;
  cargo?: string;
  data_cadastro?: string;
  email?: string;
  telefone_comercial?: string;
  telefone_whatsapp?: string;
  origem_lead?: string;
  indicado_por?: string;
  interesse?: string;
  status?: string;
  anexos?: string;
  criado_em?: string;
  status_interacao?: string | { nome?: string };
};

type OrigemLead = {
  id: number;
  nome: string;
};

type InteresseComercial = {
  id: number;
  nome: string;
};


type Interacao = {
  id: number;
  tipo: { nome: string };
  data_interacao: string;
  data_retorno?: string;
  informacoes?: string;
};

type NovaInteracao = {
  tipo: string;
  data_interacao: string;
  data_retorno?: string;
  informacoes?: string;
  tipo_id?: number;
};

const [leadSelecionado, setLeadSelecionado] = useState<LeadComercial | null>(null);
  const [showFiltroPopup, setShowFiltroPopup] = useState(false);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroOrigem, setFiltroOrigem] = useState("");
  const [showDetalhes, setShowDetalhes] = useState(false);
  const [showAnexosPopup, setShowAnexosPopup] = useState(false);
const [arquivosSelecionados, setArquivosSelecionados] = useState<File[]>([]);
  const [anexosDoLead, setAnexosDoLead] = useState([]);
const [interacoes, setInteracoes] = useState<Interacao[]>([]);
const [novaInteracao, setNovaInteracao] = useState<NovaInteracao | null>(null);
const [interacoesSelecionadas, setInteracoesSelecionadas] = useState<number[]>([]);
const [selecionados, setSelecionados] = useState([]);
const [showExcluirPopup, setShowExcluirPopup] = useState(false);
const [showExcluirInteracoesPopup, setShowExcluirInteracoesPopup] = useState(false);
const [tiposInteracao, setTiposInteracao] = useState<TipoInteracao[]>([]);
const [dropdownAberto, setDropdownAberto] = useState(false);
const [origensCliente, setOrigensCliente] = useState<OrigemLead[]>([]);
const [dropdownOrigemAberto, setDropdownOrigemAberto] = useState(false);
const [interessesComercial, setInteressesComercial] = useState<InteresseComercial[]>([]);
const [dropdownInteresseAberto, setDropdownInteresseAberto] = useState(false);
const novaInteracaoRef = useRef(null);
const popupRef = useRef(null);
const filtroRef = useRef(null);
const detalhesRef = useRef(null);
const anexosRef = useRef(null);
const excluirRef = useRef(null);
const excluirInteracoesRef = useRef(null);
useOutsideClick(novaInteracaoRef, () => {
  if (novaInteracao) {
    setNovaInteracao(null);
    setDropdownAberto(false);
  }
});

type TipoInteracao = {
  id: number;
  nome: string;
};


// Fecha ao clicar fora
useOutsideClick(popupRef, () => setShowPopup(false));
useOutsideClick(filtroRef, () => setShowFiltroPopup(false));
useOutsideClick(detalhesRef, () => setShowDetalhes(false));
useOutsideClick(anexosRef, () => setShowAnexosPopup(false));
useOutsideClick(excluirRef, () => setShowExcluirPopup(false));
useOutsideClick(excluirInteracoesRef, () => setShowExcluirInteracoesPopup(false));

  
useEffect(() => {
  buscarComerciais();
  buscarTiposInteracao();
  buscarOrigensCliente();
  buscarInteressesComercial();
}, []);

const buscarInteressesComercial = async () => {
  try {
    const res = await fetch("http://localhost:3333/api/interesses_comercial");
    const data = await res.json();
    setInteressesComercial(data);
  } catch (err) {
    console.error("Erro ao buscar interesses:", err);
  }
};

const buscarOrigensCliente = async () => {
  try {
    const res = await fetch("http://localhost:3333/api/origens_cliente");
    const data = await res.json();
    setOrigensCliente(data);
  } catch (err) {
    console.error("Erro ao buscar origens de cliente:", err);
  }
};

const aplicarMascaraTelefone = (valor: string): string => {
  return valor
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};


const buscarTiposInteracao = async () => {
  try {
    const res = await fetch("http://localhost:3333/api/tipos_interacao");
    const data = await res.json();
    setTiposInteracao(data);
  } catch (err) {
    console.error("Erro ao buscar tipos de interação:", err);
  }
};

const buscarInteracoes = async (id: number) => {
  try {
    const res = await fetch(`http://localhost:3333/api/interacoes_comercial/${id}`);
    const data = await res.json();
    const ordenado = Array.isArray(data) ? data.sort((a, b) => b.id - a.id) : [];
    setInteracoes(ordenado);
  } catch (err) {
    console.error("Erro ao buscar interações:", err);
    setInteracoes([]);
  }
};


const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  let novoValor = value;

  if (name === "telefone_comercial" || name === "telefone_whatsapp") {
    novoValor = aplicarMascaraTelefone(value);
  }

  setNovoComercial((prev) => ({ ...prev, [name]: novoValor }));
};



const opcoesFormatadas = tiposInteracao.map((tipo) => ({
  value: tipo.id,
  label: tipo.nome
}));

  const handleSalvar = async () => {
// Validação dos campos obrigatórios
if (
  !novoComercial.contato.trim() ||
  !novoComercial.data_cadastro ||
  !novoComercial.telefone_whatsapp.trim() ||
  !novoComercial.origem_lead.trim() ||
  !novoComercial.interesse.trim()
) {
  alert("Por favor, preencha todos os campos obrigatórios.");
  return;
}

  
    const isEdicao = !!leadSelecionado;
    const url = isEdicao
      ? `http://localhost:3333/api/comercial/${leadSelecionado.id}`
      : "http://localhost:3333/api/comercial";
  
    const method = isEdicao ? "PUT" : "POST";
  
    try {
      // Etapa 1: Criar ou atualizar o lead
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoComercial)
      });
  
      if (!response.ok) {
        alert("Erro ao salvar lead.");
        return;
      }
  
      const leadSalvo = await response.json(); // importante para pegar o ID
      const leadId = leadSalvo.id || leadSelecionado?.id;
  
      // Etapa 2: Upload de arquivos (se tiver)
      if (arquivosSelecionados.length > 0 && leadId) {
        const formData = new FormData();
        arquivosSelecionados.forEach(file => formData.append("anexos", file));
  
        const uploadResponse = await fetch(`http://localhost:3333/api/comercial/${leadId}/anexos`, {
          method: "POST",
          body: formData
        });
  
        if (!uploadResponse.ok) {
          console.warn("Erro no upload de arquivos");
        }
      }
  
// Após salvar o lead e fazer upload de anexos
setShowPopup(false);
setNovoComercial({
  contato: "", empresa: "", cargo: "", data_cadastro: "", email: "",
  telefone_comercial: "", telefone_whatsapp: "", origem_lead: "",
  indicado_por: "", interesse: "", status: "", anexos: ""
});
setArquivosSelecionados([]);
setLeadSelecionado(leadSalvo);
buscarComerciais();

// Chame após definir o lead corretamente
if (!isEdicao && leadSalvo?.id) {
  buscarInteracoes(leadSalvo.id);
}

    } catch (err) {
      console.error(err);
      alert("Erro ao se conectar com o servidor.");
    }
  };
  
const router = useRouter();

const carregarAnexos = async (id: number | string) => {
    try {
    const response = await fetch(`http://localhost:3333/api/comercial/${id}/anexos`);
    const data = await response.json();
    setAnexosDoLead(data);
  } catch (error) {
    console.error("Erro ao buscar anexos:", error);
  }
};

useEffect(() => {
const handleEsc = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    setNovaInteracao(null);
    setDropdownAberto(false);
  }
};


  if (novaInteracao) {
    window.addEventListener("keydown", handleEsc);
  }

  return () => {
    window.removeEventListener("keydown", handleEsc);
  };
}, [novaInteracao]);


const buscarComerciais = async () => {
  try {
    const response = await fetch("http://localhost:3333/api/comercial");
    const data = await response.json();

    const ordenados = data.sort(
      (a: LeadComercial, b: LeadComercial) =>
        new Date(b.criado_em || "").getTime() - new Date(a.criado_em || "").getTime()
    );

    const comerciaisComStatus = await Promise.all(
      ordenados.map(async (lead: LeadComercial) => {
        try {
          const res = await fetch(`http://localhost:3333/api/interacoes_comercial/${lead.id}`);
          const interacoes = await res.json();

          const ultima = Array.isArray(interacoes) && interacoes.length > 0
            ? interacoes.sort((a: any, b: any) => b.id - a.id)[0]
            : null;

          return {
            ...lead,
            status_interacao: ultima?.tipo?.nome || "Sem interação"
          };
        } catch (err) {
          console.error("Erro ao buscar interação de lead:", lead.id);
          return { ...lead, status_interacao: "Erro" };
        }
      })
    );

    // 🚨 Aqui está o problema: você precisa adicionar esta linha para definir os comerciais:
    setComerciais(comerciaisComStatus);

  } catch (err) {
    console.error("Erro ao buscar comerciais:", err);
  }
}; // 👈 ESSA CHAVE FINAL FALTAVA NO SEU CÓDIGO






const handleExcluirSelecionados = async () => {
  if (interacoesSelecionadas.length === 0) return;

  try {
    for (const id of interacoesSelecionadas) {
      const res = await fetch(`http://localhost:3333/api/interacoes_comercial/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(`Erro ao excluir interação com ID ${id}`);
    }

    // Atualiza a lista de interações no frontend
    const novasInteracoes = interacoes.filter(i => !interacoesSelecionadas.includes(i.id));
    setInteracoes(novasInteracoes);
    setInteracoesSelecionadas([]);

    // 🔄 Atualiza o status_interacao no lead comercial
    const ultima = [...novasInteracoes].sort((a, b) => b.id - a.id)[0];

    setComerciais((prev) =>
      prev.map((lead) =>
        lead.id === leadSelecionado!.id
          ? { ...lead, status_interacao: ultima?.tipo || "Sem interação" }
          : lead
      )
    );

  } catch (error) {
    console.error("Erro ao excluir interações:", error);
    alert("Erro ao excluir uma ou mais interações.");
  }
};

const handleExcluir = async () => {
  if (!leadSelecionado) return;

  try {
    const response = await fetch(`http://localhost:3333/api/comercial/${leadSelecionado.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setLeadSelecionado(null);
      buscarComerciais(); // atualiza lista de leads
    } else {
      alert("Erro ao excluir lead.");
    }
  } catch (error) {
    console.error("Erro ao excluir lead:", error);
    alert("Erro ao se conectar com o servidor.");
  }
};


  const comerciaisFiltrados = comerciais.filter((lead) => {
    const nomeMatch = lead.contato.toLowerCase().includes(filtroNome.toLowerCase());
    const statusMatch = filtroStatus === "" || lead.status === filtroStatus;
const origemMatch = (lead.origem_lead || "").toLowerCase().includes(filtroOrigem.toLowerCase());
    return nomeMatch && statusMatch && origemMatch;
  });


const adicionarInteracao = async (nova: NovaInteracao) => {
  try {
if (!leadSelecionado) return;
const res = await fetch(`http://localhost:3333/api/interacoes_comercial`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ ...nova, comercial_id: leadSelecionado.id })
});

    if (res.ok) {
      const inserida = await res.json();

      // Atualiza interações da view
      setInteracoes((prev) => [inserida, ...prev]);

      // Atualiza o status_interacao direto no objeto do lead na lista
      setComerciais((prev) =>
        prev.map((lead) =>
          lead.id === leadSelecionado!.id
            ? { ...lead, status_interacao: inserida.tipo }
            : lead
        )
      );
    } else {
      alert("Erro ao adicionar interação.");
    }
  } catch (err) {
    console.error("Erro ao adicionar interação:", err);
    alert("Erro na comunicação com o servidor.");
  }
};


  
const formatarData = (dataISO: string | undefined) => {
  if (!dataISO) return "-";

  const data = new Date(dataISO);
  data.setMinutes(data.getMinutes() + data.getTimezoneOffset());

  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
};


  
const formatarTelefone = (numero: string | undefined) => {
  if (!numero) return "-";
  const numeros = numero.replace(/\D/g, "");
  if (numeros.length < 10) return numero;

  const ddd = numeros.slice(0, 2);
  const prefixo = numeros.slice(2, 7);
  const sufixo = numeros.slice(7, 11);

  return `(${ddd}) ${prefixo}-${sufixo}`;
};


  

  return (
    <div className={styles.erpContainer}>
      <header className={styles.erpNavbar}>
        <div className={styles.logo}>
          <img src="/logo-brutha.png" alt="Logo" className={styles.logoImg} />
        </div>
        <nav className={styles.navLinks}>
          <button className={styles.navItem} onClick={() => router.push("/clientes")}>
             <FaUsers className={styles.navIcon} />
                  <span>Clientes</span>
                    </button>
          <button className={styles.navItem} onClick={() => router.push("/fornecedores")}>
              <FaStore className={styles.navIcon} />
                <span>Fornecedores</span>
                  </button>
          <button className={styles.navItem} onClick={() => router.push("/materiais")}>
              <FaBoxOpen className={styles.navIcon} />
                <span>Materiais</span>
                  </button>
          <button className={`${styles.navItem} ${styles.active}`}><FaBriefcase className={styles.navIcon} /><span>Comercial</span></button>
          <button className={styles.navItem}><FaChartBar className={styles.navIcon} /><span>Relatórios</span></button>
          <button className={styles.navItem}><FaFileDownload className={styles.navIcon} /><span>Documentos</span></button>
          <button className={styles.navItem}><FaCog className={styles.navIcon} /><span>Configuração</span></button>
        </nav>
      </header>

      <div className={styles.erpHeader}>
        <div className={styles.actionToolbar}>
        <span>Lead Selecionado: <strong>{leadSelecionado?.contato || "Nenhum"}</strong></span>
        <div className={styles.toolbarButtons}>
        <button className={styles.erpActionBtn} onClick={() => {
setNovoComercial({
  contato: "",
  empresa: "",
  cargo: "",
  data_cadastro: new Date().toISOString().split("T")[0], // retorna "2025-05-10"
  email: "",
  telefone_comercial: "",
  telefone_whatsapp: "",
  origem_lead: "",
  indicado_por: "",
  interesse: "",
  status: "",
  anexos: ""
});
  setLeadSelecionado(null); // ESSENCIAL para forçar modo "criar"
  setShowPopup(true);
}}>
  <FaUserPlus /> Incluir
</button>

<button
  className={styles.erpActionBtn}
onClick={() => {
  if (leadSelecionado) {
    setNovoComercial({
      contato: leadSelecionado.contato || "",
      empresa: leadSelecionado.empresa || "",
      cargo: leadSelecionado.cargo || "",
      data_cadastro: leadSelecionado.data_cadastro || "",
      email: leadSelecionado.email || "",
      telefone_comercial: leadSelecionado.telefone_comercial || "",
      telefone_whatsapp: leadSelecionado.telefone_whatsapp || "",
      origem_lead: leadSelecionado.origem_lead || "",
      indicado_por: leadSelecionado.indicado_por || "",
      interesse: leadSelecionado.interesse || "",
      status: leadSelecionado.status || "",
      anexos: leadSelecionado.anexos || "",
    });
    setShowPopup(true);
  }
}}

  disabled={!leadSelecionado}
>
  <FaEdit /> Editar
</button>

<button
  className={styles.erpActionBtn}
  onClick={() => setShowExcluirPopup(true)}
  disabled={!leadSelecionado}
>
  <FaTrash /> Excluir
</button>
<button className={styles.erpActionBtn} onClick={() => setShowFiltroPopup(true)}>
  <FaFilter /> Filtrar
</button>
          </div>
        </div>
        <div className={styles.tableContainer}>
        <table className={styles.table}>
<thead>
  <tr>
    <th>Contato</th>
    <th>Criado em</th>
    <th>WhatsApp</th>
    <th>Email</th>
    <th>Status</th>
    <th>Origem</th>
    <th>Interesse</th>
    <th></th> {/* Coluna para botão ⋮ */}
  </tr>
</thead>



  {/* NOVO: container com altura controlada */}
  <tbody className={styles.tabelaScrollada}>
  {comerciaisFiltrados.map((lead, idx) => (
    <tr
      key={idx}
onClick={() => {
  setLeadSelecionado(lead);
  buscarInteracoes(lead.id);
}}
      style={{
        backgroundColor: leadSelecionado?.id === lead.id ? "#d0ebff" : "transparent"}}
    >
      <td>{lead.contato}</td>
      <td>{formatarData(lead.criado_em)}</td>
      <td>{formatarTelefone(lead.telefone_whatsapp)}</td>
      <td>{lead.email}</td>
<td>
  {typeof lead.status_interacao === 'object'
    ? lead.status_interacao?.nome || "—"
    : lead.status_interacao || "—"}
</td>
      <td>{lead.origem_lead}</td>
      <td>{lead.interesse}</td>
      <td style={{ width: "40px", textAlign: "center" }}>
        <button
          className={styles.btnDetalhes}
onClick={(e) => {
  e.stopPropagation();
  setLeadSelecionado(lead);
  carregarAnexos(lead.id); // carrega anexos junto
  setShowDetalhes(true);
}}
        >
          <FaEllipsisV />
        </button>
      </td>
    </tr>
  ))}
</tbody>
</table>

        </div>
      </div>

{leadSelecionado && (
  <div className={styles.subGestaoWrapper}>
    <div className={styles.subGestaoContainer}>
      <div className={styles.subGestaoTitulo}>
        <div className={styles.subGestaoTituloBar}>
          <h4 className={styles.subGestaoTituloTexto}>
            Interações com: <strong>{leadSelecionado.contato}</strong>
          </h4>
          
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              className={styles.erpActionBtn}
              onClick={() =>
                setNovaInteracao({
                  tipo: "",
                  data_interacao: new Date().toISOString().split("T")[0],
                  data_retorno: "",
                  informacoes: "",
                })
              }
            >
              + Adicionar Interação
            </button>

<button
  className={styles.erpActionBtn}
  onClick={() => setShowExcluirInteracoesPopup(true)}
  disabled={interacoesSelecionadas.length === 0}
>
  🗑 Excluir Selecionados
</button>
          </div>

        </div>
      </div>

      <div className={styles.subGestaoTabelaContainer}>
        <table className={styles.subTabela}>
          <thead>
            <tr>
              <th>Tipo de Interação</th>
              <th>Data da Interação</th>
              <th>Data de Retorno</th>
              <th>Informações</th>
              <th>Ação</th>
            </tr>
          </thead>
<tbody>
  {/* Linha de nova interação (com botão de confirmar) */}
  {novaInteracao && (
    <tr ref={novaInteracaoRef}>
      <td>
<div className={styles.fakeDropdownWrapper}>
  <div className={styles.fakeDropdownToggle} onClick={() => setDropdownAberto(!dropdownAberto)}>
    {tiposInteracao.find(tipo => tipo.id === novaInteracao.tipo_id)?.nome || "Selecione o tipo"}
  </div>

  {dropdownAberto && (
    <ul className={styles.fakeDropdownLista}>
      {tiposInteracao.map((tipo) => (
        <li
          key={tipo.id}
          onClick={() => {
            setNovaInteracao({ ...novaInteracao, tipo_id: tipo.id });
            setDropdownAberto(false);
          }}
        >
          {tipo.nome}
        </li>
      ))}
    </ul>
  )}
</div>



      </td>
      <td>
        <input
          type="date"
          className={styles.valorEditavel}
          value={novaInteracao.data_interacao}
          onChange={(e) =>
            setNovaInteracao({ ...novaInteracao, data_interacao: e.target.value })
          }
        />
      </td>
      <td>
        <input
          type="date"
          className={styles.valorEditavel}
          value={novaInteracao.data_retorno || ""}
          onChange={(e) =>
            setNovaInteracao({ ...novaInteracao, data_retorno: e.target.value })
          }
        />
      </td>
      <td>
        <input
          type="text"
          className={styles.valorEditavel}
          placeholder="Informações"
          value={novaInteracao.informacoes}
          onChange={(e) =>
            setNovaInteracao({ ...novaInteracao, informacoes: e.target.value })
          }
        />
      </td>
      <td style={{ textAlign: "center" }}>
        <button
          className={styles.erpActionBtn}
          onClick={async () => {
            await adicionarInteracao(novaInteracao);
            setNovaInteracao(null);
          }}
        >
          ✔
        </button>
      </td>
    </tr>
  )}

  {/* Linhas existentes */}
  {interacoes.map((item, idx) => (
    <tr key={idx}>
<td>{item.tipo?.nome || "—"}</td>
      <td>{formatarData(item.data_interacao)}</td>
      <td>{formatarData(item.data_retorno)}</td>
      <td>{item.informacoes}</td>
      <td style={{ textAlign: "center" }}>
        {!novaInteracao && (
<input
  type="checkbox"
  checked={interacoesSelecionadas.includes(item.id)}
  onChange={(e) => {
    if (e.target.checked) {
      setInteracoesSelecionadas([...interacoesSelecionadas, item.id]);
    } else {
      setInteracoesSelecionadas(interacoesSelecionadas.filter(id => id !== item.id));
    }
  }}
/>
        )}
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
  </div>
)}

{showExcluirPopup && (
  <div className={styles.modalOverlay}>
    <div className={`${styles.modal} ${styles.modalPequeno}`} ref={excluirRef}>
      <h3>Confirmar Exclusão</h3>
      <p>Deseja realmente excluir o lead: <strong>{leadSelecionado?.contato}</strong>?</p>
      <div className={styles.modalBotoesIncluir}>
        <button
          onClick={async () => {
            await handleExcluir(); // usa sua função existente
            setShowExcluirPopup(false);
          }}
        >
          Confirmar
        </button>
        <button className={styles.btnCancelar} onClick={() => setShowExcluirPopup(false)}>
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}


      {showFiltroPopup && (
  <div className={styles.modalOverlay}>
    <div className={`${styles.modal} ${styles.modalPequeno}`} ref={filtroRef}>
      <h3>Filtrar Leads</h3>
      <div className={styles.formGroup}>
        <label>Nome</label>
        <input
          type="text"
          value={filtroNome}
          onChange={(e) => setFiltroNome(e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Origem</label>
        <input
          type="text"
          value={filtroOrigem}
          onChange={(e) => setFiltroOrigem(e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Status</label>
        <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
          <option value="">Todos</option>
          <option value="Novo">Novo</option>
          <option value="Em negociação">Em negociação</option>
          <option value="Fechado">Fechado</option>
          <option value="Perdido">Perdido</option>
        </select>
      </div>
      <div className={styles.modalBotoesIncluir}>
        <button onClick={() => setShowFiltroPopup(false)}>Aplicar Filtro</button>
        <button className={styles.btnCancelar} onClick={() => {
          setFiltroNome("");
          setFiltroOrigem("");
          setFiltroStatus("");
          setShowFiltroPopup(false);
        }}>Redefinir Filtros</button>
      </div>
    </div>
  </div>
)}

{showDetalhes && leadSelecionado && (
  <div className={styles.detalhesOverlay} ref={detalhesRef} onClick={() => setShowDetalhes(false)}>
    <div className={styles.detalhesPainel} onClick={(e) => e.stopPropagation()}>
    <div className={styles.detalhesHeader}>
  <h3 className={styles.tituloDetalhes}>Detalhes de: <span>{leadSelecionado.contato}</span></h3>
  <button className={styles.btnFechar} onClick={() => setShowDetalhes(false)} title="Fechar">
    <FaTimes />
  </button>
</div>
      <p><strong>Empresa:</strong> {leadSelecionado.empresa}</p>
      <p><strong>Cargo:</strong> {leadSelecionado.cargo}</p>
      <p><strong>Email:</strong> {leadSelecionado.email}</p>
      <p><strong>Telefone Comercial:</strong> {formatarTelefone(leadSelecionado.telefone_comercial)}</p>
<p><strong>WhatsApp:</strong> {formatarTelefone(leadSelecionado.telefone_whatsapp)}</p>
      <p><strong>Origem:</strong> {leadSelecionado.origem_lead}</p>
      <p><strong>Indicado por:</strong> {leadSelecionado.indicado_por}</p>
<p><strong>Status: </strong> 
  {typeof leadSelecionado.status_interacao === 'object'
    ? leadSelecionado.status_interacao?.nome || "—"
    : leadSelecionado.status_interacao || "—"}
</p>
      <p><strong>Interesse:</strong> {leadSelecionado.interesse || "N/A"}</p>
<p>
  <strong>Anexos:</strong>{" "}
  {anexosDoLead.length > 0 ? (
<span
  className={styles.linkAnexo}
  onClick={() => {
    carregarAnexos(leadSelecionado.id);
    setShowAnexosPopup(true);
  }}
>
  Ver
</span>

  ) : (
    <span>Nenhum</span>
  )}
</p>

      <p><strong>Data Cadastro:</strong> {formatarData(leadSelecionado.data_cadastro)}</p>
<p><strong>Criado em:</strong> {formatarData(leadSelecionado.criado_em)}</p>
    </div>
  </div>
)}

{showExcluirInteracoesPopup && (
  <div className={styles.modalOverlay}>
    <div className={`${styles.modal} ${styles.modalPequeno}`} ref={excluirInteracoesRef}>
      <h3>Confirmar Exclusão</h3>
      <p>Deseja realmente excluir as interações selecionadas?</p>
      <div className={styles.modalBotoesIncluir}>
        <button
          onClick={async () => {
            await handleExcluirSelecionados();
            setShowExcluirInteracoesPopup(false);
          }}
        >
          Confirmar
        </button>
        <button className={styles.btnCancelar} onClick={() => setShowExcluirInteracoesPopup(false)}>
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}


{showPopup && (
  <div className={styles.modalOverlay}>
    <div className={styles.modal} ref={popupRef}>
      <h3>{leadSelecionado ? "Editar Lead Comercial" : "Novo Lead Comercial"}</h3>

      <div className={styles.formRow}>
        {Object.keys(novoComercial)
          .filter(campo => campo !== "id" && campo !== "criado_em" && campo !== "anexos" && campo !== "status" && campo !== "interesse")
          .map((campo, idx) => (
            <div className={styles.formGroup} key={idx}>
              <label>
                {campo.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                {["contato", "data_cadastro", "telefone_whatsapp", "origem_lead", "interesse"].includes(campo) && (
                  <span className={styles.asteriscoObrigatorio}> *</span>
                )}
              </label>

              {campo === "origem_lead" ? (
                <div className={styles.fakeDropdownWrapper}>
                  <div
                    className={styles.dropdownCadastroToggle}
                    onClick={() => setDropdownOrigemAberto(!dropdownOrigemAberto)}
                  >
                    {origensCliente.find(o => o.nome === novoComercial.origem_lead)?.nome || "Selecione a origem"}
                  </div>

                  {dropdownOrigemAberto && (
                    <ul className={styles.dropdownCadastroLista}>
                      {origensCliente.map((origem) => (
                        <li
                          key={origem.id}
                          onClick={() => {
                            setNovoComercial({ ...novoComercial, origem_lead: origem.nome });
                            setDropdownOrigemAberto(false);
                          }}
                        >
                          {origem.nome}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <input
                  type={campo === "data_cadastro" ? "date" : "text"}
                  name={campo}
                  value={novoComercial[campo as keyof typeof novoComercial]}
                  onChange={handleInputChange}
                />
              )}
            </div>
        ))}

{/* INTERESSE + ANEXOS LADO A LADO */}
<div className={styles.linhaDupla}>
  <div className={styles.formGroup}>
    <label>Interesse <span className={styles.asteriscoObrigatorio}>*</span></label>
    <div className={styles.fakeDropdownWrapper}>
      <div
        className={styles.dropdownCadastroToggle}
        onClick={() => setDropdownInteresseAberto(!dropdownInteresseAberto)}
      >
        {interessesComercial.find(i => i.nome === novoComercial.interesse)?.nome || "Selecione o interesse"}
      </div>

      {dropdownInteresseAberto && (
        <ul className={styles.dropdownCadastroLista}>
          {interessesComercial.map((interesse) => (
            <li
              key={interesse.id}
              onClick={() => {
                setNovoComercial({ ...novoComercial, interesse: interesse.nome });
                setDropdownInteresseAberto(false);
              }}
            >
              {interesse.nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>

  <div className={styles.formGroup}>
    <label>Anexos (opcional)</label>
    <input
      type="file"
      multiple
onChange={(e) => {
  const files = e.target.files;
  if (files) {
    setArquivosSelecionados(Array.from(files));
  }
}}
    />
  </div>
        </div>
      </div>


      <div className={styles.modalBotoesIncluir}>
        <button onClick={handleSalvar}>Salvar</button>
        <button className={styles.btnCancelar} onClick={() => {
          setShowPopup(false);
          setArquivosSelecionados([]);
        }}>
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}


{showAnexosPopup && (
  <div className={styles.modalOverlay}>
    <div className={`${styles.modal} ${styles.modalPequeno}`} ref={anexosRef}>
<h3>Anexos de: {leadSelecionado?.contato || "—"}</h3>
      
<ul className={styles.listaAnexos}>
  {anexosDoLead.map((arquivo, idx) => (
    <li key={idx} className={styles.itemAnexo}>
      <span className={styles.iconeAnexo}>📎</span>
      <span className={styles.nomeArquivo}>{arquivo}</span>
<a
href={`http://localhost:3333/uploads/comercial/${leadSelecionado?.id || 0}/${arquivo}`}
  target="_blank"
  rel="noopener noreferrer"
  className={styles.btnAnexo}
  title="Abrir em nova guia"
>
  <FaDownload />
</a>
    </li>
  ))}
</ul>




      <div className={styles.modalBotoesIncluir}>
        <button className={styles.btnCancelar} onClick={() => setShowAnexosPopup(false)}>Fechar</button>
      </div>
    </div>
  </div>
)}



    </div>
  );
}
