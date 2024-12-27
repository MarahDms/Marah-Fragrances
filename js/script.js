$(document).ready(function () {
    const apiURL = 'https://jsonplaceholder.typicode.com/posts';
    const images = [
        'images/versace.png',
        'images/rodriguez.png',
        'images/carlton.png',
        'images/chanel.png',
        'images/julliette.png',
        'images/burberry.png',
        'images/jeanpaul.png',
        'images/gucci.png',
        'images/ysl.png',
        'images/armani.png'
    ];

    let allPerfumes = [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartCount() {
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        $('#cart-item-count').text(itemCount);
    }

    function showCustomAlert(message) {
        const alertBox = $('<div>').addClass('custom-alert').text(message);
        $('body').append(alertBox);
        setTimeout(() => alertBox.addClass('show'), 10);
        setTimeout(() => {
            alertBox.removeClass('show');
            setTimeout(() => alertBox.remove(), 500);
        }, 3000);
    }

    function addToCart(id, name, price) {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        saveCart();
        updateCartCount();
        showCustomAlert(`${name} has been added to the cart.`);
    }

    function removeItemFromCart(id) {
        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            cart[itemIndex].quantity--;
            if (cart[itemIndex].quantity === 0) {
                cart.splice(itemIndex, 1);
            }
        }
        saveCart();
        updateCartCount();
        renderCartItems();
    }

    function renderCartItems() {
        const $cartItems = $('#cart-items');
        $cartItems.empty();

        if (cart.length === 0) {
            $cartItems.append('<li>Your cart is empty.</li>');
            return;
        }

        cart.forEach(item => {
            const $item = $(`
                <li>
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; margin-right: 10px;">
                    ${item.name} - $${item.price.toFixed(2)} x ${item.quantity}
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </li>
            `);
            $cartItems.append($item);
        });
    }

    function buyNow() {
        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }
        alert('You have purchased the items!');
        cart = [];
        saveCart();
        updateCartCount();
        renderCartItems();
    }

    function loadProducts() {
        $.ajax({
            url: apiURL,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                allPerfumes = data.slice(0, 10).map((item, index) => ({
                    id: item.id,
                    name: `Perfume ${item.id}`,
                    description: item.body.substring(0, 100) + '...',
                    price: (Math.random() * 100 + 50).toFixed(2),
                    image: images[index % images.length]
                }));

                const containerSelector = window.location.pathname.includes('products.html')
                    ? '#product-container'
                    : '.product-grid';
                displayProducts(allPerfumes, containerSelector);
            },
            error: function (err) {
                $('.product-grid').html('<p>Failed to load products. Please try again later.</p>');
                console.error(err);
            }
        });
    }

    function displayProducts(perfumes, containerId) {
        const container = $(containerId);
        container.empty();

        if (perfumes.length === 0) {
            container.html('<p>No products found.</p>');
            return;
        }

        perfumes.forEach(perfume => {
            const productHTML = `
                <div class="perfume-item">
                    <img src="${perfume.image}" alt="${perfume.name}">
                    <h3>${perfume.name}</h3>
                    <p>${perfume.description}</p>
                    <p><strong>$${perfume.price}</strong></p>
                    <button class="add-to-cart" data-id="${perfume.id}" data-name="${perfume.name}" data-price="${perfume.price}">Add to Cart</button>
                </div>
            `;
            container.append(productHTML);
        });
    }

    $(document).on('click', '.add-to-cart', function () {
        const id = $(this).data('id');
        const name = $(this).data('name');
        const price = parseFloat($(this).data('price'));
        addToCart(id, name, price);
    });

    $(document).on('click', '.remove-item', function () {
        const id = $(this).data('id');
        removeItemFromCart(id);
    });

    $('#buy-now').on('click', buyNow);

    $(document).on('click', '.cart-icon', function () {
        window.location.href = 'cart.html';
    });

    $('#search-input').on('input', function () {
        const query = $(this).val().toLowerCase();
        const filteredPerfumes = allPerfumes.filter(perfume =>
            perfume.name.toLowerCase().includes(query) ||
            perfume.description.toLowerCase().includes(query)
        );
        displayProducts(filteredPerfumes, '.product-grid');
    });

    if (window.location.pathname.includes('cart.html')) {
        renderCartItems();
    } else {
        loadProducts();
    }
    updateCartCount();
});
