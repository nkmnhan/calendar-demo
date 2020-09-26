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
    kendo
      .jQuery(this.el.nativeElement)
      .kendoGantt({
        dataSource: this.tasksDataSource,
        dependencies: this.dependenciesDataSource,
        resources: {
          field: 'resources',
          dataColorField: 'Color',
          dataTextField: 'Name',
          dataSource: {
            transport: {
              read: {
                url: this.serviceRoot + '/GanttResources',
                dataType: 'jsonp',
              },
            },
            schema: {
              model: {
                id: 'id',
                fields: {
                  id: { from: 'ID', type: 'number' },
                },
              },
            },
          },
        },
        assignments: {
          dataTaskIdField: 'TaskID',
          dataResourceIdField: 'ResourceID',
          dataValueField: 'Units',
          dataSource: {
            transport: {
              read: {
                url: this.serviceRoot + '/GanttResourceAssignments',
                dataType: 'jsonp',
              },
              update: {
                url: this.serviceRoot + '/GanttResourceAssignments/Update',
                dataType: 'jsonp',
              },
              destroy: {
                url: this.serviceRoot + '/GanttResourceAssignments/Destroy',
                dataType: 'jsonp',
              },
              create: {
                url: this.serviceRoot + '/GanttResourceAssignments/Create',
                dataType: 'jsonp',
              },
              parameterMap: function (options, operation) {
                if (operation !== 'read') {
                  return {
                    models: kendo.stringify(options.models || [options]),
                  };
                }
              },
            },
            schema: {
              model: {
                id: 'ID',
                fields: {
                  ID: { type: 'number' },
                  ResourceID: { type: 'number' },
                  Units: { type: 'number' },
                  TaskID: { type: 'number' },
                },
              },
            },
          },
        },
        views: ['day', { type: 'week', selected: true }, 'month'],
        columns: [
          { field: 'title', title: 'Task', editable: true, width: 255 },
          {
            field: 'start',
            title: 'Actual Start Date',
            format: '{0:M/d/yyyy}',
            editable: true,
            width: 130,
          },
          {
            field: 'end',
            title: 'Actual End Date',
            format: '{0:M/d/yyyy}',
            editable: true,
            width: 130,
          },
          {
            field: 'percentComplete',
            title: '% Complete',
            type: 'number',
            editable: true,
            width: 100,
          },
        ],
        toolbar: ['append', 'pdf'],
        height: 700,
        listWidth: '50%',
        showWorkHours: false,
        showWorkDays: false,
        snap: false,
      })
      .data('kendoGantt');
  }
}
