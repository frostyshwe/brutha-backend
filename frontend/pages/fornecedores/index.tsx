import { useEffect, useState } from "react";
import styles from "../../styles/fornecedores.module.css";
import { FaUsers, FaDownload, FaEllipsisV, FaTimes, FaStore, FaBoxOpen, FaBriefcase, FaChartBar, FaFileDownload, FaCog, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from "next/router";

export default function FornecedoresPage() {
  const router = useRouter();
const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
type Fornecedor = {
  id: number;
  empresa: string;
  cnpj?: string;
  atividade: string;
  nome_contato: string;
  telefone?: string;
  telefone_whatsapp?: string;
  email?: string;
  cidade_estado?: string;
  site_redes?: string;
  anotacoes?: string;
  status: string;
  data_cadastro: string;
  avaliacao?: string;
  anexos?: string;
  criado_em?: string;
};


const [fornecedorSelecionado, setFornecedorSelecionado] = useState<Fornecedor | null>(null);
  const [showPopup, setShowPopup] = useState(false);
const [novoFornecedor, setNovoFornecedor] = useState({
  empresa: "",
  cnpj: "",
  atividade: "",
  nome_contato: "",
  telefone: "",
  telefone_whatsapp: "",
  email: "",
  cidade_estado: "",
  site_redes: "",
  anotacoes: "",
  status: "",
  data_cadastro: new Date().toISOString().split("T")[0],
  avaliacao: "",
  anexos: ""
});
const [arquivosSelecionados, setArquivosSelecionados] = useState<File[]>([]);
const [showExcluirPopup, setShowExcluirPopup] = useState(false);
const [showDetalhes, setShowDetalhes] = useState(false);
const [anexosFornecedor, setAnexosFornecedor] = useState([]);
const [showAnexosPopup, setShowAnexosPopup] = useState(false);


  
  useEffect(() => {
  buscarFornecedores();
}, []);

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setNovoFornecedor((prev) => ({ ...prev, [name]: value }));
};



const formatarData = (dataISO: string | undefined): string => {
  if (!dataISO) return "-";

  const data = new Date(dataISO);
  data.setMinutes(data.getMinutes() + data.getTimezoneOffset());

  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
};


  
const aplicarMascaraTelefone = (valor: string): string => {
  return valor
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};


const aplicarMascaraCNPJ = (valor: string): string => {
  return valor
    .replace(/\D/g, '') // Remove tudo que não for número
    .replace(/^(\d{2})(\d)/, '$1.$2') 
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3') 
    .replace(/\.(\d{3})(\d)/, '.$1/$2') 
    .replace(/(\d{4})(\d)/, '$1-$2') 
    .replace(/(-\d{2})\d+?$/, '$1'); // limita pra não passar de 14 dígitos
};

const carregarAnexosFornecedor = async (id: number | string) => {
  try {
    const response = await fetch(`http://localhost:3333/api/fornecedores/${id}/anexos`);
    const data = await response.json();
    setAnexosFornecedor(data);
  } catch (error) {
    console.error("Erro ao buscar anexos do fornecedor:", error);
  }
};



const handleExcluir = async () => {
  if (!fornecedorSelecionado) return;

  try {
    const response = await fetch(`http://localhost:3333/api/fornecedores/${fornecedorSelecionado.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setShowExcluirPopup(false);
      setFornecedorSelecionado(null);
      buscarFornecedores(); // atualiza a lista
    } else {
      alert("Erro ao excluir fornecedor.");
    }
  } catch (error) {
    console.error("Erro ao excluir:", error);
    alert("Erro ao se conectar com o servidor.");
  }
};


const handleSalvar = async () => {
  // ⚠️ Validação dos obrigatórios
  if (
    !novoFornecedor.empresa.trim() ||
    !novoFornecedor.atividade.trim() ||
    !novoFornecedor.nome_contato.trim() ||
    !novoFornecedor.status.trim() ||
    !novoFornecedor.data_cadastro
  ) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  const isEdicao = !!fornecedorSelecionado;
  const url = isEdicao
    ? `http://localhost:3333/api/fornecedores/${fornecedorSelecionado.id}`
    : "http://localhost:3333/api/fornecedores";

  const method = isEdicao ? "PUT" : "POST";

  try {
    // 1️⃣ Envia os dados principais
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoFornecedor),
    });

    if (!response.ok) {
      alert("Erro ao salvar fornecedor.");
      return;
    }

    const salvo = await response.json();
    const id = salvo.id || fornecedorSelecionado?.id;

    // 2️⃣ Envia os arquivos (se houver)
    if (arquivosSelecionados.length > 0 && id) {
      const formData = new FormData();
      arquivosSelecionados.forEach((file) => formData.append("anexos", file));

      const uploadResponse = await fetch(`http://localhost:3333/api/fornecedores/${id}/anexos`, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        console.warn("Erro no upload de arquivos");
      }
    }

    // 3️⃣ Limpa e atualiza
    setShowPopup(false);
    setArquivosSelecionados([]);
    setFornecedorSelecionado(null);
    setNovoFornecedor({
      empresa: "",
      cnpj: "",
      atividade: "",
      nome_contato: "",
      telefone: "",
      telefone_whatsapp: "",
      email: "",
      cidade_estado: "",
      site_redes: "",
      anotacoes: "",
      status: "",
      data_cadastro: new Date().toISOString().split("T")[0],
      avaliacao: "",
      anexos: ""
    });

    buscarFornecedores(); // 🔄 atualiza a lista

  } catch (err) {
    console.error(err);
    alert("Erro na comunicação com o servidor.");
  }
};


  const buscarFornecedores = async () => {
  try {
    const res = await fetch("http://localhost:3333/api/fornecedores");
    const data = await res.json();
    setFornecedores(data);
  } catch (err) {
    console.error("Erro ao buscar fornecedores:", err);
  }
};

