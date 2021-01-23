// start is my starting point
var fs = require('fs');
var figlet = require('figlet');
var inquirer = require('inquirer');
var child_process = require('child_process');
var chalk = require('chalk');

var appName = 'SLT Framework !';

var loading = {};

start();

function start() {
    // clear console
    console.clear();

    // show logo 
    figlet(appName, function (error, data) {
        if (error) {
            console.log(error.message);
            return;
        }
        console.log(chalk.blue(data));

        showMenu();
    });
}

function showMenu() {

    var q = [
        {
            type: 'list',
            name: 'framework',
            message: 'Select Test Framework : ',
            choices: [
                'Artillery',
                'Siege',
                'Bench-rest',
                'Load-test'
            ]
        },
        {
            type: 'list',
            name: 'testType',
            message: 'Select Test Type : ',
            choices: [
                'quick',
                'custom'
            ]
        },
        {
            type: 'input',
            name: 'targetUrl',
            message: 'Enter Target URL (http://...) \n'
        },
        {
            type: 'list',
            name: 'accept',
            message: 'Start Load/Stress Test ?',
            choices: [
                'yes',
                'no - start over',
            ]
        }
    ];

    inquirer.prompt(q).then(function (answers) {
        // Use user feedback for... whatever!!
        if (!answers.targetUrl.startsWith('http://')) {
            answers.targetUrl = 'http://' + answers.targetUrl;
        }

        if (answers.accept == 'yes') {
            startLoadTest(answers);
        }
        else {
            startOrExit();
        }
    });
}

function startOrExit() {
    var q = [
        {
            type: 'list',
            name: 'startOrExit',
            message: 'What do you want to do ?',
            choices: [
                'exit application',
                'start a new test',
            ]
        }
    ];

    inquirer.prompt(q).then(function (answers) {
        //console.log(answers);

        if (answers.startOrExit == 'start a new test') {
            start();
        }
        else {
            figlet('Bye Bye', function (error, data) {
                if (error) {
                    // todo : handle error 
                }
                else {
                    console.log(chalk.blue(data));
                }
            });
        }
    });

}

function showInfo(answers) {
    console.log(chalk.yellow(' framework: ' + answers.framework + '\n address: ' + answers.targetUrl));
}

function endTest() {
    console.log(chalk.green('Test is finished.'));
}

function startLoadTest(answers) {

    if (answers.framework == 'Artillery') {
        startArtilleryTest(answers);
    }

    if (answers.framework == 'Siege') {
        startSiegeTest(answers);
    }

    if (answers.framework == 'Bench-rest') {
        startBenchRestTest(answers);
    }

    if (answers.framework == 'Load-test') {
        startLoadtestTest(answers);
    }
}

function start_loader() {
    loading = setInterval(function () {
        console.log(chalk.red('testing ... please wait ...'));
    }, 2000);
}

function stop_loader() {
    clearInterval(loading);
}

// save any data sent to this function in a file (append at the end of the file)
function save_test_result(result) {
    fs.appendFileSync('./test_result.txt', result, { encoding: 'utf8' });
}



function startArtilleryTest(answers) {

    showInfo(answers);

    var generalTargetUrl = answers.targetUrl;

    if (answers.testType == 'quick') {

        start_loader();

        var quickCommand = "artillery quick --count 10 -n 20 " + generalTargetUrl;

        child_process.exec(quickCommand, function (error, stdout, stderr) {
            if (error) {
                stop_loader();
                console.log(chalk.red(stderr));
            }
            else {
                endTest();
                save_test_result(stdout); // save result 
                save_artillery_temp(stdout); // save artillary temp report 
                process_artillary_temp_file();
                stop_loader();
                startOrExit();
            }
        });
    }

    if (answers.testType == 'custom') {

        var q = [
            {
                type: 'input',
                name: 'virtualUsers',
                message: 'Enter the number of virtual users \n'
            },
            {
                type: 'input',
                name: "userRequests",
                message: "Enter the number of each user's requests \n"
            }
        ];

        inquirer.prompt(q).then(function (answers) {

            start_loader();

            var customCommand = 'artillery quick --count ' + answers.virtualUsers + ' -n ' + answers.userRequests + ' ' + generalTargetUrl;

            child_process.exec(customCommand, function (error, stdout, stderr) {

                if (error) {
                    stop_loader();
                    console.log(chalk.red(stderr));
                }
                else {
                    endTest();
                    save_test_result(stdout);
                    save_artillery_temp(stdout);
                    process_artillary_temp_file();
                    stop_loader();
                    startOrExit();
                }
            });

        });
    }
}

