import { useRef } from 'react';

const PaginatorInput = (props) => {
  const inputRef = useRef(null);

  const setPage = (e) => {
    const value = inputRef.current.value;
    if (e && e.type === 'keyup') {
      if (e.code === 'Enter') props.setPage(parseInt(value));
      return;
    }

    if (value !== '') props.setPage(parseInt(value));
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center rounded border !border-[#9c27b0] w-[90px] p-1">
        <input
          className="w-[60px] border-none focus:outline-none"
          defaultValue={props.page}
          ref={inputRef}
          onKeyUp={setPage}
        />
        <div>
          <i className="bi bi-search cursor-pointer" onClick={() => setPage()}></i>
        </div>
      </div>
    </>
  );
};
export default PaginatorInput;
