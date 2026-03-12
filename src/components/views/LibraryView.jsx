import React from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { BookCard } from "../common/BookCard";
import { LIBRARY_FILTER_OPTIONS, ROUTES } from "../../utils/constants";

export const LibraryView = ({
  books,
  totalBooksCount = 0,
  onEdit,
  onDelete,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
}) => {
  const isEmpty = totalBooksCount === 0;
  const hasFilteredResults = books.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-3xl font-serif text-slate-800 mb-2">
            La Meva Biblioteca
          </h2>
          <p className="text-slate-600">Gestiona la teva col·lecció de llibres</p>
        </div>
        {!isEmpty && (
          <Link
            to={ROUTES.ADD}
            className="inline-flex items-center gap-2 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Afegir llibre
          </Link>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Cerca per títol o autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/80 border border-primary-500 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-white/80 border border-primary-500 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
        >
          {LIBRARY_FILTER_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {isEmpty ? (
        <div className="text-center py-16 px-4">
          <p className="text-slate-600 text-lg mb-6">
            Encara no tens llibres a la teva biblioteca
          </p>
          <Link
            to={ROUTES.ADD}
            className="inline-flex items-center gap-2 px-6 py-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Afegir el primer llibre
          </Link>
        </div>
      ) : !hasFilteredResults ? (
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
