// netlify/functions/get-anuncios.js
exports.handler = async (event, context) => {
  try {
    const submissions = await fetch(
      `https://api.netlify.com/api/v1/sites/${process.env.SITE_ID}/forms/paginas-amarelas/submissions`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NETLIFY_API_TOKEN}`,
        },
      }
    ).then(res => res.json());

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submissions.map(s => s.data)),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};
