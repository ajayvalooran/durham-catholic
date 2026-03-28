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
    const tableBody = document.getElementById('table-body');
    
    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No results found</td></tr>';
        return;
    }

    tableBody.innerHTML = data.map(p => `
        <tr>
            <td><strong>${p.Name || 'N/A'}</strong></td>
            <td>${p.City || 'Durham'}</td>
            <td>${p.Sunday_Mass || 'See Bulletin'}</td>
            <td>${p.Good_Friday || 'TBD'}</td>
            <td style="background-color: #fff9c4; font-weight: bold; color: #d35400;">
                ${p.Easter_Sunday || 'TBD'}
            </td>
            <td>
                <div class="table-actions">
                    <a href="${p.Website || '#'}" target="_blank" title="Bulletin">🔗</a>
                    <a href="${p.Directions_Link || '#'}" target="_blank" title="Directions">📍</a>
                </div>
            </td>
        </tr>
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
