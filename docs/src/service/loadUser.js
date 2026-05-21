import { supabase } from "../utils/supabaseClient.js";

async function loadUser() {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.error(error);
          document.body.innerHTML = "<h2>Erreur de connexion</h2>";
          return;
        }

        if (!data.user) {
          document.body.innerHTML = "<h2>Non connecté</h2>";
          return;
        }

        document.getElementById("userEmail").textContent = data.user.email;
      }

window.addEventListener("DOMContentLoaded", loadUser);