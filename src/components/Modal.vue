<template>
  <transition name="modal-fade">
    <div class="modal-backdrop" @click.self="$emit('close')">
      <div class="modal-container">
        <header class="modal-header">
          <slot name="header"> Default Header </slot>
          <button type="button" class="btn-close" @click="$emit('close')">
            ×
          </button>
        </header>

        <section class="modal-body">
          <slot name="body"> Default Body </slot>
        </section>

        <footer class="modal-footer">
          <slot name="footer">
            <!-- Default footer buttons can go here -->
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Modal',
  emits: ['close']
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px; /* Default width, can be overridden */
  max-height: 90vh;
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eeeeee;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  position: relative;
  padding: 1.5rem;
  overflow-y: auto;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #eeeeee;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-close {
  border: none;
  font-size: 24px;
  padding: 0 10px;
  cursor: pointer;
  font-weight: bold;
  color: #7f8c8d;
  background: transparent;
}

/* Modal transition animation */
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
</style>
