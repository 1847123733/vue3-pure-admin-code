import dayjs from 'dayjs';
export const useDateTool = () => {
  const shortcuts = [
    {
      text: '最近一周',
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        return [start, end];
      }
    },
    {
      text: '最近一个月',
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        return [start, end];
      }
    },
    {
      text: '最近三个月',
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        return [start, end];
      }
    }
  ];

  const weeks: string[] = ['一', '二', '三', '四', '五', '六', '日'];

  const getWeekText = (date: string | Date | number): string => {
    return weeks[dayjs(date).day()];
  };

  const enum DisableDateEnum {
    Before,
    After
  }

  /**
   *禁用日期
   *
   * @param {Date} current
   * @param {DisableDateEnum} disableDateEnum 禁用日期枚举
   * @param {boolean} [containToday=true] 是否包含今天
   * @return {*}  {boolean}
   */
  const disableDate = (current: Date, disableDateEnum: DisableDateEnum, containToday = true): boolean => {
    if (disableDateEnum === DisableDateEnum.Before) {
      if (containToday) {
        return current.getTime() < dayjs().startOf('day').add(1, 'day').valueOf();
      } else {
        return current.getTime() < dayjs().startOf('day').valueOf();
      }
    } else {
      if (containToday) {
        return current.getTime() > dayjs().startOf('day').subtract(1, 'day').valueOf();
      } else {
        return current.getTime() > dayjs().startOf('day').valueOf();
      }
    }
  };

  const disableDateBeforeContainToday = (current: Date): boolean => {
    return disableDate(current, DisableDateEnum.Before, true);
  };

  const disableDateBeforeNotContainToday = (current: Date): boolean => {
    return disableDate(current, DisableDateEnum.Before, false);
  };

  const disableDateAfterContainToday = (current: Date): boolean => {
    return disableDate(current, DisableDateEnum.After, true);
  };

  const disableDateAfterNotContainToday = (current: Date): boolean => {
    return disableDate(current, DisableDateEnum.After, false);
  };

  /**
   *获取时间的差值
   *
   * @param {(string | Date | number)} start
   * @param {(string | Date | number)} end
   * @return {*}  {number}
   */
  const getDiffDay = (start: string | Date | number, end: string | Date | number): number => {
    return dayjs(start).diff(dayjs(end), 'day');
  };

  /**
   *获取前几天的日期
   *
   * @param {number} days
   * @param {*} [start=dayjs()]
   * @param {*} [format = 'YYYY-MM-DD HH:mm:ss']
   * @return {*}  {String}
   */
  const getLastDays = (days: number, format = 'YYYY-MM-DD HH:mm:ss', start = dayjs()): String => {
    return dayjs(start).subtract(days, 'day').format(format);
  };

  /**
   *获取前几月的日期
   *
   * @param {number} days
   * @param {*} [start=dayjs()]
   * @param {*} [format = 'YYYY-MM-DD HH:mm:ss']
   * @return {*}  {String}
   */
  const getLastMonth = (month: number, format = 'YYYY-MM-DD HH:mm:ss', start = dayjs()): String => {
    return dayjs(start).subtract(month, 'month').format(format);
  };
  /**
   *获取日期
   *
   * @param {number} days
   * @param {*} [start=dayjs()]
   * @param {*} [format = 'YYYY-MM-DD HH:mm:ss']
   * @return {*}  {String}
   */
  const getDate = (format = 'YYYY-MM-DD HH:mm:ss', start = dayjs()): String => {
    return dayjs(start).format(format);
  };

  return {
    shortcuts,
    weeks,
    disableDateBeforeContainToday,
    disableDateBeforeNotContainToday,
    disableDateAfterContainToday,
    disableDateAfterNotContainToday,
    getWeekText,
    getDiffDay,
    getLastDays,
    getLastMonth,
    getDate
  };
};
