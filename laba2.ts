import * as fs from 'fs';


type argumentAndFunc = {
    y: number;
    t: number;
}


class Filter {
    private mathConst: number = 1000;
    private arrayOfC: number[];
    private lineTime: number;
    private filterLine: number;
    private w: number;
    private step: number;
    private stream;
    private path: string = "./note.txt";


    constructor(arrayOfC: number[], lineTime: number, filterLine: number, w: number, step: number) {
        if (arrayOfC.length != filterLine) {
            throw new Error("array length have to equal filterLine count")
        } else {
            this.arrayOfC = arrayOfC;
            this.lineTime = lineTime;
            this.filterLine = filterLine;
            this.w = w;
            this.step = step;
        }
        this.stream = fs.createWriteStream(this.path);
    }

    public cleanOrCreateExcel() {
        this.stream.write('');
    }

    public getSoundPerfomance() {
        const shedule: any[] = [];
        for (let i = 0; i < this.w; i += this.step) {
            shedule.push(this.duringLineTime(i));
        }
        this.onExcel(shedule);
    }

    private onExcel (data: any[]){
        data.forEach(dataItem=>{
            dataItem.forEach((item: argumentAndFunc)=>{
               const str =  `${item.t};${item.y}\n`;
               this.stream.write(str);
               console.log(str);
            });
        })
    }

    private duringLineTime(w: number): argumentAndFunc[] {
        const arrayOfY = [];
        for (let i = 0; i < this.lineTime; i++) {
            let newStruct: argumentAndFunc = {t: i, y: this.getY(this.getArrayOfX(i, w))};
            arrayOfY.push(newStruct);
        }
        return arrayOfY;

    }
    private getY(arrayOfX: number[]): number{
        let sum = 0;
        for (let i = 0; i<this.filterLine; i++){
            sum+=this.arrayOfC[i]*arrayOfX[i];
        }
        return sum;
    }
    private getArrayOfX(displacement: number, w: number): number[]{
        const resultArray: number[] = [];
        for (let i = displacement; i<this.filterLine + displacement; i++){
            resultArray.push(this.getSin(w,i));
        }
        return resultArray;
    }
    private getSin(w: number, t:number): number{
        const res = this.mathConst*Math.sin(w*t);
        return res;
    }
}

 function  main() {
        const kf: number[] = [6, 0, -4, -3, 5, 6, -6, -13, 7, 44, 64, 44, 7, -13, -6, 6, 5, -3, -4, 0, 6];
        const filter: Filter = new Filter(kf, 100, 21, 2, 0.1);
        filter.cleanOrCreateExcel();
        filter.getSoundPerfomance();
    }

    main();