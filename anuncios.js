// anuncios.js
const apiUrl = '/.netlify/functions/get-anuncios';

function criarCard(anuncio) {
  const servicos = [];
  for (let i = 1; i <= 3; i++) {
    const cat = anuncio[`servico${i}_categoria`];
    if (cat) {
      const skill = anuncio[`servico${i}_skill`] || 'Serviço';
      const ql = anuncio[`servico${i}_ql`] ? `${anuncio[`servico${i}_ql`]}QL` : '';
      const preco = anuncio[`servico${i}_preco`] || '';
      const icon = {
        Wood: '🌲', Metal: '⚔️', Leather: '🛡️', Cloth: '👘', Services: '🔧'
      }[cat] || '🔹';
      servicos.push(`${icon} <strong>${skill}</strong> ${ql} – ${preco}`);
    }
  }

  const planoBadge = anuncio.plano ? 
    `<span class="plano">${anuncio.plano.toUpperCase()}</span>` : 
    '<span class="plano">GRÁTIS</span>';

  return `
    <div class="card ${anuncio.plano || 'gratis'}">
      <h3>${anuncio.nick} <small>(${anuncio.servidor})</small></h3>
      <p><strong>Contato:</strong> ${anuncio.contato}</p>
      <div class="servicos">${servicos.join('<br>')}</div>
      ${anuncio.descricao ? `<p><em>${anuncio.descricao}</em></p>` : ''}
      ${planoBadge}
    </div>
  `;
}

async function carregarAnuncios() {
  const container = document.getElementById('lista-anuncios');
  container.innerHTML = '<p>Carregando artesãos da guilda...</p>';

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`Erro ${res.status}`);

    const anuncios = await res.json();

    if (!anuncios || anuncios.length === 0) {
      container.innerHTML = '<p>Nenhum anúncio ainda. <a href="paginasamarelas.html">Cadastre-se!</a></p>';
      return;
    }

    container.innerHTML = anuncios.map(criarCard).join('');

    // BUSCA EM TEMPO REAL
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
    console.error('Erro ao carregar anúncios:', err);
    container.innerHTML = '<p>Erro ao carregar anúncios. Tente novamente.</p>';
  }
}

// Inicia ao carregar a página
document.addEventListener('DOMContentLoaded', carregarAnuncios);
