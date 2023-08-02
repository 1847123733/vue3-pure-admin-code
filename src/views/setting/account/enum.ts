export enum StateType {
  SUSPEND = '停用',
  NORMAL = '正常'
}

export const stateSelect = Object.entries(StateType).map(([key, value]) => ({
  label: value,
  value: key
}));
