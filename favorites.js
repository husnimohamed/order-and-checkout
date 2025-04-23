document.addEventListener("DOMContentLoaded", function () {
    loadFavorites();                          // Load favorite items from localStorage into the table
    setupApplyFavorites();                    // Setup Apply to Cart button
    setupSelectAllCheckbox();                 // Setup "Select All" checkbox behavior
});

/**
 * Load favorite items from localStorage and populate the table.
 */
function loadFavorites() {
    const favItems = JSON.parse(localStorage.getItem("favoriteItems")) || [];
    const favTableBody = document.querySelector("#fav-table tbody");

    favTableBody.innerHTML = ""; // Clear table first

    if (favItems.length > 0) {
        favItems.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><input type="checkbox" class="fav-checkbox" data-index="${index}"></td>
                <td>${item.name}</td>
                <td>LKR ${formatNumber(item.price)}</td>                <td>${item.quantity}</td>
                <td><button class="delete-btn" data-index="${index}">Delete</button></td>
            `;
            favTableBody.appendChild(row);
        });

        // Attach delete functionality to each delete button
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                deleteFavorite(index);
            });
        });

    } else {
        favTableBody.innerHTML = "<tr><td colspan='5'>No favorite order saved.</td></tr>";
    }
}

/**
 * Delete an item from favorites and update the table.
 */
function deleteFavorite(index) {
    const favItems = JSON.parse(localStorage.getItem("favoriteItems")) || [];

    if (index >= 0 && index < favItems.length) {
        favItems.splice(index, 1);
        localStorage.setItem("favoriteItems", JSON.stringify(favItems));
        loadFavorites();
        updateFavCount(); // Optional: if you show fav count in navbar
    }
}

/**
 * Update the favorite count in header or navbar.
 */
function updateFavCount() {
    const favItems = JSON.parse(localStorage.getItem("favoriteItems")) || [];
    document.getElementById("fav-count").textContent = favItems.length;
}

/**
 * Setup logic for "Apply to Cart" button to move selected favorite items.
 */
function setupApplyFavorites() {
    const applyBtn = document.getElementById("apply-favorites");
    if (!applyBtn) return;

    applyBtn.addEventListener("click", function () {
        const favItems = JSON.parse(localStorage.getItem("favoriteItems")) || [];
        const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

        const selectedIndexes = Array.from(document.querySelectorAll(".fav-checkbox:checked"))
                                     .map(cb => parseInt(cb.dataset.index));

        if (selectedIndexes.length === 0) {
            alert("Please select items to apply.");
            return;
        }

        const selectedItems = selectedIndexes.map(i => favItems[i]);
        const remainingItems = favItems.filter((_, i) => !selectedIndexes.includes(i));

        // Merge with cart if same item already exists
        selectedItems.forEach(favItem => {
            const existingItem = cartItems.find(cartItem => cartItem.name === favItem.name);
            if (existingItem) {
                existingItem.quantity += favItem.quantity;
            } else {
                cartItems.push(favItem);
            }
        });

        // Save updated data
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        localStorage.setItem("favoriteItems", JSON.stringify(remainingItems));

        alert("Selected favorite items added to cart!");
        window.location.href = "order.html";
    });
}

/**
 * Setup the "Select All" checkbox functionality.
 */
function setupSelectAllCheckbox() {
    const selectAll = document.getElementById("select-all-favorites");
    if (!selectAll) return;

    selectAll.addEventListener("change", function () {
        const checkboxes = document.querySelectorAll(".fav-checkbox");
        checkboxes.forEach(cb => cb.checked = this.checked);
    });
}


// Add the updateCartCount and updateFavCount functions at the top of the file.
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    document.getElementById("cart-count").textContent = cartItems.length;
}

function updateFavCount() {
    const favItems = JSON.parse(localStorage.getItem("favoriteItems")) || [];
    document.getElementById("fav-count").textContent = favItems.length;
}

// Call the functions when the page is loaded.
window.onload = function() {
    updateCartCount();
    updateFavCount();
};


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

