import { EditService } from './personal-calendar/edit.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { TeamCalendarComponent } from './team-calendar/team-calendar.component';
import { PersonalCalendarComponent } from './personal-calendar/personal-calendar.component';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    TeamCalendarComponent,
    PersonalCalendarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SchedulerModule,
  ],
  providers: [EditService],
  bootstrap: [AppComponent],
  entryComponents: [TeamCalendarComponent, PersonalCalendarComponent],
})
export class AppModule {}
