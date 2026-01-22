fetch('products.json')
.then(response => response.json())
.then(data => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const swiper_items_sale = document.getElementById("swiper_items_sale");
    const swiper_elctronics = document.getElementById("swiper_elctronics");
    const swiper_appliances = document.getElementById("swiper_appliances");
    const swiper_mobiles = document.getElementById("swiper_mobiles");

    // 🧩 Helper: render a single product
    function renderProduct(container, product) {
        const isInCart = cart.some(cartItem => cartItem.id === product.id);
        const old_price_Pargrahp = product.old_price ? `<p class="old_price">EGP ${product.old_price}</p>` : "";
        const percent_disc_div = product.old_price ? `<span class="sale_present">%${Math.floor((product.old_price - product.price) / product.old_price * 100)}</span>` : "";

        container.innerHTML += `
            <div class="swiper-slide product" data-id="${product.id}">
                ${percent_disc_div}
                <div class="img_product">
                    <a href="#" class="view-details" data-id="${product.id}">
                        <img src="${product.img}" alt="${product.name}" class="product-img">
                    </a>
                </div>

                <div class="stars">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                </div>

                <p class="name_product">
                    <a href="#" class="view-details" data-id="${product.id}">${product.name}</a>
                </p>

                <div class="price">
                    <p><span>EGP ${product.price}</span></p>
                    ${old_price_Pargrahp}
                </div>

                <div class="icons">
                    <span class="btn_add_cart ${isInCart ? 'active' : ''}" data-id="${product.id}">
                        <i class="fa-solid fa-cart-shopping"></i> ${isInCart ? 'تمت الإضافة' : 'إضافة إلي السلة'}
                    </span>
                    <span class="icon_product"><i class="fa-regular fa-heart"></i></span>
                </div>
            </div>
        `;
    }

    // 🧩 Render by categories
    data.forEach(product => {
        if (product.old_price) renderProduct(swiper_items_sale, product);
        if (product.catetory === "electronics") renderProduct(swiper_elctronics, product);
        if (product.catetory === "appliances") renderProduct(swiper_appliances, product);
        if (product.catetory === "mobiles") renderProduct(swiper_mobiles, product);
    });

    // 🧩 Add modal HTML once (NO Add to Cart button here)
    const modalHTML = `
        <div id="productModal" class="product-modal" style="display:none;">
            <div class="modal-content">
                <span id="closeModal" class="close">&times;</span>
                <img id="modalImg" src="" alt="">
                <h2 id="modalName"></h2>
                <p id="modalPrice"></p>
                <p id="modalDesc"></p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById("productModal");
    const closeModal = document.getElementById("closeModal");
    const modalImg = document.getElementById("modalImg");
    const modalName = document.getElementById("modalName");
    const modalPrice = document.getElementById("modalPrice");
    const modalDesc = document.getElementById("modalDesc");

    // 🧩 Click on image or name opens modal
document.addEventListener("click", (e) => {
    const target = e.target.closest(".view-details");
    if (target) {
        e.preventDefault();
        const productId = target.dataset.id;

        // 🔗 الانتقال لصفحة تفاصيل المنتج
        window.location.href = `product.html?id=${productId}`;
    }
});


    // 🧩 Close modal
    closeModal.onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };
});