const handleSalvarFornecedor = async () => {
  const isEdicao = !!fornecedorSelecionado;
  const url = isEdicao
    ? `http://localhost:3333/api/fornecedores/${fornecedorSelecionado.id}`
    : "http://localhost:3333/api/fornecedores";

  const method = isEdicao ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoFornecedor)
    });

    if (!res.ok) throw new Error("Erro ao salvar");

    const novo = await res.json();
    setShowPopup(false);
    setFornecedorSelecionado(null);
    setNovoFornecedor({
      empresa: "",
      cnpj: "",
      atividade: "",
      nome_contato: "",
      telefone: "",
      telefone_whatsapp: "",
      email: "",
      cidade_estado: "",
      site_redes: "",
      anotacoes: "",
      status: "",
      data_cadastro: new Date().toISOString().split("T")[0],
      avaliacao: "",
      anexos: ""
    });
    buscarFornecedores();
  } catch (err) {
    console.error("Erro ao salvar fornecedor:", err);
    alert("Erro ao salvar fornecedor.");
  }
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
          <button className={`${styles.navItem} ${styles.active}`}>
            <FaStore className={styles.navIcon} />
            <span>Fornecedores</span>
          </button>
          <button className={styles.navItem} onClick={() => router.push("/materiais")}>
            <FaBoxOpen className={styles.navIcon} />
            <span>Materiais</span>
          </button>
          <button className={styles.navItem} onClick={() => router.push("/comercial")}>
            <FaBriefcase className={styles.navIcon} />
            <span>Comercial</span>
          </button>
          <button className={styles.navItem}>
            <FaChartBar className={styles.navIcon} />
            <span>Relatórios</span>
          </button>
          <button className={styles.navItem}>
            <FaFileDownload className={styles.navIcon} />
            <span>Documentos</span>
          </button>
          <button className={styles.navItem}>
            <FaCog className={styles.navIcon} />
            <span>Configuração</span>
          </button>
        </nav>
      </header>

      <div className={styles.erpHeader}>
        <div className={styles.actionToolbar}>
          <span>Fornecedor Selecionado: <strong>{fornecedorSelecionado?.empresa || "Nenhum"}</strong></span>
          <div className={styles.toolbarButtons}>
<button className={styles.erpActionBtn} onClick={() => {
  setFornecedorSelecionado(null);
  setNovoFornecedor({
    empresa: "",
    cnpj: "",
    atividade: "",
    nome_contato: "",
    telefone: "",
    telefone_whatsapp: "",
    email: "",
    cidade_estado: "",
    site_redes: "",
    anotacoes: "",
    status: "",
    data_cadastro: new Date().toISOString().split("T")[0],
    avaliacao: "",
    anexos: ""
  });
  setShowPopup(true);
}}>
  <FaPlus /> Incluir
