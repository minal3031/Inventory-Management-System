const form = document.getElementById("productForm");
const table = document.getElementById("productTable");
const message = document.getElementById("message");

let allProducts = [];


// ==========================================
// LOAD PRODUCTS
// ==========================================

async function loadProducts() {

    try {

        const response = await fetch("/api/products");

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        allProducts = await response.json();

        displayProducts(allProducts);

    } catch (error) {

        console.error(error);

        message.textContent = "Unable to load products.";
        message.style.color = "red";
    }
}


// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayProducts(products) {

    table.innerHTML = "";

    if (products.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No products found
                </td>
            </tr>
        `;

        return;
    }


    products.forEach(product => {

        const row = document.createElement("tr");

        // Low-stock status
        let stockStatus = "";

        if (product.quantity === 0) {

            stockStatus = `
                <span class="stock-out">
                    Out of Stock
                </span>
            `;

        } else if (product.quantity <= 5) {

            stockStatus = `
                <span class="low-stock">
                    Low Stock
                </span>
            `;
        }


        row.innerHTML = `

            <td>${product.product_id}</td>

            <td>${product.name}</td>

            <td>${product.category}</td>

            <td>
                ${product.quantity}
                ${stockStatus}
            </td>

            <td>₹${Number(product.price).toFixed(2)}</td>

            <td>

                <button
                    onclick="updateProduct('${product.product_id}')">
                    Update
                </button>

                <button
                    onclick="deleteProduct('${product.product_id}')">
                    Delete
                </button>

            </td>

        `;


        // Highlight low-stock rows
        if (product.quantity <= 5) {

            row.style.backgroundColor = "#fff3cd";
        }


        table.appendChild(row);

    });
}


// ==========================================
// SEARCH PRODUCTS
// ==========================================

function searchProducts() {

    const searchText = document
        .getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();


    const filteredProducts = allProducts.filter(product =>

        product.product_id
            .toLowerCase()
            .includes(searchText)

        ||

        product.name
            .toLowerCase()
            .includes(searchText)

        ||

        product.category
            .toLowerCase()
            .includes(searchText)

    );


    displayProducts(filteredProducts);
}


// ==========================================
// ADD PRODUCT
// ==========================================

form.addEventListener("submit", async function(event) {

    event.preventDefault();


    const product = {

        product_id:
            document.getElementById("product_id").value.trim(),

        name:
            document.getElementById("name").value.trim(),

        category:
            document.getElementById("category").value.trim(),

        quantity:
            document.getElementById("quantity").value,

        price:
            document.getElementById("price").value
    };


    try {

        const response = await fetch("/api/products", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(product)

        });


        const result = await response.json();


        if (response.ok) {

            message.textContent =
                "Product added successfully!";

            message.style.color = "green";


            form.reset();


            await loadProducts();

        } else {

            message.textContent =
                result.error || "Unable to add product.";

            message.style.color = "red";
        }


    } catch (error) {

        console.error(error);

        message.textContent =
            "Server connection error.";

        message.style.color = "red";
    }

});


// ==========================================
// UPDATE PRODUCT
// ==========================================

async function updateProduct(productId) {

    const product = allProducts.find(
        item => item.product_id === productId
    );


    if (!product) {

        alert("Product not found.");

        return;
    }


    const newQuantity = prompt(
        "Enter new quantity:",
        product.quantity
    );


    if (newQuantity === null) {
        return;
    }


    const newPrice = prompt(
        "Enter new price:",
        product.price
    );


    if (newPrice === null) {
        return;
    }


    if (
        newQuantity.trim() === "" ||
        newPrice.trim() === ""
    ) {

        alert("Quantity and price are required.");

        return;
    }


    if (
        Number(newQuantity) < 0 ||
        Number(newPrice) < 0
    ) {

        alert(
            "Quantity and price cannot be negative."
        );

        return;
    }


    try {

        const response = await fetch(
            `/api/products/${productId}`,
            {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    quantity: newQuantity,

                    price: newPrice

                })

            }
        );


        const result = await response.json();


        if (response.ok) {

            alert(
                "Product updated successfully!"
            );

            await loadProducts();

        } else {

            alert(
                result.error || "Update failed."
            );
        }


    } catch (error) {

        console.error(error);

        alert(
            "Server connection error."
        );
    }
}


// ==========================================
// DELETE PRODUCT
// ==========================================

async function deleteProduct(productId) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this product?"
    );


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            `/api/products/${productId}`,
            {
                method: "DELETE"
            }
        );


        const result = await response.json();


        if (response.ok) {

            alert(
                "Product deleted successfully!"
            );

            await loadProducts();

        } else {

            alert(
                result.error || "Delete failed."
            );
        }


    } catch (error) {

        console.error(error);

        alert(
            "Server connection error."
        );
    }
}


// ==========================================
// LOAD PRODUCTS WHEN PAGE OPENS
// ==========================================

loadProducts();