export const dataRouter = [
  {
    id: 1,
    functionName: '系统设置',
    type: 'MENU',
    parentId: 0,
    sort: 20000,
    url: '/setting',
    selected: true,
    icon: 'ep:setting',
    visibility: true
  },
  {
    id: 2,
    functionName: '资源管理',
    type: 'INNER_MENU',
    parentId: 1,
    sort: 4,
    url: '/setting/Permission',
    selected: true,
    icon: null,
    visibility: true
  },
  {
    id: 3,
    functionName: '账户管理',
    type: 'INNER_MENU',
    parentId: 1,
    sort: 5,
    url: '/setting/account/Account',
    selected: true,
    icon: null,
    visibility: true
  },
  {
    id: 4,
    functionName: '角色管理',
    type: 'INNER_MENU',
    parentId: 1,
    sort: 6,
    url: '/setting/roles/Roles',
    selected: true,
    icon: null,
    visibility: true
  },
  {
    id: 5,
    functionName: '创建用户',
    type: 'BUTTON',
    parentId: 3,
    sort: 1,
    url: '/systemUser/createUser',
    selected: true,
    icon: null,
    visibility: true
  },
  {
    id: 6,
    functionName: '创建角色',
    type: 'BUTTON',
    parentId: 4,
    sort: 1,
    url: '/setting/roles/Index',
    selected: true,
    icon: '',
    visibility: true
  },
  {
    id: 7,
    functionName: '修改账户',
    type: 'BUTTON',
    parentId: 3,
    sort: 2,
    url: '/systemUser/updateUser',
    selected: true,
    icon: '',
    visibility: true
  },
  {
    id: 8,
    functionName: '重置密码',
    type: 'BUTTON',
    parentId: 3,
    sort: 3,
    url: '/systemUser/resetPassword',
    selected: true,
    icon: '',
    visibility: true
  },
  {
    id: 8,
    functionName: '营运管理',
    type: 'MENU',
    parentId: 0,
    sort: 10000,
    url: '/operation',
    selected: true,
    icon: 'ep:tickets',
    visibility: true
  },
  {
    id: 9,
    functionName: '非主营业务收入统计',
    type: 'INNER_MENU',
    parentId: 8,
    sort: 10010,
    url: '/operation/NonMainBusinessIncome',
    selected: true,
    icon: '',
    visibility: true
  },
  {
    id: 10,
    functionName: '非主营业务收入统计导入',
    type: 'BUTTON',
    parentId: 8,
    sort: 10011,
    url: '/operation/NonMainBusinessIncomeChannel',
    selected: true,
    icon: '',
    visibility: true
  },
  {
    id: 11,
    functionName: '人事薪酬统计',
    type: 'INNER_MENU',
    parentId: 8,
    sort: 10020,
    url: '/operation/PersonnelSalary',
    selected: true,
    icon: '',
    visibility: true
  },
  {
    id: 12,
    functionName: '人事薪酬统计导入',
    type: 'BUTTON',
    parentId: 8,
    sort: 10021,
    url: '/operation/PersonnelSalaryChannel',
    selected: true,
    icon: '',
    visibility: true
  },
  {
    id: 13,
    functionName: '门店工装统计',
    type: 'INNER_MENU',
    parentId: 8,
    sort: 10030,
    url: '/operation/StoreTooling',
    selected: true,
    icon: '',
    visibility: true
  },
  {
    id: 14,
    functionName: '门店房租维护',
    type: 'INNER_MENU',
    parentId: 8,
    sort: 10040,
    url: '/operation/StoreRentMaintenance',
    selected: true,
    icon: '',
    visibility: true
  },
  {
    id: 15,
    functionName: '门店房租维护导入',
    type: 'BUTTON',
    parentId: 8,
    sort: 10041,
    url: '/operation/StoreRentMaintenanceChannel',
    selected: true,
    icon: '',
    visibility: true
  }
];
