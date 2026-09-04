type Props = {
  title: string;
  description: string;
};

const AdminPlaceholder = ({ title, description }: Props) => (
  <div className="bg-white border border-gray-200 rounded-xl p-10 text-center max-w-lg">
    <h1 className="text-xl font-bold text-gray-900">{title}</h1>
    <p className="text-sm text-gray-500 mt-2">{description}</p>
    <p className="text-xs text-gray-400 mt-6">Coming soon</p>
  </div>
);

export default AdminPlaceholder;
