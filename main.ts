/**
 * The intelligent programming car produced by ELECFREAKS Co.ltd looks like a pig
 */
//% weight=0 color=#53caec icon="\uf1b9"
//% block="TianPengC1" 
namespace tianPengC1 {
    const tianPengAdd = 0X10
    let Buff = pins.createBuffer(4);
    let _initEvents = true
    /**
	* Select the wheel on the left or right
	*/
    export enum WheelList {
        //% block="Left"
        Left = 0,
        //% block="Right"
        Right = 1
    }
    /**
    * List of driving directions
    */
    export enum DriveDirection {
        //% block="Forward"
        Forward = 0,
        //% block="Backward"
        Backward = 1
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
        Less,
        //% block=">"
        Greater
    }
    /**
    * Select the servo on the S1 or S2
    */
    export enum ServoList {
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
     * Line Sensor events    MICROBIT_PIN_EVT_RISE
     */
    export enum MbEvents {
        //% block="Found" 
        FindLine = DAL.MICROBIT_PIN_EVT_FALL,
        //% block="Lost" 
        LoseLine = DAL.MICROBIT_PIN_EVT_RISE
    }
    /**
     * Pins used to generate events
     */
    export enum MbPins {
        //% block="Left" 
        Left = DAL.MICROBIT_ID_IO_P13,
        //% block="Right" 
        Right = DAL.MICROBIT_ID_IO_P14
    }

    /**
     * TODO: Set the speed of left and right wheels. 
     * @param lspeed Left wheel speed , eg: 100
     * @param rspeed Right wheel speed, eg: -100
     */
    //% weight=99
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
        Buff[0] = 0x01;    //控制位 0x01电机
        Buff[1] = lspeed;
        Buff[2] = rspeed;
        Buff[3] = 0x00;        //正反转加权值
        if (lspeed < 0 && rspeed < 0) {
            Buff[1] = lspeed * -1;
            Buff[2] = rspeed * -1;
            Buff[3] = 0x03;          //正反转加权值
        }
        else {
            if (lspeed < 0) {
                Buff[1] = lspeed * -1;
                Buff[2] = rspeed;
                Buff[3] = 0x01;
            }
            if (rspeed < 0) {
                Buff[1] = lspeed;
                Buff[2] = rspeed * -1;
                Buff[3] = 0x02;
            }
        }
        pins.i2cWriteBuffer(tianPengAdd, Buff);
    }
    /**
     * TODO: Setting the direction and time of travel.
     * @param Direc Left wheel speed , eg: DriveDirection.Forward
     * @param speed Travel time, eg: 100
     */
    //% weight=90
    //% block="Go %Direc at speed %speed for %time seconds"
    //% speed.min=0 speed.max=100
    //% Direc.fieldEditor="gridpicker" Direc.fieldOptions.columns=2
    export function setTravelTime(Direc: DriveDirection, speed: number, time: number): void {
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
    //% weight=80
    //% block="Stop the car immediately"
    export function stopCar(): void {
        Buff[0] = 0x01;     //控制位 0x01电机
        Buff[1] = 0;		//左轮速度
        Buff[2] = 0;        //右轮速度
        Buff[3] = 0;        //正反转加权值
        pins.i2cWriteBuffer(tianPengAdd, Buff);  //传递数据
    }
    /**
     * TODO: track one side
     * @param side Line sensor edge , eg: MbPins.Left
     * @param state Line sensor status, eg: MbEvents.FindLine
     */
    //% weight=70
    //% block="%side line sensor %state"
    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=2
    //% side.fieldEditor="gridpicker" side.fieldOptions.columns=2
    export function trackSide(side: MbPins, state: MbEvents): boolean {
        pins.setPull(DigitalPin.P13, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P14, PinPullMode.PullNone)
        let left_tracking = pins.digitalReadPin(DigitalPin.P13);
        let right_tracking = pins.digitalReadPin(DigitalPin.P14);
        if (side == 0 && state == 1 && left_tracking == 1) {
            return true;
        }
        else if (side == 0 && state == 0 && left_tracking == 0) {
            return true;
        }
        else if (side == 1 && state == 1 && right_tracking == 1) {
            return true;
        }
        else if (side == 1 && state == 0 && right_tracking == 0) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
    * TODO: Judging the Current Status of Tracking Module.
    * @param state Four states of tracking module, eg: TrackingState.L_R_line
    */
    //% weight=60
    //% block="Tracking state is %state"
    //% state.fieldEditor="gridpicker"
    //% state.fieldOptions.columns=1
    export function trackLine(state: TrackingState): boolean {
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
    * TODO: Runs when line sensor finds or loses
    */
    //% weight=50
    //% block="On %sensor| line %event"
    //% sensor.fieldEditor="gridpicker" sensor.fieldOptions.columns=2
    //% event.fieldEditor="gridpicker" event.fieldOptions.columns=2
    export function trackEvent(sensor: MbPins, event: MbEvents, handler: Action) {
        initEvents();
        control.onEvent(<number>sensor, <number>event, handler);
        console.logValue("sensor", sensor)
        console.logValue("event", event)
    }
    /**
    * TODO: Cars can extend the ultrasonic function to prevent collisions and other functions..
    * @param Sonarunit two states of ultrasonic module, eg: SonarUnit.Centimeters
    */
    //% weight=40
    //% block="Sonar distance unit %unit"
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
    * @param judge state, eg: Sonarjudge.<
    */
    //% weight=30
    //% block="Sonar distance %judge %dis cm"
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
    //% weight=20
    //% color.shadow="colorNumberPicker"
    export function showColor(color: number) {
        let r, g, b: number = 0
        r = color >> 16
        g = (color >> 8) & 0xFF
        b = color & 0xFF
        rgbLight(r, g, b)
    }

    /**
    * TODO: Set RGB color of eye mask lamp.
    * @param r R color value of RGB color, eg: 83
    * @param g G color value of RGB color, eg: 202
    * @param b B color value of RGB color, eg: 236
    */
    //% weight=10
    //% inlineInputMode=inline
    //% block="LED Light R:%r G:%g B:%b"
    //% r.min=0 r.max=255
    //% g.min=0 g.max=255
    //% b.min=0 b.max=255
    export function rgbLight(r: number, g: number, b: number): void {
        Buff[0] = 0x20;
        Buff[1] = r;
        Buff[2] = g;
        Buff[3] = b;
        pins.i2cWriteBuffer(tianPengAdd, Buff);
    }
    /**
     * TODO: Set the angle of servo. 
     * @param Servo ServoList, eg: ServoList.S1
     * @param angle angle of servo, eg: 90
     */
    //% weight=5
    //% block="Set servo %servoList angle to %angle °"
    //% angle.shadow="protractorPicker"
    //% Servo.fieldEditor="gridpicker"
    //% Servo.fieldOptions.columns=1
    export function setServo(Servo: ServoList, angle: number = 180): void {
        let buf = pins.createBuffer(4);
        switch (Servo) {
            case 0:
                Buff[0] = 0x10;
                break;
            case 1:
                Buff[0] = 0x11;
                break;
            case 2:
                Buff[0] = 0x12;
                break;
            case 3:
                Buff[0] = 0x13;
                break;
        }
        Buff[1] = angle;
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