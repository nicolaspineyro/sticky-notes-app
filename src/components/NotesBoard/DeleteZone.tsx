interface IDeleteZoneProps {
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

const DeleteZone = ({ onDrop }: IDeleteZoneProps) => {
  return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      className="delete-zone"
    >
      <i className="fas fa-trash"></i>
    </div>
  );
};

export default DeleteZone;
