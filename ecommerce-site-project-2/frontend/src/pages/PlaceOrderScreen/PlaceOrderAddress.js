import placeOrderScreenStyle from './PlaceOrderScreen.module.css';

const PlaceOrderAddress = (props) => {
  return (
    <div className={placeOrderScreenStyle.placeOrderScreenItemsContainer}>
      <div className={placeOrderScreenStyle.placeOrderScreenItems}>
        <h2 className={placeOrderScreenStyle.placeOrderSubTitleItems}>
          Shipping Address
        </h2>
        {props.cart.shippingAddress.address ? (
          <div className={placeOrderScreenStyle.placeOrderScreenAddress}>
            <p>{props.cart.shippingAddress.fullName}</p>
            <p>{props.cart.shippingAddress.address}</p>
            <p>{`${props.cart.shippingAddress.city}, ${props.cart.shippingAddress.province} ${props.cart.shippingAddress.postalCode}`}</p>
            <p>{props.cart.shippingAddress.country}</p>
          </div>
        ) : (
          <div className={placeOrderScreenStyle.placeOrderScreenAddress}>
            <p>No shipping address selected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceOrderAddress;
