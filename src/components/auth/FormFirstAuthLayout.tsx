import type { ReactNode } from "react";
import logo from "../../assets/Test_LOGO.png";

type FormFirstAuthLayoutProps = {
  children: ReactNode;
};

const FormFirstAuthLayout = ({ children }: FormFirstAuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center px-4 sm:px-6 py-10">
      <div className="w-full max-w-[420px]">
        <div className="flex items-center justify-center gap-3 mb-8">
          <img
            src={logo}
            alt="Arenova"
            className="w-11 h-11 object-contain"
          />
          <span className="text-xl font-bold tracking-[0.2em] text-gray-900">
            ARENOVA
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 px-6 py-8 sm:px-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormFirstAuthLayout;
