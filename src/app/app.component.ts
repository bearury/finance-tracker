import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { TUI_SANITIZER, TuiAlertModule, TuiDialogModule, TuiRootModule } from '@taiga-ui/core';
import { Component } from '@angular/core';
import { FormComponent } from '@components/form/form.component';
import { HistoryComponent } from '@components/history/history.component';
import {StatisticComponent} from "@components/statistic/statistic.component";

@Component({
  standalone: true,
  imports: [
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    FormComponent,
    HistoryComponent,
    StatisticComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  providers: [{ provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }],
})
export class AppComponent {}
