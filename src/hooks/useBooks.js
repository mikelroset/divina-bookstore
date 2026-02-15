import { useContext } from "react";
import { BooksContext } from "../context/BooksContext";

export const useBooks = () => {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error("useBooks ha de ser utilitzat dins d'un BooksProvider");
  }
  return context;
};
