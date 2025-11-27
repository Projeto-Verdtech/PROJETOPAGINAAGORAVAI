async function buscarClima() {
    let cidade = document.getElementById("cidade").value.trim();
    if (!cidade) {
        document.getElementById("temperatura").innerText = "❌ Digite uma cidade!";
        return;
    }

    document.getElementById("temperatura").innerText = "🔄 Carregando...";

    try {
        const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`;
        let geoResp = await fetch(geoURL);
        let geoData = await geoResp.json();

        if (!geoData.results || geoData.results.length === 0) {
            document.getElementById("temperatura").innerText = "❌ Cidade não encontrada!";
            return;
        }

        let lat = geoData.results[0].latitude;
        let lon = geoData.results[0].longitude;

        const climaURL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m&timezone=America/Sao_Paulo`;
        let climaResp = await fetch(climaURL);
        let climaData = await climaResp.json();

        let temperatura = climaData.current_weather.temperature;
        let vento = climaData.current_weather.windspeed;
        let horaAtual = climaData.current_weather.time;
        let indexHora = climaData.hourly.time.findIndex(time => time === horaAtual);
        let umidade = climaData.hourly.relativehumidity_2m[indexHora];

        document.getElementById("temperatura").innerHTML = `🌡️ ${temperatura}°C`;
        document.getElementById("umidade").innerHTML = `💧 ${umidade}% `;
        document.getElementById("vento").innerHTML = `💨 ${vento} km/h`;

    } catch (erro) {
        document.getElementById("temperatura").innerText = "❌ Erro de conexão!";
        console.error(erro);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('cidade').value = 'São Paulo';
    document.getElementById('cidade').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') buscarClima();
    });
});
