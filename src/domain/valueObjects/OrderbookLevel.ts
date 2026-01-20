export class OrderbookLevel {
  private readonly price: string;
  private readonly quantity: string;

  private constructor(price: string, quantity: string) {
    this.validatePrice(price);
    this.validateQuantity(quantity);
    this.price = price;
    this.quantity = quantity;
  }

  static create(price: string, quantity: string): OrderbookLevel {
    return new OrderbookLevel(price, quantity);
  }

  private validatePrice(price: string): void {
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      throw new Error("Invalid price or quantity");
    }
  }

  private validateQuantity(quantity: string): void {
    const quantityNum = parseFloat(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      throw new Error("Price and quantity must be positive numbers");
    }
  }

  get priceAsString(): string {
    return this.price;
  }

  get quantityAsString(): string {
    return this.quantity;
  }

  get priceAsNumber(): number {
    return parseFloat(this.price);
  }

  get quantityAsNumber(): number {
    return parseFloat(this.quantity);
  }

  formatPrice(): string {
    const num = this.priceAsNumber;
    if (num >= 1000) {
      return num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return num.toFixed(2);
  }

  formatQuantity(): string {
    const num = this.quantityAsNumber;
    if (num === 0) return "0.00000";
    
    if (num >= 1) {
      return num.toLocaleString("en-US", {
        minimumFractionDigits: 5,
        maximumFractionDigits: 5,
      });
    }
    
    return num.toFixed(8).replace(/\.?0+$/, "");
  }
}
