<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>Welcome to the Bozor Front application built with Vue.js!</p>
    <p>This is a Single Page Application (SPA) with:</p>
    <ul>
      <li>Vue 3 with Composition API</li>
      <li>Vue Router for navigation</li>
      <li>Pinia for state management</li>
      <li>Vite for fast development and building</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AboutView'
}
</script>

<style scoped>
.about {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  color: #42b983;
  margin-bottom: 20px;
}

ul {
  text-align: left;
  margin-top: 20px;
}

li {
  margin: 10px 0;
  color: #2c3e50;
}
</style>
