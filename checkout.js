// Handle window load
window.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
    updateFavCount();
    displayOrderSummary();
    setupPaymentToggles();
    setupCardImageDisplay(); // Enable card image logic
});

// Event listener for the checkout form submission
document.getElementById("checkout-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const formValues = getFormValues();
    if (isFormValid(formValues)) {
        processCheckout(formValues);
    } else {
        alert("Please fill in all fields correctly.");
    }
});

// Set up payment toggles between COD and Card Payment
function setupPaymentToggles() {
    const cardSection = document.getElementById("card-details");
    const cardTypeSection = document.getElementById("card-type-section");

    // Initial check
    if (document.getElementById("card-payment").checked) {
        cardSection.style.display = "block";
        cardTypeSection.style.display = "block";
        document.querySelectorAll("#card, #expiry, #cvv").forEach(id => id.setAttribute("required", "true"));
    } else {
        cardSection.style.display = "none";
        cardTypeSection.style.display = "none";
        document.querySelectorAll("#card, #expiry, #cvv").forEach(id => id.removeAttribute("required"));
    }

    document.getElementById("cod").addEventListener("change", function () {
        if (this.checked) {
            cardSection.style.display = "none";
            cardTypeSection.style.display = "none";
            document.querySelectorAll("#card, #expiry, #cvv").forEach(id => id.removeAttribute("required"));
        }
    });

    document.getElementById("card-payment").addEventListener("change", function () {
        if (this.checked) {
            cardSection.style.display = "block";
            cardTypeSection.style.display = "block";
            document.querySelectorAll("#card, #expiry, #cvv").forEach(id => id.setAttribute("required", "true"));
        }
    });
}

// Card image display logic
function setupCardImageDisplay() {
    const cardTypeSelect = document.getElementById("card-type");
    const visaImg = document.getElementById("visa-img");
    const masterImg = document.getElementById("mastercard-img");
    const amexImg = document.getElementById("amex-img");

    cardTypeSelect.addEventListener("change", function () {
        visaImg.style.display = "none";
        masterImg.style.display = "none";
        amexImg.style.display = "none";

        if (this.value === "visa") {
            visaImg.style.display = "block";
        } else if (this.value === "mastercard") {
            masterImg.style.display = "block";
        } else if (this.value === "amex") {
            amexImg.style.display = "block";
        }
    });
}

// Gather form values for checkout
function getFormValues() {
    const isCOD = document.getElementById("cod").checked;
    const isCard = document.getElementById("card-payment").checked;

    return {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        address: document.getElementById("address").value.trim(),
        city: document.getElementById("city").value.trim(),
        postal: document.getElementById("postal").value.trim(),
        paymentMethod: isCOD ? "COD" : "Card",
        card: isCard ? document.getElementById("card").value.trim() : "",
        expiry: isCard ? document.getElementById("expiry").value.trim() : "",
        cvv: isCard ? document.getElementById("cvv").value.trim() : ""
    };
}

// Validate form values before checkout
function isFormValid(formValues) {
    if (!formValues.name || !formValues.email || !formValues.address || !formValues.city || !formValues.postal) {
        return false;
    }
    if (formValues.paymentMethod === "Card" && (!formValues.card || !formValues.expiry || !formValues.cvv)) {
        return false;
    }
    return true;
}

// Process the checkout and update UI
function processCheckout(formValues) {
    const selectedItems = JSON.parse(localStorage.getItem("selectedCartItems")) || [];
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    cartItems = cartItems.filter(item =>
        !selectedItems.some(sel => JSON.stringify(sel) === JSON.stringify(item))
    );

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.removeItem("selectedCartItems");

    const maskedCard = formValues.card && formValues.card.length >= 16
        ? formValues.card.replace(/\d{12}(\d{4})/, "**** **** **** $1")
        : null;

    const userDetails = {
        name: formValues.name,
        email: formValues.email,
        address: formValues.address,
        city: formValues.city,
        postal: formValues.postal,
        paymentMethod: formValues.paymentMethod,
        card: maskedCard
    };
    localStorage.setItem("userDetails", JSON.stringify(userDetails));

    document.getElementById("checkout-heading").style.display = "none";
    document.getElementById("checkout-container").style.display = "none";
    document.getElementById("thank-you-section").style.display = "block";
    document.getElementById("order-confirmation-heading").style.display = "block";
    document.getElementById("thank-you-message").innerHTML = `
        <h2>Thank You, ${formValues.name}!</h2>
        <p>Your order will be delivered to <strong>${formValues.address}, ${formValues.city}</strong> within 3–5 working days.</p>
        <p>Payment Method: <strong>${formValues.paymentMethod === "COD" ? "Cash on Delivery" : `Card (${maskedCard})`}</strong></p>
    `;

    updateCartCount();
}

// Event listener for the Back to Home button
document.getElementById("home-button").addEventListener("click", function () {
    window.location.href = "partsselection.html";
});

// Display the order summary in the cart
function displayOrderSummary() {
    const cartItems = JSON.parse(localStorage.getItem("selectedCartItems")) || [];
    const tableBody = document.querySelector("#order-summary-table tbody");
    const subtotalElem = document.querySelector("#subtotal span");
    const shippingElem = document.querySelector("#shipping span");
    const grandTotalElem = document.querySelector("#grand-total span");

    let subtotal = 0;
    tableBody.innerHTML = "";

    if (cartItems.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4">No items in cart.</td></tr>`;
        return;
    }

    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>LKR ${formatNumber(item.price)}</td>
            <td>LKR ${formatNumber(itemTotal)}</td>
        `;
        tableBody.appendChild(row);
    });

    let shippingFee = subtotal > 0 ? 400 : 0;
    let grandTotal = subtotal + shippingFee;

    subtotalElem.textContent = formatNumber(subtotal);
    shippingElem.textContent = formatNumber(shippingFee);
    grandTotalElem.textContent = formatNumber(grandTotal);
}

// Update the cart count on the page
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    document.getElementById("cart-count").textContent = cartItems.length;
}

// Update the favorite items count
function updateFavCount() {
    const favItems = JSON.parse(localStorage.getItem("favoriteItems")) || [];
    document.getElementById("fav-count").textContent = favItems.length;
}

// Disable the Pay button by default
document.getElementById("pay-button").disabled = true;

// Handle the change in payment method selection
document.getElementById("cod").addEventListener("change", togglePayButton);
document.getElementById("card-payment").addEventListener("change", togglePayButton);

// Enable or disable Pay button based on valid selection
function togglePayButton() {
    const isCODSelected = document.getElementById("cod").checked;
    const isCardSelected = document.getElementById("card-payment").checked;

    document.getElementById("pay-button").disabled = !(isCODSelected || isCardSelected);
}

// Format numbers
function formatNumber(num) {
    return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Mobile menu toggle
function toggleMobileMenu(menuToggle = null) {
    const navList = document.querySelector('.navbar ul');
    navList.classList.toggle('active');

    if (menuToggle) {
        menuToggle.classList.toggle('active');
    }

    const navItems = document.querySelectorAll('.navbar ul li a');
    navItems.forEach(item => {
        item.onclick = (e) => {
            const href = item.getAttribute("href");

            if (item.closest('li').classList.contains('dropdown') && href === "javascript:void(0)") {
                e.preventDefault();
                return;
            }

            if (href.startsWith("#")) {
                setTimeout(() => {
                    navList.classList.remove('active');
                    if (menuToggle) {
                        menuToggle.classList.remove('active');
                    }
                }, 300);
            } else {
                navList.classList.remove('active');
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                }
            }
        };
    });
}
