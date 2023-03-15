import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IOkapsUser } from '../../../models/user.model';
import { IOkapsAppState } from '../../../store/okaps';
import { okapsAuthSelectors } from '../../../store/selectors/auth.selectors';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  user$: Observable<IOkapsUser>;

  constructor(private store: Store<IOkapsAppState>) {}

  ngOnInit(): void {
    this.user$ = this.store.pipe(select(okapsAuthSelectors.selectUser));
  }
}
