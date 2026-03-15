import React from "react";
import { Plus } from "lucide-react";
import { BookCard } from "../common/BookCard";
import { PrimaryButton } from "../common/Button";
import { Select, PageTitle } from "../../design-system";
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
        <PageTitle subtitle="Gestiona la teva col·lecció de llibres">
          La Meva Biblioteca
        </PageTitle>
        {!isEmpty && (
          <PrimaryButton to={ROUTES.ADD} icon={Plus}>
            Afegir llibre
          </PrimaryButton>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Cerca per títol o autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[var(--color-surface)]/80 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30 text-[var(--color-text-primary)] transition-colors duration-150"
          />
        </div>
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={LIBRARY_FILTER_OPTIONS}
          aria-label="Filtre de llibres"
          className="min-w-[10rem]"
        />
      </div>

      {isEmpty ? (
        <div className="text-center py-16 px-4">
          <p className="text-[var(--color-text-secondary)] text-lg mb-6">
            Encara no tens llibres a la teva biblioteca
          </p>
          <PrimaryButton to={ROUTES.ADD} icon={Plus} size="lg">
            Afegir el primer llibre
          </PrimaryButton>
        </div>
      ) : !hasFilteredResults ? (
        <div className="text-center py-12">
          <p className="text-[var(--color-text-secondary)]">No s'han trobat llibres</p>
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
