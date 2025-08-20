import { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import styles from "../../styles/clientes.module.css";
import { FaEdit, FaTrash, FaStore, FaFileDownload, FaFilter, FaUserPlus, FaCheck, FaUsers, FaBoxOpen, FaChartBar, FaBriefcase, FaCog, FaEllipsisV } from "react-icons/fa";
import { LuClipboardPen } from "react-icons/lu";
import { GiNotebook } from "react-icons/gi";
import { FaMoneyBillTrendUp, FaMoneyBillTransfer } from "react-icons/fa6";
import { PiHandArrowUpBold, PiHandArrowDownBold } from "react-icons/pi";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useRouter } from "next/router";



interface Cliente {
  id: number;
  nome: string;
  documento: string;
  responsavel: string;
  contato: string;
  servico_id?: number;
  status_id?: number;
  ServicoObra?: {
    categoria_servico: string;
    servico: string;
  };
  StatusObra?: {
    status: string;
    categoria_status?: string;
  };  
}

interface ServicoObra {
  id: number;
  categoria_servico: string;
  servico: string;
}

interface StatusObra {
  id: number;
  status: string;
  categoria_status?: string;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [servicosObra, setServicosObra] = useState<ServicoObra[]>([]);
  const [statusObra, setStatusObra] = useState<StatusObra[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [servicosFiltrados, setServicosFiltrados] = useState<ServicoObra[]>([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroSelecionado, setFiltroSelecionado] = useState("nome");
  const [senhaExclusao, setSenhaExclusao] = useState("");
  const [showSenhaPopupId, setShowSenhaPopupId] = useState<number | null>(null);
  const [categoriaFiltroServico, setCategoriaFiltroServico] = useState("");
  const [categoriaFiltroStatus, setCategoriaFiltroStatus] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [showFiltroPopup, setShowFiltroPopup] = useState(false);
const [tempFiltroSelecionado, setTempFiltroSelecionado] = useState(filtroSelecionado);
const [tempTermoBusca, setTempTermoBusca] = useState(termoBusca);
const [tempCategoriaFiltroServico, setTempCategoriaFiltroServico] = useState(categoriaFiltroServico);
const [tempCategoriaFiltroStatus, setTempCategoriaFiltroStatus] = useState(categoriaFiltroStatus);
const [clientePopup, setClientePopup] = useState<Cliente | null>(null);
const [subTipo, setSubTipo] = useState("levantamentos");
type SubDado = {
  valor_maodeobra: string;
  [key: string]: any; // <- se tiver campos dinâmicos
};

const [subDados, setSubDados] = useState<SubDado[]>([]);
const [showOrcamentoPopup, setShowOrcamentoPopup] = useState(false);
const [levantamentosFinalizados, setLevantamentosFinalizados] = useState(false);
const [orcamentosFinalizados, setOrcamentosFinalizados] = useState(false);
const [linhaSelecionada, setLinhaSelecionada] = useState<number[]>([]);
const [showPopupProposta, setShowPopupProposta] = useState(false); // para abrir o popup
const [showLevantamentoPopup, setShowLevantamentoPopup] = useState(false);
const [planilhaPreview] = useState<any[]>([]);
const [showEntradaPopup, setShowEntradaPopup] = useState(false);
const [clientesFinalizados, setClientesFinalizados] = useState<{ [key: number]: boolean }>({});
const [showSaidaPopup, setShowSaidaPopup] = useState(false);
const entradaOverlayRef = useRef(null);
const saidaOverlayRef = useRef(null);
const levantamentoOverlayRef = useRef(null);
const orcamentoOverlayRef = useRef(null);
const propostaOverlayRef = useRef(null);
const clientePopupRef = useRef(null);
const senhaPopupRef = useRef(null);
const filtroPopupRef = useRef(null);

const abrirPopupGestao = (cliente: Cliente) => {
  setClientePopup(cliente);
};

const nomesBonitosSubTabelas: Record<string, string> = {
  orcamentos: "Orçamentos",
  entradas: "Entradas",
  saidas: "Saídas",
  reembolsos: "Reembolsos",
  levantamentos: "Levantamento"
};

const handleEntradaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setNovaEntrada((prev: any) => ({ ...prev, [name]: value }));
};

const [novaEntrada, setNovaEntrada] = useState<any>({
  item: "",
  grupo_item: "",
  valor: "",
  origem_recebimento: "",
  dt_entrada: "",
  obs: ""
});

const [novaSaida, setNovaSaida] = useState<any>({
  item: "",
  grupo_item: "",
  valor_negociado: "",
  valor_pago: "",
  previsto: "",
  origem_pagamento: "",
  dt_saida: "",
  obs: ""
});

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (entradaOverlayRef.current === event.target) setShowEntradaPopup(false);
    if (saidaOverlayRef.current === event.target) setShowSaidaPopup(false);
    if (levantamentoOverlayRef.current === event.target) setShowLevantamentoPopup(false);
    if (orcamentoOverlayRef.current === event.target) setShowOrcamentoPopup(false);
    if (propostaOverlayRef.current === event.target) setShowPopupProposta(false);
    if (clientePopupRef.current === event.target) setShowPopup(false);
    if (senhaPopupRef.current === event.target) setShowSenhaPopupId(null);
    if (filtroPopupRef.current === event.target) setShowFiltroPopup(false);
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);




const finalizarLevantamentos = async () => {
  if (!clienteSelecionado) return;

  try {
    const res = await api.post(`/api/levantamentos/finalizar/${clienteSelecionado.id}`);
    console.log("Resposta da finalização:", res.data);

    // Verifica se é a mensagem de que já existem levantamentos
    if (res.data.message === "Nenhum novo levantamento para importar.") {
      alert("Todos os levantamentos já foram importados para os orçamentos.");
      return;
    }

    setLevantamentosFinalizados(true); // libera as abas
    setSubTipo("orcamentos"); // navega automaticamente para a aba de orçamentos
    alert("Levantamentos finalizados com sucesso!");

    // Recarrega dados de orçamentos
    const orcamentosAtualizados = await api.get(`/api/orcamentos/${clienteSelecionado.id}`);
    setSubDados(orcamentosAtualizados.data);

  } catch (error) {
    console.error("Erro ao finalizar levantamentos:", error);
    alert("Erro ao finalizar levantamentos.");
  }
};


const toggleLinhaSelecionada = (id: number) => {
  setLinhaSelecionada((prev) =>
    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
  );
};

const [mensagemSucesso, setMensagemSucesso] = useState("");

const mostrarNotificacao = (mensagem: string) => {
  setMensagemSucesso(mensagem);
  setTimeout(() => {
    setMensagemSucesso("");
  }, 3000); // Dura 3 segundos
};

const [novoLevantamento, setNovoLevantamento] = useState({
  item: "",
  grupo_item: "",
  descricao_item: "",
  fornecedor: "",
  unidade_medida: "",
  quantidade: "",
  dt_levantamento: "",
  orcamento_vencedor: "",
  vencimento: ""
});

const router = useRouter();

const salvarEntrada = async () => {
  if (!clienteSelecionado) return;

  const camposObrigatorios = ["item", "grupo_item", "valor", "origem_recebimento", "dt_entrada"];
  const vazios = camposObrigatorios.filter(c => !novaEntrada[c]);
  if (vazios.length > 0) {
    mostrarNotificacao("Preencha todos os campos obrigatórios da entrada!");
    return;
  }

  const converterParaISO = (dataBr: string) => {
    if (!dataBr) return "";
    const [dia, mes, ano] = dataBr.split("/");
    return `${ano}-${mes}-${dia}`;
  };

  try {
    const payload = {
      ...novaEntrada,
      dt_entrada: converterParaISO(novaEntrada.dt_entrada),
      cliente_id: clienteSelecionado.id
    };

    await api.post("/api/entradas", payload);
    setShowEntradaPopup(false);
    setNovaEntrada({ item: "", grupo_item: "", valor: "", origem_recebimento: "", dt_entrada: "", obs: "" });

    const atualizados = await api.get(`/api/entradas/${clienteSelecionado.id}`);
    setSubDados(atualizados.data);

    mostrarNotificacao("Entrada cadastrada com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar entrada:", error);
    mostrarNotificacao("Erro ao salvar entrada.");
  }
};

const handleSaidaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setNovaSaida((prev: any) => ({ ...prev, [name]: value }));
};


