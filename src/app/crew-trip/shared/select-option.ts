// select-options.ts
export const SelectOptions = {
  GENDER: [
    {value: null, display: 'Choose gender'},
    {value: 0, display: 'Female'},
    {value: 1, display: 'Male'},
  ],
  STATUS: [
    {value: null, display: 'Choose status'},
    {value: 'active', display: 'Active'},
    {value: 'inactive', display: 'Inactive'},
  ],
  EMAIL_TYPE: [
    {value: null, display: '-- All email type --'},
    {value: 'active', display: 'Estimated schedule email'},
    {value: 'inactive', display: 'Changed schedule email'},
  ],
OTHER_CREW_TYPE: [
  {
    label:'Always use hotel',code:'ALWAYS_USE_HOTEL'
  },{
    label:'Not use hotel',code:'NOT_USE_HOTEL'
  },{
    label:'Not eligible to use hotel, but will use hotel',code:'NOT_MEET_CONDITION_BUT_USE'
  }
  ],
};
