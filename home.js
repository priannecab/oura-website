// Here are the three shirts we want to show.
// We keep each shirts  name, picture, page, and price in one place.
// When someone clicks a shirt, they go to that page.
const products = [
  { name: "OURA Regular Tee", image: "images/regular-tee-front.png", page: "regulartee-product-page.html", price: "\u20B1499" },
  { name: "OURA Ringer Tee", image: "images/ringer-tee-front.png", page: "ringertee-product-page.html", price: "\u20B1499" },
  { name: "OURA Oversized Tee", image: "images/oversized-tee-front.png", page: "oversizedtee-product-page.html", price: "\u20B1499" }
];

// this put the Ringer Tee in the middle when the page first opens.
let center = 1;

// This part shows all three shirts on the homepage.
function showProducts() {
  const cards = document.getElementById("productCards");
  cards.innerHTML = ""; // Remove the old cards before we add new ones.

  // First, we decide which shirt goes on the left, middle, and right.

  const order = [(center + 2) % 3, center, (center + 1) % 3];

  order.forEach(function(number, place) {
    // Get the shirt we want to show in this spot.
    const shirt = products[number];
    // Make a new box for that shirt.
    const card = document.createElement("div");

    // We make the middle shirt bigger so it stands out. itt acts as a carousel
    card.className = "product-item";
    if (place === 1) {
      card.className = "product-item featured";
    }

    // Now we put the picture, name, and price inside the card.
    card.innerHTML = `
      <a class="product-image-box" href="${shirt.page}" aria-label="View ${shirt.name}">
        <img src="${shirt.image}" alt="${shirt.name}">
      </a>
      <a class="product-name" href="${shirt.page}">${shirt.name}</a>
      <p class="product-price">${shirt.price}</p>
    `;

    cards.appendChild(card); // Add this finished card to the page.
  });
}

// When someone clicks the left arrow, we move to the previous shirt.
document.getElementById("previousProduct").addEventListener("click", function() {
  center = (center + 2) % 3;
  showProducts();
});

// When someone clicks the right arrow, we move to the next shirt.
document.getElementById("nextProduct").addEventListener("click", function() {
  center = (center + 1) % 3;
  showProducts();
});

// On a phone, this button opens and closes our menu.
const menuButton = document.getElementById("menuButton");
const homeMenu = document.getElementById("homeMenu");

menuButton.addEventListener("click", function() {
  // Toggle means we open the menu if it is closed, or close it if it is open.
  const isOpen = homeMenu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

// Finally, show the shirts as soon as the homepage is ready.
showProducts();