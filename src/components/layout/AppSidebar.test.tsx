import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Mock AuthContext
import { vi } from "vitest";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { email: "test@totum.com" },
    signOut: vi.fn(),
  }),
}));

// Mock supabase
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      count: vi.fn().mockReturnThis(),
      then: vi.fn().mockResolvedValue({ count: 0 }),
    }),
  },
}));

describe("AppSidebar", () => {
  it("renders 5 pillar labels", () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <AppSidebar />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByText("Visão")).toBeInTheDocument();
    expect(screen.getAllByText("Agentes").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Conhecimento")).toBeInTheDocument();
    expect(screen.getByText("Operações")).toBeInTheDocument();
    expect(screen.getByText("Sistema")).toBeInTheDocument();
  });

  it("renders key navigation items", () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <AppSidebar />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByText("Hub de Agentes")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Tarefas")).toBeInTheDocument();
    expect(screen.getByText("Documentação")).toBeInTheDocument();
    expect(screen.getByText("Claude Code")).toBeInTheDocument();
  });

  it("renders expandable Agentes section with sub-items", () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <AppSidebar />
        </MemoryRouter>
      </ThemeProvider>
    );

    // Agentes section should be expanded by default
    expect(screen.getByText("Painel de Agentes")).toBeInTheDocument();
    expect(screen.getByText("Radar")).toBeInTheDocument();
    expect(screen.getByText("Kimi")).toBeInTheDocument();
  });

  it("renders user email initial in footer", () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <AppSidebar />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByText("test")).toBeInTheDocument();
  });
});
