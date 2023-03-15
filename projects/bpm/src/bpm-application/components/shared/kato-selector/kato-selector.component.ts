import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BpmDictionaryService } from 'projects/bpm/src/app/services/dictionary.service';
import { IKatoRow } from 'projects/shared/models/katoRow';
import { Observable } from 'rxjs';

@Component({
    selector: 'kato-selector',
    templateUrl: 'kato-selector.component.html'
})

export class KatoSelectorComponent implements OnInit {

    @Output() resultKatoCode: EventEmitter<string> = new EventEmitter();

    abRows$: Observable<IKatoRow[]>;
    cdRows$: Observable<IKatoRow[]>;
    efgRows$: Observable<IKatoRow[]>;
    hijRows$: Observable<IKatoRow[]>;

    constructor(private dictionaryService: BpmDictionaryService) { }

    ngOnInit() {
        this.abRows$ = this._getAbRows();
    }

    _getAbRows = () => {
        return this.dictionaryService.getKatoTopElements();
    }

    _getKatoRowsByCode = (code: string) => {
        return this.dictionaryService.getKatoByCode(code);
    }

    _emitResult = ($event) => {
        this.resultKatoCode.emit(($event.value.last) ? $event.value.code : undefined);
    }

    abChanged = ($event) => {
        this._emitResult($event);
        this.cdRows$ = ($event.value.code == undefined)
            ? new Observable<IKatoRow[]>() : this._getKatoRowsByCode($event.value.code);
        this.efgRows$ = new Observable<IKatoRow[]>();
        this.hijRows$ = new Observable<IKatoRow[]>();
    }

    cdChanged = ($event) => {
        this._emitResult($event);
        this.efgRows$ = ($event.value.code == undefined)
            ? new Observable<IKatoRow[]>() : this._getKatoRowsByCode($event.value.code);
        this.hijRows$ = new Observable<IKatoRow[]>();
    }

    efgChanged = ($event) => {
        this._emitResult($event);
        this.hijRows$ = ($event.value.code == undefined)
            ? new Observable<IKatoRow[]>() : this._getKatoRowsByCode($event.value.code);
    }

    hijChanged = ($event) => {
        this._emitResult($event);
    }
}