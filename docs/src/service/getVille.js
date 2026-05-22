async function getCityCoords(city) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data || data.length === 0) {
    throw new Error("Aucun résultat trouvé");
  }

  const place = data[0];
  
    const validTypes = [
    "city",
    "town",
    "village",
    "municipality",
    "administrative",
    "county",
    "state_district"
  ];

  if (!validTypes.includes(place.type)) {
    throw new Error("Ce n'est pas une ville");
  }

  return {
    lat: parseFloat(place.lat),
    lon: parseFloat(place.lon),
  };
}

async function getActivities(lat, lon) {
  const apiKey = "5ae2e3f221c38a28845f05b62f628f35806807601705e007ba707aa3P";
  const radius = 3000; // 3 km autour du centre

  const url = `https://api.opentripmap.com/0.1/fr/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&rate=2&format=json&apikey=${apiKey}`;

  const res = await fetch(url);
  return await res.json();
}




async function getActivityDetails(xid) {
  const apiKey = "5ae2e3f221c38a28845f05b62f628f35806807601705e007ba707aa3P";
  const url = `https://api.opentripmap.com/0.1/fr/places/xid/${xid}?apikey=${apiKey}`;

  const res = await fetch(url);
  return await res.json();
}



async function displayActivities(list) {
  const container = document.getElementById("activities");
  container.innerHTML = "";

  for (const item of list.slice(0, 10)) { // on limite à 10 activités
    const details = await getActivityDetails(item.xid);

    const img = details.preview ? details.preview.source : "https://via.placeholder.com/300x150?text=No+Image";

    const card = `
      <div class="card">
        <img src="${img}" />
        <div class="card-content">
          <h3>${details.name || "Sans nom"}</h3>
          <p>${details.kinds || ""}</p>
        </div>
      </div>
    `;

    container.innerHTML += card;
  }
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

    const activities = await getActivities(lat, lon);
    console.log("Activities response:", activities);
    await displayActivities(activities);

  } catch (err) {
    alert(err.message);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchBtn").addEventListener("click", handleSearch);
});
