import { $ } from '../base/base.js';
import { PRODUCT_STORAGE_KEY } from '../base/constant.js'
import toast from '../component/toast.js';
import productGrids from '../component/product-grid.js'
import { setItemLocal } from '../component/localstorage.js'
import loadPaginate from '../component/pagination.js';


const productList = $("#product-grid");
const page = $(".page__paging")

const product = {
    currentPage: 1,
    pageLimit: 6,
    totalPage: 0,

    fetchProduct: function () {
        let products = [];
        const url = `http://localhost:3000/products`;
        const params = {
            _page: this.currentPage,
            _limit: this.pageLimit
        };

        axios.get(url, { params })
            .then(res => {
                products = res.data.data
                const pagination = res.data.pagination
                this.currentPage = pagination._page
                this.pageLimit = pagination._limit
                this.totalPage = pagination._totalRows
                const pageSize = Math.ceil(this.totalPage/this.pageLimit)
                loadPaginate( this.currentPage, pageSize)
                
                const htmls = products.map((product) => {
                    return productGrids(product)
                });
                productList.innerHTML = htmls.join("");
            })
            .catch(error => console.log(error))
    },

    handleEvents: function () {
        const _this = this
        let productCart = [];
        productList.addEventListener("click", e => {
            if (e.target.closest(".button__buy")) {
                productCart.push(JSON.parse(e.target.closest(".button__buy").dataset.value))
                setItemLocal(PRODUCT_STORAGE_KEY, productCart)
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

        page.addEventListener("click", e => {
            if (e.target.closest(".pre-page")) {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.fetchProduct()
                }
            }
        });
    
        page.addEventListener("click", e => {
            if (e.target.closest(".next-page")) {
                const pageSize = this.totalPage/this.pageLimit
                if (this.currentPage < Math.ceil(pageSize)) {
                    this.currentPage++;
                    this.fetchProduct()
                }
            }
        });

        page.addEventListener("click", e => {
            if (e.target.closest(".number-page")) {
                this.currentPage = e.target.closest(".number-page").dataset.id
                this.fetchProduct()
            }
        });
    },

    start: function () {
        this.fetchProduct();
        this.handleEvents();
    },
};

product.start()
