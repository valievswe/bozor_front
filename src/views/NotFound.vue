<template>
  <div class="not-found">
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>The page you're looking for doesn't exist.</p>
    <router-link to="/" class="home-link">Go back to Home</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 60px 20px;
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  font-size: 6rem;
  color: #42b983;
  margin: 0;
  line-height: 1;
}

h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin: 20px 0;
}

p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
}

.home-link {
  display: inline-block;
  padding: 12px 24px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.home-link:hover {
  background-color: #3aa876;
}
</style>
