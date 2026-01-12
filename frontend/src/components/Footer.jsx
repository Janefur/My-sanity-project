
// import { useNavigate } from "react-router-dom";

// export default function Footer({
//   variant = "default",
//   onSubmit,
//   isDisabled,
// }) {
//   const handleClick = (e) => {
//     console.log("SecondaryFooter handleClick", onSubmit);
//     e.preventDefault(); // Förhindra default submit om det behövs
//     if (onSubmit) onSubmit(e);
//   };
//   const navigate = useNavigate();

//   if (variant === "create") {
//     return (
//       <footer>
//         <button
//           type="button"
//           disabled={isDisabled}
//           onClick={onSubmit}
//         >
//           Lägg till event
//         </button>
//       </footer>
//     );
//   }

//   return (
//     <footer>
//       <button onClick={() => navigate("/CreateEvent")}>
//         Skapa event
//       </button>
//     </footer>
//   );
// }


import { useLocation, useNavigate } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const isCreatePage = location.pathname === "/CreateEvent";

  const handleClick = () => {
    if (!isCreatePage) {
      navigate("/CreateEvent");
    }
    // submit hanteras INTE här
  };

  return (
    <footer>
      <button
        type={isCreatePage ? "submit" : "button"}
        form={isCreatePage ? "create-event-form" : undefined}
        onClick={handleClick}
      >
        {isCreatePage ? "Lägg till event" : "Skapa event"}
      </button>
    </footer>
  );
}
