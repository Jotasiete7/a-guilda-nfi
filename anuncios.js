// anuncios.js - CONSUMINDO API DO RENDER
const apiUrl = 'https://guilda-backend.onrender.com/yellow';

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
      <h3>${anuncio.nick || 'Anônimo'} <small>(${anuncio.servidor || 'N/A'})</small></h3>
      <p><strong>Contato:</strong> ${anuncio.contato || 'N/A'}</p>
      <div class="servicos">${servicos.join('<br>')}</div>
      ${anuncio.descricao ? `<p><em>${anuncio.descricao}</em></p>` : ''}
      ${planoBadge}
    </div>
  `;
}

async function carregarAnuncios() {
  const container = document.getElementById('lista-anuncios');
  container.innerHTML = '<p class="loading">Carregando artesãos da guilda...</p>';

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
    const anuncios = await res.json();

    if (!anuncios || anuncios.length === 0) {
      container.innerHTML = '<p>Nenhum anúncio ainda. <a href="paginasamarelas.html">Cadastre-se!</a></p>';
      return;
    }

    container.innerHTML = anuncios.map(criarCard).join('');

    // Busca em tempo real
    const busca = document.getElementById('busca');
    if (busca) {
      busca.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        const cards = container.querySelectorAll('.card');
        cards.forEach(card => {
          card.style.display = card.textContent.toLowerCase().includes(termo) ? 'block' : 'none';
        });
      });
    }
  } catch (err) {
    console.error('Erro ao carregar anúncios:', err);
    container.innerHTML = '<p>Erro ao carregar anúncios. Verifique o backend ou console (F12).</p>';
  }
}

// Inicia ao carregar
document.addEventListener('DOMContentLoaded', carregarAnuncios);
