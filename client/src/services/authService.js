import { STORAGE_KEYS } from "../lib/constants.js";
import { loadFromStorage, saveToStorage } from "../lib/storage.js";

function getUsers() {
  return loadFromStorage(STORAGE_KEYS.authUsers, []);
}

function setUsers(users) {
  saveToStorage(STORAGE_KEYS.authUsers, users);
}

function sanitizeUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email
  };
}

async function wait() {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 450);
  });
}

export const authService = {
  getSession() {
    return loadFromStorage(STORAGE_KEYS.authSession, null);
  },

  async login({ email, password }) {
    await wait();
    const users = getUsers();
    const matchedUser = users.find(
      (user) => user.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!matchedUser || matchedUser.password !== password) {
      throw new Error("Invalid email or password.");
    }

    const sessionUser = sanitizeUser(matchedUser);
    saveToStorage(STORAGE_KEYS.authSession, sessionUser);
    return sessionUser;
  },

  async signUp({ fullName, email, password }) {
    await wait();
    const users = getUsers();
    const normalizedEmail = email.trim().toLowerCase();

    if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
      throw new Error("An account with this email already exists.");
    }

    const nextUser = {
      id: `user_${Date.now()}`,
      fullName: fullName.trim(),
      email: normalizedEmail,
      password
    };

    const nextUsers = [...users, nextUser];
    setUsers(nextUsers);
    const sessionUser = sanitizeUser(nextUser);
    saveToStorage(STORAGE_KEYS.authSession, sessionUser);
    return sessionUser;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.authSession);
  }
};
