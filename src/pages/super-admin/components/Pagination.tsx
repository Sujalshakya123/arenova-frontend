type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ page, totalPages, onPageChange }: Props) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 text-sm">
      <p className="text-gray-700">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 cursor-pointer"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
