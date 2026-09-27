import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ErrorRecovery from "@/app/ErrorRecovery";

describe("error recovery UI", () => {
  it("should hide internal errors and offer retry and home actions", () => {
    const reset = vi.fn();

    render(<ErrorRecovery onRetry={reset} />);

    expect(screen.getByRole("heading", { name: "Something went wrong" })).toBeInTheDocument();
    expect(screen.getByText(/reference details/i)).toBeInTheDocument();
    expect(screen.queryByText(/stack|database|secret|internal/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go home" })).toHaveAttribute("href", "/");

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(reset).toHaveBeenCalledOnce();
  });
});
