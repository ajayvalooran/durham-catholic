<script>
const API_URL = "https://api.steinhq.com/v1/storages/69c84be8affba40a626b1505/Sheet1";
let parishData = [];

async function loadData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Safety check: if data is empty, show a message
        if (!data || data.length === 0) {
            document.getElementById('loader').innerText = "No data found in Google Sheet.";
            return;
        }

        parishData = data;
        document.getElementById('loader').style.display = 'none';
        document.getElementById('status').innerText = "● LIVE UPDATED: " + new Date().toLocaleTimeString();
        render(parishData);
    } catch (err) {
        console.error("API Error:", err);
        document.getElementById('loader').innerText = "Connection Error. Check Sheet Permissions.";
    }
}

function render(data) {
    const list = document.getElementById('parish-list');
    // Using loose matching to handle potential header typos in Google Sheets
    list.innerHTML = data.map(p => `
        <div class="card">
            <div class="city">${p.City || p.city || 'Durham Region'}</div>
            <div class="name">${p.Name || p.name || p.Parish || 'Catholic Parish'}</div>
            <div class="time-row"><span class="label">Sunday</span><span class="val">${p.Sunday_Mass || p.Sunday || 'See Website'}</span></div>
            <div class="time-row"><span class="label">Good Friday</span><span class="val">${p.Good_Friday || '3:00 PM'}</span></div>
            <div class="easter-row">
                <div class="time-row" style="border:0; margin:0;">
                    <span class="label">Easter Sunday</span>
                    <span class="val" style="color:#d35400">${p.Easter_Sunday || 'TBD'}</span>
                </div>
            </div>
            <div class="actions">
                <a href="${p.Website || '#'}" target="_blank" class="btn btn-web">Bulletin</a>
                <a href="${p.Directions_Link || p.Directions || '#'}" target="_blank" class="btn btn-nav">Directions</a>
            </div>
        </div>
    `).join('');
}

function filter() {
    const query = document.getElementById('search').value.toLowerCase();
    const time = document.getElementById('timeFilter').value;
    const filtered = parishData.filter(p => {
        const name = (p.Name || p.name || "").toLowerCase();
        const city = (p.City || p.city || "").toLowerCase();
        const mass = (p.Sunday_Mass || p.Sunday || "").toUpperCase();
        
        const matchesText = name.includes(query) || city.includes(query);
        let matchesTime = true;
        if (time === 'morning') matchesTime = mass.includes('AM');
        if (time === 'evening') matchesTime = mass.includes('PM') && (mass.includes('5') || mass.includes('6') || mass.includes('7'));
        return matchesText && matchesTime;
    });
    render(filtered);
}

loadData();
setInterval(loadData, 300000); // Auto-refresh every 5 mins
</script>
