function main() {

    const a = processNok([1, 1]);
    console.log(a);
}


//регистр Компа
var register: Array<number | string> = [];

// выделение частей команд
class UnitExtension {
    private static currentCommand: number = 1;

    public static getCurrentCommad(): number{
        return this.currentCommand;
    }
    public static setCommand(currentCommand: number){
        this.currentCommand = currentCommand;
    }

    /**
     * getDest
     */
    public static getDest(command: string): string {
        return command.substr(28, 4);
    }

    /**
     * getReg1
     */
    public static getReg1(command: string): string {
        return command.substr(24, 4);
    }

    /**
     * getReg2
     */
    public static getReg2(command: string): string {
        return command.substr(20, 4);
    }

    /**
     * getLiteral
     */
    public static getLiteral(command: string): string {
        return command.substr(4, 16);
    }

    /**
     * getCommandType
     */
    public static getCommandType(command: string): string {
        return command.substr(0, 4);
    }


    public static executeCommand(command: string) {
        const commandType = UnitExtension.getCommandType(command);
        switch (commandType) {
            case COMMANDS.WRITE_TO_REG_FROM_DATA:
                register[this.getDest(command)] = parseInt(this.getLiteral(command), 2);
                this.currentCommand++;
                break;
            case COMMANDS.WRITE_TO_REG_FROM_LITERAL:
                register[this.getDest(command)] = this.getLiteral(command);
                this.currentCommand++;
                break;
            case COMMANDS.COPY_FROM_REG_TO_REG:
                register[this.getDest(command)] = register[this.getReg1(command)];
                this.currentCommand++;
                break;
            case COMMANDS.SUMM_AND_WRITE_TO_REG:
                register[this.getDest(command)] = register[this.getReg1(command)] + register[this.getReg2(command)];
                this.currentCommand++;
                break;
            case COMMANDS.SUB_AND_WRITE_TO_REG:
                register[this.getDest(command)] = register[this.getReg1(command)] - register[this.getReg2(command)];
                this.currentCommand++;
                break;
            case COMMANDS.MULT_AND_WRITE_TO_REG:
                register[this.getDest(command)] = register[this.getReg1(command)] * register[this.getReg2(command)];
                this.currentCommand++;
                break;
            case COMMANDS.DIV_AND_WRITE_TO_REG:
                register[this.getDest(command)] = register[this.getReg1(command)] / register[this.getReg2(command)];
                this.currentCommand++;
                break;
            case COMMANDS.GOTO:
                this.currentCommand = parseInt(this.getLiteral(command), 2);
                break;
            case COMMANDS.GOTO_IF_EQUAL: {
                const r1 = register[this.getReg1(command)];
                const r2 = register[this.getReg2(command)];
                if (r1 === r2) {
                    this.currentCommand = parseInt(this.getLiteral(command), 2);
                }
                else{
                    this.currentCommand++;
                }

            }
                break;
            case COMMANDS.GOTO_IF_LESS: {
                const r1 = register[this.getReg1(command)];
                const r2 = register[this.getReg2(command)];
                if (r1 < r2) {
                    this.currentCommand = parseInt(this.getLiteral(command), 2);
                }
                else{
                    this.currentCommand++;
                }

            }
                break;
            default:
                null;
        }
    }


}


// enum command type
enum COMMANDS {
    "WRITE_TO_REG_FROM_DATA" = "0001",
    "WRITE_TO_REG_FROM_LITERAL" = "0010",
    "COPY_FROM_REG_TO_REG" = "0011",
    "SUMM_AND_WRITE_TO_REG" = "0100",
    "SUB_AND_WRITE_TO_REG" = "0101",
    "MULT_AND_WRITE_TO_REG" = "0110",
    "DIV_AND_WRITE_TO_REG" = "0111",
    "GOTO" = "1000",
    "GOTO_IF_EQUAL" = "1001",
    "GOTO_IF_LESS" = "1010",

}


// getNok

function processNok(data: Array<any>): number {

    const [a,b] = data;

    const countOFZeroA = 16 - a.toString(2).length;
    const countOFZeroB = 16 - b.toString(2).length;

    let stringA = "";
    let stringB = "";
    for (let i = 0; i < countOFZeroA; i++) {
        stringA+="0";
    }
    for (let i = 0; i < countOFZeroB; i++) {
        stringB+="0";
    }
    stringA+=a.toString(2);
    stringB+=b.toString(2);



    UnitExtension.executeCommand(COMMANDS.WRITE_TO_REG_FROM_DATA + stringA + '00000000' + '0001');
    UnitExtension.executeCommand(COMMANDS.WRITE_TO_REG_FROM_DATA + stringB + '00000000' + '0010');
    UnitExtension.executeCommand(COMMANDS.COPY_FROM_REG_TO_REG + '0000000000000000' + '00000001' + '0011');
    UnitExtension.executeCommand(COMMANDS.COPY_FROM_REG_TO_REG + '0000000000000000' + '00000010' + '0100');
    while (UnitExtension.getCurrentCommad() !== 9) {
        switch (UnitExtension.getCurrentCommad()){
            case 5:
                UnitExtension.executeCommand(COMMANDS.GOTO_IF_EQUAL + '0000000000001001' + '00010010' + '0000');
                break;
            case 6:
                UnitExtension.executeCommand(COMMANDS.GOTO_IF_LESS + '0000000000001000' + '00100001' + '0000');
                break;
            case 7:
                UnitExtension.executeCommand(COMMANDS.SUB_AND_WRITE_TO_REG + '0000000000000000' + '00100001' + '0001');
                UnitExtension.executeCommand(COMMANDS.GOTO + "0000000000000101" + "00000000" + "0000");
                break;
            case 8:
                UnitExtension.executeCommand(COMMANDS.SUB_AND_WRITE_TO_REG + '0000000000000000' + '00010010' + '0010');
                UnitExtension.executeCommand(COMMANDS.GOTO + "0000000000000101" + "00000000" + "0000");
                break;
            default:
                console.log("error");
                break;
        }
    }
    UnitExtension.executeCommand(COMMANDS.COPY_FROM_REG_TO_REG + "0000000000000000" + '00000001' + '0101');
    UnitExtension.executeCommand(COMMANDS.MULT_AND_WRITE_TO_REG + "0000000000000000" + '00110100' + '0110');
    UnitExtension.executeCommand(COMMANDS.DIV_AND_WRITE_TO_REG + "0000000000000000" + '01010110' + '1111');


    //
    // let a = data[0] as number;
    // let b = data[1] as number;
    // const aa = a;
    // const bb = b;
    // while (a != b) {
    //     if (a > b) {
    //         a = a - b;
    //     } else {
    //         b = b - a
    //     }
    // }
    // const nod = a;
    // const mult = aa*bb;
    // const nok = mult / nod;
    // return nok;
    return register['1111'];
}


main();
