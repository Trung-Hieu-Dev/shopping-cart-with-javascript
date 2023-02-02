class Product {
  
    constructor(title, image, desc, price) {
      this.title = title;
      this.imageUrl = image;
      this.description = desc;
      this.price = price;
    }
}

// basse class to create attribute
class ElementAttribute {
    constructor(attName, attValue) {
        this.name = attName;
        this.value = attValue;
    }
}

//base class to create element
class Component {
    constructor(renderHookId) {
        this.hookId = renderHookId;
    }

    //create element
    createRootElement(tag, cssClasses, attributes) {
        const rootElement = document.createElement(tag);
        if(cssClasses) {
            rootElement.className = cssClasses;
        }
        if(attributes && attributes.length > 0) {
            for (const att of attributes) {
                rootElement.setAttribute(att.name, att.value);
            }
        }
        document.getElementById(this.hookId).append(rootElement);
        return rootElement;
    }
}

// add cart
class ShoppingCart extends Component {
    items = [];

    set cartItems(value) {
        this.items = value;
        this.totalOutput.innerHTML = `<h2>Total:\$${this.totalAmount.toFixed(2)}</h2>`

    }

    get totalAmount() {
        const sum = this.items.reduce((prev, current) => {
            return prev + current.price;
        }, 0);
        return sum;
    }

    addProduct(product) {
        const updatedItems = [...this.items];
        updatedItems.push(product);
        this.cartItems = updatedItems;

    }

    render() {
        const cartEl = this.createRootElement('section', 'cart');
        cartEl.innerHTML = `
            <h2>Total:\$${0}</h2>
            <button>Order Now!</button>
        `
        this.totalOutput = cartEl.querySelector('h2');
    }

    constructor(renderHookId) {
        super(renderHookId);
    }
}

class ProductItem extends Component {
    constructor(product, renderHookId) {
        super(renderHookId);
        this.product = product;
    }

    addToCart() {
        App.addProductToCart(this.product);
    }

    render() {
        const prodEl = this.createRootElement('li', 'product-item');
        prodEl.innerHTML = `
            <div>
                <img src="${this.product.imageUrl}" alt="${this.product.title}" >
                <div class="product-item__content">
                    <h2>${this.product.title}</h2>
                    <h3>\$${this.product.price}</h3>
                    <p>${this.product.description}</p>
                    <button>Add to Cart</button>
                </div>
            </div>
        `;

        const addCartButton = prodEl.querySelector('button');
        addCartButton.addEventListener('click', this.addToCart.bind(this));
    }

}

// add product list
class ProductList extends Component {
    products = [
        new Product(
        'A Pillow',
        'https://www.maxpixel.net/static/photo/2x/Soft-Pillow-Green-Decoration-Deco-Snuggle-1241878.jpg',
        'A soft pillow!',
        19.99
        ),
        new Product(
        'A Carpet',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Ardabil_Carpet.jpg/397px-Ardabil_Carpet.jpg',
        'A carpet which you might like - or not.',
        89.99
        )
    ];

    render() {
        this.prodList = this.createRootElement('ul', 'product-list', [new ElementAttribute('id', 'prod-list')]);
    
        for (const prod of this.products) {
            const productItem = new ProductItem(prod, 'prod-list');
            productItem.render();
        }
    }

    constructor(renderHookId) {
        super(renderHookId);
    }

}

// render cart & product list
class Shop {
    render() {
        this.cart = new ShoppingCart('app');
        this.cart.render();

        this.productList = new ProductList('app');
        this.productList.render();
    }
}

// initial app
class App {
    static init() {
        const shop = new Shop();
        shop.render();
        this.cart = shop.cart;

    }

    static addProductToCart(product) {
        this.cart.addProduct(product);
    }
}

App.init();