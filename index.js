
$(document).ready(function () {
    getTaskData();

    function codeBinsAddEvent(obj, type, fn) {
        if (obj.attachEvent) {
            if (type == "load") {
                obj.attachEvent('on' + type, fn);
            }
            else {
                obj.attachEvent('onreadystatechange', fn);
            }
            /*
        obj['e'+type+fn]=fn;
        obj[type+fn]=function(){
            obj['e'+type+fn](window.event)}
        ;obj.attachEvent('on'+type,obj[type+fn])*/
        }
        else obj.addEventListener(type, fn, false)
    };
    function codeBinsAddLoadEvent(fn) {
        codeBinsAddEvent(document.addEventListener && !window.addEventListener ? document : window, 'load', fn)
    };
    function codeBinsAddReadyEvent(fn) {
        codeBinsAddEvent(document, 'DOMContentLoaded', fn)
    };

    $(function () {
        $(".connectedSortable").sortable({
            connectWith: ".connectedSortable"
        }).disableSelection();
    });


    function getTaskData() {
        $.ajax({
            url: "http://localhost:3000/TaskData",
            type: "GET",
            dataType: "Json",
            contentType: 'application/json',
            beforeSend: function () {
                $("#sortable1").html('<div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>')
            },
            success: function (data) {
                console.log(data);
                for (var i = 0; i < data.length; i++) {
                    console.log(data[i].ClientCall);
                    console.log(data[i].id);
                    var html = "";
                    html += '<div class="item item-box ui-state-default mt-3">';
                    html += '<div class="card ui-state-default">';
                    html += '<div class="card-body">';
                    html += '<h6 class="card-subtitle mb-2">' + data[i].TaskName + '</h6>';
                    html += '<p class="card-text">' + data[i].TaskDetails + '</p>';
                    html += '<div class="checkBoxOption">';
                    
                    if(data[i].ClientCall==true){
                        html += '<a href="#" class="badge badge-primary mr-1">Listen client Call</a>';
                    }
                    if(data[i].CompletedTask==true){
                        html += '<a href="#" class="badge badge-secondary mr-1">Complete Task</a>';
                    }
                    if(data[i].Discusstion==true){
                        html += '<a href="#" class="badge badge-success mr-1">Discuss with TL</a>';
                    }
                    html += '</div>';
                    html += '<div class="action-btn mt-2">';
                    html += '<button class="btn btn-primary btn-sm btn-rounded EditTask btn-icon mr-1" data-id="' + data[i].id + '"><i class="fa fa-pencil"></i></button>';
                    html += '<button class="btn btn-danger btn-sm btn-rounded DeleteTask btn-icon" data-id="' + data[i].id + '"><i class="fa fa-trash"></i></button>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';
                    $("#sortable1").append(html);
                }
            },
            error: function () {
            }
        })
    }
    $("body").on("click", "#CreateTask", function () {
        $("#TaskName").val("");
        $("#taskDetails").val("");
        $("#checkBox1").prop("checked", false);
        $("#checkBox2").prop("checked", false);
        $("#checkBox3").prop("checked", false);
        $("#exampleModal").attr("data-editid", "");
    });

    $("body").on("click", "#addTaskBtn", function () {
        function uniqId() {
            return Math.round(new Date().getTime() + (Math.random() * 100));
        }

        var taskId = $("#exampleModal").attr("data-editid");

        if (taskId == "") {
            var newTask = {
                "TaskName": $("#TaskName").val(),
                "TaskDetails": $("#taskDetails").val(),
                "ClientCall": $("#checkBox1").is(':checked'),
                "CompletedTask": $("#checkBox2").is(':checked'),
                "Discusstion": $("#checkBox3").is(':checked')
            }

            $.ajax({
                url: "http://localhost:3000/TaskData",
                type: "POST",
                data: JSON.stringify(newTask),
                dataType: "Json",
                contentType: 'application/json',
                headers: {
                    "accept": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                success: function (data) {
                    $(".alert-success").removeClass("d-none");
                    $("#exampleModal").modal("hide");
                    getTaskData();
                    $(".alert-success").removeClass("d-none")
                    setTimeout(function () {
                        $(".alert-success").addClass("d-none")
                    }, 4000);
                },
                error: function () {
                }
            })
        } else {
            var newTask = {
                "TaskName": $("#TaskName").val(),
                "TaskDetails": $("#taskDetails").val(),
                "ClientCall": $("#checkBox1").is(':checked'),
                "CompletedTask": $("#checkBox2").is(':checked'),
                "Discusstion": $("#checkBox3").is(':checked')
            }
            console.log(taskId)
            $.ajax({
                url: "http://localhost:3000/TaskData/" + taskId,
                type: "PUT",
                data: JSON.stringify(newTask),
                dataType: "Json",
                contentType: 'application/json',
                headers: {
                    "accept": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                success: function (data) {
                    $("#exampleModal").modal("hide");
                    getTaskData();
                    $(".alert-success").removeClass("d-none")
                    setTimeout(function () {
                        $(".alert-success").addClass("d-none")
                    }, 4000);
                },
                error: function () {
                }
            })
        }
    });

    $("body").on("click", ".EditTask", function () {
        var taskId = $(this).attr("data-id");
        console.log(taskId)
        $("#exampleModal").attr("data-editId", taskId);
        $("#exampleModal").modal("show");

        $.ajax({
            url: "http://localhost:3000/TaskData/" + taskId,
            type: "GET",
            dataType: "Json",
            contentType: 'application/json',
            headers: {
                "accept": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            success: function (data) {
                $("#TaskName").val(data.TaskName);
                $("#taskDetails").val(data.TaskDetails);
                var checkbox1 = data.ClientCall;
                var checkbox2 = data.CompletedTask;
                var checkbox3 = data.Discusstion;
                $("#checkBox1").prop("checked", checkbox1);
                $("#checkBox2").prop("checked", checkbox2);
                $("#checkBox3").prop("checked", checkbox3);
            },
            error: function () {
            }
        })
    });

    $("body").on("click", ".DeleteTask", function () {
        var taskId = $(this).attr("data-id");
        var Delete = confirm("Do You Want to Delete Task");
        if (Delete) {
            $.ajax({
                url: "http://localhost:3000/TaskData/" + taskId,
                type: "DELETE",
                dataType: "Json",
                contentType: 'application/json',
                headers: {
                    "accept": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                success: function (data) {
                    getTaskData();
                    $(".alert-danger").removeClass("d-none")
                    setTimeout(function () {
                        $(".alert-danger").addClass("d-none")
                    }, 6000);
                },
                error: function () {
                }
            });


        }

    });

    $("body").on("click", ".cancelBtn", function () {
        $("#TaskName").val("");
        $("#taskDetails").val("");
        $("#checkBox1").prop("checked", false);
        $("#checkBox2").prop("checked", false);
        $("#checkBox3").prop("checked", false);
        $("#exampleModal").attr("data-editid", "");
    });
});
