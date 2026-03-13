import React, { useState } from "react";
import { Search, Globe } from "lucide-react";
import { STATUS_LABELS } from "../../utils/constants";
import { Box, Select, StarRating, TextInput, Textarea } from "../../design-system";
import { BookCover } from "../common/BookCover";

const defaultBook = {
  title: "",
  author: "",
  originalTitle: "",
  genre: "",
  status: "pending",
  rating: 0,
  description: "",
  comments: "",
  coverUrl: "",
  isbn: "",
  pages: "",
  publisher: "",
  year: "",
  language: "",
  startDate: "",
  endDate: "",
  currentPage: "",
};

/** Spinner petit per als botons de cerca */
const Spinner = ({ className = "h-4 w-4" }) => (
  <svg
    className={`animate-spin ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export const BookForm = ({
  initialData,
  onSubmit,
  onCancel,
  genreOptions,
  onSearchCover,
  onSearchDescription,
}) => {
  const [formData, setFormData] = useState(() => {
    const data = { ...defaultBook, ...(initialData || {}) };
    if (data.title && !data.originalTitle?.trim()) {
      data.originalTitle = data.title;
    }
    return data;
  });
  const [errors, setErrors] = useState({});
  const [searchingCover, setSearchingCover] = useState(false);
  const [searchingDescription, setSearchingDescription] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "El títol és obligatori";
    }

    if (!formData.author.trim()) {
      newErrors.author = "L'autor és obligatori";
    }

    const ot = formData.originalTitle?.trim();
    if (!ot) {
      newErrors.originalTitle = "El títol original és obligatori per agrupar ressenyes correctament.";
    }

    if (formData.pages && formData.pages < 0) {
      newErrors.pages = "El número de pàgines ha de ser positiu";
    }

    if (
      formData.currentPage &&
      formData.pages &&
      parseInt(formData.currentPage) > parseInt(formData.pages)
    ) {
      newErrors.currentPage = "La pàgina actual no pot ser major que el total";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Netejar error del camp
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  return (
    <Box className="space-y-5">
      {/* Títol, Títol original i Autor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Títol *"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          error={errors.title}
        />
        <TextInput
          label="Autor *"
          value={formData.author}
          onChange={(e) => handleChange("author", e.target.value)}
          error={errors.author}
        />
        <div className="md:col-span-2">
          <TextInput
            label="Títol original"
            value={formData.originalTitle ?? ""}
            onChange={(e) => handleChange("originalTitle", e.target.value)}
            placeholder="p. ex. The Great Gatsby (si el títol és traduït)"
          />
        </div>
      </div>

      {/* Gènere i Estat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Gènere
          </label>
          {genreOptions?.length > 0 ? (
            <Select
              label="Gènere"
              value={formData.genre}
              onChange={(e) => handleChange("genre", e.target.value)}
              options={[
                { value: "", label: "Selecciona un gènere" },
                ...genreOptions.map((g) => ({ value: g, label: g })),
              ]}
              className="[&_.relative]:!block"
            />
          ) : (
            <TextInput
              label="Gènere"
              value={formData.genre}
              onChange={(e) => handleChange("genre", e.target.value)}
              placeholder="Fantasia, Novel·la, Assaig..."
            />
          )}
        </div>

        <div>
          <Select
            label="Estat"
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            options={Object.entries(STATUS_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
          />
        </div>
      </div>

      {/* ISBN, Pàgines, Pàgina Actual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TextInput
          label="ISBN"
          type="text"
          value={formData.isbn}
          onChange={(e) => handleChange("isbn", e.target.value)}
          placeholder="978-0-123456-78-9"
        />
        <TextInput
          label="Pàgines"
          type="number"
          value={formData.pages}
          onChange={(e) => handleChange("pages", e.target.value)}
          error={errors.pages}
        />
        <TextInput
          label="Pàgina Actual"
          type="number"
          value={formData.currentPage}
          onChange={(e) => handleChange("currentPage", e.target.value)}
          error={errors.currentPage}
        />
      </div>

      {/* Editorial, Any, Idioma */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TextInput
          label="Editorial"
          value={formData.publisher}
          onChange={(e) => handleChange("publisher", e.target.value)}
        />
        <TextInput
          label="Any"
          type="number"
          value={formData.year}
          onChange={(e) => handleChange("year", e.target.value)}
          placeholder="2024"
        />
        <TextInput
          label="Idioma"
          value={formData.language}
          onChange={(e) => handleChange("language", e.target.value)}
          placeholder="Català, Castellà..."
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Data d'Inici"
          type="date"
          value={formData.startDate}
          onChange={(e) => handleChange("startDate", e.target.value)}
        />
        <TextInput
          label="Data de Finalització"
          type="date"
          value={formData.endDate}
          onChange={(e) => handleChange("endDate", e.target.value)}
        />
      </div>

      {/* Valoració */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Valoració
        </label>
        <StarRating
          value={formData.rating}
          onChange={(v) => handleChange("rating", v)}
          readOnly={false}
          size="lg"
        />
      </div>

      {/* URL Portada */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-slate-700">
            URL de la Portada
          </label>
          {onSearchCover && (
            <button
              type="button"
              onClick={async () => {
                if (!formData.title?.trim()) {
                  alert("Escriu primer el títol del llibre");
                  return;
                }
                setSearchingCover(true);
                try {
                  const url = await onSearchCover(
                    formData.title,
                    formData.author,
                  );
                  if (url) handleChange("coverUrl", url);
                  else alert("No s'ha trobat cap portada. Pots afegir-la manualment.");
                } catch {
                  alert("Error al buscar la portada. Torna-ho a intentar.");
                } finally {
                  setSearchingCover(false);
                }
              }}
              disabled={searchingCover || !formData.title?.trim()}
              className="inline-flex items-center gap-2 whitespace-nowrap text-sm px-3 py-1 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
            >
              {searchingCover ? (
                <>
                  <Spinner className="shrink-0" /> Buscant...
                </>
              ) : (
                <><Search className="w-4 h-4 shrink-0" /> Buscar portada</>
              )}
            </button>
          )}
        </div>
        <TextInput
          label="URL de la Portada"
          type="url"
          value={formData.coverUrl}
          onChange={(e) => handleChange("coverUrl", e.target.value)}
          placeholder="https://..."
          className="[&_label]:sr-only"
        />
        {formData.coverUrl && formData.coverUrl.startsWith("http") && (
          <div className="mt-2">
            <BookCover
              src={formData.coverUrl}
              alt="Preview portada"
              className="w-24 h-32 object-cover rounded-lg shadow-md"
            />
          </div>
        )}
      </div>

      {/* Descripció */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-slate-700">
            Descripció
          </label>
          {onSearchDescription && (
            <button
              type="button"
              onClick={async () => {
                if (!formData.title?.trim()) {
                  alert("Escriu primer el títol del llibre");
                  return;
                }
                setSearchingDescription(true);
                try {
                  const description = await onSearchDescription(
                    formData.title,
                    formData.author,
                  );
                  if (description) handleChange("description", description);
                  else alert("No s'ha trobat cap descripció per aquest llibre.");
                } catch {
                  alert("Error al buscar la descripció. Torna-ho a intentar.");
                } finally {
                  setSearchingDescription(false);
                }
              }}
              disabled={searchingDescription || !formData.title?.trim()}
              className="inline-flex items-center gap-2 whitespace-nowrap text-sm px-3 py-1 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
            >
              {searchingDescription ? (
                <>
                  <Spinner className="shrink-0" /> Traduint...
                </>
              ) : (
                <><Globe className="w-4 h-4 shrink-0" /> Buscar descripció</>
              )}
            </button>
          )}
        </div>
        <Textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={4}
          placeholder="Sinopsi del llibre..."
        />
      </div>

      {/* Comentaris */}
      <Textarea
        label="Comentaris Personals"
        value={formData.comments}
        onChange={(e) => handleChange("comments", e.target.value)}
        rows={3}
        placeholder="Les teves notes i impressions..."
      />

      {/* Botons d'acció */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
        >
          {initialData ? "Actualitzar Llibre" : "Afegir Llibre"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
        >
          Cancel·lar
        </button>
      </div>
    </Box>
  );
};
