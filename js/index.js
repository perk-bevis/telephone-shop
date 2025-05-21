const productContainer = document.querySelector("#row-product");
// async là hàm bất đồng bộ trả về promite
const getData = async () => {
  const response = await fetch("data.json");
  const data = await response.json();
  if (data) {
    productContainer.innerHTML = data
      .map((item) => {
        return `
    <div class="col-lg-4 col-md-6 mb-4">
          <div class="card">
            <div
              class="bg-image hover-zoom ripple ripple-surface ripple-surface-light"
              data-mdb-ripple-color="light"
            >
              <img
                 src="${item.img}"
                class="w-100"
              />
              <a href="desciption.html?id=${item.id}">
                <div class="mask">
                  <div
                    class="d-flex justify-content-start align-items-end h-100"
                  >
                    <h5><span class="badge bg-success ms-2">Eco</span></h5>
                  </div>
                </div>
                <div class="hover-overlay">
                  <div
                    class="mask"
                    style="background-color: rgba(251, 251, 251, 0.15)"
                  ></div>
                </div>
              </a>
            </div>
            <div class="card-body">
              <a href="" class="text-reset">
                <h5 class="card-title mb-3">${item.name}</h5>
              </a>
              <h6 class="mb-3">${item.price}</h6>
              <a href="desciption.html?id=${item.id}">
                <button class="btn btn-primary">Add to cart</button>
              </a>
            </div>
          </div>
      </div>
    `;
      }).join("");
  }
};

getData();
