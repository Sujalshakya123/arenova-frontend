import type { ReactNode } from "react";

type FormCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

const FormCard = ({ title, description, children }: FormCardProps) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-3xl">
    <h2 className="text-lg font-bold text-gray-900 mb-1">{title}</h2>
    {description && (
      <p className="text-sm text-gray-500 mb-6">{description}</p>
    )}
    {!description && <div className="mb-6" />}
    {children}
  </div>
);

export const Field = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="mb-5">
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
    </label>
    {children}
  </div>
);

export const inputClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

export const selectClass = inputClass;

export default FormCard;
