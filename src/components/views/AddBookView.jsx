import React, { useState } from "react";

import { BOOK_GENRES } from "../../utils/constants";
export const AddBookView = ({ onSave, onCancel, editingBook }) => {
  const [formData, setFormData] = useState(
    editingBook || {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif text-slate-800 mb-2">
            {editingBook ? "Editar Llibre" : "Afegir Nou Llibre"}
          </h2>
          <p className="text-slate-600">Completa la informació del llibre</p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-500 shadow-lg space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Títol *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-primary-500 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-primary-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Autor *
            </label>
            <input
              type="text"
              required
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              className="w-full px-4 py-2 border border-primary-500 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-primary-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Gènere
            </label>
            <select
              value={formData.genre}
              onChange={(e) =>
                setFormData({ ...formData, genre: e.target.value })
              }
              className="w-full px-4 py-2 border border-primary-600 rounded-lg focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-200"
            >
              <option value="">Selecciona un gènere</option>
              {BOOK_GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Estat
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-4 py-2 border border-primary-500 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-primary-200"
            >
              <option value="pending">Pendent</option>
              <option value="reading">Llegint</option>
              <option value="completed">Completat</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              ISBN
            </label>
            <input
              type="text"
              value={formData.isbn}
              onChange={(e) =>
                setFormData({ ...formData, isbn: e.target.value })
              }
              placeholder="978-0-123456-78-9"
              className="w-full px-4 py-2 border border-primary-500 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-primary-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Pàgines
            </label>
            <input
              type="number"
              value={formData.pages}
              onChange={(e) =>
                setFormData({ ...formData, pages: e.target.value })
              }
              className="w-full px-4 py-2 border border-primary-500 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-primary-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Pàgina Actual
            </label>
            <input
              type="number"
              value={formData.currentPage}
              onChange={(e) =>
                setFormData({ ...formData, currentPage: e.target.value })
              }
              className="w-full px-4 py-2 border border-primary-500 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-primary-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Editorial
            </label>
            <input
              type="text"
              value={formData.publisher}
              onChange={(e) =>
                setFormData({ ...formData, publisher: e.target.value })
              }
              className="w-full px-4 py-2 border border-primary-500 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-primary-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Any
            </label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              placeholder="2024"
              className="w-full px-4 py-2 border border-primary-500 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-primary-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Idioma
            </label>
            <input
              type="text"
              value={formData.language}
              onChange={(e) =>
                setFormData({ ...formData, language: e.target.value })
              }
              placeholder="Català"
              className="w-full px-4 py-2 border border-primary-500 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-primary-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Data d'Inici
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              className="w-full px-4 py-2 border border-primary-500 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-primary-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Data de Finalització
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              className="w-full px-4 py-2 border border-primary-500 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-primary-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Valoració
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                className="focus:outline-none text-2xl"
              >
                {star <= formData.rating ? "⭐" : "☆"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            URL de la Portada
          </label>
          <input
            type="url"
            value={formData.coverUrl}
            onChange={(e) =>
              setFormData({ ...formData, coverUrl: e.target.value })
            }
            className="w-full px-4 py-2 border border-primary-500 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-primary-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Descripció
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows="3"
            className="w-full px-4 py-2 border border-primary-500 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-primary-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Comentaris Personals
          </label>
          <textarea
            value={formData.comments}
            onChange={(e) =>
              setFormData({ ...formData, comments: e.target.value })
            }
            rows="3"
            placeholder="Les teves notes i impressions..."
            className="w-full px-4 py-2 border border-primary-500 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-primary-200"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
          >
            {editingBook ? "Actualitzar Llibre" : "Afegir Llibre"}
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
    </div>
  );
};
