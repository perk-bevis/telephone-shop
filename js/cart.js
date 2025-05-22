const container = document.querySelector(".product-list-container")

const cartContainer = document.querySelector(".product-entry")

let cart = JSON.parse(localStorage.getItem("cart")) || []

// const renderCart = async () => {
//     const response = await fetch('/../data.json')

//     const data = await response.json()

//     if (cart.length !== 0) {
//         return (cartContainer.innerHTML = cart.map(itemCart => {
//             console.log(itemCart)
//             let search = data.find(itemData => String(itemData.id) === String(itemCart.id)) || []

//             return `
//            <div class="card rounded-3 mb-4 product-item"> 
//                   <div class="card-body p-4">
//                     <div
//                       class="row d-flex justify-content-between align-items-center"
//                     >
//                       <div class="col-md-2 col-lg-2 col-xl-2">
//                         <img
//                           src="${search.img}"
//                           class="img-fluid rounded-3"
//                           alt="Iphone 15"
//                         />
//                       </div>
//                       <div class="col-md-3 col-lg-3 col-xl-3">
//                         <p class="lead fw-normal mb-2">${search.name}</p>
//                       </div>
//                       <div class="col-md-2 col-lg-2 col-xl-1 d-flex align-items-center justify-content-center">
//                         <input
//                           type="number"
//                           class="form-control form-control-sm quantity-input-visual"
//                           value="${itemCart.count}" 
//                           aria-label="Quantity" 
//                           min="1" data-index="${itemCart.id}"
//                         />
//                       </div>
//                       <div class="col-md-2 col-lg-2 col-xl-2 text-end">
//                         <h5 class="mb-0">${search.price}</h5>
//                       </div>
//                       <div class="col-md-2 col-lg-2 col-xl-2 text-end">
//                         <h5 class="mb-0">${search.price * itemCart.count}</h5>
//                       </div>
//                       <div class="col-md-1 col-lg-1 col-xl-2 text-end">
//                         <button type="button" class="btn btn-danger btn-sm">Remove</button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//             `
//         }).join("")
//     )
//     }
// }

const renderCart = async () => {
    // Lưu ý đường dẫn tới data.json: '/../data.json' có thể không đúng trong mọi trường hợp.
    // Nếu data.json cùng cấp với file HTML gốc, có thể dùng '/data.json' hoặc './data.json'.
    // Nếu file HTML nằm trong thư mục con, '../data.json' (không có / ở đầu) có thể đúng.
    const response = await fetch('/../data.json'); // Hoặc đường dẫn chính xác tới file data.json của bạn
    const data = await response.json();

    if (cart.length !== 0) {
        // cartContainer.innerHTML sẽ đưa tất cả HTML sản phẩm vào bên trong div class="product-entry" duy nhất.
        // Điều này đúng với cấu trúc HTML hiện tại của bạn.
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
                                onchange "update(${String(search.id)})"
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
                            <button type="button" class="btn btn-danger btn-sm" onclick="removeFromCart('${String(itemCart.id)}')">Xóa</button> </div>
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


// let update = (id) => {
//     if(cart.length !== 0){
//         let searchIndex = data.findIndex(itemCart => itemCart.id === id);
//         if(searchIndex !== -1){
//             let quantityElement = document.querySelector(id)
//             if(quantityElement){
//                 cart[searchIndex].count = parseInt(quantityElement.value, 10) || 0;

//                 localStorage.setItem("cart", JSON.stringify(cart))

//                 renderCart()
//             }
//         }
//     }
// }
let update = (productId) => {
    console.log(`[update] Bắt đầu hàm update với productId: ${productId}`);
    if (cart.length === 0) {
        console.log('[update] Giỏ hàng rỗng, không làm gì.');
        return;
    }

    const cartItemIndex = cart.findIndex(itemInCart => String(itemInCart.id) === String(productId));
    console.log(`[update] cartItemIndex tìm thấy: ${cartItemIndex}`);

    if (cartItemIndex !== -1) {
        console.log(`[update] Sản phẩm hiện tại trong giỏ hàng:`, JSON.parse(JSON.stringify(cart[cartItemIndex])));
        const quantityElement = document.getElementById(String(productId));

        if (quantityElement) {
            const newQuantity = parseInt(quantityElement.value, 10);
            console.log(`[update] Số lượng mới từ input: ${newQuantity}`);

            if (!isNaN(newQuantity) && newQuantity >= 1) {
                cart[cartItemIndex].count = newQuantity;
                console.log(`[update] Số lượng sản phẩm trong cart đã cập nhật: ${cart[cartItemIndex].count}`);
                localStorage.setItem("cart", JSON.stringify(cart));
                console.log(`[update] localStorage đã cập nhật. Giỏ hàng hiện tại:`, JSON.parse(JSON.stringify(cart)));
                console.log(`[update] Đang gọi renderCart()...`);
                renderCart();
            } else {
                quantityElement.value = cart[cartItemIndex].count; // Đặt lại nếu không hợp lệ
                console.warn(`[update] Số lượng không hợp lệ: ${newQuantity}. Đã đặt lại input.`);
            }
        } else {
            console.error(`[update] Không tìm thấy quantityElement cho ID: ${productId}`);
        }
    } else {
        console.error(`[update] Không tìm thấy sản phẩm với ID ${productId} trong giỏ hàng.`);
    }
};
renderCart()