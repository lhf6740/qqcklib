
/**
* 使用此文件来定义自定义函数和图形块。
* 想了解更详细的信息，请前往 https://makecode.microbit.org/blocks/custom
*/

/**
 * Custom blocks
 */
//% weight=10 icon="\uf013"
//% color=#ECA40D block="器件库"
namespace custom {
    let qqck_Strip: neopixel.Strip;

    let CMD_SYSTEM_CONFIG = 0x24
    let DIG1_ADDRESS = 0x34
    let DIG2_ADDRESS = 0x35
    let DIG3_ADDRESS = 0x36
    let DIG4_ADDRESS = 0x37
    let DatAddressArray = [DIG1_ADDRESS, DIG2_ADDRESS, DIG3_ADDRESS, DIG4_ADDRESS];

    let _SEG = [0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F, 0x77, 0x7C, 0x39, 0x5E, 0x79, 0x71];
    let _intensity = 8
    let dbuf = [0, 0, 0, 0]

    let display_init = true  // 数码管初始化标志
    let mcu_init_flag = true      // 单片机初始化标志

    const COLOR_ADD = 0X53;
    const COLOR_REG = 0x00;
    const COLOR_R = 0X10;
    const COLOR_G = 0X0D;
    const COLOR_B = 0x13;

    let color_init = false;
    let val_red = 0;
    let val_green = 0;
    let val_blue = 0;

    export enum pinAddr {
        P1 = 1,
        P2 = 2,
        P3 = 3,
        P4 = 4
    }

    export enum enMotors {
        M1 = 5,
        M2 = 6,
        M3 = 7,
        M4 = 8,
        //% block="全部"
        MALL = 0,
    }

    export enum enServo {
        S1 = 9,
        S2 = 10,
        S3 = 11,
        S4 = 12,
    }

    export enum msg_Addr {
        Mcu_addr = 45,
        Mcu_init_addr = 0,
    }

    export enum deviceType {
        Mcu_aoutput_addr = 0x10,
        Mcu_doutput_1p_addr = 0x11,
        Mcu_doutput_2p_addr = 0x12,

        Mcu_dinput_1p_addr = 0x20,
        Mcu_dinput_2p_addr = 0x21,

        Mcu_ainput_1p_addr = 0x30,
        Mcu_ainput_2p_addr = 0x31,
        Mcu_ultrasonic_addr = 0x32,
    }

    export enum wireless_Addr {
        JdyRFC = 0x30,  //频道地址
        JdyA_X = 0X32,
        JdyA_Y = 0X34,
        JdyB_X = 0X36,
        JdyB_Y = 0X38,
        Jdy_Up = 0X3A,
        Jdy_Down = 0X3B,
        Jdy_Left = 0X3C,
        Jdy_Right = 0X3D,
        Jdy_A = 0X3E,
        Jdy_B = 0X3F,
        Jdy_C = 0X40,
        Jdy_D = 0X41,
    }

    export enum DOutputModule {
        //% block="LED"
        LED,
        //% block="振动马达"
        FAN
    }

    export enum SwitchState {
        //% block="打开"
        ON = 1,
        //% block="关闭"
        OFF = 0,
    }

    export enum pwm_ratio {
        //% block="0%"
        Ratio_0 = 0,
        //% block="25%"
        Ratio_25 = 1,
        //% block="50%"
        Ratio_50 = 2,
        //% block="75%"
        Ratio_75 = 3,
        //% block="100%"
        Ratio_100 = 4,
    }

    /*************************  Output - 交通灯模块 *************************/
    export enum TrafficLightLED {
        //% block="全灭"
        AllTurnOFF = 0,
        //% block="亮绿灯"
        RedLED = 1,
        //% block="亮黄灯"
        YellowLED = 2,
        //% block="亮红灯"
        GreenLED = 3,
    }

    export enum enButton {
        //% block="按下"
        Press = 0,
        //% block="松开"
        Realse = 1
    }

    export enum enObstacle {
        //% block="有障碍"
        Obstacle = 0,
        //% block="无障碍"
        NoObstacle = 1
    }

    export enum enPIR {
        //% block="没人存在"
        NoPIR = 0,
        //% block="有人存在"
        OPIR = 1
    }

    export enum enAxis {
        //% block="x轴"
        x = 0,
        //% block="y轴"
        y = 1,
    }

