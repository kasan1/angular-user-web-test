import { OnInit, OnDestroy, Component, ViewChild, NgZone } from '@angular/core';
import { fadeInTrigger, fadeInOutTrigger } from 'projects/shared/util/triggers';
import { removeContainer, addContainer } from 'projects/shared/util/container';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';

@Component({
    selector: 'bpm-credit-admin-remarks',
    templateUrl: './bpm-credit-admin-remarks.component.html',
    styleUrls: ['./bpm-credit-admin-remarks.component.scss'],
    animations: [fadeInTrigger, fadeInOutTrigger],
})


export class BpmCreditAdminRemarks implements OnInit, OnDestroy {

    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private _ngZone: NgZone
    ) {}

    
    @ViewChild('autosize') autosize: CdkTextareaAutosize;
    
    ngOnInit(): void {
        removeContainer();

        
        this._initializeForm();
    }

    triggerResize() {
        // Wait for changes to be applied, then trigger textarea resize.
        this._ngZone.onStable.pipe(take(1))
            .subscribe(() => this.autosize.resizeToFitContent(true));
      }

    _initializeForm = () =>
    (this.form = this.fb.group({
      clientCommentVnd: [''],
    }));

    ngOnDestroy(): void {
        addContainer();        
    }
}