import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { BpmAdminLazyLoaderService } from '../../services/bpm-admin.lazy-loader.service';

@Component({
  selector: 'app-bpm-admin-register',
  templateUrl: './bpm-admin-register.component.html',
  styleUrls: ['./bpm-admin-register.component.scss'],
})
export class BpmAdminRegisterComponent implements OnInit, AfterViewInit {
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  loading = true;
  errorMessage: string;

  constructor(private loader: BpmAdminLazyLoaderService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.loader
      .loadAdminRegisterComponent(this.container)
      .then(() => (this.loading = false))
      .catch((err) => {
        this.errorMessage = 'Не удалось загрузить компонент.';
        return new Error(err);
      });
  }
}
