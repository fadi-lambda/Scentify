// productpage.js — Product Listing Page

document.addEventListener('DOMContentLoaded', () => {

  let cart = JSON.parse(localStorage.getItem('scentifyCart')) || [];
  const cartItemCountEl = document.getElementById('cartItemCount');
  const cartNotificationEl = document.getElementById('cartNotification');
  const sortSelect = document.getElementById('sortSelect');
  const productGrid = document.getElementById('productGrid');

  // --- Cart Count ---
  function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartItemCountEl) cartItemCountEl.textContent = total;
  }

  function saveCart() {
    localStorage.setItem('scentifyCart', JSON.stringify(cart));
  }

  function showNotification(name) {
    if (!cartNotificationEl) return;
    cartNotificationEl.textContent = `${name} added to cart!`;
    cartNotificationEl.style.display = 'block';
    setTimeout(() => { cartNotificationEl.style.display = 'none'; }, 2000);
  }

  function addItemToCart(id, name, price) {
    if (!id || !name || !price) return;
    const idx = cart.findIndex(item => item.id === id);
    if (idx > -1) {
      cart[idx].quantity += 1;
    } else {
      cart.push({ id, name, price: parseFloat(price), quantity: 1 });
    }
    saveCart();
    updateCartCount();
    showNotification(name);
  }

  // --- Add to Cart Buttons (updated selector) ---
  document.querySelectorAll('.pl-add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      addItemToCart(
        btn.getAttribute('data-id'),
        btn.getAttribute('data-name'),
        btn.getAttribute('data-price')
      );
    });
  });

  // --- Sort ---
  if (sortSelect && productGrid) {
    sortSelect.addEventListener('change', () => {
      const cards = Array.from(productGrid.querySelectorAll('.pl-product-card'));
      const val = sortSelect.value;

      cards.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);
        const ratingA = parseFloat(a.dataset.rating);
        const ratingB = parseFloat(b.dataset.rating);

        if (val === 'price-asc') return priceA - priceB;
        if (val === 'price-desc') return priceB - priceA;
        if (val === 'rating') return ratingB - ratingA;
        return 0; // default/featured
      });

      cards.forEach(card => productGrid.appendChild(card));
    });
  }

  updateCartCount();
});