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
      <div class="card-resultado erro">
        <h3>Inscrição não encontrada</h3>
        <p>Confira se digitou o nome corretamente.</p>
        <a class="btn-whatsapp" target="_blank"
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
        <div class="card-resultado">
          <h3>${a.nome}</h3>
          <p><strong>Status:</strong> ${a.status || "INSCRIÇÃO CONFIRMADA"}</p>
          <p><strong>Categoria:</strong> ${a.categoria || "-"}</p>
          <p><strong>Sexo:</strong> ${a.sexo || "-"}</p>
          <p><strong>Data de nascimento:</strong> ${a.dataNascimento || "-"}</p>
          <p><strong>Tamanho da camisa:</strong> ${a.camisa || "-"}</p>
          <p><strong>Equipe / Assessoria / Academia:</strong> ${a.equipe || "-"}</p>

          <a class="btn-whatsapp" target="_blank"
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
