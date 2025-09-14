// Skeleton row for the table
export const SkeletonTableRow = ({columns = 5}) => (
    <tr className="animate-pulse bg-white">
        {[...Array(columns)].map((_, i) => (
            <td key={i} className="px-6 py-4 border-b border-gray-200">
                <div className="h-4 bg-gray-300 rounded w-full max-w-[80px]"></div>
            </td>
        ))}
    </tr>
);


export const SkeletonCard = () => (
    <div className="bg-white shadow-md rounded-lg p-6 flex items-center gap-4 animate-pulse">
        <div className="w-12 h-12 bg-gray-300 rounded-full" />
        <div className="flex flex-col gap-2 flex-1">
            <div className="h-5 bg-gray-300 rounded w-3/4" />
            <div className="h-8 bg-gray-300 rounded w-1/2" />
        </div>
    </div>
);
