// ========================================
// ELEMENTS
// ========================================

const savedProductsGrid =
    document.getElementById("savedProductsGrid");

const savedCount =
    document.getElementById("savedCount");

const emptySaved =
    document.getElementById("emptySaved");

const sortSelect =
    document.getElementById("sortSelect");

const buyOverlay =
    document.getElementById("buyOverlay");

const closeBuyModal =
    document.getElementById("closeBuyModal");

const buyProductName =
    document.getElementById("buyProductName");

const buyProductPrice =
    document.getElementById("buyProductPrice");


// ========================================
// GET SAVED PRODUCTS
// ========================================

function getSavedProducts() {

    const storedProducts =
        localStorage.getItem("savedProducts");


    if (!storedProducts) {
        return [];
    }


    try {

        return JSON.parse(storedProducts);

    } catch (error) {

        console.error(
            "Could not read saved products:",
            error
        );

        return [];
    }

}


// ========================================
// SAVE TO LOCAL STORAGE
// ========================================

function updateLocalStorage(products) {

    localStorage.setItem(
        "savedProducts",
        JSON.stringify(products)
    );

}


// ========================================
// RENDER PRODUCTS
// ========================================

function renderSavedProducts() {

    let products =
        getSavedProducts();


    products =
        sortProducts(products);


    savedProductsGrid.innerHTML =
        "";


    savedCount.textContent =
        `${products.length} ${
            products.length === 1
                ? "item"
                : "items"
        } saved`;


    if (products.length === 0) {

        emptySaved.classList.add(
            "show"
        );

        return;

    }


    emptySaved.classList.remove(
        "show"
    );


    products.forEach(
        product => {

            const column =
                document.createElement(
                    "div"
                );


            column.className =
                "col-12 col-sm-6 col-lg-3";


            column.innerHTML = `

                <article class="saved-card">

                    <div class="saved-image">
                        <img
                         src="${product.image}"
                         alt="${product.name}">
                    </div>

                    <div class="saved-info">

                        <div>

                            <h3>
                                ${product.name}
                            </h3>

                            <p>
                                ${product.description}
                            </p>

                        </div>

                        <span class="saved-price">
                            ${product.price}
                        </span>

                    </div>

                    <div class="saved-actions">

                        <button
                            class="remove-btn"
                            data-id="${product.id}"
                            type="button"
                        >
                            REMOVE
                        </button>

                        <button
                            class="buy-btn"
                            data-name="${product.name}"
                            data-price="${product.price}"
                            type="button"
                        >
                            BUY NOW
                        </button>

                    </div>

                </article>

            `;


            savedProductsGrid.appendChild(
                column
            );

        }
    );


    addRemoveEvents();

    addBuyEvents();

}


// ========================================
// REMOVE PRODUCT
// ========================================

function addRemoveEvents() {

    const removeButtons =
        document.querySelectorAll(
            ".remove-btn"
        );


    removeButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    let products =
                        getSavedProducts();


                    products =
                        products.filter(
                            product =>
                                product.id !==
                                button.dataset.id
                        );


                    updateLocalStorage(
                        products
                    );


                    renderSavedProducts();

                }
            );

        }
    );

}


// ========================================
// BUY BUTTON
// ========================================

function addBuyEvents() {

    const buyButtons =
        document.querySelectorAll(
            ".buy-btn"
        );


    buyButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    buyProductName.textContent =
                        button.dataset.name;

                    buyProductPrice.textContent =
                        button.dataset.price;


                    buyOverlay.classList.add(
                        "show"
                    );


                    document.body.style.overflow =
                        "hidden";

                }
            );

        }
    );

}


// ========================================
// CLOSE BUY MODAL
// ========================================

function closeModal() {

    buyOverlay.classList.remove(
        "show"
    );

    document.body.style.overflow =
        "";

}


closeBuyModal.addEventListener(
    "click",
    closeModal
);


buyOverlay.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            buyOverlay
        ) {

            closeModal();

        }

    }
);


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeModal();

        }

    }
);


// ========================================
// SORT PRODUCTS
// ========================================

function sortProducts(products) {

    const sorted =
        [...products];


    if (
        sortSelect.value ===
        "name"
    ) {

        sorted.sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name
                )
        );

    }


    if (
        sortSelect.value ===
        "price-low"
    ) {

        sorted.sort(
            (a, b) =>
                getPrice(a.price) -
                getPrice(b.price)
        );

    }


    if (
        sortSelect.value ===
        "price-high"
    ) {

        sorted.sort(
            (a, b) =>
                getPrice(b.price) -
                getPrice(a.price)
        );

    }


    return sorted;

}


// ========================================
// CONVERT "$50" TO 50
// ========================================

function getPrice(price) {

    return Number(
        price.replace(
            /[^0-9.]/g,
            ""
        )
    );

}


// ========================================
// SORT CHANGE
// ========================================

sortSelect.addEventListener(
    "change",
    renderSavedProducts
);


// ========================================
// INITIAL LOAD
// ========================================

renderSavedProducts();