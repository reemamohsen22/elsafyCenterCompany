// const params = new URLSearchParams(window.location.search);
// const productId = params.get("id");

// fetch("products.json")
//   .then(res => res.json())
//   .then(data => {
//     const product = data.find(p => p.id == productId);
//     if (!product) return;

//     // عرض بيانات المنتج
//     document.getElementById("productName").textContent = product.name;
//     document.getElementById("productPrice").textContent = product.price;
//     document.getElementById("productDesc").textContent = product.desc || "لا يوجد وصف";
//     document.getElementById("mainImage").src = product.img;

//     const addToCartBtn = document.getElementById("addToCartBtn");
//     addToCartBtn.setAttribute("data-id", product.id);

//     // 🔹 تحقق أول مرة إذا المنتج موجود في السلة
//     let cart = JSON.parse(localStorage.getItem("cart")) || [];
//     const alreadyInCart = cart.find(item => item.id == product.id);

//     if (alreadyInCart) {
//       addToCartBtn.classList.add("active");
//       addToCartBtn.textContent = "تمت الإضافة";
//     }

//     // 🔹 دالة الضغط على Add to Cart
//     addToCartBtn.addEventListener("click", () => {
//       let cart = JSON.parse(localStorage.getItem("cart")) || [];
//       const exists = cart.find(item => item.id == product.id);

//       if (!exists) {
//         cart.push({
//           id: product.id,
//           name: product.name,
//           price: product.price,
//           img: product.img,
//           quantity: 1
//         });

//         localStorage.setItem("cart", JSON.stringify(cart));

//         if (typeof updateCart === "function") updateCart();

//         addToCartBtn.classList.add("active");
//         addToCartBtn.textContent = "تمت الإضافة";

//         showToast("تمت الإضافة إلى السلة!");
//       }
//     });

//     // 🔹 ربط تحديث الزر عند حذف المنتج من السلة
//     document.addEventListener("cartUpdated", () => {
//       let cart = JSON.parse(localStorage.getItem("cart")) || [];
//       const exists = cart.find(item => item.id == product.id);

//       if (!exists) {
//         addToCartBtn.classList.remove("active");
//         addToCartBtn.textContent = "Add to Cart";
//       }
//     });

//     // 🔹 دالة زر Buy Now
//     const buyNowBtn = document.getElementById("buyNowBtn");
//     buyNowBtn.addEventListener("click", () => {
//       // حفظ المنتج في localStorage مؤقت للشراء الفوري
//       const buyNowProduct = {
//         id: product.id,
//         name: product.name,
//         price: product.price,
//         img: product.img,
//         quantity: 1
//       };
//       localStorage.setItem("buyNowProduct", JSON.stringify(buyNowProduct));

//       // توجيه المستخدم مباشرة لصفحة Checkout
//       window.location.href = "checkout.html";
//     });
//   });

// // 🔹 دالة Toast
// function showToast(message, duration = 2500) {
//   let toast = document.getElementById("toast");
//   if (!toast) {
//     toast = document.createElement("div");
//     toast.id = "toast";
//     toast.className = "toast";
//     document.body.appendChild(toast);
//   }

//   toast.textContent = message;
//   toast.classList.add("show");

//   setTimeout(() => {
//     toast.classList.remove("show");
//   }, duration);
// }




const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

