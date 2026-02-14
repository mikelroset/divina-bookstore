import React, { useState } from "react";
import {
  X,
  Star,
  Hash,
  FileText,
  Building2,
  Calendar,
  Globe,
} from "lucide-react";

export const BookForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState(
    initialData || {
      title: "",
      author: "",
      genre: "",
      status: "pending",
      rating: 0,
      description: "",
      comments: "",
      coverUrl:
        "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=450&fit=crop",
      isbn: "",
      pages: "",
      publisher: "",
      year: "",
      language: "",
      startDate: "",
      endDate: "",
      currentPage: "",
    },
  );

  const [errors, setErrors] = React.useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "El títol és obligatori";
    }

    if (!formData.author.trim()) {
      newErrors.author = "L'autor és obligatori";
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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 shadow-lg space-y-5">
      {/* Títol i Autor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Títol *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.title
                ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                : "border-amber-200 focus:border-amber-400 focus:ring-amber-200"
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Autor *
          </label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => handleChange("author", e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.author
                ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                : "border-amber-200 focus:border-amber-400 focus:ring-amber-200"
            }`}
          />
          {errors.author && (
            <p className="text-red-500 text-xs mt-1">{errors.author}</p>
          )}
        </div>
      </div>

      {/* Gènere i Estat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Gènere
          </label>
          <input
            type="text"
            value={formData.genre}
            onChange={(e) => handleChange("genre", e.target.value)}
            placeholder="Fantasia, Novel·la, Assaig..."
            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Estat
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
          >
            <option value="pending">Pendent</option>
            <option value="reading">Llegint</option>
            <option value="completed">Completat</option>
          </select>
        </div>
      </div>

      {/* ISBN, Pàgines, Pàgina Actual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            ISBN
          </label>
          <input
            type="text"
            value={formData.isbn}
            onChange={(e) => handleChange("isbn", e.target.value)}
            placeholder="978-0-123456-78-9"
            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Pàgines
          </label>
          <input
            type="number"
            value={formData.pages}
            onChange={(e) => handleChange("pages", e.target.value)}
            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
          />
          {errors.pages && (
            <p className="text-red-500 text-xs mt-1">{errors.pages}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Pàgina Actual
          </label>
          <input
            type="number"
            value={formData.currentPage}
            onChange={(e) => handleChange("currentPage", e.target.value)}
            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
          />
          {errors.currentPage && (
            <p className="text-red-500 text-xs mt-1">{errors.currentPage}</p>
          )}
        </div>
      </div>

      {/* Editorial, Any, Idioma */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Editorial
          </label>
          <input
            type="text"
            value={formData.publisher}
            onChange={(e) => handleChange("publisher", e.target.value)}
            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Any
          </label>
          <input
            type="number"
            value={formData.year}
            onChange={(e) => handleChange("year", e.target.value)}
            placeholder="2024"
            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Idioma
          </label>
          <input
            type="text"
            value={formData.language}
            onChange={(e) => handleChange("language", e.target.value)}
            placeholder="Català, Castellà..."
            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Data d'Inici
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Data de Finalització
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
          />
        </div>
      </div>

      {/* Valoració */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Valoració
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleChange("rating", star)}
              className="focus:outline-none text-2xl hover:scale-110 transition-transform"
            >
              {star <= formData.rating ? "⭐" : "☆"}
            </button>
          ))}
        </div>
      </div>

      {/* URL Portada */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          URL de la Portada
        </label>
        <input
          type="url"
          value={formData.coverUrl}
          onChange={(e) => handleChange("coverUrl", e.target.value)}
          placeholder="https://..."
          className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
        />
        {formData.coverUrl && (
          <div className="mt-2">
            <img
              src={formData.coverUrl}
              alt="Preview"
              className="w-24 h-32 object-cover rounded-lg shadow-md"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
        )}
      </div>

      {/* Descripció */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Descripció
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows="3"
          placeholder="Sinopsi del llibre..."
          className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
        />
      </div>

      {/* Comentaris */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Comentaris Personals
        </label>
        <textarea
          value={formData.comments}
          onChange={(e) => handleChange("comments", e.target.value)}
          rows="3"
          placeholder="Les teves notes i impressions..."
          className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
        />
      </div>

      {/* Botons d'acció */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
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
    </div>
  );
};
