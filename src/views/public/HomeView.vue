<template>
  <div class="homepage">
    <header class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-particles"></div>
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-text">Innovatsiya • Samaradorlik • Ishonch</span>
        </div>
        <h1 class="hero-title">
          <span class="title-gradient">Bozor Ijarasini</span>
          <span class="title-highlight">Boshqarish Tizimi</span>
        </h1>
        <p class="hero-subtitle">
          Bozor faoliyatingizni raqamlashtiring, ijara to'lovlarini
          avtomatlashtiring va barcha ma'lumotlarni yagona platformada samarali
          boshqaring.
        </p>
        <div class="hero-actions">
          <router-link to="/login" class="btn btn-primary">
            <i class="fas fa-rocket"></i>
            Tizimga Kirish
          </router-link>
          <button class="btn btn-secondary" @click="scrollToFeatures">
            <i class="fas fa-play"></i>
            Batafsil Ma'lumot
          </button>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">500+</span>
            <span class="stat-label">Faol Foydalanuvchi</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">99.9%</span>
            <span class="stat-label">Tizim Barqarorligi</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">24/7</span>
            <span class="stat-label">Texnik Yordam</span>
          </div>
        </div>
      </div>
      <div class="scroll-indicator">
        <div class="scroll-arrow"></div>
      </div>
    </header>

    <main class="features-section" ref="featuresSection">
      <div class="container">
        <div class="section-header">
          <span class="section-badge">Imkoniyatlar</span>
          <h2 class="section-title">Tizim Imkoniyatlari</h2>
          <p class="section-subtitle">
            Zamonaviy texnologiyalar asosida ishlab chiqilgan samarali
            yechimlarda
          </p>
        </div>

        <div class="features-grid">
          <div
            class="feature-card"
            v-for="(feature, index) in features"
            :key="index"
          >
            <div class="feature-icon">
              <i :class="feature.icon"></i>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
            <div class="feature-arrow">
              <i class="fas fa-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
    </main>

    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stats-card">
            <div class="stats-icon">
              <i class="fas fa-store"></i>
            </div>
            <div class="stats-content">
              <h3 class="stats-number">1000+</h3>
              <p class="stats-label">Do'konlar Boshqarilmoqda</p>
            </div>
          </div>
          <div class="stats-card">
            <div class="stats-icon">
              <i class="fas fa-file-contract"></i>
            </div>
            <div class="stats-content">
              <h3 class="stats-number">5000+</h3>
              <p class="stats-label">Ijara Shartnomasi</p>
            </div>
          </div>
          <div class="stats-card">
            <div class="stats-icon">
              <i class="fas fa-money-bill-wave"></i>
            </div>
            <div class="stats-content">
              <h3 class="stats-number">2M+</h3>
              <p class="stats-label">Oylik Tushumlar</p>
            </div>
          </div>
          <div class="stats-card">
            <div class="stats-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="stats-content">
              <h3 class="stats-number">500+</h3>
              <p class="stats-label">Faol Tadbirkorlar</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-left">
            <div class="footer-logo">
              <h4 class="footer-title">BIMS</h4>
              <span class="footer-tagline">Bozor Ijarasini Boshqarish</span>
            </div>
            <p class="footer-description">
              Zamonaviy bozor boshqaruvi uchun eng yaxshi yechim. Bizning
              tizimimiz orqali ijara jarayonlarini to'liq avtomatlashtiring.
            </p>
            <div class="social-links">
              <a href="#" class="social-link">
                <i class="fab fa-telegram"></i>
              </a>
              <a href="#" class="social-link">
                <i class="fab fa-instagram"></i>
              </a>
              <a href="#" class="social-link">
                <i class="fab fa-linkedin"></i>
              </a>
            </div>
          </div>

          <div class="footer-right">
            <div class="footer-column">
              <h5 class="footer-column-title">Tizim</h5>
              <ul class="footer-links">
                <li><a href="#" class="footer-link">Kirish</a></li>
                <li><a href="#" class="footer-link">Ro'yxatdan o'tish</a></li>
                <li><a href="#" class="footer-link">Demo ko'rish</a></li>
              </ul>
            </div>

            <div class="footer-column">
              <h5 class="footer-column-title">Yordam</h5>
              <ul class="footer-links">
                <li><a href="#" class="footer-link">FAQ</a></li>
                <li><a href="#" class="footer-link">Qo'llab-quvvatlash</a></li>
                <li><a href="#" class="footer-link">Bog'lanish</a></li>
              </ul>
            </div>

            <div class="footer-column">
              <h5 class="footer-column-title">Aloqa</h5>
              <div class="contact-info">
                <p><i class="fas fa-phone"></i> +998 90 123 45 67</p>
                <p><i class="fas fa-envelope"></i> info@bims.uz</p>
                <p>
                  <i class="fas fa-map-marker-alt"></i> Toshkent, O'zbekiston
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="footer-bottom-content">
            <p class="copyright">
              &copy; {{ new Date().getFullYear() }} BIMS. Barcha huquqlar
              himoyalangan.
            </p>
            <div class="footer-bottom-right">
              <span class="credit">
                Dasturiy ta'minot
                <a
                  href="https://alphanet.uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="company-link"
                  >ALPHANET Inc.</a
                >
                tomonidan ishlab chiqildi.
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      features: [
        {
          icon: 'fas fa-users',
          title: 'Markazlashgan Boshqaruv',
          description:
            "Barcha tadbirkorlar, do'konlar, rastalar va ijara shartnomalari haqidagi ma'lumotlarni yagona, tartiblangan bazada saqlang va boshqaring."
        },
        {
          icon: 'fas fa-file-invoice-dollar',
          title: 'Avtomatlashtirilgan Ijara',
          description:
            'Ijara shartnomalarini osongina yarating va ularning holatini kuzatib boring. Muddati tugagan shartnomalar tizim tomonidan avtomatik ravishda arxivlanadi.'
        },
        {
          icon: 'fas fa-qrcode',
          title: "Zamonaviy To'lovlar",
          description:
            "Har bir ijara shartnomasi uchun unikal QR-kod orqali to'lov qabul qilish imkoniyati. Payme integratsiyasi orqali tezkor va xavfsiz to'lovlar."
        },
        {
          icon: 'fas fa-search',
          title: 'Tezkor Qidiruv va Filtrlash',
          description:
            "Mulkdorlar, do'konlar yoki shartnomalarni istalgan parametr bo'yicha soniyalar ichida toping."
        },
        {
          icon: 'fas fa-shield-alt',
          title: 'Xavfsiz Rol Tizimi',
          description:
            "Har bir xodim (Admin, Kassir, Hisobchi) faqat o'ziga tegishli vazifalarni bajara oladi. Ma'lumotlar xavfsizligi to'liq ta'minlangan."
        },
        {
          icon: 'fas fa-chart-line',
          title: 'Hisobotlar va Analitika',
          description:
            'Moliyaviy tushumlar, qarzdorliklar va bozorning umumiy holati haqida real vaqt rejimida hisobotlar oling.'
        }
      ]
    }
  },
  methods: {
    scrollToFeatures() {
      this.$refs.featuresSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

:root {
  --primary-color: #27ae60;
  --primary-light: #2ecc71;
  --primary-dark: #229954;
  --secondary-color: #2c3e50;
  --secondary-light: #34495e;
  --accent-color: #3498db;
  --text-dark: #2c3e50;
  --text-light: #ffffff;
  --text-muted: #7f8c8d;
  --background-light: #f8f9fa;
  --background-dark: #1a1a2e;
  --border-color: #e9ecef;
  --shadow-light: 0 2px 10px rgba(0, 0, 0, 0.1);
  --shadow-medium: 0 8px 30px rgba(0, 0, 0, 0.12);
  --shadow-heavy: 0 20px 60px rgba(0, 0, 0, 0.15);
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --gradient-success: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

* {
  box-sizing: border-box;
}

.homepage {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  color: var(--text-dark);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-x: hidden;
}

/* === HERO SECTION === */
.hero {
  background:
    linear-gradient(
      135deg,
      rgba(39, 174, 96, 0.9) 0%,
      rgba(44, 62, 80, 0.8) 100%
    ),
    url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')
      no-repeat center center/cover;
  color: var(--text-light);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--gradient-primary);
  opacity: 0.85;
}

.hero-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(
      circle at 20% 50%,
      rgba(120, 119, 198, 0.3) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(255, 119, 198, 0.3) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 40% 80%,
      rgba(120, 219, 255, 0.3) 0%,
      transparent 50%
    );
  animation: float 20s infinite linear;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-30px) rotate(1deg);
  }
  66% {
    transform: translateY(-20px) rotate(-1deg);
  }
}

