'use strict';

/* ==================== UTILITY FUNCTIONS ==================== */
const addEventOnElements = (elements, eventType, callback) => {
  elements.forEach(element => element.addEventListener(eventType, callback));
};

const toggleClass = (element, className, condition) => {
  element.classList.toggle(className, condition);
};

/* ==================== FIREBASE INITIALIZATION ==================== */
const firebaseConfig = {
  apiKey: "AIzaSyBk0t-hj6Mh9-uZBVD7sul265VdCHJx44Y",
  authDomain: "user-data-835b4.firebaseapp.com",
  projectId: "user-data-835b4",
  storageBucket: "user-data-835b4.appspot.com",
  messagingSenderId: "1059286337115",
  appId: "1:1059286337115:web:97200ded630b5abc27a17e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

/* ==================== PRELOADER ==================== */
const preloader = document.querySelector("[data-preloader]");
window.addEventListener("DOMContentLoaded", () => {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});

/* ==================== NAVBAR TOGGLE ==================== */
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");
const navbar = document.querySelector("[data-navbar]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = () => {
  navbar.classList.toggle("active");
  navToggleBtn.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
};

addEventOnElements(navTogglers, "click", toggleNavbar);

/* ==================== HEADER SCROLL EFFECT ==================== */
const header = document.querySelector("[data-header]");
window.addEventListener("scroll", () => {
  toggleClass(header, "active", window.scrollY >= 100);
});

/* ==================== SLIDERS ==================== */
const initSlider = (slider) => {
  const container = slider.querySelector("[data-slider-container]");
  const prevBtn = slider.querySelector("[data-slider-prev]");
  const nextBtn = slider.querySelector("[data-slider-next]");
  
  let visibleItems = Number(getComputedStyle(slider).getPropertyValue("--slider-items"));
  let totalItems = container.childElementCount - visibleItems;
  let currentPos = 0;

  const moveSlider = () => {
    container.style.transform = `translateX(-${container.children[currentPos].offsetLeft}px)`;
  };

  const slideNext = () => {
    currentPos = currentPos >= totalItems ? 0 : currentPos + 1;
    moveSlider();
  };

  const slidePrev = () => {
    currentPos = currentPos <= 0 ? totalItems : currentPos - 1;
    moveSlider();
  };

  nextBtn.addEventListener("click", slideNext);
  prevBtn.addEventListener("click", slidePrev);

  slider.addEventListener("wheel", (e) => {
    if (e.shiftKey) e.deltaY > 0 ? slideNext() : slidePrev();
  });

  window.addEventListener("resize", () => {
    visibleItems = Number(getComputedStyle(slider).getPropertyValue("--slider-items"));
    totalItems = container.childElementCount - visibleItems;
    moveSlider();
  });

  if (totalItems <= 0) {
    nextBtn.style.display = 'none';
    prevBtn.style.display = 'none';
  }
};

document.querySelectorAll("[data-slider]").forEach(initSlider);

/* ==================== SUBSCRIPTION PLANS DATA ==================== */
const planPrices = {
  'Free': { 
    monthly: { price: '₹0', desc: 'Free forever' },
    yearly: { price: '₹0', desc: 'Free forever' }
  },
  'Standard': { 
    monthly: { price: '₹499', desc: 'Billed monthly' },
    yearly: { price: '₹4,999', desc: 'Save 17% (₹5,988)' }
  },
  'Premium': { 
    monthly: { price: '₹1,199', desc: 'Billed monthly' },
    yearly: { price: '₹11,999', desc: 'Save 16% (₹14,388)' }
  }
};

/* ==================== PAYMENT DASHBOARD ==================== */
const paymentDashboard = document.querySelector('.payment-dashboard');

function showPaymentDashboard(planName) {
  const plan = planPrices[planName];
  
  // Update plan info
  document.getElementById('selectedPlan').textContent = planName;
  document.getElementById('monthlyPrice').textContent = `${plan.monthly.price}/month`;
  document.getElementById('yearlyPrice').textContent = `${plan.yearly.price}/year`;
  
  // Set default to monthly
  updateBillingCycle('monthly', planName);
  
  // Show dashboard
  paymentDashboard.style.display = 'block';
  paymentDashboard.scrollIntoView({ behavior: 'smooth' });
  
  // Pre-fill email if logged in
  const user = auth.currentUser;
  if (user && user.email) {
    document.getElementById('email').value = user.email;
  }

  // Add click handlers for plan options
  setupPlanOptionListeners();
}

function setupPlanOptionListeners() {
  const planOptions = document.querySelectorAll('.plan-option');
  
  planOptions.forEach(option => {
    option.addEventListener('click', function() {
      const cycle = this.dataset.cycle;
      const planName = document.getElementById('selectedPlan').textContent;
      updateBillingCycle(cycle, planName);
    });
  });
}

function updateBillingCycle(cycle, planName) {
  const plan = planPrices[planName];
  
  // Update UI - remove active class from all first
  document.querySelectorAll('.plan-option').forEach(option => {
    option.classList.remove('active');
  });
  
  // Add active class to selected option
  document.querySelector(`.plan-option[data-cycle="${cycle}"]`).classList.add('active');
  
  // Update summary
  document.getElementById('selectedBilling').textContent = 
    cycle === 'monthly' ? 'Monthly' : 'Yearly';
  
  document.getElementById('totalAmount').textContent = 
    cycle === 'monthly' ? plan.monthly.price : plan.yearly.price;
}

/* ==================== AUTHENTICATION SYSTEM ==================== */
const authModal = document.getElementById('authModal');
const closeAuth = document.getElementById('closeAuth');
const showSignUp = document.getElementById('showSignUp');
const showSignIn = document.getElementById('showSignIn');
const signInForm = document.getElementById('signInForm');
const signUpForm = document.getElementById('signUpForm');
const signInMessage = document.getElementById('signInMessage');
const signUpMessage = document.getElementById('signUpMessage');

// Toggle auth modal
const toggleAuthModal = (show) => {
  if (show) {
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    authModal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

closeAuth.addEventListener('click', () => toggleAuthModal(false));

// Toggle between sign in and sign up
showSignUp.addEventListener('click', (e) => {
  e.preventDefault();
  signInForm.style.display = 'none';
  signUpForm.style.display = 'block';
  signInMessage.textContent = '';
  signInMessage.className = 'auth-message';
});

showSignIn.addEventListener('click', (e) => {
  e.preventDefault();
  signUpForm.style.display = 'none';
  signInForm.style.display = 'block';
  signUpMessage.textContent = '';
  signUpMessage.className = 'auth-message';
});

// Handle post-login redirect
const handlePostLoginRedirect = () => {
  const attemptedPlan = localStorage.getItem('attemptedPlan');
  if (attemptedPlan) {
    showPaymentDashboard(attemptedPlan);
    localStorage.removeItem('attemptedPlan');
  }
};

// Firebase Sign Up
document.getElementById('signUp').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupConfirm').value;
  const name = document.getElementById('signupName').value;
  
  // Validation
  if (password !== confirm) {
    signUpMessage.textContent = "Passwords don't match!";
    signUpMessage.className = 'auth-message error';
    return;
  }
  
  if (password.length < 6) {
    signUpMessage.textContent = "Password should be at least 6 characters";
    signUpMessage.className = 'auth-message error';
    return;
  }
  
  // Create user with Firebase
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return user.updateProfile({ displayName: name });
    })
    .then(() => {
      signUpMessage.textContent = "Account created! Please check your email to verify your account.";
      signUpMessage.className = 'auth-message success';
      return auth.currentUser.sendEmailVerification();
    })
    .then(() => {
      setTimeout(() => {
        toggleAuthModal(false);
        showPdfModal();
        handlePostLoginRedirect();
      }, 1500);
    })
    .catch((error) => {
      signUpMessage.textContent = error.message;
      signUpMessage.className = 'auth-message error';
    });
});

