import logo from "../../assets/Test_LOGO.png";
import leftcover from "../../assets/login-left.png";

const TAGLINE = "Nepal's esports tournament platform";

const AuthLeftPanel = () => {
  return (
    <div className="hidden lg:block relative lg:w-1/2 h-full">
      <img
        src={leftcover}
        alt=""
        className="w-full h-full min-h-[240px] lg:min-h-screen object-cover object-center opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-l from-[#364A80]/35 to-[#0B0F1A]" />

      <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10 px-10">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-5 xl:gap-6">
            <img
              src={logo}
              alt="Arenova"
              className="w-[76px] h-[76px] xl:w-[92px] xl:h-[92px] object-contain shrink-0"
            />
            <div
              className="h-[76px] xl:h-[92px] w-px bg-white/45 shrink-0"
              aria-hidden="true"
            />
            <h2 className="font-arenova text-[2.75rem] xl:text-6xl font-normal tracking-[0.04em] leading-none">
              ARENOVA
            </h2>
          </div>
          <p className="text-gray-200/95 text-base xl:text-lg mt-5 text-center tracking-wide">
            {TAGLINE}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLeftPanel;
