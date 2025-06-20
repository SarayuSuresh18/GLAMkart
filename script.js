document.addEventListener('DOMContentLoaded', () => {
  const CART_KEY = 'glamcart-cart';

  // Add to Cart — works on glamkart.html
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.card');
      if (!card) return alert("Card not found!");

      const titleEl = card.querySelector('.card-title');
      const priceEl = card.querySelector('.card-price');
      const imgEl = card.querySelector('img');

      if (!titleEl || !priceEl || !imgEl) {
        alert("Product details missing.");
        return;
      }

      const title = titleEl.textContent.trim();
      const priceText = priceEl.textContent.trim().replace(/[₹,]/g, '');
      const price = parseInt(priceText, 10);
      const image = imgEl.src;

      if (isNaN(price)) {
        alert("Invalid price for product.");
        return;
      }

      let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
      const existing = cart.find(item => item.title === title);

      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ title, price, image, qty: 1 });
      }

      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      alert(`✅ ${title} added to cart!`);
    });
  });


  const cartContainer = document.getElementById('cart-container');
  if (cartContainer) {
    function renderCart() {
      let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
      cartContainer.innerHTML = '';

      if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
      }

      let total = 0;
      cart.forEach((item, index) => {
        const subtotal = item.price * item.qty;
        total += subtotal;

        const div = document.createElement('div');
        div.className = 'd-flex align-items-center mb-3 border-bottom pb-3';
        div.dataset.index = index;

        div.innerHTML = `
          <img src="${item.image}" width="100" class="me-3 rounded">
          <div class="flex-grow-1">
            <h5>${item.title}</h5>
            <p class="mb-1">₹${item.price} × 
              <button class="btn btn-sm btn-outline-secondary qty-btn" data-action="decrease">−</button>
              <span class="mx-2">${item.qty}</span>
              <button class="btn btn-sm btn-outline-secondary qty-btn" data-action="increase">+</button>
              = ₹${subtotal}
            </p>
          </div>
          <button class="btn btn-sm btn-danger remove-btn">Remove</button>
        `;

        cartContainer.appendChild(div);
      });

      const totalDiv = document.createElement('div');
      totalDiv.innerHTML = `<h4 class="mt-4">Total: ₹${total}</h4>`;
      cartContainer.appendChild(totalDiv);
    }

    cartContainer.addEventListener('click', e => {
      const row = e.target.closest('[data-index]');
      if (!row) return;
      const index = parseInt(row.dataset.index);
      let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

      if (e.target.classList.contains('remove-btn')) {
        cart.splice(index, 1);
      }

      if (e.target.classList.contains('qty-btn')) {
        const action = e.target.dataset.action;
        if (action === 'increase') cart[index].qty++;
        if (action === 'decrease' && cart[index].qty > 1) cart[index].qty--;
      }

      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      renderCart();
    });

    renderCart();
  }
});