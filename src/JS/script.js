// script.js — Scentify Global Script

// Tab switching (Product Detail Page)
function openTab(evt, tabName) {
  const tabContents = document.getElementsByClassName('tab-content');
  const tabButtons = document.getElementsByClassName('tab-button');

  for (let i = 0; i < tabContents.length; i++) tabContents[i].classList.remove('active');
  for (let i = 0; i < tabButtons.length; i++) tabButtons[i].classList.remove('active');

  const target = document.getElementById(tabName);
  if (target) target.classList.add('active');
  if (evt && evt.currentTarget) evt.currentTarget.classList.add('active');
}

// Quantity control (Product Detail Page)
function updateQuantity(change) {
  const qtyInput = document.getElementById('quantity');
  if (!qtyInput) return;
  let newQty = parseInt(qtyInput.value) + change;
  qtyInput.value = Math.max(1, newQty);
}

// Thumbnail image switcher (Product Detail Page)
function changeMainImage(thumbnail) {
  const mainImage = document.getElementById('main-product-image');
  if (!mainImage) return;
  mainImage.src = thumbnail.src;
  mainImage.alt = thumbnail.alt;
  document.querySelectorAll('.thumbnail-image').forEach(img => img.classList.remove('active'));
  thumbnail.classList.add('active');
}

// Global cart count sync on every page
document.addEventListener('DOMContentLoaded', () => {
  const cartCountEl = document.querySelector('.cart-count');

  function refreshCartCount() {
    if (!cartCountEl) return;
    const cart = JSON.parse(localStorage.getItem('scentifyCart')) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = total;
  }

  refreshCartCount();

  // Initialise first tab on detail page if present
  const firstTabBtn = document.querySelector('.tab-button');
  const firstTabContent = document.getElementById('Description');
  if (firstTabBtn) firstTabBtn.classList.add('active');
  if (firstTabContent) firstTabContent.classList.add('active');

  // Homepage "Add to Cart" buttons (.card-cart-btn)
  document.querySelectorAll('.card-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // prevent the parent <a> from navigating

      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));

      if (!id || !name || !price) return;

      let cart = JSON.parse(localStorage.getItem('scentifyCart')) || [];
      const existing = cart.find(item => item.id === id);

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ id, name, price, quantity: 1 });
      }

      localStorage.setItem('scentifyCart', JSON.stringify(cart));
      refreshCartCount();

      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> Added!';
      setTimeout(() => { btn.innerHTML = originalHTML; }, 1200);
    });
  });
});