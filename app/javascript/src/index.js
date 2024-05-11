import $ from 'jquery';

import {
  indexTasks,
  postTask,
} from "./requests.js";

indexTasks(function (response) {
  var htmlString = response.tasks.map(function(task) {
    return `<div class='col-12 mb-3 p-2 border rounded d-flex align-items-center justify-content-between task' data-id='${task.id}'> 
      <div class="d-flex align-items-center">
        ${task.content}
      </div>
      <div>
        <button class="btn btn-danger">Delete</button>
        <input type="checkbox" id="task-${task.id}" />
      </div>
    </div>`;
  });

  $("#tasks").html(htmlString);
});