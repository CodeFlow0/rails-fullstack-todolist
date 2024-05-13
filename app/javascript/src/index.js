import $ from 'jquery';

import {
  indexTasks,
  postTask,
  deleteTask,
  completeTask,
} from "./requests.js";

$(document).on('turbolinks:load', function() {
  // Function to load tasks based on status (all, completed, active)
  function loadTasks(status) {
    indexTasks(function (response) {
      var htmlString = response.tasks.map(function(task) {
        if ((status === 'completed' && task.completed) ||
            (status === 'active' && !task.completed) ||
            status === 'all') {
          return `<div class='col-12 mb-3 p-2 border rounded d-flex align-items-center justify-content-between task' data-id='${task.id}'> 
            <div class="d-flex align-items-center">
              ${task.content}
            </div>
            <div>
              <button class="btn btn-danger delete-btn" data-id="${task.id}">Delete</button>
              <input type="checkbox" class="complete-checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''} data-id="${task.id}" />
            </div>
          </div>`;
        }
      }).join('');

      $("#tasks").html(htmlString);

      $(".delete-btn").click(function() {
        var taskId = $(this).data("id");
        deleteTask(taskId, function() {
          // Remove the deleted task from the DOM
          $(`.task[data-id="${taskId}"]`).remove();
        }, function(error) {
          console.error("Error deleting task:", error);
        });
      });

      $(".complete-checkbox").change(function() {
        var taskId = $(this).attr("data-id");
        var checked = $(this).prop("checked");
        if (checked) {
          completeTask(taskId, function() {
            // Update the task's appearance based on completion status
            $(`.task[data-id="${taskId}"]`).addClass("completed");
          }, function(error) {
            console.error("Error marking task complete:", error);
          });
        } else {
          completeTask(taskId, function() {
            // Update the task's appearance based on completion status
            $(`.task[data-id="${taskId}"]`).removeClass("completed");
          }, function(error) {
            console.error("Error marking task active:", error);
          });
        }
      });
    });
  }

  // Initial load of all tasks
  loadTasks('all');

  // Toggle buttons event listeners
  $("#show-all").click(function() {
    loadTasks('all');
  });

  $("#show-completed").click(function() {
    loadTasks('completed');
  });

  $("#show-active").click(function() {
    loadTasks('active');
  });

  // Form submission event listener
  $("#create-task").submit(function(event) {
    event.preventDefault();
    var content = $("#new-task-content").val();
    postTask(content, function() {
      // After successful task creation, reload tasks
      loadTasks('all');
      $("#new-task-content").val(""); // Clear input field
    }, function(error) {
      console.error("Error creating task:", error);
    });
  });
});