fetch("products.json")
  .then(res => res.json())
  .then(data => {
    const product = data.find(p => p.id == productId);
    if (!product) return;

// عرض بيانات المنتج
document.getElementById("productName").textContent = product.name;
document.getElementById("productPrice").textContent = product.price;
document.getElementById("productDesc").textContent =
  product.desc || "لا يوجد وصف";
document.getElementById("mainImage").src = product.img;

// عناصر السعر
const oldPriceEl = document.getElementById("productOldPrice");
const discountEl = document.getElementById("productDiscount");

// 🔹 لو فيه سعر قديم
if (product.old_price) {
  oldPriceEl.textContent = `EGP ${product.old_price}`;
  oldPriceEl.style.display = "inline";

  const discount =
    Math.floor(
      ((product.old_price - product.price) / product.old_price) * 100
    );

  discountEl.textContent = `خصم ${discount}%`;
  discountEl.style.display = "inline";
} else {
  // 🔹 لو مفيش سعر قديم
  oldPriceEl.style.display = "none";
  discountEl.style.display = "none";
}

// 🔹 عرض المواصفات
const specsContainer = document.getElementById("productSpecs");
specsContainer.innerHTML = "";

if (product.specifications) {
  Object.entries(product.specifications).forEach(([key, value]) => {
    specsContainer.innerHTML += `
      <li>
        <span class="spec-key">${key}</span>
        <span class="spec-value">${value}</span>
      </li>
    `;
  });
}

// 🔹 عرض المعلومات الإضافية
const additionalInfoContainer = document.getElementById(
  "productAdditionalInfo"
);
additionalInfoContainer.innerHTML = "";

if (product.additional_info) {
  product.additional_info.forEach(info => {
    additionalInfoContainer.innerHTML += `<li>${info}</li>`;
  });
}


// 🔹 عرض الملحقات
const accessoriesContainer = document.getElementById("productAccessories");
const accessoriesTabBtn = document.querySelector('[data-tab="accessories"]');

accessoriesContainer.innerHTML = "";

if (product.accessories) {
  // لو كانت String
  if (typeof product.accessories === "string") {
    accessoriesContainer.innerHTML = `<li>${product.accessories}</li>`;
  }

  // لو كانت Array (مستقبلاً)
  if (Array.isArray(product.accessories)) {
    product.accessories.forEach(item => {
      accessoriesContainer.innerHTML += `<li>${item}</li>`;
    });
  }
} else {
  // لو مفيش ملحقات → نخفي التاب
  accessoriesTabBtn.style.display = "none";
}


    // 🔹 عرض الصور الرئيسية والمصغرة
    const mainImage = document.getElementById("mainImage");
    const thumbnailContainer = document.getElementById("thumbnailContainer");

    if (product.images && product.images.length > 0) {
      mainImage.src = product.images[0]; // أول صورة رئيسية

      thumbnailContainer.innerHTML = ""; // تنظيف أي محتوى سابق
      product.images.forEach((imgSrc, index) => {
        const thumb = document.createElement("img");
        thumb.src = imgSrc;
        thumb.className = "thumbnail";
        thumb.alt = `${product.name} ${index + 1}`;

        thumb.addEventListener("click", () => {
          mainImage.src = imgSrc; // عند الضغط على مصغرة، تصبح رئيسية
        });

        thumbnailContainer.appendChild(thumb);
      });
    } else {
      // إذا ما فيش مصفوفة images، استخدم img الرئيسي
      mainImage.src = product.img;
    }

    // 🔹 إعداد زر Add to Cart
    const addToCartBtn = document.getElementById("addToCartBtn");
    addToCartBtn.setAttribute("data-id", product.id);

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const alreadyInCart = cart.find(item => item.id == product.id);

    if (alreadyInCart) {
      addToCartBtn.classList.add("active");
      addToCartBtn.textContent = "تمت الإضافة";
    }

    addToCartBtn.addEventListener("click", () => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const exists = cart.find(item => item.id == product.id);

      if (!exists) {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          img: product.images ? product.images[0] : product.img,
          quantity: 1
        });

        localStorage.setItem("cart", JSON.stringify(cart));
        if (typeof updateCart === "function") updateCart();

        addToCartBtn.classList.add("active");
        addToCartBtn.textContent = "تمت الإضافة";
        showToast("تمت الإضافة إلى السلة!");
      }
    });

    document.addEventListener("cartUpdated", () => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const exists = cart.find(item => item.id == product.id);

      if (!exists) {
        addToCartBtn.classList.remove("active");
        addToCartBtn.textContent = "إضافة إلي السلة";
      }
    });

// 🔹 زر Buy Now
const buyNowBtn = document.getElementById("buyNowBtn");
buyNowBtn.addEventListener("click", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const exists = cart.find(item => item.id == product.id);

  // 🔹 إضافة المنتج إلى السلة لو مش موجود
  if (!exists) {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.images ? product.images[0] : product.img,
      quantity: 1
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    // تحديث زر Add to Cart في الصفحة الحالية لو موجود
    const addToCartBtn = document.getElementById("addToCartBtn");
    addToCartBtn.classList.add("active");
    addToCartBtn.textContent = "تمت الإضافة";

    if (typeof updateCart === "function") updateCart();
  }

  // 🔹 التوجيه إلى صفحة checkout
  window.location.href = "checkout.html";
});

  });

// 🔹 دالة Toast
function showToast(message, duration = 2500) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

