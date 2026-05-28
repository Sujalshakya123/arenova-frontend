import logo from "../../../assets/Logo.png";

const Navbar = () => {
  const navLinks = [
    { id: 1, name: "Home" },
    { id: 2, name: "Tournaments" },
    { id: 3, name: "Games" },
    { id: 4, name: "Contacts" },
  ];

  return (
    <nav className="flex justify-between items-center px-[80px] py-[20px] relative text-white backdrop-blur-sm h-[10%]">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="w-[48px] h-[48px]" />
        <h2 className="font-bold text-[22px]">ARENOVA</h2>
      </div>

      <div>
        <ul className="flex gap-[60px] font-semibold text-[18px] cursor-pointer">
          {navLinks.map((link) => (
            <li key={link.id}>{link.name}</li>
          ))}
        </ul>
      </div>

      <div className="flex gap-[20px]">
        <button className="bg-blue-600 hover:bg-blue-700 px-8 py-2 rounded-lg text-white cursor-pointer font-medium">
          Sign Up
        </button>
        <button className="border border-blue-700 hover:bg-blue-700 hover:text-white px-8 py-2 rounded-lg text-blue-500 cursor-pointer font-medium">
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
