import * as readline from 'readline';

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var register: Array<number | string> = [];


class Parsing {
    private currentCommand = 1;


    public enterConsole() {
        rl.question('enter command: ', (answer) => {
            const consoleEnter: string = answer;
            if (answer == '0') {
                rl.close();
            } else {
                this.getArrayToken(consoleEnter);
                console.log(register);
                this.enterConsole()
            }
        });

    }

    private getArrayToken(consoleEnter: string) {
        const arrayOfString = consoleEnter.trim().split(' ');
        if (arrayOfString.length === 0) {
            console.error("неверная команда");
            return -1;
        }
        this.switcher(arrayOfString);
    }

    private switcher(arrayOfString: string[]) {
        const commandType = arrayOfString[0];
        const length = arrayOfString.length;
        switch (commandType) {
            case 'readmem':
                this.readMem(arrayOfString, length, commandType)
                break;
            case 'readlit':
                break;
            case 'move':
                this.move(arrayOfString, length, commandType);
                break;
            case 'add':
                this.add(arrayOfString, length, commandType)
                break;
            case 'subtract':
                this.subtract(arrayOfString, length, commandType)
                break;
            case 'mul':
                this.mul(arrayOfString, length, commandType)
                break;
            case 'div':
                this.div(arrayOfString, length, commandType)
                break;
            case 'jump':
                this.jump(arrayOfString, length, commandType)
                break;
            case 'jumpifequals':
                this.jumpifequals(arrayOfString, length, commandType)
                break;
            case 'jumpifless':
                this.jumpifless(arrayOfString, length, commandType)
                break;
            default:
                console.error("incorrect command")
                return -1;

        }
    }

    private readMem(arrayOfStrings: string[], length: number, commandName: string) {
        if (length !== 3) {
            console.error(`readMem, wrong command count: ${length} need: ${3}`)
            return -1;
        }
        register[arrayOfStrings[1]] = Number.parseInt(arrayOfStrings[2], 2);
        this.currentCommand++;
        console.log(`${commandName} to: ${arrayOfStrings[1]} value: ${arrayOfStrings[2]}`);
    }

    private readLit(arrayOfStrings: string[], length: number, commandName: string) {

    }

    private move(arrayOfStrings: string[], length: number, commandName: string) {
        if (length !== 3) {
            console.error(`move, wrong command count: ${length} need: ${3}`)
            return -1;
        }
        register[arrayOfStrings[1]] = register[arrayOfStrings[2]];
        this.currentCommand++;
        console.log(`${commandName} to: ${arrayOfStrings[1]} from: ${arrayOfStrings[2]}`);

    }

    private add(arrayOfStrings: string[], length: number, commandName: string) {
        if (length !== 4) {
            console.error(`add, wrong command count: ${length} need: ${4}`)
            return -1;
        }
        register[arrayOfStrings[1]] = register[arrayOfStrings[2]] + register[arrayOfStrings[3]];
        this.currentCommand++;
        console.log(`${commandName} to: ${arrayOfStrings[1]} from: ${arrayOfStrings[2]} and ${arrayOfStrings[3]}`);

    }

    private subtract(arrayOfStrings: string[], length: number, commandName: string) {
        if (length !== 4) {
            console.error(`subtract, wrong command count: ${length} need: ${4}`);
            return -1;
        }
        register[arrayOfStrings[1]] = register[arrayOfStrings[2]] - register[arrayOfStrings[3]];
        this.currentCommand++;
        console.log(`${commandName} to: ${arrayOfStrings[1]} from: ${arrayOfStrings[2]} and ${arrayOfStrings[3]}`);
    }

    private mul(arrayOfStrings: string[], length: number, commandName: string) {

        if (length !== 4) {
            console.error(`mul, wrong command count: ${length} need: ${4}`);
            return -1;
        }
        register[arrayOfStrings[1]] = register[arrayOfStrings[2]] * register[arrayOfStrings[3]];
        this.currentCommand++;
        console.log(`${commandName} to: ${arrayOfStrings[1]} from: ${arrayOfStrings[2]} and ${arrayOfStrings[3]}`);

    }

    private div(arrayOfStrings: string[], length: number, commandName: string) {

        if (length !== 4) {
            console.error(`div, wrong command count: ${length} need: ${4}`);
            return -1;
        }
        register[arrayOfStrings[1]] = register[arrayOfStrings[2]] / register[arrayOfStrings[3]];
        this.currentCommand++;
        console.log(`${commandName} to: ${arrayOfStrings[1]} from: ${arrayOfStrings[2]} and ${arrayOfStrings[3]}`);

    }

    private jump(arrayOfStrings: string[], length: number, commandName: string) {
        if (length !== 2) {
            console.error(`jump, wrong command count: ${length} need: ${2}`);
            return -1;
        }
        const previousCommand = this.currentCommand;
        this.currentCommand = Number.parseInt(arrayOfStrings[1], 2);
        console.log(`${commandName} from: ${previousCommand} to: ${this.currentCommand}`);
    }

    private jumpifequals(arrayOfStrings: string[], length: number, commandName: string) {
        if (length !== 4) {
            console.error(`jumpifequals, wrong command count: ${length} need: ${4}`);
            return -1;
        }
        if (register[arrayOfStrings[1]] === register[arrayOfStrings[2]]) {
            const previousCommand = this.currentCommand;
            this.currentCommand = Number.parseInt(arrayOfStrings[3], 2);
            console.log(`${commandName} from: ${previousCommand} to: ${this.currentCommand} with: ${[arrayOfStrings[1], arrayOfStrings[2]]}`);
        } else {
            this.currentCommand++;
        }

    }

    private jumpifless(arrayOfStrings: string[], length: number, commandName: string) {
        if (length !== 4) {
            console.error(`jumpifless, wrong command count: ${length} need: ${4}`);
            return -1;
        }
        if (register[arrayOfStrings[1]] < register[arrayOfStrings[2]]) {
            const previousCommand = this.currentCommand;
            this.currentCommand = Number.parseInt(arrayOfStrings[3], 2);
            console.log(`${commandName} from: ${previousCommand} to: ${this.currentCommand} with: ${[arrayOfStrings[1], arrayOfStrings[2]]}`);
        } else {
            this.currentCommand++;
        }
    }

}

const pr = new Parsing();
pr.enterConsole();