const salvarSaida = async () => {
  if (!clienteSelecionado) return;

  const obrigatorios = ["item", "grupo_item", "valor_negociado", "valor_pago", "previsto", "origem_pagamento", "dt_saida"];
  const faltando = obrigatorios.filter(c => !novaSaida[c]);
  if (faltando.length > 0) {
    mostrarNotificacao("Preencha todos os campos obrigatórios da saída!");
    return;
  }

  const converterParaISO = (dataBr: string) => {
    if (!dataBr) return "";
    const [dia, mes, ano] = dataBr.split("/");
    return `${ano}-${mes}-${dia}`;
  };

  try {
    const payload = {
      ...novaSaida,
      dt_saida: converterParaISO(novaSaida.dt_saida),
      cliente_id: clienteSelecionado.id
    };

    await api.post("/api/saidas", payload);
    setShowSaidaPopup(false);
    setNovaSaida({ item: "", grupo_item: "", valor_negociado: "", valor_pago: "", previsto: "", origem_pagamento: "", dt_saida: "", obs: "" });

    const atualizados = await api.get(`/api/saidas/${clienteSelecionado.id}`);
    setSubDados(atualizados.data);

    mostrarNotificacao("Saída cadastrada com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar saída:", error);
    mostrarNotificacao("Erro ao salvar saída.");
  }
};




const handleLevantamentoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setNovoLevantamento((prev) => ({ ...prev, [name]: value }));
};



const fecharPopupGestao = () => {
  setClientePopup(null);
};

const [novoOrcamento, setNovoOrcamento] = useState<any>({
  item: "",
  grupo_item: "",
  descricao_item: "",
  detalhamento_item: "",
  fornecedor: "",
  unidade_medida: "",
  quantidade: "",
  valor_maodeobra: "",
  dt_orcamento: "",
  orcamento_vencedor: "",
  vencimento: "",
  obs: ""
});

const salvarLevantamento = async () => {
  if (!clienteSelecionado) return;

  const camposObrigatorios = [
    "item", "grupo_item", "descricao_item", "fornecedor",
    "unidade_medida", "quantidade", "dt_levantamento",
    "orcamento_vencedor", "vencimento"
  ];

const camposVazios = camposObrigatorios.filter(c => !(novoLevantamento[c as keyof typeof novoLevantamento] as string));
  if (camposVazios.length > 0) {
    alert("Preencha todos os campos do levantamento.");
    return;
  }

  
  const converterParaISO = (dataBr: string) => {
    if (!dataBr || !dataBr.includes("/")) return null;
    const partes = dataBr.split("/");
    if (partes.length !== 3) return null;
    const [dia, mes, ano] = partes;
    return `${ano}-${mes}-${dia}`;
  };
  

  try {
    const payload = {
      ...novoLevantamento,
      dt_levantamento: converterParaISO(novoLevantamento.dt_levantamento),
      vencimento: converterParaISO(novoLevantamento.vencimento),
      cliente_id: clienteSelecionado.id
    };

    const res = await api.post("/api/levantamentos", payload);
    setShowLevantamentoPopup(false);
    setNovoLevantamento({
      item: "",
      grupo_item: "",
      descricao_item: "",
      fornecedor: "",
      unidade_medida: "",
      quantidade: "",
      dt_levantamento: "",
      orcamento_vencedor: "",
      vencimento: ""
    });

    // Atualiza dados da tabela levantamentos
    const atualizados = await api.get(`/api/levantamentos/${clienteSelecionado.id}`);
    setSubDados(atualizados.data);


mostrarNotificacao("Levantamento salvo com sucesso!");
  } catch (err) {
    console.error("Erro ao salvar levantamento:", err);
    alert("Erro ao salvar levantamento.");
  }
};

const popupRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      fecharPopupGestao();
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


const handleDataLevantamentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  // Aplica máscara: DD/MM/AAAA
  const numeros = value.replace(/\D/g, "");
  let formatado = "";

  if (numeros.length <= 2) {
    formatado = numeros;
  } else if (numeros.length <= 4) {
    formatado = `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  } else {
    formatado = `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4, 8)}`;
  }

  setNovoLevantamento((prev: any) => ({ ...prev, [name]: formatado }));
};


const aplicarMascaraData = (valor: string) => {
  const numeros = valor.replace(/\D/g, "");
  let formatado = "";

  if (numeros.length <= 2) {
    formatado = numeros;
  } else if (numeros.length <= 4) {
    formatado = `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  } else {
    formatado = `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4, 8)}`;
  }

  return formatado;
};

const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  const formatado = aplicarMascaraData(value);
  setNovoOrcamento((prev: any) => ({ ...prev, [name]: formatado }));
  setNovoLevantamento((prev) => ({ ...prev, [name]: formatado }));
};

const handleDataEntradaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  const formatado = aplicarMascaraData(value);
  setNovaEntrada((prev: any) => ({ ...prev, [name]: formatado }));
};

const handleDataSaidaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  const formatado = aplicarMascaraData(value);
  setNovaSaida((prev: any) => ({ ...prev, [name]: formatado }));
};

useEffect(() => {
  if (clienteSelecionado) {
    api.get(`/api/orcamentos/${clienteSelecionado.id}`)
      .then(res => {
        setLevantamentosFinalizados(res.data.length > 0); // true se já tiver orçamentos
      })
      .catch(err => console.error("Erro ao verificar orçamentos:", err));
  }
}, [clienteSelecionado]);


const salvarOrcamento = async () => {
  if (!clienteSelecionado) return;

  // Verifica se algum campo está vazio
  const camposObrigatorios = [
    "item", "grupo_item", "descricao_item", "detalhamento_item",
    "fornecedor", "unidade_medida", "quantidade", "valor_maodeobra",
    "dt_orcamento", "orcamento_vencedor", "vencimento", "obs"
  ];

  const camposVazios = camposObrigatorios.filter(campo => !novoOrcamento[campo]);

  if (camposVazios.length > 0) {
    alert("Preencha todos os campos antes de salvar o orçamento.");
    return;
  }

  try {
    const converterParaISO = (dataBr: string) => {
      if (!dataBr) return "";
      const partes = dataBr.split("/");
      if (partes.length !== 3) return "";
      const [dia, mes, ano] = partes;
      return `${ano}-${mes}-${dia}`;
    };
    
    const payload = {
      ...novoOrcamento,
      dt_orcamento: converterParaISO(novoOrcamento.dt_orcamento),
      vencimento: converterParaISO(novoOrcamento.vencimento),
      cliente_id: clienteSelecionado.id
    };
    

    const response = await api.post("/api/orcamentos", payload);

    // Recarrega os dados de orçamentos após adicionar
    const orcamentosAtualizados = await api.get(`/api/orcamentos/${clienteSelecionado.id}`);
    setSubDados(orcamentosAtualizados.data);
    
    mostrarNotificacao("Orçamento salvo com sucesso!");
    setShowOrcamentoPopup(false);    
    setNovoOrcamento({
      item: "", grupo_item: "", descricao_item: "", detalhamento_item: "",
      fornecedor: "", unidade_medida: "", quantidade: "", valor_maodeobra: "",
      dt_orcamento: "", orcamento_vencedor: "", vencimento: "", obs: ""
    });
  } catch (error) {
    console.error("Erro ao salvar orçamento:", error);
    alert("Erro ao salvar orçamento.");
  }
};

const gerarPropostaTodos = async () => {
  if (!clienteSelecionado) return;

  try {
    const response = await api.post("/api/gerar-proposta", {
      clienteId: clienteSelecionado.id
    }, {
      responseType: "blob" // necessário para baixar o PDF
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Cliente_${clienteSelecionado.nome.replace(/\s+/g, "_")}_orcamento.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    localStorage.setItem(`orcamento_finalizado_${clienteSelecionado.id}`, "true");
    setOrcamentosFinalizados(true);

  } catch (error) {
    console.error("Erro ao gerar proposta:", error);
    alert("Erro ao gerar proposta.");
  }
};


const gerarPropostaSelecionados = async (idsSelecionados: number[]) => {
  if (!clienteSelecionado) return;

  try {
    const res = await api.post("/api/pdf/selecionados", {
      clienteId: clienteSelecionado.id,
      orcamentoIds: idsSelecionados,
    }, {
      responseType: "blob"
    });

    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Cliente_${clienteSelecionado.nome.replace(/\s+/g, "_")}_orcamento_selecionado.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);

    // Salva no localStorage que esse cliente finalizou os orçamentos
    localStorage.setItem(`orcamento_finalizado_${clienteSelecionado.id}`, "true");
    setOrcamentosFinalizados(true);

  } catch (err) {
    console.error("Erro ao gerar proposta selecionada:", err);
    alert("Erro ao gerar proposta para os itens selecionados.");
  }
};




  const [novoCliente, setNovoCliente] = useState<any>({
    nome: "",
    documento: "",
    responsavel: "",
    contato: "",
    servico_id: "",
    status_id: "",
  });

  function formatarDocumento(value: string) {
    const apenasNumeros = value.replace(/\D/g, "");
    if (apenasNumeros.length <= 11) {
      return apenasNumeros
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    } else {
      return apenasNumeros
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
        .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d{0,2})/, "$1.$2.$3/$4-$5");
    }
  }

  useEffect(() => {
    api.get("/clientes").then((res) => setClientes(res.data));
    api.get("/servicos_obra").then((res) => {
      setServicosObra(res.data);
const categoriasUnicas = [...new Set(res.data.map((s: any) => s.categoria_servico))] as string[];
setCategorias(categoriasUnicas);
    });
    api.get("/status_obra").then((res) => setStatusObra(res.data));
  }, []);

