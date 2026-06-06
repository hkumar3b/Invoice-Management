import './css/Pagination.css';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: PaginationProps) {
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const getPages = () => {
    const pages = [];
    const delta = 2;
    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="pagination">
      <span className="pagination__info">
        Showing {start}–{end} of {total}
      </span>

      <div className="pagination__controls">
        <button
          className="pagination__btn"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          ‹
        </button>

        {getPages().map((p) => (
          <button
            key={p}
            className={`pagination__btn ${p === page ? 'pagination__btn--active' : ''}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}

        <button
          className="pagination__btn"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          ›
        </button>
      </div>
    </div>
  );
}