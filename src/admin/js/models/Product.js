class Product {
  constructor(
    id,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    description,
    type
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.screen = screen;
    this.backCamera = backCamera;
    this.frontCamera = frontCamera;
    this.img = img;
    this.category = category;
    this.description = description;
    this.type = type;
  }
}

export default Product;
