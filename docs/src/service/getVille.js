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
  const url = `https://calm-wood-b16f.ethanqc-chea.workers.dev/?type=list&lat=${lat}&lon=${lon}`;
  const res = await fetch(url);
  return await res.json();
}

async function getActivityDetails(xid) {
  const url = `https://calm-wood-b16f.ethanqc-chea.workers.dev/?type=details&xid=${xid}`;
  const res = await fetch(url);
  return await res.json();
}

async function displayActivities(list) {
  const container = document.getElementById("activities");
  container.innerHTML = "";

  if (!Array.isArray(list)) {
    console.error("Réponse OpenTripMap invalide :", list);
    container.innerHTML = "<p>Aucune activité trouvée.</p>";
    return;
  }

  if (list.length === 0) {
    container.innerHTML = "<p>Aucune activité trouvée.</p>";
    return;
  }

  // On limite à 10 activités
  const items = list.slice(0, 10);

  for (const item of items) {
    const details = await getActivityDetails(item.xid);

    const img = details.preview?.source
      || "https://via.placeholder.com/300x150?text=Pas+d'image";

    const name = details.name || "Sans nom";

    const kinds = details.kinds?.replace(/,/g, ", ") || "Aucune catégorie";

    const desc = details.wikipedia_extracts?.text
      ? details.wikipedia_extracts.text.slice(0, 150) + "..."
      : "Aucune description disponible.";

    const card = `
      <div class="card">
        <img src="${img}" />
        <div class="card-content">
          <h3>${name}</h3>
          <p class="kinds">${kinds}</p>
          <p class="desc">${desc}</p>
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
