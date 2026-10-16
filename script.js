const products = [
    {
        id: 1,
        name: "Mobile",
        price: 12000,
        category: "electronics",
        color: "Black",
        instock: true
    },
    {
        id: 2,
        name: "LCD",
        price: 75000,
        category: "electronics",
        color: "Silver",
        instock: true
    },
    {
        id: 3,
        name: "Oven",
        price: 2500,
        category: "electronics",
        color: "White",
        instock: false
    },
    {
        id: 4,
        name: "Pen",
        price: 50,
        category: "stationary",
        color: "Blue",
        instock: true
    },
    {
        id: 5,
        name: "Packpan",
        price: 250,
        category: "accessories",
        color: "Red",
        instock: true
    }
];

// Get HTML elements
const productTable = document.getElementById("productTable");
const searchInput = document.getElementById("searchInput");
const searchType = document.getElementById("searchType");
const categoryButtons = document.querySelectorAll(".category-btn");
const priceAsc = document.getElementById("priceAsc");
const priceDesc = document.getElementById("priceDesc");
const resetBtn = document.getElementById("resetBtn");
const resultCount = document.getElementById("resultCount");
const noResults = document.getElementById("noResults");

// Current filter and sorting options
let selectedCategory = "all";
let sortOrder = "none";

// Display products
function displayProducts() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedSearchType = searchType.value;

    // Filter products by category and search
    let filteredProducts = products.filter(product => {
        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        let matchesSearch = false;

        if (selectedSearchType === "all") {
            matchesSearch =
                product.name.toLowerCase().includes(searchText) ||
                product.category.toLowerCase().includes(searchText) ||
                String(product.price).includes(searchText) ||
                product.color.toLowerCase().includes(searchText) ||
                (product.instock ? "in stock" : "out of stock")
                    .includes(searchText);
        } else if (selectedSearchType === "name") {
            matchesSearch = product.name
                .toLowerCase()
                .includes(searchText);
        } else if (selectedSearchType === "category") {
            matchesSearch = product.category
                .toLowerCase()
                .includes(searchText);
        } else if (selectedSearchType === "price") {
            matchesSearch = String(product.price)
                .includes(searchText);
        } else if (selectedSearchType === "stock") {
            const stockStatus = product.instock
                ? "in stock"
                : "out of stock";

            matchesSearch = stockStatus.includes(searchText);
        }
        else if (selectedSearchType === "color") {
            matchesSearch = product.color
            .toLowerCase()
            .includes(searchText);
        }

        return matchesCategory && matchesSearch;
    });

    // Sort products by price
    if (sortOrder === "asc") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    // Clear old table rows
    productTable.innerHTML = "";

    // Show message when no products match
    noResults.hidden = filteredProducts.length !== 0;

    // Display each product
    filteredProducts.forEach(product => {
        const row = document.createElement("tr");

        const discount = product.price * 0.20;
const finalPrice = product.price - discount;

row.innerHTML = `
    <td>${product.id}</td>
    <td>${product.name}</td>
    <td>Rs. ${product.price.toLocaleString("en-PK")}</td>
    <td class="discount">20% OFF</td>
    <td class="final-price">
        Rs. ${finalPrice.toLocaleString("en-PK", {
            maximumFractionDigits: 2
        })}
    </td>
    <td>${product.category}</td>
    <td>${product.color}</td>
    <td>
        <span class="stock ${
            product.instock ? "in-stock" : "out-stock"
        }">
            ${product.instock ? "✓" : "✗"}
        </span>
    </td>
`;

        productTable.appendChild(row);
    });

    resultCount.textContent =
        `Showing ${filteredProducts.length} of ${products.length} products`;
}

// Search when typing or changing search type
searchInput.addEventListener("input", displayProducts);
searchType.addEventListener("change", displayProducts);

// Filter by category
categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;

        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        displayProducts();
    });
});

// Price ascending: lowest to highest
priceAsc.addEventListener("click", () => {
    sortOrder = "asc";
    displayProducts();
});

// Price descending: highest to lowest
priceDesc.addEventListener("click", () => {
    sortOrder = "desc";
    displayProducts();
});

// Reset all filters and sorting
resetBtn.addEventListener("click", () => {
    selectedCategory = "all";
    sortOrder = "none";

    searchInput.value = "";
    searchType.value = "all";

    categoryButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.category === "all"
        );
    });

    displayProducts();
});
function calculateTotalInStock() {
    const total = products
        .filter(product => product.instock)
        .reduce((sum, product) => sum + product.price, 0);

    document.getElementById("totalAmount").textContent =
        `Rs. ${total.toLocaleString("en-PK")}`;
}

// Show all products when the page loads
displayProducts();
calculateTotalInStock();
const showFormBtn = document.getElementById("showFormBtn");
const addItemForm = document.getElementById("addItemForm");
const productForm = document.getElementById("productForm");
const cancelFormBtn = document.getElementById("cancelFormBtn");

// Open the form
showFormBtn.addEventListener("click", () => {
    addItemForm.hidden = false;
    showFormBtn.hidden = true;
});

// Close the form
cancelFormBtn.addEventListener("click", () => {
    addItemForm.hidden = true;
    showFormBtn.hidden = false;
    productForm.reset();
});

// Add a product submitted by the user
productForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("itemName").value.trim();
    const price = Number(document.getElementById("itemPrice").value);
    const category = document.getElementById("itemCategory").value
        .trim().toLowerCase();
    const color = document.getElementById("itemColor").value.trim();
    const instock =
        document.getElementById("itemStock").value === "true";

    if (!name || !category || !color ||
        document.getElementById("itemPrice").value === "" ||
        !Number.isFinite(price) || price < 0) {
        alert("Please enter valid product details.");
        return;
    }

    const newProduct = {
        id: Math.max(0, ...products.map(p => p.id)) + 1,
        name: name,
        price: price,
        category: category,
        color: color,
        instock: instock
    };

    // Add product to the array
    products.push(newProduct);

    // Add a category button if this category is new
    let categoryButton = [...categoryButtons].find(
        button => button.dataset.category === category
    );

    if (!categoryButton) {
        categoryButton = document.createElement("button");
        categoryButton.className = "category-btn";
        categoryButton.dataset.category = category;
        categoryButton.textContent =
            category.charAt(0).toUpperCase() + category.slice(1);

        document.querySelector(".sidebar").appendChild(categoryButton);

        categoryButton.addEventListener("click", () => {
            selectedCategory = categoryButton.dataset.category;

            document.querySelectorAll(".category-btn").forEach(button => {
                button.classList.toggle("active", button === categoryButton);
            });

            displayProducts();
        });
    }

    // Reset filters so the newly added product is visible
    selectedCategory = "all";
    sortOrder = "none";
    searchInput.value = "";
    searchType.value = "all";

    document.querySelectorAll(".category-btn").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.category === "all"
        );
    });

    // Refresh table and total
    displayProducts();
    calculateTotalInStock();

    // Close and clear form
    productForm.reset();
    addItemForm.hidden = true;
    showFormBtn.hidden = false;

    alert("Product added successfully!");
});