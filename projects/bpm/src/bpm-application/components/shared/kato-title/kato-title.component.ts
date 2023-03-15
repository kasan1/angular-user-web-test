import { Component, Input, OnInit } from '@angular/core';
import { BpmDictionaryService } from 'projects/bpm/src/app/services/dictionary.service';
import { IKatoRowTree } from 'projects/shared/models/katoRow';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
    selector: 'kato-title',
    template: '<strong>Населенный пункт: {{getKatoTitle(code)}}{{title}}</strong>'
})

export class KatoTitleComponent implements OnInit {
    @Input() code: BehaviorSubject<string>;

    title: string;

    constructor(private dictionaryService: BpmDictionaryService) { }

    ngOnInit(): void {
    }

    getKatoTitle(katoCode: BehaviorSubject<string>) {
        let result = "";
        let code = katoCode.getValue();
        if (code != undefined && code.length > 0) {
            this.dictionaryService.getKatoTreeByCode(code).subscribe(x => {
                if (x != null) {
                    if (x.ab != undefined)
                        result = (x.ab.nameRu + "; ");
                    if (x.cd != undefined)
                        result += (x.cd.nameRu + "; ");
                    if (x.ef != undefined)
                        result += (x.ef.nameRu + "; ");
                    if (x.hij != undefined)
                        result += (x.hij.nameRu + ";");
                }
                this.title = result;
            });
        }
    }
}