// product-detail.js — Dynamic Product Detail Page
// Reads ?id= from the URL, pulls data from products.js, and fills the page.

document.addEventListener('DOMContentLoaded', () => {

  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  const product = products[productId];

  const container = document.querySelector('.product-page-container');

  // --- Handle missing / invalid product ---
  if (!product) {
    if (container) {
      container.innerHTML = `
        <div class="product-not-found">
          <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
          <h1>Product Not Found</h1>
          <p>The product you're looking for doesn't exist or may have been removed.</p>
          <a href="productlisting.html" class="btn-primary">Back to Shop</a>
        </div>
      `;
    }
    document.title = 'Product Not Found – Scentify';
    return;
  }

  // --- Page Title & Breadcrumb ---
  document.title = `${product.name} – Scentify`;
  const breadcrumbName = document.getElementById('breadcrumbName');
  if (breadcrumbName) breadcrumbName.textContent = product.name;

  // --- Images & Thumbnails ---
  const mainImage = document.getElementById('main-product-image');
  const thumbnailSelector = document.getElementById('thumbnailSelector');

  if (mainImage && product.images.length) {
    mainImage.src = product.images[0];
    mainImage.alt = product.name;
  }

  if (thumbnailSelector) {
    thumbnailSelector.innerHTML = '';
    if (product.images.length > 1) {
      product.images.forEach((imgSrc, index) => {
        const thumb = document.createElement('img');
        thumb.src = imgSrc;
        thumb.alt = `${product.name} – view ${index + 1}`;
        thumb.className = 'thumbnail-image' + (index === 0 ? ' active' : '');
        thumb.tabIndex = 0;
        thumb.setAttribute('role', 'listitem');
        thumb.onclick = () => changeMainImage(thumb);
        thumbnailSelector.appendChild(thumb);
      });
    } else {
      thumbnailSelector.style.display = 'none';
    }
  }

  // --- Text Content ---
  document.getElementById('productTag').textContent = product.tagline;
  document.getElementById('productName').textContent = product.name;
  document.getElementById('productSubtitle').textContent = product.subtitle;

  // --- Rating ---
  const ratingStarsEl = document.getElementById('ratingStars');
  const reviewCountEl = document.getElementById('reviewCount');
  if (ratingStarsEl) {
    ratingStarsEl.innerHTML = renderStars(product.rating);
    ratingStarsEl.parentElement.setAttribute('aria-label', `${product.rating} out of 5 stars, ${product.reviews} reviews`);
  }
  if (reviewCountEl) reviewCountEl.textContent = `(${product.reviews} Reviews)`;

  // --- Price ---
  document.getElementById('oldPrice').textContent = `Rs. ${product.oldPrice.toLocaleString()}`;
  document.getElementById('currentPrice').textContent = `Rs. ${product.price.toLocaleString()}`;

  const discountPct = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  const discountTag = document.getElementById('discountTag');
  if (discountTag && discountPct > 0) discountTag.textContent = `${discountPct}% OFF`;

  // --- Description & Notes ---
  document.getElementById('productDescription').textContent = product.description;
  document.getElementById('productNotes').innerHTML =
    `<strong>Top Notes:</strong> ${product.notes.top} &nbsp;|&nbsp; ` +
    `<strong>Heart Notes:</strong> ${product.notes.middle} &nbsp;|&nbsp; ` +
    `<strong>Base Notes:</strong> ${product.notes.base}`;

  // --- Specifications ---
  const specsList = document.getElementById('specsList');
  if (specsList) {
    specsList.innerHTML = product.specifications.map(spec => `<li>${spec}</li>`).join('');
  }

  // --- Add to Cart / Buy Now ---
  const addToCartBtn = document.getElementById('addToCartBtn');
  const buyNowBtn = document.getElementById('buyNowBtn');

  function getQuantity() {
    const qtyInput = document.getElementById('quantity');
    return qtyInput ? parseInt(qtyInput.value) || 1 : 1;
  }

  function addToCart() {
    const qty = getQuantity();
    let cart = JSON.parse(localStorage.getItem('scentifyCart')) || [];
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({ id: product.id, name: product.name, price: product.price, quantity: qty });
    }

    localStorage.setItem('scentifyCart', JSON.stringify(cart));

    const cartCountEl = document.querySelector('.cart-count');
    if (cartCountEl) {
      const total = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCountEl.textContent = total;
    }
  }

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      addToCart();
      addToCartBtn.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> Added!';
      setTimeout(() => {
        addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart" aria-hidden="true"></i> Add to Cart';
      }, 1500);
    });
  }

  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
      addToCart();
      window.location.href = 'checkoutpage.html';
    });
  }

  // --- Related Products (Dynamic) ---
  const relatedGrid = document.getElementById('relatedProductsGrid');
  if (relatedGrid) {
    const related = getRelatedProducts(product.id, 4);
    relatedGrid.innerHTML = related.map(p => `
      <a href="product-detail.html?id=${p.id}" class="related-product-card">
        <img src="${p.images[0]}" alt="${p.name}" class="related-product-image" loading="lazy">
        <p class="related-product-title">${p.name} | ${p.tagline}</p>
        <p class="related-product-price">Rs. ${p.price.toLocaleString()}</p>
      </a>
    `).join('');
  }

  // --- Helper: render star icons from a numeric rating ---
  function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    let html = '';
    for (let i = 0; i < full; i++) html += '<i class="fas fa-star gold-star" aria-hidden="true"></i>';
    if (half) html += '<i class="fas fa-star-half-alt gold-star" aria-hidden="true"></i>';
    for (let i = 0; i < empty; i++) html += '<i class="far fa-star gold-star" aria-hidden="true"></i>';
    return html;
  }

});