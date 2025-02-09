const Button = ({
  id,
  inputs,
  onClick,
  label
}) => {
  return (
    <>
      <button
        className="button"
        onClick={() => onClick(id, Number(inputs[id]))}
      >
        {label}{" "}
      </button>
    </>
  );
};

export default Button;
