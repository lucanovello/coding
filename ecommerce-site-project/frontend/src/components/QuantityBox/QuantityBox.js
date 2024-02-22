import quantityBoxStyle from './QuantityBox.module.css';
import { FaMinus, FaPlus } from 'react-icons/fa';

const QuantityBox = (props) => {
  return (
    <div className={props.quantityBoxContainerStyle}>
      <label htmlFor="qty" className={props.quantityBoxLabelStyle}>
        Qty:
      </label>

      <div className={quantityBoxStyle.quantityBoxInputContainer}>
        <button
          type="button"
          className={`${quantityBoxStyle.quantityBoxInputButtonActive} 
          ${quantityBoxStyle.quantityBoxInputButtonMinus}
           ${quantityBoxStyle.quantityBoxInputButton}`}
          onMouseDown={() => {
            props.setQty(parseInt(props.value) - 1);
            props.ctxDispatch &&
              props.addToCartHandler(props.item, parseInt(props.value) - 1);
          }}
          disabled={props.value <= 1}
        >
          <FaMinus />
        </button>
        <input
          type="number"
          className={`${quantityBoxStyle.quantityBoxInput} ${quantityBoxStyle.removeArrows}`}
          id="qty"
          value={props.value}
          min={1}
          max={999}
          step={1}
          maxLength={3}
          onChange={(e) => {
            parseInt(e.target.value) < 1 && (e.target.value = 1);
            e.target.value.length < 1 && (e.target.value = 1);
            parseInt(e.target.value) > 999 && (e.target.value = 999);
            e.target.value.length > 3 && (e.target.value = 999);
            props.setQty(e.target.value);
            props.ctxDispatch &&
              props.addToCartHandler(props.item, e.target.value);
          }}
        />
        <button
          type="button"
          className={`${quantityBoxStyle.quantityBoxInputButtonActive} ${quantityBoxStyle.quantityBoxInputButton} ${quantityBoxStyle.quantityBoxInputButtonPlus}`}
          onMouseDown={() => {
            props.setQty(parseInt(props.value) + 1);
            props.ctxDispatch &&
              props.addToCartHandler(props.item, parseInt(props.value) + 1);
          }}
        >
          <FaPlus />
        </button>
      </div>
      {props.children}
    </div>
  );
};

export default QuantityBox;
