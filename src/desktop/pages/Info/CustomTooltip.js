import { convertToInternationalCurrencySystem } from "../../../utils/utils";
import dateFormat  from 'dateformat';

const CustomTooltip = ({title, active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div className='title-label'>{title}</div>
        <div className="title-value">{convertToInternationalCurrencySystem(payload[0].payload.value)}</div>
        <div className="title-date">{`${dateFormat(new Date(payload[0].payload.time * 1000),'yyyy-mm-dd')}(UTC)`}</div>
      </div>
    );
  }
  return null;
};
export default CustomTooltip