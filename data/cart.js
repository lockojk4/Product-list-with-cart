export class CartManager {
    constructor() {
        this.items = [];
    }

    addItem(name, price, thumbnail) {
        const existing = this.items.find(item => item.name === name);
        if (existing) {
            existing.qty += 1;
        } else {
            this.items.push({ name, price: parseFloat(price), qty: 1, thumbnail });
        }
        this.updateUI();
    }

    removeItem(name) {
        this.items = this.items.filter(item => item.name !== name);
        this.updateUI();
    }

    decrementItem(name) {
        const existing = this.items.find(item => item.name === name);
        if (existing) {
            if (existing.qty > 1) {
                existing.qty -= 1;
            } else {
                this.removeItem(name); 
                return;
            }
        }
        this.updateUI();
    }

    getTotalItems() {
        return this.items.reduce((sum, item) => sum + item.qty, 0);
    }

    getTotalPrice() {
        return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }

    updateUI() {
        const title = document.getElementById('cart-title');
        const itemsContainer = document.getElementById('cart-items');
        const wrapper = document.getElementById('cart-total-wrapper');
        const totalPriceEl = document.getElementById('cart-total-price');

        if (!title || !itemsContainer) return;

        title.textContent = `Your Cart (${this.getTotalItems()})`;

        if (this.items.length === 0) {
            itemsContainer.innerHTML = `
                <div class="empty-cart-container">
                    <img src="./assets/images/illustration-empty-cart.svg" alt="Empty Cart" class="empty-cart-img">
                    <p class="empty-msg">Your added items will appear here</p>
                </div>
            `;
            wrapper.style.display = 'none';
        } else {
            itemsContainer.innerHTML = this.items.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price-info">
                            <span class="qty">${item.qty}x</span>
                            <span class="unit-price">@ $${item.price.toFixed(2)}</span>
                            <span class="total-price">$${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                    </div>
                    <button class="remove-btn" data-name="${item.name}">×</button>
                </div>
            `).join('');
            
            totalPriceEl.textContent = `$${this.getTotalPrice().toFixed(2)}`;
            wrapper.style.display = 'block';
        }

        this.bindRemoveEvents();
        
        // Syncs the product grid buttons and borders whenever the cart updates
        this.syncProductGrid();
    }

    syncProductGrid() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const name = card.getAttribute('data-product');
            const price = card.getAttribute('data-price');
            const thumbnail = card.getAttribute('data-thumbnail');
            const safeName = name.replace(/[^a-zA-Z0-9]/g, '-');
            
            const imgEl = document.getElementById(`img-${safeName}`);
            const btnContainer = document.getElementById(`btn-container-${safeName}`);
            
            const cartItem = this.items.find(item => item.name === name);
            
            if (cartItem) {
                // Item is selected: Add red border and show quantity controls
                if (imgEl) imgEl.classList.add('selected-img');
                if (btnContainer) {
                    btnContainer.innerHTML = `
                        <div class="active-qty-btn">
                            <button class="qty-btn decrement-btn" data-name="${name}">
                                <img src="./assets/images/icon-decrement-quantity.svg" alt="-">
                            </button>
                            <span class="qty-display">${cartItem.qty}</span>
                            <button class="qty-btn increment-btn" data-name="${name}">
                                <img src="./assets/images/icon-increment-quantity.svg" alt="+">
                            </button>
                        </div>
                    `;
                }
            } else {
                // Item is empty: Remove border and restore Add to Cart button
                if (imgEl) imgEl.classList.remove('selected-img');
                if (btnContainer) {
                    btnContainer.innerHTML = `
                        <button class="add-to-cart-btn" data-name="${name}" data-price="${price}" data-thumbnail="${thumbnail}">
                            <img src="./assets/images/icon-add-to-cart.svg" alt="Cart Icon"> Add to Cart
                        </button>
                    `;
                }
            }
        });
    }

    bindRemoveEvents() {
        const removeBtns = document.querySelectorAll('.remove-btn');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.target.getAttribute('data-name');
                this.removeItem(name);
            });
        });
    }

    showConfirmationModal() {
        const modal = document.getElementById('confirmation-modal-overlay');
        const modalItems = document.getElementById('modal-items-list');
        const modalTotal = document.getElementById('modal-total-price');
        
        if (!modal || !modalItems) return;
        
        // Render items inside the modal with their thumbnails
        modalItems.innerHTML = this.items.map(item => `
            <div class="modal-item">
                <div class="modal-item-left">
                    <img src="${item.thumbnail}" alt="${item.name}" class="modal-item-img">
                    <div class="modal-item-info">
                        <h4>${item.name}</h4>
                        <div class="modal-item-price-info">
                            <span class="qty">${item.qty}x</span>
                            <span class="unit-price">@ $${item.price.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <span class="modal-item-total">$${(item.price * item.qty).toFixed(2)}</span>
            </div>
        `).join('');
        
        modalTotal.textContent = `$${this.getTotalPrice().toFixed(2)}`;
        modal.style.display = 'flex'; // Shows the modal overlay
    }

    clearCart() {
        this.items = []; // Empty the items array
        this.updateUI(); // Refresh the side cart display
        
        // Hide the modal
        const modal = document.getElementById('confirmation-modal-overlay');
        if (modal) modal.style.display = 'none';
    }
}