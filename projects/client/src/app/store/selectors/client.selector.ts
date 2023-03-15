import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { IAffillatedOrganizationTableData } from '../../models/client.model';
import { IOkapsAppState } from '../okaps';

export const selectAffiliatedOrganisations = (store: Store<IOkapsAppState>) =>
  store.pipe(
    select(
      (state: IOkapsAppState) =>
        state.client.details.organization.affiliatedOrganizations
    ),
    map((data) => {
      let tableData: IAffillatedOrganizationTableData[] = [];

      if (data) {
        data.forEach((x) => {
          let banks = '';
          x.bankAccounts.forEach((b, i) => {
            banks += `${b.bic} (${b.number}) `;
          });

          let debts = '';
          x.debts.forEach((d, i) => {
            debts += `${d.debt}` + (d.bic !== null ? ` (${d.bic})` : '') + ' ';
          });

          tableData.push({
            id: x.id,
            fullname: `${x.fullName}, ${x.address.register}`,
            identifier: x.identifier,
            shareInCapital: x.shareInCapital,
            banks: banks.substring(0, banks.length - 1),
            debts: debts.substring(0, debts.length - 1),
            head: `${x.head.fullName}, ${x.head.identifier}`,
          });
        });
      }

      return tableData;
    })
  );
