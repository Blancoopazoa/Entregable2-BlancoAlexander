function isUserLoggedIn() {
  return localStorage.getItem('isLoggedIn') === 'true';
}

function toggleSessionElements() {
  var loginContainer = document.getElementById('loginContainer');
  var productContainer = document.getElementById('productContainer');
  var cartContainer = document.getElementById('cartContainer');
  var logoutButton = document.getElementById('logoutButton');

  if (isUserLoggedIn()) {
    loginContainer.style.display = 'none';
    productContainer.style.display = 'block';
    cartContainer.style.display = 'block';
    logoutButton.style.display = 'block';
    loadCartFromLocalStorage();
  } else {
    loginContainer.style.display = 'block';
    productContainer.style.display = 'none';
    cartContainer.style.display = 'none';
    logoutButton.style.display = 'none';
  }
}

document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  if (username === 'Alexander' && password === '1234') {
    showModal('Inicio de sesión exitoso');
    showProductTable();
  } else {
    showModal('Usuario o contraseña incorrectos');
  }
});

var cartItems = [];

function addToCart(id, name, price, quantity) {
  var existingItem = cartItems.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    var newItem = {
      id: id,
      name: name,
      price: price,
      quantity: quantity
    };
    cartItems.push(newItem);
  }

  saveCartToLocalStorage();
  showCart();
  showModal('Producto agregado al carrito');
}

function showCart() {
  var cartTableBody = document.getElementById('cartTableBody');
  cartTableBody.innerHTML = '';

  cartItems.forEach(function(item) {
    var row = document.createElement('tr');

    var idCell = document.createElement('td');
    idCell.textContent = item.id;
    row.appendChild(idCell);

    var nameCell = document.createElement('td');
    nameCell.textContent = item.name;
    row.appendChild(nameCell);

    var priceCell = document.createElement('td');
    priceCell.textContent = item.price;
    row.appendChild(priceCell);

    var quantityCell = document.createElement('td');
    quantityCell.textContent = item.quantity;
    row.appendChild(quantityCell);

    var totalCell = document.createElement('td');
    totalCell.textContent = item.price * item.quantity;
    row.appendChild(totalCell);

    var deleteCell = document.createElement('td');
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.addEventListener('click', function() {
      removeCartItem(item.id);
    });
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);

    cartTableBody.appendChild(row);
  });
}

function showModal(message) {
  var modal = document.getElementById('myModal');
  var modalMessage = document.getElementById('modalMessage');
  modalMessage.innerHTML = message;

  modal.style.display = 'block';

  var closeButton = modal.getElementsByClassName('close')[0];
  closeButton.onclick = function() {
    modal.style.display = 'none';
  };

  var modalCloseButton = modal.getElementsByClassName('modal-close')[0];
  modalCloseButton.onclick = function() {
    modal.style.display = 'none';
  };

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
}

document.getElementById('payButton').addEventListener('click', function() {
  var total = calculateTotal();
  var cartContent = getCartContent();
  showModal('Compra exitosa<br><br>' + cartContent + '<br>Total: ' + total);

  // Limpiar el carrito de compra
  cartItems = [];
  saveCartToLocalStorage();
  showCart();
});

function calculateTotal() {
  var total = 0;
  for (var i = 0; i < cartItems.length; i++) {
    total += cartItems[i].price * cartItems[i].quantity;
  }
  return total;
}

function getCartContent() {
  var content = '';
  for (var i = 0; i < cartItems.length; i++) {
    content += 'Producto: ' + cartItems[i].name + '<br>';
    content += 'Cantidad: ' + cartItems[i].quantity + '<br>';
    content += 'Precio unitario: ' + cartItems[i].price + '<br>';
    content += 'Subtotal: ' + cartItems[i].price * cartItems[i].quantity + '<br><br>';
  }
  return content;
}

function saveCartToLocalStorage() {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function loadCartFromLocalStorage() {
  var savedCartItems = localStorage.getItem('cartItems');
  if (savedCartItems) {
    cartItems = JSON.parse(savedCartItems);
    showCart();
  }
}

function showProductTable() {
  var loginContainer = document.getElementById('loginContainer');
  var productContainer = document.getElementById('productContainer');
  var cartContainer = document.getElementById('cartContainer');

  loginContainer.style.display = 'none';
  productContainer.style.display = 'block';
  cartContainer.style.display = 'block';

  var productTableBody = document.getElementById('productTableBody');

  var products = [
    { id: 1, nombre: 'Leche', precio: 2.50 },
    { id: 2, nombre: 'Pan', precio: 1.00 },
    { id: 3, nombre: 'Huevos', precio: 3.50 },
    { id: 4, nombre: 'Arroz', precio: 2.00 },
    { id: 5, nombre: 'Azúcar', precio: 1.50 }
  ];

  for (var i = 0; i < products.length; i++) {
    var row = document.createElement('tr');
    var idCell = document.createElement('td');
    var nombreCell = document.createElement('td');
    var precioCell = document.createElement('td');
    var addButtonCell = document.createElement('td');
    var addButton = document.createElement('button');

    idCell.textContent = products[i].id;
    nombreCell.textContent = products[i].nombre;
    precioCell.textContent = '$' + products[i].precio.toFixed(2);
    addButton.textContent = 'Agregar';

    addButton.addEventListener('click', function() {
      var cantidad = prompt('Ingrese la cantidad:');
      if (cantidad !== null && cantidad !== '') {
        cantidad = parseInt(cantidad);
        if (!isNaN(cantidad) && cantidad > 0) {
          var producto = {
            id: this.parentNode.parentNode.cells[0].textContent,
            nombre: this.parentNode.parentNode.cells[1].textContent,
            precio: parseFloat(this.parentNode.parentNode.cells[2].textContent.substring(1))
          };
          addToCart(producto.id, producto.nombre, producto.precio, cantidad);
          showModal('Producto agregado: ' + producto.nombre + '\nCantidad: ' + cantidad);
        } else {
          showModal('Ingrese una cantidad válida.');
        }
      }
    });

    row.appendChild(idCell);
    row.appendChild(nombreCell);
    row.appendChild(precioCell);
    addButtonCell.appendChild(addButton);

    row.appendChild(addButtonCell);
    productTableBody.appendChild(row);
  }

  loadCartFromLocalStorage();
}

function removeCartItem(id) {
  cartItems = cartItems.filter(item => item.id !== id);
  saveCartToLocalStorage();
  showCart();
}

window.addEventListener('load', function() {
  loadCartFromLocalStorage();
  toggleSessionElements();

  showModal('¡Bienvenido! Por favor, inicia sesión.');

  var logoutButton = document.getElementById('logoutButton');
  logoutButton.addEventListener('click', function() {
    localStorage.setItem('isLoggedIn', 'false');
    toggleSessionElements();
    cartItems = [];
    saveCartToLocalStorage();
  });
});