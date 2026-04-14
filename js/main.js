const loginToggle = document.getElementById('login-toggle');
const loginPanel = document.getElementById('login-panel');

if (loginToggle && loginPanel) {
  loginToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = loginPanel.classList.toggle('open');
    loginPanel.setAttribute('aria-hidden', String(!isOpen));
    loginToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', function (e) {
    if (!loginPanel.contains(e.target) && e.target !== loginToggle && loginPanel.classList.contains('open')) {
      loginPanel.classList.remove('open');
      loginPanel.setAttribute('aria-hidden', 'true');
      loginToggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && loginPanel.classList.contains('open')) {
      loginPanel.classList.remove('open');
      loginPanel.setAttribute('aria-hidden', 'true');
      loginToggle.setAttribute('aria-expanded', 'false');
      loginToggle.focus();
    }
  });
}

const AUTH_USER = 'admin';
const AUTH_PASS = 'admin123';
const SECRET_USER = 'shadow';
const SECRET_PASS = 'ghost321';
const ROLE_KEY = 'securoserv-role';
let currentUser = localStorage.getItem('securoserv-user') || '';
let currentRole = localStorage.getItem(ROLE_KEY) || '';
let isLoggedIn = currentRole !== '';

function updateLoginState() {
  const loginInfo = document.querySelector('.login-info');
  const logoutButton = document.getElementById('logout-button');
  if (loginToggle) {
    if (currentRole === 'admin') {
      loginToggle.textContent = `${currentUser} (admin conectado)`;
    } else if (currentRole === 'secret') {
      loginToggle.textContent = `${currentUser} (conectado)`;
    } else {
      loginToggle.textContent = 'Iniciar sesión';
    }
  }
  if (loginInfo) {
    if (currentRole === 'admin') {
      loginInfo.innerHTML = 'Sesión iniciada como admin. Usuario secreto: shadow • Contraseña: ghost321';
    } else if (currentRole === 'secret') {
      loginInfo.textContent = 'Sesión iniciada como usuario secreto.';
    } else {
      loginInfo.innerHTML = 'Usuario: admin • Contraseña: admin123<br>Usuario secreto: shadow • Contraseña: ghost321';
    }
  }
  if (logoutButton) {
    logoutButton.classList.toggle('hidden', !isLoggedIn);
  }
  if (isLoggedIn) {
    localStorage.setItem('securoserv-user', currentUser);
    localStorage.setItem(ROLE_KEY, currentRole);
  } else {
    localStorage.removeItem('securoserv-user');
    localStorage.removeItem(ROLE_KEY);
  }
}

updateLoginState();

function resolveJSONPath(relativePath) {
  try {
    return new URL(relativePath, window.location.href).href;
  } catch (error) {
    return relativePath;
  }
}

function fetchJSON(relativePath, fallbackData) {
  const url = resolveJSONPath(relativePath);
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudo cargar JSON');
      }
      return response.json();
    })
    .catch(() => {
      if (fallbackData !== undefined) {
        return fallbackData;
      }
      return Promise.reject(new Error('No se pudo cargar JSON'));
    });
}

function ensureNotificationContainer() {
  let container = document.getElementById('notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    document.body.appendChild(container);
  }
  return container;
}

function showNotification(message, type = 'success') {
  const container = ensureNotificationContainer();
  container.textContent = message;
  container.className = type === 'success' ? 'success-message notification-container' : 'error-message notification-container';
  window.setTimeout(() => {
    container.textContent = '';
    container.className = 'notification-container';
  }, 4500);
}

function createFormMessage(form, message, type) {
  clearFormMessages(form);
  const messageElement = document.createElement('div');
  messageElement.className = type === 'success' ? 'success-message' : 'error-message';
  messageElement.textContent = message;
  messageElement.setAttribute('role', 'status');
  form.appendChild(messageElement);
}

function clearFormMessages(form) {
  form.querySelectorAll('.success-message, .error-message').forEach(node => node.remove());
}

document.querySelectorAll('.contenido nav a').forEach(function (link) {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    var href = this.getAttribute('href');
    var toggle = document.getElementById('toggle-menu');
    if (toggle) toggle.checked = false;
    window.location.href = href;
  });
});