// Firebase Sign In
document.getElementById('signIn').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      
      if (!user.emailVerified) {
        signInMessage.textContent = "Please verify your email first. Check your inbox.";
        signInMessage.className = 'auth-message error';
        auth.signOut();
        return;
      }
      
      signInMessage.textContent = "Login successful!";
      signInMessage.className = 'auth-message success';
      
      setTimeout(() => {
        toggleAuthModal(false);
        handlePostLoginRedirect();
      }, 1500);
    })
    .catch((error) => {
      signInMessage.textContent = error.message;
      signInMessage.className = 'auth-message error';
    });
});

// Password reset
document.getElementById('forgotPassword')?.addEventListener('click', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  
  if (!email) {
    signInMessage.textContent = "Please enter your email first";
    signInMessage.className = 'auth-message error';
    return;
  }
  
  auth.sendPasswordResetEmail(email)
    .then(() => {
      signInMessage.textContent = "Password reset email sent! Check your inbox.";
      signInMessage.className = 'auth-message success';
    })
    .catch((error) => {
      signInMessage.textContent = error.message;
      signInMessage.className = 'auth-message error';
    });
});

/* ==================== SUBSCRIPTION BUTTONS ==================== */
function setupSubscriptionButtons() {
  const accessBtns = document.querySelectorAll('.access-btn');
  
  accessBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const user = auth.currentUser;
      const plan = this.dataset.plan;
      
      if (user && plan !== 'Free') {
        showPaymentDashboard(plan);
      } else if (plan !== 'Free') {
        toggleAuthModal(true);
        localStorage.setItem('attemptedPlan', plan);
      }
      // Free plan can proceed without payment dashboard
      return false;
    });
  });
}

