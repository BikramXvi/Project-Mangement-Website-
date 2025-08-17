// authGuard.js
import { auth } from "./config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

export function logout(redirectTo = "./index.html") {
  signOut(auth)
    .then(() => {
      window.location.href = redirectTo;
    })
    .catch(err => {
      console.error("Logout error:", err);
      alert("Error logging out: " + err.message);
    });
}
