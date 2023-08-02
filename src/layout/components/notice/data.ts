export interface ListItem {
  avatar: string;
  title: string;
  datetime: string;
  type: string;
  description: string;
  status?: '' | 'success' | 'warning' | 'info' | 'danger';
  extra?: string;
}

export interface TabItem {
  key: string;
  name: string;
  list: ListItem[];
}

export const noticesData: TabItem[] = [
  {
    key: '1',
    name: '通知',
    list: [
      {
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
        title: '桃李春风一杯酒，江湖夜雨十年灯。',
        datetime: '一年前',
        description: '',
        type: '1'
      }
    ]
  },
  {
    key: '2',
    name: '消息',
    list: [
      {
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
        title: '李白 评论了你',
        description: '长风破浪会有时,直挂云帆济沧海',
        datetime: '一年前',
        type: '2'
      }
    ]
  },
  {
    key: '3',
    name: '代办',
    list: [
      {
        avatar: '',
        title: '任务名称',
        description: '任务需要在 2022-11-16 20:00 前启动',
        datetime: '',
        extra: '未开始',
        status: 'info',
        type: '3'
      }
    ]
  }
];
