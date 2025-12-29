import React from "react";
import { useCart } from "../CartContext";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiMinus,
  FiPlus,
  FiTrash,
  FiTrash2,
} from "react-icons/fi";
import { cartStyles } from "../assets/dummyStyles";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const getItemPrice = (item) => item.price ?? item.product?.price ?? 0;
  const getItemName = (item) =>
    item.name ?? item.product?.name ?? "Unnamed item";
  const getItemImage = (item) => {
    const path = item.image ?? item.product?.imageUrl ?? "";
    return path ? `https://rushbasket-grocery-websites-backend.onrender.com${path}` : "";
  };

  /// SubTotal
  const subtotal = cart.reduce((sum, item) => {
    return sum + getItemPrice(item) * item.quantity;
  }, 0);

  const handleQuantityChange = async (id, delta) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty > 0) {
      await updateQuantity(id, newQty);
    } else {
      await removeFromCart(id);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-emerald-900 via-emerald-950 to-black text-white px-4">
        <div className="text-center max-w-md">
          <Link
            to="/items"
            className="flex items-center justify-center text-emerald-400 hover:text-emerald-300 mb-6 transition-all duration-200"
          >
            <FiArrowLeft className="mr-2" />
            Continue Shopping
          </Link>

          <div className="bg-white/10 border border-emerald-500/40 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
            <div className="text-6xl mb-3">🛒</div>
            <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
            <p className="text-emerald-200 mb-6">
              Looks like you haven’t added any organic goodies yet!
            </p>
            <Link
              to="/items"
              className="bg-emerald-400 text-black font-semibold px-6 py-2 rounded-lg hover:bg-emerald-300 transition-all duration-300"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cartStyles.pageContainer}>
      <div className={cartStyles.maxContainerLarge}>
        <div className={cartStyles.headerContainer}>
          <h1 className={cartStyles.headerTitle}>Your Shopping Cart</h1>
          <button onClick={clearCart} className={cartStyles.clearCartButton}>
            <FiTrash className="mr-1" />
            Clear Cart
          </button>
        </div>

        <div className={cartStyles.cartGrid}>
          <div className={cartStyles.cartItemsSection}>
            <div className={cartStyles.cartItemsGrid}>
              {cart.map((item) => {
                const id = item.id;
                const name = getItemName(item);
                const price = getItemPrice(item);
                const img = getItemImage(item);

                return (
                  <div key={id} className={cartStyles.cartItemCard}>
                    <div className={cartStyles.cartItemImageContainer}>
                      {img ? (
                        <img
                          src={img}
                          alt={name}
                          className={cartStyles.cartItemImage}
                          onError={(e) => {
                            e.target.onError = null;
                            e.target.src = "/no-image.png";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full items-center justify-center bg-gray-200 text-gray-600 rounded">
                          No image
                        </div>
                      )}
                    </div>
                    <h3 className={cartStyles.cartItemName}>{name}</h3>
                    <p className={cartStyles.cartItemPrice}>
                      ₹{price.toFixed(2)}
                    </p>

                    <div className={cartStyles.cartItemQuantityContainer}>
                      <button
                        className={cartStyles.cartItemQuantityButton}
                        onClick={() => handleQuantityChange(id, -1)}
                      >
                        <FiMinus />
                      </button>
                      <span className={cartStyles.cartItemQuantity}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(id, 1)}
                        className={cartStyles.cartItemQuantityButton}
                      >
                        <FiPlus />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(id)}
                      className={cartStyles.cartItemRemoveButton}
                    >
                      <FiTrash2 className="mr-1" />
                      Remove Button
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          {/*Order Summery */}
          <div className="lg-col-span-1">
            <div className={cartStyles.orderSummaryCard}>
              <h2 className={cartStyles.orderSummaryTitle}>Order Summary</h2>

              <div className=" space-y-4 text-sm sm:text-base">
                <div className={cartStyles.orderSummaryRow}>
                  <span className={cartStyles.orderSummaryLabel}>Subtotal</span>
                  <span className={cartStyles.orderSummaryValue}>
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className={cartStyles.orderSummaryRow}>
                  <span className={cartStyles.orderSummaryLabel}>Shipping</span>
                  <span className={cartStyles.orderSummaryValue}>Free</span>
                </div>

                <div className={cartStyles.orderSummaryRow}>
                  <span className={cartStyles.orderSummaryLabel}>
                    Taxes (5%)
                  </span>
                  <span className={cartStyles.orderSummaryValue}>
                    ₹{(subtotal * 0.05).toFixed(2)}
                  </span>
                </div>

                <div className={cartStyles.orderSummaryDivider}></div>

                <div className={cartStyles.orderSummaryTotalRow}>
                  <span className={cartStyles.orderSummaryTotalLabel}>
                    Total
                  </span>
                  <span className={cartStyles.orderSummaryTotalValue}>
                    ₹{(subtotal * 1.05).toFixed(2)}
                  </span>
                </div>
              </div>

              <button className={cartStyles.checkoutButton}>
                <Link to="/checkout">Proceed to checkout</Link>
              </button>

              <div className={cartStyles.continueShoppingBottom}>
                <Link to="/item" className={cartStyles.continueShopping}>
                  <FiArrowLeft className="mr-2" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

// import React from "react";
// import { useCart } from "../CartContext";
// import { Link } from "react-router-dom";
// import {
//   FiArrowLeft,
//   FiMinus,
//   FiPlus,
//   FiTrash,
//   FiTrash2,
// } from "react-icons/fi";
// import { cartStyles } from "../assets/dummyStyles";

// const CartPage = () => {
//   const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

//   // Always use cloudinary URLs directly (never prefix backend URL)
//   const getItemImage = (item) =>
//     item.image ||
//     item.product?.imageUrl ||
//     item.product?.image ||
//     "";

//   const getItemPrice = (item) => item.price ?? item.product?.price ?? 0;
//   const getItemName = (item) =>
//     item.name ?? item.product?.name ?? "Unnamed item";

//   // SubTotal
//   const subtotal = cart.reduce((sum, item) => {
//     return sum + getItemPrice(item) * item.quantity;
//   }, 0);

//   const handleQuantityChange = async (id, delta) => {
//     const item = cart.find((i) => i.id === id);
//     if (!item) return;

//     const newQty = item.quantity + delta;
//     if (newQty > 0) {
//       await updateQuantity(id, newQty);
//     } else {
//       await removeFromCart(id);
//     }
//   };

//   if (!cart || cart.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-emerald-900 via-emerald-950 to-black text-white px-4">
//         <div className="text-center max-w-md">
//           <Link
//             to="/items"
//             className="flex items-center justify-center text-emerald-400 hover:text-emerald-300 mb-6 transition-all duration-200"
//           >
//             <FiArrowLeft className="mr-2" />
//             Continue Shopping
//           </Link>

//           <div className="bg-white/10 border border-emerald-500/40 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
//             <div className="text-6xl mb-3">🛒</div>
//             <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
//             <p className="text-emerald-200 mb-6">
//               Looks like you haven’t added any organic goodies yet!
//             </p>
//             <Link
//               to="/items"
//               className="bg-emerald-400 text-black font-semibold px-6 py-2 rounded-lg hover:bg-emerald-300 transition-all duration-300"
//             >
//               Browse Products
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={cartStyles.pageContainer}>
//       <div className={cartStyles.maxContainerLarge}>
//         <div className={cartStyles.headerContainer}>
//           <h1 className={cartStyles.headerTitle}>Your Shopping Cart</h1>
//           <button onClick={clearCart} className={cartStyles.clearCartButton}>
//             <FiTrash className="mr-1" />
//             Clear Cart
//           </button>
//         </div>

//         <div className={cartStyles.cartGrid}>
//           {/* CART ITEMS */}
//           <div className={cartStyles.cartItemsSection}>
//             <div className={cartStyles.cartItemsGrid}>
//               {cart.map((item) => {
//                 const id = item.id;
//                 const name = getItemName(item);
//                 const price = getItemPrice(item);
//                 const img = getItemImage(item);

//                 return (
//                   <div key={id} className={cartStyles.cartItemCard}>
//                     {/* IMAGE */}
//                     <div className={cartStyles.cartItemImageContainer}>
//                       {img ? (
//                         <img
//                           src={img}
//                           alt={name}
//                           className={cartStyles.cartItemImage}
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = "/no-image.png";
//                           }}
//                         />
//                       ) : (
//                         <div className="w-full h-full items-center justify-center bg-gray-200 text-gray-600 rounded">
//                           No image
//                         </div>
//                       )}
//                     </div>

//                     {/* NAME */}
//                     <h3 className={cartStyles.cartItemName}>{name}</h3>

//                     {/* PRICE */}
//                     <p className={cartStyles.cartItemPrice}>
//                       ₹{price.toFixed(2)}
//                     </p>

//                     {/* QUANTITY */}
//                     <div className={cartStyles.cartItemQuantityContainer}>
//                       <button
//                         className={cartStyles.cartItemQuantityButton}
//                         onClick={() => handleQuantityChange(id, -1)}
//                       >
//                         <FiMinus />
//                       </button>

//                       <span className={cartStyles.cartItemQuantity}>
//                         {item.quantity}
//                       </span>

//                       <button
//                         onClick={() => handleQuantityChange(id, 1)}
//                         className={cartStyles.cartItemQuantityButton}
//                       >
//                         <FiPlus />
//                       </button>
//                     </div>

//                     {/* REMOVE */}
//                     <button
//                       onClick={() => removeFromCart(id)}
//                       className={cartStyles.cartItemRemoveButton}
//                     >
//                       <FiTrash2 className="mr-1" />
//                       Remove
//                     </button>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* ORDER SUMMARY */}
//           <div className="lg-col-span-1">
//             <div className={cartStyles.orderSummaryCard}>
//               <h2 className={cartStyles.orderSummaryTitle}>Order Summary</h2>

//               <div className="space-y-4 text-sm sm:text-base">
//                 <div className={cartStyles.orderSummaryRow}>
//                   <span className={cartStyles.orderSummaryLabel}>Subtotal</span>
//                   <span className={cartStyles.orderSummaryValue}>
//                     ₹{subtotal.toFixed(2)}
//                   </span>
//                 </div>

//                 <div className={cartStyles.orderSummaryRow}>
//                   <span className={cartStyles.orderSummaryLabel}>Shipping</span>
//                   <span className={cartStyles.orderSummaryValue}>Free</span>
//                 </div>

//                 <div className={cartStyles.orderSummaryRow}>
//                   <span className={cartStyles.orderSummaryLabel}>
//                     Taxes (5%)
//                   </span>
//                   <span className={cartStyles.orderSummaryValue}>
//                     ₹{(subtotal * 0.05).toFixed(2)}
//                   </span>
//                 </div>

//                 <div className={cartStyles.orderSummaryDivider}></div>

//                 <div className={cartStyles.orderSummaryTotalRow}>
//                   <span className={cartStyles.orderSummaryTotalLabel}>
//                     Total
//                   </span>
//                   <span className={cartStyles.orderSummaryTotalValue}>
//                     ₹{(subtotal * 1.05).toFixed(2)}
//                   </span>
//                 </div>
//               </div>

//               <button className={cartStyles.checkoutButton}>
//                 <Link to="/checkout">Proceed to checkout</Link>
//               </button>

//               <div className={cartStyles.continueShoppingBottom}>
//                 <Link to="/items" className={cartStyles.continueShopping}>
//                   <FiArrowLeft className="mr-2" />
//                   Continue Shopping
//                 </Link>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartPage;