/* ==================== PAYMENT FORM HANDLING ==================== */
function setupPaymentForm() {
  // Format card number input
  document.getElementById('cardNumber')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s+/g, '');
    if (value.length > 0) {
      value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
    }
    e.target.value = value;
  });

  // Format expiry date input
  document.getElementById('expiryDate')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
  });

  // Handle payment form submission
  document.getElementById('paymentForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payButton = document.getElementById('payButton');
    payButton.disabled = true;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const signInMessage = document.getElementById('signInMessage');
      signInMessage.textContent = "Payment successful! Your subscription is now active.";
      signInMessage.className = 'auth-message success';
      signInMessage.style.display = 'block';
      
      paymentDashboard.style.display = 'none';
      console.log("Subscription activated for:", document.getElementById('selectedPlan').textContent);
    } catch (error) {
      const signInMessage = document.getElementById('signInMessage');
      signInMessage.textContent = "Payment failed. Please try again or use a different card.";
      signInMessage.className = 'auth-message error';
      signInMessage.style.display = 'block';
    } finally {
      payButton.disabled = false;
    }
  });
}

/* ==================== USER DASHBOARD ==================== */
const userMenu = document.getElementById('userMenu');
const userAvatar = document.getElementById('userAvatar');
const avatarInitials = document.getElementById('avatarInitials');
const dropdownMenu = document.getElementById('dropdownMenu');
const logoutBtn = document.getElementById('logout');
const editProfileBtn = document.getElementById('editProfile');
const profileModal = document.getElementById('profileModal');
const closeProfile = document.getElementById('closeProfile');
const profileForm = document.getElementById('profileForm');

// Toggle dropdown menu
userAvatar.addEventListener('click', (e) => {
  e.stopPropagation();
  dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!userMenu.contains(e.target)) {
    dropdownMenu.style.display = 'none';
  }
});

// Logout function
logoutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    window.location.reload();
  }).catch((error) => {
    console.error("Logout error:", error);
  });
});

// Edit profile function
editProfileBtn.addEventListener('click', (e) => {
  e.preventDefault();
  dropdownMenu.style.display = 'none';
  toggleProfileModal(true);
  
  // Fill form with current user data
  const user = auth.currentUser;
  if (user) {
    document.getElementById('profileName').value = user.displayName || '';
    document.getElementById('profileEmail').value = user.email || '';
  }
});

// Toggle profile modal
const toggleProfileModal = (show) => {
  if (show) {
    profileModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  } else {
    profileModal.style.display = 'none';
    document.body.style.overflow = '';
    document.getElementById('profileMessage').textContent = '';
  }
};

// Update profile
profileForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('profileName').value;
  const password = document.getElementById('profilePassword').value;
  const confirm = document.getElementById('profileConfirm').value;
  const profileMessage = document.getElementById('profileMessage');
  
  // Validation
  if (password && password !== confirm) {
    profileMessage.textContent = "Passwords don't match!";
    profileMessage.className = 'auth-message error';
    return;
  }
  
  const user = auth.currentUser;
  const promises = [];
  
  // Update display name
  if (name !== user.displayName) {
    promises.push(user.updateProfile({ displayName: name }));
  }
  
  // Update password if provided
  if (password) {
    promises.push(user.updatePassword(password));
  }
  
  Promise.all(promises)
    .then(() => {
      profileMessage.textContent = "Profile updated successfully!";
      profileMessage.className = 'auth-message success';
      updateUserUI();
      
      setTimeout(() => {
        toggleProfileModal(false);
      }, 1500);
    })
    .catch((error) => {
      profileMessage.textContent = error.message;
      profileMessage.className = 'auth-message error';
    });
});

// Update UI based on auth state
const updateUserUI = () => {
  const user = auth.currentUser;
  if (user) {
    userMenu.style.display = 'block';
    const name = user.displayName || user.email;
    if (name) {
      const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
      avatarInitials.textContent = initials;
    }
  } else {
    userMenu.style.display = 'none';
  }
};

// Auth state listener
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User signed in:", user);
    updateUserUI();
  } else {
    console.log("User signed out");
    updateUserUI();
  }
});

/* ==================== PDF MODAL ==================== */
const pdfModal = document.getElementById('pdfModal');
const closePdf = document.getElementById('closePdf');

const showPdfModal = () => {
  pdfModal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

const hidePdfModal = () => {
  pdfModal.classList.remove('active');
  document.body.style.overflow = '';
};

closePdf.addEventListener('click', hidePdfModal);

pdfModal.addEventListener('click', (e) => {
  if (e.target === pdfModal) {
    hidePdfModal();
  }
});

/* ==================== INITIALIZATION ==================== */
document.addEventListener('DOMContentLoaded', function() {
  setupSubscriptionButtons();
  setupPaymentForm();
  
  // Close modal when clicking outside
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
      toggleAuthModal(false);
    }
  });
});