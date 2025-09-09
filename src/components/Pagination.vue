<template>
  <div class="pagination-controls" v-if="meta.totalPages > 1">
    <button
      class="btn-page"
      :disabled="meta.page <= 1"
      @click="changePage(meta.page - 1)"
    >
      &laquo; Oldingi
    </button>

    <span class="page-info">
      Sahifa {{ meta.page }} / {{ meta.totalPages }}
    </span>

    <button
      class="btn-page"
      :disabled="meta.page >= meta.totalPages"
      @click="changePage(meta.page + 1)"
    >
      Keyingi &raquo;
    </button>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    meta: {
      type: Object,
      required: true,
      default: () => ({ page: 1, totalPages: 1 })
    }
  },
  emits: ['page-change'],
  methods: {
    changePage(newPage) {
      if (newPage > 0 && newPage <= this.meta.totalPages) {
        this.$emit('page-change', newPage)
      }
    }
  }
}
</script>

<style scoped>
.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}
.page-info {
  color: #7f8c8d;
  font-weight: 500;
}
.btn-page {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}
.btn-page:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
