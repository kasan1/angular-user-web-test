import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  IBankAccount,
  IOrganization,
  IPerson,
  IUpdateOrganizationDetails,
} from '../../../models/client.model';
import { IDictionaryBase } from '../../../models/common.model';
import { DictionariesService } from '../../../services/dictionaries.service';
import { updateOrganisationDetails } from '../../../store/client';
import { IOkapsAppState } from '../../../store/okaps';
import { conditionalValidator } from '../../../validators/conditional.validator';

@Component({
  selector: 'app-organisation-form',
  templateUrl: './organisation-form.component.html',
  styleUrls: ['./organisation-form.component.scss'],
})
export class OrganisationFormComponent implements OnInit, OnDestroy {
  @Input() isReadOnly: boolean;

  ngDestroyed$ = new Subject();
  public iinMask = [];
  kzCode: string = 'KAZ';

  form: FormGroup;
  organizationDetails: IOrganization;
  beneficiary: IPerson;
  representative: IPerson;
  initialContacts: IPerson[] = [];

  ownerShipFormTypes: IDictionaryBase[] = [];
  okedTypes: IDictionaryBase[] = [];
  legalForms: IDictionaryBase[] = [];
  countries: IDictionaryBase[] = [];
  regions: IDictionaryBase[] = [];
  taxTreatments: IDictionaryBase[] = [];
  subjectOfEntrepreneurs: IDictionaryBase[] = [];

  constructor(
    private dictionaryService: DictionariesService,
    private formBuilder: FormBuilder,
    private store: Store<IOkapsAppState>
  ) {}