const floatBadge = document.getElementById('float-badge');
const backTop = document.getElementById('back-to-top');

if (floatBadge) {
  floatBadge.addEventListener('click', function () {
    showNotification('Oferta especial: consulta nuestros servicios y recibe asesoría personalizada.', 'success');
  });
}

window.addEventListener('scroll', function () {
  if (!backTop) return;
  if (window.scrollY > 300) backTop.classList.add('show'); else backTop.classList.remove('show');
});

if (backTop) {
  backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function (e) {
    if (this.id === 'login-form') return;

    const inputs = this.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = '#ff4d4f';
        isValid = false;
      } else {
        input.style.borderColor = '';
      }
    });

    if (!isValid) {
      e.preventDefault();
      createFormMessage(this, 'Por favor, completa todos los campos requeridos', 'error');
      return;
    }

    e.preventDefault();
    const dateText = window.dayjs ? dayjs().format('DD/MM/YYYY') : '';
    createFormMessage(this, `Gracias por tu mensaje. Se envió correctamente ${dateText}`.trim(), 'success');
    this.reset();
  });

  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', function () {
      if (this.value.trim()) {
        this.style.borderColor = '';
      }
    });
  });
});

const loginForm = document.getElementById('login-form');
const loginUserInput = document.getElementById('user');
const loginPassInput = document.getElementById('pass');
if (loginForm && loginUserInput && loginPassInput) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = loginUserInput.value.trim();
    const password = loginPassInput.value;

    if (username === AUTH_USER && password === AUTH_PASS) {
      currentUser = AUTH_USER;
      currentRole = 'admin';
      isLoggedIn = true;
      updateLoginState();
      createFormMessage(loginForm, 'Sesión iniciada como admin.', 'success');
      if (loginPanel) {
        loginPanel.classList.remove('open');
        loginPanel.setAttribute('aria-hidden', 'true');
        loginToggle.setAttribute('aria-expanded', 'false');
      }
      loginForm.reset();
      return;
    }

    if (username === SECRET_USER && password === SECRET_PASS) {
      currentUser = SECRET_USER;
      currentRole = 'secret';
      isLoggedIn = true;
      updateLoginState();
      createFormMessage(loginForm, 'Sesión iniciada como usuario secreto.', 'success');
      if (loginPanel) {
        loginPanel.classList.remove('open');
        loginPanel.setAttribute('aria-hidden', 'true');
        loginToggle.setAttribute('aria-expanded', 'false');
      }
      loginForm.reset();
      return;
    }

    createFormMessage(loginForm, 'Usuario o contraseña incorrectos.', 'error');
  });
}

document.querySelectorAll('.faq article').forEach(article => {
  const title = article.querySelector('h4');
  if (title) {
    title.style.cursor = 'pointer';
    title.style.userSelect = 'none';
    const content = article.querySelector('p');
    const isOpen = article.classList.contains('open');
    
    if (!isOpen && content) {
      content.style.maxHeight = '0';
      content.style.overflow = 'hidden';
      content.style.transition = 'max-height 0.3s ease';
    }

    title.addEventListener('click', function () {
      if (content) {
        if (article.classList.contains('open')) {
          article.classList.remove('open');
          content.style.maxHeight = '0';
        } else {
          article.classList.add('open');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      }
    });
  }
});

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  
  question.addEventListener('click', function() {
    faqItems.forEach(otherItem => {
      if (otherItem !== item && otherItem.classList.contains('active')) {
        otherItem.classList.remove('active');
      }
    });
    
    item.classList.toggle('active');
  });
});

