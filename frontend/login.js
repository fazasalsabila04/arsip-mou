console.log("Login script loaded");
console.log("Login submitted:", email);

const supabaseClient = supabase.createClient(
  'https://rzxdfzsdikocnvwlzxgt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6eGRmenNkaWtvY252d2x6eGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjI3NDAsImV4cCI6MjA2ODg5ODc0MH0.gXJkMAAqo2q3W4W45PGMCCXe1yqZgqPQ4c0szUS9pmQ'
);

// Saat form login dikirim
document.getElementById("login-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  console.log("➡️ Form login disubmit");

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    document.getElementById("error-msg").textContent = "Email dan password wajib diisi.";
    return;
  }

  // Gunakan email dan password yang dicantumkan langsung
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    document.getElementById("error-msg").textContent = error.message;
  } else {
    window.location.href = "dashboard.html"; // redirect jika login berhasil
  }
});
