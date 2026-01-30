import { Link } from "react-router-dom";
import acahriyalogonew from "../assets/Achariya-Logo-01-scaled.avif";

const Navbar = () => {
  return (
    <div>
      <header className=" w-full  bg-[#C72323] shadow-lg fixed top-0 z-50">
        <div className="container mx-auto px-6 py-1 flex justify-between items-center">
         <Link to="/" > <h1 className="text-2xl font-bold text-white">ACHARIYA Careers</h1></Link>
          <img src={acahriyalogonew} alt="Achariya" width={80} />
        </div>
      </header>
    </div>
  );
};

export default Navbar;
