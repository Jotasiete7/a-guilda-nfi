// anuncios.js
const apiUrl = '/.netlify/functions/get-anuncios';

function criarCard(anuncio) {
  const servicos = [];
  for (let i = 1; i <= 3; i++) {
    const cat = anuncio[`servico${i}_categoria`];
    if (cat) {
      const skill = anuncio[`servico${i}_skill`] || 'Serviço';
      const ql = anuncio[`servico${i}_ql`] || '';
      const preco = anuncio[`servico${i}_preco`] || '';
      const icon = {
        Wood: '🌲', Metal: '⚔️', Leather: '🛡️', Cloth: '👘', Services: '🔧'
      }[cat] || '🔹';
      servicos.push(`${icon} <strong>${skill}</strong> ${ql}QL – ${preco}`);
    }
  }

  return `
    <div class="card ${anuncio.plano || 'gratis'}">
      <h3>${anuncio.nick} <small>(${anuncio.servidor})</small></h3>
      <p><strong>Contato:</strong> ${anuncio.contato}</p>
      <div class="servicos">${servicos.join('<br>')}</div>
      ${anuncio.descricao ? `<p><em>${anuncio.descricao}</em></p>` : ''}
      <span class="plano">${(anuncio.plano || 'gratis').toUpperCase()}</span>
    </div>
  `;
}

async function carregarAnuncios() {
  const container = document.getElementById('lista-anuncios');
  container.innerHTML = '<p>Carregando artesãos...</p>';

  try {
    const res = await fetch(apiUrl);
    const anuncios = await res.json();

    if (anuncios.length === 0) {
      container.innerHTML = '<p>Nenhum anúncio ainda. <a href="paginasamarelas.html">Cadastre-se!</a></p>';
      return;
    }

    container.innerHTML = anuncios.map(criarCard).join('');

    // Busca simples
    const busca = document.getElementById('busca');
    if (busca) {
      busca.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        const cards = container.querySelectorAll('.card');
        cards.forEach(card => {
          const texto = card.textContent.toLowerCase();
          card.style.display = texto.includes(termo) ? 'block' : 'none';
        });
      });
    }
  } catch (err) {
    container.innerHTML = '<p>Erro ao carregar anúncios. Tente novamente.</p>';
  }
}

// Inicia ao carregar
document.addEventListener('DOMContentLoaded', carregarAnuncios);
