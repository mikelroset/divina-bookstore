export const dateUtils = {
  // Formatar data a format català
  formatDate: (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("ca-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  },

  // Formatar data curta
  formatShortDate: (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("ca-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  },

  // Obtenir dies entre dues dates
  getDaysBetween: (startDate, endDate = new Date()) => {
    if (!startDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },

  // Comprovar si una data és avui
  isToday: (date) => {
    if (!date) return false;
    const d = new Date(date);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  },

  // Comprovar si una data és aquest mes
  isThisMonth: (date) => {
    if (!date) return false;
    const d = new Date(date);
    const today = new Date();
    return (
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  },

  // Obtenir el nom del mes
  getMonthName: (monthNumber) => {
    const months = [
      "Gener",
      "Febrer",
      "Març",
      "Abril",
      "Maig",
      "Juny",
      "Juliol",
      "Agost",
      "Setembre",
      "Octubre",
      "Novembre",
      "Desembre",
    ];
    return months[monthNumber] || "";
  },

  // Convertir data a format ISO per inputs
  toInputFormat: (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  },
};