    export enum enRocker {
        //% block="居中"
        NoState = 0,
        //% block="上"
        Up = 1,
        //% block="下"
        Down = 2,
        //% block="左"
        Left = 3,
        //% block="右"
        Right = 4,
    }

    export enum enDisplayShow {
        //% block="不显示"
        NoDisplay = 0,
        //% block="显示"
        Display = 1,
    }

    export enum enGetRGB {
        //% block="R值"
        GetValueR = 0,
        //% block="G值"
        GetValueG = 1,
        //% block="B值"
        GetValueB = 2
    }

    export enum enJdyRocker {
        //% block="A"
        Button_A = 0,
        //% block="B"
        Button_B = 1,
        //% block="C"
        Button_C = 2,
        //% block="D"
        Button_D = 3,
    }

    export enum enScore {
        //% block="前"
        Score_front = 0,
        //% block="后"
        Score_next = 1,
    }

    /**
    * @param index
    */
    //% group="输出"
    //% block="板载RGB灯"
    //% weight=99
    //% blockGap=10
    export function RGB_Program(): neopixel.Strip {
        if (!qqck_Strip) {
            qqck_Strip = neopixel.create(DigitalPin.P12, 2, NeoPixelMode.RGB);
        }
        return qqck_Strip;
    }

    /**
     * I2C写函数，addr:器件地址。reg：寄存器地址。value:值。
     */
    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    /**
     * 单片机初始化函数
     */
    function mcu_config() {
        if (mcu_init_flag) {
            i2cwrite(msg_Addr.Mcu_addr, msg_Addr.Mcu_init_addr, 0x5a);
            basic.pause(50)
            mcu_init_flag = false;
        }
    }

    /**
    * 
    * @param adom module. eg: DOutputModule.LED
    * @param percentage eg: 0
    */
    //% group="输出"
    //% block="%adom|连接|%index| 档位 %percentage"
    //% weight=98 blockGap=10
    //% adom.fieldEditor="gridpicker" adom.fieldOptions.columns=2
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    //% percentage.min=0 percentage.max=4
    export function dOutputModule(adom: DOutputModule, index: pinAddr, percentage: number): void {
        mcu_config();
        i2cwrite(msg_Addr.Mcu_addr, index, deviceType.Mcu_aoutput_addr); //往Px端口地址写器件类型
        i2cwrite(msg_Addr.Mcu_addr, index * 8 + 8, Math.floor(percentage));//写入控制参数
    }

    /**
    * @param index pin. eg: pinAddr.P1
    * @param dom pin. eg: DOutputModule.LED
    * @param sws switch state. eg: SwitchState.ON
    */
    //% group="输出"
    //% block="%dom| 连接 %index| %sws"
    //% weight=97 blockGap=10
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    //% dom.fieldEditor="gridpicker" dom.fieldOptions.columns=2
    //% sws.fieldEditor="gridpicker" sws.fieldOptions.columns=2
    export function digitalOutputModule(dom: DOutputModule, index: pinAddr, sws: SwitchState): void {
        mcu_config();
        i2cwrite(msg_Addr.Mcu_addr, index, deviceType.Mcu_doutput_1p_addr); //往Px端口地址写器件类型
        i2cwrite(msg_Addr.Mcu_addr, index * 8 + 8, sws);//往Px端口数据/命令地址，写入控制参数
    }

    //% group="输出"
    //% block="交通灯连接|%index|%wColor"
    //% weight=96 blockGap=10
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    //% wColor.fieldEditor="gridpicker" wColor.fieldOptions.columns=2
    export function trafficLightModule(index: pinAddr, wColor: TrafficLightLED): void {
        mcu_config();
        i2cwrite(msg_Addr.Mcu_addr, index, deviceType.Mcu_doutput_2p_addr); //往Px端口地址写器件类型
        i2cwrite(msg_Addr.Mcu_addr, index * 8 + 8, wColor);//往Px端口数据/命令地址，写入控制参数
    }

    //% group="输出"
    //% block="舵机 |%index|角度|%value"
    //% weight=95 blockGap=10
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    //% value.min=0 value.max=225
    export function Servo(index: enServo, value: number): void {
        mcu_config();
        let angle_value = Math.trunc(Math.floor(value) * 0.689 + 86);
        i2cwrite(msg_Addr.Mcu_addr, index, angle_value);
    }

