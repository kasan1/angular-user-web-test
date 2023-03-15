import { OnInit, OnDestroy, Component, ViewChild, NgZone } from '@angular/core';
import { fadeInTrigger, fadeInOutTrigger } from 'projects/shared/util/triggers';
import { removeContainer, addContainer } from 'projects/shared/util/container';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { BPMCreditAdminService } from '../../services/bpm-credit-admin.service';
import { ICreditAdminResult } from 'projects/shared/services/creditAdmin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'bpm-credit-admin',
    templateUrl: './bpm-credit-admin.component.html',
    styleUrls: ['./bpm-credit-admin.component.scss'],
    animations: [fadeInTrigger, fadeInOutTrigger],
})


export class BpmCreditAdmin implements OnInit, OnDestroy {

    form: FormGroup;
    favoriteSeason: string = 'Winter';
    model: ICreditAdminResult;
    id:string;
    applicationTaskId: string;

    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private _ngZone: NgZone,
        private serivice: BPMCreditAdminService,
        private snackbar: MatSnackBar,
        private router: Router
    ) {}

    
    @ViewChild('autosize') autosize: CdkTextareaAutosize;
    
    ngOnInit(): void {
        removeContainer();
        this.id = this.route.snapshot.paramMap.get('id');
        this.applicationTaskId = this.route.snapshot.paramMap.get('applicationTaskId');

                
        this._initializeForm();
    }

    approve = () => {


    this.serivice
        .credAdminSet(this.form.value)
        .subscribe(this._successResponse);
    }

    _successResponse = (x: number) => {
        this.snackbar.open('Успешно отправлено!', null, {
          duration: 2500,
        });
        this.router.navigate([`/applicationList`]);
    };

    rework = () => {
        console.log('Rework');
    }

    triggerResize() {
        // Wait for changes to be applied, then trigger textarea resize.
        this._ngZone.onStable.pipe(take(1))
            .subscribe(() => this.autosize.resizeToFitContent(true));
    }


    getModel = () => {

    }


    clientDataAccept = () => this.form.get('clientDataAccept');
    clientDataRemark = () => this.form.get('clientDataRemark');
    clientDataManagerComment = () => this.form.get('clientDataManagerComment');


    _initializeForm = () =>
    (this.form = this.fb.group({
        applicationId: [this.id],
        applicationTaskId:[this.applicationTaskId],
        clientDataAccept: ['true'],
        clientDataRemark: [''],
        clientDataManagerComment: [''],
        chargeeAccept: ['true'],
        chargeeRemark: [''],
        chargeeManagerComment: [''],
        pledgesAccept: ['true'],
        pledgesRemark: [''],
        pledgesManagerComment: [''],
        documentsAccept: ['true'],
        documentsRemark: [''],
        documentsManagerComment: [''],
    }));

    ngOnDestroy(): void {
        addContainer();        
    }
}