function getFormattedDate() {
  const date = new Date();
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function loadServiceCards() {
  const serviceCards = document.getElementById('service-cards');
  if (!serviceCards) return;

  const fallbackServices = [
    {
      icon: '🛡️',
      title: 'Monitoreo 24/7',
      description: 'Vigilancia continua con alertas en tiempo real y respuesta inmediata.',
      details: 'Incluye instalación, mantenimiento y supervisión remota de todos los dispositivos.'
    },
    {
      icon: '📹',
      title: 'Cámaras de seguridad',
      description: 'Sistemas CCTV de alta definición para interior y exterior.',
      details: 'Cámaras con visión nocturna y grabación en la nube para mayor protección.'
    }
  ];

  fetchJSON('../data/servicios.json', fallbackServices)
    .then(services => {
      services.forEach(service => {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
          <div class="card-icon">${service.icon}</div>
          <h4>${service.title}</h4>
          <p>${service.description}</p>
          <p>${service.details}</p>
        `;
        serviceCards.appendChild(card);
      });
    })
    .catch(() => {
      const errorMessage = document.createElement('p');
      errorMessage.className = 'error-message';
      errorMessage.textContent = 'No se pudieron cargar los servicios desde el archivo JSON.';
      serviceCards.appendChild(errorMessage);
    });
}

const PLAN_STORAGE_KEY = 'securoserv-cart-v1';
let cart = JSON.parse(localStorage.getItem(PLAN_STORAGE_KEY) || '[]');
let selectedPlanId = null;
let selectedPlanName = '';

function saveCart() {
  localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(cart));
}

function calculateCartTotals() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCart() {
  const cartWidgetSummary = document.getElementById('cart-widget-summary');
  const cartWidgetItems = document.getElementById('cart-widget-items');

  if (!cartWidgetSummary || !cartWidgetItems) return;

  if (cart.length === 0) {
    cartWidgetSummary.innerHTML = '<p>Carrito vacío.</p>';
    cartWidgetItems.innerHTML = '<p>No hay elementos en el carrito.</p>';
    return;
  }

  const total = calculateCartTotals();
  cartWidgetSummary.innerHTML = `<p><strong>Total:</strong> $${total.toFixed(2)}</p>`;
  cartWidgetItems.innerHTML = '';

  cart.forEach(item => {
    const itemCard = document.createElement('div');
    itemCard.className = 'cart-item';
    itemCard.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <p>${item.priceDisplay} x ${item.quantity}</p>
        <button class="remove-btn btn-secondary" data-id="${item.id}">Remover</button>
      </div>
    `;
    cartWidgetItems.appendChild(itemCard);
  });
}

function addPlanToCart(plan) {
  const existing = cart.find(item => item.id === plan.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...plan, quantity: 1 });
  }
  saveCart();
  renderCart();
  showNotification(`${plan.name} agregado al carrito.`, 'success');
}

function addOrReplacePlanToCart(plan) {
  cart = cart.filter(item => item.type !== 'plan');
  cart.push({ ...plan, quantity: 1, type: 'plan' });
  saveCart();
  renderCart();
}

function removeFromCart(planId) {
  cart = cart.filter(item => item.id !== planId);
  saveCart();
  renderCart();
}

function loadPlanProducts() {
  const planList = document.getElementById('plan-list');
  if (!planList) return;

  const fallbackPlans = [
    {
      id: 'basico',
      name: 'Plan Básico',
      price: 12000,
      priceDisplay: '$12.000/mes',
      description: 'Monitoreo esencial para pequeñas oficinas y comercios.',
      features: ['Monitoreo 24/7', 'Alertas por aplicación móvil', 'Configuración remota']
    },
    {
      id: 'profesional',
      name: 'Plan Profesional',
      price: 29000,
      priceDisplay: '$29.000/mes',
      description: 'Incluye instalación y visitas técnicas periódicas.',
      features: ['Instalación incluida', 'Mantenimiento mensual', 'Soporte básico']
    },
    {
      id: 'corporativo',
      name: 'Plan Corporativo',
      price: 59000,
      priceDisplay: '$59.000/mes',
      description: 'Soluciones personalizadas con soporte prioritario.',
      features: ['Auditoría de seguridad', 'Soporte prioritario', 'Actualizaciones tecnológicas']
    },
    {
      id: 'premium',
      name: 'Plan Premium',
      price: 99000,
      priceDisplay: '$99.000/mes',
      description: 'Todo incluido, equipo dedicado y mantenimiento avanzado.',
      features: ['Equipo dedicado', 'Actualizaciones automáticas', 'Garantía extendida']
    }
  ];

  fetchJSON('../data/planes.json', fallbackPlans)
    .then(plans => {
      planList.innerHTML = '';
      plans.forEach(plan => {
        const card = document.createElement('article');
        card.className = 'card';
        const features = plan.features.map(feature => `<li>${feature}</li>`).join('');
        card.innerHTML = `
          <h4>${plan.name}</h4>
          <p>${plan.description}</p>
          <p><strong>${plan.priceDisplay}</strong></p>
          <ul>${features}</ul>
          <button type="button" class="btn-primary add-plan" data-id="${plan.id}">Añadir al carrito</button>
        `;
        planList.appendChild(card);
      });

      planList.querySelectorAll('.add-plan').forEach(button => {
        button.addEventListener('click', function () {
          const planId = this.dataset.id;
          const selectedPlan = plans.find(plan => plan.id === planId);
          if (selectedPlan) {
            addPlanToCart(selectedPlan);
          }
        });
      });
    })
    .catch(() => {
      planList.innerHTML = '<p class="error-message">No se pudieron cargar los planes en este momento.</p>';
    });
}

function renderSelectedPlan() {
  const summary = document.getElementById('selected-plan-summary');
  if (!summary) return;
  if (!selectedPlanId) {
    summary.textContent = 'No hay plan seleccionado.';
    return;
  }
  summary.textContent = `Plan seleccionado: ${selectedPlanName}.`;
}

function loadPlanSelection() {
  const planSelection = document.getElementById('plan-selection');
  if (!planSelection) return;

  const fallbackPlans = [
    {
      id: 'basico',
      name: 'Plan Básico',
      priceDisplay: '$12.000/mes'
    },
    {
      id: 'profesional',
      name: 'Plan Profesional',
      priceDisplay: '$29.000/mes'
    },
    {
      id: 'corporativo',
      name: 'Plan Corporativo',
      priceDisplay: '$59.000/mes'
    },
    {
      id: 'premium',
      name: 'Plan Premium',
      priceDisplay: '$99.000/mes'
    }
  ];

  fetchJSON('../data/planes.json', fallbackPlans)
    .then(plans => {
      planSelection.innerHTML = '';
      plans.forEach(plan => {
        const featureList = plan.features ? `<ul>${plan.features.map(feature => `<li>${feature}</li>`).join('')}</ul>` : '';
        const option = document.createElement('div');
        option.className = 'plan-option';
        option.innerHTML = `
          <label>
            <input type="radio" name="selected-plan" value="${plan.id}">
            <span>${plan.name}</span>
          </label>
          <div class="plan-meta">
            <strong>${plan.priceDisplay}</strong>
          </div>
          <div class="plan-details hidden" id="plan-details-${plan.id}">
            <p>${plan.description || 'Más información sobre el plan.'}</p>
            ${featureList}
          </div>
          <button type="button" class="btn-outline plan-info-toggle" data-id="${plan.id}">Más info</button>
        `;
        planSelection.appendChild(option);
      });

      planSelection.querySelectorAll('input[name="selected-plan"]').forEach(input => {
        input.addEventListener('change', function () {
          if (!isLoggedIn) {
            showNotification('Debes iniciar sesión como admin para comprar.', 'error');
            this.checked = false;
            return;
          }
          const selected = plans.find(plan => plan.id === this.value);
          if (selected) {
            selectedPlanId = selected.id;
            selectedPlanName = selected.name;
            addOrReplacePlanToCart(selected);
            renderSelectedPlan();
          }
        });
      });

      planSelection.querySelectorAll('.plan-info-toggle').forEach(button => {
        button.addEventListener('click', function () {
          const details = document.getElementById(`plan-details-${this.dataset.id}`);
          if (details) {
            details.classList.toggle('hidden');
            this.textContent = details.classList.contains('hidden') ? 'Más info' : 'Menos info';
          }
        });
      });

      renderSelectedPlan();
    })
    .catch(() => {
      planSelection.innerHTML = '<p class="error-message">No se pudo cargar la lista de planes.</p>';
    });
}

function loadProductCatalog() {
  const productList = document.getElementById('product-list');
  if (!productList) return;

  const fallbackProducts = [
    {
      id: 'kit-cctv-4',
      name: 'Kit CCTV 4 cámaras',
      price: 24900,
      priceDisplay: '$24.900',
      description: 'Sistema completo para cobertura integral de áreas críticas.',
      image: 'https://dummyimage.com/400x250/ffffff/000000.png&text=Kit+CCTV+4',
      features: ['4 cámaras HD', 'Grabación 7 días en disco duro', 'Acceso remoto por app']
    },
    {
      id: 'camara-ip-1080',
      name: 'Cámara IP 1080p',
      price: 7900,
      priceDisplay: '$7.900',
      description: 'Cámara de alta definición con visión nocturna y detección de movimiento.',
      image: 'https://dummyimage.com/400x250/ffffff/000000.png&text=C%C3%A1mara+IP+1080p',
      features: ['Resolución Full HD', 'Visión nocturna infrarroja', 'Notificaciones al celular']
    },
    {
      id: 'sensor-movimiento',
      name: 'Sensor de movimiento',
      price: 3900,
      priceDisplay: '$3.900',
      description: 'Sensor inalámbrico para detección de intrusos y zonas protegidas.',
      image: 'https://dummyimage.com/400x250/ffffff/000000.png&text=Sensor+Movimiento',
      features: ['Alcance 12 metros', 'Batería de larga duración', 'Integración con alarmas']
    },
    {
      id: 'videoportero',
      name: 'Videoportero inteligente',
      price: 12900,
      priceDisplay: '$12.900',
      description: 'Control de acceso con pantalla, cámara y comunicación bidireccional.',
      image: 'https://dummyimage.com/400x250/ffffff/000000.png&text=Videoportero+Inteligente',
      features: ['Pantalla táctil', 'Conexión Wi-Fi', 'Acceso remoto desde app']
    }
  ];

  fetchJSON('../data/productos.json', fallbackProducts)
    .then(products => {
      productList.innerHTML = '';
      products.forEach(product => {
        const card = document.createElement('article');
        card.className = 'card';
        const features = product.features.map(feature => `<li>${feature}</li>`).join('');
        const productImage = product.image ? `<img src="${product.image}" alt="${product.name}" class="product-image">` : '';
        card.innerHTML = `
          ${productImage}
          <h4>${product.name}</h4>
          <p>${product.description}</p>
          <p><strong>${product.priceDisplay}</strong></p>
          <ul>${features}</ul>
          <button type="button" class="btn-primary add-product" data-id="${product.id}">Comprar</button>
        `;
        productList.appendChild(card);
      });

      productList.querySelectorAll('.add-product').forEach(button => {
        button.addEventListener('click', function () {
          if (!isLoggedIn) {
            showNotification('Debes iniciar sesión como admin para comprar.', 'error');
            return;
          }
          const productId = this.dataset.id;
          const selectedProduct = products.find(product => product.id === productId);
          if (selectedProduct) {
            addPlanToCart(selectedProduct);
          }
        });
      });
    })
    .catch(() => {
      productList.innerHTML = '<p class="error-message">No se pudieron cargar los productos en este momento.</p>';
    });
}

function toggleCartPopover() {
  const popover = document.getElementById('cart-popover');
  if (!popover) return;
  popover.classList.toggle('hidden');
}

function closeCartPopover() {
  document.getElementById('cart-popover')?.classList.add('hidden');
}

function initCartEvents() {
  const cartToggleButton = document.getElementById('cart-toggle-button');
  const closeCartButton = document.getElementById('popover-close');
  const cartItemsContainer = document.getElementById('popover-cart-items');
  const cartWidgetItems = document.getElementById('cart-widget-items');
  const checkoutButton = document.getElementById('checkout-button');

  if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', function (event) {
      if (event.target.matches('.remove-item')) {
        const planId = event.target.dataset.id;
        removeFromCart(planId);
        showNotification('Producto removido del carrito.', 'success');
      }
    });
  }

  if (cartWidgetItems) {
    cartWidgetItems.addEventListener('click', function (event) {
      if (event.target.matches('.remove-btn')) {
        const planId = event.target.dataset.id;
        removeFromCart(planId);
        showNotification('Producto removido del carrito.', 'success');
      }
    });
  }

  if (cartToggleButton) {
    cartToggleButton.addEventListener('click', function (event) {
      event.stopPropagation();
      toggleCartPopover();
    });
  }

  if (closeCartButton) {
    closeCartButton.addEventListener('click', closeCartPopover);
  }

  document.addEventListener('click', function (event) {
    const popover = document.getElementById('cart-popover');
    const button = document.getElementById('cart-toggle-button');
    if (!popover || !button) return;
    if (!popover.contains(event.target) && event.target !== button) {
      closeCartPopover();
    }
  });

  if (checkoutButton) {
    checkoutButton.addEventListener('click', function () {
      if (!isLoggedIn) {
        showNotification('Debes iniciar sesión como admin para pagar.', 'error');
        return;
      }
      if (cart.length === 0) {
        showNotification('El carrito está vacío. Agrega un plan antes de pagar.', 'error');
        return;
      }
      showPaymentPanel();
    });
  }
}

