// ========================================
// ELEMENTS
// ========================================

const saveButtons = document.querySelectorAll(".save-btn");
const detailsButtons = document.querySelectorAll(".details-btn");

const categoryButtons = document.querySelectorAll(".category-button");

const productWrappers = document.querySelectorAll(".product-wrapper");

const productSearch = document.getElementById("productSearch");

const productCount = document.getElementById("productCount");

const noProductsMessage = document.getElementById("noProductsMessage");


// Modal

const detailsOverlay = document.getElementById("detailsOverlay");

const closeModalButton = document.getElementById("closeModal");

const modalName = document.getElementById("modalName");

const modalDescription = document.getElementById("modalDescription");

const modalPrice = document.getElementById("modalPrice");

const modalCategory = document.getElementById("modalCategory");


// Current category

let selectedCategory = "all";


// ========================================
// SAVED PRODUCTS
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


function saveProducts(products) {

    localStorage.setItem(
        "savedProducts",
        JSON.stringify(products)
    );

}


// ========================================
// UPDATE SAVE BUTTONS WHEN PAGE LOADS
// ========================================

function updateSavedButtons() {

    const savedProducts =
        getSavedProducts();


    saveButtons.forEach((button) => {

        const saved =
            savedProducts.some(
                product =>
                    product.id === button.dataset.id
            );


        if (saved) {

            button.textContent =
                "♥ SAVED";

            button.classList.add("saved");

        } else {

            button.textContent =
                "♡ SAVE";

            button.classList.remove("saved");

        }

    });

}


updateSavedButtons();


// ========================================
// SAVE / REMOVE PRODUCT
// ========================================

saveButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            let savedProducts =
                getSavedProducts();


            const product = {
                 id: button.dataset.id,
                 name: button.dataset.name,
                 description: button.dataset.description,
                 price: button.dataset.price,
                 category: button.dataset.category,
                 image: button.dataset.image
            };

            const productIndex =
                savedProducts.findIndex(
                    item =>
                        item.id === product.id
                );


            // Product is not saved yet

            if (productIndex === -1) {

                savedProducts.push(product);

            }

            // Product already saved -> remove it

            else {

                savedProducts.splice(
                    productIndex,
                    1
                );

            }


            saveProducts(savedProducts);

            updateSavedButtons();

        }
    );

});


// ========================================
// DETAILS MODAL
// ========================================

detailsButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            modalName.textContent =
                button.dataset.name;

            modalDescription.textContent =
                button.dataset.description;

            modalPrice.textContent =
                button.dataset.price;

            modalCategory.textContent =
                button.dataset.category;


            detailsOverlay.classList.add(
                "show"
            );


            document.body.style.overflow =
                "hidden";

        }
    );

});


// ========================================
// CLOSE MODAL
// ========================================

function closeModal() {

    detailsOverlay.classList.remove(
        "show"
    );

    document.body.style.overflow =
        "";

}


closeModalButton.addEventListener(
    "click",
    closeModal
);


// Close by clicking outside

detailsOverlay.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            detailsOverlay
        ) {

            closeModal();

        }

    }
);


// Close with ESC key

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape"
        ) {

            closeModal();

        }

    }
);


// ========================================
// FILTER PRODUCTS
// ========================================

function filterProducts() {

    const searchValue =
        productSearch.value
            .trim()
            .toLowerCase();


    let visibleProducts = 0;


    productWrappers.forEach(
        (product) => {

            const productName =
                product.dataset.name
                    .toLowerCase();


            const productCategory =
                product.dataset.category;


            const matchesSearch =
                productName.includes(
                    searchValue
                );


            const matchesCategory =
                selectedCategory === "all" ||
                productCategory ===
                    selectedCategory;


            if (
                matchesSearch &&
                matchesCategory
            ) {

                product.classList.remove(
                    "hidden-product"
                );

                visibleProducts++;

            } else {

                product.classList.add(
                    "hidden-product"
                );

            }

        }
    );


    // Product count

    productCount.textContent =
        `${visibleProducts} ${
            visibleProducts === 1
                ? "product"
                : "products"
        }`;


    // Nothing found message

    if (visibleProducts === 0) {

        noProductsMessage.classList.remove(
            "d-none"
        );

    } else {

        noProductsMessage.classList.add(
            "d-none"
        );

    }

}


// ========================================
// SEARCH
// ========================================

productSearch.addEventListener(
    "input",
    filterProducts
);


// ========================================
// CATEGORY BUTTONS
// ========================================

categoryButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                selectedCategory =
                    button.dataset.category;


                categoryButtons.forEach(
                    item => {

                        item.classList.remove(
                            "active-category"
                        );

                    }
                );


                button.classList.add(
                    "active-category"
                );


                filterProducts();

            }
        );

    }
);