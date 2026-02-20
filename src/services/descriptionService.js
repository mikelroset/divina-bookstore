export const descriptionService = {
  // Buscar descripcio del llibre
  searchDescription: async (title, author = "") => {
    try {
      const query = `${title} ${author}`.trim();
      if (!query) return null;

      const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1`;

      const response = await fetch(searchUrl);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const book = data.items[0];
        const description = book.volumeInfo.description;

        if (description) {
          const cleanDescription = description.replace(/<[^>]*>/g, "");
          const translatedDescription =
            await descriptionService.translateToCatalan(cleanDescription);
          return translatedDescription || cleanDescription;
        }
      }
      return null;
    } catch (error) {
      console.error("❌ Error buscant descripcio:", error);
      return null;
    }
  },

  // Traduir amb Google Translate (metode no oficial pero funciona)
  translateToCatalan: async (text) => {
    try {
      // Limitar longitud
      const maxLength = 5000;
      const textToTranslate =
        text.length > maxLength ? text.substring(0, maxLength) : text;

      // Usar l'endpoint public de Google Translate
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ca&dt=t&q=${encodeURIComponent(textToTranslate)}`;

      const response = await fetch(url);

      if (!response.ok) {
        console.error("Error en Google Translate:", response.status);
        return null;
      }

      const data = await response.json();

      // Google retorna un array complicat, extreure el text traduit
      if (data && data[0]) {
        const translatedText = data[0]
          .map((item) => item[0])
          .filter(Boolean)
          .join("");

        return translatedText || null;
      }

      return null;
    } catch (error) {
      console.error("❌ Error traduint:", error);
      return null;
    }
  },
};
