const fetch = require("node-fetch");

async function getPictures() {
  const API_KEY = process.env.PEXEL_API_KEY;

  const response = await fetch(
    `https://api.pexels.com/v1/search?query=nature&per_page=6`,
    {
      headers: {
        Authorization: API_KEY,
      },
    }
  );

  const data = await response.json();

  return JSON.stringify(data);
}

exports.handler = async (event, context) => {
  try {
    const body = await getPictures();

    return {
      statusCode: 200,
      body: body,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err.toString(),
    };
  }
};