function showPaymentPanel() {
  const paymentPanel = document.getElementById('payment-panel');
  if (paymentPanel) {
    paymentPanel.classList.remove('hidden');
  }
}

function hidePaymentPanel() {
  const paymentPanel = document.getElementById('payment-panel');
  if (paymentPanel) {
    paymentPanel.classList.add('hidden');
  }
}

function resetPaymentFields() {
  ['card-number', 'card-name', 'expiry-date', 'cvv'].forEach(id => {
    const input = document.getElementById(id);
    if (input) input.value = '';
  });
}

function completePurchase(method) {
  const total = calculateCartTotals();
  const planText = selectedPlanName ? ` y ${selectedPlanName}` : '';
  cart = [];
  saveCart();
  renderCart();
  hidePaymentPanel();
  resetPaymentFields();
  createFormMessage(document.body, `Pago ${method} por $${total.toFixed(2)}${planText} confirmado el ${getFormattedDate()}.`, 'success');
}

function initPaymentEvents() {
  const processPaymentButton = document.getElementById('process-payment-button');
  const payWithoutCardButton = document.getElementById('pay-without-card-button');
  const logoutButton = document.getElementById('logout-button');

  if (processPaymentButton) {
    processPaymentButton.addEventListener('click', function () {
      const number = document.getElementById('card-number')?.value.trim();
      const name = document.getElementById('card-name')?.value.trim();
      const expiry = document.getElementById('expiry-date')?.value.trim();
      const cvv = document.getElementById('cvv')?.value.trim();

      if (!number || !name || !expiry || !cvv) {
        showNotification('Completa todos los datos de la tarjeta para procesar el pago.', 'error');
        return;
      }
      completePurchase('con tarjeta');
    });
  }

  if (payWithoutCardButton) {
    payWithoutCardButton.addEventListener('click', function () {
      completePurchase('sin tarjeta');
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', function () {
      currentUser = '';
      currentRole = '';
      isLoggedIn = false;
      updateLoginState();
      hidePaymentPanel();
      showNotification('Sesión cerrada.', 'success');
    });
  }

  const closePaymentPanelButton = document.getElementById('close-payment-panel');
  if (closePaymentPanelButton) {
    closePaymentPanelButton.addEventListener('click', hidePaymentPanel);
  }
}

