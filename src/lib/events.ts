// Small page-wide events so the navbar, command palette and sections can talk without prop drilling.
export const SELECT_PROJECT_EVENT = "portfolio:select-project";
export const OPEN_PALETTE_EVENT = "portfolio:open-palette";

export function selectProject(slug: string) {
  window.dispatchEvent(new CustomEvent<string>(SELECT_PROJECT_EVENT, { detail: slug }));
  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
}

export function openPalette() {
  window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
}
