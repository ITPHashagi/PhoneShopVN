class Feature {
  constructor() {
    this.arr = [];
  }
  filterPhone(type) {
    if (type == "all") {
      return this.arr;
    } else {
      let result = [];
      for (let i = 0; i < this.arr.length; i++) {
        const phone = this.arr[i];
        if (phone.type === type) {
          result.push(phone);
        }
      }
      return result;
    }
  }
  searchPhone(keyword) {
    let result = [];
    for (let i = 0; i < this.arr.length; i++) {
      let phone = this.arr[i];

      // Chuyển keyword và phone.name về chứ thường
      const keywordLowerKey = keyword.toLowerCase();
      const phoneNameLowerCase = phone.name.toLowerCase();
      if (phoneNameLowerCase.indexOf(keywordLowerKey) !== -1) {
        console.log(1);
        result.push(phone);
      }
    }
    return result;
  }
}
export default new Feature();
