jest.mock("@react-native-async-storage/async-storage", () => {
  const mockStorage = new Map();

  return {
    setItem: jest.fn((key, value) => {
      mockStorage.set(key, String(value));
      return Promise.resolve(null);
    }),
    getItem: jest.fn((key) => {
      return Promise.resolve(
        mockStorage.has(key) ? mockStorage.get(key) : null,
      );
    }),
    removeItem: jest.fn((key) => {
      mockStorage.delete(key);
      return Promise.resolve(null);
    }),
    clear: jest.fn(() => {
      mockStorage.clear();
      return Promise.resolve(null);
    }),
    getAllKeys: jest.fn(() => {
      return Promise.resolve(Array.from(mockStorage.keys()));
    }),
    multiGet: jest.fn((keys) => {
      const values = keys.map((key) => [key, mockStorage.get(key) || null]);
      return Promise.resolve(values);
    }),
    multiSet: jest.fn((keyValuePairs) => {
      keyValuePairs.forEach(([key, value]) =>
        mockStorage.set(key, String(value)),
      );
      return Promise.resolve(null);
    }),
    multiRemove: jest.fn((keys) => {
      keys.forEach((key) => mockStorage.delete(key));
      return Promise.resolve(null);
    }),
  };
});
