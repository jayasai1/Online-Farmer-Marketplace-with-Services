import JSONStore from '../config/jsonStore.js';

export const getModel = (name, mongooseModel) => {
  const jsonStore = new JSONStore(name.toLowerCase() + 's');

  return new Proxy(mongooseModel, {
    get(target, prop, receiver) {
      if (global.useMockDb) {
        if (typeof jsonStore[prop] === 'function') {
          return jsonStore[prop].bind(jsonStore);
        }
        return jsonStore[prop];
      }
      return Reflect.get(target, prop, receiver);
    }
  });
};
export default getModel;
