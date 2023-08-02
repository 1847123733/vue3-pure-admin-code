export const useMousewheel = () => {
  const numberInputMousewheel = (e, row, prop, precision = 1, callback, min, max) => {
    if (e.target.className !== 'el-input__inner') return;
    if (e.target.disabled) return;
    if (row[prop] == undefined) {
      row[prop] = 0;
    }
    if (e.deltaY > 0) {
      const result = row[prop] - precision;
      if (result < min) return;
      row[prop] -= precision;
    } else {
      const result = row[prop] + precision;
      if (result > max) return;
      row[prop] += precision;
    }
    if (callback) callback(row[prop], row);
  };
  return {
    numberInputMousewheel
  };
};
