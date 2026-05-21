async function getCityCoords(city) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data || data.length === 0) {
    throw new Error("Aucun résultat trouvé");
  }

  const place = data[0];
  const validTypes = ["city", "town", "village", "municipality"];

  if (!validTypes.includes(place.type)) {
    throw new Error("Ce n'est pas une ville");
  }

  return {
    lat: parseFloat(place.lat),
    lon: parseFloat(place.lon),
  };
}

// Quand l’utilisateur clique sur Rechercher
async function handleSearch() {
  const city = document.getElementById("villeInput").value.trim();

  if (!city) {
    alert("Veuillez entrer une ville");
    return;
  }

  try {
    const { lat, lon } = await getCityCoords(city);
    console.log("Ville :", city);
    console.log("Coordonnées :", lat, lon);

  } catch (err) {
    alert(err.message);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchBtn").addEventListener("click", handleSearch);
});
