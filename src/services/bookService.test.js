import { describe, it, expect, beforeEach, vi } from "vitest";
import { bookService } from "./bookService";

const mockAddDoc = vi.fn();
const mockGetDocs = vi.fn();
const mockUpdateDoc = vi.fn();

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn(),
    doc: vi.fn(),
    addDoc: (...args) => mockAddDoc(...args),
    getDocs: (...args) => mockGetDocs(...args),
    updateDoc: (...args) => mockUpdateDoc(...args),
    deleteDoc: vi.fn(),
    query: vi.fn(),
    orderBy: vi.fn(),
    serverTimestamp: vi.fn(() => ({ seconds: 0, nanoseconds: 0 })),
  };
});

function createMockSnapshot(books) {
  return {
    docs: books.map((b) => ({
      id: b.id,
      data: () => {
        const { id, ...data } = b;
        return data;
      },
    })),
  };
}

describe("bookService", () => {
  const userId = "user-1";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("addBook", () => {
    it("llança error si ISBN és buit", async () => {
      await expect(bookService.addBook(userId, { title: "Llibre" })).rejects.toThrow();
      expect(mockAddDoc).not.toHaveBeenCalled();
    });

    it("llança error si ISBN té format invàlid", async () => {
      mockGetDocs.mockResolvedValue(createMockSnapshot([]));
      await expect(bookService.addBook(userId, { isbn: "123", title: "Llibre" })).rejects.toThrow();
      expect(mockAddDoc).not.toHaveBeenCalled();
    });

    it("llança error si ISBN duplicat", async () => {
      mockGetDocs.mockResolvedValue(
        createMockSnapshot([{ id: "b1", isbn: "978-0-14-118280-3", title: "1984" }]),
      );
      await expect(
        bookService.addBook(userId, { isbn: "9780141182803", title: "Altre" }),
      ).rejects.toThrow(/biblioteca/);
      expect(mockAddDoc).not.toHaveBeenCalled();
    });

    it("crea el llibre si ISBN és vàlid i no duplicat", async () => {
      mockGetDocs.mockResolvedValue(createMockSnapshot([]));
      mockAddDoc.mockResolvedValue({ id: "new-id" });

      const result = await bookService.addBook(userId, {
        isbn: "9780141182803",
        title: "1984",
        author: "Orwell",
      });

      expect(result).toEqual({
        id: "new-id",
        isbn: "9780141182803",
        title: "1984",
        author: "Orwell",
      });
      expect(mockAddDoc).toHaveBeenCalled();
    });

    it("accepta ISBN-10 vàlid", async () => {
      mockGetDocs.mockResolvedValue(createMockSnapshot([]));
      mockAddDoc.mockResolvedValue({ id: "new-id" });

      const result = await bookService.addBook(userId, {
        isbn: "0123456789",
        title: "Llibre",
      });

      expect(result.id).toBe("new-id");
      expect(result.isbn).toBe("0123456789");
    });
  });

  describe("updateBook", () => {
    const bookId = "book-1";

    it("llança error si el nou ISBN és duplicat d'un altre llibre", async () => {
      mockGetDocs.mockResolvedValue(
        createMockSnapshot([
          { id: bookId, isbn: "978-0-14-118280-3", title: "1984" },
          { id: "b2", isbn: "978-0-13-110362-7", title: "C" },
        ]),
      );

      await expect(
        bookService.updateBook(userId, bookId, { isbn: "9780131103627", title: "1984" }),
      ).rejects.toThrow(/biblioteca/);
      expect(mockUpdateDoc).not.toHaveBeenCalled();
    });

    it("permet actualitzar si el nou ISBN és el mateix (no duplicat amb el propi llibre)", async () => {
      mockGetDocs.mockResolvedValue(
        createMockSnapshot([{ id: bookId, isbn: "978-0-14-118280-3", title: "1984" }]),
      );
      mockUpdateDoc.mockResolvedValue(undefined);

      const result = await bookService.updateBook(userId, bookId, {
        isbn: "9780141182803",
        title: "1984 Revised",
      });

      expect(result).toEqual({
        id: bookId,
        isbn: "9780141182803",
        title: "1984 Revised",
      });
      expect(mockUpdateDoc).toHaveBeenCalled();
    });

    it("permet actualitzar sense canviar l'ISBN", async () => {
      mockGetDocs.mockResolvedValue(
        createMockSnapshot([{ id: bookId, isbn: "978-0-14-118280-3", title: "1984" }]),
      );
      mockUpdateDoc.mockResolvedValue(undefined);

      const result = await bookService.updateBook(userId, bookId, { title: "1984 (ed.)" });

      expect(result.title).toBe("1984 (ed.)");
      expect(mockUpdateDoc).toHaveBeenCalled();
    });
  });
});
