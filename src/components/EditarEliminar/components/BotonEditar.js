const BotonEditar = ({ onEditar, disabled = false }) => {
  return (
    <button
      onClick={onEditar}
      disabled={disabled}
      className="bg-blue-500 text-white px-2 py-1.5 rounded-md hover:bg-blue-600 
                      text-sm font-medium w-16 text-center disabled:opacity-50"
    >
      Editar
    </button>
  );
};

export default BotonEditar;
