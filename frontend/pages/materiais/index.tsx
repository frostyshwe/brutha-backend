import { useEffect, useState } from "react";
import styles from "../../styles/materiais.module.css";
import api from "../../services/api";
import * as XLSX from "xlsx";
import {
  FaUserPlus, FaEdit, FaTrash, FaFilter,
  FaBoxOpen, FaUsers, FaBriefcase, FaChartBar,
  FaFileDownload, FaCog, FaStore
} from "react-icons/fa";
import { useRouter } from "next/router";

interface Material {
  id: number;
  nome: string;
  grupo: string;
  unidade_medida: string;
  descricao: string;
  valor: number;
  quantidade: number;
  observacao: string;
  invalido?: boolean;
}

interface MaterialImportado extends Partial<Material> {
  invalido?: boolean;
  motivos?: string;
}

export default function MateriaisPage() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [materialSelecionado, setMaterialSelecionado] = useState<Material | null>(null);
  const [buscaNome, setBuscaNome] = useState("");
  const [mostrarModalBusca, setMostrarModalBusca] = useState(false);
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [dadosFormulario, setDadosFormulario] = useState<Partial<Material>>({});
  const [mostrarConfirmacaoExclusao, setMostrarConfirmacaoExclusao] = useState(false);
  const [materiaisImportados, setMateriaisImportados] = useState<MaterialImportado[]>([]);
  const [mostrarModalImportacao, setMostrarModalImportacao] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const [carregando, setCarregando] = useState(false);

  const [mostrarModalFiltros, setMostrarModalFiltros] = useState(false);
  const [tipoOrdenacao, setTipoOrdenacao] = useState("Nenhum");
  const [tipoFiltro, setTipoFiltro] = useState("Nenhum");
  const [valorFiltro, setValorFiltro] = useState("");

  const [mostrarConfirmacaoExportacao, setMostrarConfirmacaoExportacao] = useState(false);

  useEffect(() => {
    const carregarMateriais = async () => {
      const res = await api.get("/materiais");
      setMateriais(res.data);
    };

    carregarMateriais();

    const handleClick = (event: MouseEvent) => {
      const alvo = event.target as HTMLElement;
      const clicouEmBotao = alvo.closest("button");
      const clicouEmLinhaTabela = alvo.closest("tr");
      const algumModalAberto =
        mostrarModalBusca || mostrarCadastro || mostrarConfirmacaoExclusao;

      if (!clicouEmBotao && !clicouEmLinhaTabela && !algumModalAberto) {
        setMaterialSelecionado(null);
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [mostrarModalBusca, mostrarCadastro, mostrarConfirmacaoExclusao]);

  const materiaisFiltradosSugestao = materiais.filter(mat =>
    mat.nome.toLowerCase().includes(buscaNome.toLowerCase())
  );
  
  const aplicarOrdenacao = (lista: Material[]) => {
    switch (tipoOrdenacao) {
      case "Ordem alfabética":
        return [...lista].sort((a, b) => a.nome.localeCompare(b.nome));
      case "Mais caro":
        return [...lista].sort((a, b) => b.valor - a.valor);
      case "Mais barato":
        return [...lista].sort((a, b) => a.valor - b.valor);
      case "Mais estoque":
        return [...lista].sort((a, b) => b.quantidade - a.quantidade);
      case "Menos estoque":
        return [...lista].sort((a, b) => a.quantidade - b.quantidade);
      default:
        return lista;
    }
  };

  const router = useRouter();

  
  const aplicarFiltro = (lista: Material[]) => {
    switch (tipoFiltro) {
      case "Nome":
        return lista.filter((mat) =>
          mat.nome.toLowerCase().includes(valorFiltro.toLowerCase())
        );
      case "Grupo":
        return lista.filter((mat) =>
          mat.grupo.toLowerCase().includes(valorFiltro.toLowerCase())
        );
      case "Com estoque":
        return lista.filter((mat) => mat.quantidade > 0);
      case "Sem estoque":
        return lista.filter((mat) => mat.quantidade === 0);
      default:
        return lista;
    }
  };
  
  const materiaisFiltradosEOrdenados = aplicarOrdenacao(aplicarFiltro(materiais));
  const indexInicial = (paginaAtual - 1) * itensPorPagina;
  const indexFinal = indexInicial + itensPorPagina;
  const materiaisPaginados = materiaisFiltradosEOrdenados.slice(indexInicial, indexFinal);
  const totalPaginas = Math.ceil(materiaisFiltradosEOrdenados.length / itensPorPagina);
  
  

  const unidades = [
    "m²", "m³", "m", "unid", "kg", "g", "l", "ml", "pç", "jogo", "par", "cx", "lt", "sc",
    "rolo", "folha", "barra", "kit", "verba", "h", "diária", "mL", "módulo", "pacote",
    "km", "cm", "mm", "conj"
  ];

  const abrirModalIncluir = () => {
    setBuscaNome("");
    setMostrarModalBusca(true);
    setModoEdicao(false);
    setDadosFormulario({});
  };

  const abrirModalCadastro = (nome: string) => {
    setDadosFormulario({ nome });
    setMostrarCadastro(true);
    setMostrarModalBusca(false);
  };

  const abrirModalEdicao = (material: Material) => {
    setDadosFormulario(material);
    setMostrarCadastro(true);
    setModoEdicao(true);
    setMostrarModalBusca(false);
  };

  const salvarMaterial = async () => {
    const nome = dadosFormulario.nome?.trim() || "";
    const unidade = dadosFormulario.unidade_medida?.trim() || "";
  
    if (!nome || !unidade) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
  
    const payload = {
      ...dadosFormulario,
      nome: nome,
      grupo: dadosFormulario.grupo?.trim() || "",
      unidade_medida: unidade,
      descricao: dadosFormulario.descricao?.trim() || "",
      observacao: dadosFormulario.observacao?.trim() || "",
      valor: dadosFormulario.valor !== undefined && !isNaN(dadosFormulario.valor)
        ? parseFloat(dadosFormulario.valor.toString())
        : 0,
      quantidade: !isNaN(dadosFormulario.quantidade as number)
        ? parseInt((dadosFormulario.quantidade as number).toString())
        : 0,
    };
  
    try {
      console.log("Payload enviado:", payload);
  
      if (modoEdicao && dadosFormulario.id) {
        await api.put(`/materiais/${dadosFormulario.id}`, payload);
      } else {
        await api.post("/materiais", payload);
      }
  
      const res = await api.get("/materiais");
      setMateriais(res.data);
      setMostrarCadastro(false);
      setDadosFormulario({});
      setMaterialSelecionado(null);
    } catch (error) {
      console.error("Erro ao salvar material:", error);
      alert("Erro ao salvar. Verifique os dados e tente novamente.");
    }
  };

  const handleArquivoExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    setCarregando(true);
  
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
  
      const nomesExistentes = materiais.map(mat => mat.nome?.trim().toLowerCase());
  
      const convertidos: Partial<Material & { invalido?: boolean }>[] = (json as any[]).map((item) => {
        let invalido = false;
  
        // Nome e unidade
        const nome = (item["Material"] || "").toString().trim();
        const unidade = (item["Unidade de Medida"] || "").toString().trim();
        if (!nome || nomesExistentes.includes(nome.toLowerCase()) || !unidade) {
          invalido = true;
        }
  
        // Valor
        let valorString = (item["Valor"] ?? "").toString().replace(/\s/g, "");
        const valorMatch = /^-?\d{1,3}(?:[.,]\d{2})?$/.test(valorString);
        const temDuasVirgulasOuPontos = (valorString.match(/[.,]/g) || []).length > 1;
        const valorNegativo = valorString.startsWith("-");
  
        if (!valorString || valorString === "null" || valorString === "undefined") {
          valorString = "0,00";
        } else if (temDuasVirgulasOuPontos || !valorMatch || valorNegativo) {
          invalido = true;
        }
  
        // Quantidade
        let quantidadeStr = (item["Quantidade"] ?? "").toString().trim();
        if (quantidadeStr === "") quantidadeStr = "0";
        const quantidadeNum = Number(quantidadeStr);
        const quantidadeValida = !isNaN(quantidadeNum) && Number.isInteger(quantidadeNum) && quantidadeNum >= 0;
        if (!quantidadeValida) invalido = true;
  
        return {
          nome,
          grupo: item["Grupo do Material"] || "",
          unidade_medida: unidade,
          descricao: item["Descrição do Material"] || "",
          valor: valorString,
          quantidade: quantidadeNum,
          observacao: item["Observação"] || "",
          invalido,
          motivos: [
            !nome && "Nome do material está vazio.",
            nomesExistentes.includes(nome.toLowerCase()) && "Já existe um material com esse nome.",
            !unidade && "Unidade de medida inválida.",
            temDuasVirgulasOuPontos && "Valor possui mais de um ponto ou vírgula.",
            !valorMatch && "Valor não está no formato válido (0,00).",
            valorNegativo && "Valor não pode ser negativo.",
            !quantidadeValida && "Quantidade inválida (somente inteiros positivos)."
          ].filter(Boolean).join("\n"),
        };
      });
  
      setMateriaisImportados(convertidos);
      setMostrarModalImportacao(true);
      setCarregando(false);
    };
  
    reader.readAsArrayBuffer(file);
  };
  
  const exportarExcel = () => {
    const dadosExportar = materiaisFiltradosEOrdenados.map(mat => ({
      "Material": mat.nome,
      "Grupo do Material": mat.grupo,
      "Unidade de Medida": mat.unidade_medida,
      "Descrição do Material": mat.descricao,
      "Valor": formatarValor(mat.valor),
      "Quantidade": mat.quantidade,
      "Observação": mat.observacao
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(dadosExportar);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Materiais");
  
    XLSX.writeFile(workbook, "materiais_exportados.xlsx");
  };  
  
  const formatarValor = (valor: any) => {
    const numero = typeof valor === "string" ? parseFloat(valor.replace(",", ".")) : Number(valor);
    if (isNaN(numero)) return "0,00";
    return numero.toFixed(2).replace(".", ",");
  };  

  const importarMateriais = async () => {
    setCarregando(true);
    try {
      const materiaisValidos = materiaisImportados.filter(mat => !mat.invalido);
      for (const mat of materiaisValidos) {
        await api.post("/materiais", mat);
      }
      const res = await api.get("/materiais");
      setMateriais(res.data);
      setMostrarModalImportacao(false);
      setMateriaisImportados([]);
    } catch (error) {
      console.error("Erro ao importar:", error);
      alert("Erro ao importar materiais.");
    } finally {
      setCarregando(false);
      setMostrarModalBusca(false);
    }
  };
  
  return (
    <div className={styles.erpContainer}>
{carregando && (
  <>
    {/* Fundo escuro bloqueando interação */}
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 9998
    }} />

    {/* Barra de carregamento no topo */}
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: "#072d54",
      color: "white",
      textAlign: "center",
      padding: "12px",
      zIndex: 9999,
      fontWeight: "bold",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
    }}>
      Processando... Aguarde.
    </div>
  </>
)}
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
                          <button className={`${styles.navItem} ${styles.active}`}><FaBoxOpen className={styles.navIcon} /><span>Materiais</span></button>
<button className={styles.navItem} onClick={() => router.push("/comercial")}>
  <FaBriefcase className={styles.navIcon} />
  <span>Comercial</span>
</button>
          <button className={styles.navItem}><FaChartBar className={styles.navIcon} /><span>Relatórios</span></button>
          <button className={styles.navItem}><FaFileDownload className={styles.navIcon} /><span>Documentos</span></button>
          <button className={styles.navItem}><FaCog className={styles.navIcon} /><span>Configuração</span></button>
        </nav>
      </header>

      <div className={styles.actionToolbar}>
        <span>Material Selecionado: <strong>{materialSelecionado?.nome || "Nenhum"}</strong></span>
        <div className={styles.toolbarButtons}>
          <button className={styles.erpActionBtn} onClick={abrirModalIncluir}><FaUserPlus /> Incluir</button>
          <button
            className={styles.erpActionBtn}
            onClick={() => materialSelecionado && abrirModalEdicao(materialSelecionado)}
            disabled={!materialSelecionado}
          ><FaEdit /> Editar</button>
          <button
            className={styles.erpActionBtn}
            disabled={!materialSelecionado}
            onClick={() => setMostrarConfirmacaoExclusao(true)}
          ><FaTrash /> Excluir</button>
          <button
            className={styles.erpActionBtn}
            onClick={() => setMostrarModalFiltros(true)}
          >
            <FaFilter /> Filtrar
          </button>
                    <button
            className={styles.erpActionBtn}
            onClick={() => setMostrarConfirmacaoExportacao(true)}
          >
            <FaFileDownload /> Exportar
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Grupo</th>
              <th>Unidade</th>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Estoque</th>
              <th>Quantidade</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>
            {materiaisPaginados.map(mat => (
              <tr
                key={mat.id}
                className={materialSelecionado?.id === mat.id ? styles.selectedRow : ""}
                onClick={() => setMaterialSelecionado(mat)}
              >
                <td>{mat.nome}</td>
                <td>{mat.grupo}</td>
                <td>{mat.unidade_medida}</td>
                <td className={styles.descColuna}>{mat.descricao}</td>
                <td>R$ {formatarValor(mat.valor)}</td>
                <td>{mat.quantidade > 0 ? (
                  <span style={{ color: "green", fontWeight: "bold" }}>✔</span>
                ) : (
                  <span style={{ color: "red", fontWeight: "bold" }}>✘</span>
                )}</td>
                <td>{mat.quantidade}</td>
                <td className={styles.obsColuna}>{mat.observacao}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.paginacaoContainer}>
  <div className={styles.paginacaoControles}>
    <label>Itens por página:</label>
    <select
      value={itensPorPagina}
      onChange={(e) => {
        setItensPorPagina(parseInt(e.target.value));
        setPaginaAtual(1); // resetar para página 1 ao trocar limite
      }}
    >
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
      <option value={100}>100</option>
    </select>
  </div>
  <div className={styles.paginacaoNumeros}>
  {(() => {
  const paginas = [];
  const mostrarPaginas = 2; // quantidade de páginas vizinhas ao redor

  const adicionarBotao = (num: number) => {
    paginas.push(
      <button
        key={num}
        onClick={() => setPaginaAtual(num)}
        className={num === paginaAtual ? styles.paginaAtiva : ""}
      >
        {num}
      </button>
    );
  };

  if (totalPaginas <= 10) {
    for (let i = 1; i <= totalPaginas; i++) adicionarBotao(i);
  } else {
    adicionarBotao(1);

    if (paginaAtual > mostrarPaginas + 2) paginas.push(<span key="start">...</span>);

    for (let i = Math.max(2, paginaAtual - mostrarPaginas); i <= Math.min(totalPaginas - 1, paginaAtual + mostrarPaginas); i++) {
      adicionarBotao(i);
    }

    if (paginaAtual < totalPaginas - mostrarPaginas - 1) paginas.push(<span key="end">...</span>);

    adicionarBotao(totalPaginas);
  }

  return paginas;
})()}
  </div>
</div>
      </div>

      {mostrarModalBusca && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${styles.modalPequeno}`}>
            <h3>Incluir Material</h3>
            <input
              type="text"
              placeholder="Digite o nome do material"
              value={buscaNome}
              onChange={(e) => setBuscaNome(e.target.value)}
            />
<input
  type="file"
  accept=".xlsx, .xls"
  id="inputExcel"
  onChange={handleArquivoExcel}
  style={{ display: "none" }}
/>
            {buscaNome.trim() !== "" && materiaisFiltradosSugestao.length > 0 && (
              <ul className={styles.sugestoes}>
                {materiaisFiltradosSugestao.map(mat => (
                  <li key={mat.id} onClick={() => abrirModalEdicao(mat)}>{mat.nome}</li>
                ))}
              </ul>
            )}
            {buscaNome.trim() === "" ? (
              <div className={styles.modalBotoesIncluir}>
                <button className={styles.btnCancelar} onClick={() => setMostrarModalBusca(false)}>
                  Cancelar
                </button>
                <div>
                <button onClick={() => {
                  const input = document.getElementById("inputExcel") as HTMLInputElement;
                  if (input) {
                    input.value = ""; // zera o valor
                    input.click();    // abre o seletor
                  }
                }}>
                  Importar arquivo Excel
                </button>
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    id="inputExcel"
                    onChange={handleArquivoExcel}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            ) : materiaisFiltradosSugestao.length === 0 ? (
              <div className={styles.modalBotoesIncluir}>
                <button className={styles.btnCancelar} onClick={() => setMostrarModalBusca(false)}>
                  Cancelar
                </button>
                <button onClick={() => abrirModalCadastro(buscaNome)}>
                  Incluir novo material
                </button>
              </div>
            ) : (
              <div className={styles.modalBotoesIncluir}>
                <button className={styles.btnCancelar} onClick={() => setMostrarModalBusca(false)}>
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {mostrarConfirmacaoExclusao && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${styles.modalPequeno}`}>
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir o material <strong>{materialSelecionado?.nome}</strong>?</p>
            <div className={styles.modalFooter}>
              <button className={styles.btnCancelar} onClick={() => setMostrarConfirmacaoExclusao(false)}>
                Cancelar
              </button>
              <button onClick={async () => {
                if (materialSelecionado?.id) {
                  await api.delete(`/materiais/${materialSelecionado.id}`);
                  const res = await api.get("/materiais");
                  setMateriais(res.data);
                  setMaterialSelecionado(null);
                  setMostrarConfirmacaoExclusao(false);
                }
              }}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarCadastro && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>{modoEdicao ? `Editar ${dadosFormulario.nome}` : `Incluir ${dadosFormulario.nome}`}</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Nome do material: *</label>
                <input type="text" placeholder="Nome" value={dadosFormulario.nome || ""} onChange={e => setDadosFormulario({ ...dadosFormulario, nome: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label>Grupo:</label>
                <input type="text" placeholder="Grupo" value={dadosFormulario.grupo || ""} onChange={e => setDadosFormulario({ ...dadosFormulario, grupo: e.target.value })} />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Unidade de medida: *</label>
                <select value={dadosFormulario.unidade_medida || ""} onChange={e => setDadosFormulario({ ...dadosFormulario, unidade_medida: e.target.value })}>
                  <option value="">Selecione a unidade</option>
                  {unidades.map((u, i) => (
                    <option key={i} value={u}>{u}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Descrição:</label>
                <input type="text" placeholder="Descrição" value={dadosFormulario.descricao || ""} onChange={e => setDadosFormulario({ ...dadosFormulario, descricao: e.target.value })} />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Valor:</label>
                <input type="number" placeholder="Valor" value={dadosFormulario.valor ?? ""} onChange={e => setDadosFormulario({ ...dadosFormulario, valor: e.target.value === "" ? undefined : parseFloat(e.target.value) })} />
              </div>
              <div className={styles.formGroup}>
                <label>Quantidade:</label>
                <input type="number" placeholder="Quantidade" value={dadosFormulario.quantidade ?? ""} onChange={e => setDadosFormulario({ ...dadosFormulario, quantidade: e.target.value === "" ? undefined : parseInt(e.target.value) })} />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ flex: "1 1 100%" }}>
                <label>Observação:</label>
                <textarea placeholder="Observação" value={dadosFormulario.observacao || ""} onChange={e => setDadosFormulario({ ...dadosFormulario, observacao: e.target.value })} style={{ minHeight: "80px" }} />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnCancelar} onClick={() => setMostrarCadastro(false)}>Cancelar</button>
              <button onClick={salvarMaterial}>{modoEdicao ? "Salvar Alterações" : "Cadastrar Material"}</button>
            </div>
          </div>
        </div>
      )}

{mostrarModalFiltros && (
  <div className={styles.modalOverlay}>
    <div className={`${styles.modal} ${styles.modalPequeno}`}>
      <h3>Filtrar e Ordenar Materiais</h3>

      <div className={styles.formGroup}>
        <label>Ordenar por:</label>
        <select value={tipoOrdenacao} onChange={(e) => setTipoOrdenacao(e.target.value)}>
          <option value="Nenhum">Nenhum</option>
          <option value="Ordem alfabética">Ordem alfabética</option>
          <option value="Mais caro">Mais caro</option>
          <option value="Mais barato">Mais barato</option>
          <option value="Mais estoque">Mais estoque</option>
          <option value="Menos estoque">Menos estoque</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Filtrar por:</label>
        <select value={tipoFiltro} onChange={(e) => {
          setTipoFiltro(e.target.value);
          setValorFiltro(""); // limpa o campo se mudar o tipo
        }}>
          <option value="Nenhum">Nenhum</option>
          <option value="Nome">Nome</option>
          <option value="Grupo">Grupo</option>
          <option value="Com estoque">Com estoque</option>
          <option value="Sem estoque">Sem estoque</option>
        </select>
      </div>

      {(tipoFiltro === "Nome" || tipoFiltro === "Grupo") && (
        <div className={styles.formGroup}>
          <label>Digite aqui:</label>
          <input
            type="text"
            value={valorFiltro}
            onChange={(e) => setValorFiltro(e.target.value)}
          />
        </div>
      )}

      <div className={styles.modalFooter}>
        <button
          className={styles.btnCancelar}
          onClick={() => {
            setMostrarModalFiltros(false);
            setTipoOrdenacao("Nenhum");
            setTipoFiltro("Nenhum");
            setValorFiltro("");
          }}
        >
          Redefinir
        </button>
        <button onClick={() => setMostrarModalFiltros(false)}>
          Aplicar
        </button>
      </div>
    </div>
  </div>
)}
      
      {mostrarModalImportacao && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Materiais carregados: {materiaisImportados.length}</h3>
            {materiaisImportados.some(mat => mat.invalido) ? (
              <p style={{ marginBottom: "12px", marginTop: "-10px", fontSize: "14px", color: "#d10000" }}>
                ⚠️ Existem {materiaisImportados.filter(mat => mat.invalido).length} materiais com dados inválidos e serão ignorados.
              </p>
            ) : (
              <p style={{ marginBottom: "12px", marginTop: "-10px", fontSize: "14px", color: "green" }}>
                ✅ Todos os materiais estão válidos para importação.
              </p>
            )}

            <div className={styles.tableContainer} style={{ maxHeight: "300px", overflowY: "auto" }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Grupo</th>
                    <th>Unidade</th>
                    <th>Descrição</th>
                    <th>Valor</th>
                    <th>Quantidade</th>
                    <th>Observação</th>
                  </tr>
                </thead>
                <tbody>
                {materiaisImportados.map((mat, idx) => (
                    <tr key={idx} style={mat.invalido ? { backgroundColor: "#ffe0e0" } : {}}>
                      <td>
  {mat.invalido && (
    <span
      title={mat.motivos}
      style={{ color: "orange", fontWeight: "bold", marginRight: "4px" }}
    >
      ⚠️
    </span>
  )}
  {mat.nome}
</td>
                      <td>{mat.grupo}</td>
                      <td>{mat.unidade_medida}</td>
                      <td className={styles.descColuna}>{mat.descricao}</td>
                      <td>{mat.invalido ? mat.valor : formatarValor(mat.valor)}</td>
                      <td>{mat.quantidade}</td>
                      <td className={styles.obsColuna}>{mat.observacao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnCancelar} onClick={() => {
                setMostrarModalImportacao(false);
                setMateriaisImportados([]);
              }}>
                Cancelar
              </button>
              <button onClick={importarMateriais}>Importar materiais</button>
            </div>
          </div>
        </div>
      )}
      {mostrarConfirmacaoExportacao && (
  <div className={styles.modalOverlay}>
    <div className={`${styles.modal} ${styles.modalPequeno}`}>
      <h3>Confirmar Exportação</h3>
      <p>Deseja exportar <strong>{materiaisFiltradosEOrdenados.length}</strong> materiais?</p>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "16px",
        background: "white",
        paddingTop: "10px",
        gap: "12px"
      }}>
        <button
          className={styles.btnCancelar}
          onClick={() => setMostrarConfirmacaoExportacao(false)}
        >
          Cancelar
        </button>

        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => {
            exportarExcel();
            setMostrarConfirmacaoExportacao(false);
          }}>
            Exportar
          </button>

          <button
            style={{
              backgroundColor: "#c82333",
              color: "white",
              fontWeight: "bold",
              border: "none",
              padding: "10px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
            onClick={async () => {
              setCarregando(true);
              exportarExcel();
              try {
                for (const mat of materiaisFiltradosEOrdenados) {
                  await api.delete(`/materiais/${mat.id}`);
                }
                const res = await api.get("/materiais");
                setMateriais(res.data);
                setMaterialSelecionado(null);
              } catch (error) {
                console.error("Erro ao excluir materiais:", error);
                alert("Erro ao excluir materiais.");
              } finally {
                setMostrarConfirmacaoExportacao(false);
                setCarregando(false);
              }
            }}            
          >
            Exportar e Excluir
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
