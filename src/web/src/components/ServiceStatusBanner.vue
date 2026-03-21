<template>
  <div
    class="error-summary"
    role="alert"
    aria-labelledby="error-summary-title"
    tabindex="-1"
  >
    <div class="error-summary__icon">!</div>

    <div class="error-summary__content">
      <h2 id="error-summary-title" class="error-summary__title">
      {{ isStaleData ?  $t("components.errors.server_cache_title") : $t("components.errors.server_error_title") }}
      </h2>

      <ul class="error-summary__list">
        <li>
          {{ isStaleData ?  $t("components.errors.server_cache_summary") : $t("components.errors.server_error_summary") }}
        </li>
      </ul>
    </div>
  </div>
</template>



<script>
import { syncLocaleWithRoute } from "@/utils/localeUtils.js";

export default {
  name: "ServiceStatusBanner",
  props: {
    isStaleData: {
      type: Boolean,
      default: false,
    }
  },
  async mounted() {
    await syncLocaleWithRoute(this);
  },
};
</script>

<style scoped>
.error-summary {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: #FED4BD;
  border-left: 8px solid #943706;
  padding: 20px;
  margin-bottom: 20px;
  color: #943706;
}

.error-summary__icon {
  background: #943706;
  color: white;
  font-weight: bold;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.error-summary__title {
  margin: 0 0 8px 0;
  font-weight: 700;
}

.error-summary__list {
  margin: 0;
  padding-left: 20px;
}
</style>