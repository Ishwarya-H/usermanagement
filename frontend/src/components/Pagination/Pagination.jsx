function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
  pageSize,
  setPageSize,
}) {
  return (
    <div className="pagination">
      

      <div className="pagination-right">
        <button
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage(
              currentPage - 1
            )
          }
        >
          &lt;
        </button>

        {Array.from(
          { length: totalPages },
          (_, index) => (
            <button
              key={index + 1}
              className={
                currentPage ===
                index + 1
                  ? "active-page"
                  : ""
              }
              onClick={() =>
                setCurrentPage(
                  index + 1
                )
              }
            >
              {index + 1}
            </button>
          )
        )}

        <button
          disabled={
            currentPage === totalPages
          }
          onClick={() =>
            setCurrentPage(
              currentPage + 1
            )
          }
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

export default Pagination;