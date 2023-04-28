function get_percentages_by_age_range(range, data) {
    let percentage = data.filter((item) => {
        return item["Rango de edad:"] == range;
    }).length;

    return (percentage / data.length) * 100;
}

function get_genre_by_age_range(range_str, genre_str) {
    const questions = {
        rock: "¿Qué tanto te gusta el Rock?",
        pop: "¿Qué tanto te gusta el Pop?",
        musica_clasica: "¿Qué tanto te gusta la Música Clásica?",
        musica_electronica: "¿Qué tanto te gusta la Música Electrónica?",
        reggaeton: "¿Qué tanto te gusta el Reggaetón?",
        cumbia: "¿Qué tanto te gusta la Cumbia?",
        hip_hop: "¿Qué tanto te gusta el Hip Hop?",
        funk_de_brasil: "¿Qué tanto te gusta el Funk de Brasil?",
    };

    return data.filter((item) => {
        return range_str == "All" ? item["Rango de edad:"] != undefined : item["Rango de edad:"] == range_str;
    }).map((item) => {
        return item[questions[genre_str]];
    });
}

function get_genre_stats(genre_data) {
    return [
        ss.mean(genre_data),
        ss.median(genre_data),
        ss.mode(genre_data),
        ss.variance(genre_data),
        ss.standardDeviation(genre_data),
    ];
}


function update_graph(data, dataset_id, chart) {
    let dataset = chart.data.datasets[dataset_id];
    dataset.data = data;
    chart.update();
}