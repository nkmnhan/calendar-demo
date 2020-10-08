import { Component, OnInit } from '@angular/core';
import { EditService } from './edit.service';
import { filter } from 'rxjs/operators';
import {
  CrudOperation,
  EditMode,
  EventClickEvent,
  RemoveEvent,
  SlotClickEvent,
} from '@progress/kendo-angular-scheduler';

import '@progress/kendo-date-math/tz/regions/Europe';
import '@progress/kendo-date-math/tz/regions/NorthAmerica';

@Component({
  selector: 'app-personal-calendar',
  template: `
    <kendo-scheduler
      [kendoSchedulerBinding]="editService.events | async"
      [modelFields]="editService.fields"
      [loading]="editService.loading"
      [editable]="true"
      [selectedDate]="selectedDate"
      (slotDblClick)="slotDblClickHandler($event)"
      (eventDblClick)="eventDblClickHandler($event)"
      (remove)="removeHandler($event)"
      style="height: 400px"
    >
      <kendo-scheduler-week-view startTime="07:00"> </kendo-scheduler-week-view>
    </kendo-scheduler>

    <scheduler-edit-form
      [event]="editedEvent"
      [editMode]="editMode"
      [isNew]="isNew"
      (save)="saveHandler($event)"
      (cancel)="cancelHandler()"
      style="display: block; margin-top: 20px;"
    >
    </scheduler-edit-form>
  `,
})
export class PersonalCalendarComponent implements OnInit {
  public selectedDate: Date = new Date('2013-06-10T00:00:00');
  public editedEvent: any;
  public editMode: EditMode;
  public isNew: boolean;

  constructor(public editService: EditService) {}

  public ngOnInit(): void {
    this.editService.read();
  }

  public slotDblClickHandler({ start, end, isAllDay }: SlotClickEvent): void {
    this.isNew = true;

    this.editMode = EditMode.Series;

    this.editedEvent = {
      Start: start,
      End: end,
      IsAllDay: isAllDay,
    };
  }

  public eventDblClickHandler({ sender, event }: EventClickEvent): void {
    this.isNew = false;

    let dataItem = event.dataItem;

    if (this.editService.isRecurring(dataItem)) {
      sender
        .openRecurringConfirmationDialog(CrudOperation.Edit)
        // The dialog will emit `undefined` on cancel
        .pipe(filter((editMode) => editMode !== undefined))
        .subscribe((editMode: EditMode) => {
          if (editMode === EditMode.Series) {
            dataItem = this.editService.findRecurrenceMaster(dataItem);
          }

          this.editMode = editMode;
          this.editedEvent = dataItem;
        });
    } else {
      this.editMode = EditMode.Series;
      this.editedEvent = dataItem;
    }
  }

  public saveHandler(formValue: any): void {
    if (this.isNew) {
      this.editService.create(formValue);
    } else {
      this.handleUpdate(this.editedEvent, formValue, this.editMode);
    }
  }

  public removeHandler({ sender, dataItem }: RemoveEvent): void {
    if (this.editService.isRecurring(dataItem)) {
      sender
        .openRecurringConfirmationDialog(CrudOperation.Remove)
        // result will be undefined if the Dialog was closed
        .pipe(filter((editMode) => editMode !== undefined))
        .subscribe((editMode) => {
          this.handleRemove(dataItem, editMode);
        });
    } else {
      sender.openRemoveConfirmationDialog().subscribe((shouldRemove) => {
        if (shouldRemove) {
          this.editService.remove(dataItem);
        }
      });
    }
  }

  public cancelHandler(): void {
    this.editedEvent = undefined;
  }

  private handleUpdate(item: any, value: any, mode: EditMode): void {
    const service = this.editService;
    if (mode === EditMode.Occurrence) {
      if (service.isException(item)) {
        service.update(item, value);
      } else {
        service.createException(item, value);
      }
    } else {
      // Item is not recurring or we're editing the entire series
      service.update(item, value);
    }
  }

  private handleRemove(item: any, mode: EditMode): void {
    const service = this.editService;
    if (mode === EditMode.Series) {
      service.removeSeries(item);
    } else if (mode === EditMode.Occurrence) {
      if (service.isException(item)) {
        service.remove(item);
      } else {
        service.removeOccurrence(item);
      }
    } else {
      service.remove(item);
    }
  }
}