</button>
<button
  className={styles.erpActionBtn}
  onClick={() => {
if (fornecedorSelecionado) {
  setNovoFornecedor({
    empresa: fornecedorSelecionado.empresa || "",
    cnpj: fornecedorSelecionado.cnpj || "",
    atividade: fornecedorSelecionado.atividade || "",
    nome_contato: fornecedorSelecionado.nome_contato || "",
    telefone: fornecedorSelecionado.telefone || "",
    telefone_whatsapp: fornecedorSelecionado.telefone_whatsapp || "",
    email: fornecedorSelecionado.email || "",
    cidade_estado: fornecedorSelecionado.cidade_estado || "",
    site_redes: fornecedorSelecionado.site_redes || "",
    anotacoes: fornecedorSelecionado.anotacoes || "",
    status: fornecedorSelecionado.status || "",
    data_cadastro: fornecedorSelecionado.data_cadastro || "",
    avaliacao: fornecedorSelecionado.avaliacao || "",
    anexos: fornecedorSelecionado.anexos || ""
  });
  setShowPopup(true);
}
  }}
  disabled={!fornecedorSelecionado}
>
  <FaEdit /> Editar
</button>

<button
  className={styles.erpActionBtn}
  onClick={() => setShowExcluirPopup(true)}
  disabled={!fornecedorSelecionado}
>
  <FaTrash /> Excluir
</button>
          </div>
        </div>

        <div className={styles.tableContainer}>
<table className={styles.table}>
<thead>
  <tr>
    <th>Empresa</th>
    <th>Atividade</th>
    <th>Nome do Contato</th>
    <th>WhatsApp</th>
    <th>Email</th>
    <th>Status</th>
    <th>Data de Cadastro</th>
    <th></th> {/* coluna dos 3 pontinhos */}
  </tr>
</thead>