    /**
     * 设置直流电机的方向及速度
     * @param speed eg: 0
     */
    //% group="输出"
    //% block="直流电机|%index|速度(-100~100) %speed"
    //% weight=94
    //% blockGap=10
    //% speed.min=-100 speed.max=100
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    export function MotorRun(index: enMotors, speed: number): void {
        mcu_config();
        let speed_int = Math.floor(speed);
        if (speed_int >= 0) {
            if (index == enMotors.MALL) {
                i2cwrite(msg_Addr.Mcu_addr, enMotors.M1, speed_int)
                i2cwrite(msg_Addr.Mcu_addr, enMotors.M2, speed_int)
                i2cwrite(msg_Addr.Mcu_addr, enMotors.M3, speed_int)
                i2cwrite(msg_Addr.Mcu_addr, enMotors.M4, speed_int)
            }
            else {
                i2cwrite(msg_Addr.Mcu_addr, index, speed_int)
            }
        }
        else {
            if (index == enMotors.MALL) {
                i2cwrite(msg_Addr.Mcu_addr, enMotors.M1, -speed_int + 100)
                i2cwrite(msg_Addr.Mcu_addr, enMotors.M2, -speed_int + 100)
                i2cwrite(msg_Addr.Mcu_addr, enMotors.M3, -speed_int + 100)
                i2cwrite(msg_Addr.Mcu_addr, enMotors.M4, -speed_int + 100)
            }
            else {
                i2cwrite(msg_Addr.Mcu_addr, index, -speed_int + 100);
            }
        }
    }

    /**
     * 让直流电机停止
     */
    //% group="输出"
    //% block="直流电机|%index|停止"
    //% weight=93
    //% blockGap=10
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    export function MotorStop(index: enMotors): void {
        mcu_config();
        if (index == enMotors.MALL) {
            i2cwrite(msg_Addr.Mcu_addr, enMotors.M1, 0)
            i2cwrite(msg_Addr.Mcu_addr, enMotors.M2, 0)
            i2cwrite(msg_Addr.Mcu_addr, enMotors.M3, 0)
            i2cwrite(msg_Addr.Mcu_addr, enMotors.M4, 0)
        }
        else {
            i2cwrite(msg_Addr.Mcu_addr, index, 0)
        }
    }

    //% blockId="YFSENSORS_TM650_SHOW_NUMBER1" weight=92 blockGap=10
    //% block="数码管 显示数字 %num"
    export function showNumber1(num: number) {
        if (display_init) {
            on();
            clear();
            display_init = false
        }

        if (isinteger(num)) {
            if (num < 0) {
                dat(0, 0x40) // '-'
                num = -num
            }
            else
                digit(0, Math.idiv(num, 1000) % 10)
            digit(3, num % 10)
            digit(2, Math.idiv(num, 10) % 10)
            digit(1, Math.idiv(num, 100) % 10)
        }
        else {

            num = Math.round(num * 100)
            num = Math.floor(num) / 100

            let floatstr = num.toString()
            let index = 3

            if (floatstr.includes('.')) {
                if (floatstr[floatstr.length - 2] == '.') {
                    index = 2
                    num = num * 10
                }
                else {
                    index = 1
                    num = Math.floor(num * 100)
                }
            }

            if (num < 0) {
                dat(0, 0x40) // '-'
                num = -num
            }
            else
                digit(0, Math.idiv(num, 1000) % 10)
            digit(3, num % 10)
            digit(2, Math.idiv(num, 10) % 10)
            digit(1, Math.idiv(num, 100) % 10)

            showDpAt(index, enDisplayShow.Display)
        }
    }

