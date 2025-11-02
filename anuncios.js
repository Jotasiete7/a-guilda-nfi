// netlify/functions/get-anuncios.js
exports.handler = async (event, context) => {
  try {
    const siteId = process.env.MY_SITE_ID;
    const token = process.env.MY_NETLIFY_TOKEN;

    if (!siteId || !token) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Variáveis de ambiente não configuradas' }),
      };
    }

    const url = `https://api.netlify.com/api/v1/sites/${siteId}/forms/paginas-amarelas/submissions`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const submissions = await response.json();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissions.map(s => s.data)),
    };
  } catch (error) {
    console.error('Erro na function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
