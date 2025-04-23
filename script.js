document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
    updateFavCount();
    setupEventListeners();
});

/**
 * Set up event listeners for product interactions.
 */
function setupEventListeners() {
    // Add to Cart buttons
    document.querySelectorAll(".add-to-cart-btn").forEach(button => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            addToCart(this);
        });
    });

    // Add to Favorites buttons
    document.querySelectorAll(".wishlist-btn").forEach(button => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            addToFavorites(this);
        });
    });

    // Buy Now buttons
    document.querySelectorAll(".buy-now").forEach(button => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            addToCart(this, true); // Add to cart and redirect
        });
    });
}

/**
 * Add a product to the cart.
 * @param {HTMLElement} button - The clicked button element.
 * @param {boolean} redirect - If true, redirects to order page.
 */
function addToCart(button, redirect = false) {
    const itemCard = button.closest(".item-card");
    if (!itemCard) {
        console.error("Error: .item-card not found!");
        return;
    }
    const productName = itemCard.querySelector("h3").textContent;
    const productPrice = parseFloat(itemCard.querySelector(".final-price").textContent.replace("LKR", "").replace(/,/g, "").trim());
    const quantity = parseInt(itemCard.querySelector(".quantity-selector input").value);

    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    // Check for existing item
    const existingItem = cartItems.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartItems.push({ name: productName, price: productPrice, quantity: quantity });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartCount();

    if (redirect) {
        window.location.href = "order.html";
    } else {
        alert(`${productName} added to cart!`);
    }
}

/**
 * Add a product to favorites.
 * @param {HTMLElement} button - The clicked button element.
 */
function addToFavorites(button) {
    const itemCard = button.closest(".item-card");
    const productName = itemCard.querySelector("h3").textContent;
    const productPrice = parseFloat(itemCard.querySelector(".final-price").textContent.replace("LKR", "").replace(/,/g, "").trim());
    const quantity = parseInt(itemCard.querySelector(".quantity-selector input").value);

    let favItems = JSON.parse(localStorage.getItem("favoriteItems")) || [];

    const alreadyFavorited = favItems.some(item => item.name === productName);
    if (!alreadyFavorited) {
        favItems.push({ name: productName, price: productPrice, quantity: quantity });
        localStorage.setItem("favoriteItems", JSON.stringify(favItems));
        updateFavCount();
        alert(`${productName} added to favorites!`);
    } else {
        alert(`${productName} is already in favorites!`);
    }
}

/**
 * Update the cart item count in the header.
 */
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    document.getElementById("cart-count").textContent = cartItems.length;
}

/**
 * Update the favorite item count in the header.
 */
function updateFavCount() {
    const favItems = JSON.parse(localStorage.getItem("favoriteItems")) || [];
    document.getElementById("fav-count").textContent = favItems.length;
}

// Add this to all pages that display cart items
window.addEventListener('storage', function(e) {
    if (e.key === 'cartItems') {
        updateCartCount();
        // If on a page that displays cart items
        if (typeof displayOrderSummary === 'function') {
            displayOrderSummary();
        }
    }
});





// menu section

function toggleMobileMenu(menuToggle = null) {
    const navList = document.querySelector('.navbar ul');
    navList.classList.toggle('active');

    if (menuToggle) {
        menuToggle.classList.toggle('active');
    }

    // Get all navigation items
    const navItems = document.querySelectorAll('.navbar ul li a');
    navItems.forEach(item => {
        item.onclick = (e) => {
            const href = item.getAttribute("href");

            // Prevent closing when clicking on the 'Parts Selection' dropdown
            if (item.closest('li').classList.contains('dropdown') && href === "javascript:void(0)") {
                // Do nothing, so the menu remains open
                e.preventDefault(); // Prevent default behavior
                return;
            }

            // If it's a hash link (like #graphic-section), delay closing the menu for smooth scroll
            if (href.startsWith("#")) {
                // Delay closing the menu so that the page scrolls smoothly first
                setTimeout(() => {
                    navList.classList.remove('active');
                    if (menuToggle) {
                        menuToggle.classList.remove('active');
                    }
                }, 300); // Adjust delay if needed
            } else {
                // For regular links, close the menu immediately
                navList.classList.remove('active');
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                }
            }
        };
    });
}

