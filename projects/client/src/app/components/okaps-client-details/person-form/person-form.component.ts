import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IPerson } from '../../../models/client.model';
import { IDictionaryBase } from '../../../models/common.model';
import { DictionariesService } from '../../../services/dictionaries.service';
import { identifierToBirthDate } from '../../../utils/utils';
import { conditionalValidator } from '../../../validators/conditional.validator';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.scss'],
})
export class PersonFormComponent implements OnInit {
  @Input() isReadOnly: boolean;
  @Input() initialState: IPerson;
  @Input() isExtended: boolean;
  @Input() name: string;

  public iinMask = [];

  form: FormGroup;
  marriageStatuses: IDictionaryBase[] = [];
  countries: IDictionaryBase[] = [];

  kzCode: string = 'KAZ';

  constructor(
    private formBuilder: FormBuilder,
    private dictionaryService: DictionariesService
  ) {}

  ngOnInit(): void {
    this.dictionaryService.getMarriageStatuses().then((response) => {
      this.marriageStatuses = response.data.list;
      if (this.initialState?.marriageStatusId) {
        const marriageStatus = response.data.list.find(
          (x) => x.id === this.initialState.marriageStatusId
        );
        if (marriageStatus) this.marriageStatus.setValue(marriageStatus);
      }
    });
    this.dictionaryService.getCountries().then((response) => {
      this.countries = response.data.list;
      if (this.initialState?.countryId) {
        const country = response.data.list.find(
          (x) => x.id === this.initialState.countryId
        );

        if (country) this.country.setValue(country);
      } else {
        const country = response.data.list.find((x) => x.code === this.kzCode);

        if (country) this.country.setValue(country);
      }
    });

    this.generateForm();

    this.country.valueChanges.subscribe((_) => {
      this.identifier.updateValueAndValidity();
      this.identificationDocumentNumber.updateValueAndValidity();
      this.identificationDocumentIssuer.updateValueAndValidity();
      this.identificationDocumentDate.updateValueAndValidity();
    });

    this.identifier.valueChanges.subscribe((value: string) => {
      if (value !== null && !value.includes('_')) {
        const birthDate = identifierToBirthDate(value);
        if (birthDate !== null) {
          this.birthDate.setValue(birthDate);
        }
      }
    });
  }

  generateForm(): void {
    this.form = this.formBuilder.group({
      fullname: [this.initialState?.fullName, [Validators.required]],
      phone: this.formBuilder.group({
        work: [this.initialState?.phone?.work],
        mobile: [this.initialState?.phone?.mobile, [Validators.required]],
        home: [this.initialState?.phone?.home],
      }),
      birthDate: [this.initialState?.birthDate, [Validators.required]],
      birthPlace: [this.initialState?.birthPlace, [Validators.required]],
      country: [null, Validators.required],
      identificationDocument: this.formBuilder.group({
        number: [
          this.initialState?.identificationDocument?.number,
          [Validators.required],
        ],
        issuer: [
          this.initialState?.identificationDocument?.issuer,
          [Validators.required],
        ],
        date: [
          this.initialState?.identificationDocument?.dateIssue,
          [Validators.required],
        ],
      }),
      identifier: [
        this.initialState?.identifier,
        conditionalValidator(
          () => this.isResident,
          Validators.compose([
            Validators.required,
            Validators.minLength(12),
            Validators.maxLength(12),
          ]),
          'identifierError'
        ),
      ],
      address: this.formBuilder.group({
        fact: [this.initialState?.address?.fact, [Validators.required]],
      }),
      education: [
        this.initialState?.education,
        conditionalValidator(
          () => this.isExtended,
          Validators.compose([Validators.required, Validators.maxLength(100)]),
          'educationError'
        ),
      ],
      workExperience: this.formBuilder.group({
        total: [
          this.initialState?.workExperience?.total,
          conditionalValidator(
            () => this.isExtended,
            Validators.required,
            'workExperienceTotalError'
          ),
        ],
        agriculture: [
          this.initialState?.workExperience?.agriculture,
          conditionalValidator(
            () => this.isExtended,
            Validators.required,
            'workExperienceAgricultureError'
          ),
        ],
      }),
      marriageStatus: [
        null,
        conditionalValidator(
          () => this.isExtended,
          Validators.required,
          'marriageStatusIdError'
        ),
      ],
      spouse: [this.initialState?.spouse],
    });

    if (this.isReadOnly) {
      this.form.disable();
    }
  }

  get fullname() {
    return this.form.get('fullname');
  }
  get homePhone() {
    return this.form.get('phone').get('home');
  }
  get mobilePhone() {
    return this.form.get('phone').get('mobile');
  }
  get workPhone() {
    return this.form.get('phone').get('work');
  }
  get birthDate() {
    return this.form.get('birthDate');
  }
  get birthPlace() {
    return this.form.get('birthPlace');
  }
  get country() {
    return this.form.get('country');
  }
  get identifier() {
    return this.form.get('identifier');
  }
  get identificationDocumentNumber() {
    return this.form.get('identificationDocument').get('number');
  }
  get identificationDocumentIssuer() {
    return this.form.get('identificationDocument').get('issuer');
  }
  get identificationDocumentDate() {
    return this.form.get('identificationDocument').get('date');
  }
  get factAddress() {
    return this.form.get('address').get('fact');
  }
  get education() {
    return this.form.get('education');
  }
  get workExperienceTotal() {
    return this.form.get('workExperience').get('total');
  }
  get workExperienceAgriculture() {
    return this.form.get('workExperience').get('agriculture');
  }
  get marriageStatus() {
    return this.form.get('marriageStatus');
  }
  get spouse() {
    return this.form.get('spouse');
  }

  get isResident(): boolean {
    return this.country.value?.code === this.kzCode;
  }

  onFormSubmit(): IPerson {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return null;
    }

    const state: IPerson = {
      id: this.initialState?.id,
      fullName: this.fullname.value,
      phone: {
        id: this.initialState?.phone?.id,
        home: this.homePhone.value,
        mobile: this.mobilePhone.value,
        work: this.workPhone.value,
      },
      birthDate: this.birthDate.value,
      birthPlace: this.birthPlace.value,
      countryId: this.country.value.id,
      identifier: this.isResident ? this.identifier.value : null,
      identificationDocument: {
        id: this.initialState?.identificationDocument?.id,
        number: this.identificationDocumentNumber.value,
        issuer: this.identificationDocumentIssuer.value,
        dateIssue: this.identificationDocumentDate.value,
      },
      address: {
        id: this.initialState?.address?.id,
        fact: this.factAddress.value,
        register: null,
      },
      education: this.isExtended ? this.education.value : null,
      workExperience: this.isExtended
        ? {
            id: this.initialState?.workExperience?.id,
            total: this.workExperienceTotal.value,
            agriculture: this.workExperienceAgriculture.value,
          }
        : null,
      marriageStatusId: this.isExtended ? this.marriageStatus.value?.id : null,
      spouse: this.isExtended ? this.spouse.value : null,
      email: null,
      fax: null,
    };

    return state;
  }
}
