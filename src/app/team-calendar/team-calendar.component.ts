import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import '@progress/kendo-ui';

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
        this.start = new Date('01/01/2020');
        this.end = new Date('01/01/2021');
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
            field: 'title',
            title: 'Title',
            sortable: true,
            editable: true,
            width: 100,
          }
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
            // John
            {
              id: 1,
              parentId: null,
              orderId: 0,
              title: 'John',
              start: new Date('1/06/2020 12:00'),
              end: new Date('12/06/2020 12:00'),
            },
            {
              id: 2,
              parentId: 1,
              orderId: 0,
              title: 'course 1',
              start: new Date('1/06/2020 12:00'),
              end: new Date('4/06/2020 12:00'),
            },
            {
              id: 3,
              parentId: 1,
              orderId: 0,
              title: 'course 2',
              start: new Date('4/06/2020 12:00'),
              end: new Date('7/06/2020 12:00'),
            },
            {
              id: 4,
              parentId: 1,
              orderId: 0,
              title: 'course 3',
              start: new Date('7/06/2020 12:00'),
              end: new Date('12/06/2020 12:00'),
            },
            // Annie
            {
              id: 5,
              parentId: null,
              orderId: 0,
              title: 'Annie',
              start: new Date('6/06/2020 12:00'),
              end: new Date('12/06/2020 12:00'),
            },
            {
              id: 6,
              parentId: 5,
              orderId: 0,
              title: 'course 1',
              start: new Date('6/06/2020 12:00'),
              end: new Date('8/06/2020 12:00'),
            },
            {
              id: 7,
              parentId: 5,
              orderId: 0,
              title: 'course 2',
              start: new Date('8/06/2020 12:00'),
              end: new Date('10/06/2020 12:00'),
            },
            {
              id: 8,
              parentId: 5,
              orderId: 0,
              title: 'course 3',
              start: new Date('10/06/2020 12:00'),
              end: new Date('12/06/2020 12:00'),
            }
          ],
        },
        editable: false,
        dataBound: function(e){
          if(this.view().title === 'Quaterly'){
            let height = this.timeline.view()._slots.length * 2.65;
            this.list.thead.find("tr").height(height + "em");
            this.list._adjustHeight();
          }
          else{
            let height = this.timeline.view()._slots.length * 2.63;
            this.list.thead.find("tr").height(height + "em");
            this.list._adjustHeight();
          }
        }
      })
      .data('kendoGantt');

      this.setting();
  }

  setting() {
    var height = this.gantt.timeline.view()._slots.length * 2.65;
    this.gantt.list.thead.find("tr").height(height + "em");
    this.gantt.list._adjustHeight();
  }

  onClickMe() {
    var dataSource = new kendo.data.GanttDataSource({
      data: [
        // John
        {
          id: 1,
          parentId: null,
          orderId: 0,
          title: 'John',
          start: new Date('1/06/2020 12:00'),
          end: new Date('12/06/2020 12:00'),
        },
        {
          id: 2,
          parentId: 1,
          orderId: 0,
          title: 'course 1',
          start: new Date('1/06/2020 12:00'),
          end: new Date('4/06/2020 12:00'),
        },
        {
          id: 3,
          parentId: 1,
          orderId: 0,
          title: 'course 2',
          start: new Date('4/06/2020 12:00'),
          end: new Date('7/06/2020 12:00'),
        },
        {
          id: 4,
          parentId: 1,
          orderId: 0,
          title: 'course 3',
          start: new Date('7/06/2020 12:00'),
          end: new Date('12/06/2020 12:00'),
        },
        // Annie
        {
          id: 5,
          parentId: null,
          orderId: 0,
          title: 'Annie',
          start: new Date('6/06/2020 12:00'),
          end: new Date('12/06/2020 12:00'),
        },
        {
          id: 6,
          parentId: 5,
          orderId: 0,
          title: 'course 1',
          start: new Date('6/06/2020 12:00'),
          end: new Date('8/06/2020 12:00'),
        },
        {
          id: 7,
          parentId: 5,
          orderId: 0,
          title: 'course 2',
          start: new Date('8/06/2020 12:00'),
          end: new Date('10/06/2020 12:00'),
        },
        {
          id: 8,
          parentId: 5,
          orderId: 0,
          title: 'course 3',
          start: new Date('10/06/2020 12:00'),
          end: new Date('12/06/2020 12:00'),
        },
        // Tony
        {
          id: 9,
          parentId: null,
          orderId: 0,
          title: 'Tony',
          start: new Date('1/06/2020 12:00'),
          end: new Date('12/06/2020 12:00'),
        },
        {
          id: 10,
          parentId: 9,
          orderId: 0,
          title: 'course 1',
          start: new Date('1/06/2020 12:00'),
          end: new Date('4/06/2020 12:00'),
        },
        {
          id: 11,
          parentId: 9,
          orderId: 0,
          title: 'course 2',
          start: new Date('4/06/2020 12:00'),
          end: new Date('7/06/2020 12:00'),
        },
        {
          id: 12,
          parentId: 9,
          orderId: 0,
          title: 'course 3',
          start: new Date('7/06/2020 12:00'),
          end: new Date('12/06/2020 12:00'),
        },
        // Jack
        {
          id: 13,
          parentId: null,
          orderId: 0,
          title: 'Jack',
          start: new Date('6/06/2020 12:00'),
          end: new Date('12/06/2020 12:00'),
        },
        {
          id: 14,
          parentId: 13,
          orderId: 0,
          title: 'course 1',
          start: new Date('6/06/2020 12:00'),
          end: new Date('8/06/2020 12:00'),
        },
        {
          id: 15,
          parentId: 13,
          orderId: 0,
          title: 'course 2',
          start: new Date('8/06/2020 12:00'),
          end: new Date('10/06/2020 12:00'),
        },
        {
          id: 16,
          parentId: 13,
          orderId: 0,
          title: 'course 3',
          start: new Date('10/06/2020 12:00'),
          end: new Date('12/06/2020 12:00'),
        }
      ],
    });
    this.gantt.setDataSource(dataSource);
  }
}
