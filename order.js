document.addEventListener("DOMContentLoaded", function () {
    loadOrderDetails();
    setupCheckoutButton();
    setupSelectAllOrders();
    updateCartCount();
    updateFavCount();
});

function loadOrderDetails() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const orderTableBody = document.querySelector("#order-table tbody");
    let totalPrice = 0;
    orderTableBody.innerHTML = "";

    if (cartItems.length === 0) {
        orderTableBody.innerHTML = `<tr><td colspan="6">Your cart is empty.</td></tr>`;
        document.getElementById("total-price").textContent = "LKR 0.00"; 
        return;
    }

    cartItems.forEach((item, index) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        const itemTotal = price * quantity;
        totalPrice += itemTotal;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="checkbox" class="order-checkbox" data-index="${index}"></td>
            <td>${item.name || "Unnamed Item"}</td>
            <td>${quantity}</td>
            <td>LKR ${formatNumber(price)}</td>
            <td>LKR ${formatNumber(itemTotal)}</td>
            <td><button class="delete-btn" data-index="${index}">Delete</button></td>
        `;
        orderTableBody.appendChild(row);
    });

document.getElementById("total-price").textContent = `LKR ${formatNumber(totalPrice)}`;

    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", function () {
            deleteItemFromCart(this.getAttribute("data-index"));
        });
    });
}

function deleteItemFromCart(index) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartItems.splice(index, 1);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    loadOrderDetails();
}

function setupCheckoutButton() {
    const checkoutBtn = document.getElementById("checkout-btn");
    if (!checkoutBtn) return;

    checkoutBtn.addEventListener("click", function () {
        const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const selectedIndexes = Array.from(document.querySelectorAll(".order-checkbox:checked"))
            .map(cb => parseInt(cb.dataset.index));

        if (cartItems.length === 0) {
            alert("Your cart is empty. Please add items before checking out.");
            return;
        }

        if (selectedIndexes.length === 0) {
            alert("Please select items to checkout.");
            return;
        }

        const selectedItems = selectedIndexes.map(i => cartItems[i]);
        localStorage.setItem("selectedCartItems", JSON.stringify(selectedItems));
        window.location.href = "checkout.html";
    });
}

function setupSelectAllOrders() {
    const selectAll = document.getElementById("select-all-orders");
    if (!selectAll) return;

    selectAll.addEventListener("change", function () {
        const checkboxes = document.querySelectorAll(".order-checkbox");
        checkboxes.forEach(cb => cb.checked = this.checked);
    });
}

function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    document.getElementById("cart-count").textContent = cartItems.length;
}

function updateFavCount() {
    const favItems = JSON.parse(localStorage.getItem("favoriteItems")) || [];
    document.getElementById("fav-count").textContent = favItems.length;
}


function formatNumber(num) {
    return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


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

