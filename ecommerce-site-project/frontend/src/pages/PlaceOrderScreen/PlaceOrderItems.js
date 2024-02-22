import CartItem from '../CartScreen/CartItem';
import placeOrderScreenStyle from './PlaceOrderScreen.module.css';

const PlaceOrderItems = (props) => {
  return (
    <div className={placeOrderScreenStyle.placeOrderScreenItemsContainer}>
      <ul className={placeOrderScreenStyle.placeOrderScreenItems}>
        <h2 className={placeOrderScreenStyle.placeOrderSubTitleItems}>Items</h2>
        {props.cart.length > 0 ? (
          props.cart.map((item) => (
            <CartItem
              item={item}
              key={item.sku}
              ctxDispatch={props.ctxDispatch}
            />
          ))
        ) : (
          <p className={placeOrderScreenStyle.placeOrderScreenAddress}>
            {'Your cart is empty.'}
          </p>
        )}
      </ul>
    </div>
  );
};

export default PlaceOrderItems;
