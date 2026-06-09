const input = document.getElementById("busca");
const btn = document.getElementById("btnBuscar");
const statusEl = document.getElementById("status");
const resultadosEl = document.getElementById("resultados");

const WHATSAPP = "559492486901";

function normalizar(txt){
  return String(txt || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function criarWhatsApp(atleta){
  const msg = `Olá, sou ${atleta.nome}. Encontrei divergência na minha inscrição da Corrida Junina de Xinguara 2026. Meus dados aparecem assim: Categoria: ${atleta.categoria}; Sexo: ${atleta.sexo}; Camisa: ${atleta.camisa}; Equipe: ${atleta.equipe}. Preciso corrigir.`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

function card(atleta){
  return `
    <article class="athlete-card">
      <h3>${atleta.nome}</h3>
      <div class="info-grid">
        <div class="info"><span class="label">Categoria</span><span class="value">${atleta.categoria || atleta.grupo || "Não informado"}</span></div>
        <div class="info"><span class="label">Sexo</span><span class="value">${atleta.sexo || "Não informado"}</span></div>
        <div class="info"><span class="label">Data de nascimento</span><span class="value">${atleta.nascimento || "Não informado"}</span></div>
        <div class="info"><span class="label">Tamanho da camisa</span><span class="value">${atleta.camisa || "Não informado"}</span></div>
        <div class="info"><span class="label">Representa equipe/assessoria?</span><span class="value">${atleta.representaEquipe || "Não informado"}</span></div>
        <div class="info"><span class="label">Equipe / Assessoria / Academia</span><span class="value">${atleta.equipe || "Não informado"}</span></div>
      </div>
      <a class="whatsapp-card" href="${criarWhatsApp(atleta)}" target="_blank" rel="noopener">Corrigir pelo WhatsApp</a>
    </article>
  `;
}

function buscar(){
  const termo = normalizar(input.value);
  resultadosEl.innerHTML = "";

  if(termo.length < 3){
    statusEl.textContent = "Digite pelo menos 3 letras do nome do atleta.";
    return;
  }

  const encontrados = ATLETAS.filter(a => a.busca.includes(termo)).slice(0, 12);

  if(encontrados.length === 0){
    statusEl.textContent = "Nenhuma inscrição encontrada com esse nome.";
    resultadosEl.innerHTML = `<div class="empty">Confira se digitou corretamente. Em caso de dúvida, fale com a organização pelo WhatsApp.</div>`;
    return;
  }

  statusEl.textContent = encontrados.length === 1
    ? "1 inscrição encontrada."
    : `${encontrados.length} inscrições encontradas. Confira qual é a sua.`;

  resultadosEl.innerHTML = encontrados.map(card).join("");
}

btn.addEventListener("click", buscar);
input.addEventListener("keyup", (e) => {
  if(e.key === "Enter") buscar();
});
