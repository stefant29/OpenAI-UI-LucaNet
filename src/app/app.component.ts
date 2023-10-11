import { Component, ElementRef, ViewChild } from '@angular/core';
import { read, utils, writeFile } from 'xlsx';
import { RfiRfpQuestion } from './RfiRfpQuestion.model';
import { map } from 'rxjs';
import { OpenAiServiceService } from './openAiService/open-ai-service.service';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    movies: RfiRfpQuestion[] = [];
    openAiService: OpenAiServiceService;

    @ViewChild('myElement') myElement: ElementRef;

    constructor(openAiService: OpenAiServiceService,) {
        // for (let i = 0; i < 10; i++) {
        //     this.movies.push(new RfiRfpQuestion());
        // }
        this.openAiService = openAiService;
    }

    handleImport($event: any) {
        const files = $event.target.files;
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event: any) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames;

                // console.log(wb, sheets);

                if (sheets.length) {
                    const rows = utils.sheet_to_json<RfiRfpQuestion>(wb.Sheets[sheets[0]]);
                    // console.log(rows);
                    this.movies = rows;
                }
            }
            reader.readAsArrayBuffer(file);
        }
    }

    handleExport() {
        // console.log("movies",this.movies);

        const headings = [[
            'question',
            'answer'
        ]];
        const wb = utils.book_new();
        const ws: any = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, headings);
        utils.sheet_add_json(ws, 
            this.movies.map((a:RfiRfpQuestion) => ({ question: a.question, answer: a.answer}))
            , { origin: 'A2', skipHeader: true });
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, 'Responses.xlsx');
    }

    addRowStart() {
        this.movies.unshift(new RfiRfpQuestion());
    }

    generateResponses() {
        console.log(this.myElement.nativeElement);
        this.movies.map(
            (question: RfiRfpQuestion, index) => {
                console.log("processing ",index)
                this.openAiService.getData(question).subscribe(
                    result => {
                        
                        console.log(document.getElementById('question-'+index));
                        console.log(document.getElementById('response-'+index));

                        document.getElementById('question-'+index)?.addEventListener('input', this.autoExpand);
                        document.getElementById('response-'+index)?.addEventListener('input', this.autoExpand);

                        this.autoExpand2(document.getElementById('question-'+index) as HTMLTextAreaElement);
                        this.autoExpand2(document.getElementById('response-'+index) as HTMLTextAreaElement);

                        
                        // console.log("result for ",question,"is: ",result);

                        question.answer = result.answer;

                        
                        // question.accuracy = result.accuracy;
                    }
                )
            }
        );
    }

    onTextareaChange(xxx): void {
        console.log("yes", xxx);
    }

    autoExpand = (event: Event) => {
        console.log("textarea: ", event);
      
        const target = event.target as HTMLTextAreaElement;

        target.style.height = "auto";
        target.style.height = target.scrollHeight + "px"
      }



    autoExpand2 = (target: HTMLTextAreaElement) => {
        console.log("textarea: ", event);

        target.style.height = "auto";
        target.style.height = target.scrollHeight + "px"
      }
}
