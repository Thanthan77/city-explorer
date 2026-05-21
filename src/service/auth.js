import { supabase } from "../utils/supabaseClient.js";

 async function loginWithGoogle() {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: "https://thanthan77.github.io/city-explorer/ville.html",
          },
        });

        if (error) {
          console.error(error);
          alert("Erreur Google Auth");
        }
      }

 window.addEventListener("DOMContentLoaded", () => {
        document
          .getElementById("googleBtn")
          .addEventListener("click", loginWithGoogle);
      });