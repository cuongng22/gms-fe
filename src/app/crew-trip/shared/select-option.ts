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
  NOTI_CONFIG_TYPE: [
    {
      label:'Notification: Budget and procurement plan completed',code:'BUDGET_PLAN_COMPLETE'
    },{
      label:'Warning: Flight schedule change affecting accommodation/transportation',code:'FLIGHT_SCHEDULE_CHANGE'
    },{
      label:'Warning: New version of estimated production available',code:'NEW_ESTIMATED_PRODUCTION'
    },{
      label:'Warning: New version of planned production available',code:'NEW_PLANNED_PRODUCTION'
    },{
      label:'Warning: Abnormal cost decrease',code:'ABNORMAL_COST_DECREASE'
    },{
      label:'Warning: Abnormal cost increase',code:'ABNORMAL_COST_INCREASE'
    },{
      label:'Warning: Contract/appendix expiration',code:'CONTRACT_EXPIRATION'
    },{
      label:'Notification: Payment request needed on CMS',code:'PAYMENT_NEED_CMS'
    },{
      label:'Warning: Procurement needed for contract',code:'PROCUREMENT_NEED_FOR_CONTRACT'
    },{
      label:'Notification: Sending estimated schedule to supplier',code:'SEND_ESTIMATED_SCHEDULE'
    },{
      label:'Warning: Supplier has not yet submitted the invoice',code:'SUPPLIER_NOT_SUBMITTED_INVOICE'
    },{
      label:'Notification: Cost status compared to the planned budget',code:'COST_PLAN_STATUS'
    }
  ],
};
