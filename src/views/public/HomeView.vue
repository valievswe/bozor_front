<template>
  <div class="homepage">
    <header class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Bozor Ijarasini Boshqarish Tizimi (BIMS)</h1>
        <p class="hero-subtitle">
          Bozor faoliyatingizni raqamlashtiring, ijara to'lovlarini
          avtomatlashtiring va barcha ma'lumotlarni yagona platformada samarali
          boshqaring.
        </p>
        <a href="/login" class="btn btn-primary">Tizimga Kirish</a>
      </div>
    </header>

    <main class="features-section">
      <div class="container">
        <h2 class="section-title">Tizim Imkoniyatlari</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-users"></i>
            </div>
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
            <div class="feature-icon">
              <i class="fas fa-qrcode"></i>
            </div>
            <h3 class="feature-title">Zamonaviy To'lovlar</h3>
            <p class="feature-description">
              Har bir ijara shartnomasi uchun unikal QR-kod orqali to'lov qabul
              qilish imkoniyati. Payme integratsiyasi orqali tezkor va xavfsiz
              to'lovlar.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-search"></i>
            </div>
            <h3 class="feature-title">Tezkor Qidiruv va Filtrlash</h3>
            <p class="feature-description">
              Mulkdorlar, do'konlar yoki shartnomalarni istalgan parametr (ism,
              STIR, do'kon raqami) bo'yicha soniyalar ichida toping.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-shield-alt"></i>
            </div>
            <h3 class="feature-title">Xavfsiz Rol Tizimi (RBAC)</h3>
            <p class="feature-description">
              Har bir xodim (Admin, Kassir, Hisobchi) faqat o'ziga tegishli
              vazifalarni bajara oladi. Ma'lumotlar xavfsizligi to'liq
              ta'minlangan.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <h3 class="feature-title">Hisobotlar va Analitika</h3>
            <p class="feature-description">
              Moliyaviy tushumlar, qarzdorliklar va bozorning umumiy holati
              haqida real vaqt rejimida hisobotlar oling va to'g'ri qarorlar
              qabul qiling.
            </p>
          </div>
        </div>
      </div>
    </main>

    <footer class="footer">
      <p>
        &copy; {{ new Date().getFullYear() }} BIMS. Barcha huquqlar
        himoyalangan.
      </p>
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
  --primary-color: #3498db;
  --secondary-color: #2c3e50;
  --background-light: #f4f7f9;
  --text-dark: #333;
  --text-light: #ecf0f1;
}

.homepage {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: var(--text-dark);
}

/* Hero Section */
.hero {
  background:
    linear-gradient(rgba(44, 62, 80, 0.7), rgba(44, 62, 80, 0.7)),
    url('https://images.unsplash.com/photo-1528698827591-e19ccd7e23ec?q=80&w=2070')
      no-repeat center center/cover;
  color: var(--text-light);
  padding: 6rem 1.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.hero-content {
  max-width: 800px;
}

.hero-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.2rem;
  font-weight: 300;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  opacity: 0.9;
}

.btn {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  font-weight: 500;
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
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Features Section */
.features-section {
  padding: 4rem 1.5rem;
  background-color: var(--background-light);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 2.2rem;
  font-weight: 600;
  margin-bottom: 3rem;
  color: var(--secondary-color);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--secondary-color);
}

.feature-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #555;
}

/* Footer */
.footer {
  background-color: var(--secondary-color);
  color: var(--text-light);
  text-align: center;
  padding: 1.5rem;
  font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.2rem;
  }
  .hero-subtitle {
    font-size: 1.1rem;
  }
}
</style>