function startSiegeTest(answers) {
    showInfo(answers);
    var generalTargetUrl = answers.targetUrl;
    // test only 
    // TODO : REMOVER NEXT LIN AFTER TEST 

    //generalTargetUrl = 'http://localhost/phpproject/page1.php';

    if (answers.testType == 'quick') {
        start_loader();

        var quickCommand = "siegem -c 100 -d0 -r 100 " + generalTargetUrl + ' > sig_tmp.txt';

        child_process.exec(quickCommand, function (error, stdout, stderr) {
            if (error) {
                stop_loader();
                console.log(chalk.red(stderr));
            }
            else {
                endTest();
                save_test_result(stdout);
                process_siege_temp_file();
                stop_loader();
                startOrExit();
            }
        });
    }

    if (answers.testType == 'custom') {

        var q = [
            {
                type: 'input',
                name: 'concurrent',
                message: 'Enter the number of concurrect users \n'
            },
            {
                type: 'input',
                name: 'requests',
                message: 'Enter the number of each user requests \n'
            }
        ];

        inquirer.prompt(q).then(function (answers) {
            start_loader();

            var customCommand = 'siegem -c ' + answers.concurrent + ' -d0 -r ' + answers.requests + ' ' + generalTargetUrl;

            child_process.exec(customCommand, function (error, stdout, stderr) {
                if (error) {
                    stop_loader();
                    console.log(chalk.red(stderr));
                }
                else {
                    endTest();
                    save_test_result(stdout);
                    process_siege_temp_file();
                    stop_loader();
                    startOrExit();
                }
            });

        });
    }
}

function startBenchRestTest(answers) {

    showInfo(answers);

    var generalTargetUrl = answers.targetUrl;

    // TODO : REMOVE AFTER TEST 
    generalTargetUrl = 'http://localhost/phpproject/page1.php';

    if (answers.testType == 'quick') {
        var quickCommand = "bench-rest -n 1000 -c 50 " + generalTargetUrl + ' > ben_tmp.txt';

        quickCommand = 'autocannon -c 100 -d 5 -p 10 http://localhost/phpproject/page1/ 1>atc_temp.txt 2>&1';
        child_process.exec(quickCommand, function (error, stdout, stderr) {
            if (error) {
                console.log(chalk.red(stderr));
            }
            else {
                endTest();
                console.log(chalk.blue(stdout));
                startOrExit();
            }
        });
    }

    if (answers.testType == 'custom') {

        var q = [
            {
                type: 'input',
                name: 'iterations',
                message: 'Enter the number of virtual users \n'
            },
            {
                type: 'input',
                name: "concurrentConnections",
                message: "Enter the number of each user's requests \n"
            }
        ];

        inquirer.prompt(q).then(function (answers) {

            var customCommand = 'bench-rest -n ' + answers.iterations + ' ' + '-c ' + answers.concurrentConnections + ' ' + generalTargetUrl;
            child_process.exec(customCommand, function (error, stdout, stderr) {
                if (error) {
                    console.log(chalk.red(stderr));
                }
                else {
                    endTest();
                    console.log(chalk.blue(stdout));
                    startOrExit();
                }
            });

        });
    }
    endTest();
}

