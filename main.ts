/**
 * The intelligent programming car produced by ELECFREAKS Co.ltd looks like a pig
 */
//% weight=0 color=#53caec  icon="\uf0d1" 
namespace tianPeng {
    const tianPengAdd = 0X10
    let Buff = pins.createBuffer(4);
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
    * TODO: Set the speed of the wheels. 
    * @param speed Left wheel speed , eg: 100
    * @param motorlist left or right wheel , eg: mo
    */
    //% weight=100
    //% block="set %wheel wheel speed %speed"
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
    //% block="set left wheel speed %lspeed| right wheel speed %rspeed"
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
    * Judging the Current Status of Tracking Module. 
    * @param state Four states of tracking module, eg: L_R_line
    */
    //% weight=60
    //% blockId=ringbitcar_tracking block="tracking state is %state"
    //% state.fieldEditor="gridpicker"
    //% state.fieldOptions.columns=1
    export function tracking(state: TrackingState): boolean {

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
    * Cars can extend the ultrasonic function to prevent collisions and other functions.. 
    * @param Sonarunit two states of ultrasonic module, eg: Centimeters
    */
    //% weight=50
    //% blockId=ultrasonic block="HC-SR04 Sonar unit %unit"
    //% unit.fieldEditor="gridpicker"
    //% unit.fieldOptions.columns=2
    export function ultrasonic(unit: SonarUnit, maxCmDistance = 500): number {
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
    * Select a lamp and set the RGB color. 
    * @param R R color value of RGB color, eg: 0
    * @param G G color value of RGB color, eg: 128
    * @param B B color value of RGB color, eg: 255
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
    //% blockId=tianPeng_servo block="set servo %servoList angle to %angle °"
    //% angle.shadow="protractorPicker"
    //% Servo.fieldEditor="gridpicker"
    //% Servo.fieldOptions.columns=2
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
}
