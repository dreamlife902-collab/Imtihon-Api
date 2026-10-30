const search = document.querySelector("#search");
const categorySelect = document.querySelector("#category");
const sortSelect = document.querySelector("#sort");
const products = document.querySelector(".products");
const message = document.querySelector(".message");
let allProducts = [];
function renderProducts() {
    const query = search.value.trim().toLowerCase();
    const selectedCategory = categorySelect.value;
    const sort = sortSelect.value;
    const visibleProducts = allProducts
        .filter((product) =>
            (!selectedCategory || product.category === selectedCategory) &&
            `${product.title} ${product.category} ${product.description}`.toLowerCase().includes(query)
        )
        .sort((a, b) => sort === "price-desc" ? b.price - a.price : a.price - b.price);
    products.replaceChildren();
    message.textContent = visibleProducts.length ? "" : "Mahsulot topilmadi";
    visibleProducts.forEach((product) => {
        const card = document.createElement("article");
        card.className = "card";
        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.title;
        image.referrerPolicy = "no-referrer";
        image.onerror = () => {
            if (image.dataset.proxyTried) return;
            image.dataset.proxyTried = "true";
            image.src = `https://images.weserv.nl/?url=${encodeURIComponent(product.image.replace(/^https?:\/\//, ""))}`;
        };
        const title = document.createElement("h2");
        title.textContent = product.title;
        const category = document.createElement("p");
        category.textContent = product.category;
        const rating = document.createElement("p");
        rating.textContent = `Reyting: ${product.rating.rate} (${product.rating.count} ta baho)`;
        const price = document.createElement("p");
        price.className = "price";
        price.textContent = `$${product.price.toFixed(2)}`;

        card.append(image, title, category, rating, price);
        products.append(card);
    });
}
search.addEventListener("input", renderProducts);
categorySelect.addEventListener("change", renderProducts);
sortSelect.addEventListener("change", renderProducts);
fetch("https://fakestoreapi.com/products")
    .then((response) => {
        if (!response.ok) throw new Error(`API xatosi: ${response.status}`);
        return response.json();
    })
    .then((data) => {
        allProducts = data;
        [...new Set(data.map((product) => product.category))]
            .sort()
            .forEach((category) => categorySelect.add(new Option(category, category)));
        renderProducts();
    })
    .catch((error) => {
        message.textContent = "Mahsulotlarni yuklab bo'lmadi. Internet ulanishini tekshiring.";
        console.error("Mahsulotlarni yuklash xatosi:", error);
    });