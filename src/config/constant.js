const userConstant = {
  STATUS_ACTIVE: 1,
  STATUS_INACTIVE: 0,
  STATUS_DISABLED: -1,
  STATUS_REMOVED: 2,
};

const itemStatus={
STATUS_ACTIVE: 1,
STATUS_INACTIVE: 0,
STATUS_DISABLED: -1,
};

const branchStatus = {
  STATUS_INACTIVE: 0,
  STATUS_VERFIED: 1,
  STATUS_REJECT: 2,
  STATUS_ACTIVE: 3,
};


const approvalStatus = {
  STATUS_PENDING: 0,
  STATUS_APPROVED: 1,
  STATUS_REJECT: -1
};

const businessStatus = {
  STATUS_INACTIVE: 0,
  STATUS_VERFIED: 1,
  STATUS_REJECT: 2,
  STATUS_ACTIVE: 3,
};

const verificationCodeConstant = {
  TYPE_EMAIL_VERIFICATION: 1,
  TYPE_RESET_PASSWORD: 2,
  STATUS_NOT_USED: 0,
  STATUS_USED: 1,
};

module.exports = {
  userConstant,
  verificationCodeConstant,
  branchStatus,
  businessStatus,
itemStatus
,
  approvalStatus
};
