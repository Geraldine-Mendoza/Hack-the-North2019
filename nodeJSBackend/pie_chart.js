const github_api = require('./interface');

exports.piechart = function (username) {

    return new Promise((resolve, reject) => {
        github_api.get(`/users/${username}/repos`)
            .then(response => {

                let json = JSON.parse(response);
                let promises = [];

                for (let repo in json) {
                    promises.push(github_api.get(`/repos/${username}/${json[repo]["name"]}/languages`))
                }

                Promise.all(promises).then(values => { 
                    var total = new Proxy({}, {
                        get: (target, name) => name in target ? target[name] : 0
                    })

                    for(let i in values){
                        let json = JSON.parse(values[i]);
                        for(let j in json){
                            total[j] += json[j]
                        }
                    }

                    console.log(total)
                    resolve(total)
                  });
            })
            .catch(function name(err) {
                console.error(err.message);
            })
    });
}