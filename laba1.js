function main() {
    var a = processNok([1, 1]);
    console.log(a);
}
//регистр Компа
var register = [];
// выделение частей команд
var UnitExtension = /** @class */ (function () {
    function UnitExtension() {
    }
    UnitExtension.getCurrentCommad = function () {
        return this.currentCommand;
    };
    UnitExtension.setCommand = function (currentCommand) {
        this.currentCommand = currentCommand;
    };
    /**
     * getDest
     */
    UnitExtension.getDest = function (command) {
        return command.substr(28, 4);
    };
    /**
     * getReg1
     */
    UnitExtension.getReg1 = function (command) {
        return command.substr(24, 4);
    };
    /**
     * getReg2
     */
    UnitExtension.getReg2 = function (command) {
        return command.substr(20, 4);
    };
    /**
     * getLiteral
     */
    UnitExtension.getLiteral = function (command) {
        return command.substr(4, 16);
    };
    /**
     * getCommandType
     */
    UnitExtension.getCommandType = function (command) {
        return command.substr(0, 4);
    };
    UnitExtension.executeCommand = function (command) {
        var commandType = UnitExtension.getCommandType(command);
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
            case COMMANDS.GOTO_IF_EQUAL:
                {
                    var r1 = register[this.getReg1(command)];
                    var r2 = register[this.getReg2(command)];
                    if (r1 === r2) {
                        this.currentCommand = parseInt(this.getLiteral(command), 2);
                    }
                    else {
                        this.currentCommand++;
                    }
                }
                break;
            case COMMANDS.GOTO_IF_LESS:
                {
                    var r1 = register[this.getReg1(command)];
                    var r2 = register[this.getReg2(command)];
                    if (r1 < r2) {
                        this.currentCommand = parseInt(this.getLiteral(command), 2);
                    }
                    else {
                        this.currentCommand++;
                    }
                }
                break;
            default:
                null;
        }
    };
    UnitExtension.currentCommand = 1;
    return UnitExtension;
}());
// enum command type
var COMMANDS;
(function (COMMANDS) {
    COMMANDS["WRITE_TO_REG_FROM_DATA"] = "0001";
    COMMANDS["WRITE_TO_REG_FROM_LITERAL"] = "0010";
    COMMANDS["COPY_FROM_REG_TO_REG"] = "0011";
    COMMANDS["SUMM_AND_WRITE_TO_REG"] = "0100";
    COMMANDS["SUB_AND_WRITE_TO_REG"] = "0101";
    COMMANDS["MULT_AND_WRITE_TO_REG"] = "0110";
    COMMANDS["DIV_AND_WRITE_TO_REG"] = "0111";
    COMMANDS["GOTO"] = "1000";
    COMMANDS["GOTO_IF_EQUAL"] = "1001";
    COMMANDS["GOTO_IF_LESS"] = "1010";
})(COMMANDS || (COMMANDS = {}));
// getNok
function processNok(data) {
    var a = data[0], b = data[1];
    var countOFZeroA = 16 - a.toString(2).length;
    var countOFZeroB = 16 - b.toString(2).length;
    var stringA = "";
    var stringB = "";
    for (var i = 0; i < countOFZeroA; i++) {
        stringA += "0";
    }
    for (var i = 0; i < countOFZeroB; i++) {
        stringB += "0";
    }
    stringA += a.toString(2);
    stringB += b.toString(2);
    UnitExtension.executeCommand(COMMANDS.WRITE_TO_REG_FROM_DATA + stringA + '00000000' + '0001');
    UnitExtension.executeCommand(COMMANDS.WRITE_TO_REG_FROM_DATA + stringB + '00000000' + '0010');
    UnitExtension.executeCommand(COMMANDS.COPY_FROM_REG_TO_REG + '0000000000000000' + '00000001' + '0011');
    UnitExtension.executeCommand(COMMANDS.COPY_FROM_REG_TO_REG + '0000000000000000' + '00000010' + '0100');
    while (UnitExtension.getCurrentCommad() !== 9) {
        switch (UnitExtension.getCurrentCommad()) {
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
