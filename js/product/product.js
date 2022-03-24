import { $ } from '../base/base.js';
import { PRODUCT_STORAGE_KEY } from '../base/constant.js'
import toast from '../component/toast.js';
import productGrids from '../component/product-grid.js'

const productList = $("#product-grid");

const product = {
    currentPage: 1,
    pageLimit: 6,

    fetchProduct: function () {
        let products = [];
        const url = `http://localhost:3000/products`;
        const params = {
            _page: this.currentPage,
            _limit: this.pageLimit
        };

        axios.get(url, { params })
            .then(res => {
                products = res.data
                const htmls = products.map((product, index) => {
                            return productGrids(product)
                });
                productList.innerHTML = htmls.join("");
            })
            .catch(error => console.log(error))
    },

    handleEvents: function () {
        let productCart = [];
        productList.addEventListener("click", e => {
            if (e.target.closest(".button__buy")) {
                productCart.push(JSON.parse(e.target.closest(".button__buy").dataset.value))
                localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(productCart))
                toast({
                    title: "Thành công!",
                    message: "Bạn đã thêm sản phẩm vào giỏ hàng.",
                    type: "success",
                    duration: 5000
                });
            } else {
                toast({
                    title: "Thất bại!",
                    message: "Có lỗi xảy ra, vui lòng thử lại.",
                    type: "error",
                    duration: 5000
                });
            }
        })
    },

    start: function () {
        this.fetchProduct();
        this.handleEvents();
    },
};

product.start()
