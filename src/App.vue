<template>
  <div :class="['min-h-screen transition-colors duration-300', isDark ? 'dark bg-gray-900' : 'bg-gray-100']">
    <div class="max-w-6xl mx-auto p-6">

      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 :class="['text-3xl font-bold', isDark ? 'text-white' : 'text-gray-800']">
          🛍️ Meu E-Commerce
        </h1>
        <Button
          :label="isDark ? '☀️ Modo Claro' : '🌙 Modo Escuro'"
          severity="secondary"
          outlined
          @click="toggleDark"
        />
      </div>

      <!-- Grid de Produtos -->
      <section class="mb-10">
        <h2 :class="['text-xl font-semibold mb-4', isDark ? 'text-gray-200' : 'text-gray-700']">
          Produtos
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            @add-to-cart="addToCart"
          />
        </div>
      </section>

      <!-- Carrinho -->
      <section>
        <h2 :class="['text-xl font-semibold mb-4', isDark ? 'text-gray-200' : 'text-gray-700']">
          🛒 Carrinho
        </h2>

        <!-- Totais -->
        <div class="flex gap-4 mb-6 flex-wrap">
          <div class="bg-blue-100 text-blue-800 rounded-xl px-5 py-3 font-medium">
            📦 Total de itens: <strong>{{ totalItems }}</strong>
          </div>
          <div class="bg-green-100 text-green-800 rounded-xl px-5 py-3 font-medium">
            💰 Preço Final: <strong>R$ {{ totalPrice }}</strong>
          </div>
        </div>

        <!-- Empty State (Desafio) -->
        <Card v-if="cart.items.length === 0">
          <template #content>
            <div class="flex flex-col items-center gap-3 py-8">
              <span class="text-6xl">🛒</span>
              <p class="text-gray-500 text-lg font-medium">Seu carrinho está vazio</p>
              <p class="text-gray-400 text-sm">Adicione produtos da vitrine acima</p>
            </div>
          </template>
        </Card>

        <!-- DataView do Carrinho -->
        <DataView v-else :value="cart.items">
          <template #list>
            <div class="flex flex-col gap-3 p-2">
              <div
                v-for="item in cart.items"
                :key="item.product.id"
                class="flex items-center justify-between bg-white rounded-xl shadow-md p-4"
              >
                <div class="flex flex-col gap-1">
                  <span class="font-bold text-gray-800 text-lg">{{ item.product.name }}</span>
                  <span class="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5 w-fit">
                    {{ item.product.category.title }}
                  </span>
                  <span class="text-green-600 font-semibold">
                    R$ {{ (item.product.price * item.quantity).toFixed(2) }}
                  </span>
                </div>
                <div class="flex items-center gap-3">
                  <InputNumber
                    :modelValue="item.quantity"
                    @update:modelValue="(val) => updateQuantity(item.product.id, val ?? 1)"
                    :min="1"
                    showButtons
                    buttonLayout="horizontal"
                    style="width: 130px"
                  />
                  <Button
                    icon="pi pi-trash"
                    severity="danger"
                    rounded
                    outlined
                    @click="confirmRemove(item.product.id, item.product.name)"
                  />
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </section>
    </div>

    <!-- ConfirmDialog (Desafio) -->
    <ConfirmDialog />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import ProductCard from './components/ProductCard.vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DataView from 'primevue/dataview'
import InputNumber from 'primevue/inputnumber'
import ConfirmDialog from 'primevue/confirmdialog'
import { Cart } from './models/Cart'
import type { Product } from './models/Product'

export default defineComponent({
  name: 'App',
  components: { ProductCard, Card, Button, DataView, InputNumber, ConfirmDialog },

  setup() {
    const confirm = useConfirm()
    return { confirm }
  },

  data() {
    return {
      isDark: false,
      cart: new Cart(),
      products: [
        { id: 1, name: 'Notebook',      price: 3500, category: { id: 1, title: 'Eletrônicos' } },
        { id: 2, name: 'Mouse',         price: 250,  category: { id: 1, title: 'Eletrônicos' } },
        { id: 3, name: 'Camiseta',      price: 79,   category: { id: 2, title: 'Roupas' } },
        { id: 4, name: 'Tênis Running', price: 320,  category: { id: 2, title: 'Roupas' } },
      ] as Product[],
    }
  },

  computed: {
    totalItems(): number {
      return this.cart.items.reduce((total, item) => total + item.quantity, 0)
    },
    totalPrice(): string {
      return this.cart.items
        .reduce((total, item) => total + item.product.price * item.quantity, 0)
        .toFixed(2)
    },
  },

  methods: {
    addToCart(product: Product): void {
      this.cart.addItem(product)
    },
    updateQuantity(productId: number, quantity: number): void {
      const item = this.cart.items.find((i) => i.product.id === productId)
      if (item) item.quantity = quantity
    },
    toggleDark(): void {
      this.isDark = !this.isDark
      document.documentElement.classList.toggle('dark', this.isDark)
    },
    confirmRemove(productId: number, productName: string): void {
      this.confirm.require({
        message: `Deseja remover "${productName}" do carrinho?`,
        header: 'Confirmar remoção',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim, remover',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.cart.removeItem(productId)
        },
      })
    },
  },
})
</script>
