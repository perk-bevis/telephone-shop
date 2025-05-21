const desciptionContainer = document.querySelector(".container")
const btnBuyNow = document.getElementById("cart")
// Khai báo một hàm bất đồng bộ (async function) tên là desciptionProduct.
//➡ Vì bạn sẽ sử dụng await để lấy dữ liệu từ file JSON, nên hàm này cần async.
const desciptionProduct = async () => {
    // Tạo một đối tượng URLSearchParams để phân tích phần tham số truy vấn (query string) trên URL (phần sau dấu ?). Ví dụ: nếu URL là .../product.html?id=5, thì window.location.search sẽ là "?id=5", và path.get("id") sẽ lấy ra "5".
    const path = new URLSearchParams(window.location.search)
    // Lấy giá trị của tham số id từ URL. ➡ Ví dụ nếu URL là .../product.html?id=3, thì productId sẽ là "3" (kiểu chuỗi).
    const productId = path.get("id")
    //Dùng fetch để gửi yêu cầu tới file data.json (nằm ở thư mục cha - ../) và đợi phản hồi. ➡ await giúp tạm dừng chương trình cho đến khi dữ liệu được tải xong.
    const response = await fetch ("../data.json")
    //Chuyển đổi phản hồi từ fetch (dạng thô) thành đối tượng JavaScript (hoặc mảng) bằng response.json().
    const data = await response.json()
    // Tìm phần tử trong mảng data mà item.id === productId. ➡ Trả về sản phẩm có id đúng với productId lấy từ URL.
    const findProduct = data.find((item) => item.id.toString() === productId.toString())
    // console.log(findProduct)
    desciptionContainer.innerHTML = `
     <div class="row justify-content-center mb-3">
          <div class="col-md-12 col-xl-10">
            <div class="card shadow-0 border rounded-3">
              <div class="card-body">
                <div class="row">
                  <div class="col-md-12 col-lg-3 col-xl-3 mb-4 mb-lg-0">
                    <div
                      class="bg-image hover-zoom ripple rounded ripple-surface"
                    >
                      <img
                        src="${findProduct.img}"
                        class="w-100"
                      />
                      <a href="#!">
                        <div class="hover-overlay">
                          <div
                            class="mask"
                            style="background-color: rgba(253, 253, 253, 0.15)"
                          ></div>
                        </div>
                      </a>
                    </div>
                  </div>
                  <div class="col-md-6 col-lg-6 col-xl-6">
                    <h5>${findProduct.name}</h5>
                    <p class="text-truncate mb-4 mb-md-0">
                      ${findProduct.badges}
                    </p>
                  </div>
                  <div
                    class="col-md-6 col-lg-3 col-xl-3 border-sm-start-none border-start"
                  >
                    <div class="d-flex flex-row align-items-center mb-1">
                      <h4 class="mb-1 me-1">$13.99</h4>
                    </div>
                    <div class="d-flex flex-column mt-4">
                      <button id="add-to-cart-btn" class="btn btn-primary btn-sm" type="button">
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    `
    console.log(desciptionContainer)
    const addToCartBtn = document.getElementById("add-to-cart-btn")

    addToCartBtn.addEventListener("click",() =>{
        const cart = JSON.parse(localStorage.getItem("cart")) || []
        // console.log(cart)
        if(cart) {
          const item = cart.findIndex(item => item.id === findProduct.id)
          // console.log(item)
          if(item !== -1){
            cart[item].count += 1
          }else{
            cart.push(
              {
                id: findProduct.id, 
                image: findProduct.img,
                name: findProduct.name,
                badges: findProduct.badges,
                count: 1
              }
            )
          }

          localStorage.setItem("cart", JSON.stringify(cart))
        }else{
          const cart = [
            {
              id: findProduct.id, 
              image: findProduct.img,
              name: findProduct.name,
              badges: findProduct.badges,
              count: 1
            }
          ]

          localStorage.setItem("cart", JSON.stringify(cart))
        }
    })
}

desciptionProduct()
