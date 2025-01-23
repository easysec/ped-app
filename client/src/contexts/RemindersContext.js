import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

export const RemindersContext = createContext();

export const RemindersProvider = ({ children }) => {
  const [reminders, setReminders] = useState([]); // Lista de recordatorios
  const [activePopups, setActivePopups] = useState([]); // Lista de recordatorios activos

  // Obtener recordatorios del servidor
  const fetchReminders = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const babies = response.data.babies || [];
      console.log("Bebés obtenidos del servidor:", babies);

      const allReminders = babies.flatMap((baby) =>
        baby.reminders.map((reminder) => ({
          ...reminder,
          babyId: baby._id, // Aseguramos que cada recordatorio tenga babyId
          babyName: baby.name,
        }))
      );

      console.log("Recordatorios procesados con babyId:", allReminders);
      setReminders(allReminders);
    } catch (error) {
      console.error("Error al obtener recordatorios:", error);
    }
  };

  // Función para actualizar los recordatorios después de un cambio
  const updateReminders = async () => {
    console.log("Actualizando recordatorios...");
    await fetchReminders();
  };

  // Programar pop-ups de recordatorios
  const schedulePopups = useCallback(() => {
    const alreadyScheduled = new Set(); // Evitar programar recordatorios duplicados

    reminders.forEach((reminder) => {
      const now = new Date();
      const date = reminder.startDate.split("T")[0];
      const time = reminder.startTime;
      const startDateTime = new Date(`${date}T${time}:00`);
      const frequency = parseInt(reminder.frequency, 10) * 60 * 60 * 1000;

      // Evitar programar recordatorios duplicados
      const uniqueKey = `${reminder._id}-${reminder.startTime}`;
      if (alreadyScheduled.has(uniqueKey)) {
        return;
      }
      alreadyScheduled.add(uniqueKey);

      console.log(`Revisando recordatorio para ${reminder.babyName}:`, reminder);
      console.log(`Fecha/Hora de inicio: ${startDateTime}`);
      console.log(`Hora actual: ${now}`);

      if (startDateTime > now) {
        const delay = startDateTime.getTime() - now.getTime();
        console.log(
          `Programando pop-up en ${delay} ms para ${reminder.medication}`
        );

        setTimeout(() => {
          console.log(
            `Pop-up para ${reminder.medication} debería mostrarse ahora.`
          );
          setActivePopups((prev) => [
            ...prev,
            { ...reminder, babyName: reminder.babyName },
          ]);

          // Programar futuros recordatorios
          const intervalId = setInterval(() => {
            console.log(`Mostrando pop-up recurrente para ${reminder.medication}`);
            setActivePopups((prev) => [
              ...prev,
              { ...reminder, babyName: reminder.babyName },
            ]);
          }, frequency);

          // Limpiar el intervalo
          return () => clearInterval(intervalId);
        }, delay);
      } else {
        console.log(`El recordatorio para ${reminder.medication} ya pasó.`);
      }
    });
  }, [reminders]);

  // Cargar recordatorios al montar el componente
  useEffect(() => {
    fetchReminders();
  }, []);

  // Llamar a schedulePopups cada vez que cambien los recordatorios
  useEffect(() => {
    schedulePopups();
  }, [schedulePopups]);

  return (
    <RemindersContext.Provider
      value={{ reminders, activePopups, setActivePopups, updateReminders }}
    >
      {children}
      {activePopups.map((popup, index) => (
        <div key={index}>
          <div className="modal-backdrop fade show"></div>
          <div
            className="modal fade show"
            tabIndex="-1"
            role="dialog"
            style={{ display: "block" }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Recordatorio de Medicamento</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() =>
                      setActivePopups((prev) => prev.filter((_, i) => i !== index))
                    }
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>Infante:</strong> {popup.babyName}
                  </p>
                  <p>
                    <strong>Medicamento:</strong> {popup.medication}
                  </p>
                  <p>
                    <strong>Dosis:</strong> {popup.dosage}
                  </p>
                  <p>
                    <strong>Frecuencia:</strong> {popup.frequency}
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      setActivePopups((prev) => prev.filter((_, i) => i !== index))
                    }
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </RemindersContext.Provider>
  );
};