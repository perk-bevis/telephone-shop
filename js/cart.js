const container = document.querySelector(".product-list-container")

const cartContainer = document.querySelector(".product-entry")

const cartSumary = document.querySelector(".cart-sumary")

let cart = JSON.parse(localStorage.getItem("cart")) || []

const renderCart = async () => {
    const response = await fetch('/../data.json'); // Hoặc đường dẫn chính xác tới file data.json của bạn
    const data = await response.json();

    if (cart.length !== 0) {
        // cartContainer.innerHTML sẽ đưa tất cả HTML sản phẩm vào bên trong div class="product-entry" duy nhất.
        cartContainer.innerHTML = cart.map(itemCart => {

            // So sánh ID dưới dạng chuỗi để đảm bảo tính nhất quán
            let search = data.find(itemData => String(itemData.id) === String(itemCart.id));
            // --- PHẦN QUAN TRỌNG: SỬA LỖI NaN CHO GIÁ --
            let unitPrice; // Giá mỗi sản phẩm
            if (typeof search.price === 'string') {
                // Loại bỏ ký tự tiền tệ (như $, €) và các ký tự không phải số khác,
                // chỉ giữ lại số và dấu chấm thập phân (nếu có).
                unitPrice = parseFloat(search.price.replace(/[^0-9.]+/g, ""));
            } else {
                unitPrice = parseFloat(search.price); // Chuyển đổi trực tiếp nếu đã là số hoặc chuỗi chỉ chứa số
            }

            const quantity = parseInt(itemCart.count, 10); // Đảm bảo số lượng là số nguyên

            let lineTotal = NaN; // Tổng tiền cho sản phẩm này, mặc định là NaN
            if (!isNaN(unitPrice) && !isNaN(quantity)) {
                lineTotal = unitPrice * quantity;
            } else {
                console.error('Lỗi tính tổng tiền: unitPrice hoặc quantity không phải là số hợp lệ.',
                    {
                        giaGoc: search.price,
                        giaDaXuLy: unitPrice,
                        soLuongTrongCart: itemCart.count,
                        soLuongDaXuLy: quantity
                    });
            }
            // --- KẾT THÚC PHẦN SỬA LỖI NaN ---

            // Định dạng giá tiền để hiển thị đẹp hơn (ví dụ: $61.99)
            const displayUnitPrice = !isNaN(unitPrice) ? `$${unitPrice.toFixed(2)}` : 'Giá không rõ';
            const displayLineTotal = !isNaN(lineTotal) ? `$${lineTotal.toFixed(2)}` : 'NaN'; // Vẫn hiển thị NaN nếu tính toán thất bại để dễ debug

            return `
            <div class="card rounded-3 mb-4 product-item">
                <div class="card-body p-4">
                    <div class="row d-flex justify-content-between align-items-center">
                        <div class="col-md-2 col-lg-2 col-xl-2">
                            <img
                                src="${search.img || 'images/default-placeholder.png'}" class="img-fluid rounded-3"
                                alt="${search.name || 'Hình ảnh sản phẩm'}"
                            />
                        </div>
                        <div class="col-md-3 col-lg-3 col-xl-3">
                            <p class="lead fw-normal mb-2">${search.name || 'Sản phẩm không rõ tên'}</p>
                        </div>
                        <div class="col-md-2 col-lg-2 col-xl-1 d-flex align-items-center justify-content-center">
                            <input
                                onchange = "update(${(search.id)})"
                                type="number"
                                class="form-control form-control-sm quantity-input-visual"
                                value="${quantity}"
                                aria-label="Quantity"
                                min="1" id="${search.id}" />
                        </div>
                        <div class="col-md-2 col-lg-2 col-xl-2 text-end">
                            <h5 class="mb-0">${displayUnitPrice}</h5>
                        </div>
                        <div class="col-md-2 col-lg-2 col-xl-2 text-end">
                            <h5 class="mb-0">${displayLineTotal}</h5>
                        </div>
                        <div class="col-md-1 col-lg-1 col-xl-2 text-end">
                            <button type="button" class="btn btn-danger btn-sm" onclick="removeItem('${String(search.id)}')">remove</button> </div>
                    </div>
                </div>
            </div>
            `;
        }).join("");
    }
    else {
        cartContainer.innerHTML = '<div class="text-center p-4"><p>Giỏ hàng của bạn đang trống.</p></div>';
    }
};
let update = (productId) => { // Đổi tên tham số thành productId cho rõ ràng
    if (cart.length !== 0) {
        // Tìm sản phẩm trong mảng 'cart' (giỏ hàng của bạn)
        let searchIndex = cart.findIndex(itemInCart => String(itemInCart.id) === String(productId));

        if (searchIndex !== -1) { // Nếu tìm thấy sản phẩm trong giỏ hàng
            // Lấy phần tử input bằng ID (ID này được gán trong renderCart)
            let quantityElement = document.getElementById(String(productId));

            if (quantityElement) {
                let newQuantity = parseInt(quantityElement.value, 10);

                // Kiểm tra số lượng mới có hợp lệ không (là số và >= 1)
                if (!isNaN(newQuantity) && newQuantity >= 1) {
                    cart[searchIndex].count = newQuantity;
                    localStorage.setItem("cart", JSON.stringify(cart));
                    renderCart(); // Gọi lại renderCart để cập nhật giao diện

                    totalProduct()
                } else {
                    // Nếu số lượng không hợp lệ, đặt lại giá trị input về giá trị cũ trong giỏ hàng
                    quantityElement.value = cart[searchIndex].count;
                    console.warn("Số lượng nhập vào không hợp lệ, đã khôi phục số lượng cũ.");
                }
            } else {
                console.error("Không tìm thấy phần tử input số lượng cho ID:", productId);
            }
        } else {
            console.error("Không tìm thấy sản phẩm với ID:", productId, "trong giỏ hàng.");
        }
    }
};
let totalProduct = async () => {
    let response;
    let data;

    try {
        response = await fetch("../data.json"); // Đảm bảo đường dẫn này đúng
        if (!response.ok) {
            // Nếu lỗi HTTP (ví dụ 404 Not Found), báo lỗi và thoát
            console.error(`Lỗi HTTP khi tải data.json: ${response.status}`);
            cartSumary.innerHTML = `<div class="text-danger p-4">Lỗi tải dữ liệu sản phẩm (HTTP ${response.status}).</div>`;
            return;
        }
        data = await response.json();
    } catch (error) {
        // Nếu có lỗi mạng hoặc lỗi parse JSON
        console.error("Không thể tải hoặc parse data.json trong totalProduct:", error);
        cartSumary.innerHTML = `<div class="text-danger p-4">Không thể kết nối đến dữ liệu sản phẩm.</div>`;
        return; // Thoát sớm nếu không tải được dữ liệu
    }

    if (cart.length !== 0) {
        let totalAmount = 0; // Khởi tạo tổng tiền

        for (const cartItem of cart) { // Duyệt qua từng sản phẩm trong giỏ hàng
            const productData = data.find(itemData => String(itemData.id) === String(cartItem.id));

            if (productData && typeof productData.price !== 'undefined') { // Kiểm tra sản phẩm có tồn tại và có giá không
                let unitPrice;
                // Xử lý giá tương tự như trong renderCart
                if (typeof productData.price === 'string') {
                    unitPrice = parseFloat(productData.price.replace(/[^0-9.]+/g, ""));
                } else {
                    unitPrice = parseFloat(productData.price);
                }

                const quantity = parseInt(cartItem.count, 10);

                if (!isNaN(unitPrice) && !isNaN(quantity) && quantity > 0) {
                    totalAmount += unitPrice * quantity;
                } else {
                    console.warn('Sản phẩm trong giỏ hàng có giá hoặc số lượng không hợp lệ:', {
                        cartItemId: cartItem.id,
                        priceFromData: productData.price,
                        parsedUnitPrice: unitPrice,
                        quantityInCart: cartItem.count,
                        parsedQuantity: quantity
                    });
                }
            } else {
                console.warn(`Không tìm thấy thông tin sản phẩm hoặc giá cho ID: ${cartItem.id} trong data.json khi tính tổng.`);
            }
        }

        // Định dạng tổng tiền để hiển thị (ví dụ: $123.45)
        const displayTotalAmount = `$${totalAmount.toFixed(2)}`;

        cartSumary.innerHTML = `
        <div class="cart-sumary card mb-4">
            <div class="card-body p-4">
                <div class="row align-items-center">
                    <div class="col-lg-7 col-md-6 mb-3 mb-md-0">
                        <h5 class="mb-0">Total Product: ${displayTotalAmount}</h5>
                    </div>
                    <div class="col-lg-5 col-md-6">
                        <button type="button" class="btn btn-success d-block w-100 mb-2">
                            Checkout
                        </button>
                        <button type="button" class="btn btn-danger d-block w-100" onclick="clearCart()">
                            Clear Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
    } else {
        cartSumary.innerHTML = '<div class="text-center p-4"><p>Giỏ hàng của bạn đang trống. Tổng tiền sẽ hiển thị ở đây.</p></div>';
    }
};

let removeItem = ((id) => {
    let removeId = id;
    cart = cart.filter((item) => String(item.id) !== String(removeId))
    renderCart();
    totalProduct();
    localStorage.setItem("cart",JSON.stringify(cart))
})

let clearCart = (()=>{
    cart = []
    renderCart()
    localStorage.setItem("cart",JSON.stringify(cart))
})
renderCart();
totalProduct();
