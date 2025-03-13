export async function fetchYaliesData(netID: string) {
  // fetch from yalies
  const response = await fetch("https://api.yalies.io/v2/people", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.YALIES_API_KEY}`,
    },
    body: JSON.stringify({ query: "", filters: { netid: netID } }),
  });

  // decode the response
  const data = await response.json();
  return data.length > 0 ? data[0] : null;
}
