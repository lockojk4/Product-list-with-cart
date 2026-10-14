export function renderProducts(products) {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    productList.innerHTML = products.map(product => {
        // Create a URL-safe ID string for DOM targeting
        const safeName = product.name.replace(/[^a-zA-Z0-9]/g, '-');
        
        return `
        <div class="product-card" data-product="${product.name}" data-price="${product.price}" data-thumbnail="${product.image.thumbnail}">
            <div class="img-container">
                <!-- The picture element automatically swaps images based on screen size -->
                <picture>
                    <source media="(min-width: 1024px)" srcset="${product.image.desktop}">
                    <source media="(min-width: 768px)" srcset="${product.image.tablet}">
                    <img id="img-${safeName}" src="${product.image.mobile}" alt="${product.name}">
                </picture>
                
                <div id="btn-container-${safeName}" class="btn-container-wrapper">
                    <button class="add-to-cart-btn" data-name="${product.name}" data-price="${product.price}" data-thumbnail="${product.image.thumbnail}">
                        <img src="./assets/images/icon-add-to-cart.svg" alt="Cart Icon"> Add to Cart
                    </button>
                </div>
            </div>
            <p class="category">${product.category}</p>
            <h3 class="name">${product.name}</h3>
            <p class="price">$${product.price.toFixed(2)}</p>
        </div>
        `;
    }).join('');
}