loadServiceCards();
loadPlanProducts();
loadProductCatalog();
loadPlanSelection();
renderCart();
initCartEvents();
initPaymentEvents();

const secretTrigger = document.querySelector('.brand') || document.getElementById('logo');
if (secretTrigger) {
  secretTrigger.style.cursor = 'pointer';
  secretTrigger.title = 'Haz doble clic aquí para acceder a la página secreta';
  secretTrigger.addEventListener('dblclick', function () {
    if (currentRole === 'secret') {
      window.location.href = 'pages/secreto.html';
    }
  });
}

const SECRET_CART_KEY = 'securoserv-secret-cart-v1';
let secretCart = JSON.parse(localStorage.getItem(SECRET_CART_KEY) || '[]');

function saveSecretCart() {
  localStorage.setItem(SECRET_CART_KEY, JSON.stringify(secretCart));
}

function calculateSecretCartTotals() {
  return secretCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderSecretCart() {
  const cartSummary = document.getElementById('secret-cart-summary');
  const cartItems = document.getElementById('secret-cart-items');

  if (!cartSummary || !cartItems) return;

  if (secretCart.length === 0) {
    cartSummary.innerHTML = '<p>Carrito vacío.</p>';
    cartItems.innerHTML = '<p>No hay elementos en el carrito.</p>';
    return;
  }

  const total = calculateSecretCartTotals();
  cartSummary.innerHTML = `<p><strong>Total:</strong> USD ${total.toFixed(2)}</p>`;
  cartItems.innerHTML = '';

  secretCart.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
        <button class="remove-btn btn-secondary" data-id="${item.id}">Remover</button>
      </div>
    `;
    cartItems.appendChild(itemDiv);
  });
}

function addToSecretCart(item) {
  const existing = secretCart.find(cartItem => cartItem.id === item.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    secretCart.push({ ...item, quantity: 1 });
  }
  saveSecretCart();
  renderSecretCart();
  showNotification(`${item.name} agregado al carrito.`, 'success');
}

function removeFromSecretCart(itemId) {
  secretCart = secretCart.filter(item => item.id !== itemId);
  saveSecretCart();
  renderSecretCart();
}

function initSecretCartEvents() {
  document.querySelectorAll('.add-weapon').forEach(button => {
    button.addEventListener('click', function () {
      const item = {
        id: this.dataset.id,
        name: this.dataset.name,
        price: parseFloat(this.dataset.price)
      };
      addToSecretCart(item);
    });
  });

  document.querySelectorAll('.add-plan').forEach(button => {
    button.addEventListener('click', function () {
      const item = {
        id: this.dataset.id,
        name: this.dataset.name,
        price: parseFloat(this.dataset.price)
      };
      addToSecretCart(item);
    });
  });

  document.querySelectorAll('.add-box').forEach(button => {
    button.addEventListener('click', function () {
      const item = {
        id: this.dataset.id,
        name: this.dataset.name,
        price: parseFloat(this.dataset.price)
      };
      addToSecretCart(item);
    });
  });

  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('remove-btn')) {
      const itemId = e.target.dataset.id;
      removeFromSecretCart(itemId);
    }
  });

  const checkoutButton = document.getElementById('checkout-secret');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', function () {
      if (secretCart.length === 0) {
        showNotification('El carrito está vacío.', 'error');
        return;
      }
      showSecretPaymentPanel();
    });
  }

  const closePaymentButton = document.getElementById('close-secret-payment');
  if (closePaymentButton) {
    closePaymentButton.addEventListener('click', hideSecretPaymentPanel);
  }

  const paymentForm = document.getElementById('secret-payment-form');
  if (paymentForm) {
    paymentForm.addEventListener('submit', function (e) {
      e.preventDefault();
      processSecretPurchase('con tarjeta');
    });
  }

  const payWithoutCardButton = document.getElementById('secret-pay-without-card');
  if (payWithoutCardButton) {
    payWithoutCardButton.addEventListener('click', function () {
      processSecretPurchase('sin tarjeta');
    });
  }
}

function processSecretPurchase(method) {
  const total = calculateSecretCartTotals();
  if (total <= 0) {
    showNotification('El carrito está vacío.', 'error');
    return;
  }
  secretCart = [];
  saveSecretCart();
  renderSecretCart();
  hideSecretPaymentPanel();
  showNotification(`Compra confirmada por USD ${total.toFixed(2)} (${method}).`, 'success');
  const paymentForm = document.getElementById('secret-payment-form');
  if (paymentForm) {
    paymentForm.reset();
  }
}

function showSecretPaymentPanel() {
  const panel = document.getElementById('secret-payment-panel');
  if (panel) {
    panel.style.display = 'block';
  }
}

function hideSecretPaymentPanel() {
  const panel = document.getElementById('secret-payment-panel');
  if (panel) {
    panel.style.display = 'none';
  }
}

if (window.location.pathname.includes('secreto')) {
  if (currentRole !== 'secret') {
    window.location.href = '../index.html';
  } else {
    renderSecretCart();
    initSecretCartEvents();
  }
}