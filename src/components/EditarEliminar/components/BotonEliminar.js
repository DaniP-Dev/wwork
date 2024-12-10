const BotonEliminar = ({ onEliminar, disabled = false }) => {
  return (
    <button
      onClick={onEliminar}
      disabled={disabled}
      className="bg-red-500 text-white px-2 py-1.5 rounded-md hover:bg-red-600 
                      text-sm font-medium w-16 text-center disabled:opacity-50"
    >
      Eliminar
    </button>
  );
};

export default BotonEliminar;
