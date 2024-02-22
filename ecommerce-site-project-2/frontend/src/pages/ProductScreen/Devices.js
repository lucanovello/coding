import productScreenStyle from './ProductScreen.module.css';

function Devices(props) {
  return (
    props.devices && (
      <div className={productScreenStyle.productDeviceContainer}>
        <label
          htmlFor="device"
          className={productScreenStyle.productDeviceLabel}
        >
          Device:<span>*</span>
        </label>
        <select
          id="device"
          name="device"
          className={productScreenStyle.productDevice}
          defaultValue={'------ Please choose an option ------'}
          onChange={() => props.setIsDeviceValid(true)}
          ref={props.refValue}
          required
        >
          <option
            value="------ Please choose an option ------"
            className={productScreenStyle.productDeviceMainTitle}
            hidden
            disabled
          >
            ------ Please choose an option ------
          </option>

          {props.devices.map((device, index) => {
            return (
              <optgroup
                key={index}
                label={device.brand}
                className={productScreenStyle.productDeviceTitle}
              >
                {device.models.map((model, index) => {
                  return (
                    <option
                      key={index}
                      value={model}
                      className={productScreenStyle.productDeviceOption}
                    >
                      {model}
                    </option>
                  );
                })}
              </optgroup>
            );
          })}
        </select>
      </div>
    )
  );
}

export default Devices;
