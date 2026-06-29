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
  if (cartCountEl) {
    const cart = JSON.parse(localStorage.getItem('scentifyCart')) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = total;
  }

  // Initialise first tab on detail page if present
  const firstTabBtn = document.querySelector('.tab-button');
  const firstTabContent = document.getElementById('Description');
  if (firstTabBtn) firstTabBtn.classList.add('active');
  if (firstTabContent) firstTabContent.classList.add('active');
});