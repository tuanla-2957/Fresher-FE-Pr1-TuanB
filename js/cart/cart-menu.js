import { $ } from '../base/base.js';
import { PRODUCT_STORAGE_KEY } from '../base/constant.js'
import miniCart from '../component/cart-mini.js'
import { getItemLocal } from '../component/localstorage.js'

const megamenuCart = $(".mega-menu--cart")

const cartMenu = {
    products: getItemLocal(PRODUCT_STORAGE_KEY),

    loadCart: function() {
        let totalPrice = 0;
        const cart = this.products.map((product) => {
            totalPrice += product.sell
            return miniCart(product);
        })
        const htmls = `${cart}
            <div class="mega-menu__price">
                <span class="mega-menu__total">Tổng số</span>
                <span class="card__price">${totalPrice}đ</span></div>
            <div class="button button-dark">Giỏ Hàng</div>
        `
        megamenuCart.innerHTML = htmls;
    },

    init: function () {
        this.loadCart();
    }
}

cartMenu.init();
