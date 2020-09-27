import { element } from 'protractor';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import '@progress/kendo-ui';
import { ThrowStmt } from '@angular/compiler';

declare var kendo: any;

@Component({
  selector: 'app-team-calendar',
  templateUrl: './team-calendar.component.html',
  styleUrls: ['./team-calendar.component.scss'],
})
export class TeamCalendarComponent implements AfterViewInit {
  @ViewChild('gantt') el: ElementRef;
  @ViewChild('.k-gantt-header .k-toolbar .k-gantt-toolbar') header: ElementRef;

  gantt: any;

  serviceRoot = 'https://demos.telerik.com/kendo-ui/service';
  tasksDataSource = new kendo.data.GanttDataSource({
    transport: {
      read: {
        url: this.serviceRoot + '/GanttTasks',
        dataType: 'jsonp',
      },
      update: {
        url: this.serviceRoot + '/GanttTasks/Update',
        dataType: 'jsonp',
      },
      destroy: {
        url: this.serviceRoot + '/GanttTasks/Destroy',
        dataType: 'jsonp',
      },
      create: {
        url: this.serviceRoot + '/GanttTasks/Create',
        dataType: 'jsonp',
      },
      parameterMap: function (options, operation) {
        if (operation !== 'read') {
          return { models: kendo.stringify(options.models || [options]) };
        }
      },
    },
    schema: {
      model: {
        id: 'id',
        fields: {
          id: { from: 'ID', type: 'number' },
          orderId: {
            from: 'OrderID',
            type: 'number',
            validation: { required: true },
          },
          parentId: {
            from: 'ParentID',
            type: 'number',
            defaultValue: null,
            nullable: true,
            validation: { required: true },
          },
          start: { from: 'Start', type: 'date' },
          end: { from: 'End', type: 'date' },
          title: { from: 'Title', defaultValue: '', type: 'string' },
          percentComplete: { from: 'PercentComplete', type: 'number' },
          summary: { from: 'Summary', type: 'boolean' },
          expanded: { from: 'Expanded', type: 'boolean', defaultValue: true },
        },
      },
    },
  });

  dependenciesDataSource = new kendo.data.GanttDependencyDataSource({
    transport: {
      read: {
        url: this.serviceRoot + '/GanttDependencies',
        dataType: 'jsonp',
      },
      update: {
        url: this.serviceRoot + '/GanttDependencies/Update',
        dataType: 'jsonp',
      },
      destroy: {
        url: this.serviceRoot + '/GanttDependencies/Destroy',
        dataType: 'jsonp',
      },
      create: {
        url: this.serviceRoot + '/GanttDependencies/Create',
        dataType: 'jsonp',
      },
      parameterMap: function (options, operation) {
        if (operation !== 'read') {
          return { models: kendo.stringify(options.models || [options]) };
        }
      },
    },
    schema: {
      model: {
        id: 'id',
        fields: {
          id: { from: 'ID', type: 'number' },
          predecessorId: { from: 'PredecessorID', type: 'number' },
          successorId: { from: 'SuccessorID', type: 'number' },
          type: { from: 'Type', type: 'number' },
        },
      },
    },
  });

  constructor() {}

  ngAfterViewInit(): void {
    kendo.ui.GanttCustomView = kendo.ui.GanttView.extend({
      name: 'custom',

      options: {
        yearHeaderTemplate: kendo.template("#=kendo.toString(start, 'yyyy')#"),
        quarterHeaderTemplate: kendo.template(
          "# return ['Q1', 'Q2', 'Q3', 'Q4'][start.getMonth() / 3] #"
        ),
        monthHeaderTemplate: kendo.template("#=kendo.toString(start, 'MMM')#"),
      },

      range: function (range) {
        this.start = new Date('01/01/2013');
        this.end = new Date('01/01/2016');
      },

      _generateSlots: function (incrementCallback, span) {
        var slots = [];
        var slotStart = new Date(this.start);
        var slotEnd;

        while (slotStart < this.end) {
          slotEnd = new Date(slotStart);
          incrementCallback(slotEnd);

          slots.push({ start: slotStart, end: slotEnd, span: span });

          slotStart = slotEnd;
        }

        return slots;
      },

      _createSlots: function () {
        var slots = [];

        slots.push(
          this._generateSlots(function (date) {
            date.setFullYear(date.getFullYear() + 1);
          }, 12)
        );
        slots.push(
          this._generateSlots(function (date) {
            date.setMonth(date.getMonth() + 3);
          }, 3)
        );
        slots.push(
          this._generateSlots(function (date) {
            date.setMonth(date.getMonth() + 1);
          }, 1)
        );

        return slots;
      },

      _layout: function () {
        var rows = [];
        var options = this.options;

        rows.push(
          this._slotHeaders(
            this._slots[0],
            kendo.template(options.yearHeaderTemplate)
          )
        );
        rows.push(
          this._slotHeaders(
            this._slots[1],
            kendo.template(options.quarterHeaderTemplate)
          )
        );
        rows.push(
          this._slotHeaders(
            this._slots[2],
            kendo.template(options.monthHeaderTemplate)
          )
        );

        return rows;
      },
    });

    this.gantt = kendo
      .jQuery(this.el.nativeElement)
      .kendoGantt({
        columns: [
          {
            field: 'id',
            title: 'ID',
            sortable: true,
            editable: false,
            width: 30,
          },
          {
            field: 'title',
            title: 'Title',
            sortable: true,
            editable: true,
            width: 100,
          },
          {
            field: 'start',
            title: 'Start Time',
            sortable: true,
            editable: true,
            format: '{0:MM/dd/yyyy HH:mm}',
            width: 100,
          },
          {
            field: 'end',
            title: 'End Time',
            sortable: true,
            editable: true,
            format: '{0:MM/dd/yyyy HH:mm}',
            width: 100,
          },
        ],
        views: [
          'week',
          'month',
          {
            type: 'kendo.ui.GanttCustomView',
            title: 'Quaterly',
            selected: true,
          },
        ],
        listWidth: 500,
        dataSource: {
          data: [
            {
              id: 1,
              parentId: null,
              percentComplete: 0.2,
              orderId: 0,
              title: 'foo',
              start: new Date('05/05/2014 09:00'),
              end: new Date('06/06/2014 10:00'),
            },
            {
              id: 2,
              parentId: null,
              percentComplete: 0.4,
              orderId: 1,
              title: 'bar',
              start: new Date('07/06/2014 12:00'),
              end: new Date('08/07/2014 13:00'),
            },
          ],
        },
        dependencies: {
          data: [{ id: 1, predecessorId: 1, successorId: 2, type: 1 }],
        },
        editable: false,
      })
      .data('kendoGantt');
  }

  onClickMe() {
    var dataSource = new kendo.data.GanttDataSource({
      data: [
        {
          id: 1,
          parentId: null,
          percentComplete: 0.2,
          orderId: 0,
          title: 'foo1',
          start: new Date('05/05/2014 09:00'),
          end: new Date('06/06/2014 10:00'),
        },
        {
          id: 2,
          parentId: null,
          percentComplete: 0.4,
          orderId: 1,
          title: 'bar1',
          start: new Date('07/06/2014 12:00'),
          end: new Date('08/07/2014 13:00'),
        },
      ],
    });
    this.gantt.setDataSource(dataSource);
  }
}
