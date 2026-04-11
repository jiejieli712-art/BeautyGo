<template>
  <main class="page">
    <h1>BeautyGo Admin Dashboard</h1>
    <p>This screen will become the operating dashboard for city-level order and supply health.</p>
    <section class="cards">
      <article class="card">
        <h2>Milestone</h2>
        <p>Bootstrap</p>
      </article>
      <article class="card">
        <h2>Next Slice</h2>
        <p>Auth + Artist onboarding</p>
      </article>
    </section>
  </main>
</template>

<style scoped>
.page {
  padding: 32px;
  font-family: "Helvetica Neue", sans-serif;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.card {
  padding: 20px;
  border-radius: 18px;
  background: #fff;
}
</style>
