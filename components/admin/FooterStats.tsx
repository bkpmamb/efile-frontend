interface FooterStatsProps {
  filteredCount: number;
  totalCount: number;
  stats: {
    pdfCount: number;
    imageCount: number;
    total: number;
  };
}

export default function FooterStats({
  filteredCount,
  totalCount,
  stats,
}: FooterStatsProps) {
  return (
    <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredCount}</span> of{" "}
          <span className="font-semibold">{totalCount}</span> documents
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-600">
              PDF ({stats.pdfCount})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-600">
              Images ({stats.imageCount})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-600">
              Documents ({stats.total - stats.pdfCount - stats.imageCount})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
