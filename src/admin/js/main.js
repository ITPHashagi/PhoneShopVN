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
                <button class="btn bg-green-600 w-10 rounded-md text-white px-2 py-3">Edit</button>
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
  const screen = getEleId("").value;
  const img = getEleId("img").value;
  const category = getEleId("category").value;
  const desc = getEleId("description").value;

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
  console.log(product);
  const promise = api.addData(product);
  promise
    .then((result) => {
      console.log(result.data);
      alert(`Vừa thêm được sản phẩm ${result.data.id}`);
      getListProduct();
      getEleId("close").click();
    })
    .catch((error) => {
      console.log(error);
    });
};
window.handleAdd = handleAdd;