// 1. Buscar dados da sub-tabela ao mudar cliente ou tipo
useEffect(() => {
  if (clienteSelecionado) {
    // Verifica se esse cliente tem orçamentos finalizados no localStorage
    const finalizado = localStorage.getItem(`orcamento_finalizado_${clienteSelecionado.id}`) === "true";
    setOrcamentosFinalizados(finalizado);

    // Busca os dados da subTabela
    api.get(`/api/${subTipo}/${clienteSelecionado.id}`)
      .then(res => setSubDados(res.data))
      .catch(err => console.error("Erro ao buscar dados:", err));
  }
}, [clienteSelecionado, subTipo]);

useEffect(() => {
  if (clienteSelecionado) {
    setSubTipo("levantamentos");
  }
}, [clienteSelecionado]);

  
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNovoCliente((prev: any) => {
      const updated = { ...prev, [name]: value };
      if (name === "documento") {
        const valorFormatado = formatarDocumento(value);
        updated.documento = valorFormatado;
        const numerosSemMascara = value.replace(/\D/g, "");
        updated.responsavel = numerosSemMascara.length === 11 ? prev.nome : "";
      }
      if (name === "nome" && novoCliente.documento.replace(/\D/g, "").length === 11) {
        updated.responsavel = value;
      }
      return updated;
    });
  };

  const handleOrcamentoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNovoOrcamento((prev: any) => ({ ...prev, [name]: value }));
  };
  

  const nomesColunasBonitas: Record<string, string> = {
    item: "Item",
    grupo_item: "Grupo",
    descricao_item: "Descrição",
    detalhamento_item: "Detalhamento",
    fornecedor: "Fornecedor",
    unidade_medida: "Unidade",
    quantidade: "Quantidade",
    valor_maodeobra: "Valor (R$)",
    dt_orcamento: "Data",
    dt_levantamento: "Data",
    orcamento_vencedor: "Vencedor",
    vencimento: "Vencimento",
    obs: "Observações",
    origem_recebimento: "Origem",
    origem_pagamento: "Origem",
    valor_negociado: "Valor Negociado",
    valor_pago: "Valor Pago",
    previsto: "Previsto",
    local_compra: "Local da Compra",
    responsavel_compra: "Responsável Compra",
    responsavel_reembolso: "Responsável Reembolso",
    dt_compra: "Data da Compra",
    dt_reembolso: "Data Reembolso",
    status_reembolso: "Status",
    dt_entrada: "Data",
    dt_saida: "Data"
  };
  

  const adicionarCliente = async () => {
    if (!novoCliente.nome || !novoCliente.documento || !novoCliente.responsavel || !novoCliente.contato || !novoCliente.servico_id || !novoCliente.status_id) {
      alert("Preencha todos os campos antes de salvar!");
      return;
    }
    try {
      const response = await api.post("/clientes", novoCliente);
      setClientes([...clientes, response.data]);
      setShowPopup(false);
      setNovoCliente({ nome: "", documento: "", responsavel: "", contato: "", servico_id: "", status_id: "" });
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
    }
  };

  const [editandoClienteId, setEditandoClienteId] = useState<number | null>(null);

  const editarCliente = (cliente: Cliente) => {
    setNovoCliente({
      nome: cliente.nome,
      documento: cliente.documento,
      responsavel: cliente.responsavel,
      contato: cliente.contato,
      servico_id: cliente.servico_id,
      status_id: cliente.status_id,
    });

    const servicoRelacionado = servicosObra.find(s => s.id === cliente.servico_id);
    if (servicoRelacionado) {
      setCategoriaSelecionada(servicoRelacionado.categoria_servico);
      const filtrados = servicosObra.filter(s => s.categoria_servico === servicoRelacionado.categoria_servico);
      setServicosFiltrados(filtrados);
    }

    setEditandoClienteId(cliente.id);
    setShowPopup(true);
  };

  const atualizarCliente = async () => {
    if (!novoCliente.nome || !novoCliente.documento || !novoCliente.responsavel || !novoCliente.contato || !novoCliente.servico_id || !novoCliente.status_id) {
      alert("Preencha todos os campos antes de atualizar!");
      return;
    }

    try {
      const response = await api.put(`/clientes/${editandoClienteId}`, novoCliente);
      const clientesAtualizados = clientes.map((cli) =>
        cli.id === editandoClienteId ? response.data.cliente : cli
      );
      setClientes(clientesAtualizados);
      setShowPopup(false);
      setEditandoClienteId(null);
      setNovoCliente({ nome: "", documento: "", responsavel: "", contato: "", servico_id: "", status_id: "" });
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
    }
  };

  const excluirCliente = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await api.delete(`/clientes/${id}`);
        setClientes(clientes.filter(cli => cli.id !== id));
        setClienteSelecionado(null);
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
      }
    }
  };

  

  return (    
  
    <div className={styles.erpContainer}>
      {/* NAVBAR ESTILO LEXOS */}
      <header className={styles.erpNavbar}>
      <div className={styles.logo}>
  <img src="/logo-brutha.png" alt="Logo" className={styles.logoImg} />
</div>
<nav className={styles.navLinks}>
          <button className={`${styles.navItem} ${styles.active}`}><FaUsers className={styles.navIcon} /><span>Clientes</span></button>
          <button className={styles.navItem} onClick={() => router.push("/fornecedores")}>
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
          <button className={styles.navItem}><FaChartBar className={styles.navIcon} /><span>Relatórios</span></button>
          <button className={styles.navItem}><FaFileDownload className={styles.navIcon} /><span>Documentos</span></button>
          <button className={styles.navItem}><FaCog className={styles.navIcon} /><span>Configuração</span></button>
        </nav>
      </header>
      
      {/* TÍTULO + BOTÃO FIXO DE ADICIONAR */}
      <div className={styles.erpHeader}>


{showPopup && (
  <div ref={clientePopupRef} className={styles.popupOverlay}>
    <div className={styles.popup}>
      <h2>{editandoClienteId ? "Editar Cliente" : "Adicionar Cliente"}</h2>

      <input name="nome" placeholder="Nome" value={novoCliente.nome} onChange={handleInputChange} />
      <input name="documento" placeholder="Documento" value={novoCliente.documento} onChange={handleInputChange} />
      <input name="responsavel" placeholder="Responsável" value={novoCliente.responsavel} onChange={handleInputChange} />
      <input name="contato" placeholder="Contato" value={novoCliente.contato} onChange={handleInputChange} />

      <select name="categoria_servico" value={categoriaSelecionada} onChange={(e) => {
        const cat = e.target.value;
        setCategoriaSelecionada(cat);
        const filtrados = servicosObra.filter(s => s.categoria_servico === cat);
        setServicosFiltrados(filtrados);
        setNovoCliente((prev: any) => ({ ...prev, categoria_servico: cat, servico_id: "" }));
      }}>
        <option value="">Selecione a Categoria</option>
        {categorias.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
      </select>

      {categoriaSelecionada && (
        <select name="servico_id" value={novoCliente.servico_id} onChange={handleInputChange}>
          <option value="">Selecione o Serviço</option>
          {servicosFiltrados.map((s) => (
            <option key={s.id} value={s.id}>{s.servico}</option>
          ))}
        </select>
      )}

      <select name="status_id" value={novoCliente.status_id} onChange={handleInputChange}>
        <option value="">Selecione o Status</option>
        {statusObra.map((s) => (
          <option key={s.id} value={s.id}>{s.status}</option>
        ))}
      </select>

      <div className={styles.popupButtons}>
        {editandoClienteId ? (
          <button className={styles.saveButton} onClick={atualizarCliente}>Atualizar</button>
        ) : (
          <button className={styles.saveButton} onClick={adicionarCliente}>Salvar</button>
        )}
        <button className={styles.cancelButton} onClick={() => {
          setShowPopup(false);
          setNovoCliente({
            nome: "", documento: "", responsavel: "", contato: "", servico_id: "", status_id: ""
          });
          setEditandoClienteId(null);
        }}>
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}

{clientePopup && (
  <div className={styles.popupOverlay}>
    <div ref={popupRef} className={styles.popup}>
      <h3>Gestão de Obra - {clientePopup.nome}</h3>
      <div className={styles.gridButtons}>
        <button className={styles.gestaoButton} onClick={() => setShowLevantamentoPopup(true)}>
          <LuClipboardPen className={styles.buttonIcon} />
          <span>Levantamento</span>
        </button>
        <button className={styles.gestaoButton} onClick={() => setShowOrcamentoPopup(true)}>
          <FaMoneyBillTrendUp className={styles.buttonIcon} />
          <span>Orçamento</span>
        </button>
        <button className={styles.gestaoButton} onClick={() => setShowEntradaPopup(true)}>
  <PiHandArrowUpBold className={styles.buttonIcon} />
  <span>Entrada</span>
</button>
<button className={styles.gestaoButton} onClick={() => setShowSaidaPopup(true)}>
  <PiHandArrowDownBold className={styles.buttonIcon} />
  <span>Saída</span>
</button>

        <button className={styles.gestaoButton}>
          <GiNotebook className={styles.buttonIcon} />
          <span>Diário</span>
        </button>
        <button className={styles.gestaoButton}>
          <FaChartBar className={styles.buttonIcon} />
          <span>Relatório</span>
        </button>
      </div>
    </div>
  </div>
)}

{mensagemSucesso && (
  <div className={styles.notificacaoSucesso}>
    <span className={styles.iconSucesso}>✔</span>
    <span>{mensagemSucesso}</span>
  </div>
)}

{showEntradaPopup && (
  <div ref={entradaOverlayRef} className={styles.popupOverlay}>
    <div className={[styles.popup, styles.orcamentoPopup].join(" ")}>
      <h3>Nova Entrada</h3>

      <div className={styles.formGrid}>
        <input name="item" placeholder="Item" value={novaEntrada.item} onChange={handleEntradaChange} />
        <input name="grupo_item" placeholder="Grupo do Item" value={novaEntrada.grupo_item} onChange={handleEntradaChange} />
        <input name="valor" placeholder="Valor (R$)" value={novaEntrada.valor} onChange={handleEntradaChange} />
        <input name="origem_recebimento" placeholder="Origem do Recebimento" value={novaEntrada.origem_recebimento} onChange={handleEntradaChange} />
        <input
  type="text"
  name="dt_entrada"
  value={novaEntrada.dt_entrada}
  onChange={handleDataEntradaChange} // ✅ CORRETO
  placeholder="Data (DD/MM/AAAA)"
  maxLength={10}
/>
        <input name="obs" placeholder="Observações" value={novaEntrada.obs} onChange={handleEntradaChange} />
      </div>

      <div className={styles.orcamentoBtnContainer}>
        <button className={styles.saveButton} onClick={salvarEntrada}>Salvar</button>
        <button className={styles.cancelButton} onClick={() => setShowEntradaPopup(false)}>Cancelar</button>
      </div>
    </div>
  </div>
)}


{showPopupProposta && (
  <div ref={propostaOverlayRef} className={styles.popupOverlay}>
    <div className={styles.popup}>
      <h3 style={{ textAlign: "center" }}>
        {linhaSelecionada.length > 0
          ? "Deseja gerar a proposta para o(s) item(s) selecionado(s)?"
          : "Deseja gerar a proposta para todos os itens?"}
      </h3>

      <div className={styles.popupButtons}>
      <button
  className={styles.saveButton}
  onClick={async () => {
    if (linhaSelecionada.length > 0) {
      await gerarPropostaSelecionados(linhaSelecionada);
    } else {
      await gerarPropostaTodos();
    }
    setClientesFinalizados(prev => ({
      ...prev,
      [clienteSelecionado!.id]: true
    }));
        setShowPopupProposta(false);
  }}
>
  Sim
</button>

        <button
          className={styles.cancelButton}
          onClick={() => setShowPopupProposta(false)}
        >
          Não
        </button>
      </div>
    </div>
  </div>
)}

{showLevantamentoPopup && (
  <div ref={levantamentoOverlayRef} className={styles.popupOverlay}>
  <div className={[styles.popup, styles.orcamentoPopup].join(" ")}>
    <h3>Novo Levantamento</h3>

      <div className={styles.formGrid}>
        <input name="item" placeholder="Item" value={novoLevantamento.item} onChange={handleLevantamentoChange} />
        <input name="grupo_item" placeholder="Grupo do Item" value={novoLevantamento.grupo_item} onChange={handleLevantamentoChange} />
        <input name="descricao_item" placeholder="Descrição" value={novoLevantamento.descricao_item} onChange={handleLevantamentoChange} />
        <input name="fornecedor" placeholder="Fornecedor" value={novoLevantamento.fornecedor} onChange={handleLevantamentoChange} />
        <input name="unidade_medida" placeholder="Unidade de Medida" value={novoLevantamento.unidade_medida} onChange={handleLevantamentoChange} />
        <input name="quantidade" placeholder="Quantidade" value={novoLevantamento.quantidade} onChange={handleLevantamentoChange} />
        
        <input
  type="text"
  name="dt_levantamento"
  value={novoLevantamento.dt_levantamento}
  onChange={handleDataLevantamentoChange}
  placeholder="Data (DD/MM/AAAA)"
  maxLength={10}
/>

        
        <select
          name="orcamento_vencedor"
          value={novoLevantamento.orcamento_vencedor}
          onChange={handleLevantamentoChange}
        >
          <option value="">Vencedor?</option>
          <option value="Sim">Sim</option>
          <option value="Não">Não</option>
        </select>

        <input
          type="text"
          name="vencimento"
          value={novoLevantamento.vencimento}
          onChange={handleDataChange}
          placeholder="Vencimento (DD/MM/AAAA)"
          maxLength={10}
        />
      </div>

      <div className={styles.orcamentoBtnContainer}>
        <button className={styles.saveButton} onClick={salvarLevantamento}>Salvar</button>
        <button className={styles.cancelButton} onClick={() => setShowLevantamentoPopup(false)}>Cancelar</button>
      </div>
    </div>
  </div>
)}



{showOrcamentoPopup && (
  <div ref={orcamentoOverlayRef} className={styles.popupOverlay}>
  <div className={[styles.popup, styles.orcamentoPopup].join(" ")}>
<h3>Novo Orçamento</h3>
      
          <div className={styles.formGrid}>
      <input name="item" placeholder="Item" value={novoOrcamento.item} onChange={handleOrcamentoChange} />
<input name="grupo_item" placeholder="Grupo do Item" value={novoOrcamento.grupo_item} onChange={handleOrcamentoChange} />
<input name="descricao_item" placeholder="Descrição" value={novoOrcamento.descricao_item} onChange={handleOrcamentoChange} />
<input name="detalhamento_item" placeholder="Detalhamento" value={novoOrcamento.detalhamento_item} onChange={handleOrcamentoChange} />
<input name="fornecedor" placeholder="Fornecedor" value={novoOrcamento.fornecedor} onChange={handleOrcamentoChange} />
<input name="unidade_medida" placeholder="Unidade de Medida" value={novoOrcamento.unidade_medida} onChange={handleOrcamentoChange} />
<input name="quantidade" placeholder="Quantidade" value={novoOrcamento.quantidade} onChange={handleOrcamentoChange} />
<input name="valor_maodeobra" placeholder="Valor da Mão de Obra" value={novoOrcamento.valor_maodeobra} onChange={handleOrcamentoChange} />
<input
  type="text"
  name="dt_orcamento"
  value={novoOrcamento.dt_orcamento}
  onChange={handleDataChange}
  placeholder="Data Orçamento (DD/MM/AAAA)"
  maxLength={10}
/>

<input
  type="text"
  name="vencimento"
  value={novoOrcamento.vencimento}
  onChange={handleDataChange}
  placeholder="Data Vencimento (DD/MM/AAAA)"
  maxLength={10}
/>

<select
  name="orcamento_vencedor"
  value={novoOrcamento.orcamento_vencedor}
  onChange={handleOrcamentoChange}
>
  <option value="">Orçamento Vencedor</option>
  <option value="Sim">Sim</option>
  <option value="Não">Não</option>
</select>



<input name="obs" placeholder="Observações" value={novoOrcamento.obs} onChange={handleOrcamentoChange} />


<div className={styles.orcamentoBtnContainer}>
<button className={styles.saveButton} onClick={salvarOrcamento}>Salvar</button>
        <button className={styles.cancelButton} onClick={() => setShowOrcamentoPopup(false)}>Cancelar</button>
        <button
  className={styles.importButton}
  onClick={() => document.getElementById("uploadOrcamentoExcel")?.click()}
>
  Importar Planilha
</button>
<input
  id="uploadOrcamentoExcel"
  type="file"
  accept=".xlsx"
  style={{ display: "none" }}
/>

      </div>
    </div>
  </div>
</div>
)}

{showSaidaPopup && (
  <div ref={saidaOverlayRef} className={styles.popupOverlay}>
    <div className={[styles.popup, styles.orcamentoPopup].join(" ")}>
        <h3>Nova Saída</h3>
      <div className={styles.formGrid}>
        <input name="item" placeholder="Item" value={novaSaida.item} onChange={handleSaidaChange} />
        <input name="grupo_item" placeholder="Grupo do Item" value={novaSaida.grupo_item} onChange={handleSaidaChange} />
        <input name="valor_negociado" placeholder="Valor Negociado" value={novaSaida.valor_negociado} onChange={handleSaidaChange} />
        <input name="valor_pago" placeholder="Valor Pago" value={novaSaida.valor_pago} onChange={handleSaidaChange} />
        <input name="previsto" placeholder="Valor Previsto" value={novaSaida.previsto} onChange={handleSaidaChange} />
        <input name="origem_pagamento" placeholder="Origem do Pagamento" value={novaSaida.origem_pagamento} onChange={handleSaidaChange} />
        <input
  type="text"
  name="dt_saida"
  value={novaSaida.dt_saida}
  onChange={handleDataSaidaChange} // ✅ CORRETO
  placeholder="Data (DD/MM/AAAA)"
  maxLength={10}
/>

        <input name="obs" placeholder="Observações" value={novaSaida.obs} onChange={handleSaidaChange} />
      </div>

      <div className={styles.orcamentoBtnContainer}>
        <button className={styles.saveButton} onClick={salvarSaida}>Salvar</button>
        <button className={styles.cancelButton} onClick={() => setShowSaidaPopup(false)}>Cancelar</button>
      </div>
    </div>
  </div>
)}


{showFiltroPopup && (
  <div ref={filtroPopupRef} className={styles.popupOverlay}>
    <div className={styles.popup}>
      <h3>Filtros de Clientes</h3>

      <select
        className={styles.filterSelect}
        value={tempFiltroSelecionado}
        onChange={(e) => {
          setTempFiltroSelecionado(e.target.value);
          setTempTermoBusca("");
          setTempCategoriaFiltroServico("");
          setTempCategoriaFiltroStatus("");
        }}
      >
        <option value="nome">Nome</option>
        <option value="documento">Documento</option>
        <option value="responsavel">Responsável</option>
        <option value="contato">Contato</option>
        <option value="servico">Serviço</option>
        <option value="status">Status</option>
      </select>

      {tempFiltroSelecionado === "servico" && (
        <select
          className={styles.filterSelect}
          value={tempCategoriaFiltroServico}
          onChange={(e) => setTempCategoriaFiltroServico(e.target.value)}
        >
          <option value="">Todas as categorias de serviço</option>
          {[...new Set(servicosObra.map((s) => s.categoria_servico))].map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
      )}

      {tempFiltroSelecionado === "status" && (
        <select
          className={styles.filterSelect}
          value={tempCategoriaFiltroStatus}
          onChange={(e) => setTempCategoriaFiltroStatus(e.target.value)}
        >
          <option value="">Todas as categorias de status</option>
          {[...new Set(statusObra.map((s) => s.categoria_status))].map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
      )}

      {tempFiltroSelecionado !== "servico" && tempFiltroSelecionado !== "status" && (
        <input
          type="text"
          className={styles.searchInput}
          placeholder={`Pesquisar por ${tempFiltroSelecionado}`}
          value={tempTermoBusca}
          onChange={(e) => setTempTermoBusca(e.target.value)}
        />
      )}

      <div className={styles.popupButtons}>
        <button
          className={styles.saveButton}
          onClick={() => {
            // Aplicar os filtros temporários
            setFiltroSelecionado(tempFiltroSelecionado);
            setTermoBusca(tempTermoBusca);
            setCategoriaFiltroServico(tempCategoriaFiltroServico);
            setCategoriaFiltroStatus(tempCategoriaFiltroStatus);
            setShowFiltroPopup(false);
          }}
        >
          Aplicar Filtro
        </button>
        <button
          className={styles.cancelButton}
          onClick={() => setShowFiltroPopup(false)}
        >
          Cancelar
        </button>

  <button
    className={styles.cancelButton}
    onClick={() => {
      setFiltroSelecionado("nome");
      setTermoBusca("");
      setCategoriaFiltroServico("");
      setCategoriaFiltroStatus("");
      setTempFiltroSelecionado("nome");
      setTempTermoBusca("");
      setTempCategoriaFiltroServico("");
      setTempCategoriaFiltroStatus("");
      setShowFiltroPopup(false);
    }}
  >
    Redefinir Filtros
  </button>

      </div>
    </div>
  </div>
)}

{planilhaPreview.length > 0 && (
  <div className={styles.previewContainer}>
    <h4>Pré-visualização da Planilha</h4>
    <table className={styles.table}>
      <thead>
        <tr>
          {Object.keys(planilhaPreview[0]).map((key, idx) => (
            <th key={idx}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {planilhaPreview.map((row, idx) => (
          <tr key={idx}>
            {Object.values(row).map((val: any, i) => (
              <td key={i}>{val}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


{showSenhaPopupId !== null && (
  <div ref={senhaPopupRef} className={styles.popupOverlay}>
    <div className={styles.popup}>
      <h3>Confirme a Exclusão</h3>
      <p>Digite a senha para confirmar a exclusão do cliente:</p>
      <input
        type="password"
        placeholder="Senha"
        value={senhaExclusao}
        onChange={(e) => setSenhaExclusao(e.target.value)}
      />
      <div className={styles.popupButtons}>
        <button
          className={styles.saveButton}
          onClick={() => {
            if (senhaExclusao === "Brutha@2025") { // <- coloque sua senha de segurança
              excluirCliente(showSenhaPopupId);
              setShowSenhaPopupId(null);
              setSenhaExclusao("");
            } else {
              alert("Senha incorreta!");
            }
          }}
        >
          Confirmar Exclusão
        </button>
        <button
          className={styles.cancelButton}
          onClick={() => {
            setShowSenhaPopupId(null);
            setSenhaExclusao("");
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}



      </div>

{/* NOVA BARRA DE AÇÕES FIXA ACIMA DA TABELA */}
<div className={styles.actionToolbar}>
  <span>Cliente Selecionado: <strong>{clienteSelecionado?.nome || "Nenhum"}</strong></span>
  <div className={styles.toolbarButtons}>
  <button
  className={styles.erpActionBtn}
  onClick={() => {
    setEditandoClienteId(null);            // Limpa o modo edição
    setNovoCliente({                      // Reseta os campos
      nome: "", documento: "", responsavel: "",
      contato: "", servico_id: "", status_id: ""
    });
    setShowPopup(true);                   // Abre o popup limpo
  }}
>
  <FaUserPlus /> Incluir
</button>
    <button onClick={() => editarCliente(clienteSelecionado!)} disabled={!clienteSelecionado} className={styles.erpActionBtn}><FaEdit /> Editar</button>
    <button onClick={() => setShowSenhaPopupId(clienteSelecionado?.id || null)} disabled={!clienteSelecionado} className={styles.erpActionBtn}><FaTrash /> Excluir</button>
    <button onClick={() => setShowFiltroPopup(true)} className={styles.erpActionBtn}><FaFilter /> Filtrar</button>
  </div>
</div>

      {/* TABELA */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Documento</th>
              <th>Responsável</th>
              <th>Contato</th>
              <th>Serviço</th>
              <th>Status</th>
              <th></th>
              <th></th>
                          </tr>
          </thead>
          <tbody>
            {clientes
              .filter((cliente) => {
                const campo = filtroSelecionado;
                let valorCampo = "";

                if (campo === "servico") {
                  const servicoCategoria = cliente.ServicoObra?.categoria_servico?.toLowerCase() || "";
                  return !categoriaFiltroServico || servicoCategoria === categoriaFiltroServico.toLowerCase();
                }

                if (campo === "status") {
                  const statusCategoria = cliente.StatusObra?.categoria_status?.toLowerCase() || "";
                  return !categoriaFiltroStatus || statusCategoria === categoriaFiltroStatus.toLowerCase();
                }

                valorCampo = (cliente as any)[campo]?.toString().toLowerCase() || "";
                return valorCampo.includes(termoBusca.toLowerCase());
              })

              
              .map((cliente) => (
                <tr
                  key={cliente.id}
                  className={clienteSelecionado?.id === cliente.id ? styles.selectedRow : ""}
                  onClick={() => setClienteSelecionado(cliente)}
                >
                  <td>{cliente.nome}</td>
                  <td>{cliente.documento}</td>
                  <td>{cliente.responsavel}</td>
                  <td>{cliente.contato}</td>
                  <td>{cliente.ServicoObra?.servico || "-"}</td>
                  <td>{cliente.StatusObra?.status || "-"}</td>
                  <td className={styles.actionIconsRow}></td>
  <button
    className={styles.moreOptionsButton}
    onClick={() => abrirPopupGestao(cliente)}
  >
    <FaEllipsisV />
  </button>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {clienteSelecionado && (
  <div className={styles.subGestaoWrapper}>
<div className={styles.subGestaoTitulo}>
<div className={styles.subToolbarButtons}>
<div className={styles.subToolbarButtons}>
<div className={styles.subToolbarButtons}>
{[
  { tipo: "levantamentos", icone: <LuClipboardPen />, liberado: true },
  { tipo: "orcamentos", icone: <FaMoneyBillTrendUp />, liberado: levantamentosFinalizados },
  { tipo: "entradas", icone: <PiHandArrowUpBold />, liberado: orcamentosFinalizados },
  { tipo: "saidas", icone: <PiHandArrowDownBold />, liberado: orcamentosFinalizados },
  { tipo: "reembolsos", icone: <FaMoneyBillTransfer />, liberado: orcamentosFinalizados }
].map(({ tipo, icone, liberado }) => (
  <button
    key={tipo}
    className={`${styles.subGestaoBtn} ${subTipo === tipo ? styles.selected : ""}`}
    onClick={() => liberado && setSubTipo(tipo)}
    disabled={!liberado}
    style={{
      backgroundColor: liberado ? "#072d54" : "#ccc",
      cursor: liberado ? "pointer" : "not-allowed",
      opacity: 1
    }}
  >
    {icone}
  </button>
))}


<div className={styles.subGestaoTituloBar}>
  <div className={styles.subGestaoTituloTexto}>
    Dados de <strong>{nomesBonitosSubTabelas[subTipo] || subTipo}</strong>
  </div>

  {subTipo === "levantamentos" && (
    <button className={styles.finalizarBtn} onClick={finalizarLevantamentos}>
   <FaCheck  />   Finalizar
    </button>
  )}

  {subTipo === "orcamentos" && (
  <button className={styles.finalizarBtn}
    onClick={() => setShowPopupProposta(true)}> 
    <FaCheck  />  Gerar Proposta
  </button>
)}

</div>
</div>
</div>
</div>
</div>



<div className={styles.subGestaoTabelaContainer}>
  <table className={styles.table}>
  <thead>
  <tr>
    {subDados.length > 0 &&
      Object.keys(subDados[0])
        .filter((col) => !["id", "cliente_id", "detalhamento_item", "obs"].includes(col))
        .map((col, idx) => (
          <th key={idx}>
            {nomesColunasBonitas[col] ||
              col.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </th>
        ))}
    {subTipo === "orcamentos" && <th>Selecionar</th>}
  </tr>
</thead>

    <tbody>
  {subDados.map((linha: any, idx) => (
  <tr key={idx}>
    {Object.entries(linha)
      .filter(([chave]) => !["id", "cliente_id", "detalhamento_item", "obs"].includes(chave))
      .map(([chave, valor], i) => {
        let displayValue = String(valor);

if (
  ["dt_orcamento", "dt_levantamento", "vencimento", "dt_compra", "dt_reembolso"].includes(chave) &&
  typeof valor === "string"
) {
  const [ano, mes, dia] = valor.split("-");
  displayValue = `${dia}/${mes}/${ano}`;
}


        return (
          <td key={i}>
            {chave === "valor_maodeobra" && subTipo === "orcamentos" ? (
              <input
                type="text"
                 value={String(valor)} // <-- correção aqui
                onChange={(e) => {
                  const novoValor = e.target.value;
                  setSubDados((prev) =>
                    prev.map((l, li) =>
                      li === idx ? { ...l, valor_maodeobra: novoValor } : l
                    )
                  );
                }}
                onBlur={async () => {
                  try {
                    const response = await api.put(`/api/orcamentos/${linha.id}`, {
                      valor_maodeobra: parseFloat(
                        linha.valor_maodeobra.toString().replace(",", ".")
                      ),
                    });
                    console.log("Atualizado:", response.data);
                  } catch (error) {
                    console.error("Erro ao atualizar valor:", error);
                    alert("Erro ao atualizar valor da mão de obra.");
                  }
                }}
                className={styles.valorEditavel}
              />
            ) : (
              displayValue
            )}
          </td>
        );
      })}


      {subTipo === "orcamentos" && (
        <td>
          <input
            type="checkbox"
            checked={linhaSelecionada.includes(linha.id)}
            onChange={() => toggleLinhaSelecionada(linha.id)}
          />
        </td>
      )}
    </tr>
  ))}
</tbody>

  </table>
</div>


  </div>
)}
</div>
  )};