.hero-content {
  position: relative;
  z-index: 3;
  max-width: 900px;
  padding: 2rem 1.5rem;
  animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 2rem;
  animation: fadeInUp 1s ease-out 0.2s both;
}

.badge-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  animation: fadeInUp 1s ease-out 0.4s both;
}

.title-gradient {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
}

.title-highlight {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  margin-top: 0.5rem;
}

.hero-subtitle {
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  font-weight: 400;
  line-height: 1.7;
  margin-bottom: 3rem;
  opacity: 0.95;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeInUp 1s ease-out 0.6s both;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 4rem;
  animation: fadeInUp 1s ease-out 0.8s both;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s;
}

.btn:hover::before {
  left: 100%;
}

.btn-primary {
  background: linear-gradient(
    135deg,
    var(--primary-color) 0%,
    var(--primary-light) 100%
  );
  color: white;
  box-shadow: 0 8px 25px rgba(39, 174, 96, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(39, 174, 96, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
  animation: fadeInUp 1s ease-out 1s both;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 120px;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-light);
  margin-bottom: 0.5rem;
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  animation: bounce 2s infinite;
}

.scroll-arrow {
  width: 30px;
  height: 30px;
  border: 2px solid rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  position: relative;
}

.scroll-arrow::after {
  content: '';
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  border-right: 2px solid rgba(255, 255, 255, 0.7);
  border-bottom: 2px solid rgba(255, 255, 255, 0.7);
  rotate: 45deg;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

/* === FEATURES SECTION === */
.features-section {
  padding: 8rem 1.5rem;
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 5rem;
}

.section-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: var(--gradient-success);
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 20px;
  margin-bottom: 1rem;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--secondary-color);
  background: linear-gradient(
    135deg,
    var(--secondary-color) 0%,
    var(--primary-color) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
}

.feature-card {
  background: white;
  padding: 3rem 2.5rem;
  border-radius: 20px;
  text-align: center;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-light);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--gradient-primary);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-heavy);
}

