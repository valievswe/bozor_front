<template>
  <div class="homepage">
    <header class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">Bozor Ijarasini Boshqarish Tizimi (BIMS)</h1>
        <p class="hero-subtitle">
          Bozor faoliyatingizni raqamlashtiring, ijara to'lovlarini
          avtomatlashtiring va barcha ma'lumotlarni yagona platformada samarali
          boshqaring.
        </p>
        <router-link to="/login" class="btn btn-primary"
          >Tizimga Kirish</router-link
        >
      </div>
    </header>

    <main class="features-section">
      <div class="container">
        <h2 class="section-title">Tizim Imkoniyatlari</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon"><i class="fas fa-users"></i></div>
            <h3 class="feature-title">Markazlashgan Boshqaruv</h3>
            <p class="feature-description">
              Barcha tadbirkorlar, do'konlar, rastalar va ijara shartnomalari
              haqidagi ma'lumotlarni yagona, tartiblangan bazada saqlang va
              boshqaring.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-file-invoice-dollar"></i>
            </div>
            <h3 class="feature-title">Avtomatlashtirilgan Ijara</h3>
            <p class="feature-description">
              Ijara shartnomalarini osongina yarating va ularning holatini
              kuzatib boring. Muddati tugagan shartnomalar tizim tomonidan
              avtomatik ravishda arxivlanadi.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon"><i class="fas fa-qrcode"></i></div>
            <h3 class="feature-title">Zamonaviy To'lovlar</h3>
            <p class="feature-description">
              Har bir ijara shartnomasi uchun unikal QR-kod orqali to'lov qabul
              qilish imkoniyati. Payme integratsiyasi orqali tezkor va xavfsiz
              to'lovlar.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon"><i class="fas fa-search"></i></div>
            <h3 class="feature-title">Tezkor Qidiruv va Filtrlash</h3>
            <p class="feature-description">
              Mulkdorlar, do'konlar yoki shartnomalarni istalgan parametr
              bo'yicha soniyalar ichida toping.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon"><i class="fas fa-shield-alt"></i></div>
            <h3 class="feature-title">Xavfsiz Rol Tizimi</h3>
            <p class="feature-description">
              Har bir xodim (Admin, Kassir, Hisobchi) faqat o'ziga tegishli
              vazifalarni bajara oladi. Ma'lumotlar xavfsizligi to'liq
              ta'minlangan.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon"><i class="fas fa-chart-line"></i></div>
            <h3 class="feature-title">Hisobotlar va Analitika</h3>
            <p class="feature-description">
              Moliyaviy tushumlar, qarzdorliklar va bozorning umumiy holati
              haqida real vaqt rejimida hisobotlar oling.
            </p>
          </div>
        </div>
      </div>
    </main>

    <footer class="footer">
      <div class="container footer-content">
        <div class="footer-left">
          <h4 class="footer-title">BIMS</h4>
          <p class="copyright">
            &copy; {{ new Date().getFullYear() }} Barcha huquqlar himoyalangan.
          </p>
        </div>
        <div class="footer-right">
          <p class="credit">
            Dasturiy ta'minot
            <a
              href="https://alphanet.uz"
              target="_blank"
              rel="noopener noreferrer"
              >ALPHANET Inc.</a
            >
            tomonidan ishlab chiqildi.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

:root {
  --primary-color: #27ae60; /* A more vibrant green */
  --secondary-color: #2c3e50;
  --background-light: #f4f7f9;
  --text-dark: #333;
  --text-light: #ffffff;
  --border-color: #e0e6ed;
}

.homepage {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Helvetica,
    Arial,
    sans-serif;
  color: var(--text-dark);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* --- Hero Section --- */
.hero {
  background: url('https://images.unsplash.com/photo-1528698827591-e19ccd7e23ec?q=80&w=2070')
    no-repeat center center/cover;
  color: var(--text-light);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  position: relative;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(10, 25, 41, 0.7); /* Darker, slightly blue overlay */
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 2rem 1.5rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5); /* Improved text shadow */
}

.hero-subtitle {
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  opacity: 0.9;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.btn {
  padding: 0.8rem 2.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: #2ecc71; /* Lighter green on hover */
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(39, 174, 96, 0.4);
}

/* --- Features Section --- */
.features-section {
  padding: 5rem 1.5rem;
  background-color: #ffffff;
  flex-grow: 1;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 4rem;
  color: var(--secondary-color);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: var(--background-light);
  padding: 2.5rem 2rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid var(--border-color);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

.feature-icon {
  font-size: 2.8rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--secondary-color);
}

.feature-description {
  font-size: 1rem;
  line-height: 1.7;
  color: #555;
}

/* --- Footer --- */
.footer {
  background-color: var(--secondary-color);
  color: #aeb6bf;
  padding: 2.5rem 1.5rem;
  border-top: 4px solid var(--primary-color);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-left .footer-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.credit {
  text-align: right;
}

.credit a {
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.credit a:hover {
  color: var(--primary-color);
}

/* --- Responsive Design --- */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.2rem;
  }
  .hero-subtitle {
    font-size: 1.1rem;
  }
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
  .footer-right,
  .footer-left {
    text-align: center;
  }
}
</style>
