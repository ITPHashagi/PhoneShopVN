// Hàm lấy phần tử theo ID
const getEleId = (id) => document.getElementById(id);

// Hàm render danh sách sản phẩm
const renderListProduct = (data) => {
  let content = "";

  data.forEach((product, index) => {
    const { img, name, price, screen, backCamera, frontCamera, desc, type } =
      product;

    content += `
      <!-- Sản phẩm -->
      <div class="product-card relative bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <!-- Hình ảnh sản phẩm -->
        <div class="relative">
          <img src="img/${img}" alt="${name}" class="w-full h-45 object-cover rounded-md" />
        </div>

        <!-- Thông tin chính -->
        <div class="mt-4 text-center">
          <p class="text-lg font-semibold text-gray-800">${name}</p>
          <p class="text-orange-500 font-bold mt-2 text-lg">$${price}</p>
        </div>

        <!-- Thông tin chi tiết (ẩn mặc định) -->
        <div id="productDetails${index}" class="hidden mt-4 text-gray-600 text-sm">
          <p><strong>Màn hình:</strong> ${screen}</p>
          <p><strong>Camera sau:</strong> ${backCamera}</p>
          <p><strong>Camera trước:</strong> ${frontCamera}</p>
          <p class="mt-2 text-gray-500"><strong>Mô tả:</strong> ${desc}</p>
        </div>

        <!-- Hai nút đặt cạnh nhau -->
        <div class="button-group flex justify-center gap-4 mt-4">
          <!-- Nút Xem Chi Tiết -->
          <button id="detailsButton${index}" class="details-btn px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300" onclick="toggleDetails(${index})">
            Xem Chi Tiết
          </button>

          <!-- Nút Thêm Giỏ Hàng -->
          <button class="btn-cart px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-300" onclick='addToCart(${JSON.stringify(
            product
          )})'>
            Thêm Giỏ Hàng
          </button>
        </div>
      </div>
    `;
  });

  // Gắn nội dung vào phần tử #mainProduct
  getEleId("mainProduct").innerHTML = content;
};

// Hàm fetch danh sách sản phẩm
const fetchListProduct = () => {
  // Hiển thị loader
  getEleId("loader").style.display = "block";

  axios({
    url: "https://676144756be7889dc36064eb.mockapi.io/Phone",
    method: "GET",
  })
    .then((result) => {
      const products = result.data;

      // Chỉ lấy 4 sản phẩm đầu tiên để hiển thị khi tải lại trang
      const firstPageProducts = products.slice(0, 4);
      renderListProduct(firstPageProducts);

      // Gọi phân trang để xử lý các sản phẩm còn lại
      handlePagination(products);

      // Ẩn loader
      getEleId("loader").style.display = "none";
    })
    .catch((error) => {
      console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
      // Ẩn loader
      getEleId("loader").style.display = "none";
    });
};

// Gọi hàm fetch danh sách sản phẩm khi trang được tải
fetchListProduct();

// Giỏ hàng
// Khởi tạo giỏ hàng toàn cục
let cart = [];

// Render giỏ hàng
const renderCart = () => {
  const cartItemsContainer = getEleId("cart-items");
  let totalPrice = 0;

  cartItemsContainer.innerHTML = cart
    .map((item) => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;

      return `
      <tr>
        <td>${item.name}</td>
        <td><img src="img/${item.img}" alt="${item.name}" class="w-16"></td>
        <td>$${item.price}</td>
        <td>$${itemTotal.toFixed(2)}</td>
        <td>
          <button onclick="updateQuantity(${item.id}, -1)">-</button>
          ${item.quantity}
          <button onclick="updateQuantity(${item.id}, 1)">+</button>
        </td>
        <td><button onclick="removeProduct(${item.id})">Xóa</button></td>
      </tr>
    `;
    })
    .join("");

  getEleId("total-price").innerText = `Tổng Tiền: $${totalPrice.toFixed(2)}`;
  updateCartCounter();
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
const updateQuantity = (id, change) => {
  const product = cart.find((item) => item.id == id);

  if (product) {
    product.quantity += change;
    if (product.quantity <= 0) {
      removeProduct(id);
    } else {
      renderCart();
      setLocalStorage();
    }
  }
};

// Thêm sản phẩm vào giỏ hàng
const addToCart = (product) => {
  if (!product || !product.id) {
    console.error("Sản phẩm không hợp lệ:", product);
    return;
  }

  // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    // Nếu sản phẩm đã có trong giỏ, chỉ cập nhật số lượng trong modal
    existingProduct.quantity += 1;
    renderCart(); // Cập nhật giỏ hàng (modal)
    setLocalStorage(); // Lưu giỏ hàng vào LocalStorage
  } else {
    // Nếu sản phẩm mới, thêm vào giỏ hàng và cập nhật counter
    cart.push({ ...product, quantity: 1 });
    updateCartCounter(); // Cập nhật số lượng trên biểu tượng giỏ hàng
    renderCart(); // Cập nhật giỏ hàng (modal)
    setLocalStorage(); // Lưu giỏ hàng vào LocalStorage
  }
};

// Cập nhật số lượng sản phẩm hiển thị trên biểu tượng giỏ hàng
const updateCartCounter = () => {
  const counter = getEleId("cart-counter");
  const mergedCart = [];

  // Duyệt qua từng sản phẩm trong giỏ hàng
  cart.forEach((product) => {
    const existingProduct = mergedCart.find(item => item.id === product.id);

    if (!existingProduct) {
      mergedCart.push({ ...product });
    }
  });
  const totalItems = mergedCart.length;
  counter.innerText = totalItems;
};

// Xóa sản phẩm khỏi giỏ hàng
const removeProduct = (id) => {
  cart = cart.filter((item) => item.id != id);
  renderCart();
  setLocalStorage();
};

