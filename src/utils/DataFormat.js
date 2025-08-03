// 데이터 파싱 함수 관련
const DataFormat = {
  // 24년도 컨트롤러
  24: {
    RPM: null,
    MOTOR_CURRENT: null,
    BATTERY_VOLTAGE: null,
    THROTTLE_SIGNAL: null,
    CONTROLLER_TEMPERATURE: null,
    SPEED: null,
    BATTERY_PERCENT: null,
  },
  // 25년도 컨트롤러
  25: {
    // Controller L
    Motor_temp_L: null,
    Controller_temp_L: null,
    Current_L: null,
    Voltage_L: null,
    Power_L: null,
    RPM_L: null,
    Torque_L: null,
    Torque_cmd_L: null,
    // Controller_R
    Motor_temp_R: null,
    Controller_temp_R: null,
    Current_R: null,
    Voltage_R: null,
    Power_R: null,
    RPM_R: null,
    Torque_R: null,
    Torque_cmd_R: null,
    // Car_State
    ADC_Signal: null,
    Speed: null,
    Yaw_Rate: null,
    Steering_angle: null,
    Batt_percent: null,
    Total_power: null,
  },
};

module.exports = DataFormat;