  ngOnInit(): void {
    this.dictionaryService.getOked().then((response) => {
      this.okedTypes = response.data.list;
      this.oked.updateValueAndValidity();
    });
    this.dictionaryService.getOwnershipForms().then((response) => {
      this.ownerShipFormTypes = response.data.list;
      if (this.organizationDetails.ownershipFormId) {
        this.ownershipForm.setValue(
          response.data.list.find(
            (x) => x.id === this.organizationDetails.ownershipFormId
          )
        );
      }
    });
    this.dictionaryService.getLegalForms().then((response) => {
      this.legalForms = response.data.list;
      if (this.organizationDetails.legalFormId) {
        this.legalForm.setValue(
          response.data.list.find(
            (x) => x.id === this.organizationDetails.legalFormId
          )
        );
      }
    });
    this.dictionaryService.getCountries().then((response) => {
      this.countries = response.data.list;
      if (this.beneficiary !== null && this.beneficiary.countryId) {
        const country = response.data.list.find(
          (x) => x.id === this.beneficiary?.countryId
        );

        if (country) this.beneficiaryCountry.setValue(country);
      } else {
        const country = response.data.list.find((x) => x.code === this.kzCode);

        if (country) this.beneficiaryCountry.setValue(country);
      }

      if (this.representative !== null && this.representative.countryId) {
        const country = response.data.list.find(
          (x) => x.id === this.representative?.countryId
        );

        if (country) this.representativeCountry.setValue(country);
      } else {
        const country = response.data.list.find((x) => x.code === this.kzCode);

        if (country) this.representativeCountry.setValue(country);
      }
    });
    this.dictionaryService.getRegions().then((response) => {
      this.regions = response.data.list;
      if (this.organizationDetails.regionId) {
        this.region.setValue(
          response.data.list.find(
            (x) => x.id === this.organizationDetails.regionId
          )
        );
      }
    });
    this.dictionaryService.getTaxTreatments().then((response) => {
      this.taxTreatments = response.data.list;
      if (this.organizationDetails.taxTreatmentId) {
        this.taxTreatment.setValue(
          response.data.list.find(
            (x) => x.id === this.organizationDetails.taxTreatmentId
          )
        );
      }
    });
    this.dictionaryService.getSubjectOfEntrepreneurs().then((response) => {
      this.subjectOfEntrepreneurs = response.data.list;
      if (this.organizationDetails.subjectOfEntrepreneurId) {
        this.subjectOfEntrepreneur.setValue(
          response.data.list.find(
            (x) => x.id === this.organizationDetails.subjectOfEntrepreneurId
          )
        );
      }
    });

    this.store
      .select((state: IOkapsAppState) => state.client.details.organization)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.organizationDetails = data;
      });
    this.store
      .select((state: IOkapsAppState) => state.client.details.beneficiary)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.beneficiary = data;
      });
    this.store
      .select((state: IOkapsAppState) => state.client.details.representative)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.representative = data;
      });
    this.store
      .select((state: IOkapsAppState) => state.client.details.contacts)
      .pipe(takeUntil(this.ngDestroyed$))
      .subscribe((data) => {
        this.initialContacts = data;
      });

    this.generateForm();

    this.legalForm.valueChanges.subscribe((_) => {
      this.ownershipForm.updateValueAndValidity();
      this.parent.updateValueAndValidity();

      this.registrationDocumentNumber.updateValueAndValidity();
      this.registrationDocumentIssuer.updateValueAndValidity();
      this.registrationDocumentDate.updateValueAndValidity();
      this.identificationDocumentNumber.updateValueAndValidity();
      this.identificationDocumentIssuer.updateValueAndValidity();
      this.identificationDocumentDate.updateValueAndValidity();
    });
    this.isAddressDifferent.valueChanges.subscribe((_) => {
      this.factAddress.updateValueAndValidity();
    });

    this.hasBeneficiary.valueChanges.subscribe((_) => {
      this.beneficiaryAddress.updateValueAndValidity();
      this.beneficiaryCountry.updateValueAndValidity();
    });
    this.beneficiaryCountry.valueChanges.subscribe((_) => {
      this.beneficiaryIdentifier.updateValueAndValidity();
      this.beneficiaryIdentificationDocumentNumber.updateValueAndValidity();
      this.beneficiaryIdentificationDocumentIssuer.updateValueAndValidity();
      this.beneficiaryIdentificationDocumentDate.updateValueAndValidity();
    });

    this.hasRepresentative.valueChanges.subscribe((_) => {
      this.representativeAddress.updateValueAndValidity();
      this.representativeCountry.updateValueAndValidity();
    });
    this.representativeCountry.valueChanges.subscribe((_) => {
      this.representativeIdentifier.updateValueAndValidity();
      this.representativeIdentificationDocumentNumber.updateValueAndValidity();
      this.representativeIdentificationDocumentIssuer.updateValueAndValidity();
      this.representativeIdentificationDocumentDate.updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
  }

  generateForm() {
    this.form = this.formBuilder.group({
      fullname: [
        this.organizationDetails.fullName,
        [Validators.compose([Validators.required, Validators.maxLength(200)])],
      ],
      address: this.formBuilder.group({
        isDifferent: false,
        fact: [
          this.organizationDetails.address?.fact,
          conditionalValidator(
            () => this.isAddressDifferent.value,
            Validators.compose([
              Validators.required,
              Validators.maxLength(200),
            ]),
            'factAddressError'
          ),
        ],
        register: [
          this.organizationDetails.address?.register,
          [Validators.required, Validators.maxLength(200)],
        ],
      }),
      phone: this.formBuilder.group({
        home: [
          this.organizationDetails.phone?.home,
          [Validators.maxLength(20)],
        ],
        mobile: [
          this.organizationDetails.phone?.mobile,
          [Validators.maxLength(20)],
        ],
        work: [
          this.organizationDetails.phone?.work,
          [Validators.required, Validators.maxLength(20)],
        ],
      }),
      fax: [this.organizationDetails.fax, [Validators.maxLength(10)]],
      email: [
        this.organizationDetails.email,
        [Validators.required, Validators.maxLength(100)],
      ],
      registeredDate: [
        this.organizationDetails.registeredDate,
        [Validators.required],
      ],
      region: [null, [Validators.required]],
      legalForm: [null, [Validators.required]],
      taxTreatment: [null, [Validators.required]],
      subjectOfEntrepreneur: [null, [Validators.required]],
      ownershipForm: [
        null,
        conditionalValidator(
          () => this.isJuridical,
          Validators.required,
          'ownershipFormIdError'
        ),
      ],
      oked: [this.organizationDetails.oked, [Validators.required]],
      identification: [
        this.organizationDetails.identifier,
        [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(12),
        ],
      ],
      registrationDocument: this.formBuilder.group({
        number: [
          this.organizationDetails.registrationDocument?.number,
          conditionalValidator(
            () => this.isPhysical,
            Validators.required,
            'registrationDocumentNumberError'
          ),
        ],
        issuer: [
          this.organizationDetails.registrationDocument?.issuer,
          conditionalValidator(
            () => this.isPhysical,
            Validators.required,
            'registrationDocumentIssuerError'
          ),
        ],
        date: [
          this.organizationDetails.registrationDocument?.dateIssue,
          conditionalValidator(
            () => this.isPhysical,
            Validators.required,
            'registrationDocumentDateError'
          ),
        ],
      }),
      parent: [
        this.organizationDetails.parent,
        conditionalValidator(
          () => this.isJuridical,
          Validators.maxLength(200),
          'parentError'
        ),
      ],
      identificationDocument: this.formBuilder.group({
        number: [
          this.organizationDetails.registrationDocument?.number,
          conditionalValidator(
            () => this.isPhysical,
            Validators.required,
            'identificationDocumentNumberError'
          ),
        ],
        issuer: [
          this.organizationDetails.registrationDocument?.issuer,
          conditionalValidator(
            () => this.isPhysical,
            Validators.required,
            'identificationDocumentIssuerError'
          ),
        ],
        date: [
          this.organizationDetails.registrationDocument?.dateIssue,
          conditionalValidator(
            () => this.isPhysical,
            Validators.required,
            'identificationDocumentDateError'
          ),
        ],
      }),
      hasBeneficiary: [this.beneficiary !== null, Validators.required],
      beneficiary: this.formBuilder.group({
        fullname: [
          this.beneficiary?.fullName,
          conditionalValidator(
            () => this.hasBeneficiary.value,
            Validators.compose([
              Validators.required,
              Validators.maxLength(200),
            ]),
            'beneficiaryFullNameError'
          ),
        ],
        address: [
          this.beneficiary?.address.register,
          conditionalValidator(
            () => this.hasBeneficiary.value,
            Validators.compose([
              Validators.required,
              Validators.maxLength(200),
            ]),
            'beneficiaryAddressError'
          ),
        ],
        country: [
          null,
          conditionalValidator(
            () => this.hasBeneficiary.value,
            Validators.required,
            'beneficiaryCountryIdError'
          ),
        ],
        identifier: [
          this.beneficiary?.identifier,
          conditionalValidator(
            () => this.hasBeneficiary.value && this.beneficiaryIsResident,
            Validators.compose([
              Validators.required,
              Validators.minLength(12),
              Validators.maxLength(12),
            ]),
            'beneficiaryIdentifierError'
          ),
        ],
        identificationDocument: this.formBuilder.group({
          number: [
            this.beneficiary?.identificationDocument?.number,
            conditionalValidator(
              () => this.hasBeneficiary.value,
              Validators.required,
              'beneficiaryIdentificationDocumentNumberError'
            ),
          ],
          issuer: [
            this.beneficiary?.identificationDocument?.issuer,
            conditionalValidator(
              () => this.hasBeneficiary.value,
              Validators.required,
              'beneficiaryIdentificationDocumentIssuerError'
            ),
          ],
          date: [
            this.beneficiary?.identificationDocument?.dateIssue,
            conditionalValidator(
              () => this.hasBeneficiary.value,
              Validators.required,
              'beneficiaryIdentificationDocumentDateError'
            ),
          ],
        }),
      }),
      hasRepresentative: [this.representative !== null, Validators.required],
      representative: this.formBuilder.group({
        fullname: [
          this.representative?.fullName,
          conditionalValidator(
            () => this.hasRepresentative.value,
            Validators.compose([
              Validators.required,
              Validators.maxLength(200),
            ]),
            'representativeFullNameError'
          ),
        ],
        address: [
          this.representative?.address.register,
          conditionalValidator(
            () => this.hasRepresentative.value,
            Validators.compose([
              Validators.required,
              Validators.maxLength(200),
            ]),
            'representativeAddressError'
          ),
        ],
        country: [
          null,
          conditionalValidator(
            () => this.hasRepresentative.value,
            Validators.required,
            'representativeCountryIdError'
          ),
        ],
        identifier: [
          this.representative?.identifier,
          conditionalValidator(
            () => this.hasRepresentative.value && this.representativeIsResident,
            Validators.compose([
              Validators.required,
              Validators.minLength(12),
              Validators.maxLength(12),
            ]),
            'representativeIdentifierError'
          ),
        ],
        identificationDocument: this.formBuilder.group({
          number: [
            this.representative?.identificationDocument?.number,
            conditionalValidator(
              () => this.hasRepresentative.value,
              Validators.required,
              'representativeIdentificationDocumentNumberError'
            ),
          ],
          issuer: [
            this.representative?.identificationDocument?.issuer,
            conditionalValidator(
              () => this.hasRepresentative.value,
              Validators.required,
              'representativeIdentificationDocumentIssuerError'
            ),
          ],
          date: [
            this.representative?.identificationDocument?.dateIssue,
            conditionalValidator(
              () => this.hasRepresentative.value,
              Validators.required,
              'representativeIdentificationDocumentDateError'
            ),
          ],
        }),
      }),
      contacts: this.formBuilder.array([]),
      bankAccounts: this.formBuilder.array([]),
    });

    this.initialContacts.forEach((x) => this.addContact(x));
    this.organizationDetails.bankAccounts.forEach((x) =>
      this.addBankAccount(x)
    );

    if (this.isReadOnly) {
      this.form.disable();
    }
  }

  get fullname() {
    return this.form.get('fullname');
  }
  get registerAddress() {
    return this.form.get('address').get('register');
  }
  get isAddressDifferent() {
    return this.form.get('address').get('isDifferent');
  }
  get factAddress() {
    return this.form.get('address').get('fact');
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
  get fax() {
    return this.form.get('fax');
  }
  get email() {
    return this.form.get('email');
  }
  get registeredDate() {
    return this.form.get('registeredDate');
  }
  get region() {
    return this.form.get('region');
  }
  get legalForm() {
    return this.form.get('legalForm');
  }
  get taxTreatment() {
    return this.form.get('taxTreatment');
  }
  get subjectOfEntrepreneur() {
    return this.form.get('subjectOfEntrepreneur');
  }
  get ownershipForm() {
    return this.form.get('ownershipForm');
  }
  get oked() {
    return this.form.get('oked') as FormArray;
  }
  get identification() {
    return this.form.get('identification');
  }
  get registrationDocumentNumber() {
    return this.form.get('registrationDocument').get('number');
  }
  get registrationDocumentIssuer() {
    return this.form.get('registrationDocument').get('issuer');
  }
  get registrationDocumentDate() {
    return this.form.get('registrationDocument').get('date');
  }
  get parent() {
    return this.form.get('parent');
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

  // Beneficiary
  get hasBeneficiary() {
    return this.form.get('hasBeneficiary');
  }
  get beneficiaryFullName() {
    return this.form.get('beneficiary').get('fullname');
  }
  get beneficiaryAddress() {
    return this.form.get('beneficiary').get('address');
  }
  get beneficiaryCountry() {
    return this.form.get('beneficiary').get('country');
  }
  get beneficiaryIdentifier() {
    return this.form.get('beneficiary').get('identifier');
  }
  get beneficiaryIdentificationDocumentNumber() {
    return this.form
      .get('beneficiary')
      .get('identificationDocument')
      .get('number');
  }
  get beneficiaryIdentificationDocumentIssuer() {
    return this.form
      .get('beneficiary')
      .get('identificationDocument')
      .get('issuer');
  }
  get beneficiaryIdentificationDocumentDate() {
    return this.form
      .get('beneficiary')
      .get('identificationDocument')
      .get('date');
  }
  get beneficiaryIsResident() {
    return this.beneficiaryCountry.value?.code === 'KAZ';
  }

  // Representative
  get hasRepresentative() {
    return this.form.get('hasRepresentative');
  }
  get representativeFullName() {
    return this.form.get('representative').get('fullname');
  }
  get representativeAddress() {
    return this.form.get('representative').get('address');
  }
  get representativeCountry() {
    return this.form.get('representative').get('country');
  }
  get representativeIdentifier() {
    return this.form.get('representative').get('identifier');
  }
  get representativeIdentificationDocumentNumber() {
    return this.form
      .get('representative')
      .get('identificationDocument')
      .get('number');
  }
  get representativeIdentificationDocumentIssuer() {
    return this.form
      .get('representative')
      .get('identificationDocument')
      .get('issuer');
  }
  get representativeIdentificationDocumentDate() {
    return this.form
      .get('representative')
      .get('identificationDocument')
      .get('date');
  }
  get representativeIsResident() {
    return this.representativeCountry.value?.code === 'KAZ';
  }

  // Contacts
  get contacts() {
    return this.form.get('contacts') as FormArray;
  }

  addContact(data?: IPerson) {
    this.contacts.push(
      new FormGroup({
        id: new FormControl(data?.id),
        fullname: new FormControl(
          data?.fullName,
          Validators.compose([Validators.required, Validators.maxLength(200)])
        ),
        addressId: new FormControl(data?.address.id),
        address: new FormControl(
          data?.address.register,
          Validators.compose([Validators.required, Validators.maxLength(200)])
        ),
        phoneId: new FormControl(data?.phone.id),
        phone: new FormControl(
          data?.phone.mobile,
          Validators.compose([Validators.required, Validators.maxLength(20)])
        ),
      })
    );
  }

  removeContact(i: number) {
    this.contacts.removeAt(i);
  }

  // Bank accounts
  get bankAccounts() {
    return this.form.get('bankAccounts') as FormArray;
  }

  addBankAccount(data?: IBankAccount) {
    this.bankAccounts.push(
      new FormGroup({
        id: new FormControl(data?.id),
        bic: new FormControl(
          data?.bic,
          Validators.compose([Validators.required, Validators.maxLength(20)])
        ),
        number: new FormControl(
          data?.number,
          Validators.compose([Validators.required, Validators.maxLength(50)])
        ),
      })
    );
  }

  removeBankAccount(i: number) {
    this.bankAccounts.removeAt(i);
  }

  get isJuridical() {
    return this.legalForm.value !== null && this.legalForm.value.code === '1';
  }

  get isPhysical() {
    return this.legalForm.value !== null && this.legalForm.value.code !== '1';
  }

  contactsToPeople(): IPerson[] {
    return Array.from(this.contacts.value).map(
      (contact: any) =>
        <IPerson>{
          id: contact.id,
          fullName: contact.fullname,
          address: {
            id: contact.addressId,
            register: contact.address,
            fact: null,
          },
          phone: {
            id: contact.phoneId,
            mobile: contact.phone,
            home: null,
            work: null,
          },
          birthDate: null,
          birthPlace: null,
          countryId: null,
          education: null,
          email: null,
          fax: null,
          identificationDocument: null,
          identifier: null,
          marriageStatusId: null,
        }
    );
  }

  onFormSubmit(): boolean {
    console.log(this.form);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }

    const organization: IOrganization = {
      ...this.organizationDetails,
      fullName: this.fullname.value,
      address: {
        id: this.organizationDetails.address?.id,
        register: this.registerAddress.value,
        fact: this.isAddressDifferent ? this.factAddress.value : null,
      },
      phone: {
        id: this.organizationDetails.phone?.id,
        home: null,
        mobile: null,
        work: this.workPhone.value,
      },
      fax: this.fax.value,
      email: this.email.value,
      identifier: this.identification.value,
      registeredDate: this.registeredDate.value,
      regionId: this.region.value.id,
      oked: this.oked.value,
      legalFormId: this.legalForm.value.id,
      taxTreatmentId: this.taxTreatment.value.id,
      subjectOfEntrepreneurId: this.subjectOfEntrepreneur.value.id,
      ownershipFormId: this.isJuridical ? this.ownershipForm.value.id : null,
      parent: this.isJuridical ? this.parent.value : null,
      registrationDocument: this.isPhysical
        ? {
            id: this.organizationDetails.registrationDocument?.id,
            number: this.registrationDocumentNumber.value,
            issuer: this.registrationDocumentIssuer.value,
            dateIssue: this.registrationDocumentDate.value,
          }
        : null,
      identificationDocument: this.isPhysical
        ? {
            id: this.organizationDetails.identificationDocument?.id,
            number: this.identificationDocumentNumber.value,
            issuer: this.identificationDocumentIssuer.value,
            dateIssue: this.identificationDocumentDate.value,
          }
        : null,
      bankAccounts: this.bankAccounts.value,
    };

    const data: IUpdateOrganizationDetails = {
      organization: organization,
      beneficiary: this.hasBeneficiary.value
        ? <IPerson>{
            id: this.beneficiary?.id,
            fullName: this.beneficiaryFullName.value,
            address: {
              id: this.beneficiary?.address?.id,
              register: this.beneficiaryAddress.value,
              fact: null,
            },
            countryId: this.beneficiaryCountry.value.id,
            identifier: this.beneficiaryIsResident
              ? this.beneficiaryIdentifier.value
              : null,
            identificationDocument: {
              id: this.beneficiary?.identificationDocument?.id,
              number: this.beneficiaryIdentificationDocumentNumber.value,
              issuer: this.beneficiaryIdentificationDocumentIssuer.value,
              dateIssue: this.beneficiaryIdentificationDocumentDate.value,
            },
            birthDate: null,
            birthPlace: null,
            email: null,
            fax: null,
            education: null,
            marriageStatusId: null,
            phone: null,
          }
        : null,
      representative: this.hasRepresentative.value
        ? <IPerson>{
            id: this.representative?.id,
            fullName: this.representativeFullName.value,
            address: {
              id: this.representative?.address?.id,
              register: this.representativeAddress.value,
              fact: null,
            },
            countryId: this.representativeCountry.value.id,
            identifier: this.representativeIsResident
              ? this.representativeIdentifier.value
              : null,
            identificationDocument: {
              id: this.representative?.identificationDocument?.id,
              number: this.representativeIdentificationDocumentNumber.value,
              issuer: this.representativeIdentificationDocumentIssuer.value,
              dateIssue: this.representativeIdentificationDocumentDate.value,
            },
            birthDate: null,
            birthPlace: null,
            email: null,
            fax: null,
            education: null,
            marriageStatusId: null,
            phone: null,
          }
        : null,
      contacts: this.contactsToPeople(),
    };

    this.store.dispatch(updateOrganisationDetails(data));

    return true;
  }
}
