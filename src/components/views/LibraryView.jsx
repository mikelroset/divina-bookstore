import React from "react";
import { Search, Library } from "lucide-react";
import { BookCard } from "../common/BookCard";

export const LibraryView = ({
  books,
  onEdit,
  onDelete,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif text-slate-800 mb-2">
          La Meva Biblioteca
        </h2>
        <p className="text-slate-600">Gestiona la teva col·lecció de llibres</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Cerca per títol o autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/80 border border-primary-500 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-primary-200"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-white/80 border border-primary-500 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-primary-200"
        >
          <option value="all">Tots els llibres</option>
          <option value="pending">Pendents</option>
          <option value="reading">Llegint</option>
          <option value="completed">Completats</option>
        </select>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500">No s'han trobat llibres</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
