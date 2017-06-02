/**
 * Created by mvilla on 02/06/17.
 */
function Point(x, y) {
    this.x = x;
    this.y = y;
}

var points = new Array();
var distances = new Array();

$(document).ready(function () {
    /*$("html").click(function (e) { //Default mouse Position
     alert(e.pageX + ' , ' + e.pageY);
     });*/
    $("html").mousedown(function (event) {
        if (event.target.nodeName == "HTML") {
            switch (event.which) {
                case 1:
                    addPoint(event.pageX, event.pageY);
                    break;
                case 3:
                    addPoint(event.pageX, event.pageY);
                    break;
            }
        }
    });
});

function addPoint(x, y) {
    var point = new Point(x, y);
    points.push(point);
}

function submit() {
    switch (points.length) {
        case 0:
            alert("no point");
            break;
        case 1:
            alert("only one point");
            break;
        default:
            calculateDistances();
            if (points.length == 4) {
                //square

                addLastPoint();
                calculateSquareArea();
            } else if (points.length == 3) {
                //triangle
                addLastPoint();
                calculateTriangleArea();
            } else {
                alert("Total distance " + calculateTotalDistance());
            }
            break;
    }
    points = new Array();

}

function calculateSquareArea() {
    var area = distances[0] * distances[1];
    var service = "https://warm-thicket-98293.herokuapp.com/square";
    var url = service + "?area=" + area + "&points=" + pointsToString();
    $.get( url, function( data ) {
        $("#response").val( data );
    });
    alert("Squared thoughts " + area);
}

function pointsToString() {

    var ret = "[";
    for (var x = 0; x < points.length; x++) {
        ret += "(" + points[x].x + "," + points[x].y + ")";
        if (x < (points.length - 1))
            ret += ",";
    }
    ret += "]";
    return btoa(ret);
}

function calculateTotalDistance() {
    var acum = 0;
    for (var x = 0; x < distances.length; x++) {
        acum += distances[x];
    }
    return acum;

}

function calculateTriangleArea() {
    var secondPoint = points[1];
    var firstPoint = points[0];
    var lastPoint = points[2];
    var middlePoint = new Point((firstPoint.x + lastPoint.x) / 2, (firstPoint.y + lastPoint.y) / 2);
    var height = getDistance(secondPoint, middlePoint);
    var area = (distances[distances.length - 1] * height) / 2;
    var triangle = "";
    if (countEquals() == 2) {
        alert("Isosceles!");
        triangle = "isosceles";
    }
    else {
        alert("Just another triangle");
        triangle = "other";
    }
    var service = "https://warm-thicket-98293.herokuapp.com/triangle";
    var url = service + "?area=" + area + "&type=" + triangle + "&points=" + pointsToString();
    $.get( url, function( data ) {
        $("#response").val( data );
    });

}

function countEquals() {
    var count = 0;
    for (var x = 0; x < distances.length; x++) {
        for (var y = x + 1; y < distances.length; y++) {
            if (distances[x] == distances[y])
                count++;
        }
    }
    return count;
}

function addLastPoint() {
    var dis = getDistance(points[points.length - 1], points[0]);

    distances.push(dis);
}

function calculateDistances() {
    for (var x = 0; x < points.length; x++) {
        if (x != (points.length - 1)) {
            var actualPoint = points[x];
            var nextPoint = points[x + 1];
            distances.push(getDistance(nextPoint, actualPoint));
        }
    }
}

function getDistance(p2, p1) {
    var dist = Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2));
    return dist;
}
