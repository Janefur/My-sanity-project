import { useLocation, useNavigate } from "react-router-dom";
import "../components/Footer.css";
import { CiCirclePlus } from "react-icons/ci";

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const isCreatePage = location.pathname === "/CreateEvent";

  const handleClick = () => {
    if (!isCreatePage) {
      navigate("/CreateEvent");
    }
  };

  return (
    <footer className="footer">
      <div
        type={isCreatePage ? "submit" : "button"}
        form={isCreatePage ? "create-event-form" : undefined}
        onClick={handleClick}
        title={isCreatePage ? "Lägg till event" : "Skapa event"}
      >
        <CiCirclePlus size={32} style={{ color: "white" }} />
        <p>Skapa event</p>
      </div>
    </footer>
  );
}
