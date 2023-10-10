import { Component } from '@angular/core';
import { read, utils, writeFile } from 'xlsx';
import { qa_model } from './qa.model';
import { map } from 'rxjs';
import { OpenAiServiceService } from './openAiService/open-ai-service.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    movies: qa_model[] = [];
    openAiService: OpenAiServiceService;

    constructor(openAiService: OpenAiServiceService) {
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

                console.log(wb, sheets);

                if (sheets.length) {
                    const rows = utils.sheet_to_json<qa_model>(wb.Sheets[sheets[0]]);
                    console.log(rows);
                    this.movies = rows;
                }
            }
            reader.readAsArrayBuffer(file);
        }
    }

    handleExport() {
        console.log("movies",this.movies);

        const headings = [[
            'question',
            'answer'
        ]];
        const wb = utils.book_new();
        const ws: any = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, headings);
        utils.sheet_add_json(ws, 
            this.movies.map((a:qa_model) => ({ question: a.question, answer: a.answer}))
            , { origin: 'A2', skipHeader: true });
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, 'Movie Report.xlsx');
    }

    addRowStart() {
        this.movies.unshift(new qa_model());
    }

    generateResponses() {
        this.movies.map(
            (question: qa_model) => {
                this.openAiService.getData(question).subscribe(
                    result => {
                        console.log("result for ",question,"is: ",result);

                        question.answer = result.answer;
                        question.accuracy = result.accuracy;
                    }
                )
            }
        );
    }
}
