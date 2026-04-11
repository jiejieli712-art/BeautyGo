<script setup lang="ts">
import { computed, ref } from "vue";
import type { AppRole } from "@beautygo/domain-types";
import { appRoles, getPrimaryNavigation } from "./features/role-shell/navigation";

const activeRole = ref<AppRole>(appRoles.customer);
const navigation = computed(() => getPrimaryNavigation(activeRole.value));
</script>

<template>
  <div class="app-shell">
    <div class="hero">
      <span class="title">BeautyGo</span>
      <span class="subtitle">Role-aware super app foundation</span>
    </div>

    <div class="role-switcher">
      <button
        v-for="role in Object.values(appRoles)"
        :key="role"
        class="role-button"
        @click="activeRole = role"
      >
        {{ role }}
      </button>
    </div>

    <div class="card">
      <span class="card-title">Current role</span>
      <span class="card-value">{{ activeRole }}</span>
    </div>

    <div class="card">
      <span class="card-title">Primary navigation</span>
      <div v-for="item in navigation" :key="item.key" class="nav-item">
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  padding: 32px;
  background: linear-gradient(180deg, #f6efe8 0%, #fffaf6 100%);
  font-family: "Helvetica Neue", sans-serif;
}

.hero {
  margin-bottom: 32px;
}

.title {
  display: block;
  font-size: 48px;
  font-weight: 700;
  color: #36211b;
}

.subtitle {
  display: block;
  margin-top: 8px;
  color: #7d5c52;
}

.role-switcher {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.role-button {
  flex: 1;
  padding: 12px 16px;
  border: 0;
  border-radius: 14px;
  background: #e7d3c6;
  color: #3d241d;
  cursor: pointer;
}

.card {
  margin-bottom: 20px;
  padding: 24px;
  border-radius: 24px;
  background: #ffffff;
}

.card-title {
  display: block;
  margin-bottom: 12px;
  font-size: 14px;
  color: #8a6a61;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.card-value,
.nav-item {
  display: block;
  font-size: 20px;
  color: #36211b;
}
</style>
