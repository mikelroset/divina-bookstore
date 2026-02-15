export const coverService = {
  // Buscar portada usant Open Library API
  searchCover: async (title, author = "") => {
    try {
      // Construir la query de cerca
      const query = author ? `${title} ${author}`.trim() : title.trim();

      if (!query) return null;

      // Buscar el llibre a Open Library
      const searchUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}${author ? `&author=${encodeURIComponent(author)}` : ""}&limit=1`;

      const response = await fetch(searchUrl);
      const data = await response.json();

      if (data.docs && data.docs.length > 0) {
        const book = data.docs[0];

        // Obtenir l'ID de portada
        if (book.cover_i) {
          // Retornar la URL de la portada (mida L = gran)
          return `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
        }

        // Si no té cover_i, provar amb ISBN
        if (book.isbn && book.isbn.length > 0) {
          return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-L.jpg`;
        }
      }

      // Si no es troba res, retornar null
      return null;
    } catch (error) {
      console.error("Error buscant portada:", error);
      return null;
    }
  },

  // Alternativa: Buscar a Google Books API (més portades però pot requerir API key)
  searchCoverGoogle: async (title, author = "") => {
    try {
      const query = `${title} ${author}`.trim();
      if (!query) return null;

      const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1`;

      const response = await fetch(searchUrl);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const book = data.items[0];
        if (book.volumeInfo.imageLinks) {
          // Retornar la imatge més gran disponible
          return (
            book.volumeInfo.imageLinks.large ||
            book.volumeInfo.imageLinks.medium ||
            book.volumeInfo.imageLinks.thumbnail ||
            null
          );
        }
      }

      return null;
    } catch (error) {
      console.error("Error buscant portada a Google Books:", error);
      return null;
    }
  },
};