<tbody>
  {fornecedores.map((fornecedor, idx) => (
    <tr
      key={idx}
      onClick={() => setFornecedorSelecionado(fornecedor)}
      style={{
        backgroundColor: fornecedorSelecionado?.id === fornecedor.id ? "#d0ebff" : "transparent"
      }}
    >
      <td>{fornecedor.empresa}</td>
      <td>{fornecedor.atividade}</td>
      <td>{fornecedor.nome_contato}</td>
      <td>{fornecedor.telefone_whatsapp}</td>
      <td>{fornecedor.email}</td>
      <td>{fornecedor.status}</td>
      <td>{formatarData(fornecedor.data_cadastro)}</td>
      <td style={{ width: "40px", textAlign: "center" }}>
<button
  className={styles.btnDetalhes}
  onClick={async (e) => {
    e.stopPropagation();
    setFornecedorSelecionado(fornecedor);
    await carregarAnexosFornecedor(fornecedor.id); // 👈 ADICIONE ISSO!
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

      {showPopup && (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>
      <h3>{fornecedorSelecionado ? "Editar Fornecedor" : "Novo Fornecedor"}</h3>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Empresa <span className={styles.asteriscoObrigatorio}>*</span></label>
          <input type="text" name="empresa" value={novoFornecedor.empresa} onChange={handleInputChange} />
        </div>

        <div className={styles.formGroup}>
          <label>CNPJ</label>
          <input type="text" name="cnpj" value={novoFornecedor.cnpj} onChange={(e) =>
    setNovoFornecedor(prev => ({
      ...prev,
      cnpj: aplicarMascaraCNPJ(e.target.value)
    }))
  }
 />
        </div>

        <div className={styles.formGroup}>
          <label>Atividade <span className={styles.asteriscoObrigatorio}>*</span></label>
          <input type="text" name="atividade" value={novoFornecedor.atividade} onChange={handleInputChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Nome do Contato <span className={styles.asteriscoObrigatorio}>*</span></label>
          <input type="text" name="nome_contato" value={novoFornecedor.nome_contato} onChange={handleInputChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Telefone</label>
          <input
            type="text"
            name="telefone"
            value={novoFornecedor.telefone}
            onChange={(e) => setNovoFornecedor(prev => ({
              ...prev,
              telefone: aplicarMascaraTelefone(e.target.value)
            }))}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Telefone WhatsApp</label>
          <input
            type="text"
            name="telefone_whatsapp"
            value={novoFornecedor.telefone_whatsapp}
            onChange={(e) => setNovoFornecedor(prev => ({
              ...prev,
              telefone_whatsapp: aplicarMascaraTelefone(e.target.value)
            }))}
          />
        </div>

        <div className={styles.formGroup}>
          <label>E-mail</label>
          <input type="email" name="email" value={novoFornecedor.email} onChange={handleInputChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Cidade / Estado</label>
          <input type="text" name="cidade_estado" value={novoFornecedor.cidade_estado} onChange={handleInputChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Site ou Redes Sociais</label>
          <input type="text" name="site_redes" value={novoFornecedor.site_redes} onChange={handleInputChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Anotações</label>
          <textarea name="anotacoes" rows={1} value={novoFornecedor.anotacoes} onChange={handleInputChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Status <span className={styles.asteriscoObrigatorio}>*</span></label>
          <input type="text" name="status" value={novoFornecedor.status} onChange={handleInputChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Data de Cadastro <span className={styles.asteriscoObrigatorio}>*</span></label>
          <input type="date" name="data_cadastro" value={novoFornecedor.data_cadastro} onChange={handleInputChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Avaliação</label>
          <input type="text" name="avaliacao" value={novoFornecedor.avaliacao} onChange={handleInputChange} />
        </div>

        <div className={styles.formGroup}>
          <label>Anexos</label>
          <input type="file" multiple onChange={(e) => {
  const files = e.target.files;
  if (files) {
    setArquivosSelecionados(Array.from(files));
  }
}}
 />
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

{showExcluirPopup && (
  <div className={styles.modalOverlay}>
    <div className={`${styles.modal} ${styles.modalPequeno}`}>
      <h3>Confirmar Exclusão</h3>
      <p>Deseja realmente excluir o fornecedor: <strong>{fornecedorSelecionado?.empresa}</strong>?</p>
      <div className={styles.modalBotoesIncluir}>
        <button onClick={handleExcluir}>Confirmar</button>
        <button className={styles.btnCancelar} onClick={() => setShowExcluirPopup(false)}>
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}

{showDetalhes && fornecedorSelecionado && (
  <div className={styles.detalhesOverlay} onClick={() => setShowDetalhes(false)}>
    <div className={styles.detalhesPainel} onClick={(e) => e.stopPropagation()}>
      <div className={styles.detalhesHeader}>
        <h3 className={styles.tituloDetalhes}>Detalhes de: <span>{fornecedorSelecionado.empresa}</span></h3>
        <button className={styles.btnFechar} onClick={() => setShowDetalhes(false)} title="Fechar">
          <FaTimes />
        </button>
      </div>

      <p><strong>CNPJ:</strong> {fornecedorSelecionado.cnpj || "—"}</p>
      <p><strong>Atividade:</strong> {fornecedorSelecionado.atividade}</p>
      <p><strong>Nome do Contato:</strong> {fornecedorSelecionado.nome_contato}</p>
      <p><strong>Telefone:</strong> {fornecedorSelecionado.telefone}</p>
      <p><strong>WhatsApp:</strong> {fornecedorSelecionado.telefone_whatsapp}</p>
      <p><strong>Email:</strong> {fornecedorSelecionado.email}</p>
      <p><strong>Cidade / Estado:</strong> {fornecedorSelecionado.cidade_estado}</p>
      <p><strong>Site / Redes:</strong> {fornecedorSelecionado.site_redes}</p>
      <p><strong>Anotações:</strong> {fornecedorSelecionado.anotacoes}</p>
      <p><strong>Status:</strong> {fornecedorSelecionado.status}</p>
      <p><strong>Avaliação:</strong> {fornecedorSelecionado.avaliacao}</p>
      <p><strong>Data de Cadastro:</strong> {formatarData(fornecedorSelecionado.data_cadastro)}</p>
      <p><strong>Criado em:</strong> {formatarData(fornecedorSelecionado.criado_em)}</p>

<p>
  <strong>Anexos:</strong>{" "}
  {anexosFornecedor.length > 0 ? (
    <span
      className={styles.linkAnexo}
      onClick={() => setShowAnexosPopup(true)}
    >
      Ver
    </span>
  ) : (
    <span>Nenhum</span>
  )}
</p>


    </div>
  </div>
)}

{showAnexosPopup && (
  <div className={styles.modalOverlay}>
    <div className={`${styles.modal} ${styles.modalPequeno}`}>
<h3>Anexos de: {fornecedorSelecionado?.empresa || "—"}</h3>

      <ul className={styles.listaAnexos}>
        {anexosFornecedor.map((arquivo, idx) => (
          <li key={idx} className={styles.itemAnexo}>
            <span className={styles.iconeAnexo}>📎</span>
            <span className={styles.nomeArquivo}>{arquivo}</span>
<a
href={`http://localhost:3333/uploads/fornecedores/${fornecedorSelecionado?.id || 0}/${arquivo}`}
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
        <button className={styles.btnCancelar} onClick={() => setShowAnexosPopup(false)}>
          Fechar
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
