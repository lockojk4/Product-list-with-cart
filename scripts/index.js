import { renderProducts } from '../data/product.js';
import { CartManager } from '../data/cart.js';

const cart = new CartManager();

async function init() {
    try {
        // 1. Fetch the JSON file 
        const response = await fetch('./data/data.json');
        const data = await response.json();
        
        // 2. Render the products to the page
        renderProducts(data);

        // 3. THIS IS STEP 4: The new event delegation block 
        // that replaces the old "addBtns.forEach" loop
        document.addEventListener('click', (e) => {
            
            // Handle standard Add to Cart click
            const addBtn = e.target.closest('.add-to-cart-btn');
            if (addBtn) {
                const name = addBtn.getAttribute('data-name');
                const price = addBtn.getAttribute('data-price');
                const thumbnail = addBtn.getAttribute('data-thumbnail');
                cart.addItem(name, price, thumbnail);
                return;
            }

            // Handle '+' button click
            const incBtn = e.target.closest('.increment-btn');
            if (incBtn) {
                const name = incBtn.getAttribute('data-name');
                const item = cart.items.find(i => i.name === name);
                if (item) cart.addItem(name, item.price, item.thumbnail);
                return;
            }

            // Handle '-' button click
            const decBtn = e.target.closest('.decrement-btn');
            if (decBtn) {
                const name = decBtn.getAttribute('data-name');
                cart.decrementItem(name);
                return;
            }
        });
        
        // 4. Handle Confirm Order Button (to open modal)
        const confirmBtn = document.getElementById('confirm-order-btn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                cart.showConfirmationModal();
            });
        }

        // 5. Handle Start New Order Button (to close modal and clear cart)
        const startNewOrderBtn = document.getElementById('start-new-order-btn');
        if (startNewOrderBtn) {
            startNewOrderBtn.addEventListener('click', () => {
                cart.clearCart();
            });
        }

        // 6. Initial Cart UI setup
        cart.updateUI();

    } catch (error) {
        console.error("Failed to load products. If loading locally, ensure you are running a local server.", error);
    }
}

// Initialize script when DOM is loaded
document.addEventListener('DOMContentLoaded', init);