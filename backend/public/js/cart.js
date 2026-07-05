document.addEventListener('DOMContentLoaded', () => {
    const cartItems = document.querySelectorAll('.cart-item');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    const discountRow = document.querySelector('.discount-row');
    const discountEl = document.getElementById('cart-discount');
    
    let discountPercent = 0;

    const updateTotals = () => {
        let subtotal = 0;
        
        document.querySelectorAll('.cart-item').forEach(item => {
            const price = parseInt(item.getAttribute('data-price'));
            const qty = parseInt(item.querySelector('.qty-value').textContent);
            const itemTotal = price * qty;
            
            item.querySelector('.item-total-price').textContent = `${itemTotal} pts`;
            subtotal += itemTotal;
        });

        subtotalEl.textContent = `${subtotal} pts`;
        
        let discountAmt = 0;
        if (discountPercent > 0) {
            discountAmt = Math.round(subtotal * discountPercent);
            discountRow.style.display = 'flex';
            discountEl.textContent = `-${discountAmt} pts`;
        } else {
            discountRow.style.display = 'none';
        }
        
        const total = subtotal - discountAmt;
        totalEl.textContent = `${total} pts`;
    };

    cartItems.forEach(item => {
        const btnMinus = item.querySelector('.btn-minus');
        const btnPlus = item.querySelector('.btn-plus');
        const qtySpan = item.querySelector('.qty-value');

        btnPlus.addEventListener('click', () => {
            let qty = parseInt(qtySpan.textContent);
            qty++;
            qtySpan.textContent = qty;
            updateTotals();
        });

        btnMinus.addEventListener('click', () => {
            let qty = parseInt(qtySpan.textContent);
            if (qty > 1) {
                qty--;
                qtySpan.textContent = qty;
                updateTotals();
            } else if (qty === 1) {
                if(confirm('¿Deseas eliminar este producto del carrito?')) {
                    item.remove();
                    updateTotals();
                }
            }
        });
    });

    // Discount Code Logic (BONUS)
    const btnCoupon = document.getElementById('btnApplyCoupon');
    const inputCoupon = document.getElementById('couponCode');
    const msgCoupon = document.getElementById('discount-message');

    if(btnCoupon) {
        btnCoupon.addEventListener('click', () => {
            const code = inputCoupon.value.trim().toUpperCase();
            // Validar alfanumérico
            if (!/^[a-zA-Z0-9]+$/.test(code) && code !== "") {
                msgCoupon.textContent = 'El código debe ser alfanumérico.';
                msgCoupon.className = 'discount-message error';
                return;
            }

            if (code === 'VIMET20') {
                discountPercent = 0.20;
                msgCoupon.textContent = '¡Cupón VIMET20 aplicado! 20% de descuento.';
                msgCoupon.className = 'discount-message';
            } else if (code === '') {
                 discountPercent = 0;
                 msgCoupon.textContent = '';
                 msgCoupon.className = 'discount-message';
            } else {
                discountPercent = 0;
                msgCoupon.textContent = 'Cupón inválido o expirado.';
                msgCoupon.className = 'discount-message error';
            }
            updateTotals();
        });
    }
});
