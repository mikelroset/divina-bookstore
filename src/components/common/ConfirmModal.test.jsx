import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConfirmModal } from "./ConfirmModal";

describe("ConfirmModal", () => {
  it("no renderitza res quan open és false", () => {
    render(
      <ConfirmModal
        open={false}
        title="Títol"
        message="Missatge"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("mostra títol i missatge quan open és true", () => {
    render(
      <ConfirmModal
        open={true}
        title="Eliminar llibre"
        message="Estàs segur?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Eliminar llibre")).toBeInTheDocument();
    expect(screen.getByText("Estàs segur?")).toBeInTheDocument();
  });

  it("crida onConfirm en clicar el botó de confirmar", () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmModal
        open={true}
        title="Títol"
        message="Missatge"
        confirmLabel="Eliminar"
        onConfirm={onConfirm}
        onCancel={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("crida onCancel en clicar Cancel·lar", () => {
    const onCancel = vi.fn();
    render(
      <ConfirmModal
        open={true}
        title="Títol"
        message="Missatge"
        onConfirm={() => {}}
        onCancel={onCancel}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Cancel·lar" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("mostra els labels per defecte", () => {
    render(
      <ConfirmModal
        open={true}
        title="Títol"
        message="Missatge"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: "Confirmar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel·lar" })).toBeInTheDocument();
  });
});
