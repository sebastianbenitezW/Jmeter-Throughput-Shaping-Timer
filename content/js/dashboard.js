/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6124324324324324, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.41, 500, 1500, "Ip"], "isController": false}, {"data": [0.77, 500, 1500, "Ip-0"], "isController": false}, {"data": [0.88, 500, 1500, "Ids-0"], "isController": false}, {"data": [0.59, 500, 1500, "Ip-1"], "isController": false}, {"data": [0.0, 500, 1500, "Index"], "isController": false}, {"data": [0.35, 500, 1500, "Challenges-1"], "isController": false}, {"data": [0.74, 500, 1500, "Cisco-1"], "isController": false}, {"data": [0.71, 500, 1500, "Challenges-0"], "isController": false}, {"data": [0.9, 500, 1500, "Cisco-0"], "isController": false}, {"data": [0.71, 500, 1500, "Ids-1"], "isController": false}, {"data": [0.86, 500, 1500, "Magic-0"], "isController": false}, {"data": [0.72, 500, 1500, "Fun-1"], "isController": false}, {"data": [0.81, 500, 1500, "About-1"], "isController": false}, {"data": [0.66, 500, 1500, "Magic-1"], "isController": false}, {"data": [0.83, 500, 1500, "Fun-0"], "isController": false}, {"data": [0.94, 500, 1500, "About-0"], "isController": false}, {"data": [0.9, 500, 1500, "Cyberdata-0"], "isController": false}, {"data": [0.71, 500, 1500, "Cyberdata-1"], "isController": false}, {"data": [0.21, 500, 1500, "Challenges"], "isController": false}, {"data": [0.61, 500, 1500, "Index-0"], "isController": false}, {"data": [0.62, 500, 1500, "Ids"], "isController": false}, {"data": [0.02, 500, 1500, "Index-1"], "isController": false}, {"data": [0.28, 500, 1500, "Home"], "isController": false}, {"data": [0.58, 500, 1500, "Subjects"], "isController": false}, {"data": [0.6, 500, 1500, "Fun"], "isController": false}, {"data": [0.62, 500, 1500, "Forensics"], "isController": false}, {"data": [0.09, 500, 1500, "Blogs"], "isController": false}, {"data": [0.11, 500, 1500, "Blogs-1"], "isController": false}, {"data": [0.77, 500, 1500, "Blogs-0"], "isController": false}, {"data": [0.5, 500, 1500, "Magic"], "isController": false}, {"data": [0.86, 500, 1500, "Forensics-0"], "isController": false}, {"data": [0.78, 500, 1500, "Subjects-1"], "isController": false}, {"data": [0.58, 500, 1500, "Cyberdata"], "isController": false}, {"data": [0.93, 500, 1500, "Subjects-0"], "isController": false}, {"data": [0.78, 500, 1500, "Forensics-1"], "isController": false}, {"data": [0.65, 500, 1500, "About"], "isController": false}, {"data": [0.58, 500, 1500, "Cisco"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1850, 0, 0.0, 4118.399459459459, 57, 124269, 529.0, 5326.500000000002, 25449.399999999907, 78363.22, 14.33230812138303, 1526.269137081264, 2.3177272978176156], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Ip", 50, 0, 0.0, 1686.9799999999993, 177, 10383, 1075.5, 3687.399999999999, 4890.0, 10383.0, 0.5071816927696178, 9.913559597652762, 0.11986129848656983], "isController": false}, {"data": ["Ip-0", 50, 0, 0.0, 627.3000000000002, 60, 5658, 418.0, 1362.6999999999996, 2415.849999999994, 5658.0, 0.5077637070812727, 0.513753732063247, 0.05999942241878319], "isController": false}, {"data": ["Ids-0", 50, 0, 0.0, 367.9000000000001, 58, 2041, 345.5, 546.0, 804.7999999999988, 2041.0, 0.5289661884812323, 0.5363944441358808, 0.06302136229952181], "isController": false}, {"data": ["Ip-1", 50, 0, 0.0, 1059.46, 113, 4725, 603.5, 2710.1, 3668.2999999999956, 4725.0, 0.5144773938633137, 9.535617430751342, 0.060792738923301705], "isController": false}, {"data": ["Index", 50, 0, 0.0, 46441.85999999998, 1524, 124269, 43964.5, 82462.3, 95074.39999999998, 124269.0, 0.3981462311477759, 438.9947047173361, 0.096426040356102], "isController": false}, {"data": ["Challenges-1", 50, 0, 0.0, 1917.5399999999997, 124, 6916, 1538.5, 3543.2999999999997, 5934.349999999994, 6916.0, 0.4520632165201982, 11.511869272924125, 0.05694937004990778], "isController": false}, {"data": ["Cisco-1", 50, 0, 0.0, 720.7999999999998, 117, 4889, 398.0, 2412.7999999999997, 3561.599999999993, 4889.0, 0.5574633189136154, 10.366052191109576, 0.06750532377469563], "isController": false}, {"data": ["Challenges-0", 50, 0, 0.0, 586.6800000000001, 61, 2815, 501.5, 1033.4, 1747.799999999998, 2815.0, 0.45079565432989227, 0.4589046933462561, 0.056789686922418064], "isController": false}, {"data": ["Cisco-0", 50, 0, 0.0, 331.1199999999999, 59, 1034, 367.5, 546.5, 672.9999999999991, 1034.0, 0.5551176294256752, 0.564973135776221, 0.06722127543826537], "isController": false}, {"data": ["Ids-1", 50, 0, 0.0, 911.7600000000002, 104, 7583, 493.0, 2528.8999999999983, 6552.049999999994, 7583.0, 0.530875732608511, 5.373727391329738, 0.06324886658031088], "isController": false}, {"data": ["Magic-0", 50, 0, 0.0, 391.28000000000003, 60, 1563, 377.5, 570.3, 993.0999999999996, 1563.0, 0.5334926698107167, 0.5422869630396279, 0.0646026279848915], "isController": false}, {"data": ["Fun-1", 50, 0, 0.0, 654.9, 124, 4214, 487.0, 1583.3, 3056.9499999999966, 4214.0, 0.5927893108231472, 15.038879568923614, 0.07062528898478904], "isController": false}, {"data": ["About-1", 50, 0, 0.0, 604.4000000000001, 103, 4851, 373.0, 1529.8, 2678.4999999999995, 4851.0, 0.6040179272520809, 6.031260570313727, 0.07609210216359222], "isController": false}, {"data": ["Magic-1", 50, 0, 0.0, 971.6599999999999, 124, 10270, 530.0, 2388.3999999999996, 3567.7999999999947, 10270.0, 0.5354580307995459, 15.129366660241171, 0.06484062091713251], "isController": false}, {"data": ["Fun-0", 50, 0, 0.0, 423.04, 59, 2520, 327.5, 552.1, 1780.9999999999964, 2520.0, 0.5839961689851315, 0.5927789238702594, 0.06957766857049417], "isController": false}, {"data": ["About-0", 50, 0, 0.0, 318.9200000000002, 59, 1837, 255.5, 504.79999999999995, 960.1999999999961, 1837.0, 0.601084356178546, 0.6146439739790581, 0.07572254096389887], "isController": false}, {"data": ["Cyberdata-0", 50, 0, 0.0, 356.82, 58, 2003, 306.5, 530.3, 1116.299999999998, 2003.0, 0.5639712600245891, 0.5758565137270605, 0.07049640750307365], "isController": false}, {"data": ["Cyberdata-1", 50, 0, 0.0, 760.56, 106, 4406, 457.0, 2758.7, 2896.45, 4406.0, 0.5660590965696819, 6.796987769585645, 0.07075738707121024], "isController": false}, {"data": ["Challenges", 50, 0, 0.0, 2504.4199999999996, 191, 7390, 2105.0, 4919.8, 6795.099999999996, 7390.0, 0.44980208708168407, 11.912182467839152, 0.11332904147175243], "isController": false}, {"data": ["Index-0", 50, 0, 0.0, 1294.3800000000003, 115, 22420, 613.5, 2366.4, 3410.2499999999973, 22420.0, 0.46117803316792416, 0.46588889471766676, 0.05584577745392831], "isController": false}, {"data": ["Ids", 50, 0, 0.0, 1279.74, 168, 8072, 902.0, 3392.2999999999997, 7046.199999999993, 8072.0, 0.5283736658564937, 5.88419411457783, 0.12590153756736766], "isController": false}, {"data": ["Index-1", 50, 0, 0.0, 45147.24, 1398, 124018, 41573.0, 81870.9, 94569.34999999998, 124018.0, 0.4005158644333902, 441.20284739244147, 0.04849996795873084], "isController": false}, {"data": ["Home", 50, 0, 0.0, 10971.279999999999, 603, 108339, 1232.5, 46156.29999999996, 93834.29999999994, 108339.0, 0.4591536879224214, 21.205645395032874, 0.05335868053004702], "isController": false}, {"data": ["Subjects", 50, 0, 0.0, 1028.2199999999998, 180, 4307, 723.0, 3216.499999999999, 4055.099999999999, 4307.0, 0.5951318216985063, 14.58979609295959, 0.14762058858537166], "isController": false}, {"data": ["Fun", 50, 0, 0.0, 1077.9600000000005, 184, 6734, 811.0, 2458.7999999999993, 3573.5499999999965, 6734.0, 0.5831515844228549, 15.386295099485661, 0.13895408847575838], "isController": false}, {"data": ["Forensics", 50, 0, 0.0, 886.6800000000001, 170, 2955, 721.0, 2363.2999999999993, 2682.95, 2955.0, 0.5448225512950432, 6.533795087471261, 0.1362056378237608], "isController": false}, {"data": ["Blogs", 50, 0, 0.0, 11343.560000000001, 795, 44790, 8247.5, 26880.3, 32947.29999999997, 44790.0, 0.4573895861539024, 297.9550290270866, 0.11077404039664825], "isController": false}, {"data": ["Blogs-1", 50, 0, 0.0, 10780.66, 727, 44274, 7654.5, 26409.699999999997, 32179.199999999968, 44274.0, 0.4593941509936696, 298.7947561162589, 0.055629760471889673], "isController": false}, {"data": ["Blogs-0", 50, 0, 0.0, 562.8400000000001, 57, 3299, 468.0, 1445.2999999999995, 1666.0499999999993, 3299.0, 0.4605790399690491, 0.46729881619672253, 0.055773243121252036], "isController": false}, {"data": ["Magic", 50, 0, 0.0, 1362.9999999999995, 193, 10788, 936.0, 2902.4, 4019.099999999995, 10788.0, 0.5327536973106594, 15.594491526552444, 0.1290262860674253], "isController": false}, {"data": ["Forensics-0", 50, 0, 0.0, 336.99999999999994, 59, 937, 354.0, 533.4, 685.449999999999, 937.0, 0.5455596896856485, 0.5558954884941462, 0.06819496121070606], "isController": false}, {"data": ["Subjects-1", 50, 0, 0.0, 663.28, 117, 3374, 377.0, 2016.4999999999998, 3034.999999999999, 3374.0, 0.5977214856965248, 14.043221147236734, 0.07413147332369009], "isController": false}, {"data": ["Cyberdata", 50, 0, 0.0, 1117.4800000000005, 166, 4891, 744.0, 3251.4, 3362.5499999999997, 4891.0, 0.5629996622002027, 7.335115872367976, 0.14074991555005067], "isController": false}, {"data": ["Subjects-0", 50, 0, 0.0, 364.84, 57, 3255, 297.0, 550.7, 1129.0999999999974, 3255.0, 0.5959972822523929, 0.6083013667707675, 0.07391763168559952], "isController": false}, {"data": ["Forensics-1", 50, 0, 0.0, 549.6399999999999, 105, 2537, 391.0, 1589.7999999999997, 2149.599999999999, 2537.0, 0.5476211337947954, 6.009361155453211, 0.06845264172434942], "isController": false}, {"data": ["About", 50, 0, 0.0, 923.4200000000002, 164, 5329, 707.5, 2746.799999999999, 3758.4999999999964, 5329.0, 0.6003121623244086, 6.608111999489735, 0.15125052527314203], "isController": false}, {"data": ["Cisco", 50, 0, 0.0, 1052.1600000000005, 181, 5304, 752.5, 2874.4999999999995, 4067.999999999993, 5304.0, 0.5543606004834024, 10.872559687312902, 0.13425920792957402], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1850, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
