// =========================
// Konfigurasi Supabase
// =========================
const SUPABASE_URL = 'https://rzxdfzsdikocnvwlzxgt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6eGRmenNkaWtvY252d2x6eGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjI3NDAsImV4cCI6MjA2ODg5ODc0MH0.gXJkMAAqo2q3W4W45PGMCCXe1yqZgqPQ4c0szUS9pmQ';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// =========================
// Event saat DOM sudah siap
// =========================
document.addEventListener("DOMContentLoaded", function () {
  setupLoginHandler();
  setupSidebarToggle();
  tampilkanPetaPerguruanTinggi();
});

// =========================
// Login Handler (jika ada form login)
// =========================
function setupLoginHandler() {
  const form = document.getElementById('login-form');
  const errorMsg = document.getElementById('error-msg');

  if (!form) return; // Tidak ada form login di halaman ini

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      errorMsg.textContent = 'Email atau password salah';
      console.error(error.message);
    } else {
      window.location.href = 'dashboard.html';
    }
  });
}

// =========================
// Sidebar Toggle
// =========================
function setupSidebarToggle() {
  const toggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");

  toggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });
  function logout() {
    alert('Anda akan logout.');
    window.location.href = 'login.html';
  }

  document.addEventListener("click", function (event) {
    if (!sidebar.contains(event.target) && !toggle.contains(event.target)) {
      sidebar.classList.remove("active");
    }
  });
}

// =========================
// Fungsi Ambil Ikon Berdasarkan Kategori
// =========================
function getIconByKategori(kategori) {
  const kategoriUpper = kategori?.toUpperCase().trim();

  const iconUrls = {
    "UNIVERSITAS": "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    "SWASTA": "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    "POLITEKNIK": "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    "SEKOLAH TINGGI": "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
    "AKADEMIK": "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
    "INSTITUT": "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-pink.png"
  };

  const iconUrl = iconUrls[kategoriUpper] || "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png";

  return L.icon({
    iconUrl: iconUrl,
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
}

// =========================
// Tampilkan Peta Perguruan Tinggi
// =========================
async function tampilkanPetaPerguruanTinggi() {
  const mapEl = document.getElementById('map');
  if (!mapEl) return;

  const map = L.map('map').setView([-6.9, 107.6], 9);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const { data, error } = await supabaseClient
    .from('perguruan_tinggi')
    .select('nama, lat, lng, kategori');

  if (error) {
    console.error("Gagal memuat data peta:", error.message);
    return;
  }

  console.log("Data dari Supabase:", data);

  const markerMap = new Map(); // Simpan marker berdasarkan nama (untuk pencarian)

  data.forEach(pt => {
    if (pt.lat && pt.lng) {
      const icon = getIconByKategori(pt.kategori);

      const marker = L.marker([pt.lat, pt.lng], { icon }).addTo(map);
      marker.bindPopup(`<strong>${pt.nama}</strong><br>Kategori: ${pt.kategori}`);

      // Simpan untuk pencarian
      markerMap.set(pt.nama.toLowerCase(), { marker, lat: pt.lat, lng: pt.lng });

      // Tambahkan ke datalist (jika pakai autocomplete)
      const datalist = document.getElementById("nama-pt");
      if (datalist) {
        const option = document.createElement("option");
        option.value = pt.nama;
        datalist.appendChild(option);
      }
    }
  });

  // =========================
  // Fitur Pencarian
  // =========================
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const query = this.value.trim().toLowerCase();

      if (markerMap.has(query)) {
        const { marker, lat, lng } = markerMap.get(query);
        map.setView([lat, lng], 13); // zoom ke lokasi
        marker.openPopup();         // buka popup
      }
    });
  }
}
