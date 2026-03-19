import type { Product } from './Product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export class Cart {
  items: CartItem[] = [];

  // ✅ Seu addItem já estava perfeito!
  addItem(product: Product, quantity: number = 1): void {
    const exists = this.items.some((item) => item.product.id === product.id);

    if (exists) {
      this.items = this.items.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      this.items.push({ product, quantity });
    }
  }

  // ✅ Novo método para o desafio: remove 1 unidade (ou o item inteiro se chegar a 0)
  removeUnit(productId: number): void {
  const index = this.items.findIndex((item) => item.product.id === productId);
  if (index !== -1) {
    const item = this.items[index]; // ← salva numa variável primeiro
    if (item && item.quantity > 1) { // ← TypeScript fica feliz
      item.quantity--;
    } else {
      this.items.splice(index, 1);
    }
  }
}


  // ✅ Novo método para o desafio: remove o item inteiro do carrinho
  removeItem(productId: number): void {
    this.items = this.items.filter((item) => item.product.id !== productId);
  }
}
