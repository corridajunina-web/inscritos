let atletas = [];

function normalizarTexto(texto) {
  return (texto || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

async function carregarAtletas() {
  try {
    const resposta = await fetch("data.js?v=" + Date.now());
    atletas = await resposta.json();
    console.log("Atletas carregados:", atletas.length);
  } catch (erro) {
    console.error("Erro ao carregar data.js:", erro);
    atletas = [];
  }
}

function consultarInscricao() {
  const campo =
    document.getElementById("buscaNome") ||
    document.getElementById("nome") ||
    document.querySelector("input");

  const resultado =
    document.getElementById("resultado") ||
    document.getElementById("resultados");

  const termo = normalizarTexto(campo.value);

  if (!termo || termo.length < 3) {
    resultado.innerHTML = `<div class="aviso">Digite pelo menos 3 letras do nome.</div>`;
    return;
  }

  const encontrados = atletas.filter((a) =>
    normalizarTexto(a.nome).includes(termo)
  );

  if (encontrados.length === 0) {
    resultado.innerHTML = `
      <div class="resultado-card">
        <h3>Inscrição não encontrada</h3>
        <div class="linha-info">
          <span>ATENÇÃO</span>
          <strong>Confira se digitou o nome corretamente.</strong>
        </div>
        <a class="botao-whatsapp" target="_blank"
          href="https://wa.me/5594942486901?text=Olá!%20Não%20encontrei%20minha%20inscrição%20na%20Corrida%20Junina%20de%20Xinguara%202026.">
          FALAR COM A ORGANIZAÇÃO
        </a>
      </div>
    `;
    return;
  }

  resultado.innerHTML = encontrados
    .map((a) => {
      const mensagem = encodeURIComponent(
        `Olá! Consultei minha inscrição na Corrida Junina de Xinguara 2026 e encontrei uma divergência nos meus dados.\n\nNome: ${a.nome}\nCategoria: ${a.categoria}\nEquipe: ${a.equipe || "-"}\nCamisa: ${a.camisa || "-"}`
      );

      return `
        <div class="resultado-card">
          <h3>${a.nome}</h3>

          <div class="linha-info">
            <span>STATUS</span>
            <strong>${a.status || "INSCRIÇÃO CONFIRMADA"}</strong>
          </div>

          <div class="linha-info">
            <span>CATEGORIA</span>
            <strong>${a.categoria || "-"}</strong>
          </div>

          <div class="linha-info">
            <span>SEXO</span>
            <strong>${a.sexo || "-"}</strong>
          </div>

          <div class="linha-info">
            <span>DATA DE NASCIMENTO</span>
            <strong>${a.dataNascimento || "-"}</strong>
          </div>

          <div class="linha-info">
            <span>TAMANHO DA CAMISA</span>
            <strong>${a.camisa || "-"}</strong>
          </div>

          <div class="linha-info">
            <span>EQUIPE / ASSESSORIA / ACADEMIA</span>
            <strong>${a.equipe || "Não informado"}</strong>
          </div>

          <a class="botao-whatsapp" target="_blank"
            href="https://wa.me/5594942486901?text=${mensagem}">
            DADOS COM DIVERGÊNCIA? FALAR NO WHATSAPP
          </a>
        </div>
      `;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  await carregarAtletas();

  const botao =
    document.getElementById("btnConsultar") ||
    document.querySelector("button");

  const campo =
    document.getElementById("buscaNome") ||
    document.getElementById("nome") ||
    document.querySelector("input");

  if (botao) {
    botao.addEventListener("click", consultarInscricao);
  }

  if (campo) {
    campo.addEventListener("keyup", (e) => {
      if (e.key === "Enter") consultarInscricao();
    });
  }
});
