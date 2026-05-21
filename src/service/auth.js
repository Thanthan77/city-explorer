import { supabase } from "../utils/supabaseClient.js";

 async function loginWithGoogle() {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: "http://127.0.0.1:5500/public/ville.html",
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