import api from "../js/api.js";
import Product from "./models/Product.js";

const getEleId = (id) => document.getElementById(id);

const renderListProduct = (data) => {
  let content = "";

  data.forEach((product, i) => {
    content += `
        <tr>
            <td class="px-6 py-3">${i + 1}</td>
            <td class="px-6 py-3">${product.name}</td>
            <td>
                <img src="./img/${product.img}" width="100">
            </td>
            <td class="px-6 py-3">${product.type}</td>
            <td class="px-6 py-3">${product.price}</td>
            <td>
                <button data-modal-target="crud-modal" data-modal-toggle="crud-modal" class="btn bg-green-600 w-10 rounded-md text-white px-2 py-3" onclick="handleEdit('${
                  product.id
                }')">Edit</button>
                <button class="btn bg-red-600 w-20 rounded-md text-white px-3 py-3" onclick="handleDelete('${
                  product.id
                }')">Delete</button>
            </td>
        </tr>
        `;
  });
  getEleId("tblDanhSachSP").innerHTML = content;
};

// Handle DELETE
const handleDelete = (id) => {
  const promise = api.deleteDataById(id);
  promise
    .then((result) => {
      alert(`Delete product id ${result.data.id} success!`);
      // render lại
      getListProduct();
    })
    .catch((error) => {
      console.log(error);
    });
};
window.handleDelete = handleDelete;

const getListProduct = () => {
  const promise = api.fetchData();

  promise
    .then((result) => {
      renderListProduct(result.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

getListProduct();

// Handle add product
const handleAdd = () => {
  const name = getEleId("name").value;
  const price = getEleId("price").value;
  const screen = getEleId("screen").value;
  const backCamera = getEleId("backCamera").value;
  const frontCamera = getEleId("frontCamera").value;
  const img = getEleId("img").value;
  const desc = getEleId("description").value;
  const type = getEleId("category").value;

  // Tạo object product
  const product = new Product(
    "",
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    desc,
    type
  );
  const promise = api.addData(product);
  promise
    .then((result) => {
      console.log(result.data);
      getListProduct();
      getEleId("close").click();
    })
    .catch((error) => {
      console.log(error);
    });
};
window.handleAdd = handleAdd;
// const form = document.getElementById("addSP");
// form.addEventListener("click", (event) => {
//   event.preventDefault();
//   handleAdd();
// });

/**
 * Handle Edit
 */
const handleEdit = (id) => {
  const modal = getEleId("custom-modal");
  modal.classList.remove("hidden");

  setTimeout(() => {
    const closeModalBtn = getEleId("close-modal");
    if (closeModalBtn) {
      closeModalBtn.click();
    }
  }, 0); // Đảm bảo `click()` gọi sau khi DOM cập nhật.
};
window.handleEdit = handleEdit;
