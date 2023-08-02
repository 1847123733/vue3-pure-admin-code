// 判断是否是字母或数字
export const checkNumOrLetter = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入内容'));
  } else {
    if (/^[0-9a-zA-Z]*$/g.test(value)) {
      callback();
    } else {
      callback(new Error('请输入字母或数字'));
    }
  }
};

// 判断是否是 0或者正整数
export const zeroOrPositiveInteger = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入内容'));
  } else {
    if (/^([0]|[1-9][0-9]*)$/g.test(value)) {
      callback();
    } else {
      callback(new Error('请输入0或者正整数'));
    }
  }
};
// 判断是否是正整数
export const positiveInteger = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入内容'));
  } else {
    if (/^([1-9][0-9]*)$/g.test(value)) {
      callback();
    } else {
      callback(new Error('请输入正整数'));
    }
  }
};
// 判断是否是 0~2,支持2位小数位
export const zeroOrTwoDecimal = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入内容'));
  } else {
    if (/(0?[0-2])(\.\d{1,2})?$/g.test(value)) {
      callback();
    } else {
      callback(new Error('请输入0到2, 可支持2位小数'));
    }
  }
};

// 有1~3位小数的正实数
export const zeroOrThreeDecimal = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入内容'));
  } else {
    if (/^[0-9]+(\.[0-9]{1,3})?$/g.test(value)) {
      callback();
    } else {
      callback(new Error('请输入正实数，可有1~3位小数'));
    }
  }
};

// 判断是否是数字 ,支持2位小数位
export const twoDecimal = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入内容'));
  } else {
    if (/^[0-9]*(\.\d{0,2})?$/g.test(value)) {
      callback();
    } else {
      callback(new Error('请输入正数, 可支持2位小数'));
    }
  }
};

// 请输入大于0的数字，最多支持2位小数
export const greaterTwoDecimal = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入内容'));
  } else {
    if (value == 0) {
      callback(new Error('请输入大于0的数字，最多支持2位小数'));
    } else {
      if (/^([1-9]\d*|0)(\.\d{1,2})?$/g.test(value)) {
        if (value > 99999999.99) {
          callback(new Error('最大为99999999.99'));
        } else {
          callback();
        }
      } else {
        callback(new Error('请输入大于0的数字，最多支持2位小数'));
      }
    }
  }
};
