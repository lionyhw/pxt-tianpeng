/**
 * The intelligent programming car produced by ELECFREAKS Co.ltd looks like a pig
 */
//% weight=0 color=#53caec  icon="\uf0d1" 
namespace tianPeng {
    const tianPengAdd = 0X10
    let Buff = pins.createBuffer(4);
    let _initEvents = false
    /**
	* Select the wheel on the left or right
	*/
    export enum WheelList {
        //% blockId="Left" block="Left"
        Left = 0,
        //% blockId="Right" block="Right"
        Right = 1
    }
    /**
    * List of driving directions
    */
    export enum DriveDirection {
        //% blockId="Forward" block="Forward"
        Forward = 0,
        //% blockId="backward" block="backward"
        backward = 1
    }
    /**
    * Status List of Tracking Modules
    */
    export enum TrackingState {
        //% block="● ●" enumval=0
        L_R_line,

        //% block="◌ ●" enumval=1
        L_unline_R_line,

        //% block="● ◌" enumval=2
        L_line_R_unline,

        //% block="◌ ◌" enumval=3
        L_R_unline
    }
    /**
    * Unit of Ultrasound Module
    */
    export enum SonarUnit {
        //% block="cm"
        Centimeters,
        //% block="inches"
        Inches
    }
    /**
    * Ultrasonic judgment
    */
    export enum Sonarjudge {
        //% block="<"
        less,
        //% block=">"
        greater
    }
    /**
    * Select the servo on the S1 or S2
    */
    export enum servoList {
        //% block="S1"
        S1 = 0,
        //% block="S2"
        S2 = 1,
        //% block="S3"
        S3 = 2,
        //% block="S4"
        S4 = 3
    }
    /**
     * Line Sensor events
     */
    export enum mbEvents {
        //% block="found" enumval=0
        FindLine = DAL.MICROBIT_PIN_EVT_RISE,
        //% block="lost" enumval=1
        LoseLine = DAL.MICROBIT_PIN_EVT_FALL
    }
    /**
     * Pins used to generate events
     */
    export enum mbPins {
        //% block="left" enumval=0
        LeftLine = DAL.MICROBIT_ID_IO_P13,
        //% block="right" enumval=1
        RightLine = DAL.MICROBIT_ID_IO_P14
    }