.feature-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  background: var(--gradient-primary);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: var(--shadow-medium);
}

.feature-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--secondary-color);
}

.feature-description {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.feature-arrow {
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  color: var(--primary-color);
  font-size: 1.2rem;
}

.feature-card:hover .feature-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* === STATS SECTION === */
.stats-section {
  padding: 6rem 1.5rem;
  background: var(--gradient-primary);
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.stats-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.stats-icon {
  font-size: 2.5rem;
  color: rgba(255, 255, 255, 0.9);
  min-width: 60px;
}

.stats-number {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: block;
}

.stats-label {
  font-size: 0.9rem;
  opacity: 0.9;
  margin: 0;
}

/* === FOOTER === */
.footer {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #aeb6bf;
  padding: 4rem 1.5rem 0;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  margin-bottom: 3rem;
}

.footer-left {
  max-width: 400px;
}

.footer-logo {
  margin-bottom: 1.5rem;
}

.footer-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.footer-tagline {
  color: var(--primary-light);
  font-size: 0.9rem;
  font-weight: 500;
}

.footer-description {
  line-height: 1.7;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: var(--primary-color);
  transform: translateY(-3px);
}

.footer-right {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.footer-column-title {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-link {
  color: #aeb6bf;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: var(--primary-light);
}

.contact-info p {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.contact-info i {
  color: var(--primary-light);
  width: 16px;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem 0;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  margin: 0;
  font-size: 0.9rem;
}

.company-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.company-link:hover {
  color: var(--primary-light);
}

/* === RESPONSIVE DESIGN === */

/* Extra Large screens */
@media (min-width: 1400px) {
  .container {
    max-width: 1320px;
  }

  .hero-title {
    font-size: 4.5rem;
  }

  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Large screens */
@media (max-width: 1199px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Medium screens */
@media (max-width: 991px) {
  .hero {
    min-height: 90vh;
    padding: 2rem 0;
  }

  .hero-content {
    padding: 1.5rem 1rem;
  }

  .hero-stats {
    gap: 1.5rem;
  }

  .stat-item {
    min-width: 100px;
    padding: 0.8rem;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .features-section {
    padding: 6rem 1.5rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .feature-card {
    padding: 2.5rem 2rem;
  }

  .stats-section {
    padding: 4rem 1.5rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-right {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Small screens */
@media (max-width: 767px) {
  .hero {
    min-height: 85vh;
  }

  .hero-content {
    padding: 1rem;
  }

  .hero-badge {
    padding: 0.4rem 1rem;
    margin-bottom: 1.5rem;
  }

  .badge-text {
    font-size: 0.8rem;
  }

  .hero-title {
    margin-bottom: 1rem;
  }

  .hero-subtitle {
    margin-bottom: 2rem;
    font-size: 1rem;
  }

  .hero-actions {
    flex-direction: column;
    gap: 0.8rem;
    margin-bottom: 3rem;
  }

  .btn {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }

  .hero-stats {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .stat-item {
    width: 100%;
    max-width: 200px;
  }

  .scroll-indicator {
    bottom: 1rem;
  }

  .features-section {
    padding: 4rem 1rem;
  }

  .section-header {
    margin-bottom: 3rem;
  }

  .section-title {
    margin-bottom: 0.8rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .feature-card {
    padding: 2rem 1.5rem;
    margin: 0 0.5rem;
  }

  .feature-icon {
    width: 70px;
    height: 70px;
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }

  .feature-title {
    font-size: 1.2rem;
  }

  .stats-section {
    padding: 3rem 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stats-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    padding: 1.5rem;
  }

  .stats-icon {
    font-size: 2rem;
    min-width: auto;
  }

  .stats-number {
    font-size: 2rem;
    margin-bottom: 0.3rem;
  }

  .footer {
    padding: 3rem 1rem 0;
  }

  .footer-content {
    gap: 2rem;
  }

  .footer-right {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .social-links {
    justify-content: center;
  }
}

/* Extra small screens */
@media (max-width: 479px) {
  .hero-content {
    padding: 0.5rem;
  }

  .hero-title {
    font-size: 2rem;
    line-height: 1.1;
  }

  .hero-subtitle {
    font-size: 0.95rem;
    padding: 0 0.5rem;
  }

  .btn {
    padding: 0.7rem 1.2rem;
    font-size: 0.85rem;
  }

  .features-section {
    padding: 3rem 0.5rem;
  }

  .feature-card {
    margin: 0;
    padding: 1.5rem 1rem;
  }

  .feature-icon {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .feature-title {
    font-size: 1.1rem;
  }

  .feature-description {
    font-size: 0.9rem;
  }

  .stats-section {
    padding: 2rem 0.5rem;
  }

  .stats-card {
    padding: 1rem;
  }

  .stats-number {
    font-size: 1.5rem;
  }

  .footer {
    padding: 2rem 0.5rem 0;
  }

  .footer-title {
    font-size: 1.5rem;
  }
}

/* High DPI screens */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .hero {
    background-image:
      linear-gradient(
        135deg,
        rgba(39, 174, 96, 0.9) 0%,
        rgba(44, 62, 80, 0.8) 100%
      ),
      url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=4140&q=80');
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .feature-card {
    background: rgba(255, 255, 255, 0.95);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  .hero-particles {
    animation: none;
  }

  .scroll-indicator {
    animation: none;
  }
}

/* Print styles */
@media print {
  .hero {
    background: white !important;
    color: black !important;
    min-height: auto;
  }

  .btn,
  .social-links,
  .scroll-indicator {
    display: none;
  }

  .features-section,
  .stats-section {
    background: white !important;
    color: black !important;
  }

  .footer {
    background: white !important;
    color: black !important;
    border-top: 1px solid #ccc;
  }
}

/* Focus styles for accessibility */
.btn:focus,
.footer-link:focus,
.social-link:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Loading states */
.loading {
  opacity: 0.6;
  pointer-events: none;
}

/* Error states */
.error {
  border: 2px solid #e74c3c;
  background-color: #fdf2f2;
}

/* Success states */
.success {
  border: 2px solid var(--primary-color);
  background-color: #f0f9f4;
}

/* Utility classes */
.text-center {
  text-align: center;
}
.text-left {
  text-align: left;
}
.text-right {
  text-align: right;
}

.mt-1 {
  margin-top: 0.5rem;
}
.mt-2 {
  margin-top: 1rem;
}
.mt-3 {
  margin-top: 1.5rem;
}
.mt-4 {
  margin-top: 2rem;
}

.mb-1 {
  margin-bottom: 0.5rem;
}
.mb-2 {
  margin-bottom: 1rem;
}
.mb-3 {
  margin-bottom: 1.5rem;
}
.mb-4 {
  margin-bottom: 2rem;
}

.p-1 {
  padding: 0.5rem;
}
.p-2 {
  padding: 1rem;
}
.p-3 {
  padding: 1.5rem;
}
.p-4 {
  padding: 2rem;
}

.d-none {
  display: none;
}
.d-block {
  display: block;
}
.d-flex {
  display: flex;
}
.d-grid {
  display: grid;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary-dark);
}
</style>
