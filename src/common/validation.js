const isEmpty = value => value === undefined || value === null || value === '';
const join = (rules) => (value, data) =>
  rules.map(rule => rule(value, data)).filter(error => !!error)[0];

export function email(value) {
  // Let's not start a debate on email regex. This is just for an example app!
  if (!isEmpty(value) && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return 'Invalid email address';
  }
  return null;
}

export function basicChars(value) {
  // Let's not start a debate on email regex. This is just for an example app!
  if (!isEmpty(value) && !/^[a-z0-9_-]+$/.test(value)) {
    return 'Only a-z, 0-9, _ and - allowed';
  }
  return null;
}

export function checkUrl(value) {
  /* eslint-disable max-len */
  if (!isEmpty(value) && !/^(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?$/i.test(value)) {
  /* eslint-enable max-len */
    return 'Invalid URL';
  }
  return null;
}

export function required(value) {
  if (isEmpty(value)) {
    return 'Required';
  }
  return null;
}

export function minLength(min) {
  return value => {
    if (!isEmpty(value) && value.length < min) {
      return `Min length is ${min}`;
    }
    return null;
  };
}

export function maxLength(max) {
  return value => {
    if (!isEmpty(value) && value.length > max) {
      return `Must be no more than ${max} characters`;
    }
    return null;
  };
}

export function integer(value) {
  if (!Number.isInteger(Number(value))) {
    return 'Must be an integer';
  }
  return null;
}

export function oneOf(enumeration) {
  return value => {
    if (!~enumeration.indexOf(value)) {
      return `Must be one of: ${enumeration.join(', ')}`;
    }
    return null;
  };
}

export function match(field) {
  return (value, data) => {
    if (data) {
      if (value !== data[field]) {
        return 'Do not match';
      }
    }
    return null;
  };
}

export function createValidator(rules) {
  return (data = {}) => {
    const errors = {};
    Object.keys(rules).forEach((key) => {
      const rule = join([].concat(rules[key]));
      const error = rule(data[key], data);
      if (error) {
        errors[key] = error;
      }
    });
    return errors;
  };
}