// Xóa toàn bộ giỏ hàng
const clearCart = () => {
  cart = [];
  renderCart();
  setLocalStorage();
};

// Lưu giỏ hàng vào LocalStorage
const setLocalStorage = () => {
  try {
    localStorage.setItem("CART_LIST", JSON.stringify(cart));
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu vào LocalStorage:", error);
  }
};

// Lấy dữ liệu từ LocalStorage khi tải lại trang
const getLocalStorage = () => {
  try {
    const data = localStorage.getItem("CART_LIST");
    if (data) {
      cart = JSON.parse(data);
    } else {
      cart = []; // Nếu không có dữ liệu, khởi tạo giỏ hàng trống
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ LocalStorage:", error);
  }
};

// Hiển thị modal giỏ hàng
const showModal = () => {
  getEleId("cart-modal").classList.remove("hidden");
};

// Đóng modal giỏ hàng
const closeModal = () => {
  getEleId("cart-modal").classList.add("hidden");
};

// Tải danh sách sản phẩm và giỏ hàng khi trang được load

// fetchListProduct(); // Tải danh sách sản phẩm
getLocalStorage(); // Lấy dữ liệu giỏ hàng từ LocalStorage
renderCart(); // Hiển thị giỏ hàng
// handleSearchProduct(); // Tìm kiếm sản phẩm

// Gán các hàm vào window để dùng trong HTML
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeProduct = removeProduct;
window.clearCart = clearCart;
window.showModal = showModal;
window.closeModal = closeModal;

// Filter
// Hàm lọc sản phẩm theo tên
async function filterProductsByName() {
  const filterValue = document.getElementById("filter").value;

  // Fetch all products from the API
  const products = await fetchProducts(); // Use a separate function to fetch products

  let filteredProducts = [];

  if (filterValue === "all") {
    filteredProducts = products; // Hiển thị tất cả sản phẩm
  } else {
    filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(filterValue.toLowerCase())
    );
  }

  renderListProduct(filteredProducts); // Gọi hàm render UI với sản phẩm đã lọc
}

// Lắng nghe sự kiện onchange của dropdown
document
  .getElementById("filter")
  .addEventListener("change", filterProductsByName);

// Hàm fetch danh sách sản phẩm
const fetchProducts = async () => {
  try {
    const response = await axios.get(
      "https://676144756be7889dc36064eb.mockapi.io/Phone"
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
    return [];
  }
};

//Search
// Hàm chuẩn hóa và loại bỏ dấu
// Hàm chuẩn hóa và loại bỏ dấu
const normalizeString = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};

// Hàm tìm kiếm sản phẩm
const handleSearchProduct = async () => {
  const searchValue = getEleId("search").value.trim(); // Lấy giá trị tìm kiếm từ ô input

  // Chuẩn hóa giá trị tìm kiếm (xóa dấu, chuyển thành chữ thường)
  const normalizedSearchValue = normalizeString(searchValue);

  // Nếu ô tìm kiếm trống, hiển thị toàn bộ danh sách sản phẩm
  if (!normalizedSearchValue) {
    const allProducts = await fetchProducts(); // Fetch all products
    renderListProduct(allProducts);
    return;
  }

  try {
    // Lọc sản phẩm theo tên hoặc loại
    const products = await fetchProducts(); // Fetch all products

    const filteredProducts = products.filter((product) => {
      const normalizedName = normalizeString(product.name);
      const normalizedType = normalizeString(product.type);

      return (
        normalizedName.includes(normalizedSearchValue) ||
        normalizedType.includes(normalizedSearchValue)
      );
    });

    // Hiển thị danh sách sản phẩm phù hợp
    renderListProduct(filteredProducts);
  } catch (error) {
    console.error("Lỗi khi lọc sản phẩm:", error);
    renderListProduct([]); // Hiển thị danh sách trống nếu có lỗi
  }
};

// Lắng nghe sự kiện khi người dùng nhập từ khóa tìm kiếm
getEleId("search").addEventListener("input", handleSearchProduct);

// Pagination
// Phân trang
// Số sản phẩm hiển thị mỗi trang
const productsPerPage = 4;
let currentPage = 1;

// Hàm xử lý phân trang
const handlePagination = (products) => {
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Hàm render danh sách sản phẩm theo trang
  const renderPage = () => {
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const paginatedProducts = products.slice(start, end);

    // Render sản phẩm cho trang hiện tại
    renderListProduct(paginatedProducts);

    // Render nút phân trang
    renderPagination(totalPages);
  };

  // Hàm render nút phân trang
  const renderPagination = (totalPages) => {
    const paginationContainer = getEleId("pagination");
    let paginationContent = `
      <button class="py-2 px-4 text-gray-500 bg-white border rounded-l-lg hover:bg-gray-100 ${
        currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
      }" 
              ${currentPage === 1 ? "disabled" : ""} onclick="goToPage(${
      currentPage - 1
    })">
        Trước
      </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      paginationContent += `
        <button class="py-2 px-4 text-gray-500 bg-white border ${
          currentPage === i ? "bg-blue-500 text-white" : "hover:bg-gray-100"
        }" 
                onclick="goToPage(${i})">
          ${i}
        </button>
      `;
    }

    paginationContent += `
      <button class="py-2 px-4 text-gray-500 bg-white border rounded-r-lg hover:bg-gray-100 ${
        currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
      }" 
              ${
                currentPage === totalPages ? "disabled" : ""
              } onclick="goToPage(${currentPage + 1})">
        Tiếp
      </button>
    `;

    paginationContainer.innerHTML = paginationContent;
  };

  // Hàm chuyển đến trang cụ thể
  window.goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderPage();
  };

  // Hiển thị trang đầu tiên
  renderPage();
};
