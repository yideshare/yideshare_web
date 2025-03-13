export async function fetchYaliesData(netId: string) {
  // fetch from yalies
  const response = await fetch("https://api.yalies.io/v2/people", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.YALIES_API_KEY}`,
    },
    // netid refers to the query parameter, netId refers to the string parameter
    body: JSON.stringify({ query: "", filters: { netid: netId } }),
  });

  // decode the response
  const data = await response.json();
  return data.length > 0 ? data[0] : null;
}
