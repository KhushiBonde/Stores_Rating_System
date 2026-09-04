import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="pagination" id="pagination">
      <button
        className="page-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        id="page-prev"
      >
        <HiChevronLeft />
      </button>

      {getPageNumbers()[0] > 1 && (
        <>
          <button className="page-btn" onClick={() => onPageChange(1)} id="page-1">1</button>
          {getPageNumbers()[0] > 2 && <span className="page-ellipsis">...</span>}
        </>
      )}

      {getPageNumbers().map((num) => (
        <button
          key={num}
          className={`page-btn ${num === page ? 'active' : ''}`}
          onClick={() => onPageChange(num)}
          id={`page-${num}`}
        >
          {num}
        </button>
      ))}

      {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
        <>
          {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
            <span className="page-ellipsis">...</span>
          )}
          <button
            className="page-btn"
            onClick={() => onPageChange(totalPages)}
            id={`page-${totalPages}`}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        className="page-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        id="page-next"
      >
        <HiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
