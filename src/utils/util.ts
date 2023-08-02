/*
  创建随机字符串
*/
export function randomString(num) {
  const chars = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
  ];
  let res = '';
  for (let i = 0; i < num; i++) {
    const id = Math.ceil(Math.random() * 35);
    res += chars[id];
  }
  return res;
}

/**
 * 文件下载
 * @param {Stream} stream  文件流
 * @param {Boolean} type  类型
 * @param {String || Number} name  文件名
 */
export const downloadFile = (stream, type, name) => {
  let blob;
  if (type) {
    blob = new Blob([stream], { type: 'application/vnd.ms-excel' });
  } else {
    blob = new Blob([stream]);
  }
  const fileName = name;
  //对于<a>标签，只有 Firefox 和 Chrome（内核） 支持 download 属性
  //IE10以上支持blob但是依然不支持download
  if ('download' in document.createElement('a')) {
    //支持a标签download的浏览器
    const link = document.createElement('a'); //创建a标签
    link.download = fileName; //a标签添加属性
    link.style.display = 'none';
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click(); //执行下载
    URL.revokeObjectURL(link.href); //释放url
    document.body.removeChild(link); //释放标签
  } else {
    //其他浏览器
    navigator.msSaveBlob(blob, fileName);
  }
};
