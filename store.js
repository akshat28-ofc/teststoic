'use strict';


// Cart functionality
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const addToCartButtons = document.querySelectorAll('.cart-btn');
const buyButtons = document.querySelectorAll('.buy-btn');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Toggle cart modal
cartIcon.addEventListener('click', () => {
  cartModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  renderCartItems();
});

closeCart.addEventListener('click', () => {
  cartModal.classList.remove('active');
  document.body.style.overflow = '';
});

// Close modal when clicking outside
cartModal.addEventListener('click', (e) => {
  if (e.target === cartModal) {
    cartModal.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Add to cart functionality
addToCartButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const productCard = e.target.closest('.product-card');
    const product = {
      id: productCard.dataset.id || Math.random().toString(36).substr(2, 9),
      title: productCard.querySelector('.product-title').textContent,
      price: parseFloat(productCard.querySelector('.product-price').textContent.replace('$', '')),
      image: productCard.querySelector('.product-image img').src,
      quantity: 1
    };
    
    addToCart(product);
  });
});

// Buy now functionality
buyButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const productCard = e.target.closest('.product-card');
    const product = {
      id: productCard.dataset.id || Math.random().toString(36).substr(2, 9),
      title: productCard.querySelector('.product-title').textContent,
      price: parseFloat(productCard.querySelector('.product-price').textContent.replace('$', '')),
      image: productCard.querySelector('.product-image img').src,
      quantity: 1
    };
    
    // Empty cart and add this product
    cart = [product];
    updateCart();
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderCartItems();
  });
});

// Add product to cart
function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(product);
  }
  
  updateCart();
  
  // Show a quick confirmation
  const confirmation = document.createElement('div');
  confirmation.textContent = `${product.title} added to cart`;
  confirmation.style.position = 'fixed';
  confirmation.style.bottom = '20px';
  confirmation.style.right = '20px';
  confirmation.style.backgroundColor = 'var(--accent)';
  confirmation.style.color = 'white';
  confirmation.style.padding = '10px 20px';
  confirmation.style.borderRadius = '5px';
  confirmation.style.zIndex = '1000';
  confirmation.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  document.body.appendChild(confirmation);
  
  setTimeout(() => {
    confirmation.style.opacity = '0';
    confirmation.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
      document.body.removeChild(confirmation);
    }, 500);
  }, 2000);
}

// Update cart in localStorage and UI
function updateCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
}

// Update cart count in header
function updateCartCount() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;
}

// Render cart items in modal
function renderCartItems() {
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart-message">
        <p>Your cart is empty</p>
      </div>
    `;
    cartTotal.textContent = '$0.00';
    return;
  }
  
  cartItemsContainer.innerHTML = '';
  
  let total = 0;
  
  cart.forEach(item => {
    total += item.price * item.quantity;
    
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.title}">
      </div>
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.title}</h4>
        <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
      </div>
      <div class="cart-item-remove" data-id="${item.id}">
        <ion-icon name="trash-outline"></ion-icon>
      </div>
    `;
    
    cartItemsContainer.appendChild(cartItem);
  });
  
  // Add event listeners to remove buttons
  document.querySelectorAll('.cart-item-remove').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      removeFromCart(id);
    });
  });
  
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Remove item from cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

// Checkout functionality
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) return;
  
  // In a real implementation, this would redirect to a checkout page
  alert('Proceeding to checkout!');
  cart = [];
  updateCart();
  cartModal.classList.remove('active');
  document.body.style.overflow = '';
});

// Initialize cart count on page load
updateCartCount();

// Search functionality
const searchToggleBtn = document.getElementById('mobileSearchToggle');
const searchContainer = document.getElementById('searchContainer');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

searchToggleBtn.addEventListener('click', () => {
  searchContainer.classList.toggle('show');
});

searchBtn.addEventListener('click', () => {
  performSearch();
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    performSearch();
  }
});

function performSearch() {
  const query = searchInput.value.toLowerCase();
  if (query.trim() === '') return;
  
  // In a real implementation, this would filter products or make an API call
  alert(`Searching for: ${query}`);
}

// Filter functionality
const filterBtn = document.getElementById('filterBtn');
const filterDropdown = document.getElementById('filterDropdown');

filterBtn.addEventListener('click', () => {
  filterDropdown.classList.toggle('show');
});

// Close filter dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!filterBtn.contains(e.target) && !filterDropdown.contains(e.target)) {
    filterDropdown.classList.remove('show');
  }
});

// Filter checkboxes
document.querySelectorAll('.filter-option input').forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    // In a real implementation, this would filter products
    console.log('Filter changed');
  });
});