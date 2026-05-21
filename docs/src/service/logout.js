import { supabase } from "../utils/supabaseClient.js";

async function logout() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
}
document.getElementById("logoutBtn").addEventListener("click", logout);
