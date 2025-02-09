import React, {useState} from "react";
import RowComponent from "./RowComponent";
import "./styles.css";

const initialRowData = [
  {
    id: "electronics",
    label: "Electronics",
    children: [
      {id: "phones", label: "Phones", value: 800},
      {id: "laptops", label: "Laptops", value: 700},
    ],
  },
  {
    id: "furniture",
    label: "Furniture",
    children: [
      {id: "tables", label: "Tables", value: 300},
      {id: "chairs", label: "Chairs", value: 700},
    ],
  },
];

const calculateParentValue = (children) =>
  children.reduce((sum, child) => sum + child.value, 0);

const CostAllocationHierarchicalTable = () => {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [data, setData] = useState(
    initialRowData.map((item) => ({
      ...item,
      value: calculateParentValue(item.children),
    }))
  );

  const initialValues = React.useMemo(() => {
    return data.reduce((acc, parent) => {
      acc[parent.id] = parent.value;
      parent.children.forEach((child) => {
        acc[child.id] = child.value;
      });
      return acc;
    }, {});
  }, []);

  const handlePercentageChange = (id, percentage) => {
    if (!inputs[id] || isNaN(percentage)) {
      setErrors((prev) => ({...prev, [id]: "Please Enter a Value"}));
      return;
    }
    setErrors((prev) => ({...prev, [id]: ""}));

    const updatedData = data.map((parent) => {
      if (
        parent.id === id ||
        parent.children.some((child) => child.id === id)
      ) {
        const newChildren = parent.children.map((child) =>
          child.id === id
            ? {
                ...child,
                value: Number(
                  (child.value * (1 + percentage / 100)).toFixed(2)
                ),
              }
            : child
        );
        return {
          ...parent,
          children: newChildren,
          value: calculateParentValue(newChildren),
        };
      }
      return parent;
    });
    setData(updatedData);
  };

  const handleValueChange = (id, newValue) => {
    if (!inputs[id] || isNaN(newValue)) {
      setErrors((prev) => ({...prev, [id]: "Please Enter a Value"}));
      return;
    }
    setErrors((prev) => ({...prev, [id]: ""}));

    const updatedData = data.map((parent) => {
      if (parent.id === id) {
        const total = parent.value;
        const factor = total !== 0 ? newValue / total : 1;
        const newChildren = parent.children.map((child) => ({
          ...child,
          value: (child.value * factor).toFixed(2),
        }));
        return {...parent, children: newChildren, value: newValue};
      }
      if (parent.children.some((child) => child.id === id)) {
        const newChildren = parent.children.map((child) =>
          child.id === id ? {...child, value: newValue} : child
        );
        return {
          ...parent,
          children: newChildren,
          value: calculateParentValue(newChildren),
        };
      }
      return parent;
    });
    setData(updatedData);
  };

  const calculateVariance = (id, newValue) => {
    const initialValue = initialValues[id] || 0;
    if (initialValue === 0) return "0.00%";
    const variance = ((newValue - initialValue) / initialValue) * 100;
    return `${variance.toFixed(2)}%`;
  };

  const handleInputChange = (id, value) => {
    setInputs((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <div className="table-container">
      <h2>Cost Allocation Dashboard</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Label</th>
            <th>Value</th>
            <th>Input</th>
            <th>Allocation %</th>
            <th>Allocation Val</th>
            <th>Variance %</th>
          </tr>
        </thead>
        <tbody>
          {data.map((parent) => (
            <React.Fragment key={parent.id}>
              <RowComponent
                item={parent}
                isChild={false}
                inputs={inputs}
                errors={errors}
                handleInputChange={handleInputChange}
                handlePercentageChange={handlePercentageChange}
                handleValueChange={handleValueChange}
                calculateVariance={calculateVariance}
              />
              {parent.children.map((child) => (
                <RowComponent
                  key={child.id}
                  item={child}
                  isChild={true}
                  inputs={inputs}
                  errors={errors}
                  handleInputChange={handleInputChange}
                  handlePercentageChange={handlePercentageChange}
                  handleValueChange={handleValueChange}
                  calculateVariance={calculateVariance}
                />
              ))}
            </React.Fragment>
          ))}
          <tr className="total-row">
            <td>
              <b>Grand Total</b>
            </td>
            <td>
              <b>{data.reduce((sum, parent) => sum + parent.value, 0)}</b>
            </td>
            <td colSpan={4}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CostAllocationHierarchicalTable;
