<template>
  <Card class="shadow-lg hover:shadow-xl transition-shadow duration-300">
    <template #header>
      <div class="p-4 pb-0">
        <span class="text-xs font-semibold bg-blue-100 text-blue-700 rounded-full px-3 py-1">
          {{ product.category.title }}
        </span>
      </div>
    </template>
    <template #title>
      <span class="text-lg font-bold">{{ product.name }}</span>
    </template>
    <template #subtitle>
      <span class="text-green-600 font-bold text-xl">R$ {{ product.price.toFixed(2) }}</span>
    </template>
    <template #footer>
      <Button label="Adicionar 🛒" class="w-full" @click="$emit('add-to-cart', product)" />
    </template>
  </Card>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import type { Product } from '../models/Product'

export default defineComponent({
  name: 'ProductCard',
  components: { Card, Button },
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true,
    },
  },
  emits: ['add-to-cart'],
})
</script>
