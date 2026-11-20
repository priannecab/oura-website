document.addEventListener("DOMContentLoaded", () => {
  const ORDER_EMAIL = "orders@examplewebsite142.com";
  const STORAGE_KEY = "oura_email_order_basket";

  const productTitleEl = document.getElementById("productName");
  const productName = productTitleEl ? productTitleEl.textContent.trim() : "OURA Ringer Tee";
  const unitPrice = Number(productTitleEl?.dataset.price) || 499;

  let selectedSize = "M"; 
  let quantity = 1;
  let memoryBasket = [];
  let currentSlide = 0;

  const carouselEl = document.getElementById("productCarousel");
  const slides = carouselEl ? Array.from(carouselEl.querySelectorAll(".carousel-item")) : [];
  const prevSlideBtn = document.getElementById("prevSlideBtn");
  const nextSlideBtn = document.getElementById("nextSlideBtn");
  const thumbButtons = document.querySelectorAll(".thumb-card");
  const sizeChartBtn = document.getElementById("sizeChartBtn");

  const sizeButtons = document.querySelectorAll(".size-btn:not(:disabled)");
  const qtyDecreaseBtn = document.getElementById("qtyDecrease");
  const qtyIncreaseBtn = document.getElementById("qtyIncrease");
  const qtyDisplayEl = document.getElementById("qtyValue");

  const putInBasketBtn = document.getElementById("putInBasketBtn");
  const getNowBtn = document.getElementById("getNowBtn");
  const basketFeedbackEl = document.getElementById("basketFeedback");

  let bsCarousel = null;
  if (typeof window.bootstrap !== "undefined" && window.bootstrap.Carousel && carouselEl) {
    try {
      bsCarousel = new window.bootstrap.Carousel(carouselEl, {
        interval: false,
        wrap: true
      });
    } catch (e) {
      bsCarousel = null;
    }
  }

  function updateThumbnailHighlight(activeIndex) {
    thumbButtons.forEach((btn) => {
      const targetIndex = Number(btn.dataset.slideIndex);
      btn.classList.toggle("active", targetIndex === activeIndex);
    });
  }

  function goToSlide(index) {
    if (!slides.length) return;
    const normalizedIndex = (index + slides.length) % slides.length;
    currentSlide = normalizedIndex;

    if (bsCarousel) {
      bsCarousel.to(normalizedIndex);
    } else {
      slides.forEach((slide, idx) => {
        slide.classList.toggle("active", idx === normalizedIndex);
      });
    }
    updateThumbnailHighlight(normalizedIndex);
  }

  if (carouselEl) {
    carouselEl.addEventListener("slid.bs.carousel", (event) => {
      currentSlide = event.to;
      updateThumbnailHighlight(event.to);
    });
  }

  if (!bsCarousel) {
    prevSlideBtn?.addEventListener("click", () => goToSlide(currentSlide - 1));
    nextSlideBtn?.addEventListener("click", () => goToSlide(currentSlide + 1));
  }

  thumbButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      goToSlide(Number(btn.dataset.slideIndex));
    });
  });

  sizeChartBtn?.addEventListener("click", () => {
    goToSlide(3);
  });

  function getSavedBasket() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        memoryBasket = JSON.parse(raw);
      }
    } catch (e) {
    }
    return [...memoryBasket];
  }

  function saveBasket(items) {
    memoryBasket = [...items];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
    }
  }

  function buildMailtoHref(includeCurrentSelection = true) {
    const orderItems = getSavedBasket();

    if (includeCurrentSelection) {
      const existingIndex = orderItems.findIndex(
        (item) => item.product === productName && item.size === selectedSize
      );

      if (existingIndex > -1) {
        orderItems[existingIndex] = {
          ...orderItems[existingIndex],
          quantity: orderItems[existingIndex].quantity + quantity
        };
      } else {
        orderItems.push({
          product: productName,
          size: selectedSize,
          quantity: quantity,
          unitPrice: unitPrice
        });
      }
    }

    let grandTotal = 0;
    const itemLines = orderItems.map((item, idx) => {
      const subtotal = item.unitPrice * item.quantity;
      grandTotal += subtotal;
      return `${idx + 1}. ${item.product} | Size: ${item.size} | Qty: ${item.quantity} | Subtotal: PHP ${subtotal}`;
    });

    const subject = encodeURIComponent(`T-Shirt Order: ${productName}`);
    const bodyText = [
      "Hello OURA Team,",
      "",
      "I would like to place the following order:",
      "",
      ...itemLines,
      "",
      `Estimated Total: PHP ${grandTotal}`,
      "",
      "Customer Details:",
      "Name: ",
      "Shipping Address: ",
      "Contact Number: ",
      "",
      "Thank you!"
    ].join("\n");

    return `mailto:${ORDER_EMAIL}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
  }

  function syncGetNowLink() {
    if (getNowBtn) {
      getNowBtn.setAttribute("href", buildMailtoHref(true));
    }
  }

  sizeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      sizeButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedSize = btn.dataset.size;
      syncGetNowLink();
    });
  });

  qtyDecreaseBtn?.addEventListener("click", () => {
    if (quantity > 1) {
      quantity -= 1;
      qtyDisplayEl.textContent = quantity;
      syncGetNowLink();
    }
  });

  qtyIncreaseBtn?.addEventListener("click", () => {
    quantity += 1;
    qtyDisplayEl.textContent = quantity;
    syncGetNowLink();
  });

  putInBasketBtn?.addEventListener("click", () => {
    const basket = getSavedBasket();
    const existingIndex = basket.findIndex(
      (item) => item.product === productName && item.size === selectedSize
    );

    if (existingIndex > -1) {
      basket[existingIndex].quantity += quantity;
    } else {
      basket.push({
        product: productName,
        size: selectedSize,
        quantity: quantity,
        unitPrice: unitPrice
      });
    }

    saveBasket(basket);
    syncGetNowLink();

    const totalItems = basket.reduce((sum, item) => sum + item.quantity, 0);
    if (basketFeedbackEl) {
      basketFeedbackEl.textContent = `Saved ${quantity}x ${productName} (Size ${selectedSize}) to your order email (${totalItems} item${totalItems > 1 ? "s" : ""} in basket).`;
    }
  });

  syncGetNowLink();
});