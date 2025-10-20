
<template>
  <div class="public-view-container">
    <div class="card">
      <header class="card-header">
        <h2>Ijara To'lovi</h2>
      </header>
      <div class="card-body">
        <p class="prompt-text">
          Ijarangizni topish uchun ismingiz, do'kon/rasta raqami, STIR yoki
          telefon raqamingizni kiriting.
        </p>

        <div class="search-wrapper">
          <div class="form-group">
            <input
              v-model="searchTerm"
              @input="handleSearch"
              type="text"
              placeholder="Qidirish..."
              class="form-input"
              autofocus
              autocomplete="off"
            />
            <div v-if="isLoading" class="spinner"></div>
          </div>

          <ul v-if="searchResults.length > 0" class="search-results">
            <li
              v-for="lease in searchResults"
              :key="lease.id"
              @click="selectLease(lease)"
            >
              <div class="result-item">
                <span class="result-name">{{ lease.ownerName }}</span>
                <span class="result-asset">{{
                  lease.storeNumber || lease.stallNumber
                }}</span>
              </div>
            </li>
          </ul>

          <div
            v-if="hasSearched && !isLoading && searchResults.length === 0"
            class="no-results"
          >
            Natijalar topilmadi.
          </div>
        </div>

        <div v-if="!searchTerm && !isLoading" class="search-guide">
          <h4 class="guide-title">Qidiruv namunasi</h4>
          <ul class="guide-list">
            <li @click="runExampleSearch('Рустамжон')">
              <i class="fas fa-user"></i>
              <div class="guide-text">
                <span>Ism bo'yicha</span>
                <code>Рустамжон</code>
              </div>
            </li>
            <li @click="runExampleSearch('1/3')">
              <i class="fas fa-store"></i>
              <div class="guide-text">
                <span>Do'kon raqami bo'yicha</span>
                <code>1/3</code>
              </div>
            </li>
            <li @click="runExampleSearch('3090890')">
              <i class="fas fa-id-card"></i>
              <div class="guide-text">
                <span>STIR (INN) bo'yicha</span>
                <code>3090890...</code>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { paymentService } from '@/services/api'
import { useToast } from 'vue-toastification'

// A simple debounce helper function. You can move this to a utils file.
function debounce(fn, delay) {
  let timeoutId = null;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

export default {
  name: 'PaymentIdView',
  setup() {
    const toast = useToast()
    return { toast }
  },
  data() {
    return {
      searchTerm: '',
      searchResults: [],
      isLoading: false,
      hasSearched: false,
      debouncedSearch: null // We will create this in the created() hook
    }
  },
  // The created() hook is the correct place to initialize properties
  created() {
    // This creates a debounced version of our search logic
    this.debouncedSearch = debounce(async () => {
      this.isLoading = true;
      try {
        const response = await paymentService.searchPublicLeases(this.searchTerm);
        this.searchResults = response.data;
      } catch (error) {
        this.toast.error('Qidiruvda xatolik yuz berdi.');
        this.searchResults = [];
      } finally {
        this.isLoading = false;
        this.hasSearched = true;
      }
    }, 500); // 500ms delay
  },
  // All your methods should be inside this single 'methods' block
  methods: {
    handleSearch() {
      this.searchResults = [];
      this.hasSearched = false;

      if (!this.searchTerm.trim()) {
        this.isLoading = false;
        // If the user clears the search, we don't need to do anything else.
        return;
      }

      this.isLoading = true;
      // Call the debounced function
      this.debouncedSearch();
    },

    selectLease(lease) {
      console.log("User clicked on this object from search results:", lease);

      if (!lease || !lease.id) {
        this.toast.error('Xatolik: Ijara ID topilmadi');
        console.error("CRITICAL: Attempted to select a lease with no ID.", lease);
        return;
      }

      // Use the direct path navigation, which is more robust
      const path = `/pay/lease/${lease.id}`;
      this.$router.push(path);
    },

    runExampleSearch(exampleTerm) {
      this.searchTerm = exampleTerm;
      // We call handleSearch to trigger the debounced search
      this.handleSearch();
    }
  }
}
</script>

<style scoped>
.public-view-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 5vh;
  min-height: 100vh;
  background-color: #f4f7fa;
  font-family: 'Inter', sans-serif;
}
.card {
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
.card-header {
  background-color: #2c3e50;
  color: white;
  padding: 1.5rem;
  text-align: center;
}
.card-header h2 {
  margin: 0;
  font-size: 1.5rem;
}
.card-body {
  padding: 2rem;
}
.prompt-text {
  text-align: center;
  color: #555;
  margin-top: 0;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}
.search-wrapper {
  position: relative;
}
.form-group {
  position: relative;
}
.form-input {
  width: 100%;
  padding: 1rem 1.2rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1.1rem;
  transition: all 0.2s;
}
.form-input:focus {
  outline: none;
  border-color: #27ae60;
  box-shadow: 0 0 0 4px rgba(39, 174, 96, 0.1);
}
.spinner {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  border: 3px solid #f3f3f3;
  border-top: 3px solid #27ae60;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}
.search-results {
  list-style-type: none;
  padding: 0;
  margin: 0.5rem 0 0;
  border: 1px solid #eee;
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
  position: absolute;
  width: 100%;
  background: white;
  z-index: 10;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.07);
}
.result-item {
  padding: 1rem 1.2rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}
.result-item:last-child {
  border-bottom: none;
}
.result-item:hover {
  background-color: #f8f9fa;
}
.result-name {
  font-weight: 600;
  color: #333;
}
.result-asset {
  font-size: 0.9rem;
  color: #777;
  background-color: #eee;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}
.no-results {
  text-align: center;
  padding: 1.5rem;
  color: #888;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-top: 0.5rem;
  background-color: #f8f9fa;
}

/* --- STYLES FOR THE NEW VISUAL GUIDE --- */
.search-guide {
  margin-top: 2rem;
  border-top: 1px solid #f0f0f0;
  padding-top: 1.5rem;
  animation: fadeInUp 0.5s ease-out;
}

.guide-title {
  text-align: center;
  font-size: 0.9rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.guide-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.guide-list li {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #f8f9fa;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.guide-list li:hover {
  border-color: #27ae60;
  background-color: #f0fdf4;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.guide-list i {
  font-size: 1.2rem;
  color: #27ae60;
  margin-right: 1rem;
  width: 20px;
  text-align: center;
}

.guide-text {
  display: flex;
  flex-direction: column;
}

.guide-text span {
  font-size: 0.95rem;
  color: #333;
}

.guide-text code {
  font-size: 0.9rem;
  color: #777;
  background-color: #e9ecef;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  margin-top: 0.2rem;
  display: inline-block;
}

@keyframes spin {
  0% {
    transform: translateY(-50%) rotate(0deg);
  }
  100% {
    transform: translateY(-50%) rotate(360deg);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
