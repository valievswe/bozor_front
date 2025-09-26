<template>
  <div class="searchable-select" v-click-outside="closeDropdown">
    <input
      type="text"
      :value="searchTerm"
      @input="handleInput"
      @focus="showDropdown = true"
      :placeholder="placeholder"
      autocomplete="off"
    />
    <div v-if="isLoading" class="spinner"></div>
    <ul v-if="showDropdown && items.length > 0" class="dropdown">
      <li v-for="item in items" :key="item.id" @click="selectItem(item)">
        <slot name="item" :item="item">
          {{ item.fullName || item.name }}
        </slot>
      </li>
    </ul>
    <div
      v-if="showDropdown && !isLoading && items.length === 0 && searchTerm"
      class="dropdown-empty"
    >
      Natijalar topilmadi.
    </div>
  </div>
</template>

<script>
const vClickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function (event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event, el)
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  }
}

export default {
  name: 'SearchableSelect',
  directives: {
    clickOutside: vClickOutside
  },
  props: {
    items: { type: Array, required: true },
    isLoading: { type: Boolean, default: false },
    placeholder: { type: String, default: 'Qidirish...' },
    initialText: { type: String, default: '' }
  },
  emits: ['select', 'search'],
  data() {
    return {
      searchTerm: this.initialText,
      showDropdown: false,
      debounceTimer: null
    }
  },
  watch: {
    initialText(newVal) {
      this.searchTerm = newVal
    }
  },
  methods: {
    handleInput(event) {
      this.searchTerm = event.target.value
      this.showDropdown = true
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.$emit('search', this.searchTerm)
      }, 300)
    },
    selectItem(item) {
      this.searchTerm =
        item.fullName || item.name || item.storeNumber || item.stallNumber
      this.showDropdown = false
      this.$emit('select', item)
    },
    closeDropdown() {
      this.showDropdown = false
    }
  }
}
</script>
<style scoped>
.searchable-select {
  position: relative;
  width: 100%;
}

input {
  width: 100%;
  padding: 0.75rem;
  padding-right: 35px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

input:focus {
  outline: none;
  border-color: var(--primary-color, #42b983);
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
}

.spinner {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  border: 2px solid #f3f3f3;
  border-top: 2px solid var(--primary-color, #42b983);
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;
}

.dropdown,
.dropdown-empty {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  max-height: 220px;
  overflow-y: auto;
  list-style-type: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.dropdown li {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown li:hover {
  background-color: #f5f5f5;
}

.dropdown-empty {
  padding: 1rem;
  color: #777;
  text-align: center;
}

@keyframes spin {
  0% {
    transform: translateY(-50%) rotate(0deg);
  }
  100% {
    transform: translateY(-50%) rotate(360deg);
  }
}
</style>
