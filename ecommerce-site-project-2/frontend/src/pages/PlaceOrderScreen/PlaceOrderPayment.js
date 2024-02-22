import placeOrderScreenStyle from './PlaceOrderScreen.module.css';

const PlaceOrderPayment = (props) => {
  return (
    <div className={placeOrderScreenStyle.placeOrderScreenItemsContainer}>
      <div className={placeOrderScreenStyle.placeOrderScreenItems}>
        <h2 className={placeOrderScreenStyle.placeOrderSubTitleItems}>
          Payment Method
        </h2>

        <div className={placeOrderScreenStyle.placeOrderScreenAddress}>
          <p>
            {props.cart.paymentMethod.length > 0
              ? props.cart.paymentMethod
              : 'No payment method selected'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPayment;
