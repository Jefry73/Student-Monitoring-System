export const setUserSession = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUserSession = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const clearUserSession = () => {
  localStorage.removeItem('user');
};

export const isAdmin = () => {
  const user = getUserSession();
  return user?.role === 'admin';
};

export const isDosen = () => {
  const user = getUserSession();
  return user?.role === 'dosen';
};