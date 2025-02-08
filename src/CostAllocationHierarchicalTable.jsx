import React, { useState } from "react";
import "./styles.css";

const initialRowData = [
  {
    id: "electronics",
    label: "Electronics",
    children: [
      { id: "phones", label: "Phones", value: 800 },
      { id: "laptops", label: "Laptops", value: 700 },
    ],
  },
  {
    id: "furniture",
    label: "Furniture",
    children: [
      { id: "tables", label: "Tables", value: 300 },
      { id: "chairs", label: "Chairs", value: 700 },
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
      setErrors((prev) => ({ ...prev, [id]: "Please Enter a Value" }));
      return;
    }
    setErrors((prev) => ({ ...prev, [id]: "" }));

    const updatedData = data.map((parent) => {
      if (
        parent.id === id ||
        parent.children.some((child) => child.id === id)
      ) {
        const newChildren = parent.children.map((child) =>
          child.id === id
            ? {
                ...child,
                value: Math.round(child.value * (1 + percentage / 100)),
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
      setErrors((prev) => ({ ...prev, [id]: "Please Enter a Value" }));
      return;
    }
    setErrors((prev) => ({ ...prev, [id]: "" }));

    const updatedData = data.map((parent) => {
      if (parent.id === id) {
        const total = parent.value;
        const factor = total !== 0 ? newValue / total : 1;
        const newChildren = parent.children.map((child) => ({
          ...child,
          value: Math.round(child.value * factor),
        }));
        return { ...parent, children: newChildren, value: newValue };
      }
      if (parent.children.some((child) => child.id === id)) {
        const newChildren = parent.children.map((child) =>
          child.id === id ? { ...child, value: newValue } : child
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
              <tr className="parent-row">
                <td>{parent.label}</td>
                <td>{parent.value}</td>
                <td>
                  <input
                    type="number"
                    className="input"
                    value={inputs[parent.id] || ""}
                    placeHolder="enter a value"
                    onChange={(e) => {
                      setInputs({ ...inputs, [parent.id]: e.target.value });
                      setErrors((prev) => ({ ...prev, [parent.id]: "" }));
                    }}
                  />
                  {errors[parent.id] && (
                    <span className="error">{errors[parent.id]}</span>
                  )}
                </td>
                <td>
                  <button
                    className="button"
                    onClick={() =>
                      handlePercentageChange(
                        parent.id,
                        Number(inputs[parent.id])
                      )
                    }
                  >
                    Apply %
                  </button>
                </td>
                <td>
                  <button
                    className="button"
                    onClick={() =>
                      handleValueChange(parent.id, Number(inputs[parent.id]))
                    }
                  >
                    Set Value
                  </button>
                </td>
                <td>{calculateVariance(parent.id, parent.value)}</td>
              </tr>
              {parent.children.map((child) => (
                <tr key={child.id} className="child-row">
                  <td>- {child.label}</td>
                  <td>{child.value}</td>
                  <td>
                    <input
                      type="number"
                      className="input"
                      placeHolder="enter a value"
                      value={inputs[child.id] || ""}
                      onChange={(e) => {
                        setInputs({ ...inputs, [child.id]: e.target.value });
                        setErrors((prev) => ({ ...prev, [child.id]: "" })); // Clear error on change
                      }}
                    />
                    {errors[child.id] && (
                      <span className="error">{errors[child.id]}</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="button"
                      onClick={() =>
                        handlePercentageChange(
                          child.id,
                          Number(inputs[child.id])
                        )
                      }
                    >
                      Apply %
                    </button>
                  </td>
                  <td>
                    <button
                      className="button"
                      onClick={() =>
                        handleValueChange(child.id, Number(inputs[child.id]))
                      }
                    >
                      Set Value
                    </button>
                  </td>
                  <td>{calculateVariance(child.id, child.value)}</td>
                </tr>
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
