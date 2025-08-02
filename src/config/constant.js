const constant = {
  MAX_LEN_PW: 10,
  // JWT_ACCESS_EXP: 15 * 60, // 15 menit
  JWT_ACCESS_EXP: 7 * 24 * 60 * 60, // 7 hari (temp)
  JWT_REFRESH_EXP: 30 * 24 * 60 * 60, // 30 hari
};
const userConstant = {
  EMAIL_VERIFIED_TRUE: 1,
  EMAIL_VERIFIED_FALSE: 0,
  STATUS_ACTIVE: 1,
  STATUS_INACTIVE: 0,
  STATUS_REMOVED: 2,
  ROLE_STUDENT: 7,
  ONTIME: '07:00:00',
};
const roleConstant = {
  STUDENT_CODE: "STU001DNT",
  ADMIN_CODE: "ADM230E91IN",
  INSTRUKTUR_CODE: "INST2123TR",
  PENGURUS_CODE: "PNG23073RS"
}
const monthName = {
  "01": "Januari",
  "02": "Februari",
  "03": "Maret",
  "04": "April",
  "05": "Mei",
  "06": "Juni",
  "07": "Juli",
  "08": "Agustus",
  "09": "September",
  "10": "Oktober",
  "11": "November",
  "12": "Desember "
}
export { userConstant, roleConstant, monthName };
export default constant;
