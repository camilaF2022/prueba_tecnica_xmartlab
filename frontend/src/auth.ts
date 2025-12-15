export const isLoged = (): boolean => Boolean(localStorage.getItem("access"));

export const logout = (): void => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};