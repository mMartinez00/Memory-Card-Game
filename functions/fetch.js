exports.handler = async () => {
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

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