function startLoadtestTest(answers) {

    showInfo(answers);

    var generalTargetUrl = answers.targetUrl;

    if (answers.testType == 'quick') {
        var quickCommand = "loadtest -t 60 -c 10 --rps 200 " + generalTargetUrl;

        child_process.exec(quickCommand, function (error, stdout, stderr) {

            if (error) {
                console.log(chalk.red(stderr));
            }
            else {
                endTest();
                console.log(chalk.blue(stdout));
                startOrExit();
            }
        });
    }

    if (answers.testType == 'custom') {

        var q = [
            {
                type: 'input',
                name: 'concurrency',
                message: 'Enter the number of virtual users \n'
            },
            {
                type: 'input',
                name: "requestsPerSecond",
                message: "Enter the number of each user's requests \n"
            }
        ];

        inquirer.prompt(q).then(function (answers) {

            var customCommand = 'artillery quick -c ' + answers.concurrency + ' --rps ' + answers.requestsPerSecond + ' ' + generalTargetUrl;

            child_process.exec(customCommand, function (error, stdout, stderr) {
                if (error) {
                    console.log(chalk.red(stderr));
                }
                else {
                    endTest();
                    console.log(chalk.blue(stdout));
                    startOrExit();
                }
            });

        });
    }
}



function save_artillery_temp(result) {
    fs.writeFileSync('./art_tmp.txt', result, { encoding: 'utf8' });
}

function process_artillary_temp_file() {
    // find Summary report in ./art_tmp.txt
    // save from Summary report to end of file in a report file (rpt.html)
    var fileData = fs.readFileSync('./art_tmp.txt', { encoding: 'utf8' });
    // console.log(fileData);
    // console.log(fileData.toString());
    var arrData = fileData.split('\n');
    // console.log(arrData.length);

    var savetherest = false;
    for (i in arrData) {

        if (arrData[i].substring(0, 14) == 'Summary report') {
            savetherest = true
        }

        if (savetherest == true) {
            console.log(chalk.yellow(arrData[i]));
            fs.appendFileSync('./art_rpt.html', arrData[i] + '<br>', { encoding: 'utf8' });
        }
    }
    fs.appendFileSync('./art_rpt.html', '<hr>', { encoding: 'utf8' });

}

function process_siege_temp_file() {
    var fileData = fs.readFileSync('./sig_tmp.txt', { encoding: 'utf8' });
    var arrData = fileData.split('\n');
    var savetherest = false;
    for (i in arrData) {

        if (arrData[i].substring(0, 27) == 'Lifting the server siege...') {
            savetherest = true
        }

        if (savetherest == true) {
            console.log(chalk.yellow(arrData[i]));
            fs.appendFileSync('./www/views/sig_rpt.html', arrData[i] + '<br>', { encoding: 'utf8' });
        }
    }
    fs.appendFileSync('./www/views/sig_rpt.html', '<hr>', { encoding: 'utf8' });
}

function process_benchRest_temp_file() {
    var fileData = fs.readFileSync('./bench_tmp.txt', { encoding: 'utf8' });
    var arrData = fileData.split('\n');
    var savetherest = false;
    for (i in arrData) {

        if (arrData[i].substring(0, 27) == 'Lifting the server siege...') {
            savetherest = true
        }

        if (savetherest == true) {
            console.log(chalk.yellow(arrData[i]));
            fs.appendFileSync('./bench_rpt.html', arrData[i] + '<br>', { encoding: 'utf8' });
        }
    }
    fs.appendFileSync('./bench_rpt.html', '<hr>', { encoding: 'utf8' });
}

function process_loadTest_tmp_file() {
    var fileData = fs.readFileSync('./load_tmp.txt', { encoding: 'utf8' });
    var arrData = fileData.split('\n');
    var savetherest = false;
    for (i in arrData) {

        if (arrData[i].substring(0, 27) == 'Lifting the server siege...') {
            savetherest = true
        }

        if (savetherest == true) {
            console.log(chalk.yellow(arrData[i]));
            fs.appendFileSync('./load_rpt.html', arrData[i] + '<br>', { encoding: 'utf8' });
        }
    }
    fs.appendFileSync('./load_rpt.html', '<hr>', { encoding: 'utf8' });
}





// ab command : 
/*

c:/xampp/apache/bin/ab.exe -k -c 200 -n 50000 http://localhost/phpproject/page1.php 1>ab_temp.txt 2>&1

 */