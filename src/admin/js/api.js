class API {
  fetchData() {
    const promise = axios({
      url: "https://676144756be7889dc36064eb.mockapi.io/Phone",
      method: "GET",
    });
    return promise;
  }

  deleteDataById(id) {
    const promise = axios({
      url: `https://676144756be7889dc36064eb.mockapi.io/Phone/${id}`,
      method: "DELETE",
    });
    return promise;
  }

  addData(product) {
    const promise = axios({
      url: `https://676144756be7889dc36064eb.mockapi.io/Phone/`,
      method: "POST",
      data: product,
    });
    return promise;
  }
}

export default new API();
