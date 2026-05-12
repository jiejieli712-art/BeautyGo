<template>
  <main class="page">
    <h1>BeautyGo Admin Dashboard</h1>
    <p>当前阶段聚焦入驻审核闭环，后续会扩展订单、投诉和城市经营看板。</p>
    <section class="cards">
      <article class="card">
        <h2>Milestone</h2>
        <p>Auth + Artist onboarding</p>
      </article>
      <article class="card">
        <h2>审核入口</h2>
        <p><RouterLink to="/artists">查看入驻申请</RouterLink></p>
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
