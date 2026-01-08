export default function CreateEvent() {
  return (
    <div>
      <h1>Skapa ett event</h1>
      <div>
        <form action="submit">
          <label>Namn på event:</label>
          <input type="text" placeholder="Skriv namn på event" />
          <label>Datum:</label>
          <input type="date" value="date" />
          <label>Plats:</label>
          <input type="text" placeholder="Skriv plats för event" />
          <label>Beskrivning:</label>
          <textarea placeholder="Skriv beskrivning för event"></textarea>

          <br />
          {/* </form> */}
          <button type="submit">Skapa event</button>
        </form>
      </div>
    </div>
  );
}