    let button_init = false;
    /**
    * Read the Button Module.
    * @param dimPin pin. eg: pinAddr.P1
    * @param value pin. eg: enButton.Press
    */
    //% group="输入"
    //% block="%value|按键 |%index|？"
    //% weight=89 blockGap=10
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    //% value.fieldEditor="gridpicker" value.fieldOptions.columns=2
    export function Button(index: pinAddr, value: enButton): boolean {
        mcu_config();
        if (!button_init) {
            i2cwrite(msg_Addr.Mcu_addr, index, deviceType.Mcu_dinput_1p_addr); //往Px端口地址写器件类型
            pins.i2cWriteNumber(msg_Addr.Mcu_addr, index * 8 + 8, NumberFormat.UInt8LE, false);
            pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false)
            basic.pause(10)
            button_init = true;
        }
        pins.i2cWriteNumber(msg_Addr.Mcu_addr, index * 8 + 8, NumberFormat.UInt8LE, false);
        if (pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false) == value) {
            return true;
        }
        else {
            return false;
        }
    }

    //% group="输入"
    //% block="红外传感器 |%value_DNum|检测到 %value|？"
    //% weight=87 blockGap=10
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    //% value.fieldEditor="gridpicker" value.fieldOptions.columns=2
    export function IR(index: pinAddr, value: enObstacle): boolean {
        mcu_config();
        i2cwrite(msg_Addr.Mcu_addr, index, deviceType.Mcu_dinput_1p_addr); //往Px端口地址写器件类型
        pins.i2cWriteNumber(msg_Addr.Mcu_addr, index * 8 + 8, NumberFormat.UInt8LE, false);
        if (pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false) == value) {
            return true;
        }
        else {
            return false;
        }
    }

    //% group="输入"
    //% block="人体红外传感器 |%value_DNum|检测到 %value|？"
    //% weight=86 blockGap=10
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    //% value.fieldEditor="gridpicker" value.fieldOptions.columns=2
    export function PIR(index: pinAddr, value: enPIR): boolean {
        mcu_config();
        i2cwrite(msg_Addr.Mcu_addr, index, deviceType.Mcu_dinput_1p_addr); //往Px端口地址写器件类型
        pins.i2cWriteNumber(msg_Addr.Mcu_addr, index * 8 + 8, NumberFormat.UInt8LE, false);
        if (pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false) == value) {
            return true;
        }
        else {
            return false;
        }
    }

    //% group="输入"
    //% block="电位器 | %index|的值"
    //% weight=85 blockGap=10
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    export function Potentiometer(index: pinAddr): number {
        let buff_data = pins.createBuffer(2);
        mcu_config();

        i2cwrite(msg_Addr.Mcu_addr, index, deviceType.Mcu_ainput_1p_addr); //往Px端口地址写器件类型

        pins.i2cWriteNumber(msg_Addr.Mcu_addr, index * 8 + 8, NumberFormat.UInt8LE, false);
        buff_data[0] = pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false)

        pins.i2cWriteNumber(msg_Addr.Mcu_addr, index * 8 + 9, NumberFormat.UInt8LE, false);
        buff_data[1] = pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false)

        let get_value = (buff_data[1] & 0xff) << 8 | (buff_data[0] & 0xff);
        return get_value;
    }

    //% group="输入"
    //% block="光敏传感器|%index|的值"
    //% weight=84 blockGap=10
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    export function Light(index: pinAddr): number {
        let buff_data = pins.createBuffer(2);
        mcu_config();

        i2cwrite(msg_Addr.Mcu_addr, index, deviceType.Mcu_ainput_1p_addr); //往Px端口地址写器件类型
        pins.i2cWriteNumber(msg_Addr.Mcu_addr, index * 8 + 8, NumberFormat.UInt8LE, false);
        buff_data[0] = pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false)

        pins.i2cWriteNumber(msg_Addr.Mcu_addr, index * 8 + 9, NumberFormat.UInt8LE, false);
        buff_data[1] = pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false)

        let get_value = (buff_data[1] & 0xff) << 8 | (buff_data[0] & 0xff);
        return get_value;
    }

    //% group="输入"
    //% block="摇杆|%index|状态为|%value|？"
    //% weight=83 blockGap=10
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    export function Rocker(index: pinAddr, value: enRocker): boolean {

        let buff_x = pins.createBuffer(2);
        let buff_y = pins.createBuffer(2);
        mcu_config();

        i2cwrite(msg_Addr.Mcu_addr, index, deviceType.Mcu_ainput_2p_addr); //往Px端口地址写器件类型
        pins.i2cWriteNumber(msg_Addr.Mcu_addr, index * 8 + 8, NumberFormat.UInt8LE, false);
        buff_x[0] = pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false)

        pins.i2cWriteNumber(msg_Addr.Mcu_addr, index * 8 + 9, NumberFormat.UInt8LE, false);
        buff_x[1] = pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false)

        let x = (buff_x[1] & 0xff) << 8 | (buff_x[0] & 0xff);

        i2cwrite(msg_Addr.Mcu_addr, index, deviceType.Mcu_ainput_2p_addr); //往Px端口地址写器件类型
        pins.i2cWriteNumber(msg_Addr.Mcu_addr, index * 8 + 10, NumberFormat.UInt8LE, false);
        buff_y[0] = pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false);

        pins.i2cWriteNumber(msg_Addr.Mcu_addr, index * 8 + 11, NumberFormat.UInt8LE, false);
        buff_y[1] = pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false);

        let y = (buff_y[1] & 0xff) << 8 | (buff_y[0] & 0xff);

        let now_state = false;
        if (value == enRocker.Left) {
            if (x < 100) { // 左
                now_state = true;
            }
        }
        else if (value == enRocker.Right) {
            if (x > 700) { //右
                now_state = true;
            }
        }
        else if (value == enRocker.Down) {
            if (y < 100) { //下
                now_state = true;
            }
        }
        else if (value == enRocker.Up) {
            if (y > 700) { //上
                now_state = true;
            }
        }
        else {
            if (x >= 100 && x <= 700) {
                if (y >= 100 && y <= 700) {
                    now_state = true;
                }
            }
        }
        return now_state;
    }

    //% group="输入"
    //% block="摇杆|%index|%axis|的值"
    //% weight=82 blockGap=10
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    export function Rocker_x(index: pinAddr, axis: enAxis): number {
        mcu_config();

        if (axis == enAxis.x) {
            let buff_x = pins.createBuffer(2);
            i2cwrite(msg_Addr.Mcu_addr, index, deviceType.Mcu_ainput_2p_addr); //往Px端口地址写器件类型
            pins.i2cWriteNumber(msg_Addr.Mcu_addr, index * 8 + 8, NumberFormat.UInt8LE, false);
            buff_x[0] = pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false)

            pins.i2cWriteNumber(msg_Addr.Mcu_addr, index * 8 + 9, NumberFormat.UInt8LE, false);
            buff_x[1] = pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false)

            let x = (buff_x[1] & 0xff) << 8 | (buff_x[0] & 0xff);
            return x;
        }
        else {
            let buff_y = pins.createBuffer(2);

            i2cwrite(msg_Addr.Mcu_addr, index, deviceType.Mcu_ainput_2p_addr); //往Px端口地址写器件类型
            pins.i2cWriteNumber(msg_Addr.Mcu_addr, index * 8 + 10, NumberFormat.UInt8LE, false);
            buff_y[0] = pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false);

            pins.i2cWriteNumber(msg_Addr.Mcu_addr, index * 8 + 11, NumberFormat.UInt8LE, false);
            buff_y[1] = pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false);

            let y = (buff_y[1] & 0xff) << 8 | (buff_y[0] & 0xff);
            return y;
        }

    }

    //% group="输入"
    //% block="超声波|%index|的值"
    //% weight=81 blockGap=10
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    export function Ultrasonic(index: pinAddr): number {
        let buff_data = pins.createBuffer(2);
        mcu_config();

        i2cwrite(msg_Addr.Mcu_addr, index, deviceType.Mcu_ultrasonic_addr); //往Px端口地址写器件类型
        pins.i2cWriteNumber(msg_Addr.Mcu_addr, index * 8 + 8, NumberFormat.UInt8LE, false);
        buff_data[0] = pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false)

        pins.i2cWriteNumber(msg_Addr.Mcu_addr, index * 8 + 9, NumberFormat.UInt8LE, false);
        buff_data[1] = pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false)

        let get_value = (buff_data[1] & 0xff) << 8 | (buff_data[0] & 0xff);
        return get_value;
    }

    /**
    * 颜色传感器显示相关函数
    */
    function i2cWriteData(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = value;
        pins.i2cWriteBuffer(addr, buf);
    }

    function setRegConfig(): void {
        i2cWriteData(COLOR_ADD, COLOR_REG, 0X06);
        i2cWriteData(COLOR_ADD, 0X04, 0X41);
        i2cWriteData(COLOR_ADD, 0x05, 0x01);
    }

    function initColorI2C(): void {
        setRegConfig();
        color_init = true;
    }

    function GetRGB(): void {
        let buff_R = pins.createBuffer(2);
        let buff_G = pins.createBuffer(2);
        let buff_B = pins.createBuffer(2);

        pins.i2cWriteNumber(COLOR_ADD, COLOR_R, NumberFormat.UInt8BE);
        buff_R = pins.i2cReadBuffer(COLOR_ADD, 2);

        pins.i2cWriteNumber(COLOR_ADD, COLOR_G, NumberFormat.UInt8BE);
        buff_G = pins.i2cReadBuffer(COLOR_ADD, 2);

        pins.i2cWriteNumber(COLOR_ADD, COLOR_B, NumberFormat.UInt8BE);
        buff_B = pins.i2cReadBuffer(COLOR_ADD, 2);

        let Red = (buff_R[1] & 0xff) << 8 | (buff_R[0] & 0xff);
        let Green = (buff_G[1] & 0xff) << 8 | (buff_G[0] & 0xff);
        let Blue = (buff_B[1] & 0xff) << 8 | (buff_B[0] & 0xff);

        if (Red > 4500) Red = 2300;
        if (Green > 7600) Green = 4600;
        if (Blue > 4600) Blue = 2700;

        val_red = Math.map(Red, 0, 2300, 0, 255);
        val_green = Math.map(Green, 0, 4600, 0, 255);
        val_blue = Math.map(Blue, 0, 2700, 0, 255);

        if (val_red > 255) val_red = 255;
        if (val_green > 255) val_green = 255;
        if (val_blue > 255) val_blue = 255;

        if (val_red == val_green && val_red == val_blue) {
            val_red = 255;
            val_green = 255;
            val_blue == 255;
        }
        else if (val_red > val_green && val_red > val_blue) {
            val_red = 255;
            val_green /= 2;
            val_blue /= 2;
        }
        else if (val_green > val_red && val_green > val_blue) {
            val_green = 255;
            val_red /= 2;
            val_blue /= 2;
        }
        else if (val_blue > val_red && val_blue > val_green) {
            val_blue = 255;
            val_red /= 2;
            val_green /= 2;
        }
    }

    //% group="输入"
    //% block="颜色传感器的|%value"
    //% weight=80 blockGap=10
    export function GetRGBValue(value: enGetRGB): number {
        if (!color_init) {
            initColorI2C();
        }
        GetRGB();
        switch (value) {
            case enGetRGB.GetValueR:
                return val_red;
            case enGetRGB.GetValueG:
                return val_green;
            case enGetRGB.GetValueB:
                return val_blue;
            default:
                break;
        }
        return 0;
    }

    /**
    * 数码管显示相关函数
    */
    function writeByte(firstByte: number, secondByte: number) {
        pins.i2cWriteNumber(firstByte, secondByte, NumberFormat.UInt8LE, false)
    }

    /**
 * send command to display
 * @param c command, eg: 0
 */
    function cmd(c: number) {
        writeByte(CMD_SYSTEM_CONFIG, c);
    }

    /**
     * send data to display
     * @param d data, eg: 0
     * @param bit bit, eg: 0
     */
    function dat(bit: number, d: number) {
        writeByte(DatAddressArray[bit % 4], d);
    }

    /**
     * turn on display
     */
    //% block="数码管 打开显示"
    //% subcategory="数码管"
    //% weight=15 blockGap=8
    export function on() {
        cmd(_intensity * 16 + 1)
    }

    /**
     * turn off display
     */
    //% subcategory="数码管"
    //% blockId="YFSENSORS_TM650_OFF" weight=10 blockGap=8
    //% block="数码管 关闭显示"
    export function off() {
        _intensity = 0
        cmd(0)
    }

    /**
     * clear display content
     */
    //% subcategory="数码管"
    //% weight=5 blockGap=8
    //% block="数码管 清除显示"
    export function clear() {
        dat(0, 0)
        dat(1, 0)
        dat(2, 0)
        dat(3, 0)
        dbuf = [0, 0, 0, 0]
    }

    /**
     * show a digital in given position
     * @param num is number (0-15) will be shown, eg: 1
     * @param bit is position, eg: 0
     */
    //% subcategory="数码管"
    //% weight=40 blockGap=8
    //% block="数码管 |在第 %bit|位，显示数字 %num"
    //% bit.max=3 bit.min=0
    //% num.max=15 num.min=0
    export function digit(bit: number, num: number) {
        if (display_init) {
            on();
            clear();
            display_init = false
        }
        dbuf[bit % 4] = _SEG[num % 16]
        dat(bit, _SEG[num % 16])
    }

    /**
    * 判断是小数还是浮点数
    */
    function isinteger(num: number) {
        return (num | 0) === num
    }

    /**
     * show a number in display
     * @param num is number will be shown, eg: 100
     */
    //% subcategory="数码管"
    //% blockId="YFSENSORS_TM650_SHOW_NUMBER" weight=45 blockGap=8
    //% block="数码管 显示数字 %num"
    export function showNumber(num: number) {
        if (display_init) {
            on();
            clear();
            display_init = false
        }

        if (isinteger(num)) {
            if (num < 0) {
                dat(0, 0x40) // '-'
                num = -num
            }
            else
                digit(0, Math.idiv(num, 1000) % 10)
            digit(3, num % 10)
            digit(2, Math.idiv(num, 10) % 10)
            digit(1, Math.idiv(num, 100) % 10)
        }
        else {

            num = Math.round(num * 100)
            num = Math.floor(num) / 100

            let floatstr = num.toString()
            let index = 3

            if (floatstr.includes('.')) {
                if (floatstr[floatstr.length - 2] == '.') {
                    index = 2
                    num = num * 10
                }
                else {
                    index = 1
                    num = Math.floor(num * 100)
                }
            }

            if (num < 0) {
                dat(0, 0x40) // '-'
                num = -num
            }
            else
                digit(0, Math.idiv(num, 1000) % 10)
            digit(3, num % 10)
            digit(2, Math.idiv(num, 10) % 10)
            digit(1, Math.idiv(num, 100) % 10)

            showDpAt(index, enDisplayShow.Display)
        }
    }

    /**
     * show a number in hex format
     * @param num is number will be shown, eg: 123
     */
    //% subcategory="数码管"
    //% weight=43 blockGap=8
    //% block="数码管 显示16进制数字 %num"
    export function showHex(num: number) {
        if (display_init) {
            on();
            clear();
            display_init = false
        }

        if (num < 0) {
            dat(0, 0x40) // '-'
            num = -num
        }
        else
            digit(0, (num >> 12) % 16)
        digit(3, num % 16)
        digit(2, (num >> 4) % 16)
        digit(1, (num >> 8) % 16)
    }

    /**
     * show Dot Point in given position
     * @param bit is positiion, eg: 0
     * @param show is true/false, eg: enDisplayShow.Display
     */
    //% subcategory="数码管"
    //% weight=38 blockGap=8
    //% block="数码管 在第 %bit|位的点| %show"
    //% bit.max=3 bit.min=0
    export function showDpAt(bit: number, show: enDisplayShow) {
        if (display_init) {
            on();
            clear();
            display_init = false
        }

        if (show == enDisplayShow.Display) dat(bit, dbuf[bit % 4] | 0x80)
        else dat(bit, dbuf[bit % 4] & 0x7F)
    }

    /**
    * 只能显示0-99以内的数，不能显示小数和负数
    */
    //% subcategory="数码管"
    //% weight=34 blockGap=8
    //% block="数码管 显示| %bit |比分 %num"
    //% num.max=99 num.min=0
    export function setScore(bit: enScore, num: number) {
        if (display_init) {
            on();
            clear();
            display_init = false;

        }

        showDpAt(1, enDisplayShow.Display)

        if (bit == enScore.Score_front) {
            if (num < 0) {
                dat(0, 0xC0) // '-.'
                num = -num
            }
            else {
                digit(0, Math.idiv(num, 10) % 10)
                showDpAt(0, enDisplayShow.Display)
            }
            digit(1, num % 10)
        }
        else {
            if (num < 0) {
                dat(2, 0x40) // '-'
                num = -num
            }
            else
                digit(2, Math.idiv(num, 10) % 10)
            digit(3, num % 10)
        }
    }

    /**
     * set display intensity
     * @param dat is intensity of the display, eg: 3
     */
    //% subcategory="数码管"
    //% weight=35 blockGap=8
    //% block="数码管 设置显示亮度 %dat"
    //% dat.max=7 dat.min=0
    export function setIntensity(dat: number) {
        if (display_init) {
            on();
            clear();
            display_init = false
        }

        if ((dat < 0) || (dat > 8))
            return;
        if (dat == 0)
            off()
        else {
            _intensity = dat
            cmd((dat << 4) | 0x01)
        }
    }



    /**
    * 设置无线频道，频道一致才能进行通讯
    * @param RFC eg: 1
    */

    //% block="设置无线频道为|%dat"
    //% subcategory="无线手柄"
    //% weight=99 blockGap=8
    //% RFC.min=1 RFC.max=127
    export function set_JdyRFC(RFC: number) {
        mcu_config();
        i2cwrite(msg_Addr.Mcu_addr, RFC, wireless_Addr.JdyRFC); //写入无线模块的频道
    }

    //% block="手柄 摇杆状态为|%value|？"
    //% subcategory="无线手柄"
    //% weight=98 blockGap=10
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    export function jdyRocker(value: enRocker): boolean {

        let buff_x = pins.createBuffer(2);
        let buff_y = pins.createBuffer(2);
        mcu_config();

        pins.i2cWriteNumber(msg_Addr.Mcu_addr, wireless_Addr.JdyA_X, NumberFormat.UInt8LE, false);
        buff_x[0] = pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false)

        pins.i2cWriteNumber(msg_Addr.Mcu_addr, (wireless_Addr.JdyA_X + 1), NumberFormat.UInt8LE, false);
        buff_x[1] = pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false)
        let x = (buff_x[1] & 0xff) << 8 | (buff_x[0] & 0xff);

        pins.i2cWriteNumber(msg_Addr.Mcu_addr, wireless_Addr.JdyA_Y, NumberFormat.UInt8LE, false);
        buff_y[0] = pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false);

        pins.i2cWriteNumber(msg_Addr.Mcu_addr, (wireless_Addr.JdyA_Y + 1), NumberFormat.UInt8LE, false);
        buff_y[1] = pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false);
        let y = (buff_y[1] & 0xff) << 8 | (buff_y[0] & 0xff);

        let now_state = false;
        if (value == enRocker.Left) {
            if (x < 100) { // 左
                now_state = true;
            }
        }
        else if (value == enRocker.Right) {
            if (x > 700) { //右
                now_state = true;
            }
        }
        else if (value == enRocker.Down) {
            if (y < 100) { //下
                now_state = true;
            }
        }
        else if (value == enRocker.Up) {
            if (y > 700) { //上
                now_state = true;
            }
        }
        else {
            if (x >= 100 && x <= 700) {
                if (y >= 100 && y <= 700) {
                    now_state = true;
                }
            }
        }
        return now_state;
    }

    //% block="手柄 按键|%index| |%value|？"
    //% subcategory="无线手柄"
    //% weight=97 blockGap=10
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    //% value.fieldEditor="gridpicker" value.fieldOptions.columns=2
    export function JdyButton(index: enJdyRocker, value: enButton): boolean {
        mcu_config();

        if (index == enJdyRocker.Button_A) {
            pins.i2cWriteNumber(msg_Addr.Mcu_addr, wireless_Addr.Jdy_A, NumberFormat.UInt8LE, false);
            if (!(pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false) == value)) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (index == enJdyRocker.Button_B) {
            pins.i2cWriteNumber(msg_Addr.Mcu_addr, wireless_Addr.Jdy_B, NumberFormat.UInt8LE, false);
            if (!(pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false) == value)) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (index == enJdyRocker.Button_C) {
            pins.i2cWriteNumber(msg_Addr.Mcu_addr, wireless_Addr.Jdy_C, NumberFormat.UInt8LE, false);
            if (!(pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false) == value)) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            pins.i2cWriteNumber(msg_Addr.Mcu_addr, wireless_Addr.Jdy_D, NumberFormat.UInt8LE, false);
            if (!(pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false) == value)) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    //% block="手柄 摇杆|%axis|的值"
    //% subcategory="无线手柄"
    //% weight=96 blockGap=10
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    export function jdyRockerValue(axis: enAxis): number {
        mcu_config();

        if (axis == enAxis.x) {
            let buff_x = pins.createBuffer(2);
            pins.i2cWriteNumber(msg_Addr.Mcu_addr, wireless_Addr.JdyA_X, NumberFormat.UInt8LE, false);
            buff_x[0] = pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false)

            pins.i2cWriteNumber(msg_Addr.Mcu_addr, (wireless_Addr.JdyA_X + 1), NumberFormat.UInt8LE, false);
            buff_x[1] = pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false)

            let x = (buff_x[1] & 0xff) << 8 | (buff_x[0] & 0xff);
            return x;
        }
        else {
            let buff_y = pins.createBuffer(2);

            pins.i2cWriteNumber(msg_Addr.Mcu_addr, wireless_Addr.JdyA_Y, NumberFormat.UInt8LE, false);
            buff_y[0] = pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false);

            pins.i2cWriteNumber(msg_Addr.Mcu_addr, (wireless_Addr.JdyA_Y + 1), NumberFormat.UInt8LE, false);
            buff_y[1] = pins.i2cReadNumber(msg_Addr.Mcu_addr, NumberFormat.UInt8LE, false);

            let y = (buff_y[1] & 0xff) << 8 | (buff_y[0] & 0xff);
            return y;
        }

    }

}
