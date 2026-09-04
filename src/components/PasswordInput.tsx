import { useState, type InputHTMLAttributes } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  inputClassName?: string;
};

const PasswordInput = ({
  inputClassName = "",
  className,
  disabled,
  ...props
}: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);
  const mergedClassName = [className, inputClassName].filter(Boolean).join(" ");

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        disabled={disabled}
        className={`${mergedClassName} pr-10`}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        disabled={disabled}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50 cursor-pointer"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <FiEye size={18} /> : <FiEyeOff size={18} />}
      </button>
    </div>
  );
};

export default PasswordInput;
