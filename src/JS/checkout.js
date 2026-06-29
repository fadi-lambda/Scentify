// checkout.js — Checkout Page

document.addEventListener('DOMContentLoaded', () => {

  const cartItemsList    = document.getElementById('cartItemsList');
  const emptyCartMessage = document.getElementById('emptyCartMessage');
  const subtotalDisplay  = document.getElementById('subtotalDisplay');
  const shippingDisplay  = document.getElementById('shippingDisplay');
  const orderTotalDisplay= document.getElementById('orderTotalDisplay');
  const cartItemCount    = document.getElementById('cartItemCount');
  const checkoutForm     = document.getElementById('checkoutForm');
  const shippingRadios   = document.querySelectorAll('input[name="shipping_method"]');

  const FREE_SHIPPING     = 0;
  const STANDARD_SHIPPING = 200;

  let cart = JSON.parse(localStorage.getItem('scentifyCart')) || [];

  function getShippingCost() {
    const checked = document.querySelector('input[name="shipping_method"]:checked');
    return checked && checked.value === 'free' ? FREE_SHIPPING : STANDARD_SHIPPING;
  }

  function renderCart() {
    if (!cartItemsList) return;
    cartItemsList.innerHTML = '';
    let subtotal = 0;
    let totalItems = 0;

    if (cart.length === 0) {
      if (emptyCartMessage) emptyCartMessage.style.display = 'block';
    } else {
      if (emptyCartMessage) emptyCartMessage.style.display = 'none';

      cart.forEach(item => {
        const itemTotal = parseFloat(item.price) * parseInt(item.quantity);
        subtotal += itemTotal;
        totalItems += item.quantity;

        const div = document.createElement('div');
        div.className = 'checkout-cart-item';
        div.innerHTML = `
          <div class="checkout-cart-item-info">
            <span class="checkout-item-name">${item.name}</span>
            <span class="checkout-item-qty">Qty: ${item.quantity}</span>
          </div>
          <span class="checkout-item-price">Rs. ${itemTotal.toLocaleString()}</span>
        `;
        cartItemsList.appendChild(div);
      });

      const shipping = getShippingCost();
      const total = subtotal + shipping;

      if (subtotalDisplay)   subtotalDisplay.textContent   = `Rs. ${subtotal.toLocaleString()}`;
      if (shippingDisplay)   shippingDisplay.textContent   = shipping === 0 ? 'FREE' : `Rs. ${shipping.toLocaleString()}`;
      if (orderTotalDisplay) orderTotalDisplay.textContent = `Rs. ${total.toLocaleString()}`;
    }

    if (cartItemCount) cartItemCount.textContent = totalItems;
  }

  shippingRadios.forEach(r => r.addEventListener('change', renderCart));

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', e => {
      e.preventDefault();
      if (cart.length === 0) {
        alert('Your cart is empty. Please add items before placing an order.');
        return;
      }
      alert('Order placed successfully! Thank you for shopping with Scentify.');
      localStorage.removeItem('scentifyCart');
    });
  }

  renderCart();
});