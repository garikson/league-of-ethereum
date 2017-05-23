export function createLogic({
  type = undefined,
  validate = null,
  transform = ({ action }, allow) => allow(action),
  process = (p, d, done) => done(),
  processOptions = {},
  }) {
  return { type, validate, transform, process };
}

export function createLogicMiddleware(logics, deps = {}) {
  return ({ getState, dispatch }) => (next) => (action) => {
    // the types that require buisiness logic
    const stopTypes = logics.map(logic => logic.type);

    // if the action requires logic, stop and do logic, otherwise next..
    if (stopTypes.indexOf(action.type) !== -1) {

      // go through available logic
      logics.forEach(logic => {
        if (action.type === logic.type) {
          const done = () => {};
          const reject = dispatch;
          const fail = error => dispatch({ type: (logic.processOptions || { failType: 'LOGIC_FAILURE' }).failType, error: String(error) });
          const success = value => dispatch({ type: (logic.processOptions || { successType: 'LOGIC_SUCCESS' }).successType, value });
          const processNext = (action) => {
            next(action);

            try {
              (logic.process({ getState, action, ...deps }, dispatch, done) || Promise.resolve(true))
                .then(success)
                .catch(fail);
            } catch (error) {
              fail(error);
            }
          };

          (logic.validate || logic.transform)({ getState, action }, processNext, reject);
        }
      });
    } else {
      next(action);
    }
  };
}