    /**
    * TODO: Set the speed of the wheels. 
    * @param speed Left wheel speed , eg: 100
    * @param motorlist left or right wheel , eg: mo
    */
    //% weight=100
    //% block="Set %wheel wheel speed at %speed"
    //% speed.min=-100 speed.max=100 
    //% wheel.fieldEditor="gridpicker"
    //% wheel.fieldOptions.columns=2
    export function setWheelSpeed(wheel: WheelList, speed: number = 50): void {
        if (speed > 100) {
            speed = 100;
        } else if (speed < -100) {
            speed = -100;
        }
        switch (wheel) {
            case 0:
                if (speed >= 0) {
                    Buff[0] = 0x01;    //左右轮 0x01左轮  0x02右轮
                    Buff[1] = 0x01;		//正反转0x01前进  0x02后退
                    Buff[2] = speed;	//速度
                    Buff[3] = 0;		//补位
                    pins.i2cWriteBuffer(tianPengAdd, Buff);
                }
                else {
                    Buff[0] = 0x01;    //左右轮 0x01左轮  0x02右轮
                    Buff[1] = 0x02;		//正反转0x01前进  0x02后退
                    Buff[2] = speed * -1;	//速度
                    Buff[3] = 0;		//补位
                    pins.i2cWriteBuffer(tianPengAdd, Buff);
                }
                break;
            case 1:
                if (speed >= 0) {
                    Buff[0] = 0x02;    //左右轮 0x01左轮  0x02右轮
                    Buff[1] = 0x01;		//正反转0x01前进  0x02后退
                    Buff[2] = speed;	//速度
                    Buff[3] = 0;		//补位
                    pins.i2cWriteBuffer(tianPengAdd, Buff);
                }
                else {
                    Buff[0] = 0x02;    //左右轮 0x01左轮  0x02右轮
                    Buff[1] = 0x02;		//正反转0x01前进  0x02后退
                    Buff[2] = speed * -1;	//速度
                    Buff[3] = 0;		//补位
                    pins.i2cWriteBuffer(tianPengAdd, Buff);
                }
                break;
        }
    }
    /**
     * TODO: Set the speed of left and right wheels. 
     * @param lspeed Left wheel speed , eg: 100
     * @param rspeed Right wheel speed, eg: -100
     */
    //% weight=80
    //% block="Set left wheel speed at %lspeed| right wheel speed at %rspeed"
    //% lspeed.min=-100 lspeed.max=100
    //% rspeed.min=-100 rspeed.max=100
    export function setWheels(lspeed: number = 50, rspeed: number = 50): void {
        if (lspeed > 100) {
            lspeed = 100;
        } else if (lspeed < -100) {
            lspeed = -100;
        }
        if (rspeed > 100) {
            rspeed = 100;
        } else if (rspeed < -100) {
            rspeed = -100;
        }
        if (lspeed >= 0) {
            Buff[0] = 0x01;    //左右轮 0x01左轮  0x02右轮
            Buff[1] = 0x01;		//正反转0x01前进  0x02后退
            Buff[2] = lspeed;	//速度
            Buff[3] = 0;		//补位
            pins.i2cWriteBuffer(tianPengAdd, Buff);
        }
        else {
            Buff[0] = 0x01;
            Buff[1] = 0x02;
            Buff[2] = lspeed * -1;
            Buff[3] = 0;			//补位
            pins.i2cWriteBuffer(tianPengAdd, Buff);
        }
        if (rspeed >= 0) {
            Buff[0] = 0x02;
            Buff[1] = 0x01;
            Buff[2] = rspeed;
            Buff[3] = 0;			//补位
            pins.i2cWriteBuffer(tianPengAdd, Buff);
        }
        else {
            Buff[0] = 0x02;
            Buff[1] = 0x02;
            Buff[2] = rspeed * -1;
            Buff[3] = 0;			//补位
            pins.i2cWriteBuffer(tianPengAdd, Buff);
        }
    }
    /**
     * TODO: Setting the direction and time of travel.
     */
    //% weight=75
    //% block="Go %Direc at speed %speed for %time seconds"
    //% speed.min=0 speed.max=100
    export function setwheeltime(Direc: DriveDirection, speed: number, time: number): void {
        if (Direc == 0) {
            setWheels(speed, speed)
            basic.pause(time * 1000)
            stopCar()
        }
        else {
            setWheels(-speed, -speed)
            basic.pause(time * 1000)
            stopCar()
        }
    }
    /**
     * TODO: Stop the car. 
     */
    //% weight=70
    //% block="Stop the car immediately"
    export function stopCar(): void {
        Buff[0] = 0x02;     //左右轮 0x01左轮  0x02右轮
        Buff[1] = 0x01;		//正反转0x01前进  0x02后退
        Buff[2] = 0;	    //速度
        Buff[3] = 0;		//补位
        pins.i2cWriteBuffer(tianPengAdd, Buff);  //写入左轮
        Buff[0] = 0x01;
        pins.i2cWriteBuffer(tianPengAdd, Buff);  //写入左轮
    }
    /**
     * TODO: track one side
     * @param side Line sensor edge , eg: mbPins.LeftLine
     * @param state Line sensor status, eg: state.FindLine
     */
    //% weight=65
    //% blockId=tianpengcar_trackside block="%side line sensor %state"
    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=2
    //% side.fieldEditor="gridpicker" side.fieldOptions.columns=2
    export function trackside(side: mbPins, state: mbEvents): boolean {
        pins.setPull(DigitalPin.P13, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P14, PinPullMode.PullNone)
        let left_tracking = pins.digitalReadPin(DigitalPin.P13);
        let right_tracking = pins.digitalReadPin(DigitalPin.P14);
        if (left_tracking == 0 && state == 0) {
            return false;
        }
        else if (left_tracking == 1 && state == 0) {
            return true;
        }
        if (left_tracking == 0 && state == 1) {
            return true;
        }
        else if (left_tracking == 1 && state == 1) {
            return false;
        }
        if (right_tracking == 0 && state == 0) {
            return true;
        }
        else if (right_tracking == 1 && state == 0) {
            return false;
        }
        if (right_tracking == 0 && state == 1) {
            return true;
        }
        else if (right_tracking == 1 && state == 1) {
            return false;
        }
        return false;

    }
    /**
    * Judging the Current Status of Tracking Module. 
    * @param state Four states of tracking module, eg: L_R_line
    */
    //% weight=60
    //% blockId=tianpengcar_tracking block="Tracking state is %state"
    //% state.fieldEditor="gridpicker"
    //% state.fieldOptions.columns=1
    export function trackline(state: TrackingState): boolean {
        pins.setPull(DigitalPin.P13, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P14, PinPullMode.PullNone)
        let left_tracking = pins.digitalReadPin(DigitalPin.P13);
        let right_tracking = pins.digitalReadPin(DigitalPin.P14);
        if (left_tracking == 0 && right_tracking == 0 && state == 0) {
            return true;
        }
        else if (left_tracking == 1 && right_tracking == 0 && state == 1) {
            return true;
        }
        else if (left_tracking == 0 && right_tracking == 1 && state == 2) {
            return true;
        }
        else if (left_tracking == 1 && right_tracking == 1 && state == 3) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
    * Runs when line sensor finds or loses
    */
    //% weight=58
    //% blockId=bc_event block="On %sensor| line %event"
    //% sensor.fieldEditor="gridpicker" sensor.fieldOptions.columns=2
    //% event.fieldEditor="gridpicker" event.fieldOptions.columns=2
    export function trackEvent(sensor: mbPins, event: mbEvents, handler: Action) {
        initEvents();
        control.onEvent(<number>sensor, <number>event, handler);
    }
    /**
    * Cars can extend the ultrasonic function to prevent collisions and other functions.. 
    * @param Sonarunit two states of ultrasonic module, eg: Centimeters
    */
    //% weight=50
    //% blockId=ultrasonic block="Sonar distance unit %unit"
    //% unit.fieldEditor="gridpicker"
    //% unit.fieldOptions.columns=2
    export function sonarReturn(unit: SonarUnit, maxCmDistance = 500): number {
        // send pulse
        pins.setPull(DigitalPin.P16, PinPullMode.PullNone);
        pins.digitalWritePin(DigitalPin.P16, 0);
        control.waitMicros(2);
        pins.digitalWritePin(DigitalPin.P16, 1);
        control.waitMicros(10);
        pins.digitalWritePin(DigitalPin.P16, 0);

        // read pulse
        const d = pins.pulseIn(DigitalPin.P15, PulseValue.High, maxCmDistance * 58);

        switch (unit) {
            case SonarUnit.Centimeters:
                return Math.idiv(d, 58);
            case SonarUnit.Inches:
                return Math.idiv(d, 148);
            default:
                return d;
        }
    }
    /**
    * TODO: sonar Judge.
    * @param dis sonar distance , eg: 5
    */
    //% weight=49
    //% blockId=sonarJudgeboolean block="Sonar distance %judge %dis cm"
    //% dis.min=1 dis.max=400
    //% judge.fieldEditor="gridpicker" judge.fieldOptions.columns=2
    export function sonarJudge(judge: Sonarjudge, dis: number): boolean {
        if (judge == 0) {
            if (sonarReturn(SonarUnit.Centimeters) < dis && sonarReturn(SonarUnit.Centimeters) != 0) {
                return true
            }
            else {
                return false
            }
        }
        else {
            if (sonarReturn(SonarUnit.Centimeters) > dis) {
                return true
            }
            else {
                return false
            }
        }
    }
    //% block="LED show color $color"
    //% weight=45
    //% color.shadow="colorNumberPicker"
    export function showColor(color: number) {

    }

    /**
    * Select a lamp and set the RGB color. 
    * @param r R color value of RGB color, eg: 83
    * @param g G color value of RGB color, eg: 202
    * @param b B color value of RGB color, eg: 236
    */
    //% weight=40
    //% inlineInputMode=inline
    //% blockId=RGB block="LED Light R:%r G:%g B:%b"
    //% r.min=0 r.max=255
    //% g.min=0 g.max=255
    //% b.min=0 b.max=255
    export function rgblight(r: number, g: number, b: number): void {
        Buff[0] = 0x20;
        Buff[1] = r;
        Buff[2] = g;
        Buff[3] = b;
        pins.i2cWriteBuffer(tianPengAdd, Buff);
    }
    /**
     * TODO: Set the angle of servo. 
     * @param Servo ServoList , eg: tianPeng.servoList.S1
     * @param angle angle of servo, eg: 90
     */
    //% weight=30
    //% blockId=tianPeng_servo block="Set servo %servoList angle to %angle °"
    //% angle.shadow="protractorPicker"
    //% Servo.fieldEditor="gridpicker"
    //% Servo.fieldOptions.columns=1
    export function setServo(Servo: servoList, angle: number = 180): void {
        let buf = pins.createBuffer(4);
        switch (Servo) {
            case 0:
                Buff[0] = 0x10;
                Buff[1] = angle;
                break;
            case 1:
                Buff[0] = 0x11;
                Buff[1] = angle;
                break;
            case 2:
                Buff[0] = 0x12;
                Buff[1] = angle;
                break;
            case 3:
                Buff[0] = 0x13;
                Buff[1] = angle;
                break;
        }
        Buff[2] = 0;
        Buff[3] = 0;
        pins.i2cWriteBuffer(tianPengAdd, Buff);

    }
    function initEvents(): void {
        if (_initEvents) {
            pins.setEvents(DigitalPin.P13, PinEventType.Edge);
            pins.setEvents(DigitalPin.P14, PinEventType.Edge);
            _initEvents = false;
        }
    }
}