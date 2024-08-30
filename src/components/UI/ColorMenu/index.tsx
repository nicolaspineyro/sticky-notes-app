import { NOTES_COLORS } from "../../../utils/enums";

interface IColorMenuProps {
  handleSelect: (
    e: React.MouseEvent<HTMLButtonElement>,
    color?: NOTES_COLORS
  ) => void;
}

const ColorMenu = ({ handleSelect }: IColorMenuProps) => {
  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    color?: NOTES_COLORS
  ) => {
    handleSelect(e, color);
  };
  return (
    <div className="color-menu">
      <button onClick={(e) => handleClick(e)} className="color-option">
        <i className="fa-solid fa-plus"></i>
      </button>
      {Object.values(NOTES_COLORS).map((color, i) => (
        <button
          key={`color-${i}`}
          className="color-option"
          style={{ backgroundColor: color }}
          onClick={(e) => handleClick(e, color)}
        />
      ))}
    </div>
  );
};

export default ColorMenu;
