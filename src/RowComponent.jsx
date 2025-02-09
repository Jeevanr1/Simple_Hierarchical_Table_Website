import Button from "./Button";
const RowComponent = ({
  item,
  isChild,
  inputs,
  errors,
  handleInputChange,
  handlePercentageChange,
  handleValueChange,
  calculateVariance,
}) => {
  return (
    <tr className={isChild ? "child-row" : "parent-row"}>
      <td>{isChild ? `- ${item.label}` : item.label}</td>
      <td>{item.value}</td>
      <td>
        <input
          type="number"
          className="input"
          placeholder="Enter a value"
          value={inputs[item.id] || ""}
          onChange={(e) => handleInputChange(item.id, e.target.value)}
        />
        {errors[item.id] && <span className="error">{errors[item.id]}</span>}
      </td>
      <td>
        <Button
          label="Apply %"
          id={item.id}
          inputs={inputs}
          onClick={handlePercentageChange}
        />
      </td>
      <td>
        <Button
          label="Set Value"
          id={item.id}
          inputs={inputs}
          onClick={handleValueChange}
        />
      </td>
      <td>{calculateVariance(item.id, item.value)}</td>
    </tr>
  );
};

export default RowComponent;
