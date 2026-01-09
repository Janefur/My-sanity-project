import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Footer() {
  const [isClicked, setIsClicked] = useState(false)
  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/CreateEvent")
    setIsClicked(true)
  }

  return (
      isClicked=== true &&
   <div>
      <button onClick={handleClick}>
        Skapa event
      </button>
    </div>
  );
}
