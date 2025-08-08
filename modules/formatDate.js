const moment = require('moment');

function formatDate(createdAt) {
    let date = moment(createdAt);
    let now = moment();
    let duration = moment.duration(now.diff(date));

    //formatage du temps
    let timeAgo = '';   
    if (duration.asDays() >= 15) {
        timeAgo = date.format('DD/MM/YYYY');
    } else if (duration.asDays() >= 1 && duration.asDays() < 15) {
        // Si + d'un jour, afficher en jours
        timeAgo = `il y a ${Math.floor(duration.asDays())}j`;
    } else if (duration.asHours() >= 1) { 
        // Si + d'une heure, afficher en heures
        timeAgo = `il y a ${Math.floor(duration.asHours())}h`;
    } else { 
        // Sinon afficher les minutes
        timeAgo = `il y a ${Math.floor(duration.asMinutes())}min`;
    }
    return timeAgo;
};

module.exports = {formatDate};